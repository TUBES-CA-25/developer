"use client";

import { useState, useRef, useEffect } from "react";
import { projects } from "../lib/projects";
import { team } from "../lib/team";

// Position mapping for all 22 members matching the esports reference.png composition:
// Progressive scaling & Gender layout:
// - Row 1 (Front Row - 7 males): Lead (Ichwal, Center) + 6 front males (Height ~275-315px)
// - Row 2 (Mid Row - 8 males): Staggered in gap windows, larger (Height ~370-388px)
// - Row 3 (Back Row - ALL 7 FEMALES): Towering guardians in the back, largest of all (Height ~462-480px)
function getEsportsRosterLayout(index) {
  // Index 0: ICHWAL - Center Front Captain (No badge label overlay per user request)
  if (index === 0) {
    return {
      row: 1,
      x: 0,
      bottom: 0,
      height: 315,
      zIndex: 40,
      isCaptain: true,
    };
  }

  // Row 1 (Front Row - 6 Males flanking Ichwal):
  // Left: Aan Ms (1), Andi Ahsan Ashuri (2), Andi Rifqi Aunur Rahman 1 (3)
  if (index === 1) return { row: 1, x: -11.5, bottom: 8, height: 285, zIndex: 37 };
  if (index === 2) return { row: 1, x: -23.0, bottom: 16, height: 280, zIndex: 35 };
  if (index === 3) return { row: 1, x: -34.5, bottom: 24, height: 275, zIndex: 33 };

  // Right: Fatwa (5), Ikhlas (7), Muhammad Nur Fuad (8)
  if (index === 5) return { row: 1, x: 11.5, bottom: 8, height: 285, zIndex: 37 };
  if (index === 7) return { row: 1, x: 23.0, bottom: 16, height: 280, zIndex: 35 };
  if (index === 8) return { row: 1, x: 34.5, bottom: 24, height: 275, zIndex: 33 };

  // Row 2 (Mid Row - 8 Males): LARGER than Row 1 (~370-388px), elevated in gap windows
  // Left: Nahwa (9), Rafly (10), Raihan Nur Rizqillah (11), Zaki (18)
  if (index === 9) return { row: 2, x: -6.0, bottom: 65, height: 388, zIndex: 26 };
  if (index === 10) return { row: 2, x: -17.5, bottom: 70, height: 382, zIndex: 24 };
  if (index === 11) return { row: 2, x: -29.0, bottom: 75, height: 376, zIndex: 22 };
  if (index === 18) return { row: 2, x: -40.5, bottom: 80, height: 370, zIndex: 20 };

  // Right: Rizwan (13), Scania (14), daifan (19), wanwan (21)
  if (index === 13) return { row: 2, x: 6.0, bottom: 65, height: 388, zIndex: 26 };
  if (index === 14) return { row: 2, x: 17.5, bottom: 70, height: 382, zIndex: 24 };
  if (index === 19) return { row: 2, x: 29.0, bottom: 75, height: 376, zIndex: 22 };
  if (index === 21) return { row: 2, x: 40.5, bottom: 80, height: 370, zIndex: 20 };

  // Row 3 (Back Row - ALL 7 FEMALES): LARGEST OF ALL (~462-480px, +4px enlarged), towering in the back!
  // Center Queen: Sitti Lutfia (16) towering high above Ichwal
  if (index === 16) return { row: 3, x: 0, bottom: 148, height: 480, zIndex: 15 };

  // Left side females: Rizqi Ananda Jalil (12), Thalita (17), Farah (4)
  if (index === 12) return { row: 3, x: -12.0, bottom: 144, height: 474, zIndex: 14 };
  if (index === 17) return { row: 3, x: -23.5, bottom: 146, height: 468, zIndex: 13 };
  if (index === 4) return { row: 3, x: -35.0, bottom: 150, height: 462, zIndex: 12 };

  // Right side females: Firly (6), Siti Safira (15), halima (20)
  if (index === 6) return { row: 3, x: 12.0, bottom: 144, height: 474, zIndex: 14 };
  if (index === 15) return { row: 3, x: 23.5, bottom: 146, height: 468, zIndex: 13 };
  if (index === 20) return { row: 3, x: 35.0, bottom: 150, height: 462, zIndex: 12 };

  return { row: 3, x: 0, bottom: 140, height: 460, zIndex: 10 };
}

