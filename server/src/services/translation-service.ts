import Anthropic from "@anthropic-ai/sdk";

/**
 * Translation for curriculum copy.
 *
 * Curricula are authored in English and translated into Spanish for the site's
 * Spanish readers; the reverse direction exists for the material that was
 * originally written in Spanish and imported. Nothing here decides which way to
 * go — the caller does, because only the caller knows which language the author
 * was typing in.
 *
 * Strings are translated as a batch rather than one request per field: a
 * session holds ~30 short lines, and sending them together lets the model keep
 * terminology consistent across a section (the same rendering of "vulnerability"
 * every time) instead of re-deciding it 30 times in isolation.
 */

export type Lang = "en" | "es";

/** Batch size. Small enough to stay well inside the output ceiling per call. */
const CHUNK = 40;

const MODEL = "claude-opus-5";

const CONTEXT = `This is a psychoeducational group-therapy curriculum supporting people affected by the earthquake in Venezuela. The author is a clinician; the text is read by clinicians and by group participants.`;

const RULES = `Rules:
- Translate meaning, not word order. The result must read as though written in the target language.
- Keep the clinical register. Terms of art have established equivalents in both languages — "vicarious trauma" / "trauma vicario", "radical presence" / "presencia radical", "Trauma-Informed Care" / "Atención Informada por Trauma" — use them rather than translating word by word.
- Preserve the punctuation that carries structure: a heading ending in a colon keeps its colon, a question keeps its question marks, a line with no final period keeps none.
- Preserve the second person and the warmth of the original.
- Do not add, explain, expand, or soften anything. One input line produces one output line.
- Never leave a line empty.`;

const SYSTEM: Record<Lang, string> = {
  es: `You translate a psychoeducational group-therapy curriculum from English into Spanish.

${CONTEXT}

Use Latin American Spanish, and the "usted"-neutral register a clinician would use with a group — warm and direct, not formal or clinical-cold. Where the original addresses the participant, keep that address ("¿Qué puedes controlar hoy?").

${RULES}`,

  en: `You translate a psychoeducational group-therapy curriculum from Spanish into English.

${CONTEXT}

${RULES}`,
};

const SCHEMA = {
  type: "object",
  properties: {
    translations: {
      type: "array",
      items: { type: "string" },
      description: "The translations, in the same order as the input.",
    },
  },
  required: ["translations"],
  additionalProperties: false,
} as const;

/** Thrown when the server has no key configured, so the route can answer 503. */
export class TranslationUnavailable extends Error {}

let client: Anthropic | null = null;

const getClient = (): Anthropic => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new TranslationUnavailable(
      "Translation is not configured on this server — ANTHROPIC_API_KEY is missing.",
    );
  }
  if (!client) client = new Anthropic({ apiKey });
  return client;
};

const LANGUAGE_NAME: Record<Lang, string> = { en: "English", es: "Spanish" };

/** One request. Returns exactly `texts.length` translations, in order. */
const translateChunk = async (texts: string[], to: Lang): Promise<string[]> => {
  const numbered = texts.map((t, i) => `${i + 1}. ${t}`).join("\n");

  // Streamed so a slow batch cannot trip the non-streaming request timeout.
  const message = await getClient()
    .messages.stream({
      model: MODEL,
      max_tokens: 16000,
      system: SYSTEM[to],
      output_config: { format: { type: "json_schema", schema: SCHEMA } },
      messages: [
        {
          role: "user",
          content:
            `Translate these ${texts.length} lines into ${LANGUAGE_NAME[to]}. ` +
            `Return exactly ${texts.length} translations in the same order.\n\n${numbered}`,
        },
      ],
    })
    .finalMessage();

  const block = message.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") {
    throw new Error("Translation returned no text content.");
  }

  const parsed = JSON.parse(block.text) as { translations?: unknown };
  const out = parsed.translations;

  if (!Array.isArray(out) || out.length !== texts.length || out.some((s) => typeof s !== "string")) {
    throw new Error(
      `Translation returned ${Array.isArray(out) ? out.length : "no"} lines for ${texts.length} inputs.`,
    );
  }

  return out as string[];
};

/**
 * Translate a list of strings into `to`, preserving order and length.
 *
 * Chunks run one after another rather than in parallel: the batches share a
 * rate limit, and a curriculum is a handful of chunks at most.
 */
export const translate = async (texts: string[], to: Lang): Promise<string[]> => {
  if (texts.length === 0) return [];

  const out: string[] = [];
  for (let i = 0; i < texts.length; i += CHUNK) {
    out.push(...(await translateChunk(texts.slice(i, i + CHUNK), to)));
  }
  return out;
};
