import React, { useState } from "react";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import ContentField from "./ContentField";
import {
  CurriculumItem,
  ICON_OPTIONS,
  Localized,
  SECTIONS_WITH_LEAD,
  SECTIONS_WITH_LAYOUT,
  SECTIONS_WITH_PROMPTS,
  SECTION_LABELS,
  SectionKey,
  emptyItem,
  iconNode,
} from "../curriculum-types";

/** True when an item carries anything beyond its one line of text. */
const hasExtras = (item: CurriculumItem): boolean =>
  item.layout === "prose" ||
  Boolean(item.icon) ||
  Boolean(item.lead?.en.trim()) ||
  Boolean(item.body?.en.trim()) ||
  item.prompts.length > 0;

/**
 * The repeatable list behind every section — Objectives, Concepts, and the rest
 * all use this one component, because every section stores the same `Item`.
 *
 * In the source document an item is a single line, so that line *is* the row:
 * an author adds a concept and types straight into it, with nothing to expand
 * first. Everything the website layers on top — an icon, a lead line, a body,
 * reflection prompts — is optional and lives behind the tune button, which
 * highlights itself on any row actually using one.
 *
 * `section` decides which of those extras are worth offering: a Concept has a
 * lead line and reflection prompts, an Objective does not.
 */
const ItemList: React.FC<{
  section: SectionKey;
  items: CurriculumItem[];
  onChange: (next: CurriculumItem[]) => void;
  addLabel: string;
  disabled?: boolean;
}> = ({ section, items, onChange, addLabel, disabled = false }) => {
  const showLead = SECTIONS_WITH_LEAD.includes(section);
  const showPrompts = SECTIONS_WITH_PROMPTS.includes(section);
  // A paragraph only reads as one where the reader page honours it.
  const showLayout = SECTIONS_WITH_LAYOUT.includes(section);
  const one = SECTION_LABELS[section].one;
  const placeholder = one.charAt(0).toUpperCase() + one.slice(1);

  /** Rows showing their extras. Cleared on reorder/removal, where indices shift. */
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggle = (index: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  /** Rewrite `order` from array position so it always matches what's on screen. */
  const reindex = (list: CurriculumItem[]): CurriculumItem[] =>
    list.map((it, i) => ({ ...it, order: i }));

  const patch = (index: number, changes: Partial<CurriculumItem>) =>
    onChange(items.map((it, i) => (i === index ? { ...it, ...changes } : it)));

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setExpanded(new Set());
    onChange(reindex(next));
  };

  const remove = (index: number) => {
    setExpanded(new Set());
    onChange(reindex(items.filter((_, i) => i !== index)));
  };

  const add = () => onChange(reindex([...items, emptyItem(items.length)]));

  /** A paragraph is a point that says outright that it is prose. */
  const addParagraph = () =>
    onChange(
      reindex([
        ...items,
        { ...emptyItem(items.length), layout: "prose" as const },
      ]),
    );

  const setLayout = (index: number, layout: "prose" | "point") =>
    patch(index, { layout });

  const setPrompt = (index: number, pIndex: number, next: Localized) =>
    patch(index, {
      prompts: items[index].prompts.map((p, i) => (i === pIndex ? next : p)),
    });

  return (
    <Box>
      {items.map((item, index) => {
        const open = expanded.has(index);
        return (
          <Paper
            key={item._id ?? index}
            variant="outlined"
            sx={{ mb: 1, borderRadius: 2, px: 1.5, py: 1.25 }}
          >
            <Stack direction="row" spacing={0.5} alignItems="center">
              {iconNode(item.icon) && (
                <Box
                  sx={{
                    color: "primary.main",
                    display: "flex",
                    flexShrink: 0,
                    mr: 0.5,
                  }}
                >
                  {iconNode(item.icon)}
                </Box>
              )}

              <TextField
                size="small"
                fullWidth
                placeholder={`${placeholder} ${index + 1}`}
                value={item.title.en}
                onChange={(e) =>
                  patch(index, { title: { ...item.title, en: e.target.value } })
                }
                disabled={disabled}
                multiline
                maxRows={4}
              />

              <Tooltip
                title={
                  open
                    ? "Hide options"
                    : hasExtras(item)
                      ? "Options in use"
                      : "More options"
                }
              >
                <span>
                  <IconButton
                    size="small"
                    aria-label={open ? "Hide options" : "More options"}
                    onClick={() => toggle(index)}
                    disabled={disabled}
                    color={hasExtras(item) ? "primary" : "default"}
                  >
                    {open ? (
                      <ExpandLessRoundedIcon fontSize="small" />
                    ) : (
                      <TuneRoundedIcon fontSize="small" />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Move up">
                <span>
                  <IconButton
                    size="small"
                    aria-label="Move up"
                    disabled={disabled || index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <ArrowUpwardRoundedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Move down">
                <span>
                  <IconButton
                    size="small"
                    aria-label="Move down"
                    disabled={disabled || index === items.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ArrowDownwardRoundedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Remove">
                <span>
                  <IconButton
                    size="small"
                    aria-label="Remove"
                    color="error"
                    disabled={disabled}
                    onClick={() => remove(index)}
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>

            <Collapse in={open} unmountOnExit>
              <Box sx={{ pt: 2 }}>
                {showLayout && (
                  <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={item.layout ?? "point"}
                    onChange={(_, next) => next && setLayout(index, next)}
                    disabled={disabled}
                    sx={{ mb: 2, display: "block" }}
                  >
                    <ToggleButton
                      value="point"
                      sx={{ textTransform: "none", px: 1.5, gap: 0.75 }}
                    >
                      <FormatListBulletedRoundedIcon fontSize="small" />
                      Point
                    </ToggleButton>
                    <ToggleButton
                      value="prose"
                      sx={{ textTransform: "none", px: 1.5, gap: 0.75 }}
                    >
                      <NotesRoundedIcon fontSize="small" />
                      Paragraph
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}

                <TextField
                  select
                  size="small"
                  label="Icon"
                  value={item.icon ?? ""}
                  onChange={(e) => patch(index, { icon: e.target.value })}
                  disabled={disabled}
                  sx={{ mb: 2, minWidth: 220 }}
                >
                  <MenuItem value="">None</MenuItem>
                  {ICON_OPTIONS.map((o) => (
                    <MenuItem key={o.key} value={o.key}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {o.node}
                        <span>{o.label}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>

                {showLead && (
                  <ContentField
                    label="Lead line"
                    value={item.lead ?? { en: "", es: "" }}
                    onChange={(v) => patch(index, { lead: v })}
                    disabled={disabled}
                  />
                )}
                <ContentField
                  label="Body"
                  value={item.body ?? { en: "", es: "" }}
                  onChange={(v) => patch(index, { body: v })}
                  multiline
                  disabled={disabled}
                />

                {showPrompts && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 700, color: "text.secondary" }}
                    >
                      Reflection prompts
                    </Typography>
                    {item.prompts.map((p, pIndex) => (
                      <Stack
                        key={pIndex}
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                        sx={{ mt: 1 }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <ContentField
                            label={`Prompt ${pIndex + 1}`}
                            value={p}
                            onChange={(v) => setPrompt(index, pIndex, v)}
                            disabled={disabled}
                          />
                        </Box>
                        <IconButton
                          size="small"
                          color="error"
                          disabled={disabled}
                          onClick={() =>
                            patch(index, {
                              prompts: item.prompts.filter(
                                (_, i) => i !== pIndex,
                              ),
                            })
                          }
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
                      onClick={() =>
                        patch(index, {
                          prompts: [...item.prompts, { en: "", es: "" }],
                        })
                      }
                      sx={{ textTransform: "none", mt: 1 }}
                    >
                      Add prompt
                    </Button>
                  </Box>
                )}
              </Box>
            </Collapse>
          </Paper>
        );
      })}

      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<AddRoundedIcon />}
          onClick={add}
          disabled={disabled}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          {addLabel}
        </Button>
        {showLayout && (
          <Button
            variant="outlined"
            startIcon={<NotesRoundedIcon />}
            onClick={addParagraph}
            disabled={disabled}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Add paragraph
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default ItemList;
