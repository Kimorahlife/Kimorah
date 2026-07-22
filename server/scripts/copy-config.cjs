/* Copies src/config/*.json into dist/config/ after tsc (tsc doesn't emit JSON). */
const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "..", "src", "config");
const outDir = path.join(__dirname, "..", "dist", "config");
fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(srcDir).filter((f) => f.endsWith(".json"))) {
  fs.copyFileSync(path.join(srcDir, f), path.join(outDir, f));
  console.log("copied config:", f);
}
