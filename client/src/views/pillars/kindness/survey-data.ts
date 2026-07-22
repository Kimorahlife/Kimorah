/**
 * "Echoes of Belonging" — Coquí Research Survey (client types + UI strings).
 *
 * The questions themselves now live in the database (the `coqui_questions`
 * bank) and are fetched from `GET /api/research/coqui/survey`. This file keeps
 * only the shared types and the (bilingual) UI chrome strings.
 */
export type Lang = "en" | "es";
export type L = Record<Lang, string>;

export type QuestionType = "consent" | "single" | "multi" | "scale" | "number" | "text" | "textarea";

export interface SurveyOption {
  id: string;
  label: L;
}

export interface SurveyQuestion {
  id: string;
  type: QuestionType;
  prompt: L;
  helper?: L;
  options?: SurveyOption[];
  placeholder?: L;
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: L;
  scaleMaxLabel?: L;
  describe?: L;
  optional?: boolean;
}

export const surveyStrings = {
  progress: { en: "SURVEY PROGRESS", es: "PROGRESO DE LA ENCUESTA" },
  questionOf: { en: "Question {n} of {total}", es: "Pregunta {n} de {total}" },
  back: { en: "Back", es: "Atrás" },
  next: { en: "Next", es: "Siguiente" },
  submit: { en: "Submit", es: "Enviar" },
  footer: { en: "Your responses are anonymous and confidential.", es: "Tus respuestas son anónimas y confidenciales." },
  thanksTitle: { en: "Thank you for sharing your story.", es: "Gracias por compartir tu historia." },
  thanksBody: {
    en: "Your responses have been recorded — anonymously and confidentially. Every answer helps us understand the power of sound, memory, and belonging.",
    es: "Tus respuestas han sido registradas — de forma anónima y confidencial. Cada respuesta nos ayuda a comprender el poder del sonido, la memoria y la pertenencia.",
  },
  viewData: { en: "View the research data", es: "Ver los datos de investigación" },
  describePlaceholder: { en: "Please describe…", es: "Por favor describe…" },
} as const;
