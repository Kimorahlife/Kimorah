import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { BarItem } from "./kindness-data";
import { MapShape } from "./map-paths";
import { MUTED } from "./components";

/** Strip accents and case so "Anzoátegui" matches "anzoategui". */
const norm = (s: string): string =>
  s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/**
 * Country names as the survey's free text tends to arrive, mapped to the names
 * the Natural Earth dataset publishes. The server already canonicalises most
 * spellings; this covers the remaining long-form differences.
 */
const ALIASES: Record<string, string> = {
  "united states": "united states of america",
  usa: "united states of america",
  "dominican republic": "dominican rep.",
  "united kingdom": "united kingdom",
  "czech republic": "czechia",
  "south korea": "korea",
};

/**
 * Choropleth for the two location panels.
 *
 * Magnitude is carried by ONE hue at varying lightness (a sequential ramp on a
 * dark surface, so brighter = more), never by different hues. The map is
 * deliberately a companion to the bar list beside it: the bars carry the exact
 * numbers, so nothing here is readable only from colour.
 */
const GeoMap: React.FC<{
  shapes: MapShape[];
  viewBox: string;
  items: BarItem[];
  color: string;
}> = ({ shapes, viewBox, items, color }) => {
  const byShape = useMemo(() => {
    const found = new Map<string, number>();
    for (const it of items) {
      const label = norm(it.label);
      const target = ALIASES[label] ?? label;
      for (const s of shapes) {
        const name = norm(s.n);
        // Free-text answers arrive as "Aragua Venezuela" or "Puerto Rico
        // (stateside)", so a containment match either way beats equality.
        if (name === target || target.includes(name) || name.includes(target)) {
          found.set(s.n, Math.max(found.get(s.n) ?? 0, it.value));
        }
      }
    }
    return found;
  }, [shapes, items]);

  const max = Math.max(1, ...Array.from(byShape.values()));

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        component="svg"
        viewBox={viewBox}
        role="img"
        aria-label={`Map. ${items.map((i) => `${i.label} ${i.value}%`).join(", ")}`}
        // Scales with the column width and keeps its own aspect ratio. Pinning a
        // pixel height instead makes the drawing fit by height and shrink to a
        // fraction of the space it was given.
        sx={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
      >
        {shapes.map((s) => {
          const v = byShape.get(s.n);
          // Unmatched land stays a flat, recessive base so the highlighted
          // regions are the only thing carrying data.
          const opacity = v === undefined ? 0.14 : 0.4 + 0.6 * (v / max);
          return (
            <path key={s.n} d={s.d} fill={v === undefined ? "#8f97c9" : color} opacity={opacity}>
              {v !== undefined && <title>{`${s.n}: ${v}%`}</title>}
            </path>
          );
        })}
      </Box>
      {byShape.size > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.75, justifyContent: "flex-end" }}>
          <Typography sx={{ color: MUTED, fontSize: 9 }}>fewer</Typography>
          <Box
            sx={{
              width: 54,
              height: 6,
              borderRadius: 3,
              background: `linear-gradient(90deg, ${color}66, ${color})`,
            }}
          />
          <Typography sx={{ color: MUTED, fontSize: 9 }}>more</Typography>
        </Box>
      )}
    </Box>
  );
};

export default GeoMap;
