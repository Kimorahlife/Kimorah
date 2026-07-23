import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { updateUser } from "../../../store/slices/users";
import { useToken } from "../../authentication/components/useToken";
import { User } from "../../../types/users";
import { Role } from "../../../types/roles";

type Props = {
  open: boolean;
  onClose: () => void;
  user?: User;
  roles: Role[];
};

/**
 * Edit a user's name, role, and phone. Email is read-only (it's the login
 * identity). Saves via PUT /api/users/:id (users:write). Plain MUI form — no
 * external form/validation libraries, matching Kimorah's minimal dep set.
 */
const UserFormDialog = ({ open, onClose, user, roles }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [token] = useToken("");

  const [name, setName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(user?.name ?? "");
    setRoleName(user?.roles ?? "");
    setPhone(user?.phoneNumber ?? "");
    setError(null);
  }, [open, user]);

  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  const handleSave = async () => {
    if (!user || !name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await dispatch(updateUser(token, { ...user, name: name.trim(), roles: roleName, phoneNumber: phone }));
      onClose();
    } catch (e: any) {
      setError(e?.message ?? t("users.saveError", "Failed to save user"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ backgroundColor: "primary.main", color: "primary.contrastText", py: 2.5, px: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ bgcolor: "rgba(255,255,255,0.2)", borderRadius: "50%", p: 0.75, display: "flex" }}>
            <EditIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold" lineHeight={1.2}>
              {t("users.editTitle", "Edit User")}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
              {user?.name}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            position: "absolute",
            right: 12,
            top: 14,
            color: "primary.contrastText",
            bgcolor: "rgba(255,255,255,0.1)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3, py: 3 }}>
        <Stack spacing={2.5}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField fullWidth label={t("users.columnEmail", "Email")} variant="outlined" value={user?.email ?? ""} disabled />

          <TextField
            fullWidth
            required
            label={t("users.columnName", "Name")}
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <FormControl fullWidth>
            <InputLabel id="user-role-label">{t("users.columnRoles", "Role")}</InputLabel>
            <Select
              labelId="user-role-label"
              label={t("users.columnRoles", "Role")}
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            >
              {roles
                .filter((r) => r.assignable !== false)
                .map((r) => (
                  <MenuItem key={r._id} value={r.name}>
                    {r.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label={t("users.columnPhone", "Phone")}
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit" disabled={saving} startIcon={<CloseIcon />}>
          {t("common.cancel", "Cancel")}
        </Button>
        <Button type="button" onClick={handleSave} variant="contained" disabled={saving || !name.trim()} startIcon={<SaveIcon />}>
          {saving ? t("common.saving", "Saving…") : t("common.save", "Save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormDialog;
