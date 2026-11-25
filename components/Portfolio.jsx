"use client";

import { useState, useRef, useEffect } from "react";
import { teamConfig, systemsConfig, labConfig } from "../lib/config";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const getAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  if (basePath && path.startsWith(basePath)) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
};

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
      return { row: 1, x: -34.5, bottom: 24, height: 268, zIndex: 32 };
    case "raihan":
      return { row: 1, x: -23.0, bottom: 16, height: 278, zIndex: 33 };
    case "fatwa":
      return { row: 1, x: -11.5, bottom: 6, height: 288, zIndex: 34 };
    case "ichwal":
      // Lead / Center: extending down across the bottom arena border as drawn in layouts.png
      return { row: 1, x: 0, bottom: -8, height: 315, zIndex: 36, isLead: true };
    case "rizwan":
      return { row: 1, x: 11.5, bottom: 6, height: 288, zIndex: 34 };
    case "fuad":
      return { row: 1, x: 23.0, bottom: 16, height: 278, zIndex: 33 };
    case "nahwa":
      return { row: 1, x: 34.5, bottom: 24, height: 268, zIndex: 32 };

    // ══════════════════════════════════════════════════════════════
    // BARIS TENGAH (ROW 2) — 8 Laki-laki (Ukuran Sedang, Renggang & Seimbang)
    // ══════════════════════════════════════════════════════════════
    case "scania":
      return { row: 2, x: -40.5, bottom: 122, height: 348, zIndex: 22 };
    case "andi-ahsan":
      return { row: 2, x: -29.0, bottom: 114, height: 348, zIndex: 23 };
    case "wanwan":
      return { row: 2, x: -17.5, bottom: 106, height: 348, zIndex: 24 };
    case "zaki":
      return { row: 2, x: -5.8, bottom: 98, height: 348, zIndex: 25 };
    case "aan":
      return { row: 2, x: 5.8, bottom: 98, height: 348, zIndex: 25 };
    case "ikhlas":
      return { row: 2, x: 17.5, bottom: 106, height: 348, zIndex: 24 };
    case "rafly":
      return { row: 2, x: 29.0, bottom: 114, height: 348, zIndex: 23 };
    case "daifan":
      return { row: 2, x: 40.5, bottom: 122, height: 348, zIndex: 22 };

    // ══════════════════════════════════════════════════════════════
    // BARIS BELAKANG (ROW 3) — 7 Perempuan (Mengisi Ruang Atas Panggung)
    // ══════════════════════════════════════════════════════════════
    case "firly":
      return { row: 3, x: -35.2, bottom: 190, height: 408, zIndex: 12 };
    case "farah":
      return { row: 3, x: -23.5, bottom: 185, height: 412, zIndex: 13 };
    case "halima":
      return { row: 3, x: -11.8, bottom: 180, height: 416, zIndex: 14 };
    case "thalita":
      // Thalita at dead center back, towers directly above the center gap
      return { row: 3, x: 0, bottom: 176, height: 420, zIndex: 15 };
    case "siti-safira":
      return { row: 3, x: 11.8, bottom: 180, height: 416, zIndex: 14 };
    case "sitti-lutfia":
      return { row: 3, x: 23.5, bottom: 185, height: 412, zIndex: 13 };
    case "rizqi":
      return { row: 3, x: 35.2, bottom: 190, height: 408, zIndex: 12 };

    default:
      return { row: 3, x: 0, bottom: 150, height: 450, zIndex: 10 };
  }
}

/**
 * Esports Cyberpunk Hologram Initialization Loader:
 * A high-tech hologram arena with live 22-slot biometric wireframe pods,
 * laser scanner sweep, telemetry corner brackets, and 22 segmented micro-cells.
 */
