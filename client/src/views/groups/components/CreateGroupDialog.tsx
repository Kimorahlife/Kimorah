import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { api } from "../../../api";
import type { GroupCurriculumRef } from "../../../types/groups";

/**
 * Start a group from a curriculum.
 *
 * The name is bilingual like everything else authored here, but unlike a
 * curriculum it is not written in English and translated afterwards — a
 * professional types it in whichever language they work in. So the field the
 * dialog shows is the one matching the interface language, and the other is
 * left for the translate control on the group itself.
 */
function CreateGroupDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (groupId: string) => void;
}) {
  const { i18n } = useTranslation();
  const spanish = (i18n.resolvedLanguage || i18n.language || "").startsWith("es");
  const lang: "en" | "es" = spanish ? "es" : "en";

  const [curriculums, setCurriculums] = useState<GroupCurriculumRef[]>([]);
  const [curriculumId, setCurriculumId] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");

    api
      .get("/api/curriculums/all")
      .then((response) => {
        // An archived curriculum may not start new groups, so it never appears
        // in the picker even though existing groups keep running it.
        const list: GroupCurriculumRef[] = (response.data?.message ?? []).filter(
          (c: GroupCurriculumRef) => !c.archived,
        );
        setCurriculums(list);
      })
      .catch((err) =>
        setError(err?.response?.data?.message || "Could not load the curriculums."),
      );
  }, [open]);

  const submit = async () => {
    if (!curriculumId) {
      setError(spanish ? "Elija un currículo." : "Choose a curriculum.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await api.post("/api/groups", {
        curriculumId,
        name: { en: lang === "en" ? name : "", es: lang === "es" ? name : "" },
      });
      onCreated(response.data?.message?._id);
      setName("");
      setCurriculumId("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not create the group.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>
        {spanish ? "Nuevo grupo" : "New group"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ mt: 0.5 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            select
            fullWidth
            label={spanish ? "Currículo" : "Curriculum"}
            value={curriculumId}
            onChange={(event) => setCurriculumId(event.target.value)}
          >
            {curriculums.length === 0 && (
              <MenuItem value="" disabled>
                {spanish ? "No hay currículos disponibles" : "No curriculums available"}
              </MenuItem>
            )}
            {curriculums.map((curriculum) => (
              <MenuItem key={curriculum._id} value={curriculum._id}>
                {curriculum.title?.[lang] || curriculum.title?.en || curriculum.slug}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label={spanish ? "Nombre del grupo" : "Group name"}
            placeholder={spanish ? "Cohorte de los martes" : "Tuesday evening cohort"}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>
            {spanish
              ? "Se creará una fila por sesión del currículo para registrar participantes."
              : "A row is created for each session of the curriculum so you can record participants."}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          {spanish ? "Cancelar" : "Cancel"}
        </Button>
        <Button
          variant="contained"
          onClick={submit}
          disabled={saving}
          sx={{ textTransform: "none" }}
        >
          {saving
            ? spanish
              ? "Creando…"
              : "Creating…"
            : spanish
              ? "Crear grupo"
              : "Create group"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateGroupDialog;
