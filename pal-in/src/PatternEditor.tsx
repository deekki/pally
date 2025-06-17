import React, { useEffect, useRef, useState } from 'react'
import type {
  LayerDefinition,
  PatternItem,
  PalletProject,
} from './data/interfaces'

interface Props {
  layer: LayerDefinition
  project: PalletProject
  onChange: (layer: LayerDefinition) => void
}
export default function PatternEditor({ layer, project, onChange }: Props) {
  const [items, setItems] = useState<PatternItem[]>(layer.pattern ?? [])
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [drag, setDrag] = useState<number | null>(null)
  const dragOffset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    setItems(layer.pattern ?? [])
  }, [layer])

  const save = (list: PatternItem[]) => {
    setItems(list)
    onChange({ ...layer, pattern: list })
  }

  const pxPerUnit = 300 / (project.dimensions.width + (project.overhang ?? 0))
  const palletLength = project.dimensions.length + (project.overhang ?? 0)
  const palletWidth = project.dimensions.width + (project.overhang ?? 0)

  const boxL = project.productDimensions.length
  const boxW = project.productDimensions.width

  const clientToCoord = (e: React.PointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect()
    const x = (e.clientX - rect.left) / pxPerUnit
    const y = (e.clientY - rect.top) / pxPerUnit
    return { x, y }
  }

  const onDown = (idx: number) => (e: React.PointerEvent) => {
    const p = clientToCoord(e)
    dragOffset.current = { x: p.x - items[idx].x, y: p.y - items[idx].y }
    setDrag(idx)
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }

  const onMove = (e: React.PointerEvent) => {
    if (drag === null) return
    const p = clientToCoord(e)
    const x =
      Math.max(0, Math.min(p.x - dragOffset.current.x, palletWidth - boxW))
    const y =
      Math.max(0, Math.min(p.y - dragOffset.current.y, palletLength - boxL))
    const list = items.map((it, i) => (i === drag ? { ...it, x, y } : it))
    save(list)
  }

  const onUp = (e: React.PointerEvent) => {
    if (drag === null) return
    ;(e.target as Element).releasePointerCapture(e.pointerId)
    setDrag(null)
  }

  return (
    <svg
      ref={svgRef}
      width={palletWidth * pxPerUnit}
      height={palletLength * pxPerUnit}
      className="border bg-gray-50"
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
    >
      {/* pallet outline */}
      <rect
        x={0}
        y={0}
        width={palletWidth * pxPerUnit}
        height={palletLength * pxPerUnit}
        fill="none"
        stroke="black"
        strokeDasharray="4 2"
      />
      {items.map((it, idx) => {
        const w = it.r % 180 === 90 ? boxL : boxW
        const l = it.r % 180 === 90 ? boxW : boxL
        return (
          <rect
            key={idx}
            x={it.x * pxPerUnit}
            y={it.y * pxPerUnit}
            width={w * pxPerUnit}
            height={l * pxPerUnit}
            fill="rgba(59,130,246,0.5)"
            stroke="rgb(37,99,235)"
            onPointerDown={onDown(idx)}
          />
        )
      })}
    </svg>
  )
}

