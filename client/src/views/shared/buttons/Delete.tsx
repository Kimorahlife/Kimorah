import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

type Props = {
  onConfirm: () => void;
  title: string;
};

function Delete({ onConfirm, title }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Delete">
        <IconButton size="small" onClick={() => setOpen(true)} color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Delete;
