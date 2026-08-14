import { ReactNode, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUser } from "../authentication/components/useUser";
import { useFeatureFullAccess } from "../shared/permissions";
import { api } from "../../api";
import type { GroupSummary } from "../../types/groups";

const PURPLE = "#6330be";
const INK = "#101331";
const MUTED = "#62647c";
const SUNSET = "/images/professional-dashboard-sunset.png";

const panelSx = {
  border: "1px solid #e5e2ed",
  borderRadius: "14px",
  boxShadow: "0 2px 10px rgba(39, 24, 83, .025)",
  backgroundColor: "#fff",
};

function Panel({ children, sx = {} }: { children: ReactNode; sx?: object }) {
  return <Paper elevation={0} sx={{ ...panelSx, ...sx }}>{children}</Paper>;
}

function StatCard({ icon, value, label, link }: { icon: ReactNode; value: number; label: string; link: string }) {
  return (
    <Panel sx={{ p: 2.2, flex: 1, minWidth: 0 }}>
      <Stack direction="row" spacing={1.7} alignItems="center">
        <Box sx={{ width: 52, height: 52, borderRadius: "50%", bgcolor: "#f1e9fc", color: PURPLE, display: "grid", placeItems: "center" }}>
          {icon}
        </Box>
        <Box>
          <Typography sx={{ fontSize: 28, lineHeight: 1, fontWeight: 800, color: INK }}>{value}</Typography>
          <Typography sx={{ mt: .7, fontSize: 13.5, color: INK }}>{label}</Typography>
        </Box>
      </Stack>
      <Typography sx={{ mt: 2.1, color: PURPLE, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: .5 }}>
        {link} <ChevronRightRoundedIcon fontSize="small" />
      </Typography>
    </Panel>
  );
}

/**
 * The professional dashboard's page content.
 *
 * It deliberately renders NO shell of its own: the surrounding
 * DashboardLayout (see private-routes.tsx) already supplies the brand lockup,
 * the permission-driven sidebar, and the header identity block. This component
 * previously duplicated all three, which is why the page painted two sidebars
 * and two headers stacked inside each other.
 */
