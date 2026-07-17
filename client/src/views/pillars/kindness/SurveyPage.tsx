import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EnergySavingsLeafRoundedIcon from "@mui/icons-material/EnergySavingsLeafRounded";
import { useNavigate } from "react-router-dom";
import CoquiShell from "./CoquiShell";
import { surveyFooter, surveyQuestions } from "./survey-data";
import { INK, MUTED, SUB } from "./components";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const PURPLE = "#8a7de0";

const RadioMark: React.FC<{ selected: boolean }> = ({ selected }) => (
  <Box
    sx={{
      width: 22,
      height: 22,
      borderRadius: "50%",
      border: `2px solid ${selected ? PURPLE : "rgba(255,255,255,0.4)"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {selected && <Box sx={{ width: 11, height: 11, borderRadius: "50%", bgcolor: PURPLE }} />}
  </Box>
);

const SurveyPage: React.FC = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const total = surveyQuestions.length;
  const q = surveyQuestions[index];
  const selected = answers[q.id];
  const progress = Math.round(((index + 1) / total) * 100);
  const isLast = index === total - 1;

  const choose = (optionId: string) => setAnswers((a) => ({ ...a, [q.id]: optionId }));
  const goNext = () => {
    if (!selected) return;
    if (isLast) {
      // TODO: POST `answers` to the backend (e.g. /api/research/coqui/survey/response)
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
              Thank you for sharing your story.
            </Typography>
            <Typography sx={{ color: SUB, fontSize: { xs: 14, sm: 16 }, mt: 1, maxWidth: 480, mx: "auto" }}>
              Your responses have been recorded — anonymously and confidentially. Every answer helps us understand the
              power of sound, memory, and belonging.
            </Typography>
            <Button
              onClick={() => navigate("/mission/coqui")}
              variant="contained"
              endIcon={<ChevronRightRoundedIcon />}
              sx={{ mt: 3, bgcolor: PURPLE, color: "#fff", textTransform: "none", fontWeight: 600, borderRadius: 999, px: 3, boxShadow: "none", "&:hover": { bgcolor: "#776ac9", boxShadow: "none" } }}
            >
              View the research data
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
          {/* Progress */}
          <Typography sx={{ color: SUB, fontWeight: 700, letterSpacing: 0.8, fontSize: 13 }}>SURVEY PROGRESS</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1.5 }}>
            <Box sx={{ flexGrow: 1, height: 10, borderRadius: 999, bgcolor: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
              <Box sx={{ height: "100%", width: `${progress}%`, borderRadius: 999, background: "linear-gradient(90deg, #7a6cc8, #a99ee8)", transition: "width .3s ease" }} />
            </Box>
            <Typography sx={{ color: INK, fontWeight: 700, fontSize: 16, fontVariantNumeric: "tabular-nums" }}>{progress}%</Typography>
          </Box>

          <Box sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.1)", my: 3 }} />

          <Typography sx={{ color: MUTED, fontSize: 14 }}>Question {index + 1} of {total}</Typography>

          {/* Question */}
          <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
            <Typography sx={{ fontFamily: SERIF, fontWeight: 700, color: "#fff", fontSize: { xs: 22, sm: 28 } }}>{index + 1}.</Typography>
            <Typography sx={{ fontFamily: SERIF, fontWeight: 700, color: "#fff", fontSize: { xs: 22, sm: 28 }, lineHeight: 1.25 }}>{q.prompt}</Typography>
          </Box>
          {q.helper && <Typography sx={{ color: SUB, fontSize: { xs: 14, sm: 15 }, mt: 1 }}>{q.helper}</Typography>}

          {/* Options */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, mt: 3 }}>
            {q.options.map((opt) => {
              const isSel = selected === opt.id;
              return (
                <Box
                  key={opt.id}
                  onClick={() => choose(opt.id)}
                  role="radio"
                  aria-checked={isSel}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.75,
                    px: 2.5,
                    py: 2,
                    borderRadius: 3,
                    cursor: "pointer",
                    bgcolor: isSel ? "rgba(124,107,208,0.45)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${isSel ? "rgba(169,158,232,0.8)" : "rgba(255,255,255,0.1)"}`,
                    transition: "background-color .15s ease, border-color .15s ease",
                    "&:hover": { bgcolor: isSel ? "rgba(124,107,208,0.5)" : "rgba(255,255,255,0.09)" },
                  }}
                >
                  <RadioMark selected={isSel} />
                  <Typography sx={{ color: "#efeafb", fontSize: { xs: 14.5, sm: 16 } }}>{opt.label}</Typography>
                </Box>
              );
            })}
          </Box>

          <Box sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.1)", my: 3 }} />

          {/* Nav */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {index > 0 ? (
              <Button
                onClick={goBack}
                startIcon={<ChevronLeftRoundedIcon />}
                sx={{ color: SUB, textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "rgba(255,255,255,0.06)" } }}
              >
                Back
              </Button>
            ) : (
              <span />
            )}
            <Button
              onClick={goNext}
              disabled={!selected}
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
              {isLast ? "Submit" : "Next"}
            </Button>
          </Box>

          {/* Footer note */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mt: 4 }}>
            <LockRoundedIcon sx={{ color: MUTED, fontSize: 15 }} />
            <Typography sx={{ color: MUTED, fontSize: 13 }}>{surveyFooter}</Typography>
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
