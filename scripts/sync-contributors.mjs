import { execSync } from "node:child_process";
import fs from "node:fs";

const REPOS = [
  {
    id: "backend-int",
    repoName: "Back-end-integration",
    shortName: "Backend-Int",
    displayName: "Backend Integration Core",
    defaultBranch: "main",
    description: "API Gateway, arsitektur modular monolith, autentikasi terpusat & orkestrasi database.",
    githubUrl: "https://github.com/TUBES-CA-25/Back-end-integration",
  },
  {
    id: "iclabs-app",
    repoName: "ICLABS-APP",
    shortName: "ICLABS-APP",
    displayName: "ICLABS Mobile & PWA App",
    defaultBranch: "main",
    description: "Aplikasi mobile multiplatform Flutter (Android, iOS) & Progressive Web App (PWA) untuk monitoring asisten, presensi QR-TV & logbook.",
    githubUrl: "https://github.com/TUBES-CA-25/ICLABS-APP",
  },
  {
    id: "praktikum",
    repoName: "Iclabs-Praktikum",
    shortName: "Praktikum",
    displayName: "Iclabs Praktikum",
    defaultBranch: "main",
    description: "Manajemen frekuensi jadwal, presensi praktikan, modul penugasan & penilaian asisten.",
    githubUrl: "https://github.com/TUBES-CA-25/Iclabs-Praktikum",
  },
  {
    id: "inventaris",
    repoName: "Inventaris_Lab",
    shortName: "Inventaris_Lab",
    displayName: "Inventaris Laboratorium",
    defaultBranch: "production",
    description: "Manajemen aset laboratorium komputer, tracking peralatan, logistik & pelaporan barang.",
    githubUrl: "https://github.com/TUBES-CA-25/Inventaris_Lab",
  },
  {
    id: "mon-asisten",
    repoName: "Monitoring-Asisten",
    shortName: "Mon-Asisten",
    displayName: "Monitoring Asisten",
    defaultBranch: "production",
    description: "Presensi harian, logbook kegiatan, perizinan, dan pemantauan kinerja asisten laboratorium.",
    githubUrl: "https://github.com/TUBES-CA-25/Monitoring-Asisten",
  },
  {
    id: "peminjaman",
    repoName: "Sistem-Peminjaman-Lab",
    shortName: "Peminjaman",
    displayName: "Peminjaman Laboratorium",
    defaultBranch: "production",
    description: "Reservasi ruang lab, deteksi konflik jadwal, alur persetujuan surat & administrasi.",
    githubUrl: "https://github.com/TUBES-CA-25/Sistem-Peminjaman-Lab",
  },
  {
    id: "pendaftaran",
    repoName: "Sistem-Pendaftaran-Calon-Asisten",
    shortName: "Pendaftaran",
    displayName: "Pendaftaran Calon Asisten",
    defaultBranch: "main",
    description: "Portal seleksi rekrutmen asisten baru, unggah berkas, verifikasi nilai & ujian riset.",
    githubUrl: "https://github.com/TUBES-CA-25/Sistem-Pendaftaran-Calon-Asisten",
  },
  {
    id: "sumberdaya-k2",
    repoName: "SistemInformasiSumberDaya-Kelompok2",
    shortName: "SumberDaya-K2",
    displayName: "Sumber Daya Laboratorium",
    defaultBranch: "production",
    description: "Direktori fasilitas, profil laboratorium, inventarisasi ruangan & informasi publik.",
    githubUrl: "https://github.com/TUBES-CA-25/SistemInformasiSumberDaya-Kelompok2",
  },
];

const MEMBERS = [
  { memberId: "ichwal", username: "ichwalM" },
  { memberId: "andi-rifqi", username: "AndiRRahman" },
  { memberId: "fatwa", username: "fattsowavy" },
  { memberId: "rizwan", username: "lastWannn" },
  { memberId: "ikhlas", username: "ikhlaass" },
  { memberId: "aan", username: "AmsStudy" },
  { memberId: "fuad", username: "muhammadfuad249" },
  { memberId: "andi-ahsan", username: "aahzr" },
  { memberId: "zaki", username: "zakifalihin" },
  { memberId: "halima", username: "stnurhalimaa" },
  { memberId: "siti-safira", username: "SitiSafiraTawetubun13020230217" },
  { memberId: "farah", username: "tsabitaputriii" },
  { memberId: "wanwan", username: "hendrawanwawan" },
  { memberId: "rafly", username: "appyx123" },
  { memberId: "raihan", username: "gingerlyi" },
  { memberId: "nahwa", username: "NahwaKakaa" },
  { memberId: "daifan", username: "La-Ode-Dhaifan-full-stack" },
  { memberId: "firly", username: "FIRLIANASTASYAHAFID13020230241" },
  { memberId: "sitti-lutfia", username: "Fistack" },
  { memberId: "thalita", username: "thalitashrl" },
  { memberId: "rizqi", username: "rizqianandajalil" },
  { memberId: "scania", username: "Justrifkyy" },
];

