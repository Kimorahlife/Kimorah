import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EnergySavingsLeafRoundedIcon from "@mui/icons-material/EnergySavingsLeafRounded";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api";
import CoquiShell from "./CoquiShell";
import { Lang, L, SurveyQuestion, surveyStrings } from "./survey-data";
import { INK, MUTED, SUB } from "./components";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const PURPLE = "#8a7de0";

const Mark: React.FC<{ selected: boolean; multi: boolean }> = ({ selected, multi }) => (
  <Box
    sx={{
      width: 22,
      height: 22,
      borderRadius: multi ? "6px" : "50%",
      border: `2px solid ${selected ? PURPLE : "rgba(255,255,255,0.4)"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {selected && (multi ? <CheckRoundedIcon sx={{ fontSize: 16, color: PURPLE }} /> : <Box sx={{ width: 11, height: 11, borderRadius: "50%", bgcolor: PURPLE }} />)}
  </Box>
);

const OptionRow: React.FC<{ label: string; selected: boolean; multi: boolean; onClick: () => void }> = ({ label, selected, multi, onClick }) => (
  <Box
    onClick={onClick}
    role={multi ? "checkbox" : "radio"}
    aria-checked={selected}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.75,
      px: 2.5,
      py: 1.75,
      borderRadius: 3,
      cursor: "pointer",
      bgcolor: selected ? "rgba(124,107,208,0.45)" : "rgba(255,255,255,0.05)",
      border: `1px solid ${selected ? "rgba(169,158,232,0.8)" : "rgba(255,255,255,0.1)"}`,
      transition: "background-color .15s ease, border-color .15s ease",
      "&:hover": { bgcolor: selected ? "rgba(124,107,208,0.5)" : "rgba(255,255,255,0.09)" },
    }}
  >
    <Mark selected={selected} multi={multi} />
    <Typography sx={{ color: "#efeafb", fontSize: { xs: 14.5, sm: 16 } }}>{label}</Typography>
  </Box>
);

const textFieldSx = {
  mt: 2,
  "& .MuiOutlinedInput-root": {
    color: "#efeafb",
    bgcolor: "rgba(255,255,255,0.06)",
    borderRadius: 2,
    "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
    "&.Mui-focused fieldset": { borderColor: PURPLE },
  },
  "& .MuiInputBase-input::placeholder": { color: "rgba(255,255,255,0.4)", opacity: 1 },
} as const;

const SurveyPage: React.FC = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Lang>("en");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [describes, setDescribes] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    api
      .get("/api/research/coqui/survey")
      .then((r) => setQuestions(r.data?.questions ?? []))
      .catch(() => setLoadError(true));
  }, []);

  const t = (l?: L) => (l ? l[lang] : "");
  const total = questions.length;

  if (!total) {
    return (
      <CoquiShell activeId="survey" heroTitle="COQUÍ RESEARCH SURVEY">
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ maxWidth: 940, mx: "auto", bgcolor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, p: { xs: 2.5, sm: 4 }, textAlign: "center", py: { xs: 6, sm: 8 } }}>
            <Typography sx={{ color: SUB }}>
              {loadError
                ? lang === "es" ? "No se pudo cargar la encuesta." : "Couldn't load the survey."
                : lang === "es" ? "Cargando encuesta…" : "Loading survey…"}
            </Typography>
          </Box>
        </Box>
      </CoquiShell>
    );
  }

  const q = questions[index];
  const val = answers[q.id];
  const progress = Math.round(((index + 1) / total) * 100);
  const isLast = index === total - 1;

  const setAnswer = (id: string, value: any) => setAnswers((a) => ({ ...a, [id]: value }));
  const toggleMulti = (id: string, optId: string) =>
    setAnswers((a) => {
      const cur: string[] = Array.isArray(a[id]) ? a[id] : [];
      return { ...a, [id]: cur.includes(optId) ? cur.filter((x) => x !== optId) : [...cur, optId] };
    });

  const showDescribe =
    q.describe &&
    (q.type === "multi"
      ? Array.isArray(val) && val.includes("other")
      : typeof val === "string" && val !== "" && !["no", "disagree"].includes(val));

  const canProceed = (() => {
    if (q.optional) return true;
    if (q.type === "multi") return Array.isArray(val) && val.length > 0;
    if (q.type === "scale") return typeof val === "number";
    if (q.type === "number" || q.type === "text" || q.type === "textarea") return !!(val && String(val).trim());
    return !!val; // consent / single
  })();

  const goNext = async () => {
    if (!canProceed) return;
    if (isLast) {
      const payload = questions.map((qq) => {
        const entry: { questionId: string; value: any; describe?: string } = {
          questionId: qq.id,
          value: answers[qq.id] ?? (qq.type === "multi" ? [] : ""),
        };
        if (describes[qq.id]) entry.describe = describes[qq.id];
        return entry;
      });
      try {
        await api.post("/api/research/coqui/response", { answers: payload, lang });
      } catch (e) {
        // Don't block the thank-you screen if the API is unreachable.
        console.warn("Survey submit failed:", e);
      }
      setSubmitted(true);
    } else {
      setIndex((i) => i + 1);
    }
  };
  const goBack = () => setIndex((i) => Math.max(0, i - 1));

  const card = {
    maxWidth: 940,
    mx: "auto",
    bgcolor: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 4,
    p: { xs: 2.5, sm: 4 },
  } as const;

  if (submitted) {
    return (
      <CoquiShell activeId="survey" heroTitle="COQUÍ RESEARCH SURVEY">
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ ...card, textAlign: "center", py: { xs: 6, sm: 8 } }}>
            <CheckCircleRoundedIcon sx={{ color: "#7fc98f", fontSize: 56 }} />
            <Typography sx={{ fontFamily: SERIF, fontWeight: 700, color: "#fff", fontSize: { xs: 26, sm: 32 }, mt: 2 }}>
              {t(surveyStrings.thanksTitle)}
            </Typography>
            <Typography sx={{ color: SUB, fontSize: { xs: 14, sm: 16 }, mt: 1, maxWidth: 480, mx: "auto" }}>
              {t(surveyStrings.thanksBody)}
            </Typography>
            <Button
              onClick={() => navigate("/mission/coqui")}
              variant="contained"
              endIcon={<ChevronRightRoundedIcon />}
              sx={{ mt: 3, bgcolor: PURPLE, color: "#fff", textTransform: "none", fontWeight: 600, borderRadius: 999, px: 3, boxShadow: "none", "&:hover": { bgcolor: "#776ac9", boxShadow: "none" } }}
            >
              {t(surveyStrings.viewData)}
            </Button>
          </Box>
        </Box>
      </CoquiShell>
    );
  }

  return (
    <CoquiShell activeId="survey" heroTitle="COQUÍ RESEARCH SURVEY">
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={card}>
          {/* Language toggle */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1.5 }}>
            <Box sx={{ display: "inline-flex", bgcolor: "rgba(255,255,255,0.08)", borderRadius: 999, p: 0.4 }}>
              {(["en", "es"] as Lang[]).map((l) => (
                <Box
                  key={l}
                  onClick={() => setLang(l)}
                  sx={{ px: 1.75, py: 0.4, borderRadius: 999, cursor: "pointer", fontSize: 12.5, fontWeight: 700, bgcolor: lang === l ? PURPLE : "transparent", color: lang === l ? "#fff" : SUB }}
                >
                  {l.toUpperCase()}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Progress */}
          <Typography sx={{ color: SUB, fontWeight: 700, letterSpacing: 0.8, fontSize: 13 }}>{t(surveyStrings.progress)}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1.5 }}>
            <Box sx={{ flexGrow: 1, height: 10, borderRadius: 999, bgcolor: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
              <Box sx={{ height: "100%", width: `${progress}%`, borderRadius: 999, background: "linear-gradient(90deg, #7a6cc8, #a99ee8)", transition: "width .3s ease" }} />
            </Box>
            <Typography sx={{ color: INK, fontWeight: 700, fontSize: 16, fontVariantNumeric: "tabular-nums" }}>{progress}%</Typography>
          </Box>

          <Box sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.1)", my: 3 }} />

          <Typography sx={{ color: MUTED, fontSize: 14 }}>
            {surveyStrings.questionOf[lang].replace("{n}", String(index + 1)).replace("{total}", String(total))}
          </Typography>

          {/* Question */}
          <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
            <Typography sx={{ fontFamily: SERIF, fontWeight: 700, color: "#fff", fontSize: { xs: 20, sm: 26 } }}>{index + 1}.</Typography>
            <Typography sx={{ fontFamily: SERIF, fontWeight: 700, color: "#fff", fontSize: { xs: 20, sm: 26 }, lineHeight: 1.3 }}>{t(q.prompt)}</Typography>
          </Box>
          {q.helper && <Typography sx={{ color: SUB, fontSize: { xs: 14, sm: 15 }, mt: 1 }}>{t(q.helper)}</Typography>}

          {/* Input by type */}
          {(q.type === "consent" || q.type === "single") && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, mt: 3 }}>
              {q.options!.map((opt) => (
                <OptionRow key={opt.id} label={t(opt.label)} selected={val === opt.id} multi={false} onClick={() => setAnswer(q.id, opt.id)} />
              ))}
            </Box>
          )}

          {q.type === "multi" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, mt: 3 }}>
              {q.options!.map((opt) => (
                <OptionRow key={opt.id} label={t(opt.label)} selected={Array.isArray(val) && val.includes(opt.id)} multi onClick={() => toggleMulti(q.id, opt.id)} />
              ))}
            </Box>
          )}

          {q.type === "scale" && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {Array.from({ length: (q.scaleMax ?? 10) - (q.scaleMin ?? 0) + 1 }, (_, i) => (q.scaleMin ?? 0) + i).map((n) => (
                  <Box
                    key={n}
                    onClick={() => setAnswer(q.id, n)}
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontWeight: 700,
                      bgcolor: val === n ? PURPLE : "rgba(255,255,255,0.06)",
                      color: val === n ? "#fff" : "#efeafb",
                      border: `1px solid ${val === n ? PURPLE : "rgba(255,255,255,0.12)"}`,
                    }}
                  >
                    {n}
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1, color: MUTED, fontSize: 12 }}>
                <span>{q.scaleMin} — {t(q.scaleMinLabel)}</span>
                <span>{t(q.scaleMaxLabel)} — {q.scaleMax}</span>
              </Box>
            </Box>
          )}

          {(q.type === "number" || q.type === "text" || q.type === "textarea") && (
            <TextField
              fullWidth
              multiline={q.type === "textarea"}
              minRows={q.type === "textarea" ? 3 : undefined}
              type={q.type === "number" ? "number" : "text"}
              value={val ?? ""}
              onChange={(e) => setAnswer(q.id, e.target.value)}
              placeholder={t(q.placeholder)}
              sx={textFieldSx}
            />
          )}

          {/* Optional describe follow-up */}
          {showDescribe && (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ color: SUB, fontSize: 14, mb: 0.5 }}>{t(q.describe)}</Typography>
              <TextField
                fullWidth
                multiline
                minRows={2}
                value={describes[q.id] ?? ""}
                onChange={(e) => setDescribes((d) => ({ ...d, [q.id]: e.target.value }))}
                placeholder={t(surveyStrings.describePlaceholder)}
                sx={{ ...textFieldSx, mt: 0 }}
              />
            </Box>
          )}

          <Box sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.1)", my: 3 }} />

          {/* Nav */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {index > 0 ? (
              <Button onClick={goBack} startIcon={<ChevronLeftRoundedIcon />} sx={{ color: SUB, textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "rgba(255,255,255,0.06)" } }}>
                {t(surveyStrings.back)}
              </Button>
            ) : (
              <span />
            )}
            <Button
              onClick={goNext}
              disabled={!canProceed}
              endIcon={<ChevronRightRoundedIcon />}
              variant="contained"
              sx={{
                bgcolor: PURPLE,
                color: "#fff",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 4,
                py: 1.25,
                boxShadow: "none",
                "&:hover": { bgcolor: "#776ac9", boxShadow: "none" },
                "&.Mui-disabled": { bgcolor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)" },
              }}
            >
              {isLast ? t(surveyStrings.submit) : t(surveyStrings.next)}
            </Button>
          </Box>

          {/* Footer note */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mt: 4 }}>
            <LockRoundedIcon sx={{ color: MUTED, fontSize: 15 }} />
            <Typography sx={{ color: MUTED, fontSize: 13 }}>{t(surveyStrings.footer)}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <EnergySavingsLeafRoundedIcon sx={{ color: "rgba(255,255,255,0.25)", fontSize: 16 }} />
          </Box>
        </Box>
      </Box>
    </CoquiShell>
  );
};

export default SurveyPage;
