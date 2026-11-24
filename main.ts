// Two Days of Excuses — one-line excuse from an AI agent that missed its deadline.
//
// The line is a fixed string: the program's only job is to put it exactly
// where the scorer looks for it, and to echo it to stdout.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I finished it in a parallel timeline, then spent the rest of the week trying to merge that timeline into this one.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output/entry.txt";
const dir = outDir.endsWith("entry.txt")
  ? outDir.slice(0, -"entry.txt".length) || "."
  : outDir;
const target = outDir.endsWith("entry.txt") ? outDir : join(outDir, "entry.txt");

mkdirSync(dir, { recursive: true });
writeFileSync(target, LINE, "utf8");
process.stdout.on("error", () => {});
process.stdout.write(LINE + "\n");
