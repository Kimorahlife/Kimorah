import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../../api";
import type { GroupSummary } from "../../types/groups";
import ChangeHistoryDialog from "./components/ChangeHistoryDialog";
import CreateGroupDialog from "./components/CreateGroupDialog";

/**
 * The groups table.
 *
 * What a professional sees here is their own groups; a global role sees every
 * group in the workspace. That narrowing happens on the server, so this page
 * renders whatever it is given without deciding who may see what.
 */
function GroupsPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const spanish = (i18n.resolvedLanguage || i18n.language || "").startsWith("es");
  const lang: "en" | "es" = spanish ? "es" : "en";

  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [historyFor, setHistoryFor] = useState<GroupSummary | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get("/api/groups")
      .then((response) => setGroups(response.data?.message ?? []))
      .catch((err) => setError(err?.response?.data?.message || "Could not load your groups."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  /** A group's own name, falling back to the other language then the curriculum. */
  const nameOf = (group: GroupSummary): string =>
    group.name?.[lang] ||
    group.name?.en ||
    group.name?.es ||
    group.curriculumId?.title?.[lang] ||
    (spanish ? "Grupo sin nombre" : "Untitled group");

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography sx={{ fontSize: 27, fontWeight: 800 }}>
            {spanish ? "Grupos" : "Groups"}
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 14, mt: 0.5 }}>
            {spanish
              ? "Cada grupo lleva un currículo con un conjunto de personas."
              : "Each group runs one curriculum with one set of people."}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => setCreating(true)}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          {spanish ? "Nuevo grupo" : "New group"}
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Stack alignItems="center" sx={{ py: 6 }}>
          <CircularProgress />
        </Stack>
      ) : groups.length === 0 ? (
        <Box
          sx={{
            p: 5,
            textAlign: "center",
            border: "1px dashed rgba(69,45,143,.3)",
            borderRadius: 3,
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>
            {spanish ? "Todavía no hay grupos" : "No groups yet"}
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 14, mt: 0.5 }}>
            {spanish
              ? "Cree uno para empezar a registrar participantes por sesión."
              : "Create one to start recording participants per session."}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ border: "1px solid rgba(69,45,143,.15)", borderRadius: 3, overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>{spanish ? "Grupo" : "Group"}</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>
                  {spanish ? "Currículo" : "Curriculum"}
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }}>
                  {spanish ? "Profesional principal" : "Main professional"}
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }} align="right">
                  {spanish ? "Sesiones" : "Sessions"}
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }} align="right">
                  {spanish ? "Participantes" : "Participants"}
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }} align="right">
                  {spanish ? "Historial" : "History"}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group) => (
                <TableRow
                  key={group._id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/groups/${group._id}`)}
                >
                  <TableCell>
                    <Typography sx={{ fontWeight: 700, fontSize: 13.5 }}>
                      {nameOf(group)}
                    </Typography>
                    {group.coProfessionalIds.length > 0 && (
                      <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>
                        +{group.coProfessionalIds.length}{" "}
                        {spanish ? "co-profesional(es)" : "co-professional(s)"}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography sx={{ fontSize: 13 }}>
                        {group.curriculumId?.title?.[lang] ||
                          group.curriculumId?.slug ||
                          "—"}
                      </Typography>
                      {group.curriculumId?.archived && (
                        <Chip
                          size="small"
                          variant="outlined"
                          color="warning"
                          label={spanish ? "Archivado" : "Archived"}
                        />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontSize: 13 }}>
                    {group.mainProfessionalId?.name || group.mainProfessionalId?.email || "—"}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: 13 }}>
                    {group.sessionCount}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: 13, fontWeight: 700 }}>
                    {group.totalParticipants}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={spanish ? "Ver historial de cambios" : "View change history"}>
                      <IconButton
                        size="small"
                        onClick={(event) => {
                          // The row navigates; this button must not.
                          event.stopPropagation();
                          setHistoryFor(group);
                        }}
                      >
                        <HistoryRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      <CreateGroupDialog
        open={creating}
        onClose={() => setCreating(false)}
        onCreated={(groupId) => {
          setCreating(false);
          if (groupId) navigate(`/groups/${groupId}`);
          else load();
        }}
      />

      {historyFor && (
        <ChangeHistoryDialog
          open
          onClose={() => setHistoryFor(null)}
          title={`${spanish ? "Historial" : "History"} — ${nameOf(historyFor)}`}
          url={`/api/groups/${historyFor._id}/history`}
        />
      )}
    </Container>
  );
}

export default GroupsPage;
