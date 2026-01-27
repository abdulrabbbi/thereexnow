const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const generatedFile = path.join(repoRoot, "src", "graphql", "generated.tsx");
const graphqlRoot = path.join(repoRoot, "src", "graphql");

function getLatestMtimeMs(dir, extension) {
  let latest = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "generated") continue;
      latest = Math.max(latest, getLatestMtimeMs(entryPath, extension));
      continue;
    }

    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(extension)) continue;

    const { mtimeMs } = fs.statSync(entryPath);
    latest = Math.max(latest, mtimeMs);
  }
  return latest;
}

function runCodegen() {
  const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(npmCmd, ["run", "generate"], {
    cwd: repoRoot,
    stdio: "inherit",
  });

  process.exit(result.status ?? 1);
}

if (!fs.existsSync(generatedFile)) {
  console.log("[codegen] src/graphql/generated.tsx is missing; generating...");
  runCodegen();
}

try {
  const generatedMtimeMs = fs.statSync(generatedFile).mtimeMs;
  const latestDocMtimeMs = getLatestMtimeMs(graphqlRoot, ".gql");

  if (latestDocMtimeMs > generatedMtimeMs) {
    console.log("[codegen] GraphQL documents changed; regenerating...");
    runCodegen();
  }
} catch {
  console.log("[codegen] Failed to stat GraphQL files; generating...");
  runCodegen();
}
