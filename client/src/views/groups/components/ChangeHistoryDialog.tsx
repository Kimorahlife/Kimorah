import { useEffect, useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { api } from "../../../api";
import type { ChangeLogEntry } from "../../../types/groups";

/**
 * The change history behind a group or a curriculum.
 *
 * One timeline covering both: what an author changed in the template and what
 * the professionals recorded in the group, interleaved in the order it
 * happened. That mix is the point — a participant count that looks wrong is
 * usually explained by an edit to the curriculum a week earlier.
 */

/** Plain-language labels. Falls back to the raw action so a new one is legible. */
const ACTION_LABEL: Record<string, string> = {
  curriculum_created: "Curriculum created",
  curriculum_updated: "Curriculum edited",
  curriculum_archived: "Curriculum archived",
  curriculum_unarchived: "Curriculum restored",
  curriculum_deleted: "Curriculum deleted",
  session_added: "Session added",
  session_removed: "Session removed",
  session_edited: "Session edited",
  group_created: "Group created",
  group_updated: "Group renamed",
  group_deleted: "Group deleted",
  participants_updated: "Participants recorded",
  professionals_changed: "Professionals changed",
  group_sessions_reconciled: "Sessions synced with the curriculum",
};

const SECTION_LABEL: Record<string, string> = {
  title: "title",
  mainTopic: "main topic",
  presentation: "presentation",
  closing: "closing",
  feedback: "feedback",
  therapeuticApproach: "therapeutic approach",
  clinicalReference: "clinical reference",
  concepts: "Concepts",
  objectives: "Objectives",
  psychoeducation: "Psychoeducation",
  intervention: "Intervention",
  processing: "Processing",
};

/**
 * A one-line summary of an entry.
 *
 * Deliberately does not print old/new values for content edits — a section
 * holds a whole nested tree, and dumping it here is what makes an audit log
 * unreadable. The values are stored, so a deeper view can be added later
 * without re-recording any history.
 */
const summarize = (entry: ChangeLogEntry): string => {
  if (entry.action === "participants_updated") {
    const change = entry.changes.find((c) => c.field === "participants");
    return change ? `${change.oldValue} → ${change.newValue}` : "";
  }

  if (entry.action === "session_added" || entry.action === "session_removed") {
    const change = entry.changes.find((c) => c.field === "session");
    return String(change?.newValue ?? change?.oldValue ?? "");
  }

  if (entry.action === "session_edited") {
    const parts = entry.changes.map((c) => SECTION_LABEL[c.field] ?? c.field);
    return parts.length ? `Changed: ${parts.join(", ")}` : "";
  }

  if (entry.action === "group_sessions_reconciled") {
    const added = Number(entry.changes.find((c) => c.field === "added")?.newValue ?? 0);
    const removed = Number(entry.changes.find((c) => c.field === "removed")?.newValue ?? 0);
    const bits = [
      added ? `${added} added` : "",
      removed ? `${removed} removed` : "",
    ].filter(Boolean);
    return bits.join(", ");
  }

  return "";
};

const formatWhen = (iso: string): string => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
};

function ChangeHistoryDialog({
  open,
  onClose,
  title,
  url,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  /** `/api/groups/:id/history` or `/api/curriculums/:id/history`. */
  url: string;
}) {
  const [entries, setEntries] = useState<ChangeLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    setLoading(true);
    setError("");

    api
      .get(url)
      .then((response) => {
        if (!cancelled) setEntries(response.data?.message ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message || "Could not load the history.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, url]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>{title}</DialogTitle>
      <DialogContent dividers>
        {loading && (
          <Stack alignItems="center" sx={{ py: 4 }}>
            <CircularProgress size={26} />
          </Stack>
        )}

        {!loading && error && <Typography color="error">{error}</Typography>}

        {!loading && !error && entries.length === 0 && (
          <Typography color="text.secondary">Nothing has changed yet.</Typography>
        )}

        <Stack spacing={1.5}>
          {entries.map((entry) => {
            const detail = summarize(entry);
            return (
              <Box
                key={entry._id}
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "flex-start",
                  p: 1.5,
                  border: "1px solid rgba(69,45,143,.14)",
                  borderRadius: 2,
                }}
              >
                <Chip
                  size="small"
                  label={entry.scope === "curriculum" ? "Curriculum" : "Group"}
                  color={entry.scope === "curriculum" ? "warning" : "primary"}
                  variant="outlined"
                  sx={{ flexShrink: 0 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                    {ACTION_LABEL[entry.action] ?? entry.action}
                  </Typography>
                  {detail && (
                    <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.25 }}>
                      {detail}
                    </Typography>
                  )}
                  <Typography sx={{ fontSize: 11.5, color: "text.secondary", mt: 0.5 }}>
                    {entry.changedByName} · {formatWhen(entry.timestamp)}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default ChangeHistoryDialog;
