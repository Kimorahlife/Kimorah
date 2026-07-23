import {
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
        onClose();
      }
    }
    prevProcessing.current = roleState.processing ?? false;
  }, [roleState.processing, roleState.processError, onClose]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    dispatch(addRole(token, { name: name.trim(), permissions: selected, isGlobal }));
  };

  const handleClose = () => {
    setName("");
    setSelected([]);
    setIsGlobal(false);
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
          <Typography variant="subtitle2">Permissions</Typography>
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
