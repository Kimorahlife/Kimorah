import { ReactNode, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUser } from "../authentication/components/useUser";

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

function SidebarItem({
  icon,
  label,
  active,
  badge,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        px: 2.25,
        py: 1.45,
        borderRadius: "10px",
        color: active ? PURPLE : INK,
        background: active ? "linear-gradient(90deg, #f1e9fc, #f7f2fb)" : "transparent",
        cursor: "pointer",
      }}
    >
      <Box sx={{ display: "flex", fontSize: 22 }}>{icon}</Box>
      <Typography sx={{ flex: 1, fontWeight: active ? 700 : 500, fontSize: 15 }}>{label}</Typography>
      {badge ? (
        <Box sx={{ minWidth: 25, height: 25, px: .7, borderRadius: 20, bgcolor: PURPLE, color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12 }}>
          {badge}
        </Box>
      ) : null}
    </Stack>
  );
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

function BookmarkRow({ title, image }: { title: string; image: string }) {
  return (
    <Stack direction="row" spacing={1.4} alignItems="center">
      <Box component="img" src={image} alt="" sx={{ width: 66, height: 52, borderRadius: "7px", objectFit: "cover" }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: INK, lineHeight: 1.25 }}>{title}</Typography>
        <Typography sx={{ fontSize: 11, color: MUTED, mt: .4 }}>Curriculum</Typography>
      </Box>
      <BookmarkBorderRoundedIcon sx={{ color: PURPLE }} />
    </Stack>
  );
}

function ActivityRow({ icon, time }: { icon: ReactNode; time: string }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.4}>
      <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "#f1e9fc", color: PURPLE, display: "grid", placeItems: "center" }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ height: 6, borderRadius: 5, bgcolor: "#dedce6", width: "82%" }} />
        <Box sx={{ height: 6, borderRadius: 5, bgcolor: "#dedce6", width: "55%", mt: .7 }} />
      </Box>
      <Typography sx={{ fontSize: 11, color: MUTED }}>{time}</Typography>
    </Stack>
  );
}

