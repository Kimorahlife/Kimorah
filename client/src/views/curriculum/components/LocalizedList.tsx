import React from "react";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ContentField from "./ContentField";
import { Localized, emptyLocalized } from "../curriculum-types";

/**
 * A repeatable list of plain bilingual lines.
 *
 * Used wherever the source document is just bullets with no structure —
 * "Tema principal" keywords, an item's reflection prompts, and the closing
 * "Feedback y cierre" round. Anything that needs a title plus a body belongs
 * in <ItemList> instead.
 */
const LocalizedList: React.FC<{
  label: string;
  values: Localized[];
  onChange: (next: Localized[]) => void;
  addLabel: string;
  itemLabel?: string;
  multiline?: boolean;
  disabled?: boolean;
  helper?: string;
}> = ({ label, values, onChange, addLabel, itemLabel = "Item", multiline = false, disabled = false, helper }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
      {label}
    </Typography>
    {helper && (
      <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mb: 0.5 }}>
        {helper}
      </Typography>
    )}

    {values.length === 0 && (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1 }}>
        None yet.
      </Typography>
    )}

    {values.map((value, index) => (
      <Stack key={index} direction="row" spacing={1} alignItems="flex-start" sx={{ mt: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <ContentField
            label={`${itemLabel} ${index + 1}`}
            value={value}
            onChange={(next) => onChange(values.map((v, i) => (i === index ? next : v)))}
            multiline={multiline}
            disabled={disabled}
          />
        </Box>
        <IconButton
          size="small"
          color="error"
          disabled={disabled}
          onClick={() => onChange(values.filter((_, i) => i !== index))}
          sx={{ mt: 2.5 }}
        >
          <DeleteOutlineRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>
    ))}

    <Button
      size="small"
      startIcon={<AddRoundedIcon />}
      disabled={disabled}
      onClick={() => onChange([...values, emptyLocalized()])}
      sx={{ textTransform: "none", mt: 1 }}
    >
      {addLabel}
    </Button>
  </Box>
);

export default LocalizedList;
