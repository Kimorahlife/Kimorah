import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  onClose: () => void;
  /** True when the viewer is signed in but lacks the required permission. */
  signedIn: boolean;
};

/**
 * Interstitial shown when someone opens gated content they cannot reach yet.
 *
 * The two denied states need opposite messages, so this branches on `signedIn`:
 * a visitor is a conversion moment and gets a sign-up call to action, while a
 * signed-in member without the permission is a support moment — telling them to
 * "create an account" would be nonsense when they already have one.
 *
 * Copy is switched inline rather than through kimorah-es: the DOM translator
 * walks the document when the language changes, and a dialog mounted later
 * would be missed.
 */
const AccessGateDialog = ({ open, onClose, signedIn }: Props) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const spanish = (i18n.resolvedLanguage || i18n.language || "en").startsWith("es");
  const copy = (en: string, es: string) => (spanish ? es : en);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              bgcolor: "rgba(101,64,178,.12)",
              color: "primary.main",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <LockOutlinedIcon />
          </Box>
          <Typography variant="h6" fontWeight={700} lineHeight={1.25}>
            {signedIn
              ? copy("Curriculum access needed", "Necesitas acceso al currículo")
              : copy("Create an account to continue", "Crea una cuenta para continuar")}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {signedIn
            ? copy(
                "Your account doesn't have curriculum access yet. Ask your administrator to grant it, and this will open right away.",
                "Tu cuenta aún no tiene acceso al currículo. Pide a tu administrador que te lo otorgue y podrás abrirlo enseguida.",
              )
            : copy(
                "Sign up free to open the full psychoeducational curriculum — sessions, materials and resources for mental health professionals.",
                "Regístrate gratis para acceder al currículo psicoeducativo completo: sesiones, materiales y recursos para profesionales de la salud mental.",
              )}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 0, gap: 1 }}>
        {signedIn ? (
          <Button onClick={onClose} variant="contained">
            {copy("Got it", "Entendido")}
          </Button>
        ) : (
          <>
            <Button onClick={onClose} color="inherit">
              {copy("Not now", "Ahora no")}
            </Button>
            <Button onClick={() => navigate("/login")} color="inherit">
              {copy("Log in", "Iniciar sesión")}
            </Button>
            <Button onClick={() => navigate("/signup")} variant="contained">
              {copy("Create account", "Crear cuenta")}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AccessGateDialog;
