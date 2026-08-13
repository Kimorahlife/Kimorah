import React, { useState } from "react";
import { Box, Chip, Divider, Stack, Tab, Tabs, Typography } from "@mui/material";
import ContentField from "./ContentField";
import GroupList from "./GroupList";
import LocalizedList from "./LocalizedList";
import {
  CurriculumSection,
  CurriculumSession,
  SECTION_KEYS,
  SECTION_LABELS,
  SectionKey,
} from "../curriculum-types";

type TabKey = "introduction" | SectionKey | "closing";

/**
 * One session, laid out as the source document reads:
 *
 *   Introduction — title, Tema principal, and Session 1's Presentación
 *   Concepts … Processing — the five list-backed sections
 *   Closing    — Cierre psicoeducativo, Feedback, Enfoque terapéutico,
 *                Referencia clínica
 *
 * The last tab exists because the document carries four things after the
 * sections that are not lists at all: closing prose, a short feedback round,
 * the therapeutic modalities, and the clinical rationale.
 */
const SessionEditor: React.FC<{
  session: CurriculumSession;
  onChange: (next: CurriculumSession) => void;
  disabled?: boolean;
}> = ({ session, onChange, disabled = false }) => {
  const [tab, setTab] = useState<TabKey>("introduction");

  const setSection = (key: SectionKey, value: CurriculumSection) =>
    onChange({ ...session, sections: { ...session.sections, [key]: value } });

  const countOf = (key: SectionKey) =>
    (session.sections?.[key]?.groups ?? []).reduce((n, g) => n + (g.items?.length ?? 0), 0);

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: "1px solid", borderColor: "divider", mb: 2 }}
      >
        <Tab value="introduction" label="Introduction" sx={{ textTransform: "none" }} />
        {SECTION_KEYS.map((key) => (
          <Tab
            key={key}
            value={key}
            sx={{ textTransform: "none" }}
            label={
              <Stack direction="row" spacing={0.75} alignItems="center">
                <span>{SECTION_LABELS[key].en}</span>
                {countOf(key) > 0 && <Chip size="small" label={countOf(key)} sx={{ height: 18, fontSize: 11 }} />}
              </Stack>
            }
          />
        ))}
        <Tab value="closing" label="Closing" sx={{ textTransform: "none" }} />
      </Tabs>

      {tab === "introduction" && (
        <Box>
          <ContentField
            label="Session title"
            value={session.title}
            onChange={(title) => onChange({ ...session, title })}
            required
            disabled={disabled}
          />
          <LocalizedList
            label="Main topic"
            helper="The themes listed under “Tema principal”, one per line — e.g. Vulnerabilidad · Trauma vicario · “¿Y ahora qué?”"
            values={session.mainTopic}
            onChange={(mainTopic) => onChange({ ...session, mainTopic })}
            addLabel="Add theme"
            itemLabel="Theme"
            disabled={disabled}
          />

          <Divider sx={{ my: 2 }} />

          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
            PARTICIPANT PRESENTATION
          </Typography>
          <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mb: 1.5 }}>
            The opening round. Only the first session uses this — leave it empty elsewhere.
          </Typography>
          <ContentField
            label="How the round is introduced"
            value={session.presentation.body}
            onChange={(body) => onChange({ ...session, presentation: { ...session.presentation, body } })}
            multiline
            disabled={disabled}
          />
          <LocalizedList
            label="Suggested questions"
            values={session.presentation.prompts}
            onChange={(prompts) => onChange({ ...session, presentation: { ...session.presentation, prompts } })}
            addLabel="Add question"
            itemLabel="Question"
            disabled={disabled}
          />
          <ContentField
            label="Reminder"
            value={session.presentation.reminder}
            onChange={(reminder) => onChange({ ...session, presentation: { ...session.presentation, reminder } })}
            multiline
            rows={2}
            disabled={disabled}
          />
        </Box>
      )}

      {SECTION_KEYS.includes(tab as SectionKey) && (
        <GroupList
          // Remount per section: the group list holds view state (which groups
          // are folded, whether a lone group is being named) that belongs to
          // one section and must not follow the author to the next tab.
          key={tab}
          section={tab as SectionKey}
          value={session.sections[tab as SectionKey]}
          onChange={(value) => setSection(tab as SectionKey, value)}
          disabled={disabled}
        />
      )}

      {tab === "closing" && (
        <Box>
          <ContentField
            label="Psychoeducational closing"
            value={session.closing}
            onChange={(closing) => onChange({ ...session, closing })}
            multiline
            rows={6}
            disabled={disabled}
          />
          <LocalizedList
            label="Feedback and closing on a positive note"
            helper="The short round that ends the session — e.g. “Una palabra con la que te vas hoy.”"
            values={session.feedback}
            onChange={(feedback) => onChange({ ...session, feedback })}
            addLabel="Add prompt"
            itemLabel="Prompt"
            disabled={disabled}
          />

          <Divider sx={{ my: 2 }} />

          <ContentField
            label="Therapeutic approach"
            value={session.therapeuticApproach}
            onChange={(therapeuticApproach) => onChange({ ...session, therapeuticApproach })}
            multiline
            rows={2}
            disabled={disabled}
          />
          <ContentField
            label="Clinical reference"
            value={session.clinicalReference}
            onChange={(clinicalReference) => onChange({ ...session, clinicalReference })}
            multiline
            rows={4}
            disabled={disabled}
          />
        </Box>
      )}
    </Box>
  );
};

export default SessionEditor;
