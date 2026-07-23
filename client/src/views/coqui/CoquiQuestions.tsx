import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { api } from "../../api";
import Spinner from "../shared/buttons/Spinner";
import MainCard from "../../Berry/ui-component/cards/MainCard";
import type { SurveyQuestion, Lang } from "../pillars/kindness/survey-data";

const TYPE_COLORS: Record<string, "default" | "primary" | "success" | "warning" | "info"> = {
  consent: "warning",
  single: "primary",
  multi: "info",
  scale: "success",
  number: "default",
  text: "default",
  textarea: "default",
};

/**
 * Read-only list of the Coquí survey ("Echoes of Belonging") question bank,
 * fetched from GET /api/research/coqui/survey (the DB `coqui_questions`
 * collection is the source of truth). Shows each question's prompt, type, and
 * options in the current UI language.
 */
const CoquiQuestions: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang: Lang = (i18n.resolvedLanguage || i18n.language || "en").startsWith("es") ? "es" : "en";

  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/api/research/coqui/survey")
      .then((r) => setQuestions(r.data?.questions ?? []))
      .catch((e) => setError(e?.message ?? "Failed to load questions"))
      .finally(() => setLoading(false));
  }, []);

  const text = (l?: { en: string; es: string }) => (l ? l[lang] : "");

  if (loading) return <Spinner />;

  return (
    <Box p={3}>
      <Box mb={2}>
        <Typography variant="h4" fontWeight="bold">
          {t("coquiQuestions.title", "Coquí Survey Questions")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t(
            "coquiQuestions.subtitle",
            "The “Echoes of Belonging” question bank, in reading order."
          )}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <MainCard
        border
        boxShadow
        title={`${t("coquiQuestions.title", "Coquí Survey Questions")} (${questions.length})`}
      >
        <Stack spacing={2}>
          {questions.length === 0 && !error && (
            <Typography variant="body2" color="text.secondary">
              {t("coquiQuestions.empty", "No questions found.")}
            </Typography>
          )}
          {questions.map((q, i) => (
            <Paper
              key={q.id}
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                p: 2.5,
                "&:hover": { boxShadow: 3 },
                transition: "box-shadow 0.2s",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Chip label={i + 1} size="small" color="primary" variant="outlined" sx={{ mt: 0.25 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 0.5 }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {text(q.prompt)}
                    </Typography>
                    <Chip
                      label={q.type}
                      size="small"
                      color={TYPE_COLORS[q.type] ?? "default"}
                      sx={{ height: 20, fontSize: "0.68rem" }}
                    />
                    {q.optional && (
                      <Chip label={t("coquiQuestions.optional", "optional")} size="small" variant="outlined" sx={{ height: 20, fontSize: "0.68rem" }} />
                    )}
                  </Box>

                  {q.helper && (
                    <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                      {text(q.helper)}
                    </Typography>
                  )}

                  {/* Options (single / multi / consent) */}
                  {q.options && q.options.length > 0 && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                      {q.options.map((o) => (
                        <Chip key={o.id} label={text(o.label)} size="small" variant="outlined" sx={{ fontSize: "0.72rem" }} />
                      ))}
                    </Box>
                  )}

                  {/* Scale range */}
                  {q.type === "scale" && (
                    <Typography variant="caption" color="text.secondary">
                      {q.scaleMin ?? 0}
                      {q.scaleMinLabel ? ` (${text(q.scaleMinLabel)})` : ""} – {q.scaleMax ?? 10}
                      {q.scaleMaxLabel ? ` (${text(q.scaleMaxLabel)})` : ""}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      </MainCard>
    </Box>
  );
};

export default CoquiQuestions;
