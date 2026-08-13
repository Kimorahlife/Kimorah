import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ContentField from "./ContentField";
import ItemList from "./ItemList";
import {
  CurriculumSection,
  ItemGroup,
  SECTION_LABELS,
  SectionKey,
  emptyGroup,
  emptyItem,
} from "../curriculum-types";

/**
 * One section of a session: an optional lead-in, then one or more groups of
 * items.
 *
 * Most sections are a single unnamed group — the editor creates it silently on
 * the first "Add", so an author writing plain bullets never sees the grouping
 * machinery. Psicoeducación is the section that needs it: its content is
 * several headed runs ("Explicar:", "Teoría Polivagal", "Estrategias
 * adaptativas"), each with its own bullets.
 *
 * A group's heading is edited in its header row rather than repeated in a field
 * below it — the row title and the field were the same string, and showing both
 * made it look like there were two headings to fill in.
 */
const GroupList: React.FC<{
  section: SectionKey;
  value: CurriculumSection;
  onChange: (next: CurriculumSection) => void;
  disabled?: boolean;
}> = ({ section, value, onChange, disabled = false }) => {
  const label = SECTION_LABELS[section];
  const groups = value.groups ?? [];
  const singleUnnamed = groups.length === 1 && !groups[0].heading?.en && !groups[0].heading?.es;

  /** Groups folded away. Empty by default — a new group opens ready to write in. */
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());

  /**
   * Reveals the heading on a lone unnamed group. Without it there is no way to
   * name a single group: it renders bare precisely *because* it has no heading,
   * so the field it needs is the one thing hidden from it.
   */
  const [naming, setNaming] = useState(false);
  const bare = singleUnnamed && !naming;

  const toggle = (index: number) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  const reindex = (list: ItemGroup[]): ItemGroup[] => list.map((g, i) => ({ ...g, order: i }));
  const patch = (index: number, changes: Partial<ItemGroup>) =>
    onChange({ ...value, groups: groups.map((g, i) => (i === index ? { ...g, ...changes } : g)) });

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= groups.length) return;
    const next = [...groups];
    [next[index], next[target]] = [next[target], next[index]];
    setCollapsed(new Set());
    onChange({ ...value, groups: reindex(next) });
  };

  const remove = (index: number) => {
    setCollapsed(new Set());
    onChange({ ...value, groups: reindex(groups.filter((_, i) => i !== index)) });
  };

  /**
   * Every group is born holding one empty bullet, so "add" always lands the
   * author somewhere to type — never on an empty container to fill first.
   */
  const addGroup = () => {
    const next = emptyGroup(groups.length);
    next.items = [emptyItem(0)];
    onChange({ ...value, groups: reindex([...groups, next]) });
  };

  return (
    <Box>
      <ContentField
        label="Section lead-in (optional)"
        value={value.intro ?? { en: "", es: "" }}
        onChange={(intro) => onChange({ ...value, intro })}
        multiline
        rows={2}
        disabled={disabled}
      />
      {label.hint && (
        <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mb: 1.5 }}>
          {label.hint}
        </Typography>
      )}

      {groups.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Nothing here yet.
        </Typography>
      )}

      {/* A lone unnamed group is rendered bare — no card, no heading field — so
          the common case looks like a simple bullet list. */}
      {bare ? (
        <ItemList
          section={section}
          items={groups[0].items}
          onChange={(items) => patch(0, { items })}
          addLabel={`Add ${label.one}`}
          disabled={disabled}
        />
      ) : (
        groups.map((group, index) => {
          const open = !collapsed.has(index);
          return (
            <Paper
              key={group._id ?? index}
              variant="outlined"
              sx={{ mb: 1.5, borderRadius: 2, px: 1.5, py: 1.25 }}
            >
              <Stack direction="row" spacing={0.5} alignItems="center">
                <TextField
                  size="small"
                  fullWidth
                  placeholder={`Group ${index + 1} heading`}
                  value={group.heading?.en ?? ""}
                  onChange={(e) => patch(index, { heading: { ...(group.heading ?? { en: "", es: "" }), en: e.target.value } })}
                  disabled={disabled}
                  InputProps={{ sx: { fontWeight: 700 } }}
                />
                {group.items.length > 0 && (
                  <Chip size="small" label={group.items.length} sx={{ height: 20, fontSize: 11, flexShrink: 0 }} />
                )}

                <Tooltip title={open ? "Collapse group" : "Expand group"}>
                  <span>
                    <IconButton
                      size="small"
                      aria-label={open ? "Collapse group" : "Expand group"}
                      onClick={() => toggle(index)}
                      disabled={disabled}
                    >
                      {open ? <ExpandLessRoundedIcon fontSize="small" /> : <ExpandMoreRoundedIcon fontSize="small" />}
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Move group up">
                  <span>
                    <IconButton size="small" aria-label="Move group up" disabled={disabled || index === 0} onClick={() => move(index, -1)}>
                      <ArrowUpwardRoundedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Move group down">
                  <span>
                    <IconButton
                      size="small"
                      aria-label="Move group down"
                      disabled={disabled || index === groups.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      <ArrowDownwardRoundedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Remove group and its contents">
                  <span>
                    <IconButton size="small" aria-label="Remove group" color="error" disabled={disabled} onClick={() => remove(index)}>
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>

              <Collapse in={open} unmountOnExit>
                <Box sx={{ pt: 2 }}>
                  <ContentField
                    label="Group lead-in (optional)"
                    value={group.intro ?? { en: "", es: "" }}
                    onChange={(intro) => patch(index, { intro })}
                    multiline
                    rows={2}
                    disabled={disabled}
                  />
                  <ItemList
                    section={section}
                    items={group.items}
                    onChange={(items) => patch(index, { items })}
                    addLabel={`Add ${label.one}`}
                    disabled={disabled}
                  />
                </Box>
              </Collapse>
            </Paper>
          );
        })
      )}

      {/* One button, one outcome. On a plain list the first step is naming what
          is already there — spawning a second, empty group instead is what made
          this confusing. */}
      <Tooltip
        // The button has visible text, so the tooltip must describe it, not
        // rename it — without this MUI moves the whole sentence into
        // aria-label and the button stops announcing as "Add a heading".
        describeChild
        title={
          groups.length === 0
            ? ""
            : bare
              ? `Puts a heading above these ${label.one}s, so the section can hold more than one headed run.`
              : `Adds another headed run — its own heading, with its own ${label.one}s under it.`
        }
      >
        <Button
          variant="outlined"
          startIcon={<AddRoundedIcon />}
          onClick={bare ? () => setNaming(true) : addGroup}
          disabled={disabled}
          sx={{ textTransform: "none", borderRadius: 2, mt: 1.5 }}
        >
          {groups.length === 0 ? `Add ${label.one}s` : bare ? "Add a heading" : "Add a named group"}
        </Button>
      </Tooltip>
    </Box>
  );
};

export default GroupList;
