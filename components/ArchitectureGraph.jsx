"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ArrowSquareOut,
  ArrowsClockwise,
  Globe,
  LockSimple,
  Pause,
  Play,
  X,
} from "@phosphor-icons/react";
import {
  architectureZones,
  architectureGraphNodes,
  architectureGraphEdges,
  architectureScenarios,
  SUMBER_DAYA_APPS_API,
  apiApplicationsCatalog,
  nodePortalExtras,
} from "../lib/architecture";

const CATEGORY_COLORS = {
  "database-replica": {
    stroke: "#f87171",
    bg: "rgba(22, 13, 17, 0.94)",
    iconBg: "rgba(248, 113, 113, 0.14)",
  },
  "database-main": {
    stroke: "#38bdf8",
    bg: "rgba(10, 20, 30, 0.94)",
    iconBg: "rgba(56, 189, 248, 0.14)",
  },
  api: {
    stroke: "#5ce1e6",
    bg: "rgba(10, 22, 30, 0.94)",
    iconBg: "rgba(92, 225, 230, 0.14)",
  },
  storage: {
    stroke: "#fb7185",
    bg: "rgba(24, 13, 19, 0.94)",
    iconBg: "rgba(251, 113, 133, 0.14)",
  },
  security: {
    stroke: "#fb923c",
    bg: "rgba(26, 16, 9, 0.94)",
    iconBg: "rgba(251, 146, 60, 0.15)",
  },
  proxy: {
    stroke: "#5ce1e6",
    bg: "rgba(12, 34, 52, 0.96)",
    iconBg: "rgba(92, 225, 230, 0.18)",
  },
  client: {
    stroke: "#34d399",
    bg: "rgba(10, 22, 18, 0.94)",
    iconBg: "rgba(52, 211, 153, 0.13)",
  },
};

function mapApiCodeToNodeId(app) {
  const code = (app.kode_aplikasi || "").toUpperCase();
  const url = (app.url || "").toLowerCase();
  if (code === "ICLABS-PRAKTIKUM" || url.includes("/praktikum")) return "client-praktikum";
  if (code === "MA" || url.includes("monitoring-asisten")) return "client-monitoring";
  if (code === "INVENTARIS" || url.includes("/inventaris")) return "client-inventaris";
  if (code === "PENDAFTARAN_ASISTEN" || url.includes("/registrasi")) return "client-registrasi";
  if (code === "PEMINJAMAN_LAB" || url.includes("peminjaman-ruangan")) return "client-peminjaman";
  if (
    code === "ADMINISTRASI_PRAKTIKUM" ||
    code === "MP" ||
    code === "SERTIFICATION_CENTER" ||
    url.includes("sipemla") ||
    url.includes("monitoring-praktikum") ||
    url.includes("certification")
  ) {
    return "client-legacy";
  }
  return "client-sumber-daya";
}

