import sharp from "../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js"
import path from "node:path"

const input = process.argv[2]
const output = process.argv[3]

const src = path.resolve(input)
const img = sharp(src)
const meta = await img.metadata()
console.log("[crop] input", meta.width, "x", meta.height)

// 1) Remove the top band that contains the baked-in "Кот-коуч" caption.
const topCut = Math.round((meta.height ?? 1024) * 0.24)
const region = {
  left: 0,
  top: topCut,
  width: meta.width ?? 1024,
  height: (meta.height ?? 1024) - topCut,
}

// Pass 1: crop off the top caption band.
const cropped = await sharp(src).extract(region).png().toBuffer()

// Pass 2: trim the surrounding fully-transparent pixels to frame the cat tightly.
const trimmed = await sharp(cropped).trim({ threshold: 10 }).png().toBuffer()

const out = await sharp(trimmed).metadata()
console.log("[crop] output", out.width, "x", out.height)
await sharp(trimmed).toFile(path.resolve(output))
console.log("[crop] wrote", output)
