import { useMemo, useState } from "react";
import { Button, Tooltip } from "@mui/material";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import TranslationReview from "./TranslationReview";
import { Lang, collectPairs } from "../translate";

const LANGUAGE_NAME: Record<Lang, string> = { en: "English", es: "Spanish" };

/**
 * Opens the translation review for whatever draft it is given.
 *
 * The label carries the count of untranslated lines so an author can see how
 * much is outstanding before spending anything, and reads "Review" instead once
 * everything has a translation — the dialog is equally the place to correct one.
 */
function TranslateButton<T>({
  value,
  onApply,
  to = "es",
  disabled = false,
}: {
  value: T;
  onApply: (next: T) => void;
  to?: Lang;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const { total, missing, stale } = useMemo(() => {
    const pairs = collectPairs(value, to);
    return {
      total: pairs.length,
      missing: pairs.filter((p) => !p.target).length,
      stale: pairs.filter((p) => p.stale).length,
    };
  }, [value, to]);

  // A stale line is the more urgent of the two: a blank is obviously missing,
  // whereas a translation that quietly stopped matching its English is not.
  const label = stale
    ? `${LANGUAGE_NAME[to]} needs review (${stale})`
    : missing
      ? `Translate to ${LANGUAGE_NAME[to]} (${missing})`
      : `Review ${LANGUAGE_NAME[to]}`;

  return (
    <>
      <Tooltip
        // Describes the button; without this the tooltip would replace its
        // visible label as the accessible name.
        describeChild
        title={
          total === 0
            ? "Write some content first."
            : stale
              ? `${stale} line${stale === 1 ? " has" : "s have"} changed in ${LANGUAGE_NAME[to === "es" ? "en" : "es"]} since the ${LANGUAGE_NAME[to]} was approved.`
              : missing
                ? `${missing} line${missing === 1 ? "" : "s"} have no ${LANGUAGE_NAME[to]} yet. You review every line before it is applied.`
                : `Every line has a translation. Open it to check or correct them.`
        }
      >
        <span>
          <Button
            size="small"
            color={stale ? "warning" : "primary"}
            startIcon={stale ? <WarningAmberRoundedIcon /> : <TranslateRoundedIcon />}
            onClick={() => setOpen(true)}
            disabled={disabled || total === 0}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            {label}
          </Button>
        </span>
      </Tooltip>

      <TranslationReview open={open} value={value} to={to} onApply={onApply} onClose={() => setOpen(false)} />
    </>
  );
}

export default TranslateButton;
