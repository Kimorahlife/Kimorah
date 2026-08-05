import { ReactNode } from "react";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUser } from "../authentication/components/useUser";

const PURPLE = "#6f3fc1";
const INK = "#12142f";

const Panel = ({ children, sx = {} }: { children: ReactNode; sx?: object }) => (
  <Paper elevation={0} sx={{ border: "1px solid #e4dfec", borderRadius: 3, p: 2.25, ...sx }}>
    {children}
  </Paper>
);

const StatCard = ({ icon, value, label, action }: { icon: ReactNode; value: number; label: string; action: string }) => (
  <Panel sx={{ height: "100%" }}>
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{ width: 52, height: 52, borderRadius: "50%", bgcolor: "#f1eafb", color: PURPLE, display: "grid", placeItems: "center" }}>{icon}</Box>
      <Box><Typography variant="h4" fontWeight={800}>{value}</Typography><Typography variant="body2">{label}</Typography></Box>
    </Stack>
    <Typography sx={{ color: PURPLE, fontSize: 13, fontWeight: 700, mt: 2 }}>{action} →</Typography>
  </Panel>
);

/**
 * The practitioner dashboard. Routed directly at /dashboard/professional and
 * gated by the `professional-dashboard` permission, so it stands alone rather
 * than being swapped in by the admin dashboard.
 */
