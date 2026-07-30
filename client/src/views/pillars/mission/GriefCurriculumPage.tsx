import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const INK = "#131b70";
const PURPLE = "#7650c5";
type SectionId = "introduction" | "concepts" | "objectives" | "psychoeducation" | "intervention" | "processing" | "closing";
type Lang = "en" | "es";
const copy = (lang: Lang, en: string, es: string) => lang === "es" ? es : en;

const tabs = [
  { id: "introduction", icon: SpaOutlinedIcon, en: "Introduction", es: "Introducción" },
  { id: "concepts", icon: LightbulbOutlinedIcon, en: "Concepts", es: "Conceptos" },
  { id: "objectives", icon: TrackChangesOutlinedIcon, en: "Objectives", es: "Objetivos" },
  { id: "psychoeducation", icon: AutoStoriesOutlinedIcon, en: "Psychoeducation", es: "Psicoeducación" },
  { id: "intervention", icon: SpaOutlinedIcon, en: "Intervention", es: "Intervención" },
  { id: "processing", icon: ForumOutlinedIcon, en: "Processing", es: "Procesamiento" },
  { id: "closing", icon: FavoriteBorderRoundedIcon, en: "Closing", es: "Cierre" },
] as const;

const listContent: Record<"concepts" | "objectives" | "intervention", { en: string[]; es: string[] }> = {
  concepts: {
    en: ["Grief is a natural response to love and loss.", "The death of a loved one can affect emotions, thoughts, the body, relationships, and our sense of safety.", "Hope and fear may coexist while searching for a missing loved one, creating anticipatory grief.", "Shock, denial, and emotional numbness are normal nervous-system responses to significant loss.", "Accepting the reality of loss is a gradual process.", "Worden’s First Task of Grief: Accept the reality of the loss."],
    es: ["El duelo es una respuesta natural al amor y a la pérdida.", "La muerte de un ser querido puede afectar nuestras emociones, pensamientos, cuerpo, relaciones y sentido de seguridad.", "Durante la búsqueda de un familiar desaparecido pueden coexistir la esperanza y el miedo, dando lugar al duelo anticipado.", "El shock, la negación y el entumecimiento emocional son respuestas normales del sistema nervioso frente a una pérdida significativa.", "Aceptar la realidad de la pérdida es un proceso gradual.", "Primera Tarea del Duelo de Worden: Aceptar la realidad de la pérdida."],
  },
  objectives: {
    en: ["Create psychological safety within the group.", "Encourage connection among participants.", "Validate initial responses after the death of a loved one.", "Understand anticipatory grief while searching for family members.", "Introduce Worden’s First Task of Grief.", "Normalize the physical, emotional, and cognitive reactions of acute grief."],
    es: ["Crear seguridad psicológica dentro del grupo.", "Favorecer la conexión entre los participantes.", "Validar las respuestas iniciales después de la muerte de un ser querido.", "Comprender el concepto de duelo anticipado durante la búsqueda de familiares.", "Introducir la Primera Tarea del Duelo de Worden.", "Normalizar las reacciones físicas, emocionales y cognitivas propias del duelo agudo."],
  },
  intervention: {
    en: ["Identify physical, emotional, and cognitive reactions after the loss.", "Explore how participants experienced the period of searching and waiting.", "Practice conscious breathing to support nervous-system regulation.", "Use a five-senses grounding exercise to return to the present.", "Support group connection through validating shared experiences."],
    es: ["Identificar las reacciones físicas, emocionales y cognitivas presentes después de la pérdida.", "Explorar cómo vivieron el período de búsqueda y espera.", "Practicar respiración consciente para favorecer la regulación del sistema nervioso.", "Realizar un ejercicio de grounding utilizando los cinco sentidos para regresar al momento presente.", "Favorecer la conexión grupal mediante la validación de experiencias compartidas."],
  },
};

const processing = {
  en: ["What emotions appeared most frequently during that time?", "What did you feel when you received the news?", "How did your body respond at that moment?", "What has been the hardest thing to accept so far?", "What support do you need right now?", "What did you discover about yourself by sharing or hearing the group’s experiences?"],
  es: ["¿Qué emociones aparecieron con mayor frecuencia durante ese tiempo?", "¿Qué sentiste cuando recibiste la noticia?", "¿Cómo respondió tu cuerpo en ese momento?", "¿Qué ha sido lo más difícil de aceptar hasta ahora?", "¿Qué apoyo necesitas en este momento?", "¿Qué descubriste de ti al compartir o escuchar las experiencias del grupo?"],
};

