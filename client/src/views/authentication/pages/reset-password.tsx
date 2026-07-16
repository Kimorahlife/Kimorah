import React, { useState, ChangeEvent, FormEvent } from "react";
import { TextField, Button, Typography, Box, Link, Paper } from "@mui/material";
import { AppProvider } from "@toolpad/core/AppProvider";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../../../api";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const navigate = useNavigate();

  const missingToken = !token;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();
  const { t } = useTranslation();

  const passwordError = touched.password && password.length < 6 ? t("auth.resetPassword.errorWeakPassword") : "";
  const confirmError = touched.confirm && password !== confirm ? t("auth.resetPassword.errorPasswordMismatch") : "";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ password: true, confirm: true });

    if (password.length < 6 || password !== confirm) return;
    if (!token) {
      setError(t("auth.resetPassword.errorInvalidToken"));
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/users/reset-password", { token, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || t("auth.resetPassword.errorInvalidToken"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppProvider theme={theme}>
      <Box sx={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
        <Paper elevation={0} sx={{ display: "flex", width: "100%", height: "100%", borderRadius: 0 }}>
          {/* Left — branding */}
          <Box
            sx={{
              flex: 0.6,
              backgroundColor: "primary.main",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h1"
              sx={{ color: "#ffffff", fontWeight: 700, letterSpacing: 1 }}
            >
              Kimorah
            </Typography>
          </Box>

          {/* Right — form */}
          <Box
            sx={{
              flex: 1.4,
              p: 6,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              maxWidth: "500px",
              margin: "0 auto",
              width: "100%",
              backgroundColor: "#ffffff",
            }}
          >
            {missingToken ? (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" fontWeight={600} color="error" gutterBottom>
                  {t("auth.resetPassword.errorInvalidToken")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  {t("auth.resetPassword.subtitle")}
                </Typography>
                <Link href="/forgot-password" variant="body2" fontWeight={600} sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                  {t("auth.resetPassword.requestNewLink")}
                </Link>
              </Box>
            ) : success ? (
              /* ── Success state ── */
              <Box sx={{ textAlign: "center" }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 56, color: "success.main", mb: 2 }} />
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {t("auth.resetPassword.successTitle")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  {t("auth.resetPassword.successMessage")}
                </Typography>
                <Link href="/login" variant="body2" fontWeight={600} sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                  {t("auth.resetPassword.backToLogin")}
                </Link>
              </Box>
            ) : (
              /* ── Form state ── */
              <>
                <Typography variant="h4" fontWeight={600} textAlign="center" sx={{ mb: 1 }}>
                  {t("auth.resetPassword.title")}
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
                  {t("auth.resetPassword.subtitle")}
                </Typography>

                {error && (
                  <Typography align="center" color="error" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                      {t("auth.resetPassword.password")}
                    </Typography>
                    <TextField
                      fullWidth
                      type="password"
                      placeholder="••••••••"
                      variant="outlined"
                      value={password}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                      onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                      error={Boolean(passwordError)}
                      helperText={passwordError}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                      {t("auth.resetPassword.confirmPassword")}
                    </Typography>
                    <TextField
                      fullWidth
                      type="password"
                      placeholder="••••••••"
                      variant="outlined"
                      value={confirm}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)}
                      onBlur={() => setTouched((p) => ({ ...p, confirm: true }))}
                      error={Boolean(confirmError)}
                      helperText={confirmError}
                    />
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{ mb: 3, py: 1.5, textTransform: "none", fontSize: "1rem", fontWeight: 600 }}
                  >
                    {loading ? t("auth.resetPassword.submitting") : t("auth.resetPassword.submit")}
                  </Button>

                  <Box textAlign="center">
                    <Link href="/login" variant="body2" fontWeight={600} sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                      {t("auth.resetPassword.backToLogin")}
                    </Link>
                  </Box>
                </form>
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </AppProvider>
  );
};

export default ResetPassword;
