import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import SessionThreeTabs, { SessionThreeTab } from "./SessionThreeTabs";

const TITLE = '"Playfair Display", Georgia, "Times New Roman", serif';
const INK = "#151c5c";
const PURPLE = "#6540b2";
type Lang = "en" | "es";
const tr = (lang: Lang, en: string, es: string) => (lang === "es" ? es : en);
const card = {
  bgcolor: "rgba(255,255,255,.91)",
  border: "1px solid rgba(69,45,143,.14)",
  borderRadius: 3,
};

const content = {
  concepts: {
    es: [
      "No existe una única forma de vivir el duelo.",
      "El duelo no tiene un tiempo determinado.",
      "Ayudar también puede ser una forma de elaborar el duelo.",
      "La comparación del dolor puede generar culpa y aislamiento.",
      "Los estereotipos y roles de género pueden influir en la manera en que vivimos y expresamos el duelo.",
      "Diferenciar qué creencias, patrones y expectativas culturales favorecen nuestro bienestar y cuáles pueden dificultar nuestro proceso de recuperación en momentos de crisis.",
    ],
    en: [
      "There is no single way to experience grief.",
      "Grief has no set timeline.",
      "Helping others can also be a way of processing grief.",
      "Comparing pain can create guilt and isolation.",
      "Stereotypes and gender roles can influence how we experience and express grief.",
      "Distinguish which beliefs, patterns, and cultural expectations support our well-being and which may hinder recovery in times of crisis.",
    ],
  },
  objectives: {
    es: [
      "Identificar creencias y expectativas que dificultan expresar el duelo.",
      "Explorar cómo los estigmas, los patrones aprendidos y los roles de género pueden influir en la manera de afrontar una crisis.",
      "Reducir la vergüenza y la culpa asociadas al sufrimiento.",
      "Promover la autocompasión como herramienta de afrontamiento.",
      "Validar que cada persona vive el duelo de una manera única.",
    ],
    en: [
      "Identify beliefs and expectations that make it difficult to express grief.",
      "Explore how stigma, learned patterns, and gender roles can influence the way a crisis is faced.",
      "Reduce shame and guilt associated with suffering.",
      "Promote self-compassion as a coping tool.",
      "Validate that each person experiences grief in a unique way.",
    ],
  },
  explanations: {
    es: [
      "Cada persona procesa las pérdidas de manera diferente según su historia, personalidad, cultura y experiencias de vida.",
      'No existe una forma "correcta" de vivir o expresar el duelo.',
      "Comparar nuestro dolor con el de otras personas puede aumentar la culpa y disminuir la compasión hacia nosotros mismos.",
      "La autocompasión consiste en tratarnos con la misma comprensión, paciencia y amabilidad que ofreceríamos a un ser querido.",
      "Pedir ayuda, expresar emociones y cuidar de uno mismo son señales de fortaleza, no de debilidad.",
      "En momentos de crisis, es útil reflexionar sobre las creencias, patrones y expectativas que hemos aprendido a lo largo de la vida. Algunas pueden brindarnos fortaleza y sentido, mientras que otras pueden dificultar nuestro proceso de recuperación.",
    ],
    en: [
      "Each person processes loss differently according to their history, personality, culture, and life experiences.",
      'There is no “correct” way to experience or express grief.',
      "Comparing our pain with other people's can increase guilt and reduce compassion toward ourselves.",
      "Self-compassion means treating ourselves with the same understanding, patience, and kindness we would offer a loved one.",
      "Asking for help, expressing emotions, and caring for ourselves are signs of strength, not weakness.",
      "In times of crisis, it is useful to reflect on beliefs, patterns, and expectations learned throughout life. Some can offer strength and meaning, while others may hinder recovery.",
    ],
  },
  beliefs: {
    es: ['"Tengo que ser fuerte por todos."', '"Los hombres no lloran."', '"Como mujer tengo que cuidar de todos antes que de mí."', '"Si me derrumbo, decepcionaré a mi familia."', '"Pedir ayuda significa que soy débil."', '"Tengo que resolver todos los problemas."', '"No debo mostrar mis emociones."', '"Si sigo con mi vida, significa que estoy olvidando a quienes sufren."'],
    en: ['“I have to be strong for everyone.”', '“Men do not cry.”', '“As a woman, I have to care for everyone before myself.”', '“If I fall apart, I will disappoint my family.”', '“Asking for help means I am weak.”', '“I have to solve every problem.”', '“I should not show my emotions.”', '“If I move forward with my life, it means I am forgetting those who suffer.”'],
  },
  reflect: {
    es: ["¿Qué creencias me ayudan a enfrentar esta situación?", "¿Qué creencias me generan mayor carga, culpa o agotamiento?", "¿Qué patrones quisiera conservar?", "¿Qué patrones ya no me sirven en este momento de mi vida?"],
    en: ["Which beliefs help me face this situation?", "Which beliefs create more burden, guilt, or exhaustion?", "Which patterns would I like to keep?", "Which patterns no longer serve me at this point in my life?"],
  },
  intervention: {
    es: [
      "Identificar creencias, patrones y expectativas que favorecen o dificultan el proceso de duelo.",
      "Explorar cómo los roles asumidos durante la crisis impactan el bienestar emocional.",
      "Promover la autocompasión y la flexibilidad psicológica.",
      "Diferenciar entre las expectativas impuestas por otros y las decisiones alineadas con los propios valores.",
      "Reflexionar sobre cómo cuidar de los demás sin descuidar el propio bienestar.",
    ],
    en: [
      "Identify beliefs, patterns, and expectations that support or hinder the grief process.",
      "Explore how roles assumed during the crisis affect emotional well-being.",
      "Promote self-compassion and psychological flexibility.",
      "Distinguish between expectations imposed by others and decisions aligned with personal values.",
      "Reflect on how to care for others without neglecting one's own well-being.",
    ],
  },
  processing: {
    es: [
      '¿Qué mensaje aprendiste sobre cómo "deberías" enfrentar el dolor?',
      "¿Qué expectativas sientes que otras personas tienen sobre ti en este momento?",
      "¿Hay algún rol que sientas que has tenido que asumir desde el terremoto?",
      "¿Ese rol te está ayudando o te está agotando?",
      "¿Qué creencia aprendida te gustaría comenzar a cuestionar?",
      "¿Qué cambiaría si te permitieras vivir tu duelo de una manera más auténtica?",
      "¿Cómo sería tratarte con la misma compasión que ofrecerías a otra persona?",
      "¿Qué aprendiste sobre ti hoy?",
    ],
    en: [
      "What message did you learn about how you “should” face pain?",
      "What expectations do you feel other people have of you right now?",
      "Is there a role you feel you have had to assume since the earthquake?",
      "Is that role helping you or exhausting you?",
      "Which learned belief would you like to begin questioning?",
      "What would change if you allowed yourself to grieve more authentically?",
      "What would it be like to treat yourself with the same compassion you would offer someone else?",
      "What did you learn about yourself today?",
    ],
  },
};

