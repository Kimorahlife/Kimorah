import { Box, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import MainCard from "../../Berry/ui-component/cards/MainCard";
import { useUser } from "../authentication/components/useUser";

/**
 * Minimal dashboard shell — confirms the authenticated session and shows the
 * current user. Domain widgets from the original app were intentionally
 * stripped; this is the foundation to build features on top of.
 */
export default function Dashboard() {
  const { t } = useTranslation();
  const user = useUser();

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box mb={4}>
        <Typography variant="h2" fontWeight={700}>
          {t("dashboard.welcomeBack", { name: firstName })}
        </Typography>
        <Typography variant="body1" color="text.secondary" mt={0.5}>
          You are logged in.
        </Typography>
      </Box>

      <MainCard title="Your account">
        <Box sx={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 1, columnGap: 3 }}>
          <Typography variant="subtitle1">Name</Typography>
          <Typography variant="body2">{user?.name ?? "-"}</Typography>

          <Typography variant="subtitle1">Email</Typography>
          <Typography variant="body2">{user?.email ?? "-"}</Typography>

          <Typography variant="subtitle1">Role</Typography>
          <Typography variant="body2">{user?.roles ?? "-"}</Typography>
        </Box>
      </MainCard>
    </Container>
  );
}