function ContainerIcon({ type, color, cx, cy }) {
  switch (type) {
    case "database":
      return (
        <g transform={`translate(${cx - 9}, ${cy - 9})`} stroke={color} strokeWidth="1.6" fill="none">
          <ellipse cx="9" cy="4" rx="7" ry="2.6" />
          <path d="M 2 4 L 2 14 C 2 15.6 5.1 16.6 9 16.6 C 12.9 16.6 16 15.6 16 14 L 16 4" />
          <path d="M 2 9 C 2 10.6 5.1 11.6 9 11.6 C 12.9 11.6 16 10.6 16 9" />
        </g>
      );
    case "container":
      return (
        <g transform={`translate(${cx - 9}, ${cy - 8})`} fill="none" stroke={color} strokeWidth="1.45">
          <rect x="2" y="2" width="6" height="5" rx="1" />
          <rect x="10" y="2" width="6" height="5" rx="1" />
          <rect x="2" y="9" width="6" height="5" rx="1" />
          <rect x="10" y="9" width="6" height="5" rx="1" />
        </g>
      );
    case "storage":
      return (
        <g transform={`translate(${cx - 9}, ${cy - 9})`} fill="none" stroke={color} strokeWidth="1.5">
          <path d="M 3 5 L 9 2 L 15 5 L 15 13 L 9 16 L 3 13 Z" />
          <path d="M 3 5 L 9 8 L 15 5" />
          <line x1="9" y1="8" x2="9" y2="16" />
        </g>
      );
    case "shield":
      return (
        <g transform={`translate(${cx - 9}, ${cy - 9})`} fill="none" stroke={color} strokeWidth="1.6">
          <path d="M 9 2 L 15.5 4.5 V 9.5 C 15.5 13.5 12.5 16 9 17 C 5.5 16 2.5 13.5 2.5 9.5 V 4.5 Z" />
          <path d="M 6.5 9.5 L 8.5 11.5 L 12 7.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "proxy":
      return (
        <g transform={`translate(${cx - 10}, ${cy - 10})`} fill="none" stroke={color} strokeWidth="1.6">
          <polygon points="10,1.5 18.5,10 10,18.5 1.5,10" />
          <circle cx="10" cy="10" r="2.6" fill={color} />
        </g>
      );
    default:
      return (
        <g transform={`translate(${cx - 8}, ${cy - 8})`} fill="none" stroke={color} strokeWidth="1.5">
          <rect x="1.5" y="2.5" width="13" height="11" rx="2" />
          <line x1="1.5" y1="6" x2="14.5" y2="6" />
        </g>
      );
  }
}

export default function ArchitectureGraph({ activeSystem, onSelectSystem }) {
  const [selectedNodeId, setSelectedNodeId] = useState("caddy");
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [activeScenarioId, setActiveScenarioId] = useState("all");
  const [isAnimating, setIsAnimating] = useState(true);

  // Katalog Aplikasi dari API https://iclabs.fikom.umi.ac.id/api/v1/sumber-daya/aplikasi
  const [liveApps, setLiveApps] = useState(apiApplicationsCatalog);
  const [modalNodeId, setModalNodeId] = useState(null);
  const [activeAppIndex, setActiveAppIndex] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Sinkronisasi API live secara silent (aman jika same-origin di iclabs.fikom.umi.ac.id/dev)
  useEffect(() => {
    let cancelled = false;
    fetch(SUMBER_DAYA_APPS_API, { mode: "cors" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled && json && Array.isArray(json.data) && json.data.length > 0) {
          setLiveApps(
            json.data.map((app) => ({
              ...app,
              nodeId: mapApiCodeToNodeId(app),
            }))
          );
        }
      })
      .catch(() => {
        // Fallback otomatis memakai apiApplicationsCatalog
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Sinkronisasi ketika tab sistem di Hero berubah
  useEffect(() => {
    if (!activeSystem) return;
    setSelectedNodeId((prevId) => {
      const prevNode = architectureGraphNodes.find((n) => n.id === prevId);
      if (prevNode?.systemIds?.includes(activeSystem.id)) {
        return prevId;
      }
      const clientMatch = architectureGraphNodes.find(
        (n) => n.systemIds?.includes(activeSystem.id) && n.category === "client"
      );
      if (clientMatch) return clientMatch.id;
      const anyMatch = architectureGraphNodes.find((n) =>
        n.systemIds?.includes(activeSystem.id)
      );
      return anyMatch ? anyMatch.id : prevId;
    });
  }, [activeSystem]);

  // Tutup modal dengan tombol Escape & kunci scroll saat modal terbuka
  useEffect(() => {
    if (!modalNodeId) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setModalNodeId(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalNodeId]);

  const getAppsForNode = useMemo(() => {
    return (nodeId) => {
      const fromApi = liveApps.filter((app) => app.nodeId === nodeId);
      const extras = nodePortalExtras[nodeId] || [];
      const merged = [...fromApi, ...extras];
      const seen = new Set();
      return merged.filter((item) => {
        if (seen.has(item.url)) return false;
        seen.add(item.url);
        return true;
      });
    };
  }, [liveApps]);

  const effectiveNodeId = hoveredNodeId || selectedNodeId;

  const { connectedEdgeIds, connectedNodeIds } = useMemo(() => {
    const edgeSet = new Set();
    const nodeSet = new Set();

    if (effectiveNodeId) {
      nodeSet.add(effectiveNodeId);
      architectureGraphEdges.forEach((edge) => {
        if (edge.from === effectiveNodeId || edge.to === effectiveNodeId) {
          edgeSet.add(edge.id);
          nodeSet.add(edge.from);
          nodeSet.add(edge.to);
        }
      });
    }

    return { connectedEdgeIds: edgeSet, connectedNodeIds: nodeSet };
  }, [effectiveNodeId]);

  const handleNodeClick = (node) => {
    setSelectedNodeId(node.id);
    if (onSelectSystem && node.systemIds && node.systemIds.length > 0) {
      onSelectSystem(node.systemIds[0]);
    }
    if (node.category === "client") {
      setModalNodeId(node.id);
      setActiveAppIndex(0);
      setIframeLoaded(false);
      setIframeKey((k) => k + 1);
    }
  };

  const handleScenarioChange = (scenarioId) => {
    setActiveScenarioId(scenarioId);
    if (scenarioId === "security") {
      setSelectedNodeId("wazuh");
    } else if (scenarioId === "storage") {
      setSelectedNodeId("minio-1");
    } else if (scenarioId === "replication") {
      setSelectedNodeId("db-main");
    } else if (scenarioId === "request") {
      setSelectedNodeId("caddy");
    }
  };

  const hoveredNode = hoveredNodeId
    ? architectureGraphNodes.find((n) => n.id === hoveredNodeId)
    : null;
  const hoveredApps =
    hoveredNode && hoveredNode.category === "client"
      ? getAppsForNode(hoveredNode.id)
      : [];

  const modalNode = modalNodeId
    ? architectureGraphNodes.find((n) => n.id === modalNodeId)
    : null;
  const modalApps = modalNode ? getAppsForNode(modalNode.id) : [];
  const activeModalApp = modalApps[activeAppIndex] || modalApps[0] || null;

  const uniqueColors = ["#34d399", "#5ce1e6", "#fb923c", "#fb7185", "#f43f5e", "#38bdf8", "#f87171"];

  return (
    <div className="arch-topology-wrapper">
      {/* Toolbar Simulasi Flow */}
      <div className="arch-toolbar">
        <div className="arch-scenario-tabs" role="tablist" aria-label="Simulasi Aliran Data Arsitektur">
          {architectureScenarios.map((scenario) => {
            const isActive = scenario.id === activeScenarioId;
            return (
              <button
                key={scenario.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`arch-scenario-btn ${isActive ? "is-active" : ""}`}
                onClick={() => handleScenarioChange(scenario.id)}
              >
                <span className="scenario-dot" aria-hidden="true" />
                <span>{scenario.label}</span>
              </button>
            );
          })}
        </div>

        <div className="arch-toolbar-controls">
          <button
            type="button"
            className={`arch-control-btn ${isAnimating ? "is-playing" : ""}`}
            onClick={() => setIsAnimating((prev) => !prev)}
            title={isAnimating ? "Jeda animasi paket data" : "Putar animasi paket data"}
          >
            {isAnimating ? <Pause size={14} weight="fill" /> : <Play size={14} weight="fill" />}
            <span>{isAnimating ? "Animasi Aktif" : "Animasi Dijeda"}</span>
          </button>
        </div>
      </div>

      {/* FULL-WIDTH CONTAINERIZED ARCHITECTURE CANVAS */}
      <div className="arch-canvas-shell">
        <div className="arch-svg-scroll">
          <svg
            viewBox="0 0 1200 760"
            className="arch-topology-svg"
            role="img"
            aria-label="Diagram Topologi Container Ekosistem ICLabs"
          >
            <defs>
              <filter id="topo-packet-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="3.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="topo-node-glow" x="-25%" y="-25%" width="150%" height="150%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {uniqueColors.map((col) => {
                const safeId = col.replace("#", "");
                return (
                  <marker
                    key={col}
                    id={`arrow-${safeId}`}
                    viewBox="0 0 10 10"
                    refX="8.2"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.3 L 8.8 5 L 0 8.7 z" fill={col} />
                  </marker>
                );
              })}
            </defs>

            {/* LAYER 0: CLOUD / CONTAINER DEPLOYMENT ZONES */}
            <g className="topo-zones-layer" aria-hidden="true">
              {architectureZones.map((zone) => {
                const tagW = zone.title.length * 6.4 + 22;
                return (
                  <g key={zone.id}>
                    <rect
                      x={zone.x}
                      y={zone.y}
                      width={zone.width}
                      height={zone.height}
                      rx="14"
                      fill="rgba(10, 17, 24, 0.52)"
                      stroke={zone.color}
                      strokeWidth="1"
                      strokeOpacity="0.34"
                      strokeDasharray="6 5"
                    />
                    <rect
                      x={zone.x + 14}
                      y={zone.y - 9}
                      width={tagW}
                      height="18"
                      rx="5"
                      fill="#080d12"
                      stroke={zone.color}
                      strokeOpacity="0.4"
                      strokeWidth="0.9"
                    />
                    <text
                      x={zone.x + 25}
                      y={zone.y + 3}
                      fill={zone.color}
                      fillOpacity="0.95"
                      fontSize="9.5"
                      fontWeight="800"
                      letterSpacing="1"
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      {zone.title}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* LAYER 1: ROUNDED ORTHOGONAL CONNECTORS & ANIMATED DATA PACKETS */}
            <g className="topo-edges-layer">
              {architectureGraphEdges.map((edge) => {
                const inScenario = edge.scenarios.includes(activeScenarioId);
                const isConnected =
                  !effectiveNodeId ||
                  activeScenarioId !== "all" ||
                  connectedEdgeIds.has(edge.id);

                const isHighlighted =
                  inScenario &&
                  (connectedEdgeIds.has(edge.id) || activeScenarioId !== "all");

                const opacity = !inScenario
                  ? 0.1
                  : hoveredNodeId
                    ? connectedEdgeIds.has(edge.id)
                      ? 1
                      : 0.16
                    : isConnected
                      ? 0.92
                      : 0.25;

                const markerId = `url(#arrow-${edge.color.replace("#", "")})`;
                const packetCount = edge.packetCount || 1;
                const baseDur = parseFloat(edge.dur || "2.4");

                return (
                  <g
                    key={edge.id}
                    className={`topo-edge-group ${isHighlighted ? "is-highlighted" : ""}`}
                    style={{ opacity }}
                  >
                    {isHighlighted && (
                      <path
                        d={edge.d}
                        fill="none"
                        stroke={edge.color}
                        strokeWidth="5"
                        strokeOpacity="0.14"
                        strokeLinecap="round"
                      />
                    )}

                    <path
                      d={edge.d}
                      fill="none"
                      stroke={edge.color}
                      strokeWidth={isHighlighted ? "2" : "1.4"}
                      strokeDasharray={edge.dashed ? "6 5" : undefined}
                      strokeLinecap="round"
                      markerEnd={markerId}
                    />

                    {isAnimating && inScenario && (
                      <path
                        d={edge.d}
                        fill="none"
                        stroke={edge.color}
                        strokeWidth="2.1"
                        strokeDasharray="4 14"
                        strokeLinecap="round"
                        className="topo-stream-dash"
                        style={{ opacity: isHighlighted ? 0.85 : 0.4 }}
                      />
                    )}

                    {isAnimating &&
                      inScenario &&
                      Array.from({ length: packetCount }).map((_, idx) => {
                        const delaySec = ((baseDur / packetCount) * idx).toFixed(2);
                        return (
                          <g key={`${edge.id}-pkt-${idx}`} filter="url(#topo-packet-glow)">
                            <circle r={isHighlighted ? 4.2 : 3.2} fill={edge.color}>
                              <animateMotion
                                path={edge.d}
                                dur={`${baseDur}s`}
                                begin={`${delaySec}s`}
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle r={isHighlighted ? 1.7 : 1.2} fill="#ffffff">
                              <animateMotion
                                path={edge.d}
                                dur={`${baseDur}s`}
                                begin={`${delaySec}s`}
                                repeatCount="indefinite"
                              />
                            </circle>
                          </g>
                        );
                      })}

                    {edge.labelPos && (
                      <g
                        transform={`translate(${edge.labelPos.x}, ${edge.labelPos.y})`}
                        className="topo-edge-label"
                      >
                        {(() => {
                          const boxW = Math.max(44, edge.label.length * 6.8 + 18);
                          return (
                            <rect
                              x={-boxW / 2}
                              y="-10"
                              width={boxW}
                              height="20"
                              rx="5"
                              fill="rgba(6, 10, 13, 0.94)"
                              stroke={edge.color}
                              strokeWidth="0.9"
                              strokeOpacity="0.65"
                            />
                          );
                        })()}
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={edge.color}
                          fontSize="9.2"
                          fontWeight="700"
                          fontFamily="'JetBrains Mono', monospace"
                        >
                          {edge.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>

            {/* LAYER 2: GLASSMORPHIC CONTAINER NODES */}
            <g className="topo-nodes-layer">
              {architectureGraphNodes.map((node) => {
                const theme = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.api;
                const isSelected = node.id === selectedNodeId;
                const isHovered = node.id === hoveredNodeId;
                const isRelated = connectedNodeIds.has(node.id);
                const isDimmed = hoveredNodeId && !isRelated;

                const left = node.x - node.width / 2;
                const top = node.y - node.height / 2;
                const isCompact = node.category === "client";
                const iconBoxX = left + (isCompact ? 12 : 16);
                const iconCenterX = iconBoxX + (isCompact ? 13 : 17);
                const textX = iconBoxX + (isCompact ? 34 : 44);

                return (
                  <g
                    key={node.id}
                    role="button"
                    tabIndex={0}
                    aria-label={
                      isCompact
                        ? `Preview aplikasi ${node.label}`
                        : `${node.label} — ${node.sublabel}`
                    }
                    aria-pressed={isSelected}
                    className={`topo-node-group ${isSelected ? "is-selected" : ""} ${isHovered ? "is-hovered" : ""}`}
                    style={{
                      opacity: isDimmed ? 0.3 : 1,
                      cursor: "pointer",
                    }}
                    onClick={() => handleNodeClick(node)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleNodeClick(node);
                      }
                    }}
                  >
                    {isSelected && (
                      <rect
                        x={left - 4}
                        y={top - 4}
                        width={node.width + 8}
                        height={node.height + 8}
                        rx="12"
                        fill="none"
                        stroke={theme.stroke}
                        strokeWidth="1.4"
                        strokeDasharray="5 4"
                      />
                    )}

                    <rect
                      x={left}
                      y={top}
                      width={node.width}
                      height={node.height}
                      rx="9"
                      fill={theme.bg}
                      stroke={isSelected || isHovered ? "#ffffff" : theme.stroke}
                      strokeOpacity={isSelected || isHovered ? 1 : 0.55}
                      strokeWidth={isSelected ? "2" : "1.4"}
                      filter={isSelected || isHovered ? "url(#topo-node-glow)" : undefined}
                    />

                    <rect
                      x={left + 12}
                      y={top}
                      width={node.width - 24}
                      height="3"
                      rx="1.5"
                      fill={theme.stroke}
                      opacity="0.9"
                    />

                    {isCompact ? (
                      <>
                        <g transform={`translate(${left + 11}, ${top + 9})`} fill="none" stroke={theme.stroke} strokeWidth="1.4" opacity="0.85">
                          <rect x="1" y="2" width="11" height="9" rx="1.8" />
                          <line x1="1" y1="5" x2="12" y2="5" />
                        </g>
                        <text
                          x={left + 28}
                          y={top + 17}
                          fill={theme.stroke}
                          fontSize="7.8"
                          fontWeight="800"
                          letterSpacing="0.8"
                          fontFamily="'JetBrains Mono', monospace"
                          opacity="0.85"
                        >
                          PREVIEW
                        </text>
                        <text
                          x={node.x}
                          y={node.y + 4}
                          textAnchor="middle"
                          fill="#f1f5f9"
                          fontSize={node.label.length > 17 ? "9.5" : "10.5"}
                          fontWeight="800"
                          fontFamily="'JetBrains Mono', monospace"
                        >
                          {node.label}
                        </text>
                        <text
                          x={node.x}
                          y={node.y + 20}
                          textAnchor="middle"
                          fill="#8ea1ae"
                          fontSize="8.8"
                          fontWeight="600"
                        >
                          {node.sublabel}
                        </text>
                      </>
                    ) : (
                      <>
                        <rect
                          x={iconBoxX}
                          y={node.y - 17}
                          width="34"
                          height="34"
                          rx="7"
                          fill={theme.iconBg}
                          stroke={theme.stroke}
                          strokeOpacity="0.4"
                          strokeWidth="1"
                        />
                        <ContainerIcon
                          type={node.icon}
                          color={theme.stroke}
                          cx={iconCenterX}
                          cy={node.y}
                        />
                        <text
                          x={textX}
                          y={top + 21}
                          fill={theme.stroke}
                          fontSize="8.5"
                          fontWeight="800"
                          letterSpacing="0.8"
                          fontFamily="'JetBrains Mono', monospace"
                        >
                          {node.tag}
                        </text>
                        <text
                          x={textX}
                          y={node.y + 4}
                          fill={node.category === "security" ? "#fdba74" : "#f1f5f9"}
                          fontSize={node.label.length > 16 ? "11.5" : "13"}
                          fontWeight="800"
                          fontFamily="'JetBrains Mono', monospace"
                        >
                          {node.label}
                        </text>
                        <text
                          x={textX}
                          y={node.y + 21}
                          fill="#94a3b8"
                          fontSize="10"
                          fontWeight="600"
                        >
                          {node.sublabel}
                        </text>
                      </>
                    )}

                    <circle
                      cx={left + node.width - 13}
                      cy={top + 13}
                      r="3.2"
                      fill={isCompact ? "#34d399" : theme.stroke}
                      opacity={isCompact ? "1" : "0.75"}
                    />
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* FLOATING HOVER QUICK-PREVIEW POPOVER (Hanya muncul saat hover portal aplikasi) */}
        {hoveredNode && hoveredApps.length > 0 && (
          <div
            className="arch-hover-popover"
            style={{
              left: `${Math.min(Math.max((hoveredNode.x / 1200) * 100, 14), 86)}%`,
            }}
            role="status"
            aria-live="polite"
          >
            <div className="hover-popover-top">
              <span className="hover-popover-code">
                {hoveredApps[0].kode_aplikasi}
              </span>
              <span className="hover-popover-hint">Klik untuk Preview</span>
            </div>
            <strong className="hover-popover-title">
              {hoveredApps[0].nama_aplikasi}
              {hoveredApps.length > 1 ? ` (+${hoveredApps.length - 1} modul)` : ""}
            </strong>
            <p className="hover-popover-desc">{hoveredApps[0].deskripsi}</p>
            <span className="hover-popover-url">
              {hoveredApps[0].url.replace(/^https?:\/\//, "")}
            </span>
          </div>
        )}
      </div>

      {/* MODAL PREVIEW APLIKASI (Sumber API: v1/sumber-daya/aplikasi) */}
      {modalNode && activeModalApp && (
        <div
          className="app-preview-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="app-preview-modal-title"
          onClick={() => setModalNodeId(null)}
        >
          <div
            className="app-preview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="preview-modal-header">
              <div className="preview-modal-title-group">
                <div className="preview-modal-badges">
                  <span className="preview-code-pill">
                    {activeModalApp.kode_aplikasi}
                  </span>
                  <span className="preview-status-pill">
                    ● AKTIF · {modalNode.label}
                  </span>
                </div>
                <h3 id="app-preview-modal-title" className="preview-modal-title">
                  {activeModalApp.nama_aplikasi}
                </h3>
                <p className="preview-modal-desc">{activeModalApp.deskripsi}</p>
              </div>

              <button
                type="button"
                className="preview-modal-close"
                onClick={() => setModalNodeId(null)}
                aria-label="Tutup preview aplikasi"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Multi-app tabs bila 1 node memiliki >1 aplikasi */}
            {modalApps.length > 1 && (
              <div className="preview-modal-tabs" role="tablist">
                {modalApps.map((app, idx) => (
                  <button
                    key={app.url}
                    type="button"
                    role="tab"
                    aria-selected={idx === activeAppIndex}
                    className={`preview-tab-btn ${idx === activeAppIndex ? "is-active" : ""}`}
                    onClick={() => {
                      setActiveAppIndex(idx);
                      setIframeLoaded(false);
                      setIframeKey((k) => k + 1);
                    }}
                  >
                    <span>{app.nama_aplikasi}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Simulated Browser Chrome + Live Iframe Preview */}
            <div className="preview-browser-shell">
              <div className="preview-browser-bar">
                <div className="browser-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="browser-url-pill">
                  <LockSimple size={12} weight="bold" className="text-accent" />
                  <span>{activeModalApp.url}</span>
                </div>
                <div className="browser-actions">
                  <button
                    type="button"
                    className="browser-action-btn"
                    onClick={() => {
                      setIframeLoaded(false);
                      setIframeKey((k) => k + 1);
                    }}
                    title="Muat ulang preview"
                  >
                    <ArrowsClockwise size={14} weight="bold" />
                  </button>
                  <a
                    href={activeModalApp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="browser-launch-btn"
                  >
                    <span>Buka Portal</span>
                    <ArrowSquareOut size={14} weight="bold" />
                  </a>
                </div>
              </div>

              <div className="preview-iframe-stage">
                {!iframeLoaded && (
                  <div className="preview-fallback-overlay">
                    <Globe size={34} weight="duotone" className="text-accent" />
                    <strong>{activeModalApp.nama_aplikasi}</strong>
                    <p>
                      Menghubungkan ke <code>{activeModalApp.url}</code>...
                    </p>
                    <a
                      href={activeModalApp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fallback-open-btn"
                    >
                      <span>Buka Langsung di Tab Baru</span>
                      <ArrowSquareOut size={15} weight="bold" />
                    </a>
                  </div>
                )}
                <iframe
                  key={`${activeModalApp.url}-${iframeKey}`}
                  src={activeModalApp.url}
                  title={`Preview ${activeModalApp.nama_aplikasi}`}
                  className={`preview-iframe ${iframeLoaded ? "is-loaded" : ""}`}
                  loading="lazy"
                  onLoad={() => setIframeLoaded(true)}
                />
              </div>
            </div>

            <div className="preview-modal-footer">
              <span className="preview-api-ref">
                Referensi API:{" "}
                <a
                  href={SUMBER_DAYA_APPS_API}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  iclabs.fikom.umi.ac.id/api/v1/sumber-daya/aplikasi ↗
                </a>
              </span>
              <span className="preview-kbd-hint">Tekan ESC untuk menutup</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
