import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RefreshIcon from "@mui/icons-material/Refresh";
import { api } from "../../api";

const StatusRow = ({ ok, label, value }: { ok?: boolean; label: string; value: React.ReactNode }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.75 }}>
    <Box sx={{ width: 22, display: "flex", flexShrink: 0 }}>
      {ok === undefined ? null : ok ? (
        <CheckCircleIcon color="success" fontSize="small" />
      ) : (
        <CancelIcon color="error" fontSize="small" />
      )}
    </Box>
    <Typography sx={{ minWidth: 210, fontWeight: 600 }}>{label}</Typography>
    <Typography sx={{ color: "text.secondary", fontFamily: "monospace", fontSize: 13, wordBreak: "break-all" }}>
      {value}
    </Typography>
  </Box>
);

/**
 * Environment / connectivity self-check. Public page at /diagnostics.
 *
 * Shows the client's own config (API base URL, mode, origin) and calls the
 * server's CORS-open /api/health, which reports whether each required env var
 * is present (secret VALUES are never returned) and whether THIS browser's
 * origin passes the server's CORS policy — the fastest way to see if the two
 * sides are wired together correctly.
 */
const Diagnostics: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const apiBase = api.defaults.baseURL || "(same origin)";
  const mode = import.meta.env.MODE;
  const origin = window.location.origin;
  const viteApiBase = import.meta.env.VITE_API_BASE_URL || "(unset)";

  const run = useCallback(() => {
    setLoading(true);
    setError(null);
    setHealth(null);
    api
      .get("/api/health")
      .then((r) => setHealth(r.data))
      .catch((e) => setError(e?.message ?? "request failed"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    run();
  }, [run]);

  const cfg = health?.config ?? {};
  const cors = health?.cors ?? {};
  const isSet = (v: string) => typeof v === "string" && v !== "MISSING" && !v.startsWith("(unset");
  const clientApiOk = mode !== "production" || apiBase !== "(same origin)";

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Environment Diagnostics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Checks the client + server configuration and whether they can talk to each other.
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={run} disabled={loading}>
          Recheck
        </Button>
      </Box>

      {/* Client */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Client (this browser)
        </Typography>
        <StatusRow ok label="Page origin" value={origin} />
        <StatusRow
          ok={clientApiOk}
          label="API base URL"
          value={
            <>
              {apiBase}
              {!clientApiOk && "  ← production build with no VITE_API_BASE_URL (calls same-origin, will fail)"}
            </>
          }
        />
        <StatusRow label="VITE_API_BASE_URL" value={viteApiBase} />
        <StatusRow label="Mode" value={mode} />
      </Paper>

      {/* Server */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            Server ({apiBase})
          </Typography>
          {loading && <CircularProgress size={18} />}
          {health && <Chip label="reachable" color="success" size="small" />}
          {error && <Chip label="unreachable" color="error" size="small" />}
        </Box>

        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            Could not reach the server at <code>{apiBase}</code> — {error}.
            <br />
            This usually means the server is down/asleep, the API base URL is wrong, or the request was blocked
            before the diagnostics could load.
          </Alert>
        )}

        {health && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Connection
            </Typography>
            <StatusRow ok={health.db?.connected} label="Database" value={`${health.db?.state}${health.db?.name ? ` (${health.db.name})` : ""}`} />
            <StatusRow label="NODE_ENV" value={health.env} />

            <Divider sx={{ my: 1.5 }} />
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Server environment variables
            </Typography>
            <StatusRow ok={isSet(cfg.MONGO_URI)} label="MONGO_URI" value={cfg.MONGO_URI} />
            <StatusRow ok={isSet(cfg.JWT_SECRET)} label="JWT_SECRET" value={cfg.JWT_SECRET} />
            <StatusRow ok={isSet(cfg.ORIGIN_URL)} label="ORIGIN_URL" value={cfg.ORIGIN_URL} />
            <StatusRow label="PORT" value={cfg.PORT} />

            <Divider sx={{ my: 1.5 }} />
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              CORS (client ↔ server)
            </Typography>
            <StatusRow ok={cors.originAllowed} label="This origin allowed?" value={cors.originAllowed ? "yes" : "NO"} />
            <StatusRow label="Server ORIGIN_URL" value={cors.allowedOrigin ?? "MISSING"} />
            <StatusRow label="Your origin" value={cors.requestOrigin ?? origin} />
            {!cors.originAllowed && (
              <Alert severity="warning" sx={{ mt: 1.5 }}>
                {cors.note} Set the server's <code>ORIGIN_URL</code> to exactly <code>{cors.requestOrigin ?? origin}</code>.
              </Alert>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Diagnostics;
