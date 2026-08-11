import React, { ReactNode } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LinkOffRoundedIcon from "@mui/icons-material/LinkOffRounded";
import { BarItem, Segment, WordItem } from "./kindness-data";

// Dark-surface ink tokens. Values, labels and legends always wear these —
// never a series colour. A coloured mark beside the text carries identity.
export const INK = "#f1eefb";
export const SUB = "#c7c1e6";
export const MUTED = "#9a93c4";

// Surfaces, deepest first.
export const PAGE = "#0f1333";
export const PANEL = "#171b3f";
export const TILE = "#1d2250";
export const BORDER = "rgba(255,255,255,0.09)";

/**
 * The two categorical series colours: BEFORE hearing the sound vs AFTER.
 *
 * Validated together against the #171b3f panel surface — lightness band,
 * chroma floor, CVD separation, normal-vision floor and 3:1 contrast all pass.
 * Do not hand-tune these: re-run the palette validator if they ever change.
 * (Tritan separation sits in the 6–8 floor band, which is legal here because
 * the two never share a chart — they live in separate, text-titled sections
 * and every legend carries a written label.)
 */
export const BEFORE = "#8a7be0";
export const AFTER = "#62a84a";

/** Reserved status token. Only ever used with an icon + label, never alone. */
export const WARNING = "#fab219";

export const Panel: React.FC<{ children: ReactNode; id?: string; sx?: object }> = ({ children, id, sx }) => (
  <Box
    id={id}
    sx={{
      bgcolor: PANEL,
      border: `1px solid ${BORDER}`,
      borderRadius: 2.5,
      p: { xs: 1.75, sm: 2.25 },
      minWidth: 0,
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

/**
 * Marks a panel the design asks for that NO survey question can currently
 * answer. Deliberately loud: an un-sourced panel must never be mistaken for a
 * real result, and it reads differently from <NoData/>, which means "the
 * question exists, nobody has answered yet".
 *
 * Uses the reserved warning token, and always pairs it with an icon and a
 * written label so the meaning never rests on colour alone.
 */
export const NeedsSource: React.FC<{ needs: string; minHeight?: number; compact?: boolean }> = ({
  needs,
  minHeight = 90,
  compact = false,
}) => {
  // Compact form for narrow tiles, where the full sentence would wrap to five
  // lines and blow out the row height. The badge still reads as a warning; the
  // detail moves to the tooltip rather than being dropped.
  if (compact) {
    return (
      <Tooltip title={needs} arrow enterTouchDelay={0} leaveTouchDelay={8000}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.6,
            alignSelf: "flex-start",
            borderRadius: 1.5,
            border: `1px dashed ${WARNING}66`,
            bgcolor: `${WARNING}14`,
            px: 0.9,
            py: 0.5,
            cursor: "help",
          }}
        >
          <LinkOffRoundedIcon sx={{ color: WARNING, fontSize: 14 }} />
          <Typography sx={{ color: WARNING, fontSize: 9.5, fontWeight: 700, letterSpacing: 0.5, whiteSpace: "nowrap" }}>
            NOT LINKED
          </Typography>
        </Box>
      </Tooltip>
    );
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.75,
        justifyContent: "center",
        minHeight,
        borderRadius: 2,
        border: `1px dashed ${WARNING}66`,
        bgcolor: `${WARNING}14`,
        px: 1.5,
        py: 1.25,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
        <LinkOffRoundedIcon sx={{ color: WARNING, fontSize: 16 }} />
        <Typography sx={{ color: WARNING, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6 }}>
          NOT LINKED TO A QUESTION
        </Typography>
      </Box>
      <Typography sx={{ color: SUB, fontSize: 11, lineHeight: 1.45 }}>{needs}</Typography>
    </Box>
  );
};

/** Small caps label above a panel's content. */
export const SectionLabel: React.FC<{ children: ReactNode; action?: ReactNode }> = ({ children, action }) => (
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5, gap: 1 }}>
    <Typography sx={{ color: SUB, fontWeight: 600, letterSpacing: 1, fontSize: 11.5, textTransform: "uppercase" }}>
      {children}
    </Typography>
    {action}
  </Box>
);

/**
 * Group heading with a trailing hairline rule — "BEFORE HEARING THE SOUND" /
 * "AFTER HEARING THE SOUND". The colour keys the whole section to its series,
 * and the words say which is which, so the pairing never rests on hue.
 */
