import { Box, Paper, Typography } from "@mui/material";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import { useTranslation } from "react-i18next";

/**
 * Placeholder for a member-workspace surface whose page isn't built yet.
 *
 * Renders inside the DashboardLayout (unlike PillarPlaceholder, which is a
 * standalone full-bleed page), so the sidebar and header stay put and the user
 * can navigate away. Reaching it still requires the matching permission — the
 * route is gated exactly like a finished page, so swapping in the real view
 * later is a one-line routing change.
 *
 * Takes the same i18n key the sidebar entry uses, so the heading and the nav
 * label can never drift apart.
 */
const ComingSoon: React.FC<{ titleKey: string; fallback: string }> = ({ titleKey, fallback }) => {
  const { t } = useTranslation();
  const title = t(titleKey, fallback);
  return (
    <Box sx={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          maxWidth: 460,
          width: "100%",
          textAlign: "center",
          px: 4,
          py: 6,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            mx: "auto",
            mb: 2.5,
            borderRadius: "50%",
            bgcolor: "action.hover",
            color: "primary.main",
            display: "grid",
            placeItems: "center",
          }}
        >
          <ConstructionRoundedIcon fontSize="large" />
        </Box>
        <Typography variant="h4" fontWeight={700}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {t("common.comingSoon", "This space is being built. Check back soon.")}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ComingSoon;
