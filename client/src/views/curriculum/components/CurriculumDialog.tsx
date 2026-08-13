import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ContentField from "./ContentField";
import SessionDialog from "./SessionDialog";
import TranslateButton from "./TranslateButton";
import { AppDispatch, getCurriculum } from "../../../store/store";
import { addCurriculum, closeCurriculumError, updateCurriculum } from "../../../store/slices/curriculums";
import { useToken } from "../../authentication/components/useToken";
import {
  Curriculum,
  CurriculumSession,
  SECTION_KEYS,
  SECTION_LABELS,
  emptyCurriculum,
  emptySession,
  hydrateSession,
  sessionItemCount,
} from "../curriculum-types";

/**
 * The one-line summary under a session's title in the list.
 *
 * "Tema principal" is what the author reaches for first and what identifies a
 * session at a glance, so it wins; the sections that hold content are the
 * fallback for a session still being drafted.
 */
const sessionSummary = (s: CurriculumSession): string => {
  const topics = (s.mainTopic ?? []).map((t) => t.en || t.es).filter(Boolean);
  if (topics.length) return topics.join(" · ");

  const filled = SECTION_KEYS.filter((k) => (s.sections?.[k]?.groups ?? []).some((g) => g.items?.length));
  if (filled.length) return filled.map((k) => SECTION_LABELS[k].en).join(", ");

  return "Nothing authored yet";
};

/**
 * Create / edit one curriculum, including all of its sessions.
 *
 * The whole document is edited locally and saved in a single request — adding a
 * session or an objective changes local state, and Save Changes persists it.
 * This matches how the role editor already behaves and keeps a curriculum
 * atomic; there is no half-saved state to reconcile.
 */