export const SectionHeading: React.FC<{ title: string; subtitle: string; color: string }> = ({ title, subtitle, color }) => (
  <Box sx={{ mb: 1.75 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Typography sx={{ color, fontSize: { xs: 15, sm: 17 }, fontWeight: 700, letterSpacing: 0.6, whiteSpace: "nowrap" }}>
        {title}
      </Typography>
      <Box sx={{ flexGrow: 1, height: "1px", bgcolor: `${color}59` }} />
    </Box>
    <Typography sx={{ color: MUTED, fontSize: 11.5, mt: 0.4 }}>{subtitle}</Typography>
  </Box>
);

/** Overview tile: icon, then the number and its label. The number IS the chart. */
export const StatCard: React.FC<{ icon: ReactNode; value: string; unit?: string; label: string; info?: string }> = ({ icon, value, unit, label, info }) => (
  <Box
    sx={{
      bgcolor: TILE,
      border: `1px solid ${BORDER}`,
      borderRadius: 2,
      px: 1.75,
      py: 1.5,
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      minWidth: 0,
    }}
  >
    <Box sx={{ color: BEFORE, display: "flex", flexShrink: 0, "& svg": { fontSize: 30 } }}>{icon}</Box>
    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
        <Typography sx={{ color: INK, fontSize: { xs: 22, sm: 26 }, fontWeight: 700, lineHeight: 1.1 }}>{value}</Typography>
        {unit && <Typography sx={{ color: MUTED, fontSize: 12.5, fontWeight: 500 }}>{unit}</Typography>}
      </Box>
      <Typography sx={{ color: SUB, fontSize: 11.5, lineHeight: 1.35, mt: 0.35 }}>{label}</Typography>
    </Box>
    {info && (
      <Tooltip title={info} arrow enterTouchDelay={0} leaveTouchDelay={6000}>
        <InfoOutlinedIcon sx={{ fontSize: 16, color: MUTED, cursor: "help", flexShrink: 0, alignSelf: "flex-start" }} />
      </Tooltip>
    )}
  </Box>
);

/** Big-percentage tile for the KEY FINDINGS row. */
export const FindingCard: React.FC<{ pct: number; label: string }> = ({ pct, label }) => (
  <Box
    sx={{
      bgcolor: TILE,
      border: `1px solid ${BORDER}`,
      borderRadius: 2,
      px: 1.75,
      py: 1.5,
      display: "flex",
      flexDirection: "column",
      gap: 0.75,
      minWidth: 0,
    }}
  >
    <Typography sx={{ color: INK, fontSize: { xs: 24, sm: 28 }, fontWeight: 700, lineHeight: 1 }}>{pct}%</Typography>
    <Typography sx={{ color: SUB, fontSize: 11.5, lineHeight: 1.35 }}>{label}</Typography>
  </Box>
);

/** Donut ring built from SVG arcs, with a 2px surface gap between segments. */
export const DonutChart: React.FC<{ segments: Segment[]; size?: number; thickness?: number; children?: ReactNode }> = ({
  segments,
  size = 130,
  thickness = 24,
  children,
}) => {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <Box sx={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={segments.map((s) => `${s.label} ${s.value}%`).join(", ")}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={thickness} />
          {segments.map((s, i) => {
            const len = (s.value / total) * C;
            const seg = Math.max(len - 2, 0.5); // 2px surface gap between segments
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
              >
                <title>{`${s.label}: ${s.value}%`}</title>
              </circle>
            );
            acc += len;
            return el;
          })}
        </g>
      </svg>
      {children && (
        <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", pointerEvents: "none" }}>
          {children}
        </Box>
      )}
    </Box>
  );
};

/** Legend row: swatch · label · value. Identity is never colour-alone. */
export const LegendList: React.FC<{ segments: Segment[]; suffix?: string }> = ({ segments, suffix = "%" }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
    {segments.map((s, i) => (
      <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ width: 11, height: 11, borderRadius: "3px", bgcolor: s.color, flexShrink: 0 }} />
        <Typography sx={{ color: SUB, fontSize: 12.5, flexGrow: 1, minWidth: 0 }} noWrap>{s.label}</Typography>
        <Typography sx={{ color: INK, fontSize: 12.5, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{s.value}{suffix}</Typography>
      </Box>
    ))}
  </Box>
);

/**
 * Horizontal bars, one hue for the whole series. The bar grows from a square
 * baseline with a 4px rounded data-end; the value rides the end as a direct
 * label, which is what lets the chart drop its axis entirely.
 */
export const HBarChart: React.FC<{ items: BarItem[]; color: string; max?: number; labelWidth?: number }> = ({
  items,
  color,
  max = 100,
  labelWidth = 112,
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
    {items.map((it, i) => (
      <Box
        key={i}
        title={`${it.label}: ${it.value}%`}
        sx={{ display: "grid", gridTemplateColumns: `${labelWidth}px 1fr 38px`, alignItems: "center", gap: 1, cursor: "default" }}
      >
        {/* Wraps to at most two lines rather than truncating: the question bank
            holds long option labels ("Muscles relaxed (e.g., shoulders, jaw)")
            that an ellipsis would cut to nonsense. */}
        <Typography
          sx={{
            color: SUB,
            fontSize: 12,
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
          title={it.label}
        >
          {it.label}
        </Typography>
        {/* No track behind the bar — the design reads the bar against the panel
            itself, and an empty-remainder track invites reading it as a second
            value. */}
        <Box>
          <Box
            sx={{
              height: 9,
              width: `${Math.max(Math.min((it.value / max) * 100, 100), 1)}%`,
              borderRadius: "0 4px 4px 0",
              bgcolor: color,
            }}
          />
        </Box>
        <Typography sx={{ color: INK, fontSize: 12, fontWeight: 600, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{it.value}%</Typography>
      </Box>
    ))}
  </Box>
);

/**
 * Vertical bars, one hue. Capped at 24px wide so the band's leftover stays as
 * air, square at the baseline with a 4px rounded top.
 */
export const VBarChart: React.FC<{
  items: BarItem[];
  color: string;
  max?: number;
  height?: number;
  /** Scale anchors printed under the first and last bucket, e.g. very calm → very activated. */
  endLabels?: [string, string];
}> = ({ items, color, max = 100, height = 118, endLabels }) => (
  <Box>
    <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 1.5, height }}>
      {items.map((it, i) => (
        <Box
          key={i}
          title={`${it.label}: ${it.value}%`}
          sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", minWidth: 0, cursor: "default" }}
        >
          <Typography sx={{ color: INK, fontSize: 11.5, fontWeight: 700, mb: 0.5 }}>{it.value}%</Typography>
          <Box
            sx={{
              width: "100%",
              maxWidth: 24,
              height: `${Math.max((it.value / max) * 100, 1.5)}%`,
              borderRadius: "4px 4px 0 0",
              bgcolor: color,
            }}
          />
        </Box>
      ))}
    </Box>
    {/* Hairline baseline — solid, one step off the surface, recessive. */}
    <Box sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.12)", mt: 0 }} />
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1.5, mt: 0.75 }}>
      {items.map((it, i) => (
        <Box key={i} sx={{ flex: 1, minWidth: 0, textAlign: "center" }}>
          <Typography sx={{ color: MUTED, fontSize: 10, lineHeight: 1.25 }}>{it.label}</Typography>
          {endLabels && (i === 0 || i === items.length - 1) && (
            <Typography sx={{ color: MUTED, fontSize: 8.5, lineHeight: 1.2, mt: 0.25, opacity: 0.85 }}>
              {i === 0 ? endLabels[0] : endLabels[1]}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  </Box>
);

/**
 * Word cloud — size encodes frequency; colour alternates across the two series
 * hues purely as texture, so nothing is read from hue alone.
 */
export const WordCloud: React.FC<{ words: WordItem[] }> = ({ words }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", alignItems: "baseline", justifyContent: "center", py: 1 }}>
    {words.map((w, i) => (
      <Box
        component="span"
        key={i}
        title={w.word}
        sx={{
          fontSize: 11 + w.weight * 19,
          fontWeight: w.weight > 0.7 ? 700 : 500,
          color: i % 3 === 0 ? AFTER : i % 3 === 1 ? BEFORE : SUB,
          opacity: 0.6 + w.weight * 0.4,
          lineHeight: 1.15,
        }}
      >
        {w.word}
      </Box>
    ))}
  </Box>
);
