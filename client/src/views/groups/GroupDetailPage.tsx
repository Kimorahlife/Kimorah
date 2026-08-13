import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../../api";
import type { GroupDetail, GroupSessionRow } from "../../types/groups";
import ChangeHistoryDialog from "./components/ChangeHistoryDialog";

/**
 * One group: its sessions, and how many people came to each.
 *
 * This page is the facilitator's record, not the curriculum. It shows session
 * titles and participant counts and links out to the existing session pages for
 * the content itself, rather than rebuilding the seven-tab renderer here.
 */
function GroupDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const spanish = (i18n.resolvedLanguage || i18n.language || "").startsWith("es");
  const lang: "en" | "es" = spanish ? "es" : "en";

  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [changeNotice, setChangeNotice] = useState<{ added: number; removed: number } | null>(
    null,
  );

  const load = useCallback(() => {
    setLoading(true);
    api
      .get(`/api/groups/${id}`)
      .then((response) => {
        const detail: GroupDetail = response.data?.message;
        setGroup(detail);
        // The server empties this by acting on the diff, so it is non-zero only
        // on the first open after the curriculum changed — raise it once and
        // never nag again.
        if (detail?.pendingChanges?.added || detail?.pendingChanges?.removed) {
          setChangeNotice(detail.pendingChanges);
        }
      })
      .catch((err) => setError(err?.response?.data?.message || "Could not load the group."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(load, [load]);

  /**
   * Record attendance for one session.
   *
   * Written straight through on change rather than behind a save button: the
   * value is a single number and losing it to a forgotten save is a worse
   * failure than an extra request.
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
      await api.patch(`/api/groups/${id}/sessions/${row.sessionId}`, { participants });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not save that number.");
      load();
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error && !group) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!group) return null;

  const name =
    group.name?.[lang] ||
    group.name?.en ||
    group.name?.es ||
    (spanish ? "Grupo sin nombre" : "Untitled group");

  const total = group.sessions
    .filter((s) => !s.removed)
    .reduce((sum, s) => sum + s.participants, 0);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() => navigate("/groups")}
        sx={{ textTransform: "none", mb: 2 }}
      >
        {spanish ? "Volver a grupos" : "Back to groups"}
      </Button>

      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box>
          <Typography sx={{ fontSize: 26, fontWeight: 800 }}>{name}</Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 14, mt: 0.5 }}>
            {group.curriculum?.title?.[lang] || group.curriculum?.slug}
            {" · "}
            {spanish ? "Total" : "Total"}: <strong>{total}</strong>
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 12.5, mt: 0.5 }}>
            {spanish ? "Profesional principal" : "Main professional"}:{" "}
            {group.mainProfessionalId?.name || group.mainProfessionalId?.email || "—"}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          {group.curriculum?.slug && (
            <Button
              variant="outlined"
              startIcon={<MenuBookRoundedIcon />}
              onClick={() => navigate(`/groups/${id}/c/${group.curriculum?.slug}`)}
              sx={{ textTransform: "none" }}
            >
              {spanish ? "Ver currículo" : "Open curriculum"}
            </Button>
          )}
          <Button
            startIcon={<HistoryRoundedIcon />}
            onClick={() => setHistoryOpen(true)}
            sx={{ textTransform: "none" }}
          >
            {spanish ? "Historial" : "History"}
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Stack spacing={1.25}>
        {group.sessions.map((row) => (
          <Box
            key={row.sessionId}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              border: "1px solid rgba(69,45,143,.14)",
              borderRadius: 2.5,
              // A session the curriculum dropped is dimmed but still readable —
              // its number is a record of an evening that happened.
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

            {!row.removed && group.curriculum?.slug && (
              <Button
                size="small"
                endIcon={<OpenInNewRoundedIcon />}
                onClick={() =>
                  // Through the group, not the standalone curriculum, so the
                  // reader keeps the context and lands back here afterwards.
                  navigate(`/groups/${id}/c/${group.curriculum?.slug}/session/${row.number}`)
                }
                sx={{ textTransform: "none", flexShrink: 0 }}
              >
                {spanish ? "Abrir" : "Open"}
              </Button>
            )}
          </Box>
        ))}
      </Stack>

      {/* Raised once, on the first open after an author changed the curriculum. */}
      <Dialog open={Boolean(changeNotice)} onClose={() => setChangeNotice(null)}>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {spanish ? "El currículo cambió" : "The curriculum changed"}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 14 }}>
            {spanish
              ? "Desde la última vez que abrió este grupo:"
              : "Since you last opened this group:"}
          </Typography>
          <Stack spacing={0.5} sx={{ mt: 1.5 }}>
            {Boolean(changeNotice?.added) && (
              <Typography sx={{ fontSize: 14 }}>
                • {changeNotice?.added}{" "}
                {spanish ? "sesión(es) añadida(s)" : "session(s) added"}
              </Typography>
            )}
            {Boolean(changeNotice?.removed) && (
              <Typography sx={{ fontSize: 14 }}>
                • {changeNotice?.removed}{" "}
                {spanish ? "sesión(es) eliminada(s)" : "session(s) removed"}
              </Typography>
            )}
          </Stack>
          <Typography sx={{ fontSize: 12.5, color: "text.secondary", mt: 2 }}>
            {spanish
              ? "Los participantes registrados en sesiones eliminadas se conservan."
              : "Participants recorded against removed sessions are kept."}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setChangeNotice(null)} sx={{ textTransform: "none" }}>
            {spanish ? "Entendido" : "Got it"}
          </Button>
        </DialogActions>
      </Dialog>

      <ChangeHistoryDialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title={`${spanish ? "Historial" : "History"} — ${name}`}
        url={`/api/groups/${id}/history`}
      />
    </Container>
  );
}

export default GroupDetailPage;