export default function ProfessionalDashboard({ firstName }: { firstName?: string }) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const user = useUser();
  const spanish = i18n.language?.toLowerCase().startsWith("es");
  const displayName = firstName ?? user?.name?.split(" ")[0] ?? (spanish ? "colega" : "there");

  const text = {
    welcome: spanish ? `Bienvenida de nuevo, ${displayName}` : `Welcome back, ${displayName}`,
    subtitle: spanish ? "Este es tu espacio para reflexionar, crecer y generar impacto." : "Good evening! Here’s your space to reflect, grow and make an impact.",
  };

  const canSeeGroups = useFeatureFullAccess("groups");
  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const affirmationFallback = spanish
    ? "El trabajo que realizo importa, incluso cuando su impacto no es visible de inmediato."
    : "The work I do matters, even when its impact is not immediately visible.";
  const [affirmation, setAffirmation] = useState(affirmationFallback);

  // A fresh dashboard access receives a different database-backed affirmation.
  useEffect(() => {
    setAffirmation(affirmationFallback);
    const previous = sessionStorage.getItem("professional-affirmation-id") || undefined;
    api
      .get("/api/professional-affirmations/random", {
        params: { lang: spanish ? "es" : "en", ...(previous ? { exclude: previous } : {}) },
      })
      .then(({ data }) => {
        const next = data?.message;
        if (!next?.text) return;
        setAffirmation(next.text);
        if (next._id) sessionStorage.setItem("professional-affirmation-id", next._id);
      })
      .catch(() => setAffirmation(affirmationFallback));
  }, [spanish]);

  // The dashboard reads groups rather than owning them: the list page is the
  // place to manage them, this is a way in and a count worth glancing at.
  useEffect(() => {
    if (!canSeeGroups) return;
    let cancelled = false;
    api
      .get("/api/groups")
      .then((response) => {
        if (!cancelled) setGroups(response.data?.message ?? []);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [canSeeGroups]);

  const groupName = (group: GroupSummary): string =>
    group.name?.[spanish ? "es" : "en"] ||
    group.name?.en ||
    group.name?.es ||
    group.curriculumId?.title?.[spanish ? "es" : "en"] ||
    (spanish ? "Grupo sin nombre" : "Untitled group");

  return (
    <Box sx={{ color: INK, fontFamily: "'Inter', 'Arial', sans-serif" }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 2.4fr) minmax(270px, .85fr)" }, gap: 3 }}>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ height: 188, borderRadius: "14px", overflow: "hidden", color: "#fff", px: { xs: 3, md: 4 }, py: 3.5, display: "flex", flexDirection: "column", justifyContent: "center", backgroundImage: `linear-gradient(90deg, rgba(37,17,84,.8), rgba(70,29,126,.2)), url(${SUNSET})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <Typography sx={{ fontSize: { xs: 25, md: 31 }, lineHeight: 1.2, fontWeight: 800, color: "#fff" }}>
              {text.welcome} ✨
            </Typography>
            <Typography sx={{ mt: .75, fontSize: 13.5, color: "#fff" }}>{text.subtitle}</Typography>
          </Box>

          <Typography sx={{ mt: 2.4, mb: 1.5, fontSize: 17, fontWeight: 800 }}>{spanish ? "Resumen" : "At a Glance"}</Typography>
          <Stack direction={{ xs: "column", md: "row" }} gap={2}>
            <StatCard icon={<CalendarMonthOutlinedIcon />} value={5} label={spanish ? "Próximas sesiones" : "Upcoming Sessions"} link={spanish ? "Ver calendario" : "View calendar"} />
            {canSeeGroups && (
              <StatCard
                icon={<GroupsRoundedIcon />}
                value={groups.length}
                label={spanish ? "Mis grupos" : "My Groups"}
                link={spanish ? "Ver grupos" : "View groups"}
              />
            )}
            {/* Live, unlike the two beside it: this counts participants actually
                recorded across the professional's groups. */}
            <StatCard
              icon={<PeopleAltOutlinedIcon />}
              value={groups.reduce((sum, group) => sum + (group.totalParticipants ?? 0), 0)}
              label={spanish ? "Personas atendidas" : "People Served"}
              link={spanish ? "Ver impacto" : "View impact"}
            />
          </Stack>

          {canSeeGroups && (
            <Panel sx={{ p: 2.2, mt: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
                  {spanish ? "Mis grupos" : "My Groups"}
                </Typography>
                <Typography
                  onClick={() => navigate("/groups")}
                  sx={{ color: PURPLE, fontSize: 11, cursor: "pointer" }}
                >
                  {spanish ? "Ver todos" : "View all"}
                </Typography>
              </Stack>

              {groups.length === 0 ? (
                <Stack spacing={1.5} alignItems="flex-start" sx={{ mt: 1.8 }}>
                  <Typography sx={{ color: MUTED, fontSize: 12.5 }}>
                    {spanish
                      ? "Todavía no lleva ningún grupo. Cree uno para registrar participantes por sesión."
                      : "You are not running any groups yet. Create one to record participants per session."}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate("/groups")}
                    sx={{ color: PURPLE, borderColor: "#d8c7ee", textTransform: "none" }}
                  >
                    {spanish ? "Ir a grupos" : "Go to Groups"}
                  </Button>
                </Stack>
              ) : (
                <Stack spacing={1.25} sx={{ mt: 1.8 }}>
                  {groups.slice(0, 4).map((group) => (
                    <Stack
                      key={group._id}
                      direction="row"
                      spacing={1.4}
                      alignItems="center"
                      onClick={() => navigate("/groups")}
                      sx={{
                        cursor: "pointer",
                        p: 1.2,
                        borderRadius: "10px",
                        "&:hover": { bgcolor: "#faf7ff" },
                      }}
                    >
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          flexShrink: 0,
                          borderRadius: "50%",
                          bgcolor: "#f1e9fc",
                          color: PURPLE,
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <GroupsRoundedIcon fontSize="small" />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 12.5 }} noWrap>
                          {groupName(group)}
                        </Typography>
                        <Typography sx={{ color: MUTED, fontSize: 11 }} noWrap>
                          {group.curriculumId?.title?.[spanish ? "es" : "en"] ||
                            group.curriculumId?.slug ||
                            "—"}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                        {group.totalParticipants ?? 0}
                      </Typography>
                      <ChevronRightRoundedIcon sx={{ color: MUTED, flexShrink: 0 }} />
                    </Stack>
                  ))}
                </Stack>
              )}
            </Panel>
          )}

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2, mt: 2 }}>
            <Panel sx={{ p: 2.2 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontWeight: 800, fontSize: 14 }}>{spanish ? "Programar próximas sesiones" : "Schedule Upcoming Sessions"}</Typography>
                <Typography sx={{ color: PURPLE, fontSize: 11 }}>{spanish ? "Ver calendario completo" : "View full calendar"}</Typography>
              </Stack>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr .8fr" }, gap: 2, mt: 1.6 }}>
                <Box>
                  <Typography textAlign="center" sx={{ fontWeight: 700, fontSize: 13, mb: 1 }}>May 2025</Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", rowGap: 1.3, textAlign: "center" }}>
                    {["SUN","MON","TUE","WED","THU","FRI","SAT",27,28,29,30,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31].map((day, index) => (
                      <Typography key={`${day}-${index}`} sx={{ fontSize: index < 7 ? 8.5 : 11, color: index < 7 ? MUTED : day === 15 ? "#fff" : INK, bgcolor: day === 15 ? PURPLE : "transparent", borderRadius: "50%", width: 24, height: 24, display: "grid", placeItems: "center", mx: "auto" }}>{day}</Typography>
                    ))}
                  </Box>
                </Box>
                <Stack spacing={1}>
                  <Typography sx={{ fontWeight: 700, fontSize: 12 }}>{spanish ? "Agregar sesión" : "Add Session"}</Typography>
                  <TextField size="small" placeholder={spanish ? "Seleccionar fecha" : "Select date"} />
                  <FormControl size="small"><Select displayEmpty value=""><MenuItem value="">{spanish ? "Elegir currículo" : "Choose curriculum"}</MenuItem></Select></FormControl>
                  <FormControl size="small"><Select displayEmpty value=""><MenuItem value="">{spanish ? "Elegir sesión" : "Choose session"}</MenuItem></Select></FormControl>
                  <Button variant="contained" sx={{ bgcolor: PURPLE, textTransform: "none" }}>{spanish ? "Programar sesión" : "Schedule Session"}</Button>
                </Stack>
              </Box>
            </Panel>
          </Box>
        </Box>

        <Stack spacing={2}>
          {/* Daily Quote — it used to close out this page's own sidebar. That
              sidebar is gone, so it leads the right rail instead. */}
          <Box sx={{ borderRadius: "14px", overflow: "hidden", minHeight: 240, p: 3, color: "#fff", display: "flex", flexDirection: "column", backgroundImage: `linear-gradient(180deg, rgba(58,25,106,.35), rgba(20,15,67,.65)), url(${SUNSET})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{spanish ? "Reflexión diaria" : "Daily Quote"}</Typography>
            <Typography sx={{ fontFamily: "Georgia, serif", fontSize: 19, lineHeight: 1.8, mt: 2.5 }}>“{affirmation}”</Typography>
            <Typography sx={{ fontSize: 11, mt: "auto", textAlign: "right" }}>— KIMORAH LIFE</Typography>
          </Box>
          <Panel sx={{ p: 2.3 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 15 }}>{spanish ? "Acceso profesional KIMORAH Life" : "KIMORAH Life Professional Access"}</Typography>
            <Typography sx={{ color: MUTED, fontSize: 12, lineHeight: 1.5, mt: 1 }}>{spanish ? "Tu centro de recursos profesionales, currículos e investigación." : "Your hub for professional resources, curriculums, and research."}</Typography>
            <Stack spacing={2.2} sx={{ mt: 2.2 }}>
              {[{ icon: <AutoStoriesOutlinedIcon />, title: "Curriculums", sub: "Access psychoeducational curriculums and guides.", path: "/mission" }].map((item) => (
                <Stack key={item.title} direction="row" spacing={1.5} alignItems="center" onClick={() => navigate(item.path)} sx={{ cursor: "pointer" }}>
                  <Box sx={{ width: 50, height: 50, borderRadius: "50%", bgcolor: "#f1e9fc", color: PURPLE, display: "grid", placeItems: "center" }}>{item.icon}</Box>
                  <Box sx={{ flex: 1 }}><Typography sx={{ fontWeight: 800, fontSize: 12.5 }}>{item.title}</Typography><Typography sx={{ color: MUTED, fontSize: 11, lineHeight: 1.45 }}>{item.sub}</Typography></Box>
                  <ChevronRightRoundedIcon />
                </Stack>
              ))}
            </Stack>
            <Typography sx={{ color: PURPLE, fontWeight: 700, fontSize: 12.5, mt: 2.4 }}>Explore All Resources →</Typography>
          </Panel>
          <Panel sx={{ p: 2.2 }}>
            <Stack direction="row" justifyContent="space-between"><Typography sx={{ fontWeight: 800, fontSize: 14 }}>Recommended for You</Typography><Typography sx={{ color: PURPLE, fontSize: 11 }}>View all</Typography></Stack>
            <Stack direction="row" spacing={1.5} sx={{ mt: 1.7 }}>
              <Box component="img" src={SUNSET} alt="" sx={{ width: 96, height: 108, borderRadius: "8px", objectFit: "cover" }} />
              <Box sx={{ flex: 1 }}><Box sx={{ height: 6, borderRadius: 5, bgcolor: "#dedce6", width: "78%", mt: 1 }} /><Box sx={{ height: 6, borderRadius: 5, bgcolor: "#dedce6", width: "95%", mt: .8 }} /><Box sx={{ height: 6, borderRadius: 5, bgcolor: "#dedce6", width: "55%", mt: .8 }} /><Button size="small" variant="outlined" sx={{ mt: 2, color: PURPLE, borderColor: "#d8c7ee", textTransform: "none" }}>Read Now</Button></Box>
            </Stack>
          </Panel>
        </Stack>
      </Box>
    </Box>
  );
}
