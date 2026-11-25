"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChartBar,
  EnvelopeSimple,
  GitBranch,
  GitCommit,
  GithubLogo,
  GitPullRequest,
  Globe,
  Medal,
  Sparkle,
  Trophy,
  UserCheck,
  UsersThree,
} from "@phosphor-icons/react";
import { teamConfig, systemsConfig, labConfig } from "../lib/config";
import ArchitectureGraph from "./ArchitectureGraph";
import {
  targetRepositories,
  ecosystemStats,
  memberContributions,
  getMemberContribution,
  getTopCommitters,
  getTopPRContributors,
} from "../lib/contributors";

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
            <div className="hologram-shimmer skeleton-nav-pill" />
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
              const contrib = getMemberContribution(member.id);

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
                        {isLead
                          ? "LEAD"
                          : contrib.rank <= 10
                            ? `TOP-${contrib.rank}`
                            : `BADGE-${contrib.rank}`}
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
  const [contributorTab, setContributorTab] = useState("leaderboard");
  const [leaderboardMetric, setLeaderboardMetric] = useState("commits");
  const [rosterFilter, setRosterFilter] = useState("all");

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
  const selectedContrib = getMemberContribution(selectedMember.id);

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

            <nav className="header-nav" aria-label="Navigasi Utama">
              <a href="#project-detail" className="nav-link">
                Arsitektur
              </a>
              <a href="#contributors" className="nav-link">
                Kontributor & Commit
              </a>
              <a href="#team" className="nav-link">
                Roster
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
                DEVELOPER PROFILE CARD WITH RANK & COMMIT METRICS
                (Teknologi telah dihilangkan sesuai permintaan)
                ──────────────────────────────────────────────────────────── */}
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

                    <div className="stage-profile-photo-column">
                      <div className="stage-profile-photo-frame">
                        <img
                          src={encodeURI(getAssetUrl(selectedMember.image))}
                          alt={`Foto resmi ${selectedMember.name}`}
                          className="stage-profile-photo"
                        />
                      </div>

                      {/* Rank & Formation Badges */}
                      <div className="stage-profile-photo-badges">
                        <div className="stage-profile-tier-badge">
                          {selectedContrib.rank === 1 ? (
                            <span className="tier-tag tier-gold">
                              <Trophy size={13} weight="fill" /> RANK #1 CORE LEAD
                            </span>
                          ) : selectedContrib.rank <= 3 ? (
                            <span className="tier-tag tier-gold">
                              <Medal size={13} weight="fill" /> TOP #{selectedContrib.rank} CONTRIBUTOR
                            </span>
                          ) : selectedContrib.rank <= 10 ? (
                            <span className="tier-tag tier-cyan">
                              <Sparkle size={13} weight="fill" /> TOP #{selectedContrib.rank} CONTRIBUTOR
                            </span>
                          ) : (
                            <span className="tier-tag tier-muted">
                              <UserCheck size={13} weight="fill" /> CONTRIBUTOR #{selectedContrib.rank}
                            </span>
                          )}
                        </div>
                        <div className="stage-profile-formation-tag">
                          <span>
                            {selectedMember.row === 1
                              ? selectedMember.isLead
                                ? "Row 1 (Depan) · Captain Lead"
                                : `Row 1 (Depan) · Posisi #${selectedMember.rowPosition}`
                              : selectedMember.row === 2
                                ? `Row 2 (Tengah) · Posisi #${selectedMember.rowPosition}`
                                : `Row 3 (Belakang) · Posisi #${selectedMember.rowPosition}`}
                          </span>
                        </div>
                        <div className="stage-profile-callsign-tag">
                          <span>CALLSIGN: {(selectedMember.nickname || selectedMember.name).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="stage-profile-content">
                      <div className="stage-profile-header-meta">
                        <span className="stage-profile-index">
                          {selectedContrib.rank <= 10
                            ? `CONTRIBUTOR TOP ${selectedContrib.rank}`
                            : `CONTRIBUTOR BADGE #${selectedContrib.rank}`}
                        </span>
                        <span className={`stage-profile-lead-badge ${selectedMember.isLead ? "is-lead" : ""}`}>
                          {selectedMember.isLead ? "👑 Lead & System Architect" : "Contributor Developer"}
                        </span>
                      </div>

                      <h2 id="stage-profile-name" className="stage-profile-name">
                        {selectedMember.name}
                      </h2>
                      <p className="stage-profile-role">{selectedMember.role}</p>

                      {/* Rekap Kontribusi Git & Peringkat Komit */}
                      <div className="stage-profile-git-block">
                        <div className="stage-profile-git-top">
                          <div className="stage-git-title-group">
                            <span className="meta-label">Aktivitas Git (8 Repositori Inti):</span>
                            {selectedContrib.topRepo && (
                              <span className="stage-top-repo-pill" title="Repositori kontribusi terbanyak">
                                Top: <strong>{selectedContrib.topRepo}</strong>
                              </span>
                            )}
                          </div>
                          {selectedContrib.username && (
                            <a
                              href={`https://github.com/${selectedContrib.username}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="git-user-badge"
                            >
                              <GithubLogo size={13} weight="fill" />
                              <span>@{selectedContrib.username}</span>
                            </a>
                          )}
                        </div>

                        <div className="stage-profile-git-metrics">
                          <div className="git-metric-box">
                            <div className="git-metric-header">
                              <GitCommit size={15} className="metric-icon" />
                              <span className="metric-val">{selectedContrib.commits}</span>
                            </div>
                            <span className="metric-lbl">Commits</span>
                          </div>
                          <div className="git-metric-box">
                            <div className="git-metric-header">
                              <GitPullRequest size={15} className="metric-icon" />
                              <span className="metric-val">{selectedContrib.prs}</span>
                            </div>
                            <span className="metric-lbl">Pull Requests</span>
                          </div>
                          <div className="git-metric-box">
                            <div className="git-metric-header">
                              <GitBranch size={15} className="metric-icon" />
                              <span className="metric-val">{selectedContrib.repoCount} / 8</span>
                            </div>
                            <span className="metric-lbl">Repositori</span>
                          </div>
                          <div className="git-metric-box">
                            <div className="git-metric-header">
                              <Trophy size={15} className="metric-icon metric-icon-gold" />
                              <span className="metric-val">#{selectedContrib.rank}</span>
                            </div>
                            <span className="metric-lbl">Rank Global</span>
                          </div>
                        </div>

                        {selectedContrib.breakdown && selectedContrib.breakdown.length > 0 ? (
                          <div className="stage-profile-repo-list">
                            {selectedContrib.breakdown.map((item) => (
                              <span
                                key={item.repo}
                                className="stage-repo-chip"
                                title={`${item.repo} (Branch: ${item.branch})`}
                              >
                                <span className="repo-chip-name">{item.shortName}</span>
                                <span className="repo-chip-count">{item.commits}c</span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="stage-no-commit-notice">
                            Aktif berkolaborasi dalam tinjauan pull request dan integrasi sistem laboratorium.
                          </p>
                        )}
                      </div>

                      {/* Socials & Website Portfolio */}
                      {selectedMember.socials &&
                        Object.values(selectedMember.socials).some((val) => Boolean(val)) && (
                          <div className="stage-profile-socials-wrap">
                            <span className="meta-label">Tautan & Portofolio:</span>
                            <div className="stage-profile-social-buttons">
                              {selectedMember.socials.website && (
                                <a
                                  href={selectedMember.socials.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="social-btn social-btn-website"
                                  aria-label={`Website & Portfolio ${selectedMember.name}`}
                                >
                                  <Globe size={16} weight="bold" />
                                  <span>Website / Portofolio</span>
                                </a>
                              )}
                              {selectedMember.socials.github && (
                                <a
                                  href={selectedMember.socials.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="social-btn"
                                  aria-label="GitHub"
                                >
                                  <GithubLogo size={15} weight="fill" />
                                  <span>GitHub</span>
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
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                  </svg>
                                  <span>LinkedIn</span>
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
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                  </svg>
                                  <span>Instagram</span>
                                </a>
                              )}
                              {selectedMember.email && (
                                <a
                                  href={`mailto:${selectedMember.email}`}
                                  className="social-btn social-btn-email"
                                  aria-label={`Kirim email ke ${selectedMember.name}`}
                                >
                                  <EnvelopeSimple size={16} weight="bold" />
                                  <span>Kirim Email</span>
                                </a>
                              )}
                            </div>
                          </div>
                        )}

                      <div className="stage-profile-footer-clean">
                        <span className="stage-profile-footer-brand">
                          ICLabs Developer Collective · FIKOM UMI Makassar · Season 2026
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
            <div className="esports-main-title-wrap">
              <h1 className="esports-display-title">
                DEVELOPER <span className="text-accent">BY ICLABS</span>
              </h1>
              <p className="esports-display-sub">
                {labConfig.faculty} · {labConfig.university} · Season {labConfig.season}
              </p>
            </div>

            {/* Bottom HUD Bar with Commit & Rank Indicators */}
            <div className="esports-bottom-bar">
              <div className="hud-player-focus" aria-live="polite">
                <span className="hud-focus-pill">
                  [{selectedIndex + 1}/{teamConfig.length}]
                </span>
                <strong className="hud-name">{selectedMember.name}</strong>
                <span className="hud-role">· {selectedMember.role}</span>
                {selectedContrib.commits > 0 && (
                  <span
                    className="hud-contrib-pill"
                    title={`${selectedContrib.commits} commits pada branch default di 7 repositori inti`}
                  >
                    ⚡ {selectedContrib.commits} Commits · {selectedContrib.repoCount} Repo
                  </span>
                )}
                {selectedContrib.commits === 0 && selectedContrib.prs > 0 && (
                  <span className="hud-contrib-pill">
                    🌿 {selectedContrib.prs} PR
                  </span>
                )}
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
                  Graf Arsitektur ↓
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
          SECTION 2: INTERACTIVE SYSTEM ARCHITECTURE TOPOLOGY GRAPH
          ==================================================================== */}
        <section
          className="project-detail-section architecture-graph-section"
          id="project-detail"
          aria-labelledby="project-title"
        >
          <div className="section-header architecture-graph-header">
            <div>
              <span className="section-pill-tag">ARSITEKTUR EKOSISTEM TERINTEGRASI</span>
              <h2 id="project-title" className="section-title">
                Satu inti<span className="text-accent">.</span> Semua terhubung<span className="text-accent">.</span>
              </h2>
              <p className="section-subtitle">
                Peta graf interaktif lalu lintas portal ICLabs (<code>iclabs.fikom.umi.ac.id</code>) melalui
                Caddy reverse proxy, proteksi dua arah Wazuh IDS, cluster API stateless, replikasi MySQL, dan storage MinIO AIStor.
              </p>
            </div>
            <div className="architecture-graph-pills">
              <span className="team-total-badge">
                7 CLIENT PORTALS · 2 API NODES · 2-WAY IDS
              </span>
            </div>
          </div>

          <ArchitectureGraph
            activeSystem={activeSystem}
            onSelectSystem={setActiveSystemId}
          />
        </section>

        {/* ====================================================================
          SECTION 3: VERIFIED DEVELOPER CONTRIBUTORS & ECOSYSTEM PULSE
          (Peringkat Commits, Pull Requests & Matriks Distribusi)
          ==================================================================== */}
        <section
          id="contributors"
          className="contributors-section"
          aria-labelledby="contributors-heading"
        >
          <div className="section-header">
            <div>
              <span className="section-pill-tag">AKTIVITAS & KONTRIBUSI DEVELOPER</span>
              <h2 id="contributors-heading" className="section-title">
                Built by code<span className="text-accent">.</span>
              </h2>
              <p className="section-subtitle">
                Transparansi kontribusi 20 kontributor aktif pada default branch dan pull request lintas 8 repositori terpadu.
              </p>
            </div>
            <div className="contributors-badge-wrap">
              <span className="team-total-badge">
                2.265 COMMITS · 247 PR · 7 REPOSITORI
              </span>
            </div>
          </div>

          {/* 4 Ecosystem Metric Highlight Cards */}
          <div className="ecosystem-stats-grid">
            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-kicker">TOTAL COMMITS</span>
                <GitCommit size={20} className="stat-icon" />
              </div>
              <strong className="stat-number">2.265</strong>
              <span className="stat-detail">Branch default terverifikasi di 7 repositori inti</span>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-kicker">PULL REQUESTS</span>
                <GitPullRequest size={20} className="stat-icon text-accent2" />
              </div>
              <strong className="stat-number">247</strong>
              <span className="stat-detail">Kolaborasi branch, code review & merge sistem</span>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-kicker">REPOSITORI TERPADU</span>
                <GitBranch size={20} className="stat-icon" />
              </div>
              <strong className="stat-number">7</strong>
              <span className="stat-detail">Backend, Praktikum, Inventaris, Reservasi, dll.</span>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-kicker">KONTRIBUTOR TERLIBAT</span>
                <UsersThree size={20} className="stat-icon" />
              </div>
              <strong className="stat-number">20 / 22</strong>
              <span className="stat-detail">Developer & asisten kontributor aktif</span>
            </div>
          </div>

          {/* Tab Navigation for Contributors Section */}
          <div className="contributors-nav-tabs" role="tablist" aria-label="Menu Tampilan Kontribusi">
            <button
              type="button"
              className={`contrib-tab ${contributorTab === "leaderboard" ? "is-active" : ""}`}
              onClick={() => setContributorTab("leaderboard")}
            >
              <Trophy size={16} />
              <span>Papan Peringkat (Leaderboard)</span>
            </button>
            <button
              type="button"
              className={`contrib-tab ${contributorTab === "matrix" ? "is-active" : ""}`}
              onClick={() => setContributorTab("matrix")}
            >
              <ChartBar size={16} />
              <span>Matriks Distribusi (Heatmap)</span>
            </button>
            <button
              type="button"
              className={`contrib-tab ${contributorTab === "repos" ? "is-active" : ""}`}
              onClick={() => setContributorTab("repos")}
            >
              <GitBranch size={16} />
              <span>7 Repositori Inti</span>
            </button>
          </div>

          {/* TAB 1: LEADERBOARD */}
          {contributorTab === "leaderboard" && (
            <div className="contrib-panel leaderboard-panel">
              <div className="leaderboard-toolbar">
                <div className="toolbar-info">
                  <span className="toolbar-title">
                    {leaderboardMetric === "commits"
                      ? "Peringkat Commit Branch Default"
                      : "Peringkat Aktivitas Pull Request"}
                  </span>
                  <span className="toolbar-desc">
                    {leaderboardMetric === "commits"
                      ? "Kontribusi kode langsung yang telah masuk ke branch default repositori."
                      : "Aktivitas pull request untuk integrasi fitur, refactor, dan review kode."}
                  </span>
                </div>
                <div className="metric-toggle-group">
                  <button
                    type="button"
                    className={`metric-toggle-btn ${leaderboardMetric === "commits" ? "is-active" : ""}`}
                    onClick={() => setLeaderboardMetric("commits")}
                  >
                    <GitCommit size={14} />
                    <span>Commits (2.265)</span>
                  </button>
                  <button
                    type="button"
                    className={`metric-toggle-btn ${leaderboardMetric === "prs" ? "is-active" : ""}`}
                    onClick={() => setLeaderboardMetric("prs")}
                  >
                    <GitPullRequest size={14} />
                    <span>Pull Requests (247)</span>
                  </button>
                </div>
              </div>

              <div className="leaderboard-list">
                {(leaderboardMetric === "commits" ? getTopCommitters() : getTopPRContributors()).map(
                  (c, idx) => {
                    const member = teamConfig.find((m) => m.id === c.memberId) || {
                      name: c.username,
                      role: "Kontributor",
                      image: "/images/iclabs-logo.png",
                    };
                    const maxVal = leaderboardMetric === "commits" ? 602 : 126;
                    const curVal = leaderboardMetric === "commits" ? c.commits : c.prs;
                    const percent = Math.max((curVal / maxVal) * 100, 3);
                    const isTopThree = idx < 3;

                    return (
                      <div
                        key={c.memberId}
                        className={`leaderboard-row ${c.memberId === selectedMember.id ? "is-selected" : ""}`}
                        onClick={() => setSelectedMemberId(c.memberId)}
                      >
                        <div className={`leaderboard-rank ${isTopThree ? `is-top-${idx + 1}` : ""}`}>
                          {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                        </div>

                        <div className="leaderboard-user-info">
                          <div className="leaderboard-avatar-wrap">
                            <img
                              src={encodeURI(getAssetUrl(member.image))}
                              alt=""
                              className="leaderboard-avatar"
                            />
                          </div>
                          <div className="leaderboard-names">
                            <strong className="leaderboard-name">{member.name}</strong>
                            <span className="leaderboard-sub">
                              @{c.username} · {member.role}
                            </span>
                          </div>
                        </div>

                        <div className="leaderboard-bar-container">
                          <div className="leaderboard-track">
                            <div
                              className={`leaderboard-bar-fill ${leaderboardMetric === "prs" ? "is-pr-bar" : ""}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          {c.breakdown && c.breakdown.length > 0 && (
                            <div className="leaderboard-repo-tags">
                              {c.breakdown.slice(0, 3).map((b) => (
                                <span key={b.repo} className="micro-repo-tag">
                                  {b.shortName}: {b.commits}c
                                </span>
                              ))}
                              {c.breakdown.length > 3 && (
                                <span className="micro-repo-tag is-more">
                                  +{c.breakdown.length - 3} repo
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="leaderboard-score-column">
                          <strong className="score-number">{curVal.toLocaleString()}</strong>
                          <span className="score-label">
                            {leaderboardMetric === "commits" ? "Commits" : "PRs"}
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* TAB 2: HEATMAP MATRIX */}
          {contributorTab === "matrix" && (
            <div className="contrib-panel matrix-panel">
              <div className="matrix-header-info">
                <span className="matrix-note">
                  Intensitas warna cyan merepresentasikan volume commit pada branch default tiap repositori
                  (skala logaritmik).
                </span>
                <div className="matrix-legend">
                  <span className="legend-label">Skala Commit:</span>
                  <div className="legend-gradient-steps">
                    <span className="step-box step-0">0</span>
                    <span className="step-box step-1">1 - 10</span>
                    <span className="step-box step-2">11 - 50</span>
                    <span className="step-box step-3">51 - 200</span>
                    <span className="step-box step-4">200+</span>
                  </div>
                </div>
              </div>

              <div className="matrix-table-wrapper">
                <table className="matrix-table">
                  <thead>
                    <tr>
                      <th className="th-member">Contributor Developer</th>
                      {targetRepositories.map((repo) => (
                        <th key={repo.id} className="th-repo" title={`${repo.repoName} (Branch: ${repo.defaultBranch})`}>
                          <span className="th-repo-name">{repo.shortName}</span>
                          <span className="th-repo-branch">{repo.defaultBranch}</span>
                        </th>
                      ))}
                      <th className="th-total">Total Commit</th>
                      <th className="th-total">Total PR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamConfig
                      .map((member) => ({
                        member,
                        contrib: getMemberContribution(member.id),
                      }))
                      .sort((a, b) => b.contrib.commits - a.contrib.commits || b.contrib.prs - a.contrib.prs)
                      .map(({ member, contrib }) => {
                        const repoMap = {};
                        contrib.breakdown.forEach((b) => {
                          repoMap[b.repo] = b.commits;
                        });

                        return (
                          <tr
                            key={member.id}
                            className={`matrix-row ${member.id === selectedMember.id ? "is-selected" : ""}`}
                            onClick={() => setSelectedMemberId(member.id)}
                          >
                            <td className="td-member">
                              <div className="matrix-member-cell">
                                <div className="matrix-member-thumb-wrap">
                                  <img
                                    src={encodeURI(getAssetUrl(member.image))}
                                    alt=""
                                    className="matrix-member-thumb"
                                  />
                                </div>
                                <div className="matrix-member-copy">
                                  <strong>{member.name}</strong>
                                  <small>@{contrib.username || member.nickname}</small>
                                </div>
                              </div>
                            </td>

                            {targetRepositories.map((repo) => {
                              const count = repoMap[repo.repoName] || 0;
                              let cellClass = "cell-zero";
                              if (count > 200) cellClass = "cell-tier-4";
                              else if (count > 50) cellClass = "cell-tier-3";
                              else if (count > 10) cellClass = "cell-tier-2";
                              else if (count > 0) cellClass = "cell-tier-1";

                              return (
                                <td key={repo.id} className={`td-heat ${cellClass}`}>
                                  <span className="cell-value">{count > 0 ? count : "·"}</span>
                                </td>
                              );
                            })}

                            <td className="td-total">
                              <strong>{contrib.commits > 0 ? contrib.commits : 0}</strong>
                            </td>
                            <td className="td-total is-pr-col">
                              <span>{contrib.prs > 0 ? contrib.prs : 0}</span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                  <tfoot>
                    <tr className="matrix-footer-row">
                      <td className="td-member-foot">Total Per Repositori</td>
                      {targetRepositories.map((repo) => (
                        <td key={repo.id} className="td-repo-foot">
                          <strong>{repo.totalCommits}</strong>
                        </td>
                      ))}
                      <td className="td-total-foot">
                        <strong>2.265</strong>
                      </td>
                      <td className="td-total-foot is-pr-col">
                        <strong>247</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: 7 REPOSITORIES OVERVIEW */}
          {contributorTab === "repos" && (
            <div className="contrib-panel repos-panel">
              <div className="repos-grid">
                {targetRepositories.map((repo) => {
                  const contributorsInRepo = teamConfig
                    .map((m) => {
                      const c = getMemberContribution(m.id);
                      const b = c.breakdown.find((item) => item.repo === repo.repoName);
                      return { member: m, commits: b ? b.commits : 0 };
                    })
                    .filter((item) => item.commits > 0)
                    .sort((a, b) => b.commits - a.commits);

                  return (
                    <article key={repo.id} className="repo-card">
                      <div className="repo-card-top">
                        <div>
                          <span className="repo-badge">{repo.shortName}</span>
                          <h4 className="repo-title">{repo.displayName}</h4>
                        </div>
                        <span className="repo-branch-tag">branch: {repo.defaultBranch}</span>
                      </div>

                      <p className="repo-description">{repo.description}</p>

                      <div className="repo-stats-row">
                        <div className="repo-stat-item">
                          <span className="stat-label">Total Commits:</span>
                          <strong className="stat-value">{repo.totalCommits}</strong>
                        </div>
                        <div className="repo-stat-item">
                          <span className="stat-label">Kontributor:</span>
                          <strong className="stat-value">{contributorsInRepo.length} personel</strong>
                        </div>
                      </div>

                      <div className="repo-contributors-block">
                        <span className="contrib-label">Kontributor Utama:</span>
                        <div className="repo-contributors-avatars">
                          {contributorsInRepo.map((item) => (
                            <button
                              key={item.member.id}
                              type="button"
                              className="repo-contrib-avatar-btn"
                              title={`${item.member.name}: ${item.commits} commit`}
                              onClick={() => setSelectedMemberId(item.member.id)}
                            >
                              <img
                                src={encodeURI(getAssetUrl(item.member.image))}
                                alt={item.member.name}
                                className="contrib-avatar-img"
                              />
                              <span className="contrib-pill-count">{item.commits}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="repo-card-footer">
                        <a
                          href={repo.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="repo-external-link"
                        >
                          <GithubLogo size={14} weight="fill" />
                          <span>Buka Repositori GitHub ↗</span>
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* ====================================================================
          SECTION 4: COMPLETE TEAM DIRECTORY (22 Members Profiles)
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
                  src={encodeURI(getAssetUrl(selectedMember.image))}
                  alt={`Foto resmi ${selectedMember.name}`}
                  loading="lazy"
                  className="spotlight-photo"
                />
              </div>
              <div className="spotlight-details">
                <div className="spotlight-header-meta">
                  <span className="spotlight-status">
                    {selectedMember.isLead ? "Lead & System Architect" : "Contributor Developer"}
                  </span>
                  <span className="spotlight-tier-tag">
                    Baris {selectedMember.row} · Posisi #{selectedMember.rowPosition}
                  </span>
                </div>
                <h3 className="spotlight-name">{selectedMember.name}</h3>
                <p className="spotlight-role">{selectedMember.role}</p>

                {/* Data Kontribusi Git 7 Repositori */}
                <div className="spotlight-git-block">
                  <div className="spotlight-git-top">
                    <span className="jobs-block-label">Aktivitas Git (7 Repos Inti):</span>
                    {selectedContrib.username && (
                      <a
                        href={`https://github.com/${selectedContrib.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="spotlight-git-user-link"
                      >
                        <GithubLogo size={13} weight="fill" />
                        <span>@{selectedContrib.username}</span>
                      </a>
                    )}
                  </div>

                  <div className="spotlight-git-metrics-grid">
                    <div className="spotlight-git-metric">
                      <div className="metric-header">
                        <GitCommit size={14} className="text-accent" />
                        <span className="metric-number">{selectedContrib.commits}</span>
                      </div>
                      <span className="metric-tag">Commits</span>
                    </div>
                    <div className="spotlight-git-metric">
                      <div className="metric-header">
                        <GitPullRequest size={14} className="text-accent" />
                        <span className="metric-number">{selectedContrib.prs}</span>
                      </div>
                      <span className="metric-tag">Pull Requests</span>
                    </div>
                    <div className="spotlight-git-metric">
                      <div className="metric-header">
                        <GitBranch size={14} className="text-accent" />
                        <span className="metric-number">{selectedContrib.repoCount}</span>
                      </div>
                      <span className="metric-tag">Repositori</span>
                    </div>
                  </div>

                  {selectedContrib.breakdown && selectedContrib.breakdown.length > 0 && (
                    <div className="spotlight-repo-chips-wrap">
                      {selectedContrib.breakdown.map((item) => (
                        <span
                          key={item.repo}
                          className="spotlight-repo-chip"
                          title={`${item.repo} (${item.branch})`}
                        >
                          <span className="chip-name">{item.shortName}</span>
                          <span className="chip-count">{item.commits}c</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Data Sosial Media */}
                {selectedMember.socials &&
                  Object.values(selectedMember.socials).some((val) => Boolean(val)) && (
                    <div className="spotlight-socials-block">
                      <span className="socials-block-label">Sosial Media:</span>
                      <div className="socials-links-wrap">
                        {selectedMember.socials.website && (
                          <a
                            href={selectedMember.socials.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-btn social-btn-website"
                            aria-label={`Website & Portofolio ${selectedMember.name}`}
                          >
                            <Globe size={16} weight="bold" />
                            <span>Website</span>
                          </a>
                        )}
                        {selectedMember.socials.github && (
                          <a
                            href={selectedMember.socials.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-btn"
                            aria-label="GitHub"
                          >
                            <GithubLogo size={16} weight="fill" />
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

            {/* Full Roster Column */}
            <div className="roster-column">
              <div className="roster-filter-toolbar">
                <span className="roster-filter-label">Filter Kontributor:</span>
                <div className="roster-filter-pills">
                  <button
                    type="button"
                    className={`roster-filter-btn ${rosterFilter === "all" ? "is-active" : ""}`}
                    onClick={() => setRosterFilter("all")}
                  >
                    Semua ({teamConfig.length})
                  </button>
                  <button
                    type="button"
                    className={`roster-filter-btn ${rosterFilter === "top-commits" ? "is-active" : ""}`}
                    onClick={() => setRosterFilter("top-commits")}
                  >
                    <GitCommit size={13} />
                    Top Commits
                  </button>
                  <button
                    type="button"
                    className={`roster-filter-btn ${rosterFilter === "top-prs" ? "is-active" : ""}`}
                    onClick={() => setRosterFilter("top-prs")}
                  >
                    <GitPullRequest size={13} />
                    Top PR
                  </button>
                </div>
              </div>

              {/* Full Roster Grid */}
              <div className="roster-grid" role="list" aria-label="Daftar asisten ICLabs">
                {teamConfig
                  .filter((member) => {
                    const contrib = getMemberContribution(member.id);
                    if (rosterFilter === "top-commits") return contrib.commits > 0;
                    if (rosterFilter === "top-prs") return contrib.prs > 0;
                    return true;
                  })
                  .sort((a, b) => {
                    if (rosterFilter === "top-commits") {
                      return getMemberContribution(b.id).commits - getMemberContribution(a.id).commits;
                    }
                    if (rosterFilter === "top-prs") {
                      return getMemberContribution(b.id).prs - getMemberContribution(a.id).prs;
                    }
                    return 0;
                  })
                  .map((member) => {
                    const isCurrent = member.id === selectedMember.id;
                    const contrib = getMemberContribution(member.id);
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
                            src={encodeURI(getAssetUrl(member.image))}
                            alt=""
                            loading="lazy"
                            className="roster-thumb"
                          />
                        </div>
                        <div className="roster-card-info">
                          <div className="roster-card-topline">
                            <strong className="roster-member-name">{member.name}</strong>
                            {contrib.commits > 0 ? (
                              <span className="roster-metric-tag" title={`${contrib.commits} commits di branch default`}>
                                {contrib.commits}c
                              </span>
                            ) : contrib.prs > 0 ? (
                              <span className="roster-metric-tag is-pr" title={`${contrib.prs} Pull Requests`}>
                                {contrib.prs} PR
                              </span>
                            ) : null}
                          </div>
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
          </div>
        </section>

        {/* ====================================================================
          SECTION 5: ABOUT LAB
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
    </>
  );
}