const GriefCurriculumPage: React.FC = () => {
  const navigate = useNavigate();
  const { section = "introduction" } = useParams();
  const { i18n } = useTranslation();
  const lang: Lang = (i18n.resolvedLanguage || i18n.language).startsWith("es") ? "es" : "en";
  const active: SectionId = tabs.some((tab) => tab.id === section) ? section as SectionId : "introduction";
  const activeTab = tabs.find((tab) => tab.id === active)!;

  const pageTitle = copy(lang, activeTab.en, activeTab.es);
  const card = { bgcolor: "rgba(255,255,255,.78)", border: "1px solid rgba(92,62,173,.14)", borderRadius: 3, boxShadow: "0 8px 24px rgba(79,52,145,.04)" };

  const renderContent = () => {
    if (active === "concepts" || active === "objectives" || active === "intervention") {
      const items = listContent[active][lang];
      return <Box>
        <Typography sx={{ fontFamily: SERIF, fontSize: 31 }}>{pageTitle}</Typography>
        <Typography sx={{ mt: .5, mb: 3 }}>{active === "objectives" ? copy(lang, "What we hope to accomplish in this session.", "Lo que buscamos lograr en esta sesión.") : active === "intervention" ? copy(lang, "Practical activities to process the experience through care and connection.", "Actividades prácticas para comenzar a procesar la experiencia desde el cuidado y la conexión.") : copy(lang, "Key ideas for understanding the beginning of the grieving process.", "Ideas clave para comprender el inicio del proceso de duelo.")}</Typography>
        <Box sx={{ display: "grid", gap: 1.5 }}>{items.map((text, index) => <Box key={text} sx={{ ...card, p: 2, display: "flex", alignItems: "center", gap: 2 }}><Box sx={{ width: 52, height: 52, flexShrink: 0, borderRadius: "50%", bgcolor: "#eee7fa", color: PURPLE, display: "grid", placeItems: "center", fontFamily: SERIF, fontSize: 26 }}>{active === "concepts" ? <FavoriteBorderRoundedIcon /> : index + 1}</Box><Typography sx={{ fontSize: 16 }}>{text}</Typography></Box>)}</Box>
      </Box>;
    }
    if (active === "psychoeducation") {
      const responses = lang === "es" ? ["Shock o sensación de incredulidad.", "Negación.", "Entumecimiento emocional.", "Sensación de irrealidad.", "Confusión.", "Dificultad para concentrarse.", "Pensamientos repetitivos.", "Necesidad de conocer los detalles.", "Llanto intenso o dificultad para llorar.", "Alteraciones del sueño.", "Cambios en el apetito.", "Sensación de vacío o desconexión.", "Cansancio físico intenso."] : ["Shock or disbelief.", "Denial.", "Emotional numbness.", "Sense of unreality.", "Confusion.", "Difficulty concentrating.", "Repetitive thoughts.", "Need to know every detail.", "Intense crying or difficulty crying.", "Sleep changes.", "Appetite changes.", "Emptiness or disconnection.", "Intense physical fatigue."];
      return <Box><Typography sx={{ fontFamily: SERIF, fontSize: 31 }}>{pageTitle}</Typography><Typography sx={{ mb: 3 }}>{copy(lang, "Information and understanding to support the process.", "Información y comprensión para acompañar el proceso.")}</Typography><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.05fr .95fr" }, gap: 3 }}><Box sx={{ ...card, p: 3 }}><Typography sx={{ fontWeight: 800, fontSize: 20, mb: 2 }}>{copy(lang, "Understanding anticipatory and acute grief", "Comprender el duelo anticipado y agudo")}</Typography><Typography sx={{ lineHeight: 1.8 }}>{copy(lang, "After a disaster, many families endure uncertainty while searching for loved ones. Hope, fear, despair, and moments of relief may coexist. When a death is confirmed, the brain and body can respond through automatic survival mechanisms. These reactions are part of the nervous system’s normal response to a profoundly painful event. Worden’s first task of grief is to gradually accept the reality of the loss.", "Después de un desastre, muchas familias atraviesan incertidumbre mientras buscan noticias sobre sus seres queridos. Durante ese tiempo pueden aparecer esperanza, miedo, desesperación y alivio. Cuando se confirma la muerte, el cerebro y el cuerpo pueden responder con mecanismos automáticos de supervivencia. Estas respuestas forman parte del funcionamiento normal del sistema nervioso. La primera tarea del duelo de Worden consiste en aceptar gradualmente la realidad de la pérdida.")}</Typography></Box><Box sx={{ ...card, p: 2.5, bgcolor: "#f4effb" }}><Typography sx={{ fontFamily: SERIF, fontSize: 22, mb: 2 }}>{copy(lang, "Normalize common responses", "Normalizar respuestas frecuentes")}</Typography>{responses.map((text, index) => <Box key={text} sx={{ display: "flex", gap: 1.5, bgcolor: "white", borderRadius: 2, p: 1, mb: .75 }}><Box sx={{ width: 25, height: 25, borderRadius: "50%", bgcolor: PURPLE, color: "white", display: "grid", placeItems: "center", fontSize: 11 }}>{index + 1}</Box><Typography sx={{ fontSize: 13 }}>{text}</Typography></Box>)}</Box></Box></Box>;
    }
    if (active === "processing") {
      return <Box><Typography sx={{ fontFamily: SERIF, fontSize: 35 }}>{pageTitle}</Typography><Typography sx={{ mb: 3 }}>{copy(lang, "A space to reflect, share, and find meaning in the experience.", "Espacio para reflexionar, compartir y encontrar significado en la experiencia.")}</Typography><Typography sx={{ textAlign: "center", fontFamily: SERIF, fontSize: 24, bgcolor: "#e8ddf8", borderRadius: 99, py: 1, mb: 2 }}>{copy(lang, "Suggested questions for the group", "Preguntas sugeridas para el grupo")}</Typography><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>{processing[lang].map((question, index) => <Box key={question} sx={{ ...card, minHeight: 130, p: 3, display: "grid", placeItems: "center", textAlign: "center", bgcolor: index % 2 ? "#faf0f8" : "#f3effc" }}><Typography sx={{ fontFamily: SERIF, fontSize: 24, color: index % 2 ? "#9c4ca1" : INK }}>“{question}”</Typography></Box>)}</Box></Box>;
    }
    if (active === "closing") {
      return <Box><Box sx={{ ...card, p: 3 }}><Typography sx={{ fontFamily: SERIF, fontSize: 31 }}>{copy(lang, "Psychoeducational closing", "Cierre psicoeducativo")}</Typography><Typography sx={{ mt: 2, maxWidth: 760, lineHeight: 1.8 }}>{copy(lang, "The first grief responses are natural attempts by the body and mind to protect us from a profoundly painful reality. There is no right or wrong way to react. Accepting the reality of death does not mean forgetting or ceasing to love the person who died; it means gradually learning to live with their absence while love continues to be part of our story.", "Las primeras respuestas del duelo son intentos naturales del cuerpo y de la mente por protegernos frente a una realidad profundamente dolorosa. No existe una manera correcta o incorrecta de reaccionar. Aceptar la realidad de la muerte no significa olvidar ni dejar de amar a quien falleció; significa aprender poco a poco a vivir con esa ausencia mientras el amor continúa formando parte de nuestra historia.")}</Typography></Box><Box sx={{ ...card, p: 3, mt: 2 }}><Typography sx={{ fontFamily: SERIF, fontSize: 25 }}>{copy(lang, "Feedback and a positive closing", "Feedback y cierre en una nota positiva")}</Typography><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, mt: 2 }}>{[copy(lang, "Share one word that describes how you are leaving today.", "Comparte una palabra con la que te vas hoy."), copy(lang, "What learning or reflection are you taking from this first session?", "¿Qué aprendizaje o reflexión te llevas de esta primera sesión?")].map((text) => <Box key={text} sx={{ bgcolor: "#f3eef9", borderRadius: 2, p: 2.5, fontSize: 16 }}>“ {text}</Box>)}</Box><Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><Button variant="contained" endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 30 }} />} sx={{ width: { xs: "100%", sm: 420 }, minHeight: 70, bgcolor: PURPLE, borderRadius: 99, px: 4, fontSize: { xs: 15, sm: 18 }, fontWeight: 800, boxShadow: "none", "&:hover": { bgcolor: "#6742a7", boxShadow: "none" } }}>{copy(lang, "CONTINUE TO SESSION 2", "CONTINUAR A SESIÓN 2")}</Button></Box></Box></Box>;
    }
    return <Box><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.1fr .9fr" }, gap: 3 }}><Box sx={{ ...card, p: 3 }}><Typography sx={{ fontFamily: SERIF, fontSize: 29 }}>{copy(lang, "Participant introductions", "Presentación de los participantes")}</Typography><Typography sx={{ mt: 2, lineHeight: 1.75 }}>{copy(lang, "Each participant will have the opportunity to introduce themselves, sharing only what feels comfortable. This is a safe space where all emotions are welcome and sharing is an invitation, not an obligation.", "Cada participante tendrá la oportunidad de presentarse compartiendo únicamente aquello con lo que se sienta cómodo(a). Este es un espacio seguro donde todas las emociones son bienvenidas y compartir es una invitación, no una obligación.")}</Typography></Box><Box sx={{ ...card, p: 3, bgcolor: "#f4effb" }}><Typography sx={{ fontFamily: SERIF, fontSize: 25 }}>{copy(lang, "Suggested questions", "Preguntas sugeridas")}</Typography>{[copy(lang, "How would you like us to address you?", "¿Cómo te gustaría que te llamáramos durante el grupo?"), copy(lang, "What motivated you to participate?", "¿Qué te motivó a participar en este espacio?"), copy(lang, "Is there anything the group should know to support you?", "¿Hay algo que quisieras que el grupo supiera para apoyarte mejor?")].map((text) => <Box key={text} sx={{ bgcolor: "white", p: 1.5, mt: 1, borderRadius: 2 }}>{text}</Box>)}</Box></Box><Box sx={{ ...card, p: 3, mt: 2 }}><Typography sx={{ fontFamily: SERIF, fontSize: 26 }}>{copy(lang, "Group agreements", "Acuerdos del grupo")}</Typography><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" }, gap: 2, mt: 2 }}>{[copy(lang, "Respect confidentiality.", "Respetar la confidencialidad."), copy(lang, "Listen with empathy and without judgment.", "Escuchar con empatía y sin juicios."), copy(lang, "Share only what feels safe.", "Compartir únicamente aquello para lo que se sienta preparado."), copy(lang, "Respect silence as part of grief.", "Respetar los silencios como parte del duelo."), copy(lang, "There is no correct way to grieve.", "No existe una manera correcta de vivir el duelo."), copy(lang, "Each person decides how much to share.", "Cada persona decide cuánto desea compartir.")].map((text) => <Box key={text} sx={{ display: "flex", gap: 1 }}><CheckCircleOutlineRoundedIcon sx={{ color: PURPLE }} /><Typography>{text}</Typography></Box>)}</Box></Box></Box>;
  };

  return <Box data-language-switcher sx={{ minHeight: "100dvh", bgcolor: "#f5f1fa", color: INK }}>
    <Box
      component="header"
      sx={{
        minHeight: { xs: 330, md: 390 },
        px: 2,
        pt: { xs: 5, md: 6 },
        pb: { xs: 8, md: 9 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "white",
        background: "radial-gradient(circle at 50% 20%, #252050 0%, #17183e 48%, #111331 100%)",
      }}
    >
      <Box
        sx={{
          minWidth: 145,
          px: 3,
          py: .7,
          mb: 2.5,
          bgcolor: PURPLE,
          borderRadius: 99,
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: .7,
        }}
      >
        {copy(lang, "SESSION 1", "SESIÓN 1")}
      </Box>
      <Typography
        component="h1"
        sx={{
          maxWidth: 900,
          fontFamily: SERIF,
          fontSize: { xs: 42, sm: 56, md: 68 },
          lineHeight: 1.05,
          fontWeight: 500,
        }}
      >
        {copy(lang, "Accepting the reality of loss", "Aceptando la realidad de la pérdida")}
      </Typography>
      <Box sx={{ width: 48, borderTop: "2px solid rgba(255,255,255,.65)", mt: 3, mb: 2 }} />
      <Typography sx={{ color: "rgba(255,255,255,.68)", fontSize: 11, fontWeight: 800, letterSpacing: 1.4 }}>
        {copy(lang, "MAIN TOPIC", "TEMA PRINCIPAL")}
      </Typography>
      <Typography sx={{ mt: 1, fontFamily: SERIF, fontSize: { xs: 17, sm: 21 }, fontWeight: 600 }}>
        {copy(
          lang,
          "Shock · Denial · Anticipatory grief · The reality of loss",
          "Shock · Negación · Duelo anticipado · La realidad de la pérdida",
        )}
      </Typography>
    </Box>
    <Container maxWidth="xl" sx={{ py: 1.5, mt: { xs: -6, md: -7 }, position: "relative", zIndex: 1 }}>
      <Box component="nav" sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2,1fr)", sm: "repeat(4,1fr)", lg: "repeat(7,1fr)" }, bgcolor: "#fff", borderRadius: 3, overflow: "hidden", boxShadow: "0 8px 22px rgba(61,36,128,.08)" }}>{tabs.map(({ id, icon: Icon, en, es }) => { const selected = id === active; return <Box component="button" type="button" key={id} onClick={() => navigate(`/mission/grief/session/1/${id}`)} sx={{ border: 0, borderBottom: selected ? `4px solid ${PURPLE}` : "4px solid transparent", bgcolor: "transparent", color: selected ? PURPLE : INK, py: 1.5, cursor: "pointer" }}><Icon sx={{ fontSize: 29 }} /><Typography sx={{ fontSize: 10, fontWeight: 800 }}>{copy(lang, en, es).toUpperCase()}</Typography></Box>; })}</Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "275px 1fr" }, gap: 2, mt: 2 }}>
        <Box component="aside" sx={{ position: "relative", overflow: "hidden", minHeight: { xs: 330, md: 820 }, borderRadius: 3, p: 3, textAlign: "center", backgroundImage: "linear-gradient(rgba(255,248,251,.76),rgba(238,229,250,.7)),url('/pillars/mission-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}><Box sx={{ bgcolor: PURPLE, color: "white", borderRadius: 2, py: 1, fontWeight: 800, fontSize: 20 }}>{copy(lang, "SESSION 1", "SESIÓN 1")}</Box><Typography sx={{ fontFamily: SERIF, fontSize: 34, lineHeight: 1.2, mt: 3 }}>{copy(lang, "Accepting the reality of loss", "Aceptando la realidad de la pérdida")}</Typography><Box sx={{ borderTop: "1px solid rgba(80,54,150,.2)", my: 3 }} /><Typography sx={{ color: PURPLE, fontSize: 11, fontWeight: 800 }}>{copy(lang, "MAIN TOPIC", "TEMA PRINCIPAL")}</Typography><Typography sx={{ fontWeight: 700, lineHeight: 1.5, mt: 1 }}>{copy(lang, "Shock · Denial · Anticipatory grief · The reality of loss", "Shock · Negación · Duelo anticipado · La realidad de la pérdida")}</Typography><Box sx={{ position: { md: "absolute" }, bottom: 40, left: 28, right: 28, bgcolor: "rgba(255,255,255,.6)", borderRadius: 3, p: 2.5, mt: 5 }}><FavoriteBorderRoundedIcon sx={{ color: PURPLE, fontSize: 38 }} /><Typography sx={{ fontWeight: 700, lineHeight: 1.55, mt: 1 }}>{copy(lang, "This is a space to accompany one another with respect, compassion, and humanity.", "Este es un espacio para acompañarnos con respeto, compasión y humanidad.")}</Typography></Box></Box>
        <Box component="main" sx={{ ...card, p: { xs: 2.5, md: 4 } }}>{renderContent()}</Box>
      </Box>
      <Box
        component="footer"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 1.5,
          mt: 2,
          py: 1.5,
          bgcolor: "rgba(232,224,247,.82)",
          borderRadius: 2,
        }}
      >
        {active !== "closing" && <Button
          variant="contained"
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{
            bgcolor: PURPLE,
            borderRadius: 99,
            px: 3.5,
            py: .8,
            fontSize: 11,
            fontWeight: 800,
            boxShadow: "none",
            "&:hover": { bgcolor: "#6742a7" },
          }}
        >
          {copy(lang, "CONTINUE TO SESSION 2", "CONTINUAR A SESIÓN 2")}
        </Button>}
        <Button
          onClick={() => navigate("/mission")}
          variant="outlined"
          startIcon={<AppsRoundedIcon />}
          sx={{
            color: INK,
            borderColor: PURPLE,
            borderRadius: 99,
            px: 3.5,
            py: .8,
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          {copy(lang, "CURRICULUM INDEX", "IR AL ÍNDICE DEL CURRÍCULO")}
        </Button>
      </Box>
    </Container>
  </Box>;
};

export default GriefCurriculumPage;
