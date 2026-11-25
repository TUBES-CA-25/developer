"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ArrowSquareOut,
  ArrowsLeftRight,
  Check,
  Cpu,
  Database,
  HardDrives,
  Pause,
  Play,
  Pulse,
  ShieldCheck,
  Sparkle,
  Stack,
} from "@phosphor-icons/react";
import {
  architectureGraphNodes,
  architectureGraphEdges,
  architectureScenarios,
} from "../lib/architecture";

const CATEGORY_COLORS = {
  "database-replica": {
    stroke: "#f87171",
    glow: "rgba(248, 113, 113, 0.45)",
    fillPattern: "url(#topo-hatch-db-rep)",
    badge: "REPLICA / FAILOVER",
  },
  "database-main": {
    stroke: "#38bdf8",
    glow: "rgba(56, 189, 248, 0.45)",
    fillPattern: "url(#topo-hatch-db-main)",
    badge: "PRIMARY SSOT",
  },
  api: {
    stroke: "#5ce1e6",
    glow: "rgba(92, 225, 230, 0.45)",
    fillPattern: "url(#topo-hatch-api)",
    badge: "API CLUSTER",
  },
  storage: {
    stroke: "#fb7185",
    glow: "rgba(251, 113, 133, 0.45)",
    fillPattern: "url(#topo-hatch-storage)",
    badge: "OBJECT STORAGE",
  },
  security: {
    stroke: "#fb923c",
    glow: "rgba(251, 146, 60, 0.5)",
    fillPattern: "url(#topo-hatch-security)",
    badge: "IDS / SIEM",
  },
  proxy: {
    stroke: "#5ce1e6",
    glow: "rgba(92, 225, 230, 0.55)",
    fillPattern: "url(#topo-hatch-proxy)",
    badge: "REVERSE PROXY",
  },
  client: {
    stroke: "#34d399",
    glow: "rgba(52, 211, 153, 0.45)",
    fillPattern: "url(#topo-hatch-client)",
    badge: "CLIENT PORTAL",
  },
};

function getCategoryIcon(category) {
  switch (category) {
    case "database-main":
    case "database-replica":
      return <Database size={16} weight="duotone" />;
    case "storage":
      return <HardDrives size={16} weight="duotone" />;
    case "security":
      return <ShieldCheck size={16} weight="duotone" />;
    case "proxy":
      return <ArrowsLeftRight size={16} weight="duotone" />;
    case "api":
      return <Cpu size={16} weight="duotone" />;
    default:
      return <Stack size={16} weight="duotone" />;
  }
}

