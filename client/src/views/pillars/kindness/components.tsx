import React, { ReactNode } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { BarItem, Segment, WordItem } from "./kindness-data";

// Dark-surface ink tokens
export const INK = "#f1eefb";
export const SUB = "#c7c1e6";
export const MUTED = "#9a93c4";
const TRACK = "rgba(255,255,255,0.10)";

export const Panel: React.FC<{ children: ReactNode; id?: string; sx?: object }> = ({ children, id, sx }) => (
  <Box
    id={id}
    sx={{
      bgcolor: "rgba(255,255,255,0.045)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 4,
      p: { xs: 2, sm: 2.5 },
      ...sx,
    }}
  >
    {children}
  </Box>
);

/** Neutral empty state shown in a chart slot when there's no survey data yet. */
export const NoData: React.FC<{ label?: string; minHeight?: number }> = ({ label = "No responses yet", minHeight = 90 }) => (
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight, color: MUTED, fontSize: 12.5, fontStyle: "italic" }}>
    {label}
  </Box>
);

export const SectionLabel: React.FC<{ children: ReactNode; action?: ReactNode }> = ({ children, action }) => (
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5, gap: 1 }}>
    <Typography sx={{ color: SUB, fontWeight: 700, letterSpacing: 0.8, fontSize: 13 }}>{children}</Typography>
    {action}
  </Box>
);

export const StatCard: React.FC<{ icon: ReactNode; value: string; unit?: string; label: string; sublabel?: string; info?: string }> = ({ icon, value, unit, label, sublabel, info }) => (
  <Box
    sx={{
      bgcolor: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.09)",
      borderRadius: 3,
      p: 2,
      display: "flex",
      flexDirection: "column",
      gap: 1,
      minWidth: 0,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
      <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: SUB }}>
        {icon}
      </Box>
      {info && (
        <Tooltip title={info} arrow enterTouchDelay={0} leaveTouchDelay={6000}>
          <InfoOutlinedIcon sx={{ fontSize: 18, color: MUTED, cursor: "help", flexShrink: 0 }} />
        </Tooltip>
      )}
    </Box>
    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
      <Typography sx={{ color: INK, fontSize: { xs: 26, sm: 32 }, fontWeight: 700, lineHeight: 1 }}>{value}</Typography>
      {unit && <Typography sx={{ color: SUB, fontSize: 14, fontWeight: 600 }}>{unit}</Typography>}
    </Box>
    <Box>
      <Typography sx={{ color: MUTED, fontSize: 12, lineHeight: 1.3 }}>{label}</Typography>
      {sublabel && <Typography sx={{ color: SUB, fontSize: 11, fontStyle: "italic", mt: 0.25 }}>{sublabel}</Typography>}
    </Box>
  </Box>
);

/** Donut ring built from SVG arcs, with a 2px gap between segments. */
export const DonutChart: React.FC<{ segments: Segment[]; size?: number; thickness?: number; children?: ReactNode }> = ({
  segments,
  size = 168,
  thickness = 26,
  children,
}) => {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <Box sx={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={thickness} />
          {segments.map((s, i) => {
            const len = (s.value / total) * C;
            const seg = Math.max(len - 2, 0.5); // 2px gap between segments
            const el = (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={thickness}
                strokeDasharray={`${seg} ${C - seg}`}
                strokeDashoffset={-acc}
              />
            );
            acc += len;
            return el;
          })}
        </g>
      </svg>
      {children && (
        <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          {children}
        </Box>
      )}
    </Box>
  );
};

/** Legend row: colour swatch · label · value. Identity is never colour-alone. */
export const LegendList: React.FC<{ segments: Segment[]; suffix?: string }> = ({ segments, suffix = "%" }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, minWidth: 0 }}>
    {segments.map((s, i) => (
      <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: s.color, flexShrink: 0 }} />
        <Typography sx={{ color: SUB, fontSize: 12.5, flexGrow: 1, minWidth: 0 }} noWrap>{s.label}</Typography>
        <Typography sx={{ color: INK, fontSize: 12.5, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{s.value}{suffix}</Typography>
      </Box>
    ))}
  </Box>
);

/** Horizontal bars with rounded ends and direct value labels. */
export const HBarChart: React.FC<{ items: BarItem[]; gradient: [string, string]; max?: number; labelWidth?: number }> = ({
  items,
  gradient,
  max = 100,
  labelWidth = 112,
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
    {items.map((it, i) => (
      <Box key={i} sx={{ display: "grid", gridTemplateColumns: `${labelWidth}px 1fr 42px`, alignItems: "center", gap: 1 }}>
        <Typography noWrap sx={{ color: SUB, fontSize: 12.5 }}>{it.label}</Typography>
        <Box sx={{ height: 12, borderRadius: 999, bgcolor: TRACK, overflow: "hidden" }}>
          <Box sx={{ height: "100%", width: `${Math.min((it.value / max) * 100, 100)}%`, borderRadius: 999, background: `linear-gradient(90deg, ${gradient[0]}, ${gradient[1]})` }} />
        </Box>
        <Typography sx={{ color: INK, fontSize: 12.5, fontWeight: 600, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{it.value}%</Typography>
      </Box>
    ))}
  </Box>
);

/** Vertical bars with values above and wrapped labels below. */
export const VBarChart: React.FC<{ items: BarItem[]; gradient: [string, string]; max?: number; height?: number }> = ({
  items,
  gradient,
  max = 40,
  height = 150,
}) => (
  <Box>
    <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 1, height }}>
      {items.map((it, i) => (
        <Box key={i} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
          <Typography sx={{ color: INK, fontSize: 12, fontWeight: 600, mb: 0.5 }}>{it.value}%</Typography>
          <Box sx={{ width: "72%", maxWidth: 40, height: `${(it.value / max) * 100}%`, borderRadius: "6px 6px 0 0", background: `linear-gradient(180deg, ${gradient[0]}, ${gradient[1]})` }} />
        </Box>
      ))}
    </Box>
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mt: 0.75 }}>
      {items.map((it, i) => (
        <Typography key={i} sx={{ flex: 1, textAlign: "center", color: MUTED, fontSize: 10.5, lineHeight: 1.2 }}>{it.label}</Typography>
      ))}
    </Box>
  </Box>
);

const WORD_COLORS = ["#9a8be6", "#6fae5a", "#c0b3f0", "#7fc98f", "#b8a9ee", "#8fd0a0"];

/** Word cloud — size encodes weight; colour is decorative (a light wash). */
export const WordCloud: React.FC<{ words: WordItem[] }> = ({ words }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px 12px", alignItems: "baseline", justifyContent: "center", py: 1 }}>
    {words.map((w, i) => (
      <Box
        component="span"
        key={i}
        sx={{ fontSize: 12 + w.weight * 20, fontWeight: w.weight > 0.7 ? 700 : 500, color: WORD_COLORS[i % WORD_COLORS.length], opacity: 0.55 + w.weight * 0.45, lineHeight: 1 }}
      >
        {w.word}
      </Box>
    ))}
  </Box>
);
