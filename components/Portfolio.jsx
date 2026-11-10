"use client";

import { useState, useRef, useEffect } from "react";
import { teamConfig, systemsConfig, labConfig } from "../lib/config";

/**
 * Exact 3-Tier Esports Layout mapping strictly matching docs/desain/layouts.png:
 * - Row 1 (Front Row - 7 Males):
 *   Rifky aunur (-34.5%) | Raihan (-23.0%) | fatwa (-11.5%) | ICHWAL (0%, LEAD) | Riswan (+11.5%) | fuad (+23.0%) | nahwa (+34.5%)
 * - Row 2 (Middle Row - 8 Males):
 *   Scania (-40.5%) | Ahwan (-29.0%) | wawan (-17.5%) | zaki (-5.8%) | Aan (+5.8%) | ikhlas (+17.5%) | Rafli (+29.0%) | Daifan (+40.5%)
 * - Row 3 (Back Row - ALL 7 FEMALES):
 *   Firly (-35.2%) | Fara (-23.5%) | Halima (-11.8%) | THALITA (0%, Center) | Safira (+11.8%) | Lutfia (+23.5%) | Rizki (+35.2%)
 */
function getMockupRosterLayout(memberId) {
  switch (memberId) {
    // ══════════════════════════════════════════════════════════════
    // BARIS DEPAN (ROW 1) — 7 Laki-laki
    // ══════════════════════════════════════════════════════════════
    case "andi-rifqi":
      return { row: 1, x: -34.5, bottom: 28, height: 265, zIndex: 32 };
    case "raihan":
      return { row: 1, x: -23.0, bottom: 18, height: 275, zIndex: 33 };
    case "fatwa":
      return { row: 1, x: -11.5, bottom: 8, height: 285, zIndex: 34 };
    case "ichwal":
      // Lead / Center: extending down across the bottom arena border as drawn in layouts.png
      return { row: 1, x: 0, bottom: -4, height: 310, zIndex: 36, isLead: true };
    case "rizwan":
      return { row: 1, x: 11.5, bottom: 8, height: 285, zIndex: 34 };
    case "fuad":
      return { row: 1, x: 23.0, bottom: 18, height: 275, zIndex: 33 };
    case "nahwa":
      return { row: 1, x: 34.5, bottom: 28, height: 265, zIndex: 32 };

    // ══════════════════════════════════════════════════════════════
    // BARIS TENGAH (ROW 2) — 8 Laki-laki (Ukuran Sedang)
    // ══════════════════════════════════════════════════════════════
    case "scania":
      return { row: 2, x: -40.5, bottom: 84, height: 350, zIndex: 22 };
    case "andi-ahsan":
      return { row: 2, x: -29.0, bottom: 76, height: 350, zIndex: 23 };
    case "wanwan":
      return { row: 2, x: -17.5, bottom: 68, height: 350, zIndex: 24 };
    case "zaki":
      return { row: 2, x: -5.8, bottom: 60, height: 350, zIndex: 25 };
    case "aan":
      return { row: 2, x: 5.8, bottom: 60, height: 350, zIndex: 25 };
    case "ikhlas":
      return { row: 2, x: 17.5, bottom: 68, height: 350, zIndex: 24 };
    case "rafly":
      return { row: 2, x: 29.0, bottom: 76, height: 350, zIndex: 23 };
    case "daifan":
      return { row: 2, x: 40.5, bottom: 84, height: 350, zIndex: 22 };

    // ══════════════════════════════════════════════════════════════
    // BARIS BELAKANG (ROW 3) — 7 Perempuan (Towering & Paling Besar)
    // ══════════════════════════════════════════════════════════════
    case "firly":
      return { row: 3, x: -35.2, bottom: 132, height: 395, zIndex: 12 };
    case "farah":
      return { row: 3, x: -23.5, bottom: 128, height: 400, zIndex: 13 };
    case "halima":
      return { row: 3, x: -11.8, bottom: 124, height: 405, zIndex: 14 };
    case "thalita":
      // Thalita at dead center back, towers directly above the center gap
      return { row: 3, x: 0, bottom: 120, height: 410, zIndex: 15 };
    case "siti-safira":
      return { row: 3, x: 11.8, bottom: 124, height: 405, zIndex: 14 };
    case "sitti-lutfia":
      return { row: 3, x: 23.5, bottom: 128, height: 400, zIndex: 13 };
    case "rizqi":
      return { row: 3, x: 35.2, bottom: 132, height: 395, zIndex: 12 };

    default:
      return { row: 3, x: 0, bottom: 150, height: 450, zIndex: 10 };
  }
}