export default function ArchitectureGraph({ activeSystem, onSelectSystem }) {
  const [selectedNodeId, setSelectedNodeId] = useState("caddy");
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [activeScenarioId, setActiveScenarioId] = useState("all");
  const [isAnimating, setIsAnimating] = useState(true);

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

  const syncedNodeId = selectedNodeId;

  const effectiveNodeId = hoveredNodeId || syncedNodeId;

  const activeScenario =
    architectureScenarios.find((s) => s.id === activeScenarioId) ||
    architectureScenarios[0];

  const inspectedNode =
    architectureGraphNodes.find((n) => n.id === syncedNodeId) ||
    architectureGraphNodes[0];

  // Kumpulan edge & node yang aktif sesuai skenario & node yang sedang difokuskan
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

  const incomingEdges = useMemo(
    () => architectureGraphEdges.filter((e) => e.to === inspectedNode.id),
    [inspectedNode.id]
  );

  const outgoingEdges = useMemo(
    () => architectureGraphEdges.filter((e) => e.from === inspectedNode.id),
    [inspectedNode.id]
  );

  const handleNodeClick = (node) => {
    setSelectedNodeId(node.id);
    if (onSelectSystem && node.systemIds && node.systemIds.length > 0) {
      onSelectSystem(node.systemIds[0]);
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

  const uniqueColors = ["#34d399", "#5ce1e6", "#fb923c", "#fb7185", "#f43f5e", "#38bdf8", "#f87171"];
  const inspectedTheme = CATEGORY_COLORS[inspectedNode.category] || CATEGORY_COLORS.api;

  return (
    <div className="arch-topology-wrapper">
      {/* Toolbar Simulasi Flow & Status */}
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

      {/* Banner Penjelasan Skenario Aktif */}
      <div className="arch-scenario-banner" aria-live="polite">
        <div className="scenario-banner-left">
          <span className="scenario-badge">{activeScenario.badge}</span>
          <p className="scenario-desc">{activeScenario.description}</p>
        </div>
        <div className="scenario-banner-right">
          <Pulse size={15} className="text-accent" />
          <span>{activeScenario.packetHint}</span>
        </div>
      </div>

      {/* Main Split: Graph Blueprint Canvas + Live Node Inspector */}
      <div className="arch-workspace-grid">
        {/* KANVAS GRAF TOPOLOGI INTERAKTIF */}
        <div className="arch-canvas-shell">
          <div className="arch-canvas-hud-top">
            <span className="canvas-hud-tag">
              <Sparkle size={13} weight="fill" className="text-accent" />
              KLIK NODE UNTUK INSPEKSI ALIRAN
            </span>
            <span className="canvas-hud-legend">
              <span><i className="legend-swatch is-client" /> Klien HTTPS</span>
              <span><i className="legend-swatch is-proxy" /> Reverse Proxy</span>
              <span><i className="legend-swatch is-security" /> Wazuh IDS (2-Way)</span>
              <span><i className="legend-swatch is-api" /> API Cluster</span>
              <span><i className="legend-swatch is-db" /> Database HA</span>
              <span><i className="legend-swatch is-storage" /> AIStor S3</span>
            </span>
          </div>

          <div className="arch-svg-scroll">
            <svg
              viewBox="0 0 1200 735"
              className="arch-topology-svg"
              role="img"
              aria-label="Diagram Topologi Arsitektur Ekosistem ICLabs"
            >
              <defs>
                {/* Glow filter untuk paket data bergerak & node fokus */}
                <filter id="topo-packet-glow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="3.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="topo-node-glow" x="-25%" y="-25%" width="150%" height="150%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Arrow markers untuk setiap warna jalur */}
                {uniqueColors.map((col) => {
                  const safeId = col.replace("#", "");
                  return (
                    <marker
                      key={col}
                      id={`arrow-${safeId}`}
                      viewBox="0 0 10 10"
                      refX="8.5"
                      refY="5"
                      markerWidth="6.5"
                      markerHeight="6.5"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1.2 L 9 5 L 0 8.8 z" fill={col} />
                    </marker>
                  );
                })}

                {/* Pola Cross-Hatch & Diagonal Hatch bergaya Sketsa Cyberpunk */}
                <pattern id="topo-hatch-db-rep" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="12" height="12" fill="rgba(24, 14, 18, 0.92)" />
                  <line x1="0" y1="0" x2="0" y2="12" stroke="rgba(248, 113, 113, 0.25)" strokeWidth="2" />
                  <line x1="0" y1="0" x2="12" y2="0" stroke="rgba(248, 113, 113, 0.2)" strokeWidth="1.5" />
                </pattern>

                <pattern id="topo-hatch-db-main" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="12" height="12" fill="rgba(10, 22, 34, 0.92)" />
                  <line x1="0" y1="0" x2="0" y2="12" stroke="rgba(56, 189, 248, 0.26)" strokeWidth="2" />
                  <line x1="0" y1="0" x2="12" y2="0" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1.5" />
                </pattern>

                <pattern id="topo-hatch-storage" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="12" height="12" fill="rgba(26, 14, 20, 0.92)" />
                  <line x1="0" y1="0" x2="0" y2="12" stroke="rgba(251, 113, 133, 0.25)" strokeWidth="2" />
                  <line x1="0" y1="0" x2="12" y2="0" stroke="rgba(251, 113, 133, 0.18)" strokeWidth="1.5" />
                </pattern>

                <pattern id="topo-hatch-api" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="10" height="10" fill="rgba(11, 23, 34, 0.94)" />
                  <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(92, 225, 230, 0.16)" strokeWidth="2" />
                </pattern>

                <pattern id="topo-hatch-security" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="10" height="10" fill="rgba(28, 17, 9, 0.94)" />
                  <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(251, 146, 60, 0.2)" strokeWidth="2" />
                </pattern>

                <pattern id="topo-hatch-client" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="10" height="10" fill="rgba(9, 24, 19, 0.94)" />
                  <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(52, 211, 153, 0.17)" strokeWidth="2" />
                </pattern>

                <pattern id="topo-hatch-proxy" width="16" height="16" patternUnits="userSpaceOnUse">
                  <rect width="16" height="16" fill="rgba(15, 52, 82, 0.94)" />
                  <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(92, 225, 230, 0.16)" strokeWidth="1" />
                </pattern>
              </defs>

              {/* LAYER 1: CONNECTOR EDGES & ANIMATED DATA PACKETS */}
              <g className="topo-edges-layer">
                {architectureGraphEdges.map((edge) => {
                  const inScenario = edge.scenarios.includes(activeScenarioId);
                  const isConnectedToSelected =
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
                        : 0.18
                      : isConnectedToSelected
                        ? 0.92
                        : 0.28;

                  const markerId = `url(#arrow-${edge.color.replace("#", "")})`;
                  const packetCount = edge.packetCount || 1;
                  const baseDur = parseFloat(edge.dur || "2.4");

                  return (
                    <g
                      key={edge.id}
                      className={`topo-edge-group ${isHighlighted ? "is-highlighted" : ""}`}
                      style={{ opacity }}
                    >
                      {/* Soft ambient under-glow path */}
                      {isHighlighted && (
                        <path
                          d={edge.d}
                          fill="none"
                          stroke={edge.color}
                          strokeWidth="5"
                          strokeOpacity="0.16"
                          strokeLinecap="round"
                        />
                      )}

                      {/* Base structural connector path */}
                      <path
                        d={edge.d}
                        fill="none"
                        stroke={edge.color}
                        strokeWidth={isHighlighted ? "2.1" : "1.5"}
                        strokeDasharray={edge.dashed ? "6 5" : undefined}
                        strokeLinecap="round"
                        markerEnd={markerId}
                      />

                      {/* Animated flowing stream overlay */}
                      {isAnimating && inScenario && (
                        <path
                          d={edge.d}
                          fill="none"
                          stroke={edge.color}
                          strokeWidth="2.2"
                          strokeDasharray="4 14"
                          strokeLinecap="round"
                          className="topo-stream-dash"
                          style={{ opacity: isHighlighted ? 0.85 : 0.45 }}
                        />
                      )}

                      {/* Moving glowing data packets along path */}
                      {isAnimating &&
                        inScenario &&
                        Array.from({ length: packetCount }).map((_, idx) => {
                          const delaySec = ((baseDur / packetCount) * idx).toFixed(2);
                          return (
                            <g key={`${edge.id}-pkt-${idx}`} filter="url(#topo-packet-glow)">
                              <circle r={isHighlighted ? 4.4 : 3.4} fill={edge.color}>
                                <animateMotion
                                  path={edge.d}
                                  dur={`${baseDur}s`}
                                  begin={`${delaySec}s`}
                                  repeatCount="indefinite"
                                />
                              </circle>
                              <circle r={isHighlighted ? 1.8 : 1.3} fill="#ffffff">
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

                      {/* Label Pill for Key Bidirectional & Special Edges */}
                      {edge.labelPos && (
                        <g
                          transform={`translate(${edge.labelPos.x}, ${edge.labelPos.y})`}
                          className="topo-edge-label"
                        >
                          {(() => {
                            const boxW = Math.max(108, edge.label.length * 6.8 + 20);
                            return (
                              <rect
                                x={-boxW / 2}
                                y="-11"
                                width={boxW}
                                height="22"
                                rx="5"
                                fill="rgba(6, 10, 13, 0.92)"
                                stroke={edge.color}
                                strokeWidth="0.9"
                                strokeOpacity="0.68"
                              />
                            );
                          })()}
                          <text
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill={edge.color}
                            fontSize="9.5"
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

              {/* LAYER 2: NODES */}
              <g className="topo-nodes-layer">
                {architectureGraphNodes.map((node) => {
                  const theme = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.api;
                  const isSelected = node.id === syncedNodeId;
                  const isHovered = node.id === hoveredNodeId;
                  const isRelated = connectedNodeIds.has(node.id);
                  const isDimmed =
                    hoveredNodeId && !isRelated ? true : false;

                  return (
                    <g
                      key={node.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`${node.label} — ${node.sublabel}`}
                      aria-pressed={isSelected}
                      className={`topo-node-group ${isSelected ? "is-selected" : ""} ${isHovered ? "is-hovered" : ""}`}
                      style={{
                        opacity: isDimmed ? 0.32 : 1,
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
                      {/* CIRCLE NODES (Databases & MinIO Storage) */}
                      {node.shape === "circle" && (
                        <>
                          {isSelected && (
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r={node.r + 7}
                              fill="none"
                              stroke={theme.stroke}
                              strokeWidth="1.5"
                              strokeDasharray="5 5"
                              className="topo-selected-ring"
                            />
                          )}
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.r}
                            fill={theme.fillPattern}
                            stroke={isSelected || isHovered ? "#ffffff" : theme.stroke}
                            strokeWidth={isSelected ? "2.6" : "2"}
                            filter={isSelected || isHovered ? "url(#topo-node-glow)" : undefined}
                          />
                          <text
                            x={node.x}
                            y={node.y - 6}
                            textAnchor="middle"
                            fill="#edf3f6"
                            fontSize="12.5"
                            fontWeight="800"
                            fontFamily="'JetBrains Mono', monospace"
                          >
                            {node.label}
                          </text>
                          <text
                            x={node.x}
                            y={node.y + 13}
                            textAnchor="middle"
                            fill={theme.stroke}
                            fontSize="10"
                            fontWeight="600"
                          >
                            {node.sublabel}
                          </text>
                        </>
                      )}

                      {/* DIAMOND NODE (Caddy Reverse Proxy) */}
                      {node.shape === "diamond" && (
                        <>
                          {isSelected && (
                            <polygon
                              points={`${node.x},${node.y - node.height / 2 - 8} ${node.x + node.width / 2 + 10},${node.y} ${node.x},${node.y + node.height / 2 + 8} ${node.x - node.width / 2 - 10},${node.y}`}
                              fill="none"
                              stroke={theme.stroke}
                              strokeWidth="1.6"
                              strokeDasharray="6 5"
                              className="topo-selected-ring"
                            />
                          )}
                          <polygon
                            points={`${node.x},${node.y - node.height / 2} ${node.x + node.width / 2},${node.y} ${node.x},${node.y + node.height / 2} ${node.x - node.width / 2},${node.y}`}
                            fill={theme.fillPattern}
                            stroke={isSelected || isHovered ? "#ffffff" : theme.stroke}
                            strokeWidth={isSelected ? "2.8" : "2.2"}
                            filter="url(#topo-node-glow)"
                          />
                          <text
                            x={node.x}
                            y={node.y - 7}
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="15"
                            fontWeight="800"
                            letterSpacing="0.5"
                          >
                            {node.label}
                          </text>
                          <text
                            x={node.x}
                            y={node.y + 12}
                            textAnchor="middle"
                            fill="#5ce1e6"
                            fontSize="11"
                            fontWeight="700"
                            fontFamily="'JetBrains Mono', monospace"
                          >
                            {node.sublabel}
                          </text>
                        </>
                      )}

                      {/* RECTANGLE NODES (API Cluster, Wazuh IDS, Client Apps) */}
                      {node.shape === "rect" && (
                        <>
                          {isSelected && (
                            <rect
                              x={node.x - node.width / 2 - 5}
                              y={node.y - node.height / 2 - 5}
                              width={node.width + 10}
                              height={node.height + 10}
                              rx="10"
                              fill="none"
                              stroke={theme.stroke}
                              strokeWidth="1.5"
                              strokeDasharray="5 4"
                            />
                          )}
                          <rect
                            x={node.x - node.width / 2}
                            y={node.y - node.height / 2}
                            width={node.width}
                            height={node.height}
                            rx="7"
                            fill={theme.fillPattern}
                            stroke={isSelected || isHovered ? "#ffffff" : theme.stroke}
                            strokeWidth={isSelected ? "2.5" : "1.8"}
                            filter={isSelected || isHovered ? "url(#topo-node-glow)" : undefined}
                          />

                          {/* Status dot for client apps with live URLs */}
                          {node.url && (
                            <circle
                              cx={node.x + node.width / 2 - 11}
                              cy={node.y - node.height / 2 + 11}
                              r="3.2"
                              fill="#34d399"
                            />
                          )}

                          <text
                            x={node.x}
                            y={node.y - 5}
                            textAnchor="middle"
                            fill={node.category === "security" ? "#fb923c" : "#edf3f6"}
                            fontSize={
                              node.category === "client"
                                ? node.label.length > 17
                                  ? "10"
                                  : "11"
                                : "13.5"
                            }
                            fontWeight="800"
                            fontFamily="'JetBrains Mono', monospace"
                          >
                            {node.label}
                          </text>
                          <text
                            x={node.x}
                            y={node.y + 14}
                            textAnchor="middle"
                            fill={node.category === "client" ? "#8ea1ae" : theme.stroke}
                            fontSize={node.category === "client" ? "9.5" : "10.5"}
                            fontWeight="600"
                          >
                            {node.sublabel}
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </div>

        {/* LIVE NODE INSPECTOR DRAWER */}
        <aside className="arch-inspector-panel" aria-live="polite">
          <div className="inspector-header">
            <div className="inspector-badge-row">
              <span
                className="inspector-cat-badge"
                style={{
                  color: inspectedTheme.stroke,
                  borderColor: inspectedTheme.stroke,
                  background: "rgba(6, 10, 13, 0.7)",
                }}
              >
                {getCategoryIcon(inspectedNode.category)}
                <span>{inspectedTheme.badge}</span>
              </span>
              <span className="inspector-layer-tag">{inspectedNode.layer}</span>
            </div>

            <h3 className="inspector-title">{inspectedNode.label}</h3>
            <p className="inspector-protocol">{inspectedNode.protocol}</p>
            <p className="inspector-summary">{inspectedNode.summary}</p>
          </div>

          {/* Spesifikasi Node */}
          {inspectedNode.specs && inspectedNode.specs.length > 0 && (
            <div className="inspector-block">
              <span className="inspector-block-label">Spesifikasi & Peran</span>
              <ul className="inspector-spec-list">
                {inspectedNode.specs.map((spec) => (
                  <li key={spec}>
                    <Check size={14} weight="bold" className="text-accent shrink-0" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Live Endpoints under iclabs.fikom.umi.ac.id */}
          {inspectedNode.endpoints && inspectedNode.endpoints.length > 0 && (
            <div className="inspector-block">
              <span className="inspector-block-label">Aplikasi & Endpoint Live</span>
              <div className="inspector-endpoints-list">
                {inspectedNode.endpoints.map((ep) => (
                  <a
                    key={ep.url}
                    href={ep.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inspector-endpoint-btn"
                  >
                    <div className="endpoint-copy">
                      <strong>{ep.label}</strong>
                      <small>{ep.url.replace(/^https?:\/\//, "")}</small>
                    </div>
                    <ArrowSquareOut size={15} weight="bold" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Alur Koneksi Masuk & Keluar (Traversal) */}
          <div className="inspector-block">
            <span className="inspector-block-label">
              Koneksi Aktif ({incomingEdges.length + outgoingEdges.length})
            </span>
            <div className="inspector-connections-grid">
              {incomingEdges.map((edge) => {
                const sourceNode = architectureGraphNodes.find((n) => n.id === edge.from);
                if (!sourceNode) return null;
                return (
                  <button
                    key={edge.id}
                    type="button"
                    className="conn-chip is-in"
                    onClick={() => handleNodeClick(sourceNode)}
                    title={`Fokus ke ${sourceNode.label}`}
                  >
                    <span className="conn-dir">IN</span>
                    <span className="conn-name">{sourceNode.label}</span>
                    <span className="conn-proto">{edge.label}</span>
                  </button>
                );
              })}
              {outgoingEdges.map((edge) => {
                const targetNode = architectureGraphNodes.find((n) => n.id === edge.to);
                if (!targetNode) return null;
                return (
                  <button
                    key={edge.id}
                    type="button"
                    className="conn-chip is-out"
                    onClick={() => handleNodeClick(targetNode)}
                    title={`Fokus ke ${targetNode.label}`}
                  >
                    <span className="conn-dir">OUT</span>
                    <span className="conn-name">{targetNode.label}</span>
                    <span className="conn-proto">{edge.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* BAR RINGKASAN SISTEM TERPILIH DARI HERO TAB */}
      {activeSystem && (
        <div className="active-system-strip">
          <div className="active-system-strip-main">
            <div className="active-system-meta">
              <span className="project-category-badge">{activeSystem.category}</span>
              <span className="active-system-number">SISTEM #{activeSystem.number}</span>
            </div>
            <h3 className="active-system-heading">
              {activeSystem.label} — {activeSystem.title.replace("\n", " ")}
            </h3>
            <p className="active-system-desc">{activeSystem.description}</p>
            {activeSystem.note && (
              <p className="active-system-note">
                <strong>Catatan Integrasi:</strong> {activeSystem.note}
              </p>
            )}
          </div>

          <div className="active-system-strip-features">
            <span className="inspector-block-label">Fitur & Alur Modul</span>
            <ul className="active-system-feat-list">
              {activeSystem.features.map((feat) => (
                <li key={feat}>
                  <Check size={14} weight="bold" className="text-accent shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            {activeSystem.url && (
              <a
                href={activeSystem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="active-system-cta"
              >
                <span>Kunjungi {activeSystem.url.replace(/^https?:\/\//, "")}</span>
                <ArrowSquareOut size={15} weight="bold" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
