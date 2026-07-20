import React, { useState } from "react";
import { Box, Checkbox, Container, IconButton, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { useNavigate } from "react-router-dom";

const INDIGO = "#28216f";
const LAVENDER = "#a18bd5";

const ways = [
  ["VISIT AND BRIGHTEN A DAY", "Spend time at an assisted living community and read a book, poem, or magazine to someone."],
  ["SHARE YOUR SKILLS", "Offer your talents to a school or organization—tutoring, mentoring, technology, photography, design, music, and more."],
  ["VOLUNTEER AT A HOSPICE", "Provide comfort, companionship, and support to patients and families during a tender time."],
  ["VOLUNTEER AT A SHELTER", "Help provide a safe, welcoming space and support those rebuilding their lives."],
  ["HELP AT A SOUP KITCHEN", "Serve meals, prepare food, or simply share kindness with those in need."],
  ["BRING ART AND JOY TO HEALING", "Offer your creativity—art, music, or crafts—to children in hospitals and brighten their day."],
  ["BUY SOMEONE’S GROCERIES", "Lighten someone’s load with a simple act of generosity."],
  ["GIVE A HUG", "Sometimes, a hug is exactly what someone needs."],
  ["ASK AND LISTEN", "Ask someone, “Do you need a hand?” You never know how much it might mean."],
] as const;

const hoverBold = { transition: "font-weight .14s ease", "&:hover": { fontWeight: 800 } };

const LendAHandPage: React.FC = () => {
  const navigate = useNavigate();
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());

  const toggleWay = (title: string) => {
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  return (
    <Box component="main" sx={{ minHeight: "100dvh", width: "100%", background: "radial-gradient(circle at 50% 43%, rgba(255,249,239,.98) 0%, rgba(252,246,243,.96) 50%, rgba(232,220,246,.92) 100%)", color: INDIGO }}>
      <IconButton aria-label="Back to kindness" onClick={() => navigate("/kindness")} sx={{ position: "fixed", top: { xs: 14, sm: 24 }, left: { xs: 14, sm: 24 }, zIndex: 5, width: { xs: 50, sm: 58 }, height: { xs: 50, sm: 58 }, color: INDIGO, bgcolor: "rgba(205,184,232,.8)", backdropFilter: "blur(7px)", "&:hover": { bgcolor: "rgba(185,157,222,.96)" } }}><ArrowBackRoundedIcon /></IconButton>

      <Container maxWidth="md" sx={{ py: { xs: 7.5, sm: 6 }, px: { xs: 2.2, sm: 5 } }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{ ...hoverBold, fontSize: { xs: 28, sm: 43 }, letterSpacing: { xs: 7, sm: 13 }, lineHeight: 1.1 }}>WAYS YOU CAN</Typography>
          <Typography component="h1" sx={{ ...hoverBold, mt: .7, fontSize: { xs: 42, sm: 65 }, fontWeight: 500, letterSpacing: { xs: 5, sm: 10 }, lineHeight: 1.05 }}>LEND A HAND</Typography>
          <Box sx={{ mx: "auto", mt: 2.4, width: { xs: "88%", sm: "55%" }, display: "flex", alignItems: "center", gap: 2, color: LAVENDER }}><Box sx={{ flex: 1, height: 1, bgcolor: "currentColor" }} /><Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "currentColor" }} /><Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "currentColor" }} /><Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "currentColor" }} /><Box sx={{ flex: 1, height: 1, bgcolor: "currentColor" }} /></Box>
          <Typography sx={{ ...hoverBold, mt: 2, mb: 3.2, fontSize: { xs: 17, sm: 20 } }}>Small acts. Big impact. Together, we can make a difference.</Typography>
        </Box>

        <Box>
          {ways.map(([title, description]) => {
            const checked = completed.has(title);
            return <Box key={title} sx={{ display: "grid", gridTemplateColumns: { xs: "34px 1fr", sm: "34px minmax(220px, .85fr) 1px 1.65fr" }, columnGap: { xs: 1.2, sm: 2.4 }, alignItems: "center", py: { xs: 2, sm: 2.2 }, borderBottom: "1px solid rgba(129,105,184,.28)", opacity: checked ? .68 : 1, transition: "opacity .18s ease", "&:hover .way-copy": { fontWeight: 800 } }}>
              <Checkbox checked={checked} onChange={() => toggleWay(title)} inputProps={{ "aria-label": `Mark ${title.toLowerCase()} as ${checked ? "not completed" : "completed"}` }} sx={{ p: 0, color: LAVENDER, "&.Mui-checked": { color: INDIGO }, "& .MuiSvgIcon-root": { fontSize: 29 } }} />
              <Typography className="way-copy" component="h2" sx={{ fontSize: { xs: 17, sm: 22 }, fontWeight: 600, letterSpacing: 1.2, lineHeight: 1.3, textDecoration: checked ? "line-through" : "none", textDecorationThickness: 2, transition: "font-weight .14s ease, opacity .18s ease" }}>{title}</Typography>
              <Box sx={{ display: { xs: "none", sm: "block" }, width: 1, height: "75%", minHeight: 55, bgcolor: "rgba(129,105,184,.35)" }} />
              <Typography className="way-copy" sx={{ gridColumn: { xs: "2", sm: "auto" }, mt: { xs: .8, sm: 0 }, fontSize: { xs: 15, sm: 18 }, lineHeight: 1.42, transition: "font-weight .14s ease" }}>{description}</Typography>
            </Box>;
          })}
        </Box>

        <Box sx={{ mt: 3.2, display: "flex", alignItems: "center", justifyContent: "center", gap: { xs: 1.2, sm: 2 }, color: INDIGO }}>
          <Box sx={{ flex: 1, maxWidth: 120, height: 1, bgcolor: "rgba(129,105,184,.45)" }} />
          <Typography sx={{ ...hoverBold, fontSize: { xs: 13, sm: 17 }, letterSpacing: { xs: 1, sm: 2 }, textAlign: "center" }}>KINDNESS IS CONTAGIOUS.</Typography>
          <FavoriteRoundedIcon sx={{ color: LAVENDER, fontSize: 28 }} />
          <Typography sx={{ ...hoverBold, fontSize: { xs: 13, sm: 17 }, letterSpacing: { xs: 1, sm: 2 }, textAlign: "center" }}>BE THE REASON.</Typography>
          <Box sx={{ flex: 1, maxWidth: 120, height: 1, bgcolor: "rgba(129,105,184,.45)" }} />
        </Box>
      </Container>
    </Box>
  );
};

export default LendAHandPage;
