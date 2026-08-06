import React, { useState, ChangeEvent, FocusEvent, FormEvent } from "react";
import { TextField, Button, Typography, Box, Link, Paper } from "@mui/material";
import { version } from "../../../../package.json";
import { useToken } from "../components/useToken";
import { useNavigate } from "react-router-dom";
import { AppProvider } from "@toolpad/core/AppProvider";
import { api } from "../../../api";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import LogoBadge from "../../landing/LogoBadge";
import LandingBackground from "../../landing/LandingBackground";

// Validation functions
const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [, setToken] = useToken();
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (error) setError(""); // Clear error on typing
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError(t("auth.login.errorBothRequired"));
      return;
    }
    if (!validateEmail(email)) {
      setError(t("auth.login.errorInvalidEmail"));
      return;
    }

    try {
      const response = await api.post("/api/users/login", {
        email,
        password,
      });

      const jwt = response.data.token;
      setToken(jwt);
      navigate("/");
    } catch (error: any) {
      setError(error.response?.data?.message || t("auth.login.errorInvalidCredentials"));
    }
  };

  return (
    <AppProvider theme={theme}>
      <Box sx={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            width: "100%",
            height: "100%",
            borderRadius: 0,
          }}
        >
          {/* Left side - landing-page background with the logo centered on top */}
          <Box
            sx={{
              flex: 0.6,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#cfc8e6",
            }}
          >
            {/* Layer 1 — SVG valley scene (default backdrop) */}
            <LandingBackground />
            {/* Layer 2 — optional real photo; covers the SVG when present at public/landing-bg.jpg */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage: "url('/landing-bg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            {/* Layer 3 — legibility overlay (matches the landing page) */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(20,12,40,0.32) 0%, rgba(20,12,40,0.14) 32%, rgba(20,12,40,0) 58%)",
              }}
            />
            {/* Logo, centered on top of the background */}
            <Box sx={{ position: "relative", zIndex: 1, display: "flex" }}>
              <LogoBadge size={{ xs: 150, sm: 220 }} />
            </Box>
          </Box>

          {/* Right side - Login Form (larger) with WHITE background */}
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
              backgroundColor: "#ffffff", // Changed to white
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 600,
                textAlign: "center",
                color: "text.primary",
                mb: 1,
              }}
            >
              {t("auth.login.title")}
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, textAlign: "center" }}
            >
              {t("auth.login.subtitle")}
            </Typography>

            {error && (
              <Typography align="center" color="error">
                {error}
              </Typography>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: 600, color: "text.primary" }}
                >
                  {t("auth.login.email")}
                </Typography>
                <TextField
                  fullWidth
                  placeholder="info@kimorah.app"
                  margin="none"
                  variant="outlined"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && !validateEmail(email)}
                  helperText={
                    touched.email && !validateEmail(email)
                      ? t("auth.login.emailError")
                      : ""
                  }
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: 600, color: "text.primary" }}
                >
                  {t("auth.login.password")}
                </Typography>
                <TextField
                  fullWidth
                  placeholder="••••••••"
                  type="password"
                  margin="none"
                  variant="outlined"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && !password}
                  helperText={
                    touched.password && !password ? t("auth.login.passwordError") : ""
                  }
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Link
                  href="/forgot-password"
                  variant="body2"
                  sx={{
                    textDecoration: "none",
                    fontWeight: 500,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {t("auth.login.forgotPassword")}
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{
                  mb: 3,
                  py: 1.5,
                  borderRadius: 1,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  boxShadow: 2,
                  "&:hover": {
                    boxShadow: 4,
                  },
                }}
              >
                {t("auth.login.signIn")}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  {t("auth.login.noAccount")}{" "}
                  <Link
                    href="/signup"
                    sx={{
                      fontWeight: 600,
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {t("auth.login.createOne")}
                  </Link>
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center", mt: 1.5 }}>
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate("/")}
                  variant="body2"
                  sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                >
                  ← Back to Home
                </Link>
              </Box>
            </form>

            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ mt: 4, textAlign: "center", display: "block" }}
            >
              {import.meta.env.PROD ? "" : `${import.meta.env.MODE} `}v{version}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </AppProvider>
  );
};

export default Login;
