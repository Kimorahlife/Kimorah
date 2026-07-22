/**
 * predev helper: free the Vite dev port before the client starts, so a leftover
 * dev server from a previous run can't make Vite silently fall back to the next
 * port (5174, 5175, …) and serve a *second*, stale copy of the app. Paired with
 * `strictPort: true` in vite.config.ts, this keeps the client on exactly one URL.
 *
 * No-op when the port is already free, and never fails the start (any error is
 * swallowed). Cross-platform (Windows netstat/taskkill, Unix lsof/kill).
 */
const { execSync } = require("child_process");

const port = process.env.VITE_PORT || 5173;
const isWin = process.platform === "win32";

function pidsOnPort(p) {
  try {
    if (isWin) {
      const out = execSync("netstat -ano -p tcp", { encoding: "utf8" });
      const pids = new Set();
      for (const line of out.split(/\r?\n/)) {
        const cols = line.trim().split(/\s+/);
        if (cols.length < 5) continue;
        const [, local, , state, pid] = cols;
        if (!/LISTENING/i.test(state)) continue;
        if (!local.endsWith(`:${p}`)) continue;
        if (/^\d+$/.test(pid) && pid !== "0") pids.add(pid);
      }
      return [...pids];
    }
    const out = execSync(`lsof -ti tcp:${p} -sTCP:LISTEN`, { encoding: "utf8" });
    return out.split(/\s+/).filter(Boolean);
  } catch {
    return []; // nothing listening (or the tool isn't available)
  }
}

function kill(pid) {
  try {
    execSync(isWin ? `taskkill /PID ${pid} /F /T` : `kill -9 ${pid}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const pids = pidsOnPort(port);
if (!pids.length) {
  console.log(`✓ port ${port} is free`);
} else {
  for (const pid of pids) {
    if (kill(pid)) console.log(`✓ freed port ${port} — stopped stale PID ${pid}`);
  }
}
