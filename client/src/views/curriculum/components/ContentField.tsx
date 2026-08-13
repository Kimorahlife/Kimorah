import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { Localized } from "../curriculum-types";

/**
 * One authored string.
 *
 * Curricula are written in English and the Spanish is produced by the
 * translator, reviewed, and applied — so the editor shows one field, not two.
 * The value stays a full `{ en, es }` pair: this component edits `en` and
 * carries `es` through untouched, which is what lets the review dialog own the
 * Spanish without either side clobbering the other.
 */
const ContentField: React.FC<{
  label: string;
  value: Localized;
  onChange: (next: Localized) => void;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}> = ({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  required = false,
  disabled = false,
  placeholder,
}) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
      {label}
      {required && " *"}
    </Typography>
    <TextField
      size="small"
      value={value.en}
      onChange={(e) => onChange({ ...value, en: e.target.value })}
      multiline={multiline}
      minRows={multiline ? rows : undefined}
      error={required && !value.en.trim()}
      disabled={disabled}
      placeholder={placeholder}
      fullWidth
      sx={{ mt: 0.5 }}
    />
  </Box>
);

export default ContentField;