function HeroSkeleton({ progress, loadedCount, totalCount, isFadingOut }) {
  const telemetryMessage =
    progress < 25
      ? "> INITIALIZING PROTOCOL // FIKOM UMI 2026..."
      : progress < 55
        ? `> SYNCING BIOMETRIC ROSTER: ${loadedCount}/${totalCount} NODES VERIFIED...`
        : progress < 85
          ? "> CALIBRATING 3-TIER ARENA STAGE PERSPECTIVE..."
          : "> ROSTER MATRIX STABILIZED. WELCOME TO ICLABS.";

  return (
    <div
      className={`site-skeleton-overlay ${isFadingOut ? "is-fading-out" : ""}`}
      aria-busy="true"
      aria-live="polite"
      aria-label="Memuat seluruh data dan personel ICLabs"
    >
      {/* 4 Cyber Telemetry Corner HUDs */}
      <div className="telemetry-hud telemetry-tl" aria-hidden="true">
        <span className="telemetry-bracket">[+]</span> ICLABS_OS // STAGE INITIALIZATION
      </div>
      <div className="telemetry-hud telemetry-tr" aria-hidden="true">
        SYSTEM BUFFER: <span className="telemetry-highlight">{loadedCount}/{totalCount}</span> NODES [SYNCED]
      </div>
      <div className="telemetry-hud telemetry-bl" aria-hidden="true">
        NODE: <span className="telemetry-highlight">FIKOM_UMI_MAKASSAR</span> // WITA
      </div>
      <div className="telemetry-hud telemetry-br" aria-hidden="true">
        SECURE_CORE: <span className="telemetry-highlight">AES_GCM_256</span> // 144Hz
      </div>

      <div className="skeleton-container">
        {/* Hologram Header */}
        <header className="skeleton-header">
          <div className="skeleton-brand">
            <div className="hologram-shimmer skeleton-logo-box" />
            <div className="skeleton-text-group">
              <div className="hologram-shimmer skeleton-title-bar" />
              <div className="hologram-shimmer skeleton-subtitle-bar" />
            </div>
          </div>
          <div className="skeleton-nav">
            <div className="hologram-shimmer skeleton-nav-pill" />
          </div>
        </header>

        {/* Hologram Systems Tabs */}
        <div className="skeleton-tabs-bar">
          <div className="hologram-shimmer skeleton-tab-card" />
          <div className="hologram-shimmer skeleton-tab-card" />
          <div className="hologram-shimmer skeleton-tab-card is-center" />
          <div className="hologram-shimmer skeleton-tab-card" />
          <div className="hologram-shimmer skeleton-tab-card" />
        </div>

        {/* Hologram Arena Stage with 22 Exact-Coordinate Pods */}
        <div className="skeleton-arena-stage">
          {/* Moving Laser Scanner Beam */}
          <div className="arena-laser-scanner" aria-hidden="true" />

          {/* Lineup Container matching real stage dimensions */}
          <div className="arena-lineup-container hologram-lineup-stage">
            {teamConfig.map((member, index) => {
              const layout = getMockupRosterLayout(member.id);
              const isLead = layout.isLead;
              const isLocked = index < loadedCount;

              return (
                <div
                  key={member.id}
                  className={`hologram-figure-pod row-${layout.row} ${isLead ? "is-lead" : ""} ${isLocked ? "is-locked" : ""}`}
                  style={{
                    "--pos-x": `${layout.x}%`,
                    "--pos-bottom": `${layout.bottom}px`,
                    "--fig-height": `${layout.height}px`,
                    "--fig-scale": layout.scale || 1,
                    "--z-index": layout.zIndex,
                  }}
                  aria-hidden="true"
                >
                  <div className="hologram-pod-inner">
                    <div className="pod-corner pod-corner-tl" />
                    <div className="pod-corner pod-corner-tr" />
                    <div className="pod-corner pod-corner-bl" />
                    <div className="pod-corner pod-corner-br" />

                    <div className="pod-reticle">
                      <span className="reticle-crosshair">+</span>
                    </div>

                    <div className="pod-body-beam" />
                    <div className="pod-scan-streak" />
                    <div className="pod-pedestal-ring" />

                    <div className="pod-slot-tag">
                      <span className="pod-code">
                        {isLead ? "LEAD" : `DEV-${String(index + 1).padStart(2, "0")}`}
                      </span>
                      <span className="pod-name">
                        {(member.nickname || member.name).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Central Cyber Command Console HUD */}
          <div className="skeleton-hud-card">
            <div className="hud-radar-pulse">
              <div className="hud-ring-outer" />
              <div className="hud-ring-inner" />
              <div className="hud-core-dot" />
            </div>

            <div className="hud-content">
              <div className="hud-badge-row">
                <span className="hud-badge">HOLOGRAPHIC STAGE INIT</span>
                <span className="hud-telemetry-tag">PROTOCOL_V2.6</span>
              </div>
              <p className="hud-title">Menyiapkan Ekosistem & 22 Personel ICLabs</p>
              <div className="hud-terminal-log">
                <code>{telemetryMessage}</code>
              </div>
            </div>

            <div className="hud-segmented-bar" aria-label="22 Personel Loading Cells">
              {teamConfig.map((m, idx) => (
                <div
                  key={m.id}
                  className={`hud-cell ${idx < loadedCount ? "is-filled" : ""}`}
                  title={`${m.name}: ${idx < loadedCount ? "Loaded" : "Loading"}`}
                />
              ))}
            </div>

            <div className="hud-footer">
              <div className="hud-nodes-counter">
                <span className="hud-nodes-label">ROSTER NODES:</span>
                <span className="hud-nodes-value">{loadedCount} / {totalCount}</span>
              </div>
              <div className="hud-pct-wrap">
                <span className="hud-pct">{progress}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="skeleton-bottom-bar">
          <div className="hologram-shimmer skeleton-big-title" />
          <div className="hologram-shimmer skeleton-sub-title" />
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [isReady, setIsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [skeletonMounted, setSkeletonMounted] = useState(true);

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

  // Preload all 22 character figures + branding images before revealing
  useEffect(() => {
    let isCancelled = false;
    const imageSources = [
      getAssetUrl("/images/iclabs-logo.png"),
      ...teamConfig.map((m) => getAssetUrl(m.image)),
    ];

    let currentLoaded = 0;
    const total = imageSources.length;

    const notifyLoad = () => {
      currentLoaded++;
      if (!isCancelled) {
        setLoadedCount(Math.min(teamConfig.length, currentLoaded));
        const percent = Math.min(100, Math.round((currentLoaded / total) * 100));
        setLoadProgress(percent);
        if (currentLoaded >= total) {
          setTimeout(() => {
            if (!isCancelled) {
              setIsReady(true);
              setTimeout(() => {
                if (!isCancelled) setSkeletonMounted(false);
              }, 480);
            }
          }, 150);
        }
      }
    };

    // Safety fallback timeout: never block longer than 2.2s
    const fallbackId = setTimeout(() => {
      if (!isCancelled) {
        setLoadedCount(teamConfig.length);
        setLoadProgress(100);
        setIsReady(true);
        setTimeout(() => {
          if (!isCancelled) setSkeletonMounted(false);
        }, 480);
      }
    }, 2200);

    imageSources.forEach((src) => {
      const img = new Image();
      img.src = src;
      if (img.complete) {
        notifyLoad();
      } else {
        img.onload = notifyLoad;
        img.onerror = notifyLoad;
      }
    });

    return () => {
      isCancelled = true;
      clearTimeout(fallbackId);
    };
  }, []);

  // Auto center scroll on initial load (mobile / small screens)
  useEffect(() => {
    if (stageScrollRef.current) {
      const container = stageScrollRef.current;
      const centerTarget = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollLeft = centerTarget;
    }
  }, []);

  // Draggable / swipeable viewport support for hero stage
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const hasMovedRef = useRef(false);

  const handleStagePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartXRef.current = event.clientX;
    scrollLeftStartRef.current = stageScrollRef.current ? stageScrollRef.current.scrollLeft : 0;
  };

  const handleStagePointerMove = (event) => {
    if (!isDraggingRef.current || !stageScrollRef.current) return;
    const deltaX = event.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 6) {
      hasMovedRef.current = true;
    }
    stageScrollRef.current.scrollLeft = scrollLeftStartRef.current - deltaX;
  };

  const handleStagePointerUp = () => {
    isDraggingRef.current = false;
  };

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
    if (hasMovedRef.current) {
      hasMovedRef.current = false;
      return;
    }
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
    <>
      {skeletonMounted && (
        <HeroSkeleton
          progress={loadProgress}
          loadedCount={loadedCount}
          totalCount={teamConfig.length}
          isFadingOut={isReady}
        />
      )}
      <main
        id="top"
        className={`site-canvas main-content-transition ${isReady ? "is-revealed" : "is-concealed"}`}
      >
        {/* ====================================================================
          FULL-SCREEN ESPORTS ROSTER HERO (layouts.png reference)
          ==================================================================== */}
        <section className="esports-hero-screen" aria-label="Official Esports Roster Showcase">
          {/* Top Header */}
          <header className="site-header">
            <a className="brand" href="#top" aria-label="ICLabs Developer Collective - Beranda">
              <img
                src={getAssetUrl("/images/iclabs-logo.png")}
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

            <div className="header-meta-badge">
              <span className="live-dot" aria-hidden="true" />
              <span className="meta-text">
                {labConfig.totalMembers} Personnel Official Roster · {labConfig.faculty}
              </span>
            </div>
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
                onPointerDown={handleStagePointerDown}
                onPointerMove={handleStagePointerMove}
                onPointerUp={handleStagePointerUp}
                onPointerCancel={handleStagePointerUp}
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
                          "--fig-scale": layout.scale || 1,
                          "--z-index": isProfileVisible && isSelected ? 50 : layout.zIndex,
                        }}
                        onClick={(event) => openMemberProfile(member.id, event)}
                        aria-label={`Pilih asisten ${member.name}`}
                        aria-pressed={isSelected}
                      >
                        <div className="figure-photo-wrap">
                          <img
                            src={encodeURI(getAssetUrl(member.image))}
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

              {/* ────────────────────────────────────────────────────────────
                SIMPLIFIED DEVELOPER PROFILE MODAL:
                Displays ONLY Developer Image, Name, and Developer Status
                ──────────────────────────────────────────────────────────── */}
              {isProfileVisible && (
                <div
                  className={`stage-profile-scrim is-${profilePhase}`}
                  role="presentation"
                  onClick={closeMemberProfile}
                >
                  <article
                    className="stage-profile-card stage-profile-card-minimal"
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

                    <div className="stage-profile-photo-column">
                      <div className="stage-profile-photo-frame">
                        <img
                          src={encodeURI(getAssetUrl(selectedMember.image))}
                          alt={`Foto resmi ${selectedMember.name}`}
                          className="stage-profile-photo"
                        />
                      </div>
                    </div>

                    <div className="stage-profile-content stage-profile-content-minimal">
                      <div className="stage-profile-header-meta">
                        <span className={`stage-profile-lead-badge ${selectedMember.isLead ? "is-lead" : ""}`}>
                          {selectedMember.isLead ? "👑 Lead & System Architect" : "Contributor Developer"}
                        </span>
                      </div>

                      <h2 id="stage-profile-name" className="stage-profile-name">
                        {selectedMember.name}
                      </h2>
                      <p className="stage-profile-role">{selectedMember.role}</p>

                      <div className="stage-profile-footer-clean">
                        <span className="stage-profile-footer-brand">
                          ICLabs Developer Collective · FIKOM UMI Makassar
                        </span>
                      </div>
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
                <span className="hud-role">
                  · {selectedMember.isLead ? "Lead & System Architect" : "Contributor Developer"}
                </span>
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

              {/* Quick Action */}
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
              </div>
            </div>
          </div>
        </section>

        {/* Minimal Clean Footer */}
        <footer className="site-footer">
          <div className="footer-headline-wrap">
            <p className="footer-headline">
              Developed by <span className="text-accent">Iclabs</span>.
            </p>
          </div>

          <div className="footer-bottom">
            <span>{labConfig.fullName}</span>
            <span>{labConfig.faculty} · {labConfig.university}</span>
          </div>
        </footer>
      </main>
    </>
  );
}