const LOGIN_TO_MEMBER = new Map(
  MEMBERS.map((m) => [m.username.toLowerCase(), m.memberId])
);

function ghJson(endpoint) {
  const out = execSync(`gh api "${endpoint}" --paginate`, {
    maxBuffer: 25 * 1024 * 1024,
    encoding: "utf8",
  }).trim();
  if (!out) return [];
  try {
    return JSON.parse(out);
  } catch {
    return JSON.parse(`[${out.replace(/\]\s*\[/g, ",")}]`).flat();
  }
}

const repoStats = [];
const memberMap = Object.fromEntries(
  MEMBERS.map((m) => [
    m.memberId,
    {
      memberId: m.memberId,
      username: m.username,
      commits: 0,
      prs: 0,
      issues: 0,
      repoMap: {},
    },
  ])
);

let grandCommits = 0;
let grandPRs = 0;

for (const repo of REPOS) {
  const contributors = ghJson(`repos/TUBES-CA-25/${repo.repoName}/contributors?per_page=100`);
  const prs = ghJson(`repos/TUBES-CA-25/${repo.repoName}/pulls?state=all&per_page=100`);

  let repoCommitCount = 0;
  for (const c of contributors) {
    const mid = c.login ? LOGIN_TO_MEMBER.get(c.login.toLowerCase()) : null;
    if (mid) {
      repoCommitCount += c.contributions;
      memberMap[mid].commits += c.contributions;
      memberMap[mid].repoMap[repo.repoName] = (memberMap[mid].repoMap[repo.repoName] || 0) + c.contributions;
    }
  }

  for (const pr of prs) {
    grandPRs++;
    const mid = pr.user?.login ? LOGIN_TO_MEMBER.get(pr.user.login.toLowerCase()) : null;
    if (mid) {
      memberMap[mid].prs++;
    }
  }

  grandCommits += repoCommitCount;
  repoStats.push({
    ...repo,
    totalCommits: repoCommitCount,
  });
}

const sorted = Object.values(memberMap).sort(
  (a, b) => b.commits - a.commits || b.prs - a.prs
);

const contributions = {};
sorted.forEach((m, idx) => {
  const breakdown = Object.entries(m.repoMap)
    .map(([repoName, commits]) => {
      const r = REPOS.find((x) => x.repoName === repoName);
      return {
        repo: repoName,
        shortName: r.shortName,
        branch: r.defaultBranch,
        commits,
      };
    })
    .sort((a, b) => b.commits - a.commits);

  contributions[m.memberId] = {
    memberId: m.memberId,
    username: m.username,
    commits: m.commits,
    prs: m.prs,
    issues: 0,
    repoCount: breakdown.length,
    rank: idx + 1,
    topRepo: breakdown[0]?.repo || null,
    breakdown,
  };
});

const activeCount = Object.values(contributions).filter((c) => c.commits > 0 || c.prs > 0).length;
const today = new Date().toLocaleDateString("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const outContent = `/**
 * =============================================================================
 * ICLABS DEVELOPER COLLECTIVE — REKAP KONTRIBUTOR RESMI (${REPOS.length} REPOSITORI)
 * =============================================================================
 * Sumber Data: GitHub API (TUBES-CA-25)
 * Filter: ${REPOS.length} Repositori Inti Ekosistem Digital ICLabs
 * Termasuk: ICLABS-APP (Mobile Flutter & PWA Application)
 * =============================================================================
 */

export const targetRepositories = ${JSON.stringify(repoStats, null, 2)};

export const ecosystemStats = {
  totalCommits: ${grandCommits},
  totalPRs: ${grandPRs},
  totalIssues: 0,
  trackedReposCount: ${REPOS.length},
  activeContributorsCount: ${activeCount},
  totalPersonnel: ${MEMBERS.length},
  organization: "TUBES-CA-25",
  season: "2026",
  lastVerified: ${JSON.stringify(today)},
};

export const memberContributions = ${JSON.stringify(contributions, null, 2)};

export function getMemberContribution(memberId) {
  return memberContributions[memberId] || {
    memberId,
    username: "",
    commits: 0,
    prs: 0,
    issues: 0,
    repoCount: 0,
    rank: ${MEMBERS.length},
    topRepo: null,
    breakdown: [],
  };
}

export function getTopCommitters() {
  return Object.values(memberContributions)
    .filter((m) => m.commits > 0)
    .sort((a, b) => a.rank - b.rank || b.commits - a.commits);
}

export function getTopPRContributors() {
  return Object.values(memberContributions)
    .filter((m) => m.prs > 0)
    .sort((a, b) => b.prs - a.prs);
}
`;

fs.writeFileSync("lib/contributors.js", outContent, "utf8");
console.log(JSON.stringify({ grandCommits, grandPRs, activeCount, repoCounts: repoStats.map((r) => [r.repoName, r.totalCommits]) }));
