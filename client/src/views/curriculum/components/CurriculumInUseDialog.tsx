import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { api } from "../../../api";
import type { CurriculumUsage } from "../../../types/groups";

/**
 * Shown when a curriculum cannot be deleted because groups depend on it.
 *
 * There is deliberately no "delete anyway". Those groups hold participant
 * counts recorded by other professionals — evenings that actually happened —
 * and one admin clicking through a warning should not be able to destroy
 * someone else's record. Archiving is the way through: the curriculum stops
 * being available for new groups while the existing ones keep working.
 */
function CurriculumInUseDialog({
  open,
  onClose,
  curriculumId,
  curriculumTitle,
  usage,
  onArchived,
}: {
  open: boolean;
  onClose: () => void;
  curriculumId: string;
  curriculumTitle: string;
  usage: CurriculumUsage | null;
  onArchived: () => void;
}) {
  const { i18n } = useTranslation();
  const spanish = (i18n.resolvedLanguage || i18n.language || "").startsWith("es");
  const lang: "en" | "es" = spanish ? "es" : "en";

  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  const groups = usage?.groups ?? [];

  const archive = async () => {
    setWorking(true);
    setError("");
    try {
      await api.patch(`/api/curriculums/${curriculumId}/archive`, { archived: true });
      onArchived();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not archive the curriculum.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>
        {spanish ? "Este currículo está en uso" : "This curriculum is in use"}
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography sx={{ fontSize: 14 }}>
          {spanish
            ? `“${curriculumTitle}” no puede eliminarse: ${groups.length} grupo(s) lo están usando.`
            : `“${curriculumTitle}” cannot be deleted — ${groups.length} group${
                groups.length === 1 ? " is" : "s are"
              } using it.`}
        </Typography>

        <Stack spacing={1} sx={{ mt: 2 }}>
          {groups.map((group) => (
            <Box
              key={group._id}
              sx={{
                p: 1.5,
                border: "1px solid rgba(69,45,143,.14)",
                borderRadius: 2,
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: 13.5 }}>
                {group.name?.[lang] ||
                  group.name?.en ||
                  group.name?.es ||
                  (spanish ? "Grupo sin nombre" : "Untitled group")}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                {group.mainProfessionalId?.name || group.mainProfessionalId?.email || "—"}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Typography sx={{ fontSize: 12.5, color: "text.secondary", mt: 2.5 }}>
          {spanish
            ? "Archivarlo lo retira de los currículos disponibles para grupos nuevos. Los grupos existentes siguen funcionando y conservan sus participantes."
            : "Archiving retires it from the list new groups can be started from. Existing groups keep working and keep their participant history."}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          {spanish ? "Cancelar" : "Cancel"}
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={archive}
          disabled={working}
          sx={{ textTransform: "none" }}
        >
          {working
            ? spanish
              ? "Archivando…"
              : "Archiving…"
            : spanish
              ? "Archivar en su lugar"
              : "Archive instead"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CurriculumInUseDialog;
