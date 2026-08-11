"""Pre-render world + Venezuela geometry to static SVG paths.

Regenerate map-paths.ts:

    curl -sSLo world.json  https://unpkg.com/world-atlas@2/countries-110m.json
    curl -sSLo vz.geojson  https://github.com/wmgeolab/geoBoundaries/raw/9469f09/\
releaseData/gbOpen/VEN/ADM1/geoBoundaries-VEN-ADM1_simplified.geojson
    python3 -c "import sys;sys.setrecursionlimit(20000);exec(open(\'map-paths.gen.py\').read())"

Sources: Natural Earth via world-atlas (public domain); geoBoundaries VEN ADM1
(CC BY 4.0). Stdlib only — no npm packages, at build time or runtime.

Runs once, offline, and writes a plain .ts module. The app then ships zero map
dependencies: no topojson/d3-geo at runtime, just <path d="…"> strings.
"""
import json, math, unicodedata

# ── TopoJSON decoding (world-atlas countries-110m) ─────────────────────────
def decode_topo(topo, obj_name):
    tr = topo["transform"]
    sx, sy = tr["scale"]; tx, ty = tr["translate"]
    arcs = []
    for arc in topo["arcs"]:
        x = y = 0; pts = []
        for dx, dy in arc:
            x += dx; y += dy
            pts.append((x * sx + tx, y * sy + ty))
        arcs.append(pts)

    def ring(idxs):
        out = []
        for i in idxs:
            a = arcs[~i][::-1] if i < 0 else arcs[i]
            out.extend(a[1:] if out else a)
        return out

    feats = []
    for g in topo["objects"][obj_name]["geometries"]:
        name = (g.get("properties") or {}).get("name") or g.get("id")
        polys = []
        if g["type"] == "Polygon":
            polys = [[ring(r) for r in g["arcs"]]]
        elif g["type"] == "MultiPolygon":
            polys = [[ring(r) for r in poly] for poly in g["arcs"]]
        else:
            continue
        feats.append((name, polys))
    return feats

def decode_geojson(gj, name_key):
    feats = []
    for f in gj["features"]:
        name = f["properties"].get(name_key)
        geom = f["geometry"]; polys = []
        if geom["type"] == "Polygon":
            polys = [[[(x, y) for x, y, *_ in r] for r in geom["coordinates"]]]
        elif geom["type"] == "MultiPolygon":
            polys = [[[(x, y) for x, y, *_ in r] for r in p] for p in geom["coordinates"]]
        feats.append((name, polys))
    return feats

# ── Douglas–Peucker simplification (in degrees) ────────────────────────────
def dp(pts, tol):
    if len(pts) < 3:
        return pts
    ax, ay = pts[0]; bx, by = pts[-1]
    dx, dy = bx - ax, by - ay
    den = dx * dx + dy * dy
    worst = 0.0; idx = 0
    for i in range(1, len(pts) - 1):
        px, py = pts[i]
        if den == 0:
            d = math.hypot(px - ax, py - ay)
        else:
            t = max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / den))
            d = math.hypot(px - (ax + t * dx), py - (ay + t * dy))
        if d > worst:
            worst, idx = d, i
    if worst <= tol:
        return [pts[0], pts[-1]]
    return dp(pts[: idx + 1], tol)[:-1] + dp(pts[idx:], tol)

def build(feats, bbox, size, tol, min_area):
    """Project lon/lat to an equirectangular box and emit one path per feature."""
    lon0, lat0, lon1, lat1 = bbox
    W, H = size
    sx = W / (lon1 - lon0)
    sy = H / (lat1 - lat0)
    s = min(sx, sy)                      # uniform scale — never stretch a map
    ox = (W - (lon1 - lon0) * s) / 2
    oy = (H - (lat1 - lat0) * s) / 2

    def proj(p):
        lon, lat = p
        return (round(ox + (lon - lon0) * s, 1), round(oy + (lat1 - lat) * s, 1))

    out = []
    for name, polys in feats:
        d = []
        for poly in polys:
            for ri, r in enumerate(poly):
                if ri > 0:
                    continue            # drop holes: decorative fill, not analysis
                r = dp(r, tol)
                if len(r) < 4:
                    continue
                pr = [proj(p) for p in r]
                xs = [p[0] for p in pr]; ys = [p[1] for p in pr]
                if (max(xs) - min(xs)) * (max(ys) - min(ys)) < min_area:
                    continue            # drop specks that render as noise
                seg = f"M{pr[0][0]} {pr[0][1]}" + "".join(f"L{x} {y}" for x, y in pr[1:]) + "Z"
                d.append(seg)
        if d:
            out.append((name, "".join(d)))
    return out

def norm(s):
    s = unicodedata.normalize("NFKD", str(s))
    return "".join(c for c in s if not unicodedata.combining(c)).lower().strip()

world = build(decode_topo(json.load(open("world.json")), "countries"),
              (-180, -58, 180, 84), (1000, 440), 0.42, 3.0)
vz = build(decode_geojson(json.load(open("vz.geojson")), "shapeName"),
           (-73.4, 0.6, -59.8, 12.3), (520, 420), 0.03, 0.6)

def emit(rows):
    return ",\n".join('  { n: %s, d: %s }' % (json.dumps(n), json.dumps(d)) for n, d in rows)

ts = f'''// GENERATED FILE — do not edit by hand.
//
// Static SVG paths for the two dashboard maps, pre-projected (equirectangular)
// and simplified offline so the client ships no mapping library.
//
// Sources:
//   world      — world-atlas@2 countries-110m (Natural Earth, public domain)
//   venezuela  — geoBoundaries gbOpen VEN ADM1 simplified (CC BY 4.0)
//
// To regenerate, re-run the generator with fresh source data; the shape of this
// module (viewBox + [{{ n, d }}]) is all the components depend on.

export interface MapShape {{
  /** Country / state name as published by the source dataset. */
  n: string;
  /** SVG path data in the viewBox below. */
  d: string;
}}

export const WORLD_VIEWBOX = "0 0 1000 440";
export const WORLD_SHAPES: MapShape[] = [
{emit(world)},
];

export const VENEZUELA_VIEWBOX = "0 0 520 420";
export const VENEZUELA_SHAPES: MapShape[] = [
{emit(vz)},
];
'''
open("map-paths.ts", "w").write(ts)
print(f"world {len(world)} shapes, venezuela {len(vz)} shapes, {len(ts)/1024:.1f} KB")
print("VZ names:", ", ".join(sorted(norm(n) for n, _ in vz))[:300])