const CurriculumDialog: React.FC<{
  open: boolean;
  /** null → create a new curriculum. */
  current: Curriculum | null;
  onClose: () => void;
}> = ({ open, current, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [token] = useToken("");
  const state = useSelector(getCurriculum);
  const [draft, setDraft] = useState<Curriculum>(emptyCurriculum());
  const [saveError, setSaveError] = useState<string | null>(null);
  /** Index of the session open in its popup, or null when none is. */
  const [editingSession, setEditingSession] = useState<number | null>(null);
  const wasProcessing = useRef(false);

  // Seed the form whenever the dialog opens, hydrating any session that came
  // back from an older document missing a section key.
  useEffect(() => {
    if (!open) return;
    const base = current ? { ...current } : emptyCurriculum();
    setDraft({ ...base, sessions: (base.sessions ?? []).map(hydrateSession) });
    setSaveError(null);
    setEditingSession(null);
    wasProcessing.current = false;
  }, [open, current]);

  // Close on a save that succeeded; surface the message on one that did not.
  useEffect(() => {
    if (wasProcessing.current && !state.processing) {
      if (state.processError) setSaveError(state.processError);
      else onClose();
    }
    wasProcessing.current = state.processing ?? false;
  }, [state.processing, state.processError, onClose]);

  const patch = (changes: Partial<Curriculum>) => setDraft((d) => ({ ...d, ...changes }));

  const reindexSessions = (list: CurriculumSession[]): CurriculumSession[] =>
    list.map((s, i) => ({ ...s, order: i, number: i + 1 }));

  const setSession = (index: number, next: CurriculumSession) =>
    patch({ sessions: draft.sessions.map((s, i) => (i === index ? next : s)) });

  /** Append a session and open it straight away — nobody adds one to leave it blank. */
  const addSession = () => {
    const next = reindexSessions([...draft.sessions, emptySession(draft.sessions.length)]);
    patch({ sessions: next });
    setEditingSession(next.length - 1);
  };

  const moveSession = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= draft.sessions.length) return;
    const next = [...draft.sessions];
    [next[index], next[target]] = [next[target], next[index]];
    patch({ sessions: reindexSessions(next) });
  };

  const titled = draft.title.en.trim();

  const handleSave = () => {
    if (!titled) {
      setSaveError("Give the curriculum a title.");
      return;
    }
    setSaveError(null);
    dispatch(closeCurriculumError());
    if (draft._id) dispatch(updateCurriculum(token, draft));
    else dispatch(addCurriculum(token, draft));
  };

  const busy = Boolean(state.processing);

  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight={700}>
          {draft._id ? "Edit Curriculum" : "New Curriculum"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Title, sessions, and every section of each session
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {saveError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSaveError(null)}>
            {saveError}
          </Alert>
        )}

        <ContentField label="Title" value={draft.title} onChange={(v) => patch({ title: v })} required disabled={busy} />
        <ContentField
          label="Highlighted title (the accent line under the title)"
          value={draft.highlightedTitle}
          onChange={(v) => patch({ highlightedTitle: v })}
          disabled={busy}
        />
        <ContentField label="Description" value={draft.description} onChange={(v) => patch({ description: v })} multiline disabled={busy} />
        <ContentField
          label="Author"
          value={draft.author ?? { en: "", es: "" }}
          onChange={(v) => patch({ author: v })}
          disabled={busy}
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField
            size="small"
            type="number"
            label="Card number"
            value={draft.number}
            onChange={(e) => patch({ number: Number(e.target.value) || 1 })}
            disabled={busy}
            sx={{ width: 140 }}
          />
          <TextField
            size="small"
            label="Accent colour"
            value={draft.accent}
            onChange={(e) => patch({ accent: e.target.value })}
            disabled={busy}
            sx={{ width: 170 }}
            InputProps={{
              startAdornment: (
                <Box sx={{ width: 16, height: 16, borderRadius: "4px", bgcolor: draft.accent, mr: 1, flexShrink: 0, border: "1px solid rgba(0,0,0,.15)" }} />
              ),
            }}
          />
          <TextField
            size="small"
            label="Slug"
            placeholder="auto from title"
            value={draft.slug}
            onChange={(e) => patch({ slug: e.target.value })}
            disabled={busy}
            helperText="Leave blank to generate from the title"
            sx={{ flex: 1, minWidth: 200 }}
          />
          <FormControlLabel
            control={<Switch checked={draft.published} onChange={(e) => patch({ published: e.target.checked })} disabled={busy} />}
            label="Published"
          />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={700}>
            Sessions ({draft.sessions.length})
          </Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddRoundedIcon />}
            disabled={busy}
            onClick={addSession}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Add session
          </Button>
        </Stack>

        {draft.sessions.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No sessions yet. Add one to open it — every session carries the same structure: an introduction, five content
            sections, and a closing.
          </Typography>
        )}

        <Stack spacing={1}>
          {draft.sessions.map((session, index) => (
            <Paper
              key={session._id ?? index}
              elevation={0}
              onDoubleClick={() => setEditingSession(index)}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                transition: "border-color 0.2s",
                "&:hover": { borderColor: "primary.main" },
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  flexShrink: 0,
                  borderRadius: "50%",
                  bgcolor: draft.accent || "#7950c3",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {session.number}
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={700} noWrap>
                  {session.title.en || session.title.es || "Untitled session"}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                  {sessionSummary(session)}
                </Typography>
              </Box>

              <Chip size="small" variant="outlined" label={`${sessionItemCount(session)} items`} />

              <Button
                size="small"
                variant="outlined"
                startIcon={<EditRoundedIcon />}
                disabled={busy}
                onClick={() => setEditingSession(index)}
                sx={{ textTransform: "none", borderRadius: 2, flexShrink: 0 }}
              >
                Edit session
              </Button>

              <Tooltip title="Move up">
                <span>
                  <IconButton size="small" disabled={busy || index === 0} onClick={() => moveSession(index, -1)}>
                    <ArrowUpwardRoundedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Move down">
                <span>
                  <IconButton size="small" disabled={busy || index === draft.sessions.length - 1} onClick={() => moveSession(index, 1)}>
                    <ArrowDownwardRoundedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Remove session">
                <span>
                  <IconButton
                    size="small"
                    color="error"
                    disabled={busy}
                    onClick={() => patch({ sessions: reindexSessions(draft.sessions.filter((_, i) => i !== index)) })}
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Paper>
          ))}
        </Stack>
      </DialogContent>

      <SessionDialog
        open={editingSession !== null}
        session={editingSession !== null ? draft.sessions[editingSession] ?? null : null}
        onApply={(next) => editingSession !== null && setSession(editingSession, next)}
        onClose={() => setEditingSession(null)}
        disabled={busy}
      />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <TranslateButton value={draft} onApply={setDraft} disabled={busy} />
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose} disabled={busy} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={busy} sx={{ textTransform: "none", borderRadius: 2 }}>
          {busy ? "Saving…" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CurriculumDialog;
