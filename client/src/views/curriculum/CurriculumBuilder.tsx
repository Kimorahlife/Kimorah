import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Alert, Box, Button, Chip, Divider, IconButton, Paper, Snackbar, Stack, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import { AppDispatch, getCurriculum } from "../../store/store";
import { closeCurriculumError, deleteCurriculum, loadCurriculums } from "../../store/slices/curriculums";
import { useToken } from "../authentication/components/useToken";
import Spinner from "../shared/buttons/Spinner";
import Delete from "../shared/buttons/Delete";
import { CanAdd, CanDelete, CanEdit, ReadOnlyBanner } from "../shared/permissions";
import MainCard from "../../Berry/ui-component/cards/MainCard";
import CurriculumDialog from "./components/CurriculumDialog";
import { Curriculum, sessionItemCount } from "./curriculum-types";

/** Total authored items across every group of every section of every session. */
const itemCount = (c: Curriculum): number =>
  (c.sessions ?? []).reduce((total, s) => total + sessionItemCount(s), 0);

/**
 * Curriculum Builder — authoring for the Mission psychoeducational curricula.
 *
 * Gated on the existing `curriculums` feature, so no new permission group was
 * needed: the Permission Matrix manages Add / Edit / Delete for Curriculums
 * already, and holding any of them is what grants this page.
 */
const CurriculumBuilder: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [token] = useToken("");
  const state = useSelector(getCurriculum);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Curriculum | null>(null);

  const fetch = useCallback(async () => {
    await dispatch(loadCurriculums(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (token) fetch();
  }, [token, fetch]);

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (c: Curriculum) => {
    setEditing(c);
    setDialogOpen(true);
  };

  const list = state.list ?? [];

  return (
    <MainCard
      title={
        <Box>
          <Typography variant="h3" fontWeight={700}>
            {t("curriculum.title", "Curriculum Builder")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("curriculum.subtitle", "Author curricula, their sessions, and every section of each session")}
          </Typography>
        </Box>
      }
      secondary={
        <CanAdd feature="curriculums">
          <Button variant="contained" startIcon={<AddIcon />} onClick={openNew} sx={{ textTransform: "none", borderRadius: 2 }}>
            {t("curriculum.add", "New Curriculum")}
          </Button>
        </CanAdd>
      }
    >
      <ReadOnlyBanner feature="curriculums" />

      {state.loading && list.length === 0 ? (
        <Spinner />
      ) : (
        <Stack spacing={1.5}>
          {list.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              {t("curriculum.empty", "No curricula yet. Create one to get started.")}
            </Typography>
          )}

          {list.map((c: Curriculum) => (
            <Paper
              key={c._id}
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderLeft: `4px solid ${c.accent || "#7950c3"}`,
                borderRadius: 3,
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: 3 },
              }}
            >
              <MenuBookRoundedIcon sx={{ color: "primary.main" }} />

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={700} noWrap>
                  {`${c.number}. ${c.title?.en || c.title?.es || "Untitled"}`}
                  {(c.highlightedTitle?.en || c.highlightedTitle?.es) && (
                    <Box component="span" sx={{ color: "primary.main", fontStyle: "italic", ml: 0.5 }}>
                      {c.highlightedTitle.en || c.highlightedTitle.es}
                    </Box>
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                  {c.slug}
                </Typography>
              </Box>

              <Chip
                size="small"
                variant="outlined"
                label={t("curriculum.sessionCount", "{{count}} sessions", { count: c.sessions?.length ?? 0 })}
              />
              <Chip size="small" variant="outlined" label={t("curriculum.itemCount", "{{count}} items", { count: itemCount(c) })} />
              <Chip
                size="small"
                color={c.published ? "success" : "default"}
                variant={c.published ? "filled" : "outlined"}
                label={c.published ? t("curriculum.published", "Published") : t("curriculum.draft", "Draft")}
              />

              <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 28, alignSelf: "center" }} />

              <CanEdit feature="curriculums">
                <Tooltip title={t("common.edit", "Edit")}>
                  <IconButton size="small" onClick={() => openEdit(c)} sx={{ color: "primary.main" }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </CanEdit>

              <CanDelete feature="curriculums">
                <Delete
                  title={t("curriculum.deleteTitle", "Delete curriculum")}
                  onConfirm={() => dispatch(deleteCurriculum(token, c._id as string))}
                />
              </CanDelete>
            </Paper>
          ))}
        </Stack>
      )}

      <CurriculumDialog open={dialogOpen} current={editing} onClose={() => setDialogOpen(false)} />

      <Snackbar
        open={Boolean(state.error)}
        autoHideDuration={6000}
        onClose={() => dispatch(closeCurriculumError())}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => dispatch(closeCurriculumError())}>
          {state.error}
        </Alert>
      </Snackbar>
    </MainCard>
  );
};

export default CurriculumBuilder;
