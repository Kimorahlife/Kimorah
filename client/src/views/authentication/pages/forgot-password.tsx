import React, { useState, ChangeEvent, FormEvent } from "react";
import { TextField, Button, Typography, Box, Link, Paper } from "@mui/material";
import { AppProvider } from "@toolpad/core/AppProvider";
import { api } from "../../../api";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();
  const { t } = useTranslation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!email || !validateEmail(email)) return;

    setLoading(true);
    try {
      await api.post("/api/users/forgot-password", { email });
      setSubmitted(true);
    } catch {
      setError(t("auth.forgotPassword.errorGeneric"));
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
            {submitted ? (
              /* ── Success state ── */
              <Box sx={{ textAlign: "center" }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 56, color: "success.main", mb: 2 }} />
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {t("auth.forgotPassword.successTitle")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  {t("auth.forgotPassword.successMessage")}
                </Typography>
                <Link href="/login" variant="body2" fontWeight={600} sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                  {t("auth.forgotPassword.backToLogin")}
                </Link>
              </Box>
            ) : (
              /* ── Form state ── */
              <>
                <Typography variant="h4" fontWeight={600} textAlign="center" sx={{ mb: 1 }}>
                  {t("auth.forgotPassword.title")}
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
                  {t("auth.forgotPassword.subtitle")}
                </Typography>

                {error && (
                  <Typography align="center" color="error" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                      {t("auth.forgotPassword.email")}
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="info@kimorah.app"
                      variant="outlined"
                      value={email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); setError(""); }}
                      onBlur={() => setTouched(true)}
                      error={touched && !validateEmail(email)}
                      helperText={touched && !validateEmail(email) ? t("auth.forgotPassword.errorInvalidEmail") : ""}
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
                    {loading ? t("auth.forgotPassword.submitting") : t("auth.forgotPassword.submit")}
                  </Button>

                  <Box textAlign="center">
                    <Link href="/login" variant="body2" fontWeight={600} sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                      {t("auth.forgotPassword.backToLogin")}
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

export default ForgotPassword;
