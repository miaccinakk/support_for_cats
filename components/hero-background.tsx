"use client"

import { useEffect, useRef } from "react"

/**
 * Lightweight, dependency-free interactive backdrop: a slowly spinning sphere
 * built from many connected points. It auto-rotates and eases toward the
 * mouse position for a subtle "interactive" feel. Pure canvas, no libraries.
 */
export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const accent = "224, 122, 60" // primary orange (rgb)
    const N = 260
    const points: { x: number; y: number; z: number }[] = []
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2
      const r = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = golden * i
      points.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r })
    }

    // Precompute connected pairs (constant on a rigid sphere).
    const pairs: [number, number][] = []
    const threshold = 0.32
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = points[i].x - points[j].x
        const dy = points[i].y - points[j].y
        const dz = points[i].z - points[j].z
        if (dx * dx + dy * dy + dz * dz < threshold * threshold) pairs.push([i, j])
      }
    }

    let width = 0
    let height = 0
    let spin = 0
    let rotX = 0
    let rotY = 0
    let targetRotX = 0
    let targetRotY = 0
    const mouse = { x: 0.5, y: 0.5 }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    function resize() {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    function onMove(e: MouseEvent) {
      mouse.x = e.clientX / window.innerWidth
      mouse.y = e.clientY / window.innerHeight
    }

    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", onMove)

    const projX = new Float32Array(N)
    const projY = new Float32Array(N)
    const depth = new Float32Array(N)
    let raf = 0

    function frame() {
      spin += reduce ? 0.0006 : 0.0022
      targetRotY = (mouse.x - 0.5) * 1.1
      targetRotX = (mouse.y - 0.5) * 0.9
      rotY += (targetRotY - rotY) * 0.05
      rotX += (targetRotX - rotX) * 0.05

      const cx = width / 2
      const cy = height / 2
      const radius = Math.min(width, height) * 0.46
      const persp = 2.4

      const totalY = spin + rotY
      const cosY = Math.cos(totalY)
      const sinY = Math.sin(totalY)
      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)

      for (let i = 0; i < N; i++) {
        const p = points[i]
        // rotate around Y
        const x1 = p.x * cosY + p.z * sinY
        const z1 = -p.x * sinY + p.z * cosY
        // rotate around X
        const y2 = p.y * cosX - z1 * sinX
        const z2 = p.y * sinX + z1 * cosX
        const s = persp / (persp - z2)
        projX[i] = cx + x1 * radius * s
        projY[i] = cy + y2 * radius * s
        depth[i] = (z2 + 1) / 2 // 0 (back) → 1 (front)
      }

      ctx.clearRect(0, 0, width, height)

      // lines
      for (let k = 0; k < pairs.length; k++) {
        const a = pairs[k][0]
        const b = pairs[k][1]
        const d = (depth[a] + depth[b]) / 2
        ctx.strokeStyle = `rgba(${accent}, ${0.05 + d * 0.2})`
        ctx.lineWidth = 0.6 + d * 0.6
        ctx.beginPath()
        ctx.moveTo(projX[a], projY[a])
        ctx.lineTo(projX[b], projY[b])
        ctx.stroke()
      }

      // points
      for (let i = 0; i < N; i++) {
        const d = depth[i]
        ctx.fillStyle = `rgba(${accent}, ${0.25 + d * 0.5})`
        ctx.beginPath()
        ctx.arc(projX[i], projY[i], 0.7 + d * 1.6, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = window.requestAnimationFrame(frame)
    }
    raf = window.requestAnimationFrame(frame)

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
    />
  )
}
