import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useTranslation } from "react-i18next";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const BLUE = "#17163d";
const PURPLE = "#4f287f";
const LAVENDER = "#f6f2fb";

type Copy = { en: string; es: string };
const copy = (spanish: boolean, value: Copy) => spanish ? value.es : value.en;

const backgroundItems: Array<{ title: Copy; body: Copy; note: Copy }> = [
  {
    title: { en: "Behavioral Health & Intensive Outpatient Care", es: "Salud conductual y atención ambulatoria intensiva" },
    body: { en: "Facilitating psychoeducational and process-oriented groups informed by CBT, ACT, DBT, and experiential approaches.", es: "Facilitación de grupos psicoeducativos y de procesamiento informados por CBT, ACT, DBT y enfoques experienciales." },
    note: { en: "I value the power of shared experience—“I am not alone in this.”", es: "Valoro el poder de la experiencia compartida: “No estoy sola en esto”." },
  },
  {
    title: { en: "Recovery Services", es: "Servicios de recuperación" },
    body: { en: "Supporting young adults and adults navigating substance use recovery and co-occurring mental health concerns.", es: "Apoyo a jóvenes y adultos durante la recuperación por consumo de sustancias y necesidades concurrentes de salud mental." },
    note: { en: "This work deepened my understanding of change, accountability, connection, and forward movement.", es: "Este trabajo profundizó mi comprensión del cambio, la responsabilidad, la conexión y el avance." },
  },
  {
    title: { en: "Hospice & Bereavement Care", es: "Cuidados paliativos y acompañamiento en el duelo" },
    body: { en: "Specializing in grief and bereavement care following the death of a loved one, with individual and group support and psychoeducation.", es: "Especialización en duelo tras la muerte de un ser querido, con apoyo individual y grupal y psicoeducación." },
    note: { en: "Knowledgeable in anticipatory grief and grief processes.", es: "Experiencia en duelo anticipado y procesos de duelo." },
  },
  {
    title: { en: "Individual Counseling & Private Practice", es: "Consejería individual y práctica privada" },
    body: { en: "Providing individual counseling for mental health concerns, grief, identity exploration, personal growth, and major life transitions.", es: "Consejería individual para necesidades de salud mental, duelo, exploración de identidad, crecimiento personal y grandes transiciones de vida." },
    note: { en: "Every person’s path is unique, and support must reflect their story and needs.", es: "El camino de cada persona es único, y el apoyo debe reflejar su historia y sus necesidades." },
  },
];

const infoCards: Array<{ title: Copy; paragraphs: Copy[]; emphasis?: Copy[] }> = [
  {
    title: { en: "Why I created KIMORAH LIFE", es: "Por qué creé KIMORAH LIFE" },
    paragraphs: [
      { en: "Healing cannot be contained within a single system or framework.", es: "La sanación no puede limitarse a un solo sistema o marco." },
      { en: "KIMORAH LIFE grew from the vision of creating a space where mental health, grief, education, research, creativity, and community intersect.", es: "KIMORAH LIFE nació de la visión de crear un espacio donde convergen la salud mental, el duelo, la educación, la investigación, la creatividad y la comunidad." },
      { en: "Through research, curriculums, professional resources, and future programming, my goal is to develop tools that support both individuals and the professionals who serve them.", es: "A través de la investigación, los currículos, los recursos profesionales y la programación futura, mi meta es desarrollar herramientas para las personas y para quienes las acompañan." },
    ],
    emphasis: [
      { en: "When people recognize their own capacity to heal, they begin to relate to themselves differently.", es: "Cuando las personas reconocen su propia capacidad para sanar, comienzan a relacionarse consigo mismas de otra manera." },
      { en: "That is where the ripple begins.", es: "Allí es donde comienza el efecto expansivo." },
    ],
  },
  {
    title: { en: "My vision", es: "Mi visión" },
    paragraphs: [
      { en: "I envision KIMORAH LIFE as a space where people across communities and contexts can explore the many dimensions of being human.", es: "Visualizo KIMORAH LIFE como un espacio donde personas de distintas comunidades y contextos puedan explorar las muchas dimensiones de ser humano." },
      { en: "A place to learn. A place to reflect. A place to question. A place to reconnect with meaning.", es: "Un lugar para aprender. Un lugar para reflexionar. Un lugar para cuestionar. Un lugar para reconectar con el significado." },
      { en: "A place that reminds us that difficult chapters do not have to define the entirety of our story.", es: "Un lugar que nos recuerde que los capítulos difíciles no tienen que definir toda nuestra historia." },
    ],
    emphasis: [{ en: "To survive profound change, rediscover meaning, and continue creating a life that holds possibility.", es: "Sobrevivir a cambios profundos, redescubrir el significado y continuar creando una vida llena de posibilidades." }],
  },
  {
    title: { en: "Let’s connect", es: "Conectemos" },
    paragraphs: [
      { en: "KIMORAH LIFE is continuing to grow.", es: "KIMORAH LIFE continúa creciendo." },
      { en: "I welcome connection and collaboration with mental health professionals, grief and bereavement specialists, researchers, educators, organizations, and community leaders who are interested in developing meaningful, evidence-informed resources.", es: "Doy la bienvenida a la conexión y colaboración con profesionales de salud mental, especialistas en duelo, investigadores, educadores, organizaciones y líderes comunitarios interesados en desarrollar recursos significativos e informados por la evidencia." },
    ],
  },
  {
    title: { en: "A thought to carry with you", es: "Una reflexión para llevar contigo" },
    paragraphs: [
      { en: "My hope is that when someone encounters my work—through a curriculum, group, training, or resource—they leave with something that belongs to them:", es: "Mi esperanza es que cuando alguien encuentre mi trabajo—mediante un currículo, grupo, capacitación o recurso—se lleve algo que le pertenezca:" },
      { en: "A deeper understanding of themselves. A renewed sense of possibility.", es: "Una comprensión más profunda de sí mismo. Un sentido renovado de posibilidad." },
    ],
    emphasis: [{ en: "“I can do this.”", es: "“Puedo hacerlo.”" }],
  },
];

