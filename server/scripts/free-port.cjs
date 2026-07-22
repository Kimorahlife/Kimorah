/**
 * predev helper: free the dev port before the server starts, so a leftover
 * process from a previous run can't cause `EADDRINUSE: address already in use`.
 *
 * No-op when the port is already free, and never fails the start (any error is
 * swallowed) — worst case you just see the original EADDRINUSE from `dev`.
 * Cross-platform (Windows netstat/taskkill, Unix lsof/kill).
 */
const { execSync } = require("child_process");

const port = process.env.PORT || 3001;
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

/**
 * Kill lingering `tsx watch src/index.ts` supervisors for THIS server. A watch
 * supervisor respawns the child (and re-grabs the port) after the listener is
 * killed, so freeing just the port isn't enough — we have to stop the watcher.
 */
function killStaleWatchers() {
  try {
    if (isWin) {
      const ps =
        `Get-CimInstance Win32_Process -Filter "Name='node.exe'" | ` +
        `Where-Object { $_.CommandLine -match 'tsx' -and $_.CommandLine -match 'src.index.ts' } | ` +
        `ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`;
      execSync(`powershell -NoProfile -Command "${ps.replace(/"/g, '\\"')}"`, { stdio: "ignore" });
    } else {
      execSync(`pkill -f "tsx watch src/index.ts"`, { stdio: "ignore" });
    }
  } catch {
    // nothing matched, or the tool isn't available — fine
  }
}

killStaleWatchers();
const pids = pidsOnPort(port);
if (!pids.length) {
  console.log(`✓ port ${port} is free`);
} else {
  for (const pid of pids) {
    if (kill(pid)) console.log(`✓ freed port ${port} — stopped stale PID ${pid}`);
  }
}