export default function ProfessionalDashboard({ firstName }: { firstName?: string }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = useUser();
  const displayName = firstName ?? user?.name?.split(" ")[0] ?? "there";
  const spanish = (i18n.resolvedLanguage || i18n.language).startsWith("es");
  const copy = (en: string, es: string) => spanish ? es : en;

  const journals = [
    copy("Finding my center after loss", "Encontrando mi centro después de la pérdida"),
    copy("Small actions, meaningful change", "Pequeñas acciones, grandes cambios"),
    copy("Gratitude in the midst of chaos", "Gratitud en medio del caos"),
  ];
  const bookmarks = [
    copy("Mindfulness and emotional regulation", "Mindfulness y regulación emocional"),
    copy("Compassionate grief guide", "Guía de duelo compasivo"),
    copy("Trauma grounding techniques", "Técnicas de grounding para trauma"),
  ];

  return (
    <Box sx={{ bgcolor: "#fdfcff", minHeight: "100%", color: INK, p: { xs: 2, md: 3 } }}>
      <Box sx={{ maxWidth: 1320, mx: "auto" }}>
        <Typography variant="h3" fontWeight={800}>
          {copy(`Welcome back, ${displayName} ✨`, `Bienvenida de nuevo, ${displayName} ✨`)}
        </Typography>
        <Typography sx={{ mt: .5 }}>{copy("Here’s your space to reflect, grow, and make an impact.", "Este es tu espacio para reflexionar, crecer y generar impacto.")}</Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 2.3fr) minmax(280px, .8fr)" }, gap: 2.5, mt: 2.5 }}>
          <Box>
            <Box sx={{ minHeight: 180, borderRadius: 3, p: { xs: 3, md: 4 }, color: "white", display: "flex", flexDirection: "column", justifyContent: "center", backgroundImage: "linear-gradient(90deg,rgba(39,20,91,.88),rgba(102,44,142,.35)),url('/pillars/priority-program-sunset.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
              <Typography variant="h5" fontWeight={700}>{copy("You’re showing up for others.", "Estás presente para los demás.")}</Typography>
              <Typography variant="h5">{copy("Don’t forget to show up for yourself.", "No olvides estar presente para ti.")}</Typography>
              <Button variant="contained" startIcon={<EditOutlinedIcon />} sx={{ alignSelf: "flex-start", mt: 2.5, bgcolor: "rgba(90,38,166,.9)", px: 3, borderRadius: 2, textTransform: "none" }}>{copy("Write in Journal", "Escribir en el diario")}</Button>
            </Box>

            <Typography variant="h5" fontWeight={800} sx={{ mt: 2.5, mb: 1.5 }}>{copy("At a Glance", "Resumen")}</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}><StatCard icon={<CalendarMonthOutlinedIcon />} value={5} label={copy("Upcoming Sessions", "Próximas sesiones")} action={copy("View calendar", "Ver calendario")} /></Grid>
              <Grid size={{ xs: 12, sm: 4 }}><StatCard icon={<MenuBookOutlinedIcon />} value={8} label={copy("Journal Entries", "Entradas del diario")} action={copy("This month", "Este mes")} /></Grid>
              <Grid size={{ xs: 12, sm: 4 }}><StatCard icon={<BookmarkBorderRoundedIcon />} value={15} label={copy("Saved Bookmarks", "Marcadores guardados")} action={copy("View all", "Ver todos")} /></Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: .5 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Panel>
                  <Typography fontWeight={800}>{copy("Journal entries shared with you", "Entradas del diario compartidas contigo")}</Typography>
                  {journals.map((item, index) => <Stack key={item} direction="row" spacing={1.5} sx={{ py: 1.4, borderBottom: index < journals.length - 1 ? "1px solid #eee9f3" : 0 }}><Box sx={{ color: PURPLE }}><EditOutlinedIcon /></Box><Box><Typography fontWeight={700} fontSize={14}>{item}</Typography><Typography variant="caption" color="text.secondary">{copy("A private reflection shared for support.", "Una reflexión privada compartida para recibir apoyo.")}</Typography></Box></Stack>)}
                </Panel>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Panel>
                  <Typography fontWeight={800}>{copy("Your Bookmarks", "Tus marcadores")}</Typography>
                  {bookmarks.map((item, index) => <Stack key={item} direction="row" alignItems="center" spacing={1.5} sx={{ py: 1.25 }}><Box sx={{ width: 55, height: 38, borderRadius: 1.5, background: index === 0 ? "linear-gradient(135deg,#d58bb6,#6e4ba8)" : index === 1 ? "linear-gradient(135deg,#f3b2c2,#59518e)" : "linear-gradient(135deg,#e9b074,#30294e)" }} /><Box sx={{ flex: 1 }}><Typography fontWeight={700} fontSize={14}>{item}</Typography><Typography variant="caption" color="text.secondary">{copy("Resource", "Recurso")}</Typography></Box><BookmarkBorderRoundedIcon sx={{ color: PURPLE }} /></Stack>)}
                  <Button fullWidth variant="outlined" sx={{ mt: 1, borderColor: "#d8c6ef", color: PURPLE, textTransform: "none" }}>{copy("Go to Bookmarks", "Ir a marcadores")}</Button>
                </Panel>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Panel>
                  <Stack direction="row" justifyContent="space-between"><Typography fontWeight={800}>{copy("Upcoming Sessions", "Próximas sesiones")}</Typography><Typography color={PURPLE} fontSize={13}>{copy("View calendar", "Ver calendario")}</Typography></Stack>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2, bgcolor: "#faf8fc", borderRadius: 2, p: 2 }}>
                    <Box sx={{ textAlign: "center" }}><Typography variant="caption">MAY</Typography><Typography variant="h4" fontWeight={800}>29</Typography></Box>
                    <Box><Typography variant="caption">10:00 AM – 11:00 AM</Typography><Typography fontWeight={800}>{copy("Individual Session", "Sesión individual")}</Typography><Typography variant="caption">{copy("Client: A.M.", "Cliente: A.M.")}</Typography></Box>
                  </Stack>
                </Panel>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Panel>
                  <Typography fontWeight={800}>{copy("Recommended for You", "Recomendado para ti")}</Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}><Box sx={{ width: 100, minHeight: 90, borderRadius: 2, backgroundImage: "url('/pillars/priority-program-sunset.png')", backgroundSize: "cover" }} /><Box><Typography fontWeight={800}>{copy("Self-care for Mental Health Professionals", "Autocuidado para profesionales de la salud mental")}</Typography><Typography variant="caption">{copy("Article · 5 min read", "Artículo · 5 min de lectura")}</Typography><br /><Button size="small" variant="outlined" sx={{ mt: 1, color: PURPLE, textTransform: "none" }}>{copy("Read Now", "Leer ahora")}</Button></Box></Stack>
                </Panel>
              </Grid>
            </Grid>
          </Box>

          <Stack spacing={2}>
            <Panel>
              <Typography fontWeight={800}>{copy("KIMORAH Life Professional Access", "Acceso profesional KIMORAH Life")}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ my: 1.5 }}>{copy("Your hub for professional resources, curricula, and research.", "Tu centro de recursos profesionales, currículos e investigación.")}</Typography>
              {[{ icon: <AutoStoriesOutlinedIcon />, title: copy("Curriculums", "Currículos"), action: () => navigate("/mission") }, { icon: <SearchRoundedIcon />, title: copy("Research", "Investigación"), action: () => navigate("/mission/coqui") }].map((item) => <Stack component="button" key={item.title} onClick={item.action} direction="row" alignItems="center" spacing={1.5} sx={{ width: "100%", border: 0, bgcolor: "transparent", py: 1.25, px: 0, textAlign: "left", cursor: "pointer" }}><Box sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: "#f1eafb", color: PURPLE, display: "grid", placeItems: "center" }}>{item.icon}</Box><Typography sx={{ flex: 1 }} fontWeight={700}>{item.title}</Typography><ChevronRightRoundedIcon /></Stack>)}
              <Typography sx={{ color: PURPLE, fontWeight: 700, mt: 1 }}>{copy("Explore All Resources", "Explorar todos los recursos")} →</Typography>
            </Panel>
            <Panel>
              <Typography fontWeight={800}>{copy("Bookmarks Overview", "Resumen de marcadores")}</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}><Box sx={{ width: 110, height: 110, borderRadius: "50%", background: "conic-gradient(#713cc1 0 40%,#9fc6c2 40% 67%,#edc5a2 67% 85%,#e6dcef 85%)", display: "grid", placeItems: "center" }}><Box sx={{ width: 66, height: 66, borderRadius: "50%", bgcolor: "white", display: "grid", placeItems: "center", textAlign: "center" }}><Typography fontWeight={800}>15<br /><Box component="span" sx={{ fontSize: 10 }}>Total</Box></Typography></Box></Box><Stack spacing={.7}><Typography variant="caption">● {copy("Articles", "Artículos")} 6</Typography><Typography variant="caption">● {copy("Tools", "Herramientas")} 4</Typography><Typography variant="caption">● {copy("Resources", "Recursos")} 3</Typography><Typography variant="caption">● {copy("Guides", "Guías")} 2</Typography></Stack></Box>
            </Panel>
            <Panel>
              <Typography fontWeight={800}>{copy("Recent Activity", "Actividad reciente")}</Typography>
              {[copy("New resource added to favorites", "Nuevo recurso agregado a favoritos"), copy("You completed a reflection", "Completaste una reflexión"), copy("You attended a webinar", "Asististe a un webinar")].map((item, index) => <Stack key={item} direction="row" spacing={1.25} sx={{ py: 1.2 }}><Box sx={{ color: PURPLE }}>{index === 0 ? <StarOutlineRoundedIcon /> : index === 1 ? <EditOutlinedIcon /> : <CalendarMonthOutlinedIcon />}</Box><Typography variant="body2">{item}</Typography></Stack>)}
            </Panel>
            <Panel sx={{ color: "white", backgroundImage: "linear-gradient(rgba(47,22,91,.78),rgba(47,22,91,.78)),url('/pillars/priority-program-sunset.png')", backgroundSize: "cover" }}>
              <FavoriteBorderRoundedIcon /><Typography fontWeight={800} sx={{ mt: 1 }}>{copy("Daily Reminder", "Recordatorio diario")}</Typography><Typography sx={{ mt: 1 }}>{copy("Every choice is a step toward your well-being.", "Cada elección es un paso hacia tu bienestar.")}</Typography>
            </Panel>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
