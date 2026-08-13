import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../../api";
import type { GroupDetail } from "../../types/groups";

const PURPLE = "#6330be";
const INK = "#101331";
const TITLE_FONT = "'Cormorant Garamond', Georgia, serif";

/**
 * A group's whole curriculum — every session in one place.
 *
 * The session pages show one evening at a time and the dialog is for recording
 * numbers; this is the map. It is the group's counterpart to the Mission index:
 * same curriculum, but presented as the thing this group is working through,
 * with each session carrying the participants recorded against it.
 *
 * Everything comes from the group endpoint, which already returns the
 * curriculum and its sessions with participant counts, so this needs no
 * endpoint of its own.
 */
function GroupCurriculumPage() {
  const { groupId = "" } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const spanish = (i18n.resolvedLanguage || i18n.language || "").startsWith("es");
  const lang: "en" | "es" = spanish ? "es" : "en";

  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;
    setLoading(true);
    api
      .get(`/api/groups/${groupId}`)
      .then(({ data }) => {
        if (live) setGroup(data?.message ?? null);
      })
      .catch((err) => {
        if (live) setError(err?.response?.data?.message || "Could not load this curriculum.");
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [groupId]);

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error || !group) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error || "Not found."}</Alert>
      </Container>
    );
  }

  const groupName =
    group.name?.[lang] ||
    group.name?.en ||
    group.name?.es ||
    (spanish ? "Grupo sin nombre" : "Untitled group");

  const slug = group.curriculum?.slug ?? "";
  const live = group.sessions.filter((s) => !s.removed);
  const total = live.reduce((sum, s) => sum + s.participants, 0);

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "#f4f0fa", color: INK }}>
      {/* Names the group before anything else, so this is never mistaken for
          the /mission template of the same curriculum. */}
      <Box
        onClick={() => navigate(`/groups/${groupId}`)}
        sx={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
          py: 1.1, px: 2, cursor: "pointer",
          bgcolor: PURPLE, color: "white", fontSize: 13.5, fontWeight: 700,
          "&:hover": { bgcolor: "#5a3aa8" },
        }}
      >
        <GroupsRoundedIcon sx={{ fontSize: 19 }} />
        <Box component="span">
          {spanish ? "Grupo" : "Group"}: {groupName}
        </Box>
        <Box component="span" sx={{ opacity: 0.75, fontWeight: 500 }}>
          · {spanish ? "volver al grupo" : "back to group"}
        </Box>
      </Box>

      <Box
        component="header"
        sx={{
          color: "white", textAlign: "center", px: 2,
          background: "radial-gradient(circle at 50% 44%,#292455 0%,#17173d 48%,#10122f 100%)",
          pt: { xs: 5, md: 6.5 }, pb: { xs: 6, md: 7.5 },
        }}
      >
        <Typography
          component="h1"
          sx={{ fontFamily: TITLE_FONT, fontSize: { xs: 38, md: 52 }, fontWeight: 500, lineHeight: 1.05 }}
        >
          {group.curriculum?.title?.[lang] || group.curriculum?.slug}
        </Typography>
        <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mt: 2.5 }}>
          <Chip
            label={`${live.length} ${spanish ? "sesiones" : "sessions"}`}
            sx={{ bgcolor: "rgba(255,255,255,.14)", color: "white", fontWeight: 700 }}
          />
          <Chip
            label={`${total} ${spanish ? "participantes" : "participants"}`}
            sx={{ bgcolor: "rgba(255,255,255,.14)", color: "white", fontWeight: 700 }}
          />
        </Stack>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 3, md: 4 } }}>
        {/* The list, not this group — the ribbon above already leads back to
            the group itself, so the two exits go to different places. */}
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate("/groups")}
          sx={{ textTransform: "none", mb: 2, color: PURPLE }}
        >
          {spanish ? "Volver a grupos" : "Back to groups"}
        </Button>

        <Stack spacing={1.5}>
          {group.sessions.map((row) => (
            <Box
              key={row.sessionId}
              onClick={() =>
                !row.removed && navigate(`/groups/${groupId}/c/${slug}/session/${row.number}`)
              }
              sx={{
                display: "flex", alignItems: "center", gap: 2.5,
                bgcolor: "#fff", border: "1px solid rgba(69,45,143,.15)",
                borderRadius: 3, p: 2.5,
                cursor: row.removed ? "default" : "pointer",
                opacity: row.removed ? 0.6 : 1,
                transition: "box-shadow .2s",
                "&:hover": { boxShadow: row.removed ? 0 : 3 },
              }}
            >
              <Box
                sx={{
                  width: 54, height: 54, flexShrink: 0, borderRadius: "50%",
                  bgcolor: "#eee7fa", color: PURPLE, display: "grid", placeItems: "center",
                  fontFamily: TITLE_FONT, fontSize: 24, fontWeight: 700,
                }}
              >
                {row.number ?? "—"}
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontFamily: TITLE_FONT, fontSize: 21, fontWeight: 600, color: PURPLE }}>
                  {row.removed
                    ? spanish
                      ? "Sesión eliminada del currículo"
                      : "Session removed from curriculum"
                    : row.title?.[lang] || row.title?.en || ""}
                </Typography>
                {!row.removed && row.mainTopic?.length > 0 && (
                  <Typography sx={{ fontSize: 13, color: "#5b5680", mt: 0.4 }}>
                    {row.mainTopic.map((topic) => topic?.[lang] || topic?.en).join(" · ")}
                  </Typography>
                )}
              </Box>

              <Chip
                size="small"
                variant="outlined"
                color="primary"
                label={`${row.participants} ${spanish ? "participantes" : "participants"}`}
                sx={{ flexShrink: 0 }}
              />

              {!row.removed && <ArrowForwardRoundedIcon sx={{ color: PURPLE, flexShrink: 0 }} />}
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}

export default GroupCurriculumPage;