export default function Portfolio() {
  const [activeProject, setActiveProject] = useState(0);
  const [selectedPerson, setSelectedPerson] = useState("Ichwal");
  const stageScrollRef = useRef(null);

  const project = projects[activeProject] || projects[0];
  const selected = team.find((m) => m.name === selectedPerson) || team[0];
  const selectedIndex = team.findIndex((m) => m.name === selectedPerson);

  // Auto center scroll on mobile so Ichwal is immediately in view
  useEffect(() => {
    if (stageScrollRef.current) {
      const container = stageScrollRef.current;
      const centerTarget = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollLeft = centerTarget;
    }
  }, []);

  return (
    <main id="top" className="site-canvas">
      <a href="#project-detail" className="skip-link">
        Lewati ke detail sistem
      </a>

      {/* ====================================================================
          FULL-SCREEN 100VH ESPORTS ROSTER HERO SCREEN (reference.png layout)
          ==================================================================== */}
      <section className="esports-hero-screen" aria-label="Official Esports Roster Showcase">
        {/* Top Header */}
        <header className="site-header">
          <a className="brand" href="#top" aria-label="ICLabs Developer Collective - Beranda">
            <img
              src="/images/iclabs-logo.png"
              alt="Logo ICLabs"
              width="36"
              height="36"
              className="brand-logo"
            />
            <div className="brand-text">
              <span className="brand-title">ICLABS</span>
              <span className="brand-subtitle">Developer Collective</span>
            </div>
          </a>

          <div className="header-meta-badge">
            <span className="live-dot" aria-hidden="true" />
            <span className="meta-text">22 Personnel Official Roster · Fikom UMI</span>
          </div>

          <nav className="header-nav" aria-label="Navigasi Utama">
            <a href="#project-detail" className="nav-link">
              Sistem
            </a>
            <a href="#team" className="nav-link">
              Roster Lengkap
            </a>
            <a href="#about" className="nav-link nav-link-cta">
              Tentang Lab
            </a>
          </nav>
        </header>

        {/* Top System Selector Tabs (from markup.png) */}
        <div className="esports-systems-bar">
          <span className="systems-bar-label">Pilih sistem:</span>
          <nav className="systems-pill-track" aria-label="Pilih sistem terintegrasi">
            {projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className={`system-pill-btn ${activeProject === i ? "is-active" : ""}`}
                aria-pressed={activeProject === i}
                onClick={() => setActiveProject(i)}
              >
                <span className="pill-name">{p.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Central Esports Stage (Exact composition of reference.png) */}
        <div
          className="esports-arena-stage"
          aria-label="Panggung Roster 22 Anggota ICLabs"
        >
          {/* Stage Atmosphere Lighting & Embers */}
          <div className="arena-backdrop-grid" aria-hidden="true" />
          <div className="arena-spotlight-beam" aria-hidden="true" />
          <div className="arena-smoke-overlay" aria-hidden="true" />
          <div className="arena-ember-glow" aria-hidden="true" />

          {/* SVG Stadium Watermark */}
          <svg className="arena-watermark-svg" viewBox="0 0 1000 120" aria-hidden="true">
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="currentColor"
              className="watermark-svg-text"
            >
              ICLABS COLLECTIVE
            </text>
          </svg>

          {/* Heading overlay at top of stage */}
          <div className="arena-heading-wrap">
            <span className="arena-kicker">FIKOM UMI · INTEGRATED LABS</span>
            <h1 className="arena-title">
              DEVELOPER <span className="text-accent">BY ICLABS</span>
            </h1>
            <p className="arena-subtitle">
              Satu visi. 22 personel di balik ekosistem digital laboratorium terintegrasi.
            </p>
          </div>

          {/* Scrollable Viewport for 22-Player Esports Formation */}
          <div
            id="arena-stage-scroll"
            ref={stageScrollRef}
            className="arena-scroll-viewport"
            tabIndex={0}
            aria-label="Area gulir 22 personel"
          >
            <div className="arena-lineup-container">
              {team.map((member, i) => {
                const layout = getEsportsRosterLayout(i);
                const isSelected = selectedPerson === member.name;
                const isLead = layout.isCaptain;

                return (
                  <button
                    key={member.name}
                    type="button"
                    className={`roster-player-figure row-${layout.row} ${isLead ? "figure-captain" : ""} ${isSelected && !isLead ? "is-focused" : ""}`}
                    style={{
                      "--pos-x": `${layout.x}%`,
                      "--pos-bottom": `${layout.bottom}px`,
                      "--fig-height": `${layout.height}px`,
                      "--z-index": isSelected ? 50 : layout.zIndex,
                    }}
                    onClick={() => setSelectedPerson(member.name)}
                    aria-label={`Pilih asisten ${member.name}`}
                    aria-pressed={isSelected}
                  >
                    <div className="figure-photo-wrap">
                      <img
                        src={encodeURI(member.image)}
                        alt={`Foto ${member.name}`}
                        loading={layout.row <= 2 ? "eager" : "lazy"}
                        className="figure-photo"
                      />
                    </div>

                    {/* Player Name Badge (omitted for lead per user request) */}
                    {!isLead && (
                      <div className="esports-player-badge">
                        <span className="badge-name">
                          - {member.name.toUpperCase()} -
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="arena-mobile-cue">
            <span>Geser untuk menjelajahi 22 personel ↔</span>
          </div>
        </div>

        {/* Bottom Esports Banner & HUD (from markup.png & reference.png) */}
        <div className="esports-bottom-bar">
          <div className="hud-title-unit">
            <span className="hud-brand-season">SEASON 2026</span>
            <strong className="hud-brand-title">OFFICIAL ROSTER · 22</strong>
          </div>

          {/* Active Player HUD */}
          <div className="hud-player-focus" aria-live="polite">
            <span className="hud-focus-pill">IN FOCUS [{selectedIndex + 1}/22]</span>
            <strong className="hud-name">{selected.name}</strong>
            <span className="hud-role">· {selected.role}</span>
          </div>

          {/* Horizontal Roster Name Ticker (from reference.png: - NAME -) */}
          <div className="roster-name-ticker" aria-label="Daftar nama asisten">
            {team.map((member) => {
              const isCurrent = member.name === selected.name;
              return (
                <button
                  key={member.name}
                  type="button"
                  className={`ticker-name-btn ${isCurrent ? "is-active" : ""}`}
                  onClick={() => setSelectedPerson(member.name)}
                >
                  - {member.name.toUpperCase()} -
                </button>
              );
            })}
          </div>

          {/* Jump Link to Details */}
          <a href="#project-detail" className="hud-detail-cta">
            Detail Sistem ↓
          </a>
        </div>
      </section>

      {/* ====================================================================
          SECTION 2: PROJECT DETAIL (Integrated Systems Architecture)
          ==================================================================== */}
      <section
        className="project-detail-section"
        id="project-detail"
        aria-labelledby="project-title"
      >
        <div className="detail-grid">
          <div className="detail-content">
            <div className="detail-header-block">
              <span className="section-pill-tag">DETAIL ARSITEKTUR SISTEM</span>
              <h2 id="project-title" className="project-heading">
                {project.title.split("\n").map((line, i) => (
                  <span key={line} className={i > 0 ? "heading-secondary" : ""}>
                    {line}
                    <br />
                  </span>
                ))}
              </h2>
              <p className="project-category-meta">Kategori: {project.category}</p>
              <p className="project-description">{project.description}</p>
            </div>

            <div className="features-block">
              <h3 className="block-title">Fitur & Arsitektur Utama</h3>
              <ul className="features-list">
                {project.features.map((feat) => (
                  <li key={feat} className="feature-item">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feature-icon"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tech-block">
              <h3 className="block-title">Teknologi Terintegrasi</h3>
              <div className="tech-chips">
                {project.tech.map((t) => (
                  <span key={t} className="tech-chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {project.note && (
              <div className="project-note-box">
                <span className="note-label">Catatan Integrasi:</span>
                <p className="note-text">{project.note}</p>
              </div>
            )}
          </div>

          <div className="detail-visual-column">
            <figure className="detail-figure">
              <img
                src="/images/gedung-fikom-malam.webp"
                alt="Gedung Fakultas Ilmu Komputer pada malam hari"
                loading="lazy"
                className="figure-image"
              />
              <figcaption className="figure-caption">
                <span className="caption-sub">Pusat operasional laboratorium</span>
                <strong className="caption-main">ICLabs Fikom</strong>
                <span className="caption-desc">
                  Fakultas Ilmu Komputer · Ekosistem praktikum, riset, dan rekrutmen terpadu.
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: COMPLETE TEAM DIRECTORY (22 Members Profiles)
          ==================================================================== */}
      <section id="team" className="team-section" aria-labelledby="team-heading">
        <div className="section-header">
          <div>
            <h2 id="team-heading" className="section-title">
              Built by us<span className="text-accent">.</span>
            </h2>
            <p className="section-subtitle">
              22 asisten dan personel di balik pengembangan sistem informasi laboratorium.
            </p>
          </div>
          <span className="team-total-badge">22 PERSPEKTIF · 1 TIM</span>
        </div>

        <div className="team-split-layout">
          {/* Selected Member Profile Card */}
          <div className="member-spotlight-card" aria-live="polite">
            <div className="spotlight-photo-frame">
              <img
                src={encodeURI(selected.image)}
                alt={`Foto resmi ${selected.name}`}
                loading="lazy"
                className="spotlight-photo"
              />
            </div>
            <div className="spotlight-details">
              <span className="spotlight-status">Profil asisten terpilih</span>
              <h3 className="spotlight-name">{selected.name}</h3>
              <p className="spotlight-role">{selected.role}</p>
              <div className="spotlight-affiliation">
                <span>Integrated Computer Laboratory System</span>
                <span>Fakultas Ilmu Komputer</span>
              </div>
            </div>
          </div>

          {/* Full Roster Grid */}
          <div className="roster-grid" role="list" aria-label="Daftar asisten ICLabs">
            {team.map((member) => {
              const isCurrent = member.name === selected.name;
              return (
                <button
                  key={member.name}
                  type="button"
                  className={`roster-card ${isCurrent ? "is-selected" : ""}`}
                  onClick={() => setSelectedPerson(member.name)}
                  aria-pressed={isCurrent}
                >
                  <div className="roster-thumb-wrap">
                    <img
                      src={encodeURI(member.image)}
                      alt=""
                      loading="lazy"
                      className="roster-thumb"
                    />
                  </div>
                  <div className="roster-card-info">
                    <strong className="roster-member-name">{member.name}</strong>
                    <span className="roster-member-role">{member.role}</span>
                  </div>
                  <span className="roster-indicator" aria-hidden="true">
                    {isCurrent ? "●" : "→"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 4: ABOUT LAB
          ==================================================================== */}
      <section id="about" className="about-section">
        <div className="about-card">
          <div className="about-text-content">
            <h2 className="about-heading">
              Satu Ekosistem untuk Seluruh Laboratorium.
            </h2>
            <p className="about-description">
              ICLabs (Integrated Computer Laboratory System) mengintegrasikan seluruh
              alur operasional laboratorium komputer Fakultas Ilmu Komputer—mulai dari
              pembagian jadwal praktikum, presensi harian, peminjaman ruang, hingga
              rekrutmen asisten baru.
            </p>
          </div>
          <div className="about-meta-grid">
            <div className="meta-box">
              <strong className="meta-number">12</strong>
              <span className="meta-label">Modul sistem terintegrasi</span>
            </div>
            <div className="meta-box">
              <strong className="meta-number">22</strong>
              <span className="meta-label">Anggota tim pengembang</span>
            </div>
            <div className="meta-box">
              <strong className="meta-number">100%</strong>
              <span className="meta-label">Kolaborasi mandiri laboratorium</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          FOOTER
          ==================================================================== */}
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <strong>ICLABS DEVELOPER COLLECTIVE</strong>
            <p>Laboratorium Komputer Terpadu · Fakultas Ilmu Komputer</p>
          </div>
          <a href="#top" className="back-top-link">
            Kembali ke atas ↑
          </a>
        </div>

        <div className="footer-headline-wrap">
          <p className="footer-headline">
            Developed by <span className="text-accent">Iclabs</span>.
          </p>
        </div>

        <div className="footer-bottom">
          <span>Integrated Computer Laboratory System</span>
          <span>Makassar, Sulawesi Selatan · WITA</span>
        </div>
      </footer>
    </main>
  );
}
