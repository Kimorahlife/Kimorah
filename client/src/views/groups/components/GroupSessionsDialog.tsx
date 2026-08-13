import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../../../api";
import type { GroupDetail, GroupSessionRow, ProfessionalRef } from "../../../types/groups";

/**
 * A group's curriculum, session by session, with the participant count for
 * each.
 *
 * This is a dialog rather than a page because recording attendance is a quick,
 * repeated act done against the list — a professional opens it, types three
 * numbers and closes it. Reading the material itself is the other half, and
 * that opens the group's own copy of the curriculum at /groups/:id/c/... —
 * deliberately a different URL from the /mission templates, so it is always
 * clear whether you are looking at the template or at this group's run of it.
 */
function GroupSessionsDialog({
  open,
  groupId,
  onClose,
  onSaved,
}: {
  open: boolean;
  groupId: string;
  onClose: () => void;
  /** Lets the list refresh its participant totals after edits. */
  onSaved?: () => void;
}) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const spanish = (i18n.resolvedLanguage || i18n.language || "").startsWith("es");
  const lang: "en" | "es" = spanish ? "es" : "en";

  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [professionals, setProfessionals] = useState<ProfessionalRef[]>([]);
  const [coProfessionals, setCoProfessionals] = useState<ProfessionalRef[]>([]);
  const [savingPeople, setSavingPeople] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get(`/api/groups/${groupId}`)
      .then(({ data }) => {
        const detail: GroupDetail | null = data?.message ?? null;
        setGroup(detail);
        setCoProfessionals(detail?.coProfessionalIds ?? []);
      })
      .catch((err) =>
        setError(err?.response?.data?.message || "Could not load this group's sessions."),
      )
      .finally(() => setLoading(false));
  }, [groupId]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  // Who may be added. Served by the groups API rather than the user directory,
  // so a professional does not need permission to read every user.
  useEffect(() => {
    if (!open) return;
    api
      .get("/api/groups/professionals")
      .then(({ data }) => setProfessionals(data?.message ?? []))
      .catch(() => undefined);
  }, [open]);

  /** Saved on change, like the participant counts — there is no save button. */
  const saveCoProfessionals = async (next: ProfessionalRef[]) => {
    const previous = coProfessionals;
    setCoProfessionals(next);
    setSavingPeople(true);
    try {
      await api.put(`/api/groups/${groupId}`, {
        coProfessionalIds: next.map((p) => p._id),
      });
      setDirty(true);
    } catch (err: any) {
      setCoProfessionals(previous);
      setError(err?.response?.data?.message || "Could not update the professionals.");
    } finally {
      setSavingPeople(false);
    }
  };

  /**
   * Written straight through on change rather than behind a save button: the
   * value is a single number, and losing it to a forgotten save is the worse
   * failure.
   */
  const setParticipants = async (row: GroupSessionRow, value: string) => {
    const participants = Math.max(0, Number(value) || 0);

    setGroup((current) =>
      current
        ? {
            ...current,
            sessions: current.sessions.map((s) =>
              s.sessionId === row.sessionId ? { ...s, participants } : s,
            ),
          }
        : current,
    );

    setSaving(row.sessionId);
    try {
      await api.patch(`/api/groups/${groupId}/sessions/${row.sessionId}`, { participants });
      setDirty(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not save that number.");
      load();
    } finally {
      setSaving(null);
    }
  };

  const close = () => {
    if (dirty) onSaved?.();
    setDirty(false);
    onClose();
  };

  const name =
    group?.name?.[lang] ||
    group?.name?.en ||
    group?.name?.es ||
    (spanish ? "Grupo sin nombre" : "Untitled group");

  const total = (group?.sessions ?? [])
    .filter((s) => !s.removed)
    .reduce((sum, s) => sum + s.participants, 0);

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 800, pb: 0.5 }}>
        {name}
        <Typography sx={{ fontSize: 13, color: "text.secondary", fontWeight: 400, mt: 0.25 }}>
          {group?.curriculum?.title?.[lang] || group?.curriculum?.slug || ""}
          {group ? ` · ${spanish ? "Total" : "Total"}: ${total}` : ""}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Who runs this group. The main professional is fixed — they are the
            person accountable for the record — and everyone else is added
            here. Only they or an admin may change it, which the server also
            enforces. */}
        {group && (
          <Box sx={{ mb: 2.5, p: 2, border: "1px solid rgba(69,45,143,.14)", borderRadius: 2.5 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 13.5, mb: 1.25 }}>
              {spanish ? "Profesionales" : "Professionals"}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <Chip
                size="small"
                color="primary"
                label={`${group.mainProfessionalId?.name || group.mainProfessionalId?.email || "—"} · ${
                  spanish ? "principal" : "main"
                }`}
              />
            </Stack>

            <Autocomplete
              multiple
              disabled={!group.canManage || savingPeople}
              options={professionals.filter(
                (p) => String(p._id) !== String(group.mainProfessionalId?._id),
              )}
              value={coProfessionals}
              onChange={(_event, next) => saveCoProfessionals(next)}
              getOptionLabel={(option) => option.name || option.email || ""}
              isOptionEqualToValue={(option, value) => String(option._id) === String(value._id)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label={spanish ? "Co-profesionales" : "Co-professionals"}
                  placeholder={
                    group.canManage
                      ? spanish
                        ? "Agregar profesional"
                        : "Add a professional"
                      : ""
                  }
                />
              )}
            />

            {!group.canManage && (
              <Typography sx={{ fontSize: 11.5, color: "text.secondary", mt: 0.75 }}>
                {spanish
                  ? "Solo el profesional principal o un administrador puede cambiar esto."
                  : "Only the main professional or an admin can change this."}
              </Typography>
            )}
          </Box>
        )}

        {loading ? (
          <Stack alignItems="center" sx={{ py: 5 }}>
            <CircularProgress size={26} />
          </Stack>
        ) : (
          <Stack spacing={1.25}>
            {(group?.sessions ?? []).map((row) => (
              <Box
                key={row.sessionId}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  border: "1px solid rgba(69,45,143,.14)",
                  borderRadius: 2.5,
                  // A session the curriculum dropped keeps its number: it
                  // records an evening that happened.
                  opacity: row.removed ? 0.6 : 1,
                  bgcolor: row.removed ? "rgba(0,0,0,.02)" : "transparent",
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                      {row.removed
                        ? spanish
                          ? "Sesión eliminada del currículo"
                          : "Session removed from curriculum"
                        : `${row.number}. ${row.title?.[lang] || row.title?.en || ""}`}
                    </Typography>
                    {row.removed && (
                      <Chip
                        size="small"
                        variant="outlined"
                        color="warning"
                        label={spanish ? "Eliminada" : "Removed"}
                      />
                    )}
                  </Stack>
                  {!row.removed && row.mainTopic?.length > 0 && (
                    <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.3 }}>
                      {row.mainTopic.map((topic) => topic?.[lang] || topic?.en).join(" · ")}
                    </Typography>
                  )}
                </Box>

                <TextField
                  size="small"
                  type="number"
                  label={spanish ? "Participantes" : "Participants"}
                  value={row.participants}
                  onChange={(event) => setParticipants(row, event.target.value)}
                  disabled={row.removed || saving === row.sessionId}
                  inputProps={{ min: 0 }}
                  sx={{ width: 130, flexShrink: 0 }}
                />

                {!row.removed && group?.curriculum?.slug && (
                  <Button
                    size="small"
                    variant="outlined"
                    endIcon={<OpenInNewRoundedIcon />}
                    onClick={() =>
                      // The group's own copy — never the /mission template.
                      navigate(`/groups/${groupId}/c/${group.curriculum?.slug}/session/${row.number}`)
                    }
                    sx={{ textTransform: "none", flexShrink: 0 }}
                  >
                    {spanish ? "Abrir currículo" : "Open curriculum"}
                  </Button>
                )}
              </Box>
            ))}

            {!loading && (group?.sessions ?? []).length === 0 && (
              <Typography sx={{ color: "text.secondary", fontSize: 13.5 }}>
                {spanish
                  ? "Este currículo todavía no tiene sesiones."
                  : "This curriculum has no sessions yet."}
              </Typography>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        {group?.curriculum?.slug && (
          <Button
            variant="outlined"
            startIcon={<MenuBookRoundedIcon />}
            onClick={() => navigate(`/groups/${groupId}/c/${group.curriculum?.slug}`)}
            sx={{ textTransform: "none" }}
          >
            {spanish ? "Ver currículo completo" : "Open full curriculum"}
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        <Button variant="contained" onClick={close} sx={{ textTransform: "none" }}>
          {spanish ? "Listo" : "Done"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default GroupSessionsDialog;
