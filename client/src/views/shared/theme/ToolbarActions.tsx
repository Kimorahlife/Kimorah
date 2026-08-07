import { Box, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import { Account } from "@toolpad/core";
import { useTranslation } from "react-i18next";
import LanguageMenu from "../LanguageMenu";
import { useUser } from "../../authentication/components/useUser";

/**
 * Right-hand actions rendered in the DashboardLayout header: the language
 * picker, notifications, and the Toolpad Account control (avatar + sign-out,
 * wired via the AppProvider `authentication` prop).
 *
 * The name + role caption sits beside the avatar here rather than being
 * repeated inside individual pages, so every signed-in surface identifies the
 * viewer the same way. The caption reads from the user's ROLE — the only thing
 * that governs what they can reach — never from their signup intention.
 */
const ToolbarActions: React.FC = () => {
  const { t } = useTranslation();
  const user = useUser();

  return (
    <Box sx={{ display: "flex", alignItems: "center", flexWrap: "nowrap", gap: 1.5 }}>
      <LanguageMenu variant="light" />
      <Divider orientation="vertical" flexItem sx={{ height: 28, borderColor: "divider", mx: 0.5 }} />
      <Tooltip title={t("common.notifications", "Notifications")}>
        <IconButton size="small" aria-label={t("common.notifications", "Notifications")}>
          <NotificationsNoneRoundedIcon />
        </IconButton>
      </Tooltip>
      <Account
        slotProps={{
          preview: {
            slotProps: {
              avatar: { sx: { width: 36, height: 36, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" } },
              avatarIconButton: { sx: { p: 0 } },
            },
          },
          signOutButton: {
            variant: "outlined",
            fullWidth: true,
            sx: {
              mt: 1,
              bgcolor: "background.paper",
              color: "primary.main",
              borderColor: "primary.main",
              borderWidth: 2,
              "&:hover": {
                bgcolor: "action.hover",
                borderColor: "primary.dark",
                borderWidth: 2,
              },
            },
          },
        }}
      />
      {user && (
        <Box sx={{ display: { xs: "none", md: "block" }, minWidth: 0, lineHeight: 1.25 }}>
          <Typography noWrap sx={{ fontWeight: 700, fontSize: 13.5 }}>
            {user.name}
          </Typography>
          {user.roles && (
            <Typography noWrap sx={{ fontSize: 12, color: "text.secondary" }}>
              {t("common.roleAccount", "{{role}} Account", { role: user.roles })}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ToolbarActions;
