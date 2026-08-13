import mongoose from "mongoose";
import { Curriculums } from "../models/curriculum-model";
import { Sessions } from "../models/session-model";

const localized = (en: string, es: string) => ({ en, es });
const item = (order: number, en: string, es: string) => ({
  order,
  title: localized(en, es),
  prompts: [],
});
const group = (
  items: Array<ReturnType<typeof item>>,
  heading = localized("", ""),
) => ({ order: 0, heading, intro: localized("", ""), items });
const section = (
  items: Array<ReturnType<typeof item>>,
  intro = localized("", ""),
  heading = localized("", ""),
) => ({ intro, groups: [group(items, heading)] });

const sessionFour = {
  order: 3,
  number: 4,
  title: localized("Change and impermanence", "Cambio e impermanencia"),
  mainTopic: [
    localized("Acceptance", "Aceptación"),
    localized("Adaptation", "Adaptación"),
    localized("Rebuilding a new reality", "Reconstruyendo una nueva realidad"),
  ],
  presentation: {
    body: localized("", ""),
    prompts: [],
    reminder: localized("", ""),
  },
  sections: {
    concepts: section([
      item(0, "Life is constantly changing.", "La vida está en constante cambio."),
      item(1, "Impermanence is part of the human experience.", "La impermanencia forma parte de la experiencia humana."),
      item(2, "Resuming routines can foster a sense of stability, even when they are different from before.", "Retomar las rutinas puede favorecer la sensación de estabilidad, aunque estas sean diferentes a las de antes."),
      item(3, "We do not return to our former life; we learn to live from a new reality.", "No regresamos a la vida de antes; aprendemos a vivir desde una nueva realidad."),
      item(4, "Adapting does not mean forgetting.", "Adaptarse no significa olvidar."),
    ]),
    objectives: section([
      item(0, "Explore the changes brought about by the tragedy.", "Explorar los cambios generados por la tragedia."),
      item(1, "Encourage adaptation with flexibility.", "Favorecer la adaptación con flexibilidad."),
      item(2, "Recognize what remains and what has changed.", "Reconocer aquello que permanece y aquello que ha cambiado."),
      item(3, "Identify strengths, values, and roles that remain present, as well as those that need to change in response to the new reality.", "Identificar fortalezas, valores y roles que continúan presentes, y aquellos que necesitan transformarse para responder a la nueva realidad."),
      item(4, "Understand that change is part of life and that adapting is a form of resilience.", "Comprender que el cambio es parte de la vida y que adaptarse es una forma de resiliencia."),
    ]),
    psychoeducation: section(
      [
        item(0, "Life is constantly changing. Some things arrive, others transform, and others end. Learning to recognize what remains and what changes can help us respond more flexibly to loss and challenges.", "La vida está en constante cambio. Algunas cosas llegan, otras se transforman y otras terminan. Aprender a reconocer qué permanece y qué cambia puede ayudarnos a responder con mayor flexibilidad ante las pérdidas y los desafíos."),
        item(1, "Change is part of the human experience and can bring uncertainty, sadness, and even growth.", "El cambio forma parte de la experiencia humana y puede generar incertidumbre, tristeza e incluso crecimiento."),
        item(2, "Although many circumstances change, our ability to adapt is also part of human nature.", "Aunque muchas circunstancias cambien, nuestra capacidad para adaptarnos también forma parte de la naturaleza humana."),
        item(3, "Routines help provide structure and regulation to the nervous system, even when they differ from those that existed before the earthquake.", "Las rutinas ayudan a brindar estructura y regulación al sistema nervioso, aun cuando sean diferentes a las que existían antes del terremoto."),
        item(4, "Adapting does not mean minimizing the pain or forgetting what happened; it means learning to live with the new reality while continuing to build our life.", "Adaptarnos no significa minimizar el dolor ni olvidar lo ocurrido; significa aprender a convivir con la nueva realidad mientras continuamos construyendo nuestra vida."),
        item(5, "Some parts of our identity, values, and relationships remain; others evolve over time. Both processes are natural.", "Algunas partes de nuestra identidad, nuestros valores y nuestras relaciones permanecen; otras evolucionan con el tiempo. Ambos procesos son naturales."),
        item(6, "Recognizing impermanence also allows us to appreciate what remains: our values, strengths, and capacity to love, connect with others, and respond to adversity.", "Reconocer la impermanencia también nos permite apreciar aquello que permanece: nuestros valores, nuestras fortalezas, nuestra capacidad de amar, de conectar con los demás y de responder a la adversidad."),
      ],
      localized("", ""),
      localized("Explain", "Explicar"),
    ),
    intervention: section(
      [
        item(0, "Explore the changes that occurred before, during, and after the earthquake.", "Explorar los cambios ocurridos antes, durante y después del terremoto."),
        item(1, "Identify what remains stable and what has changed.", "Identificar aquello que permanece estable y aquello que ha cambiado."),
        item(2, "Recognize personal strengths that remain present.", "Reconocer fortalezas personales que continúan presentes."),
        item(3, "Reflect on the roles that remain meaningful and those that need to change in response to current needs.", "Reflexionar sobre los roles que continúan siendo significativos y aquellos que necesitan transformarse para responder a las necesidades actuales."),
        item(4, "Explore which aspects of routine participants wish to recover, adapt, or leave behind.", "Explorar qué aspectos de la rutina desean recuperar, adaptar o dejar atrás."),
        item(5, "Identify values that remain stable even when circumstances change.", "Identificar valores que permanecen estables aun cuando las circunstancias cambian."),
      ],
      localized("Focused on:", "Enfocada en:"),
    ),
    processing: section(
      [
        item(0, "What changed in your life after the earthquake?", "¿Qué cambió en tu vida después del terremoto?"),
        item(1, "What aspects of you remain the same?", "¿Qué aspectos de ti permanecen iguales?"),
        item(2, "What values continue to guide your decisions?", "¿Qué valores continúan guiando tus decisiones?"),
        item(3, "What routine would you like to recover?", "¿Qué rutina te gustaría recuperar?"),
        item(4, "Is there a routine or expectation you no longer wish to maintain?", "¿Hay alguna rutina o expectativa que ya no deseas mantener?"),
        item(5, "What strength have you discovered during this process?", "¿Qué fortaleza has descubierto durante este proceso?"),
        item(6, "What role has changed in your life since the earthquake?", "¿Qué rol ha cambiado en tu vida desde el terremoto?"),
        item(7, "Is there a role you no longer need to carry?", "¿Hay algún rol que ya no necesites sostener?"),
        item(8, "What aspect of your life remains a source of stability?", "¿Qué aspecto de tu vida permanece como una fuente de estabilidad?"),
        item(9, "What does adapting to this new reality mean to you?", "¿Qué significa para ti adaptarte a esta nueva realidad?"),
      ],
      localized("Suggested questions:", "Preguntas sugeridas:"),
    ),
  },
  closing: localized(
    "Accepting a new reality does not mean ceasing to love what was lost. It means recognizing that life continues to change and allowing ourselves to move forward while honoring what has been important to us. Adapting does not mean forgetting; it means responding flexibly to change, drawing on our values, strengths, and relationships to continue building a meaningful life.",
    "Aceptar una nueva realidad no significa dejar de amar lo que se perdió. Significa reconocer que la vida continúa transformándose y permitirnos avanzar sin dejar de honrar aquello que ha sido importante para nosotros. Adaptarnos no implica olvidar; implica responder con flexibilidad a los cambios, apoyándonos en nuestros valores, fortalezas y relaciones para seguir construyendo una vida con significado.",
  ),
  feedback: [
    localized("Share something that continues to give you stability, strength, or meaning. (Optional)", "Comparte algo que continúa brindándote estabilidad, fortaleza o sentido. (Opcional)"),
    localized("What learning or reflection are you taking from the session?", "¿Qué aprendizaje o reflexión te llevas de la sesión?"),
  ],
  therapeuticApproach: localized(
    "Acceptance and Commitment Therapy (ACT), Narrative Therapy, and Positive Psychology.",
    "Terapia de Aceptación y Compromiso (ACT), Terapia Narrativa y Psicología Positiva.",
  ),
  clinicalReference: localized(
    "This session uses ACT principles to foster acceptance and adaptation to change, Narrative Therapy to integrate the experience into the personal story, and Positive Psychology to identify strengths, values, and resources that remain present despite adversity.",
    "Esta sesión utiliza principios de ACT para favorecer la aceptación y la adaptación al cambio, la Terapia Narrativa para integrar la experiencia dentro de la historia personal y la Psicología Positiva para identificar fortalezas, valores y recursos que permanecen presentes a pesar de la adversidad.",
  ),
};

async function run(): Promise<void> {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is required.");

  await mongoose.connect(uri);
  const curriculum = await Curriculums.findOne({
    slug: { $in: ["when-the-earth-changes", "cuando-la-tierra-cambia"] },
  }).select("_id slug");
  if (!curriculum) throw new Error("The 'When the Earth Changes' curriculum was not found.");

  await Sessions.findOneAndUpdate(
    { curriculumId: curriculum._id, number: 4 },
    { $set: { ...sessionFour, curriculumId: curriculum._id } },
    { upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );

  console.log(`Session 4 added to ${curriculum.slug}.`);
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error);
  await mongoose.disconnect();
  process.exitCode = 1;
});
