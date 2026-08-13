import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { api } from "../../../api";
import { Lang, TranslationPair, applyTranslations, collectPairs, toTranslationMap } from "../translate";

interface Row extends TranslationPair {
  /** True when this row's translation came from the model in this sitting. */
  proposed: boolean;
}

const LANGUAGE_NAME: Record<Lang, string> = { en: "English", es: "Spanish" };

/**
 * Strip accents and case so a search for "conexion" finds "conexión".
 * Nobody reaches for the accented keys to look something up.
 */
const fold = (value: string): string =>
  value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const matches = (value: string, query: string): boolean =>
  !query.trim() || fold(value).includes(fold(query.trim()));

/**
 * Review the machine translation before it becomes part of the curriculum.
 *
 * Nothing here writes to the draft until Apply. The author sees each authored
 * line beside its proposed translation, can rewrite any of them, and only then
 * are they folded in — after which the curriculum still has to be saved. That
 * two-step is the point: a clinician's wording is not something to overwrite on
 * the strength of one API call.
 *
 * Lines already translated are listed too, unproposed and untouched, so this is
 * also where an existing translation gets corrected.
 */
function TranslationReview<T>({
  open,
  value,
  to,
  onApply,
  onClose,
}: {
  open: boolean;
  value: T;
  /** The language being produced. The other one is what the author wrote in. */
  to: Lang;
  onApply: (next: T) => void;
  onClose: () => void;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sourceQuery, setSourceQuery] = useState("");
  const [targetQuery, setTargetQuery] = useState("");
  const [onlyAttention, setOnlyAttention] = useState(false);
  const [lastRequest, setLastRequest] = useState<string[]>([]);
  const wasOpen = useRef(false);

  // The draft the parent is holding right now. Kept in a ref because `seed`
  // must read the newest one without re-running every time the author types.
  const latest = useRef(value);
  latest.current = value;

  /**
   * Opening the dialog costs nothing — it only lists what is already stored.
   * Translation is a paid call, so it happens when the author asks for it and
   * not a moment before; reopening to fix a typo must never re-bill the work.
   */
  const seed = useCallback(() => {
    setRows(collectPairs(latest.current, to).map((p) => ({ ...p, proposed: false })));
    setError(null);
    setSourceQuery("");
    setTargetQuery("");
    setOnlyAttention(false);
    setLastRequest([]);
  }, [to]);

  useEffect(() => {
    if (open && !wasOpen.current) seed();
    wasOpen.current = open;
  }, [open, seed]);

  const translate = async (sources: string[]) => {
    if (sources.length === 0) return;
    setLastRequest(sources);
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/api/translate", { texts: sources, to });
      const map = toTranslationMap(sources, data?.message);
      setRows((rs) =>
        rs.map((r) => (map.has(r.source) ? { ...r, target: map.get(r.source) as string, proposed: true, stale: false } : r)),
      );
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Translation failed.");
    } finally {
      setLoading(false);
    }
  };

  const setTarget = (index: number, target: string) =>
    setRows((r) => r.map((row, i) => (i === index ? { ...row, target } : row)));

  const proposedCount = rows.filter((r) => r.proposed && r.target.trim()).length;
  const blankRows = rows.filter((r) => !r.target.trim());
  const staleRows = rows.filter((r) => r.stale && r.target.trim());
  const blankCount = blankRows.length;
  const staleCount = staleRows.length;

  /**
   * Filtering keeps each row's position in `rows`, because that index is what
   * an edit writes back to. Rows are hidden from view, never removed — Apply
   * always sends the whole set, filtered or not.
   */
  const visible = rows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => matches(row.source, sourceQuery) && matches(row.target, targetQuery))
    .filter(({ row }) => !onlyAttention || !row.target.trim() || row.stale);

  const filtering = Boolean(sourceQuery.trim() || targetQuery.trim() || onlyAttention);

  const apply = () => {
    const map = new Map<string, string>();
    rows.forEach((r) => {
      if (r.target.trim()) map.set(r.source, r.target.trim());
    });
    const { value: next } = applyTranslations(latest.current, to, map);
    onApply(next);
    onClose();
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight={700}>
          {`Review the ${LANGUAGE_NAME[to]} translation`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Edit anything that reads wrong. Nothing changes until you apply it, and the curriculum still has to be saved.
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Button size="small" onClick={() => translate(lastRequest)} sx={{ textTransform: "none" }}>
                Try again
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {loading && (
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">
              {`Translating ${lastRequest.length} line${lastRequest.length === 1 ? "" : "s"}…`}
            </Typography>
          </Stack>
        )}

        {rows.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
            Nothing to translate yet — write some content first.
          </Typography>
        )}

        {rows.length > 0 && (
          <>
            <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: "wrap", rowGap: 1 }}>
              <Chip size="small" variant="outlined" label={`${rows.length} lines`} />
              {proposedCount > 0 && (
                <Chip
                  size="small"
                  color="primary"
                  variant="outlined"
                  icon={<AutoAwesomeRoundedIcon />}
                  label={`${proposedCount} newly translated`}
                />
              )}
              {blankCount > 0 && <Chip size="small" color="warning" variant="outlined" label={`${blankCount} still blank`} />}
              {staleCount > 0 && (
                <Chip
                  size="small"
                  color="warning"
                  variant="outlined"
                  icon={<WarningAmberRoundedIcon />}
                  label={`${staleCount} need review`}
                />
              )}
              {(blankCount > 0 || staleCount > 0) && (
                <Chip
                  size="small"
                  color={onlyAttention ? "primary" : "default"}
                  variant={onlyAttention ? "filled" : "outlined"}
                  onClick={() => setOnlyAttention((v) => !v)}
                  label={onlyAttention ? "Showing only these" : "Show only these"}
                />
              )}
              {filtering && (
                <Chip size="small" color="primary" label={`showing ${visible.length} of ${rows.length}`} />
              )}
            </Stack>

            {/* Translation is deliberate, and the two actions are kept apart:
                filling a blank costs nothing you had, re-translating replaces
                Spanish somebody may have written by hand. */}
            {(blankCount > 0 || staleCount > 0) && (
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", rowGap: 1 }}>
                {blankCount > 0 && (
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<AutoAwesomeRoundedIcon />}
                    disabled={loading}
                    onClick={() => translate(blankRows.map((r) => r.source))}
                    sx={{ textTransform: "none", borderRadius: 2 }}
                  >
                    {`Translate ${blankCount} blank line${blankCount === 1 ? "" : "s"}`}
                  </Button>
                )}
                {staleCount > 0 && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="warning"
                    startIcon={<AutoAwesomeRoundedIcon />}
                    disabled={loading}
                    onClick={() => translate(staleRows.map((r) => r.source))}
                    sx={{ textTransform: "none", borderRadius: 2 }}
                  >
                    {`Re-translate ${staleCount} changed line${staleCount === 1 ? "" : "s"}`}
                  </Button>
                )}
              </Stack>
            )}

            {/* Two searches, one per column — the line you are looking for is
                the one you can remember, in whichever language you remember it. */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2,
                mb: 1,
                position: "sticky",
                top: 0,
                zIndex: 1,
                bgcolor: "background.paper",
                py: 1,
              }}
            >
              <TextField
                size="small"
                fullWidth
                value={sourceQuery}
                onChange={(e) => setSourceQuery(e.target.value)}
                placeholder={`Search ${LANGUAGE_NAME[to === "es" ? "en" : "es"]}…`}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: sourceQuery ? (
                    <InputAdornment position="end">
                      <IconButton size="small" aria-label="Clear search" onClick={() => setSourceQuery("")}>
                        <ClearRoundedIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />
              <TextField
                size="small"
                fullWidth
                value={targetQuery}
                onChange={(e) => setTargetQuery(e.target.value)}
                placeholder={`Search ${LANGUAGE_NAME[to]}…`}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: targetQuery ? (
                    <InputAdornment position="end">
                      <IconButton size="small" aria-label="Clear search" onClick={() => setTargetQuery("")}>
                        <ClearRoundedIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />
            </Box>

            {filtering && visible.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                No line matches that search. Your edits are all still there — clear the search to see them.
              </Typography>
            )}

            {visible.map(({ row, index }, position) => (
              <Box
                key={row.source}
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                  alignItems: "start",
                  py: 1.5,
                  borderTop: position === 0 ? "none" : "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                    {LANGUAGE_NAME[to === "es" ? "en" : "es"]}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}>
                    {row.source}
                  </Typography>
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                      {LANGUAGE_NAME[to]}
                    </Typography>
                    {row.proposed && (
                      <Chip
                        size="small"
                        label="AI"
                        icon={<AutoAwesomeRoundedIcon sx={{ fontSize: 12 }} />}
                        sx={{ height: 18, fontSize: 10 }}
                      />
                    )}
                    {row.stale && (
                      <Chip
                        size="small"
                        color="warning"
                        variant="outlined"
                        label={`${LANGUAGE_NAME[to === "es" ? "en" : "es"]} changed since this was approved`}
                        icon={<WarningAmberRoundedIcon sx={{ fontSize: 12 }} />}
                        sx={{ height: 18, fontSize: 10 }}
                      />
                    )}
                  </Stack>
                  <TextField
                    size="small"
                    color={row.stale ? "warning" : undefined}
                    focused={row.stale || undefined}
                    fullWidth
                    multiline
                    value={row.target}
                    onChange={(e) => setTarget(index, e.target.value)}
                    placeholder={`No ${LANGUAGE_NAME[to]} yet`}
                  />
                </Box>
              </Box>
            ))}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={apply}
          disabled={loading || rows.length === 0}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Apply translation
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TranslationReview;