const NumberedRows = ({ items }: { items: string[] }) => (
  <Box sx={{ display: "grid", gap: 1.5 }}>
    {items.map((item, index) => (
      <Box key={item} sx={{ ...card, p: { xs: 2, md: 2.5 }, display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ flex: "0 0 auto", width: 48, height: 48, borderRadius: "50%", bgcolor: "#eee6fb", color: PURPLE, display: "grid", placeItems: "center", fontWeight: 800 }}>{index + 1}</Box>
        <Typography sx={{ color: INK, fontSize: { xs: 15, md: 17 }, fontWeight: 600 }}>{item}</Typography>
      </Box>
    ))}
  </Box>
);

export default function MissionSessionThreePage() {
  const { section } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const lang: Lang = (i18n.resolvedLanguage || i18n.language).startsWith("es") ? "es" : "en";
  const active: SessionThreeTab = (section || "introduction") as SessionThreeTab;
  const pick = <T,>(value: { es: T; en: T }) => value[lang];

  const heading = (title: string, subtitle?: string, Icon = LightbulbOutlinedIcon) => (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ width: 54, height: 54, borderRadius: "50%", bgcolor: PURPLE, color: "white", display: "grid", placeItems: "center" }}><Icon /></Box>
        <Typography component="h2" sx={{ color: INK, fontSize: { xs: 31, md: 42 }, fontWeight: 500 }}>{title}</Typography>
      </Box>
      {subtitle && <Typography sx={{ ml: { md: 8.5 }, mt: 0.5, color: INK, fontSize: 16 }}>{subtitle}</Typography>}
    </Box>
  );

  const pageContent = () => {
    if (active === "concepts") return <>{heading(tr(lang, "Concepts", "Conceptos"))}<NumberedRows items={pick(content.concepts)} /></>;
    if (active === "objectives") return <>{heading(tr(lang, "Objectives", "Objetivos"), tr(lang, "What we seek to accomplish in this session.", "Lo que buscamos lograr en esta sesión."), TrackChangesOutlinedIcon)}<NumberedRows items={pick(content.objectives)} /></>;
    if (active === "psychoeducation") return (
      <>
        {heading(tr(lang, "Psychoeducation", "Psicoeducación"), tr(lang, "Understanding beliefs, expectations, and self-compassion.", "Comprender las creencias, las expectativas y la autocompasión."), MenuBookOutlinedIcon)}
        <Typography sx={{ color: PURPLE, fontSize: 23, fontWeight: 800, mb: 1.5 }}>{tr(lang, "Explain:", "Explicar:")}</Typography>
        <NumberedRows items={pick(content.explanations)} />
        <Typography sx={{ color: PURPLE, fontSize: 23, fontWeight: 800, mt: 4, mb: 1.5 }}>{tr(lang, "Explore examples of cultural beliefs and expectations:", "Explorar ejemplos de creencias y expectativas culturales:")}</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1fr" }, gap: 1.25 }}>{pick(content.beliefs).map((item) => <Box key={item} sx={{ ...card, p: 2 }}><Typography sx={{ color: INK, fontWeight: 600 }}>{item}</Typography></Box>)}</Box>
        <Typography sx={{ color: PURPLE, fontSize: 23, fontWeight: 800, mt: 4, mb: 1.5 }}>{tr(lang, "Reflect:", "Invitar a reflexionar:")}</Typography>
        <NumberedRows items={pick(content.reflect)} />
      </>
    );
    if (active === "intervention") return <>{heading(tr(lang, "Intervention", "Intervención"), tr(lang, "Focused on:", "Enfocada en:"), SpaOutlinedIcon)}<NumberedRows items={pick(content.intervention)} /></>;
    if (active === "processing") return (
      <>
        {heading(tr(lang, "Processing", "Procesamiento"), tr(lang, "Suggested questions:", "Preguntas sugeridas:"), ForumOutlinedIcon)}
        <Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1fr" }, gap: 1.5 }}>
          {pick(content.processing).map((item, index) => <Box key={item} sx={{ ...card, p: 3, minHeight: 120, display: "flex", gap: 2, alignItems: "center" }}><Typography sx={{ color: PURPLE, fontFamily: TITLE, fontSize: 30 }}>“</Typography><Typography sx={{ color: INK, fontFamily: TITLE, fontSize: { xs: 19, md: 22 }, lineHeight: 1.3 }}>{item}</Typography><Typography sx={{ ml: "auto", color: PURPLE, fontWeight: 800 }}>{index + 1}</Typography></Box>)}
        </Box>
      </>
    );
    if (active === "closing") return (
      <>
        <Box sx={{ ...card, p: { xs: 2.5, md: 4 }, mb: 2.5 }}>
          {heading(tr(lang, "Psychoeducational closing", "Cierre psicoeducativo"), undefined, FavoriteBorderRoundedIcon)}
          <Typography sx={{ color: INK, fontSize: { xs: 16, md: 18 }, lineHeight: 1.75 }}>
            {tr(lang,
              "Grief does not need to meet social or cultural expectations. Each person has the right to experience their process authentically and respectfully. Showing vulnerability, expressing emotions, and asking for support are human responses that foster recovery. We can preserve the beliefs and values that strengthen us while leaving behind patterns that create guilt, exhaustion, or distance us from well-being.",
              "El duelo no necesita cumplir expectativas sociales o culturales. Cada persona tiene derecho a vivir su proceso de una manera auténtica y respetuosa consigo misma. Mostrar vulnerabilidad, expresar emociones y pedir apoyo son respuestas humanas que favorecen la recuperación. Podemos conservar aquellas creencias y valores que nos fortalecen, mientras dejamos atrás aquellos patrones que generan culpa, agotamiento o nos alejan de nuestro bienestar."
            )}
          </Typography>
        </Box>
        <Box sx={{ ...card, p: { xs: 2.5, md: 4 }, mb: 2.5 }}>
          <Typography sx={{ color: INK, fontSize: { xs: 28, md: 35 }, fontWeight: 500, mb: 2 }}>{tr(lang, "Feedback and closing on a positive note", "Feedback y cierre en una nota positiva")}</Typography>
          <Box sx={{ bgcolor: "#f1ebf9", borderRadius: 2, p: 3 }}><Typography sx={{ color: INK, fontFamily: TITLE, fontSize: 22 }}>“ {tr(lang, "What learning or reflection are you taking away from this session?", "¿Qué aprendizaje o reflexión te llevas de la sesión?")}</Typography></Box>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1.35fr" }, gap: 2 }}>
          <Box sx={{ ...card, p: 3 }}><Typography sx={{ color: INK, fontSize: 24, fontWeight: 600, mb: 1 }}>{tr(lang, "Therapeutic approach", "Enfoque terapéutico")}</Typography><Typography sx={{ color: INK, fontStyle: "italic", lineHeight: 1.6 }}>{tr(lang, "Cognitive Behavioral Therapy (CBT), Acceptance and Commitment Therapy (ACT), and Compassion-Focused Therapy.", "Terapia Cognitivo-Conductual (CBT), Terapia de Aceptación y Compromiso (ACT) y Terapia Centrada en la Compasión (Compassion-Focused Therapy).")}</Typography></Box>
          <Box sx={{ ...card, p: 3 }}><Typography sx={{ color: INK, fontSize: 24, fontWeight: 600, mb: 1 }}>{tr(lang, "Clinical reference", "Referencia clínica")}</Typography><Typography sx={{ color: INK, fontStyle: "italic", lineHeight: 1.6 }}>{tr(lang, "This session incorporates CBT principles to identify beliefs and patterns that maintain guilt or shame, ACT to promote psychological flexibility, and Compassion-Focused Therapy to develop a kinder relationship with oneself and question cultural expectations or gender roles that may hinder recovery.", "Esta sesión incorpora principios de CBT para identificar creencias y patrones que mantienen la culpa o la vergüenza, ACT para promover flexibilidad psicológica y la Terapia Centrada en la Compasión para desarrollar una relación más amable con uno mismo y cuestionar expectativas culturales o roles de género que pueden dificultar la recuperación.")}</Typography></Box>
        </Box>
      </>
    );
    return (
      <>
        <Box sx={{ ...card, p: { xs: 2.5, md: 4 }, mb: 2.5 }}>
          <Typography component="h2" sx={{ color: INK, fontSize: { xs: 31, md: 42 }, fontWeight: 500 }}>{tr(lang, "Welcome to Session 3", "Bienvenidos a la Sesión 3")}</Typography>
          <Typography sx={{ color: INK, mt: 0.5 }}>{tr(lang, "This session validates unique grief experiences and explores compassion, culture, and authenticity.", "Esta sesión valida las experiencias únicas del duelo y explora la compasión, la cultura y la autenticidad.")}</Typography>
        </Box>
        <Box sx={{ ...card, p: { xs: 2.5, md: 4 }, mb: 2.5 }}>{heading(tr(lang, "Central concepts", "Conceptos centrales"))}<NumberedRows items={pick(content.concepts)} /></Box>
        <Box sx={{ ...card, p: { xs: 2.5, md: 4 } }}>{heading(tr(lang, "Session objectives", "Objetivos de la sesión"), undefined, TrackChangesOutlinedIcon)}<NumberedRows items={pick(content.objectives)} /></Box>
      </>
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f0fb", color: INK }}>
      <Box sx={{ background: "radial-gradient(circle at 50% 0%, #2c275b 0%, #17173f 56%, #111432 100%)", color: "white", pt: { xs: 5, md: 7 }, pb: { xs: 10, md: 12 }, textAlign: "center" }}>
        <Typography sx={{ display: "inline-block", bgcolor: "#7650bd", borderRadius: 99, px: 3, py: 0.7, fontWeight: 800 }}>{tr(lang, "SESSION 3", "SESIÓN 3")}</Typography>
        <Typography component="h1" sx={{ fontFamily: TITLE, fontSize: { xs: 43, md: 68 }, lineHeight: 1.05, mt: 2 }}>{tr(lang, "Grief and stigma", "El duelo y el estigma")}</Typography>
        <Typography sx={{ mt: 2, opacity: 0.7, fontSize: 12, fontWeight: 800, letterSpacing: 2 }}>{tr(lang, "MAIN TOPIC", "TEMA PRINCIPAL")}</Typography>
        <Typography sx={{ mt: 0.5, fontFamily: TITLE, fontSize: { xs: 18, md: 23 } }}>{tr(lang, "Validating my process • Self-compassion • Grief has no single form", "Validando mi proceso • Autocompasión • El duelo no tiene una sola forma")}</Typography>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -6, pb: 4 }}>
        <SessionThreeTabs active={active} />
        <Box sx={{ display: "grid", gridTemplateColumns: { md: "275px minmax(0,1fr)" }, gap: 2, mt: 2 }}>
          <Box sx={{ minHeight: { md: 900 }, borderRadius: 3, p: 3, display: "flex", flexDirection: "column", textAlign: "center", backgroundImage: "linear-gradient(rgba(255,246,250,.77),rgba(231,222,248,.72)),url('/pillars/mission-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
            <Typography sx={{ bgcolor: PURPLE, color: "white", py: 1, borderRadius: 2, fontSize: 22, fontWeight: 800 }}>{tr(lang, "SESSION 3", "SESIÓN 3")}</Typography>
            <Typography sx={{ fontFamily: TITLE, color: INK, fontSize: 42, lineHeight: 1.08, mt: 4 }}>{tr(lang, "Grief and stigma", "El duelo y el estigma")}</Typography>
            <Box sx={{ my: 3, borderTop: "1px solid rgba(75,51,145,.24)" }} />
            <Typography sx={{ color: PURPLE, fontWeight: 800, fontSize: 12 }}>{tr(lang, "MAIN TOPIC", "TEMA PRINCIPAL")}</Typography>
            <Typography sx={{ color: INK, mt: 1, fontWeight: 700 }}>{tr(lang, "Validating my process • Self-compassion • Grief has no single form", "Validando mi proceso • Autocompasión • El duelo no tiene una sola forma")}</Typography>
            <Box sx={{ mt: "auto", bgcolor: "rgba(255,255,255,.72)", borderRadius: 3, p: 3 }}><FavoriteBorderRoundedIcon sx={{ color: PURPLE, fontSize: 42 }} /><Typography sx={{ mt: 1.5, fontWeight: 700 }}>{tr(lang, "Your grief deserves compassion, time, and an authentic voice.", "Tu duelo merece compasión, tiempo y una voz auténtica.")}</Typography></Box>
          </Box>
          <Box sx={{ ...card, p: { xs: 2, md: 3.5 } }}>{pageContent()}</Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button onClick={() => navigate("/mission/sessions/2")} variant="outlined" startIcon={<ArrowBackRoundedIcon />} sx={{ color: INK, borderColor: PURPLE, borderRadius: 99, px: 4, py: 1.4, fontSize: 15, fontWeight: 700 }}>{tr(lang, "SESSION 2", "SESIÓN 2")}</Button>
        </Box>
      </Container>
    </Box>
  );
}
