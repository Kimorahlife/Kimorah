import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { addRole } from "../../../store/slices/roles";
import PermissionMatrix from "./PermissionMatrix";

type Props = {
  open: boolean;
  onClose: () => void;
};

const AddRole = ({ open, onClose }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [token] = useToken("");
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [isGlobal, setIsGlobal] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const { list: permissions } = useSelector(getPermission);
  const roleState = useSelector(getRole);
  const prevProcessing = useRef(false);

  const handleIsGlobalChange = (checked: boolean) => {
    setIsGlobal(checked);
    if (checked) setSelected(permissions.map((p) => p.key));
    else setSelected([]);
  };

  useEffect(() => {
    if (open) prevProcessing.current = false;
  }, [open]);

  useEffect(() => {
    if (prevProcessing.current && !roleState.processing) {
      if (!roleState.processError) {
        setName("");
        setSelected([]);
        setIsGlobal(false);
        setIsDefault(false);
        onClose();
      }
    }
    prevProcessing.current = roleState.processing ?? false;
  }, [roleState.processing, roleState.processError, onClose]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    dispatch(addRole(token, { name: name.trim(), permissions: selected, isGlobal, isDefault }));
  };

  const handleClose = () => {
    setName("");
    setSelected([]);
    setIsGlobal(false);
    setIsDefault(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>New Role</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <TextField
            required
            fullWidth
            label="Role Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Tooltip title="Bypasses all permission checks — the role can reach every feature.">
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
          <Typography variant="caption" sx={{ display: "block", mt: -1, ml: 5.5, color: "text.secondary", lineHeight: 1.45 }}>
            A global role bypasses every permission check — the matrix below is
            ignored and the role can reach everything. To see permissions
            actually take effect, test with a non-global role.
          </Typography>
          <Tooltip title="New signups are given this role. Only one role can be the default — turning it on here turns it off elsewhere.">
            <FormControlLabel
              control={
                <Switch checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
              }
              label="Default role for new signups"
            />
          </Tooltip>
          <Typography variant="subtitle2">Permissions</Typography>
          {isGlobal && (
            <Alert severity="info" sx={{ py: 0.5 }}>
              Global is on, so these checkboxes have no effect for this role.
            </Alert>
          )}
          {/* Toggling global pre-selects all as a convenience; you can then
              disable specific ones — "global" is scope, not which actions. */}
          <PermissionMatrix selected={selected} onChange={setSelected} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!name.trim()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRole;
