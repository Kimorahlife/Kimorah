import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, getPermission, getRole } from "../../../store/store";
import { useToken } from "../../authentication/components/useToken";
import { closeRoleError, updateRole } from "../../../store/slices/roles";
import { Role } from "../../../types/roles";
import PermissionMatrix from "./PermissionMatrix";

type Props = {
  role: Role | null;
  onClose: () => void;
};

const EditRolePermissions = ({ role: currentRole, onClose }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [token] = useToken("");
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [isGlobal, setIsGlobal] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const prevProcessing = useRef(false);

  const roleState = useSelector(getRole);
  const { list: permissions } = useSelector(getPermission);

  const handleIsGlobalChange = (checked: boolean) => {
    setIsGlobal(checked);
    if (checked) setSelected(permissions.map((p) => p.key));
  };

  useEffect(() => {
    if (currentRole) {
      setName(currentRole.name ?? "");
      setSelected(currentRole.permissions ?? []);
      setIsGlobal(currentRole.isGlobal ?? false);
    }
  }, [currentRole]);

  useEffect(() => {
    if (currentRole) prevProcessing.current = false;
  }, [currentRole]);

  useEffect(() => {
    if (prevProcessing.current && !roleState?.processing) {
      if (roleState?.processError) {
        setSaveError(roleState.processError);
      } else {
        setSaveError(null);
        onClose();
      }
    }
    prevProcessing.current = roleState?.processing ?? false;
  }, [roleState?.processing, roleState?.processError, onClose]);

  const handleSave = async () => {
    if (!currentRole) return;
    setSaveError(null);
    dispatch(closeRoleError());
    await dispatch(
      updateRole(token, {
        ...currentRole,
        name: name.trim() || currentRole.name,
        permissions: selected,
        isGlobal,
      })
    );
  };

  return (
    <Dialog open={Boolean(currentRole)} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight={700}>Edit Role</Typography>
        <Typography variant="caption" color="text.secondary">
          Update name, scope, and permissions
        </Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          {saveError && <Alert severity="error">{saveError}</Alert>}
          <TextField
            fullWidth
            required
            label="Role Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
          />
          <Tooltip title="Global roles apply everywhere and are not scoped.">
            <FormControlLabel
              control={
                <Switch
                  checked={isGlobal}
                  onChange={(e) => handleIsGlobalChange(e.target.checked)}
                />
              }
              label="Global role"
            />
          </Tooltip>
          <Divider />
          <Typography variant="subtitle2" color="text.secondary">
            Permissions
          </Typography>
          {/* Permissions stay editable even when Global is on: "global" controls
              scope (everywhere), not which actions. */}
          <PermissionMatrix selected={selected} onChange={setSelected} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={!name.trim()}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRolePermissions;
