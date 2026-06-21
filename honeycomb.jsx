import { useState, useEffect } from "react";

function hexPts(cx, cy, r) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = Math.PI / 6 + (Math.PI / 3) * i;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

function ring7(cx, cy, d) {
  return [
    { x: cx, y: cy },
    ...Array.from({ length: 6 }, (_, i) => ({
      x: cx + d * Math.cos((Math.PI / 3) * i),
      y: cy + d * Math.sin((Math.PI / 3) * i),
    })),
  ];
}

const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: (i * 151.3 + 33) % 700,
  y: (i * 89.7 + 61) % 700,
  r: 0.4 + (i % 4) * 0.35,
  p: i * 0.57,
}));

export default function App() {
  const [t, setT] = useState(0);
  const [hov, setHov] = useState(null);

  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), 65);
    return () => clearInterval(id);
  }, []);

  const CX = 350, CY = 350;
  const HR = 22, HS = 40, CS = 130;

  const clusterCenters = ring7(CX, CY, CS);
  const hexes = clusterCenters.flatMap((c, ci) =>
    ring7(c.x, c.y, HS).map((h, hi) => ({
      ...h, ci, hi,
      id: ci * 7 + hi,
      isCore: ci === 0 && hi === 0,
      isSub: hi === 0,
    }))
  );

  // Golden pulse for core
  const corePulse = 0.85 + 0.15 * Math.sin(t * 0.08);

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 45%, #0c0920 0%, #010108 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Courier New', monospace",
    }}>
      <div style={{
        fontSize: 9,
        letterSpacing: 5,
        marginBottom: 12,
        color: "#2a4060",
        textTransform: "uppercase",
      }}>
        mip_re_home · v0.6 · 七星蜜巢
      </div>

      <svg viewBox="0 0 700 700" style={{ width: "min(96vw, 500px)", display: "block" }}>
        <defs>
          <radialGradient id="bgGlow" cx="50%" cy="50%" r="48%">
            <stop offset="0%" stopColor="#1a1540" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#060416" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#010108" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe060" stopOpacity="1" />
            <stop offset="100%" stopColor="#e8a020" stopOpacity="0.4" />
          </radialGradient>
          <filter id="fSub" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="fCore" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="14" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="fHov" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Deep background glow */}
        <ellipse cx={350} cy={350} rx={340} ry={340} fill="url(#bgGlow)" />

        {/* Stars */}
        {STARS.map((s, i) => (
          <circle
            key={i} cx={s.x} cy={s.y} r={s.r}
            fill="white"
            fillOpacity={0.08 + 0.28 * Math.abs(Math.sin(t * 0.022 + s.p))}
          />
        ))}

        {/* Connection lines from center cluster to outer clusters */}
        {clusterCenters.slice(1).map((c, i) => (
          <line
            key={i}
            x1={CX} y1={CY} x2={c.x} y2={c.y}
            stroke="rgba(60,100,160,0.12)"
            strokeWidth={0.8}
          />
        ))}

        {/* Hexes — render dim first, then glowing on top */}
        {hexes.map((h) => {
          const w = 0.78 + 0.22 * Math.sin(t * 0.042 + h.id * 0.31);
          const isH = hov === h.id;
          const spd = h.isCore ? 0.65 : h.isSub ? 0.38 : 0.18;
          const dir = (h.ci + h.hi) % 2 === 0 ? 1 : -1;
          const rot = (t * spd * dir) % 360;

          let fill, stroke, strokeW, tc, fs, filter;

          if (h.isCore) {
            fill = `rgba(252,214,55,${0.28 * corePulse})`;
            stroke = `rgba(240,200,40,${corePulse})`;
            strokeW = 2;
            tc = "#ffe040";
            fs = 23;
            filter = "url(#fCore)";
          } else if (isH) {
            fill = "rgba(130,210,255,0.35)";
            stroke = "#88d8ff";
            strokeW = 1.5;
            tc = "#d0f0ff";
            fs = h.isSub ? 16 : 14;
            filter = "url(#fHov)";
          } else if (h.isSub) {
            fill = `rgba(45,115,185,${0.2 * w})`;
            stroke = `rgba(60,138,205,${0.75 * w})`;
            strokeW = 1;
            tc = "#58b0d8";
            fs = 16;
            filter = "url(#fSub)";
          } else {
            fill = `rgba(12,45,90,${0.1 * w})`;
            stroke = `rgba(20,62,118,${0.45 * w})`;
            strokeW = 0.8;
            tc = "#1e4870";
            fs = 13;
            filter = undefined;
          }

          return (
            <g
              key={h.id}
              filter={filter}
              onMouseEnter={() => setHov(h.id)}
              onMouseLeave={() => setHov(null)}
            >
              <polygon
                points={hexPts(h.x, h.y, HR - 1.5)}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeW}
              />
              <text
                x={h.x} y={h.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={fs}
                fill={tc}
                fillOpacity={0.72 + 0.28 * w}
                transform={`rotate(${rot},${h.x},${h.y})`}
                style={{ userSelect: "none", pointerEvents: "none" }}
              >
                {h.isCore ? "☉" : "❄"}
              </text>
            </g>
          );
        })}

        {/* Bottom label */}
        <text x={350} y={674} textAnchor="middle" fontSize={10}
          fill="#1a3050" letterSpacing={5} fontFamily="monospace">
          7 × 7 = 49
        </text>
      </svg>

      {/* Stats row */}
      <div style={{
        marginTop: 14,
        display: "flex",
        gap: 24,
        fontSize: 10,
        color: "#1e3858",
        letterSpacing: 2,
        textTransform: "uppercase",
      }}>
        <span style={{ color: "#3a7898" }}>1 + 6 = 7</span>
        <span>·</span>
        <span style={{ color: "#c89820" }}>☉_home</span>
        <span>·</span>
        <span style={{ color: "#3a7898" }}>7 × 7 = 49</span>
      </div>

      <div style={{
        marginTop: 8,
        color: "#152030",
        fontSize: 10,
        letterSpacing: 3,
      }}>
        Lachen ist der Beweis.
      </div>
    </div>
  );
}
