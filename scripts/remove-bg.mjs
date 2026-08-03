import { removeBackground } from "@imgly/background-removal-node"
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const input = process.argv[2]
const output = process.argv[3]

if (!input || !output) {
  console.error("Usage: node scripts/remove-bg.mjs <input> <output>")
  process.exit(1)
}

const abs = path.resolve(input)
const buf = await readFile(abs)
const blob = new Blob([buf], { type: "image/png" })

console.log("[remove-bg] processing", abs)
const result = await removeBackground(blob)
const outBuf = Buffer.from(await result.arrayBuffer())
await writeFile(path.resolve(output), outBuf)
console.log("[remove-bg] wrote", output, outBuf.length, "bytes")
