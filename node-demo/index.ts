import crypto from "node:crypto";
import { EventEmitter, once } from "node:events";
import fs from "node:fs";
import fsp from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import util from "node:util";
import lib from "./lib.js";

const dir = "/tmp/node-demo-out";
const out = (label: string, value: unknown) =>
  console.log(
    `${label}: ${typeof value === "string" ? value : JSON.stringify(value)}`,
  );

// fs, sync
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(`${dir}/sub`, { recursive: true });
fs.writeFileSync(`${dir}/a.txt`, "hello ");
fs.appendFileSync(`${dir}/a.txt`, "world");
out("readFileSync", fs.readFileSync(`${dir}/a.txt`, "utf8"));
out("readFileSync buffer", fs.readFileSync(`${dir}/a.txt`).toString("hex"));
const st = fs.statSync(`${dir}/a.txt`);
out("stat file", [st.isFile(), st.isDirectory(), st.size, st.mtimeMs > 0]);
out("stat dir", fs.statSync(`${dir}/sub`).isDirectory());
out(
  "stat missing",
  fs.statSync(`${dir}/nope`, { throwIfNoEntry: false }) === undefined,
);
fs.writeFileSync(`${dir}/sub/b.bin`, new Uint8Array([1, 2, 3]));
out(
  "readdir",
  fs
    .readdirSync(dir, { withFileTypes: true })
    .map((d) => `${d.name}${d.isDirectory() ? "/" : ""}`)
    .sort(),
);
out("readdir names", fs.readdirSync(dir).sort());
out(
  "realpath",
  fs.realpathSync.native(`${dir}/a.txt`).endsWith("node-demo-out/a.txt"),
);
out("exists", [fs.existsSync(`${dir}/a.txt`), fs.existsSync(`${dir}/zzz`)]);
fs.renameSync(`${dir}/a.txt`, `${dir}/c.txt`);
fs.copyFileSync(`${dir}/c.txt`, `${dir}/d.txt`);
out("after rename", fs.readdirSync(dir).sort());
const fd = fs.openSync(`${dir}/e.txt`, "w");
fs.writeSync(fd, "abc");
fs.writeSync(fd, "def");
fs.closeSync(fd);
const buf = Buffer.alloc(4);
const rfd = fs.openSync(`${dir}/e.txt`, "r");
out("readSync", [fs.readSync(rfd, buf, 0, 4, 1), buf.toString()]);
fs.closeSync(rfd);
try {
  fs.readFileSync(`${dir}/missing.txt`);
} catch (e) {
  const err = e as NodeJS.ErrnoException;
  out("ENOENT", [
    err.code,
    err.syscall,
    err.errno,
    err.message.replace(dir, "<dir>"),
  ]);
}
try {
  fs.mkdirSync(`${dir}/sub`);
} catch (e) {
  out("EEXIST", (e as NodeJS.ErrnoException).code);
}
try {
  fs.readFileSync(`${dir}/sub`);
} catch (e) {
  out("EISDIR", (e as NodeJS.ErrnoException).code);
}

// fs/promises
await fsp.writeFile(`${dir}/p.json`, JSON.stringify({ n: 1 }));
out("promises", JSON.parse(await fsp.readFile(`${dir}/p.json`, "utf8")));
out("promises stat", (await fsp.stat(`${dir}/p.json`)).size);
await fsp.rm(`${dir}/p.json`);
await fsp.access(`${dir}/p.json`).catch((e) => out("access", e.code));
await new Promise<void>((resolve) =>
  fs.readFile(
    `${dir}/c.txt`,
    "utf8",
    (err, data) => (out("callback", [err, data]), resolve()),
  ),
);
fs.rmSync(dir, { recursive: true });
out("cleaned", fs.existsSync(dir));

// path / url
out("path.join", path.join("/a", "b", "../c", "d.txt"));
out("path.resolve", path.resolve("/x/y", "../z"));
out("path.parse", path.parse("/home/u/file.tar.gz"));
out("path.relative", path.relative("/a/b/c", "/a/d"));
out("path.posix", path.posix === path);
out("fileURLToPath", path.basename(fileURLToPath(import.meta.url)));
out("pathToFileURL", pathToFileURL("/a b/c.txt").href);
out("import.meta", [
  path.basename(import.meta.filename),
  import.meta.dirname === path.dirname(import.meta.filename),
]);

// events, Buffer, crypto, os, util, module, process
const ee = new EventEmitter();
ee.on("x", (a: number, b: number) => out("event", a + b));
ee.emit("x", 1, 2);
setTimeout(() => ee.emit("y", "done"), 1);
out("events.once", await once(ee, "y"));
out("Buffer", [
  Buffer.from("héllo").toString("base64"),
  Buffer.from("héllo").length,
  Buffer.concat([Buffer.from("a"), Buffer.from("b")]).toString(),
]);
out("sha256", crypto.createHash("sha256").update("x").digest("hex"));
out("md5/sha1", [
  crypto.createHash("md5").update("x").digest("base64"),
  crypto.createHash("sha1").update("x").update("y").digest("hex"),
]);
out("hmac", crypto.createHmac("sha256", "k").update("x").digest("hex"));
out("random", [crypto.randomBytes(8).length, crypto.randomUUID().length]);
out("os", [
  typeof os.platform(),
  os.EOL === "\n",
  typeof os.homedir(),
  Array.isArray(os.cpus()),
]);
out("util.format", util.format("%s:%d:%j", "a", 42, { x: 1 }));
out(
  "util.inspect",
  util.inspect({ a: 1, b: [1, 2, { c: new Map([[1, 2]]) }], s: "x" }),
);
out(
  "util.promisify",
  await util.promisify((x: number, cb: (e: null, r: number) => void) =>
    cb(null, x * 2),
  )(21),
);
out(
  "isDeepStrictEqual",
  util.isDeepStrictEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }),
);
const require = createRequire(import.meta.url);
out("createRequire", require("path").join("a", "b"));
out("cjs lib", [lib.join("a", "b"), lib.describe(3)]);
out("process", [
  typeof process.versions.node,
  process.platform === os.platform(),
  process.cwd().length > 0,
  process.stdout.isTTY === undefined || process.stdout.isTTY === false,
]);
process.stdout.write("stdout line\n");
