import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SessionEditor from "./SessionEditor";
import TranslateButton from "./TranslateButton";
import { CurriculumSession, emptySession } from "../curriculum-types";

/**
 * One session, edited in its own popup.
 *
 * A session carries seven tabs' worth of fields, so editing it inline left the
 * curriculum dialog three levels of accordion deep. Here it gets the whole
 * window instead, and the curriculum dialog behind it stays a short list.
 *
 * Edits are held locally and handed back on Done, so Cancel discards this
 * session's changes without touching the curriculum draft. Nothing reaches the
 * database until the curriculum itself is saved.
 */
const SessionDialog: React.FC<{
  open: boolean;
  /** The session being edited, or null when nothing is open. */
  session: CurriculumSession | null;
  onApply: (next: CurriculumSession) => void;
  onClose: () => void;
  disabled?: boolean;
}> = ({ open, session, onApply, onClose, disabled = false }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [draft, setDraft] = useState<CurriculumSession>(emptySession(0));
  const wasOpen = useRef(false);

  // Seed on the closed → open transition only. Re-seeding on every `session`
  // change would throw away what the author has typed.
  useEffect(() => {
    if (open && !wasOpen.current && session) setDraft(session);
    wasOpen.current = open;
  }, [open, session]);

  const heading = draft.title.en || draft.title.es;

  return (
    <Dialog open={open} onClose={disabled ? undefined : onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight={700}>
          {`Session ${draft.number}`}
          {heading && ` — ${heading}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Introduction, the five content sections, and the closing. Changes apply when you save the curriculum.
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <SessionEditor session={draft} onChange={setDraft} disabled={disabled} />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <TranslateButton value={draft} onApply={setDraft} disabled={disabled} />
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose} disabled={disabled} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onApply(draft);
            onClose();
          }}
          disabled={disabled}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionDialog;
