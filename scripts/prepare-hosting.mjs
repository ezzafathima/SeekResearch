/**
 * Synchronizes SeekResearch runtime files from the root source-of-truth into
 * `public/` for Firebase Hosting and verifies exact content & path integrity.
 *
 * Usage:
 *   node scripts/prepare-hosting.mjs               # Sync approved files & verify
 *   node scripts/prepare-hosting.mjs --verify-only # Verify public/ without modifying files
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

export const APPROVED_RUNTIME_FILES = Object.freeze([
  "index.html",
  "css/seekresearch.css",
  "js/seekresearch-app.js",
  "js/firebase-config.js",
  "js/firebase-auth.js",
  "js/firebase-db.js",
  "js/firebase-portal.js",
  "js/firebase-portal-view.js"
]);

const FORBIDDEN_PATTERNS = [
  /\.bak$/i,
  /\.log$/i,
  /(^|\/)package(-lock)?\.json$/i,
  /(^|\/)firestore\.(rules|indexes\.json)$/i,
  /(^|\/)(tests|scripts|node_modules|ngo-site|todo-backup|perfume-[^/]+)\//i,
  /(^|\/)(seekresearch|aerostride|aether-chrome|shader-demo)\.html$/i,
  /(^|\/)\.[^/]+/
];

function sha256File(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function assertSourcesExist(rootDir, files) {
  for (const relPath of files) {
    const srcPath = path.join(rootDir, relPath);
    if (!fs.existsSync(srcPath) || !fs.statSync(srcPath).isFile()) {
      throw new Error(`Missing required source-of-truth file: ${relPath}`);
    }
  }
}

function collectRelativeFiles(baseDir, currentDir = baseDir) {
  if (!fs.existsSync(currentDir)) return [];
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectRelativeFiles(baseDir, fullPath));
    } else if (entry.isFile()) {
      results.push(path.relative(baseDir, fullPath).replace(/\\/g, "/"));
    }
  }
  return results.sort();
}

export function syncPublicDirectory(rootDir = ROOT_DIR, publicDir = PUBLIC_DIR, files = APPROVED_RUNTIME_FILES) {
  const resolvedRoot = path.resolve(rootDir);
  const resolvedPublic = path.resolve(publicDir);
  if (resolvedPublic === resolvedRoot || path.basename(resolvedPublic) !== "public") {
    throw new Error(`Refusing unsafe public directory target: ${resolvedPublic}`);
  }

  assertSourcesExist(resolvedRoot, files);

  // Rebuild only public/ from scratch so stale logs, backups, or unrelated files cannot remain.
  fs.rmSync(resolvedPublic, { recursive: true, force: true });
  fs.mkdirSync(resolvedPublic, { recursive: true });

  for (const relPath of files) {
    const srcPath = path.join(resolvedRoot, relPath);
    const destPath = path.join(resolvedPublic, relPath);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
  }
}

function verifyLocalReferences(publicDir) {
  const htmlPath = path.join(publicDir, "index.html");
  const html = fs.readFileSync(htmlPath, "utf8");
  const checked = [];

  for (const match of html.matchAll(/(?:src|href)=["'](\.[^"']+|assets\/[^"']+|css\/[^"']+|js\/[^"']+)["']/g)) {
    const refPath = match[1];
    const target = path.resolve(publicDir, refPath);
    if (!fs.existsSync(target) || !target.startsWith(publicDir + path.sep)) {
      throw new Error(`Broken or escaped HTML asset reference in public/index.html: ${refPath}`);
    }
    checked.push(`index.html -> ${refPath}`);
  }

  const publicJsFiles = collectRelativeFiles(publicDir).filter((f) => f.endsWith(".js"));
  for (const relJs of publicJsFiles) {
    const fullJs = path.join(publicDir, relJs);
    const src = fs.readFileSync(fullJs, "utf8");
    for (const match of src.matchAll(/from\s+["'](\.[^"']+)["']/g)) {
      const importRef = match[1];
      const resolved = path.resolve(path.dirname(fullJs), importRef);
      if (!fs.existsSync(resolved) || !resolved.startsWith(publicDir + path.sep)) {
        throw new Error(`Broken or escaped JS import in public/${relJs}: ${importRef}`);
      }
      checked.push(`${relJs} -> ${importRef}`);
    }
  }

  return checked;
}

export function verifyPublicHosting(rootDir = ROOT_DIR, publicDir = PUBLIC_DIR, files = APPROVED_RUNTIME_FILES) {
  const resolvedRoot = path.resolve(rootDir);
  const resolvedPublic = path.resolve(publicDir);

  assertSourcesExist(resolvedRoot, files);

  const firebaseJsonPath = path.join(resolvedRoot, "firebase.json");
  const firebaseCfg = JSON.parse(fs.readFileSync(firebaseJsonPath, "utf8"));
  if (firebaseCfg?.hosting?.public !== "public") {
    throw new Error(`Expected firebase.json hosting.public to equal "public", got "${firebaseCfg?.hosting?.public}"`);
  }

  const actualFiles = collectRelativeFiles(resolvedPublic);
  const expectedFiles = [...files].sort();

  for (const relPath of actualFiles) {
    if (FORBIDDEN_PATTERNS.some((rx) => rx.test(relPath))) {
      throw new Error(`Forbidden file detected in public/: ${relPath}`);
    }
  }

  const extraFiles = actualFiles.filter((f) => !expectedFiles.includes(f));
  const missingFiles = expectedFiles.filter((f) => !actualFiles.includes(f));
  if (extraFiles.length > 0 || missingFiles.length > 0) {
    throw new Error(
      `public/ file mismatch. Missing: [${missingFiles.join(", ")}], Unexpected: [${extraFiles.join(", ")}]`
    );
  }

  const verifiedHashes = [];
  for (const relPath of expectedFiles) {
    const srcHash = sha256File(path.join(resolvedRoot, relPath));
    const pubHash = sha256File(path.join(resolvedPublic, relPath));
    if (srcHash !== pubHash) {
      throw new Error(`Content hash mismatch for public/${relPath} vs root ${relPath}`);
    }
    verifiedHashes.push({ file: relPath, sha256: pubHash });
  }

  const verifiedRefs = verifyLocalReferences(resolvedPublic);
  return { verifiedHashes, verifiedRefs, actualFiles };
}

function main() {
  const verifyOnly = process.argv.includes("--verify-only");
  if (!verifyOnly) {
    syncPublicDirectory();
  }

  const report = verifyPublicHosting();
  console.log(
    `[prepare:hosting] ${verifyOnly ? "Verified (verify-only)" : "Synchronized & verified"} ${report.verifiedHashes.length} production files in public/:`
  );
  for (const entry of report.verifiedHashes) {
    console.log(`  OK ${entry.file} (sha256:${entry.sha256.slice(0, 12)}...)`);
  }
  console.log(`[prepare:hosting] Verified ${report.verifiedRefs.length} relative asset/import paths and confirmed firebase.json hosting.public === "public".`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (err) {
    console.error(`[prepare:hosting] FAILED: ${err.message}`);
    process.exit(1);
  }
}
