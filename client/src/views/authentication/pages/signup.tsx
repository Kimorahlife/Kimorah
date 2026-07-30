import React, { useReducer, ChangeEvent, FocusEvent, FormEvent } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Paper,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useToken } from "../components/useToken";
import { AppProvider } from "@toolpad/core/AppProvider";
import { api } from "../../../api";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import LogoBadge from "../../landing/LogoBadge";
import LandingBackground from "../../landing/LandingBackground";
import { Intention } from "../../../types/users";

interface State {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  intention: Intention | "";
  error: string;
  loading: boolean;
  touched: { [key: string]: boolean };
}

interface Action {
  type: string;
  field?: string;
  value?: string;
  error?: string;
}

const initialState: State = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  intention: "",
  error: "",
  loading: false,
  touched: {},
};

const sanitizeInput = (input: string) => input.replace(/[$]/g, "");

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password: string) =>
  /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{6,}$/.test(password);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field!]: action.value!, error: "" };
    case "SET_TOUCHED":
      return { ...state, touched: { ...state.touched, [action.field!]: true } };
    case "SET_ERROR":
      return { ...state, error: action.error!, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.value === "true" };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const Signup: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { name, email, password, confirmPassword, intention, error, loading, touched } =
    state;
  const [, setToken] = useToken();
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();

  // Union type so the same handlers serve the text fields and the Intention select.
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const sanitizedValue =
      name === "name" || name.includes("password")
        ? sanitizeInput(value)
        : value;
    dispatch({ type: "SET_FIELD", field: name, value: sanitizedValue });
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch({ type: "SET_TOUCHED", field: e.target.name });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name || !email || !password || !confirmPassword || !intention) {
      dispatch({ type: "SET_ERROR", error: t("auth.signup.errorAllRequired") });
      return;
    }
    if (!validateEmail(email)) {
      dispatch({ type: "SET_ERROR", error: t("auth.signup.errorInvalidEmail") });
      return;
    }
    if (!validatePassword(password)) {
      dispatch({ type: "SET_ERROR", error: t("auth.signup.errorWeakPassword") });
      return;
    }
    if (password !== confirmPassword) {
      dispatch({ type: "SET_ERROR", error: t("auth.signup.errorPasswordMismatch") });
      return;
    }

    dispatch({ type: "SET_LOADING", value: "true" });
    try {
      const response = await api.post("/api/users/signup", {
        name,
        email,
        password,
        intention,
      });
      setToken(response.data.token);
      navigate("/dashboard");
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR",
        error: error.response?.data?.message || t("auth.signup.errorGeneric"),
      });
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

          {/* Right side - Signup Form */}
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
              {t("auth.signup.title")}
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, textAlign: "center" }}
            >
              {t("auth.signup.subtitle")}
            </Typography>

            {error && (
              <Typography align="center" color="error">
                {error}
              </Typography>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Full Name and Email Address side by side */}
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 600, color: "text.primary" }}
                  >
                    {t("auth.signup.fullName")}
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder={t("auth.signup.fullNamePlaceholder")}
                    margin="none"
                    variant="outlined"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && !name}
                    helperText={
                      touched.name && !name ? t("auth.signup.fullNameError") : ""
                    }
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 600, color: "text.primary" }}
                  >
                    {t("auth.signup.email")}
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="bruce@mail.com"
                    margin="none"
                    variant="outlined"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && !validateEmail(email)}
                    helperText={
                      touched.email && !validateEmail(email)
                        ? t("auth.signup.emailError")
                        : ""
                    }
                  />
                </Box>
              </Box>

              {/* Password and Confirm Password side by side */}
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 600, color: "text.primary" }}
                  >
                    {t("auth.signup.password")}
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
                    error={touched.password && !validatePassword(password)}
                    helperText={
                      touched.password && !validatePassword(password)
                        ? t("auth.signup.passwordError")
                        : ""
                    }
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 600, color: "text.primary" }}
                  >
                    {t("auth.signup.confirmPassword")}
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="••••••••"
                    type="password"
                    margin="none"
                    variant="outlined"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.confirmPassword && password !== confirmPassword
                    }
                    helperText={
                      touched.confirmPassword && password !== confirmPassword
                        ? t("auth.signup.confirmPasswordError")
                        : ""
                    }
                  />
                </Box>
              </Box>

              {/* Intention — why the user is here; drives onboarding downstream */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: 600, color: "text.primary" }}
                >
                  {t("auth.signup.intention")}
                </Typography>
                <TextField
                  select
                  fullWidth
                  margin="none"
                  variant="outlined"
                  name="intention"
                  value={intention}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.intention && !intention}
                  helperText={
                    touched.intention && !intention
                      ? t("auth.signup.intentionError")
                      : ""
                  }
                  SelectProps={{
                    displayEmpty: true,
                    renderValue: (value) =>
                      value ? (
                        t(`auth.signup.intentionOptions.${String(value)}`)
                      ) : (
                        <Typography component="span" color="text.disabled">
                          {t("auth.signup.intentionPlaceholder")}
                        </Typography>
                      ),
                  }}
                >
                  {Object.values(Intention).map((option) => (
                    <MenuItem key={option} value={option}>
                      {t(`auth.signup.intentionOptions.${option}`)}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
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
                {loading ? t("common.saving") : t("auth.signup.signUp")}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  {t("auth.signup.alreadyHaveAccount")}{" "}
                  <Link
                    href="/login"
                    sx={{
                      fontWeight: 600,
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {t("auth.signup.login")}
                  </Link>
                </Typography>
              </Box>
            </form>
          </Box>
        </Paper>
      </Box>
    </AppProvider>
  );
};

export default Signup;