export default function Portfolio() {
  const [activeSystemId, setActiveSystemId] = useState("integration");
  const [selectedMemberId, setSelectedMemberId] = useState("ichwal");
  const [hasMemberSelection, setHasMemberSelection] = useState(false);
  const [profilePhase, setProfilePhase] = useState("closed");
  const [profileOrigin, setProfileOrigin] = useState({ x: 0, y: 0 });
  const stageScrollRef = useRef(null);
  const stageRef = useRef(null);
  const profileCloseButtonRef = useRef(null);

  const activeSystem =
    systemsConfig.find((s) => s.id === activeSystemId) || systemsConfig[0];
  const selectedMember =
    teamConfig.find((m) => m.id === selectedMemberId) || teamConfig[0];
  const selectedIndex = teamConfig.findIndex(
    (m) => m.id === selectedMember.id
  );

  // Auto center scroll on initial load (mobile / small screens)
  useEffect(() => {
    if (stageScrollRef.current) {
      const container = stageScrollRef.current;
      const centerTarget = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollLeft = centerTarget;
    }
  }, []);

  const isProfileVisible = profilePhase !== "closed";

  useEffect(() => {
    if (profilePhase === "opening") {
      const frame = window.requestAnimationFrame(() => setProfilePhase("open"));
      return () => window.cancelAnimationFrame(frame);
    }

    if (profilePhase === "closing") {
      const timer = window.setTimeout(() => setProfilePhase("closed"), 280);
      return () => window.clearTimeout(timer);
    }

    if (profilePhase !== "open") {
      return undefined;
    }

    profileCloseButtonRef.current?.focus();

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setProfilePhase("closing");
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [profilePhase]);

  const openMemberProfile = (memberId, event) => {
    setSelectedMemberId(memberId);
    setHasMemberSelection(true);

    const stageRect = stageRef.current?.getBoundingClientRect();
    const trigger = event?.currentTarget;
    const isRosterFigure = trigger?.classList?.contains("roster-player-figure");

    if (stageRect && isRosterFigure) {
      const sourceRect = trigger.getBoundingClientRect();
      setProfileOrigin({
        x: sourceRect.left + sourceRect.width / 2 - (stageRect.left + stageRect.width / 2),
        y: sourceRect.top + sourceRect.height / 2 - (stageRect.top + stageRect.height / 2),
      });
    } else {
      setProfileOrigin({ x: 0, y: 0 });
    }

    setProfilePhase("opening");
  };

  const closeMemberProfile = () => setProfilePhase("closing");

  return (
    <main id="top" className="site-canvas">
      <a href="#project-detail" className="skip-link">
        Lewati ke detail sistem
      </a>

      {/* ====================================================================
          FULL-SCREEN ESPORTS ROSTER HERO (layouts.png reference)
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
              <span className="brand-title">{labConfig.name}</span>
              <span className="brand-subtitle">Developer Collective</span>
            </div>
          </a>

          {/* <div className="header-meta-badge">
            <span className="live-dot" aria-hidden="true" />
            <span className="meta-text">
              {labConfig.totalMembers} Personnel Official Roster · {labConfig.faculty}
            </span>
          </div> */}

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

        {/* ──────────────────────────────────────────────────────────────────
            TOP SYSTEMS TABS (Sesuai 5 kotak atas di layouts.png):
            [sistem] [sistem] [INTEGRATION (Tengah)] [sistem] [sistem]
            ────────────────────────────────────────────────────────────────── */}
        <div className="esports-top-systems-bar" aria-label="Pilih Sistem Terintegrasi">
          <div className="systems-marquee">
            <div className="systems-tabs-container">
              {[...systemsConfig, ...systemsConfig].map((sys, index) => {
                const isActive = sys.id === activeSystemId;
                const isCenter = sys.id === "integration";
                const isDuplicate = index >= systemsConfig.length;
                return (
                  <button
                    key={`${sys.id}-${index}`}
                    type="button"
                    className={`system-tab-card ${isActive ? "is-active" : ""} ${isCenter ? "is-center-system" : ""}`}
                    onClick={() => setActiveSystemId(sys.id)}
                    aria-pressed={isActive}
                    aria-hidden={isDuplicate || undefined}
                    tabIndex={isDuplicate ? -1 : undefined}
                  >
                    <span className="tab-number">{sys.number}</span>
                    <span className="tab-label">{sys.label}</span>
                    {sys.url && (
                      <span className="tab-live-badge" title="Tersedia tautan live">
                        ●
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────────────
            MAIN ARENA STAGE (Bingkai Roster Persegi Panjang di layouts.png)
            ────────────────────────────────────────────────────────────────── */}
        <div className="esports-arena-wrapper">
          <div
            ref={stageRef}
            className={`esports-arena-stage ${isProfileVisible ? "is-profile-visible" : ""}`}
            aria-label="Panggung Roster 22 Anggota ICLabs"
          >
            {/* Atmospheric Stage FX */}
            <div className="arena-backdrop-grid" aria-hidden="true" />
            <div className="arena-smoke-overlay" aria-hidden="true" />
            <div className="arena-ember-glow" aria-hidden="true" />

            {/* Scrollable Viewport for 22 Roster Figures */}
            <div
              id="arena-stage-scroll"
              ref={stageScrollRef}
              className="arena-scroll-viewport"
              tabIndex={0}
              aria-label="Area gulir 22 personel"
            >
              <div className="arena-lineup-container">
                {teamConfig.map((member) => {
                  const layout = getMockupRosterLayout(member.id);
                  const isSelected = selectedMemberId === member.id;
                  const isLead = layout.isLead;

                  return (
                    <button
                      key={member.id}
                      type="button"
                      className={`roster-player-figure row-${layout.row} ${isLead ? "figure-captain" : ""} ${isProfileVisible && isSelected ? "is-focused" : ""}`}
                      style={{
                        "--pos-x": `${layout.x}%`,
                        "--pos-bottom": `${layout.bottom}px`,
                        "--fig-height": `${layout.height}px`,
                        "--z-index": isProfileVisible && isSelected ? 50 : layout.zIndex,
                      }}
                      onClick={(event) => openMemberProfile(member.id, event)}
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

                      <div className="esports-player-badge" aria-hidden="true">
                        <span className="badge-name">
                          - {(member.nickname || member.name).toUpperCase()} -
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {isProfileVisible && (
              <div
                className={`stage-profile-scrim is-${profilePhase}`}
                role="presentation"
                onClick={closeMemberProfile}
              >
                <article
                  className="stage-profile-card"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="stage-profile-name"
                  style={{
                    "--profile-origin-x": `${profileOrigin.x}px`,
                    "--profile-origin-y": `${profileOrigin.y}px`,
                  }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    ref={profileCloseButtonRef}
                    type="button"
                    className="stage-profile-close"
                    onClick={closeMemberProfile}
                    aria-label="Tutup profil"
                  >
                    ×
                  </button>
                  <img
                    src={encodeURI(selectedMember.image)}
                    alt=""
                    className="stage-profile-photo"
                  />
                  <div className="stage-profile-content">
                    <span className="stage-profile-index">
                      PERSONEL {String(selectedIndex + 1).padStart(2, "0")}
                    </span>
                    <h2 id="stage-profile-name">{selectedMember.name}</h2>
                    <p>{selectedMember.role}</p>
                    {selectedMember.jobs?.length > 0 && (
                      <ul className="stage-profile-jobs">
                        {selectedMember.jobs.map((job) => (
                          <li key={job}>{job}</li>
                        ))}
                      </ul>
                    )}
                    <a href="#team" onClick={closeMemberProfile}>
                      Profil lengkap ↓
                    </a>
                  </div>
                </article>
              </div>
            )}

            <div className="arena-mobile-cue" aria-hidden="true">
              <span>Geser untuk menjelajahi 22 personel ↔</span>
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────────────
            BOTTOM TITLE & TICKER (Teks "Developer By Iclabs" di Bawah Bingkai)
            ────────────────────────────────────────────────────────────────── */}
        <div className="esports-bottom-section">
          {/* Main Title below stage matching layouts.png */}
          <div className="esports-main-title-wrap">
            <h1 className="esports-display-title">
              DEVELOPER <span className="text-accent">BY ICLABS</span>
            </h1>
            <p className="esports-display-sub">
              {labConfig.faculty} · {labConfig.university} · Season {labConfig.season}
            </p>
          </div>

          {/* Bottom HUD Bar & Roster Name Ticker */}
          <div className="esports-bottom-bar">
            {/* Active Player HUD */}
            <div className="hud-player-focus" aria-live="polite">
              <span className="hud-focus-pill">
                [{selectedIndex + 1}/{teamConfig.length}]
              </span>
              <strong className="hud-name">{selectedMember.name}</strong>
              <span className="hud-role">· {selectedMember.role}</span>
            </div>

            {/* Horizontal Roster Name Ticker */}
            <div className="roster-name-ticker" aria-label="Daftar nama asisten">
              <div className="roster-name-ticker-track">
                {[...teamConfig, ...teamConfig].map((member, index) => {
                  const isCurrent =
                    hasMemberSelection && member.id === selectedMember.id;
                  const isDuplicate = index >= teamConfig.length;
                  return (
                    <button
                      key={`${member.id}-${index}`}
                      type="button"
                      className={`ticker-name-btn ${isCurrent ? "is-active" : ""}`}
                      onClick={(event) => openMemberProfile(member.id, event)}
                      aria-hidden={isDuplicate || undefined}
                      tabIndex={isDuplicate ? -1 : undefined}
                    >
                      - {(member.nickname || member.name).toUpperCase()} -
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="hud-actions">
              {activeSystem.url && (
                <a
                  href={activeSystem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hud-launch-btn"
                  title={`Buka ${activeSystem.label}`}
                >
                  Buka Sistem ↗
                </a>
              )}
              <a href="#project-detail" className="hud-detail-cta">
                Detail Arsitektur ↓
              </a>
            </div>
          </div>
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
                {activeSystem.title.split("\n").map((line, i) => (
                  <span key={line} className={i > 0 ? "heading-secondary" : ""}>
                    {line}
                    <br />
                  </span>
                ))}
              </h2>
              <div className="project-category-meta-row">
                <span className="project-category-badge">{activeSystem.category}</span>
                {activeSystem.url ? (
                  <a
                    href={activeSystem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="system-external-link"
                  >
                    Kunjungi Portal: {activeSystem.url.replace(/^https?:\/\//, "")} ↗
                  </a>
                ) : (
                  <span className="system-internal-badge">Modul Internal API</span>
                )}
              </div>
              <p className="project-description">{activeSystem.description}</p>
            </div>

            <div className="features-block">
              <h3 className="block-title">Fitur & Arsitektur Utama</h3>
              <ul className="features-list">
                {activeSystem.features.map((feat) => (
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

            {activeSystem.tech.length > 0 && (
              <div className="tech-block">
                <h3 className="block-title">Teknologi Terintegrasi</h3>
                <div className="tech-chips">
                  {activeSystem.tech.map((t) => (
                    <span key={t} className="tech-chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeSystem.note && (
              <div className="project-note-box">
                <span className="note-label">Catatan Integrasi:</span>
                <p className="note-text">{activeSystem.note}</p>
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
                  {labConfig.faculty} · Ekosistem praktikum, riset, dan rekrutmen terpadu.
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
              {labConfig.totalMembers} asisten dan personel di balik pengembangan ekosistem digital laboratorium.
            </p>
          </div>
          <span className="team-total-badge">
            {labConfig.totalMembers} PERSPEKTIF · 1 TIM
          </span>
        </div>

        <div className="team-split-layout">
          {/* Selected Member Profile Card */}
          <div className="member-spotlight-card" aria-live="polite">
            <div className="spotlight-photo-frame">
              <img
                src={encodeURI(selectedMember.image)}
                alt={`Foto resmi ${selectedMember.name}`}
                loading="lazy"
                className="spotlight-photo"
              />
            </div>
            <div className="spotlight-details">
              <div className="spotlight-header-meta">
                <span className="spotlight-status">
                  {selectedMember.isLead ? "Lead & System Architect" : "Personel Developer"}
                </span>
                <span className="spotlight-tier-tag">
                  Baris {selectedMember.row} · Posisi #{selectedMember.rowPosition}
                </span>
              </div>
              <h3 className="spotlight-name">{selectedMember.name}</h3>
              <p className="spotlight-role">{selectedMember.role}</p>

              {/* Data Stambuk / NIM */}
              {selectedMember.stambuk && (
                <div className="spotlight-meta-row">
                  <span className="meta-row-label">Stambuk:</span>
                  <span className="meta-row-val">{selectedMember.stambuk}</span>
                </div>
              )}

              {/* Data Email */}
              {selectedMember.email && (
                <div className="spotlight-meta-row">
                  <span className="meta-row-label">Email:</span>
                  <a
                    href={`mailto:${selectedMember.email}`}
                    className="meta-row-link"
                  >
                    {selectedMember.email}
                  </a>
                </div>
              )}

              {/* Data Jobs & Keahlian */}
              {selectedMember.jobs && selectedMember.jobs.length > 0 && (
                <div className="spotlight-jobs-block">
                  <span className="jobs-block-label">Bidang & Keahlian:</span>
                  <div className="jobs-chip-wrap">
                    {selectedMember.jobs.map((job) => (
                      <span key={job} className="job-chip">
                        {job}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Sosial Media */}
              {selectedMember.socials &&
                Object.values(selectedMember.socials).some((val) => Boolean(val)) && (
                  <div className="spotlight-socials-block">
                    <span className="socials-block-label">Sosial Media:</span>
                    <div className="socials-links-wrap">
                      {selectedMember.socials.github && (
                        <a
                          href={selectedMember.socials.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-btn"
                          aria-label="GitHub"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                          </svg>
                          <span>GitHub</span>
                        </a>
                      )}
                      {selectedMember.socials.instagram && (
                        <a
                          href={selectedMember.socials.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-btn"
                          aria-label="Instagram"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                          </svg>
                          <span>Instagram</span>
                        </a>
                      )}
                      {selectedMember.socials.linkedin && (
                        <a
                          href={selectedMember.socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-btn"
                          aria-label="LinkedIn"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                          <span>LinkedIn</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

              <div className="spotlight-affiliation">
                <span>{labConfig.fullName}</span>
                <span>{labConfig.faculty} · {labConfig.university}</span>
              </div>
            </div>
          </div>

          {/* Full Roster Grid */}
          <div className="roster-grid" role="list" aria-label="Daftar asisten ICLabs">
            {teamConfig.map((member) => {
              const isCurrent = member.id === selectedMember.id;
              return (
                <button
                  key={member.id}
                  type="button"
                  className={`roster-card ${isCurrent ? "is-selected" : ""}`}
                  onClick={() => setSelectedMemberId(member.id)}
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
              ICLabs ({labConfig.fullName}) mengintegrasikan seluruh alur operasional
              laboratorium komputer {labConfig.faculty}—mulai dari pembagian jadwal
              praktikum, presensi harian, peminjaman ruang, hingga rekrutmen asisten baru.
            </p>
          </div>
          <div className="about-meta-grid">
            <div className="meta-box">
              <strong className="meta-number">12</strong>
              <span className="meta-label">Modul sistem terintegrasi</span>
            </div>
            <div className="meta-box">
              <strong className="meta-number">{labConfig.totalMembers}</strong>
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
            <strong>{labConfig.name.toUpperCase()} DEVELOPER COLLECTIVE</strong>
            <p>Laboratorium Komputer Terpadu · {labConfig.faculty}</p>
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
          <span>{labConfig.fullName}</span>
          <span>{labConfig.location}</span>
        </div>
      </footer>
    </main>
  );
}
