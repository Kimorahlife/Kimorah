import React from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import AirRoundedIcon from "@mui/icons-material/AirRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import { useNavigate } from "react-router-dom";
import LogoBadge from "../../landing/LogoBadge";
import { NavItem } from "./kindness-data";

const ICONS: Record<string, React.ElementType> = {
  home: HomeRoundedIcon,
  star: StarRoundedIcon,
  group: GroupsRoundedIcon,
  favorite: FavoriteRoundedIcon,
  air: AirRoundedIcon,
  schedule: ScheduleRoundedIcon,
  place: PlaceRoundedIcon,
  bar: BarChartRoundedIcon,
  doc: DescriptionRoundedIcon,
  info: InfoRoundedIcon,
  survey: AssignmentRoundedIcon,
};

const Sidebar: React.FC<{ nav: NavItem[]; quote: string; activeId: string }> = ({ nav, quote, activeId }) => {
  const navigate = useNavigate();

  const onNav = (item: NavItem) => {
    if (item.id === "survey") return navigate("/mission/coqui/survey");
    if (item.id === "data") return navigate("/mission/coqui");
    // Dashboard section: scroll to it if we're on the dashboard, else go there.
    const el = document.getElementById(`k-${item.id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else navigate("/mission/coqui");
  };

  return (
    <Box
      component="nav"
      sx={{
        width: 232,
        flexShrink: 0,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        gap: 0.5,
        p: 2,
        bgcolor: "rgba(0,0,0,0.22)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        height: "100dvh",
        overflowY: "auto",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
        <LogoBadge size={72} />
      </Box>

      <Button
        onClick={() => navigate("/mission")}
        startIcon={<ArrowBackIosNewRoundedIcon sx={{ fontSize: 14 }} />}
        sx={{ justifyContent: "flex-start", color: "#b7b1dd", textTransform: "none", fontWeight: 600, mb: 1, "&:hover": { bgcolor: "rgba(255,255,255,0.06)" } }}
      >
        Back to Mission
      </Button>

      {nav.map((item) => {
        const Icon = ICONS[item.icon] ?? BarChartRoundedIcon;
        const active = item.id === activeId;
        return (
          <Box
            key={item.id}
            onClick={() => onNav(item)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 1.5,
              py: 1,
              borderRadius: 2,
              cursor: "pointer",
              color: active ? "#fff" : "#b3addb",
              bgcolor: active ? "rgba(124,107,208,0.38)" : "transparent",
              "&:hover": { bgcolor: active ? "rgba(124,107,208,0.45)" : "rgba(255,255,255,0.06)" },
            }}
          >
            <Icon sx={{ fontSize: 19 }} />
            <Typography sx={{ fontSize: 13.5, fontWeight: active ? 700 : 500 }}>{item.label}</Typography>
          </Box>
        );
      })}

      <Typography sx={{ mt: 3, color: "#8f8ac0", fontStyle: "italic", fontSize: 12.5, lineHeight: 1.5 }}>
        {quote}
      </Typography>
    </Box>
  );
};

export default Sidebar;
