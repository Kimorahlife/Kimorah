import { Box, Divider } from "@mui/material";
import { Account } from "@toolpad/core";
import LanguageMenu from "../LanguageMenu";

/**
 * Right-hand actions rendered in the DashboardLayout header: the language
 * picker and the Toolpad Account control (avatar + sign-out, wired via the
 * AppProvider `authentication` prop).
 */
const ToolbarActions: React.FC = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", flexWrap: "nowrap", gap: 1.5 }}>
      <LanguageMenu variant="light" />
      <Divider orientation="vertical" flexItem sx={{ height: 28, borderColor: "divider", mx: 0.5 }} />
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
    </Box>
  );
};

export default ToolbarActions;
