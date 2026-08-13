import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../../api";
import type { GroupSummary } from "../../types/groups";
import Spinner from "../shared/buttons/Spinner";
import Delete from "../shared/buttons/Delete";
import { CanAdd, CanDelete, CanEdit, FeatureUiGate, ReadOnlyBanner } from "../shared/permissions";
import MainCard from "../../Berry/ui-component/cards/MainCard";
import ChangeHistoryDialog from "./components/ChangeHistoryDialog";
import CreateGroupDialog from "./components/CreateGroupDialog";
import GroupSessionsDialog from "./components/GroupSessionsDialog";

/**
 * Groups — a professional running a curriculum with a set of people.
 *
 * Laid out like the Users page on purpose: same gate, same card, same row
 * shape, same action cluster. A management list should not look like a
 * different product depending on which one you opened.
 *
 * Which groups appear is decided on the server — your own if you are a
 * professional, all of them for a global role — so this renders whatever it is
 * given rather than filtering here.
 */
const GroupsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const spanish = (i18n.resolvedLanguage || i18n.language || "").startsWith("es");
  const lang: "en" | "es" = spanish ? "es" : "en";

  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [historyFor, setHistoryFor] = useState<GroupSummary | null>(null);
  const [sessionsFor, setSessionsFor] = useState<GroupSummary | null>(null);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/groups");
      setGroups(response.data?.message ?? []);
    } catch (err: any) {
      setError(err?.response?.data?.message || t("groups.loadFailed", "Could not load groups."));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const removeGroup = async (group: GroupSummary) => {
    try {
      await api.delete(`/api/groups/${group._id}`);
      setGroups((current) => current.filter((g) => g._id !== group._id));
    } catch (err: any) {
      setError(err?.response?.data?.message || t("groups.deleteFailed", "Could not delete the group."));
    }
  };

  /** A group's own name, falling back to the other language then the curriculum. */
  const nameOf = (group: GroupSummary): string =>
    group.name?.[lang] ||
    group.name?.en ||
    group.name?.es ||
    group.curriculumId?.title?.[lang] ||
    t("groups.untitled", "Untitled group");

  return (
    <FeatureUiGate
      feature="groups"
      fallback={
        <Box p={3}>
          <Alert severity="warning">
            {t("groups.noAccess", "You don't have permission to view groups.")}
          </Alert>
        </Box>
      }
    >
      <Box p={3}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {t("groups.title", "Groups")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("groups.subtitle", "Each group runs one curriculum with one set of people")}
            </Typography>
          </Box>
          <CanAdd feature="groups">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreating(true)}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              {t("groups.new", "New group")}
            </Button>
          </CanAdd>
        </Stack>

        <ReadOnlyBanner feature="groups" />

        {error && (
          <Snackbar
            open={Boolean(error)}
            autoHideDuration={6000}
            onClose={() => setError("")}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={() => setError("")} severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          </Snackbar>
        )}

        <CreateGroupDialog
          open={creating}
          onClose={() => setCreating(false)}
          onCreated={() => {
            setCreating(false);
            // Back to the list with the new group on it — the sessions dialog
            // is where its participants get recorded.
            fetchGroups();
          }}
        />

        {sessionsFor && (
          <GroupSessionsDialog
            open
            groupId={sessionsFor._id}
            onClose={() => setSessionsFor(null)}
            // Participant totals live on the row behind the dialog, so they
            // have to be refetched once numbers change.
            onSaved={fetchGroups}
          />
        )}

        {historyFor && (
          <ChangeHistoryDialog
            open
            onClose={() => setHistoryFor(null)}
            title={`${t("groups.history", "Change history")} — ${nameOf(historyFor)}`}
            url={`/api/groups/${historyFor._id}/history`}
          />
        )}

        {loading ? (
          <Spinner />
        ) : (
          <MainCard border boxShadow title={t("groups.title", "Groups")}>
            <Stack spacing={2}>
              {groups.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  {t("groups.empty", "No groups yet. Create one to record participants per session.")}
                </Typography>
              )}

              {groups.map((group) => (
                <Paper
                  key={group._id}
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    "&:hover": { boxShadow: 3 },
                    transition: "box-shadow 0.2s",
                  }}
                >
                  <GroupsRoundedIcon sx={{ color: "primary.main" }} />

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" fontWeight={700} noWrap>
                      {nameOf(group)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                      {group.curriculumId?.title?.[lang] || group.curriculumId?.slug || "—"}
                      {" · "}
                      {group.mainProfessionalId?.name || group.mainProfessionalId?.email || "—"}
                    </Typography>
                  </Box>

                  {group.curriculumId?.archived && (
                    <Chip
                      size="small"
                      variant="outlined"
                      color="warning"
                      label={t("groups.archivedCurriculum", "Curriculum archived")}
                    />
                  )}
                  {group.coProfessionalIds.length > 0 && (
                    <Chip
                      size="small"
                      variant="outlined"
                      label={t("groups.coProfessionals", "+{{count}} co-professional", {
                        count: group.coProfessionalIds.length,
                      })}
                    />
                  )}
                  <Chip
                    size="small"
                    variant="outlined"
                    label={t("groups.sessionCount", "{{count}} sessions", {
                      count: group.sessionCount,
                    })}
                  />
                  <Chip
                    size="small"
                    color="primary"
                    variant="outlined"
                    label={t("groups.participantCount", "{{count}} participants", {
                      count: group.totalParticipants,
                    })}
                  />

                  <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 28, alignSelf: "center" }} />

                  {/* The main act: the group's sessions with a participant
                      count on each, and a way into this group's own copy of
                      the curriculum. A dialog because recording attendance is
                      a quick, repeated edit made against this list. */}
                  <CanEdit feature="groups">
                    <Tooltip
                      title={t("groups.sessionsAndParticipants", "Sessions & participants")}
                    >
                      <IconButton
                        size="small"
                        onClick={() => setSessionsFor(group)}
                        sx={{ color: "primary.main" }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CanEdit>

                  {/* Straight to this group's whole curriculum, without going
                      through the participants dialog first. */}
                  {group.curriculumId?.slug && (
                    <Tooltip title={t("groups.openCurriculum", "Open curriculum")}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(`/groups/${group._id}/c/${group.curriculumId?.slug}`)
                        }
                        sx={{ color: "primary.main" }}
                      >
                        <MenuBookRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}

                  <Tooltip title={t("groups.history", "Change history")}>
                    <IconButton
                      size="small"
                      onClick={() => setHistoryFor(group)}
                      sx={{ color: "primary.main" }}
                    >
                      <HistoryRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <CanDelete feature="groups">
                    <Delete
                      title={t("groups.deleteTitle", "Delete group")}
                      onConfirm={() => removeGroup(group)}
                    />
                  </CanDelete>
                </Paper>
              ))}
            </Stack>
          </MainCard>
        )}
      </Box>
    </FeatureUiGate>
  );
};

export default GroupsPage;
