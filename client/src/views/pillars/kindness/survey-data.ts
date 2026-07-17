/**
 * Coquí Research Survey questions.
 *
 * Q1 matches the design; Q2–Q10 are themed placeholders drawn from the research
 * dimensions (time, emotional/somatic response, location). Intended to be
 * served from the database later (e.g. `GET /api/research/coqui/survey`) and
 * answers posted back (`POST …/survey/response`).
 */
export interface SurveyOption {
  id: string;
  label: string;
}

export interface SurveyQuestion {
  id: string;
  prompt: string;
  helper?: string;
  options: SurveyOption[];
}

export const surveyFooter = "Your responses are anonymous and confidential.";

export const surveyQuestions: SurveyQuestion[] = [
  {
    id: "q1",
    prompt: "Have you ever lived in a place where you could hear the Coquí frog call regularly?",
    helper: "This helps us understand your personal connection to the Coquí sound.",
    options: [
      { id: "regularly", label: "Yes, I have lived in a place where I heard it regularly" },
      { id: "occasionally", label: "Yes, but I only heard it occasionally" },
      { id: "never", label: "No, I have never lived in a place where I heard it" },
      { id: "unsure", label: "I'm not sure" },
    ],
  },
  {
    id: "q2",
    prompt: "How long has it been since you last heard the Coquí call in person?",
    helper: "Your best estimate is fine.",
    options: [
      { id: "lt1", label: "Less than 1 year" },
      { id: "1to3", label: "1 – 3 years" },
      { id: "4to10", label: "4 – 10 years" },
      { id: "11to20", label: "11 – 20 years" },
      { id: "gt20", label: "More than 20 years" },
    ],
  },
  {
    id: "q3",
    prompt: "When you hear a recording of the Coquí call now, how strong is your emotional response?",
    options: [
      { id: "very", label: "Very strong" },
      { id: "strong", label: "Strong" },
      { id: "moderate", label: "Moderate" },
      { id: "weak", label: "Weak" },
      { id: "none", label: "No response" },
    ],
  },
  {
    id: "q4",
    prompt: "Which emotion do you most associate with the Coquí call?",
    options: [
      { id: "nostalgia", label: "Nostalgia" },
      { id: "peace", label: "Peace" },
      { id: "belonging", label: "Belonging" },
      { id: "yearning", label: "Yearning" },
      { id: "other", label: "Something else" },
    ],
  },
  {
    id: "q5",
    prompt: "Do you notice any physical sensations when you hear the Coquí call?",
    helper: "Choose the one you notice most.",
    options: [
      { id: "breathing", label: "Deepened breathing" },
      { id: "goosebumps", label: "Goosebumps" },
      { id: "relaxation", label: "Relaxation" },
      { id: "tears", label: "Tears" },
      { id: "none", label: "None" },
    ],
  },
  {
    id: "q6",
    prompt: "At what time of day was the Coquí call most meaningful to you?",
    options: [
      { id: "night", label: "Night" },
      { id: "afterrain", label: "After the rain" },
      { id: "dusk", label: "Dusk" },
      { id: "morning", label: "Early morning" },
      { id: "daytime", label: "Daytime" },
    ],
  },
  {
    id: "q7",
    prompt: "Where did you primarily live when the Coquí call was part of your daily environment?",
    options: [
      { id: "pr", label: "Puerto Rico" },
      { id: "ve", label: "Venezuela" },
      { id: "caribbean", label: "Another Caribbean location" },
      { id: "latam", label: "Central or South America" },
      { id: "other", label: "Somewhere else" },
    ],
  },
  {
    id: "q8",
    prompt: "Where do you currently live?",
    options: [
      { id: "usa", label: "United States" },
      { id: "spain", label: "Spain" },
      { id: "venezuela", label: "Venezuela" },
      { id: "colombia", label: "Colombia" },
      { id: "other", label: "Another country" },
    ],
  },
  {
    id: "q9",
    prompt: "How often do you intentionally seek out the Coquí sound (recordings, videos)?",
    options: [
      { id: "daily", label: "Daily" },
      { id: "weekly", label: "Weekly" },
      { id: "sometimes", label: "Occasionally" },
      { id: "rarely", label: "Rarely" },
      { id: "never", label: "Never" },
    ],
  },
  {
    id: "q10",
    prompt: "The Coquí call helps me feel connected to home.",
    helper: "How much do you agree?",
    options: [
      { id: "strong-agree", label: "Strongly agree" },
      { id: "agree", label: "Agree" },
      { id: "neutral", label: "Neutral" },
      { id: "disagree", label: "Disagree" },
      { id: "strong-disagree", label: "Strongly disagree" },
    ],
  },
];