const AboutPage: React.FC = () => {
  const { i18n } = useTranslation();
  const spanish = (i18n.resolvedLanguage || i18n.language || "en").startsWith("es");

  return (
    <Box component="main" sx={{ minHeight: "100dvh", bgcolor: "#fcfbfe", color: BLUE }}>
      <Box sx={{ position: "relative", overflow: "hidden", bgcolor: BLUE, color: "#fff" }}>
        <Box sx={{ position: "absolute", inset: 0, opacity: .16, backgroundImage: "url(/landing-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <Container maxWidth="lg" sx={{ position: "relative", py: { xs: 7, md: 10 }, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.15fr .85fr" }, alignItems: "center", gap: { xs: 5, md: 8 } }}>
          <Box>
            <Typography sx={{ color: "#d7bdf1", fontSize: 14, fontWeight: 800, letterSpacing: 2.2, textTransform: "uppercase" }}>{spanish ? "Acerca de" : "About"}</Typography>
            <Typography component="h1" sx={{ mt: 1, fontFamily: SERIF, fontSize: { xs: 43, sm: 52, md: 56, lg: 60 }, fontWeight: 500, lineHeight: 1.03, letterSpacing: "-.02em", whiteSpace: { md: "nowrap" } }}>Claudia A. Gonzalez</Typography>
            <Typography sx={{ mt: 2.5, maxWidth: 720, color: "#d7bdf1", fontSize: { xs: 14, md: 17 }, lineHeight: 1.55, fontWeight: 800, letterSpacing: .45, textTransform: "uppercase" }}>
              {spanish ? "Consejera clínica de salud mental • Especialista en duelo • Facilitadora de grupos • Investigadora • Desarrolladora de currículos • Fundadora de KIMORAH LIFE" : "Clinical Mental Health Counselor • Bereavement Specialist • Group Facilitator • Researcher • Curriculum Developer • Founder of KIMORAH LIFE"}
            </Typography>
            <Typography sx={{ mt: 3.5, maxWidth: 650, fontSize: { xs: 17, md: 19 }, lineHeight: 1.7 }}>{spanish ? "Acompaño a personas, familias y comunidades durante el duelo, la sanación y las transiciones más significativas de la vida." : "I support individuals, families, and communities through grief, healing, and life’s most meaningful transitions."}</Typography>
            <Typography sx={{ mt: 1.5, maxWidth: 650, fontSize: { xs: 17, md: 19 }, lineHeight: 1.7 }}>{spanish ? "Mi trabajo se fundamenta en la compasión, las prácticas informadas por la evidencia y un profundo respeto por toda la experiencia humana." : "My work is grounded in compassion, evidence-informed practices, and a deep respect for the whole human experience."}</Typography>
          </Box>
          <Box role="img" aria-label={spanish ? "Retrato de Claudia A. Gonzalez" : "Portrait of Claudia A. Gonzalez"} sx={{ minHeight: { xs: 300, md: 430 }, borderRadius: "52% 48% 46% 54% / 42% 42% 58% 58%", border: "7px solid rgba(208,184,236,.75)", backgroundImage: "url(/images/claudia-gonzalez-portrait.png)", backgroundSize: "cover", backgroundPosition: "center 38%", backgroundRepeat: "no-repeat", boxShadow: "0 25px 55px rgba(5,4,30,.35)" }} />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, bgcolor: LAVENDER, border: "1px solid #e8e0f2", display: "grid", gridTemplateColumns: { xs: "1fr", md: ".42fr 1fr" }, gap: 3 }}>
          <Typography component="h2" sx={{ fontFamily: SERIF, color: PURPLE, fontSize: { xs: 29, md: 35 }, fontWeight: 600, textTransform: "uppercase" }}>{spanish ? "Mi filosofía" : "My philosophy"}</Typography>
          <Box><Typography sx={{ fontSize: 18, lineHeight: 1.7 }}>{spanish ? "Creo que la sanación crea un efecto expansivo. Comienza con la persona. Cuando nos reconectamos con nuestra capacidad para sanar, podemos cuidarnos mejor, apoyar a otros y contribuir a comunidades más fuertes, saludables y conectadas." : "I believe healing creates a ripple effect. It begins with the individual. As people reconnect with their own capacity to heal, they become better equipped to care for themselves, support others, and contribute to stronger, healthier, and more connected communities."}</Typography><Typography sx={{ mt: 2, fontSize: 18, lineHeight: 1.7 }}>{spanish ? "Mi trabajo honra toda la experiencia humana: mente, cuerpo, relaciones, valores, cultura, significado y las dimensiones espirituales que puedan ser importantes para cada persona." : "My work honors the whole human experience—mind, body, relationships, values, culture, meaning, and the spiritual or soulful dimensions that may hold significance for each person."}</Typography></Box>
        </Box>

        <Typography component="h2" sx={{ my: { xs: 5, md: 6 }, display: "flex", alignItems: "center", gap: 2, fontFamily: SERIF, color: PURPLE, fontSize: { xs: 28, md: 35 }, fontWeight: 600, textAlign: "center", textTransform: "uppercase", "&::before, &::after": { content: '""', flex: 1, height: "1px", bgcolor: "#d9cde8" } }}>{spanish ? "Trayectoria profesional" : "Professional background"}</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", lg: "repeat(4,1fr)" }, gap: 0 }}>
          {backgroundItems.map((item, index) => <Box key={item.title.en} sx={{ px: { xs: 1, md: 3 }, py: 2, borderLeft: { lg: index ? "1px solid #ded5e9" : 0 } }}><Typography sx={{ minHeight: { lg: 92 }, fontFamily: SERIF, color: PURPLE, fontSize: 21, lineHeight: 1.2, fontWeight: 600 }}>{copy(spanish, item.title)}</Typography><Typography sx={{ mt: { xs: 2, lg: 0 }, lineHeight: 1.65, color: "#444257" }}>{copy(spanish, item.body)}</Typography><Typography sx={{ mt: 2, lineHeight: 1.65, color: "#444257" }}>{copy(spanish, item.note)}</Typography></Box>)}
        </Box>

        <Box sx={{ mt: 5, display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2,1fr)" }, gap: 2.5 }}>
          {infoCards.map((card, index) => <Box key={card.title.en} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: "1px solid #e8e0f2", bgcolor: LAVENDER, minHeight: 280 }}><Typography component="h3" sx={{ fontFamily: SERIF, color: PURPLE, fontSize: 27, fontWeight: 600, textTransform: "uppercase" }}>{copy(spanish, card.title)}</Typography>{card.paragraphs.map((paragraph) => <Typography key={paragraph.en} sx={{ mt: 1.5, lineHeight: 1.65, color: "#444257" }}>{copy(spanish, paragraph)}</Typography>)}{card.emphasis?.map((line) => <Typography key={line.en} sx={{ mt: 1.5, fontFamily: SERIF, color: PURPLE, fontSize: line.en.includes("can do") ? 34 : 18, lineHeight: 1.35, fontWeight: 600, fontStyle: line.en.includes("can do") ? "italic" : "normal" }}>{copy(spanish, line)}</Typography>)}{index === 2 && <Button endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: 2.5, px: 2.5, py: 1, borderRadius: 99, bgcolor: PURPLE, color: "#fff", textTransform: "none", "&:hover": { bgcolor: "#3f1f68" } }}>{spanish ? "Conectar con Claudia" : "Connect with Claudia"}</Button>}</Box>)}
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;
