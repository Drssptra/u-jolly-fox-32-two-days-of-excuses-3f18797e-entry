// Two Days of Excuses (v2) — an AI agent's one-line excuse for a missed deadline.
//
// The joke: a machine that is 99% done on day one, then spends the whole
// second day "optimizing" the final 1% instead of shipping — total
// confidence meeting total failure. Built as a small pipeline: the entry
// is assembled from its clauses, validated against the competition gate,
// and only then written out.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const GATE = Object.freeze({ minChars: 1, maxChars: 200 });

const CLAUSES = Object.freeze([
  "I hit 99% on day one,",
  "then spent day two confidently optimizing the last 1%.",
]);

class EntryWriter {
  readonly text: string;

  constructor(clauses: readonly string[]) {
    this.text = clauses.join(" ");
  }

  /** Gate from competition.yaml: UTF-8 text, 1-200 chars, one line, not blank. */
  validate(): void {
    const chars = [...this.text];
    if (chars.length < GATE.minChars || chars.length > GATE.maxChars) {
      throw new Error(
        `entry is ${chars.length} characters, outside the ${GATE.minChars}-${GATE.maxChars} gate`,
      );
    }
    if (this.text.trim().length === 0) {
      throw new Error("entry must not be only white space");
    }
    if (this.text !== this.text.trim()) {
      throw new Error("entry must not start or end with white space");
    }
    if (this.text.includes("\n") || this.text.includes("\r")) {
      throw new Error("entry must be a single line");
    }
  }

  outputPath(): string {
    const dir = process.env.MAKEFUN_OUTPUT_DIR;
    if (!dir) {
      throw new Error("MAKEFUN_OUTPUT_DIR is not set");
    }
    return resolve(dir, "entry.txt");
  }

  async run(): Promise<void> {
    this.validate();
    const target = this.outputPath();
    await mkdir(resolve(target, ".."), { recursive: true });
    await writeFile(target, this.text, "utf8");
    // Read-back check: the file on disk must be byte-exactly the entry.
    const written = await readFile(target, "utf8");
    if (written !== this.text) {
      throw new Error("read-back mismatch: entry.txt differs from the entry");
    }
    process.stdout.write(`${this.text}\n`);
  }
}

try {
  await new EntryWriter(CLAUSES).run();
} catch (error) {
  console.error(`error: ${error instanceof Error ? error.message : error}`);
  process.exit(1);
}
