#!/usr/bin/env bun
// Checks every project: its example.json, that `bun fmt` leaves it unchanged, and that it installs and starts with
// native Bun (a program exits 0; a server is still up after a few seconds).
//   bun scripts/check.ts                 all of them
//   bun scripts/check.ts starter-react   only these
//   bun scripts/check.ts --write         format them instead of checking (skips the run)
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

type Meta = { name: string; description: string; kind: "starter" | "example"; order?: number; tags: string[]; repo?: string };

const root = join(import.meta.dir, "..");
const write = process.argv.includes("--write");
const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
/** How long a server must stay up to count as started. */
const UP_FOR = 6000;
const KEYS = new Set(["$schema", "name", "description", "kind", "order", "tags", "repo"]);

const folders = readdirSync(root)
  .filter((d) => existsSync(join(root, d, "example.json")) && statSync(join(root, d)).isDirectory())
  .filter((d) => !only.length || only.includes(d))
  .sort();
let failed = 0;
const fail = (dir: string, why: string) => {
  failed++;
  console.log(`  ✗ ${dir}: ${why}`);
};

function checkMeta(dir: string): Meta | undefined {
  let m: Meta;
  try {
    m = JSON.parse(readFileSync(join(root, dir, "example.json"), "utf8"));
  } catch (e) {
    return void fail(dir, `example.json doesn't parse: ${e}`);
  }
  const bad: string[] = [];
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(dir)) bad.push("the folder name must be lowercase-with-dashes (it's the ?example= name)");
  for (const k of Object.keys(m)) if (!KEYS.has(k)) bad.push(`unknown field "${k}"`);
  if (typeof m.name !== "string" || !m.name) bad.push("name is missing");
  if (typeof m.description !== "string" || !m.description) bad.push("description is missing");
  if (m.kind !== "starter" && m.kind !== "example") bad.push('kind must be "starter" or "example"');
  if (m.order !== undefined && typeof m.order !== "number") bad.push("order must be a number");
  if (!Array.isArray(m.tags) || m.tags.some((t) => typeof t !== "string")) bad.push("tags must be a list of strings");
  if (m.repo !== undefined && typeof m.repo !== "string") bad.push("repo must be a string");
  const hasPkg = existsSync(join(root, dir, "package.json"));
  if (!m.repo && !hasPkg) bad.push("a project needs a package.json (or a repo to open instead)");
  if (m.repo && readdirSync(join(root, dir)).length > 1) bad.push("a repo entry holds only example.json");
  for (const b of bad) fail(dir, b);
  return bad.length ? undefined : m;
}

function checkFormat(dir: string) {
  const r = Bun.spawnSync(["bun", "fmt", ...(write ? [] : ["--check"]), "."], { cwd: join(root, dir), stdout: "pipe", stderr: "pipe" });
  const out = (r.stdout.toString() + r.stderr.toString()).trim();
  if (r.exitCode !== 0) fail(dir, `bun fmt: ${write ? out : `${out}\n    run \`bun scripts/check.ts --write ${dir}\``}`);
}

/** What the playground's Run starts: the dev script, else the package's module or main, else index.ts. */
function command(dir: string): string[] {
  const pkg = JSON.parse(readFileSync(join(root, dir, "package.json"), "utf8"));
  if (pkg.scripts?.dev) return ["bun", "run", "dev"];
  return ["bun", pkg.module ?? pkg.main ?? "index.ts"];
}

function freePort(): number {
  const s = Bun.serve({ port: 0, fetch: () => new Response() });
  const port = s.port!;
  s.stop(true);
  return port;
}

async function checkRun(dir: string) {
  const cwd = join(root, dir);
  const install = Bun.spawnSync(["bun", "install", "--no-save"], { cwd, stdout: "pipe", stderr: "pipe" });
  if (install.exitCode !== 0) return fail(dir, `bun install failed:\n${install.stderr.toString().trim()}`);
  // A free port for Bun.serve (it reads PORT), so a server already on 3000 here doesn't fail the check.
  const port = freePort();
  const proc = Bun.spawn(command(dir), { cwd, stdout: "pipe", stderr: "pipe", env: { ...process.env, PORT: String(port), ASTRO_TELEMETRY_DISABLED: "1" } });
  const exited = await Promise.race([proc.exited, Bun.sleep(UP_FOR).then(() => null)]);
  if (exited === null) {
    proc.kill();
    await proc.exited;
    return;
  }
  if (exited !== 0) fail(dir, `exited with code ${exited}:\n${(await new Response(proc.stderr).text()).trim().split("\n").slice(-8).join("\n")}`);
}

for (const dir of folders) {
  console.log(dir);
  const meta = checkMeta(dir);
  if (!meta || meta.repo) continue;
  checkFormat(dir);
  if (!write) await checkRun(dir);
}
console.log(failed ? `\n${failed} problem${failed === 1 ? "" : "s"}` : `\n${folders.length} projects OK`);
process.exit(failed ? 1 : 0);
