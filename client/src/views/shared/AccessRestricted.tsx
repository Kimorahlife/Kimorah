import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import LockPersonRoundedIcon from "@mui/icons-material/LockPersonRounded";
import { useTranslation } from "react-i18next";

/**
 * Shown to an authenticated user who has no role / no permissions yet — they
 * can sign in but can't do anything until an administrator grants them access.
 */
const AccessRestricted: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1, minHeight: "60vh", p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          maxWidth: 460,
          textAlign: "center",
          p: 5,
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            bgcolor: "action.hover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <LockPersonRoundedIcon sx={{ fontSize: 38, color: "primary.main" }} />
        </Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {t("access.title", "No access yet")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t(
            "access.message",
            "Your account doesn't have access to anything yet. Please contact your administrator to request access."
          )}
        </Typography>
      </Paper>
    </Box>
  );
};

export default AccessRestricted;