export default function ProfessionalDashboard({ firstName }: { firstName?: string }) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const user = useUser();
  const spanish = i18n.language?.toLowerCase().startsWith("es");
  const displayName = firstName ?? user?.name?.split(" ")[0] ?? (spanish ? "Claudia" : "Claudia");
  const [peopleServed, setPeopleServed] = useState("");

  const text = {
    welcome: spanish ? `Bienvenida de nuevo, ${displayName}` : `Welcome back, ${displayName}`,
    subtitle: spanish ? "Este es tu espacio para reflexionar, crecer y generar impacto." : "Good evening! Here’s your space to reflect, grow and make an impact.",
  };

  const navItems = [
    [<HomeOutlinedIcon />, spanish ? "Panel" : "Dashboard", true],
    [<AccountCircleOutlinedIcon />, spanish ? "Mi perfil" : "My Profile"],
    [<BookmarkBorderRoundedIcon />, spanish ? "Favoritos" : "Bookmarks"],
    [<ForumOutlinedIcon />, spanish ? "Foro comunitario" : "Community Forum"],
    [<MailOutlineRoundedIcon />, spanish ? "Mensajes" : "Messages", false, 3],
    [<SettingsOutlinedIcon />, spanish ? "Configuración" : "Settings"],
    [<HelpOutlineRoundedIcon />, spanish ? "Centro de ayuda" : "Help Center"],
  ] as const;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff", color: INK, display: "flex", fontFamily: "'Inter', 'Arial', sans-serif" }}>
      <Box
        component="aside"
        sx={{
          width: 270,
          flexShrink: 0,
          borderRight: "1px solid #eeeaf3",
          px: 2.5,
          py: 2.6,
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
        }}
      >
        <Stack alignItems="center" sx={{ mb: 3 }}>
          <Box component="img" src="/kimorah-logo.png" alt="Kimorah Life" sx={{ width: 65, height: 65, objectFit: "contain" }} />
          <Typography sx={{ fontFamily: "Georgia, serif", letterSpacing: 4, fontSize: 21, color: "#38206f", mt: .7 }}>KIMORAH LIFE</Typography>
          <Typography sx={{ fontSize: 8.5, textAlign: "center", lineHeight: 1.6, mt: .5 }}>Healing People. Revitalizing Communities.<br />Protecting Our Earth.</Typography>
        </Stack>
        <Stack spacing={.35}>
          {navItems.map(([icon, label, active, badge]) => <SidebarItem key={label} icon={icon} label={label} active={active} badge={badge} />)}
        </Stack>
        <Box sx={{ flex: 1 }} />
        <Box sx={{ borderRadius: "12px", overflow: "hidden", minHeight: 280, p: 3, color: "#fff", display: "flex", flexDirection: "column", backgroundImage: `linear-gradient(180deg, rgba(58,25,106,.35), rgba(20,15,67,.65)), url(${SUNSET})`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{spanish ? "Reflexión diaria" : "Daily Quote"}</Typography>
          <Typography sx={{ fontFamily: "Georgia, serif", fontSize: 19, lineHeight: 1.8, mt: 2.5 }}>“Every choice is a step toward your well-being.”</Typography>
          <Typography sx={{ fontSize: 11, mt: "auto", textAlign: "right" }}>— KIMORAH LIFE</Typography>
        </Box>
        <Typography sx={{ color: MUTED, fontSize: 10, mt: 2.5, textAlign: "center" }}>© 2026 KIMORAH LIFE.<br />All rights reserved.</Typography>
      </Box>

      <Box component="main" sx={{ flex: 1, minWidth: 0, px: { xs: 2, md: 4 }, py: 2.5 }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2} alignItems={{ sm: "center" }}>
          <Box>
            <Typography sx={{ fontSize: { xs: 25, md: 31 }, fontWeight: 800 }}>{text.welcome} ✨</Typography>
            <Typography sx={{ mt: .35, fontSize: 13.5 }}>{text.subtitle}</Typography>
          </Box>
          <Stack direction="row" alignItems="center" spacing={1.4}>
            <IconButton><NotificationsNoneRoundedIcon sx={{ color: INK }} /></IconButton>
            <Avatar sx={{ width: 48, height: 48, bgcolor: PURPLE }}>{displayName[0]}</Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13.5 }}>{user?.name ?? "Claudia A. Gonzalez"}</Typography>
              <Typography sx={{ fontSize: 12, color: MUTED }}>{spanish ? "Cuenta profesional" : "Professional Account"}</Typography>
            </Box>
          </Stack>
        </Stack>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 2.4fr) minmax(270px, .85fr)" }, gap: 3, mt: 2.5 }}>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ height: 188, borderRadius: "14px", overflow: "hidden", color: "#fff", px: { xs: 3, md: 4 }, py: 3.5, display: "flex", flexDirection: "column", justifyContent: "center", backgroundImage: `linear-gradient(90deg, rgba(37,17,84,.8), rgba(70,29,126,.2)), url(${SUNSET})`, backgroundSize: "cover", backgroundPosition: "center" }}>
              <Typography sx={{ fontSize: { xs: 18, md: 20 }, lineHeight: 1.45, fontWeight: 600 }}>
                {spanish ? <>Estás presente para los demás.<br />No olvides estar presente para ti.</> : <>You’re showing up for others.<br />Don’t forget to show up for yourself.</>}
              </Typography>
              <Button variant="outlined" sx={{ mt: 2.8, alignSelf: "flex-start", color: "#fff", borderColor: "#a578e7", bgcolor: "rgba(55,17,118,.42)", textTransform: "none", px: 3.5, "&:hover": { borderColor: "#fff" } }}>
                {spanish ? "Escribir en el diario" : "Write in Journal"}
              </Button>
            </Box>

            <Typography sx={{ mt: 2.4, mb: 1.5, fontSize: 17, fontWeight: 800 }}>{spanish ? "Resumen" : "At a Glance"}</Typography>
            <Stack direction={{ xs: "column", md: "row" }} gap={2}>
              <StatCard icon={<CalendarMonthOutlinedIcon />} value={5} label={spanish ? "Próximas sesiones" : "Upcoming Sessions"} link={spanish ? "Ver calendario" : "View calendar"} />
              <StatCard icon={<BookmarkBorderRoundedIcon />} value={15} label={spanish ? "Favoritos guardados" : "Saved Bookmark(s)"} link={spanish ? "Ver todos" : "View all"} />
              <StatCard icon={<PeopleAltOutlinedIcon />} value={Number(peopleServed) || 0} label={spanish ? "Personas atendidas" : "People Served"} link={spanish ? "Ver impacto" : "View impact"} />
            </Stack>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.25fr .95fr" }, gap: 2, mt: 2 }}>
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
              <Panel sx={{ p: 2.2 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.7 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 14 }}>{spanish ? "Tus favoritos (Currículos)" : "Your Bookmarks (Curriculums)"}</Typography>
                  <Typography sx={{ color: PURPLE, fontSize: 11 }}>View all</Typography>
                </Stack>
                <Stack spacing={1.25}>
                  <BookmarkRow title="Cuando la Tierra Cambia, Nosotros También" image={SUNSET} />
                  <BookmarkRow title="Cuando el Amor Permanece" image={SUNSET} />
                  <BookmarkRow title="Duelo y Pérdida: Herramientas para Acompañar" image={SUNSET} />
                </Stack>
                <Button fullWidth variant="outlined" sx={{ mt: 1.5, color: PURPLE, borderColor: "#d8c7ee", textTransform: "none" }}>{spanish ? "Ir a favoritos" : "Go to Bookmarks"}</Button>
              </Panel>
            </Box>

            <Panel sx={{ p: 2, mt: 2, background: "linear-gradient(90deg, #fff, #faf5ff)" }}>
              <Stack direction={{ xs: "column", sm: "row" }} gap={2} alignItems={{ sm: "center" }}>
                <Box sx={{ width: 50, height: 50, flexShrink: 0, borderRadius: "50%", bgcolor: "#f1e9fc", color: PURPLE, display: "grid", placeItems: "center" }}><PeopleAltOutlinedIcon /></Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 13.5 }}>{spanish ? "Personas atendidas usando recursos/herramientas del sitio" : "People Served Using Website Resources/Tools"}</Typography>
                  <Typography sx={{ color: MUTED, fontSize: 11.5, mt: .4 }}>{spanish ? "Registra el impacto de tu trabajo." : "Track the impact of your work."}</Typography>
                </Box>
                <TextField size="small" value={peopleServed} onChange={(event) => setPeopleServed(event.target.value.replace(/\D/g, ""))} placeholder={spanish ? "Cantidad" : "Enter amount"} sx={{ width: { sm: 170 } }} />
                <Button variant="contained" sx={{ bgcolor: PURPLE, px: 3.5, textTransform: "none" }}>Save</Button>
              </Stack>
            </Panel>
          </Box>

          <Stack spacing={2}>
            <Panel sx={{ p: 2.3 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 15 }}>{spanish ? "Acceso profesional KIMORAH Life" : "KIMORAH Life Professional Access"}</Typography>
              <Typography sx={{ color: MUTED, fontSize: 12, lineHeight: 1.5, mt: 1 }}>{spanish ? "Tu centro de recursos profesionales, currículos e investigación." : "Your hub for professional resources, curriculums, and research."}</Typography>
              <Stack spacing={2.2} sx={{ mt: 2.2 }}>
                {[{ icon: <AutoStoriesOutlinedIcon />, title: "Curriculums", sub: "Access psychoeducational curriculums and guides.", path: "/mission" }, { icon: <SearchRoundedIcon />, title: "Research", sub: "Explore research projects and publications.", path: "/research" }].map((item) => (
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
              <Typography sx={{ fontWeight: 800, fontSize: 14, mb: 2 }}>Recent Activity</Typography>
              <Stack spacing={2}><ActivityRow icon={<StarRoundedIcon fontSize="small" />} time="2h ago" /><ActivityRow icon={<EditOutlinedIcon fontSize="small" />} time="Today" /><ActivityRow icon={<CalendarMonthOutlinedIcon fontSize="small" />} time="May 25" /></Stack>
              <Button fullWidth variant="outlined" sx={{ mt: 2.2, color: PURPLE, borderColor: "#d8c7ee", textTransform: "none" }}>View All Activity</Button>
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
    </Box>
  );
}
