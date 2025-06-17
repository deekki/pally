import React, { useEffect, useRef, useState } from 'react'
import type {
  LayerDefinition,
  PatternItem,
  Dimensions,
  ProductDimensions,
} from './data/interfaces'

interface Props {
  layer: LayerDefinition
  dims: Dimensions
  product: ProductDimensions
  /** spacing of grid lines in project units */
  gridSpacing?: number
  /** symmetric overhang or specific side/end values */
  overhang?: number
  overhangSides?: number
  overhangEnds?: number
  onChange: (layer: LayerDefinition) => void
}

export default function PatternEditor({
  layer,
  dims,
  product,
  gridSpacing = 100,
  overhang,
  overhangSides,
  overhangEnds,
  onChange,
}: Props) {
  const [items, setItems] = useState<PatternItem[]>(layer.pattern ?? [])
  const [selected, setSelected] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // pixels per unit
  const SCALE = 300 / Math.max(dims.length, dims.width)
  const boxW = product.width * SCALE
  const boxH = product.length * SCALE
  const GRID = gridSpacing

  useEffect(() => {
    setItems(layer.pattern ?? [])
  }, [layer.pattern])

  useEffect(() => {
    onChange({ ...layer, pattern: items })
  }, [items])

  // Keyboard handlers for selected item
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (selected === null) return
      if (e.key === 'r') {
        setItems((arr) => {
          const copy = [...arr]
          const it = copy[selected]
          copy[selected] = { ...it, r: ((it.r ?? 0) + 90) % 360 }
          return copy
        })
      } else if (e.key === 'f') {
        setItems((arr) => {
          const copy = [...arr]
          const it = copy[selected]
          copy[selected] = { ...it, f: it.f === 1 ? 2 : 1 }
          return copy
        })
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        setItems((arr) => arr.filter((_, i) => i !== selected))
        setSelected(null)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selected])

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target !== containerRef.current) return
    const rect = containerRef.current!.getBoundingClientRect()
    const x = (e.clientX - rect.left) / SCALE
    const y = (e.clientY - rect.top) / SCALE
    const newItem: PatternItem = { x, y, r: 0, f: 1 }
    setItems((arr) => [...arr, newItem])
  }

  // dragging helpers
  const dragData = useRef<{
    index: number
    startX: number
    startY: number
    itemX: number
    itemY: number
  } | null>(null)

  const onMouseMove = (e: MouseEvent) => {
    if (!dragData.current) return
    e.preventDefault()
    const { index, startX, startY, itemX, itemY } = dragData.current
    const dx = (e.clientX - startX) / SCALE
    const dy = (e.clientY - startY) / SCALE
    setItems((arr) => {
      const copy = [...arr]
      copy[index] = { ...copy[index], x: itemX + dx, y: itemY + dy }
      return copy
    })
  }

  const endDrag = () => {
    dragData.current = null
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', endDrag)
  }

  const startDrag = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelected(index)
    dragData.current = {
      index,
      startX: e.clientX,
      startY: e.clientY,
      itemX: items[index].x,
      itemY: items[index].y,
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', endDrag)
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className="relative border bg-gray-100 mx-auto"
        style={{ width: dims.width * SCALE, height: dims.length * SCALE }}
      >
        {/* grid overlay */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={dims.width * SCALE}
          height={dims.length * SCALE}
        >
          {Array.from({ length: Math.max(0, Math.floor(dims.width / GRID) - 1) }).map((_, i) => {
            const x = (i + 1) * GRID * SCALE
            return (
              <line
                key={`v${i}`}
                x1={x}
                y1={0}
                x2={x}
                y2={dims.length * SCALE}
                stroke="#e5e7eb"
                strokeWidth={1}
              />
            )
          })}
          {Array.from({ length: Math.max(0, Math.floor(dims.length / GRID) - 1) }).map((_, i) => {
            const y = (i + 1) * GRID * SCALE
            return (
              <line
                key={`h${i}`}
                x1={0}
                y1={y}
                x2={dims.width * SCALE}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth={1}
              />
            )
          })}
        </svg>

        {/* overhang extents */}
        {(() => {
          const extraW = overhangSides ?? overhang ?? 0
          const extraL = overhangEnds ?? overhang ?? 0
          if (extraW <= 0 && extraL <= 0) return null
          return (
            <div
              className="absolute pointer-events-none border border-dashed border-red-400"
              style={{
                left: -(extraW / 2) * SCALE,
                top: -(extraL / 2) * SCALE,
                width: (dims.width + extraW) * SCALE,
                height: (dims.length + extraL) * SCALE,
              }}
            />
          )
        })()}

        {items.map((item, idx) => {
          const style: React.CSSProperties = {
            position: 'absolute',
            left: item.x * SCALE,
            top: item.y * SCALE,
            width: boxW,
            height: boxH,
            background: 'rgba(59,130,246,0.3)',
            border: selected === idx ? '2px solid red' : '1px solid blue',
            boxSizing: 'border-box',
            transform: `rotate(${item.r}deg)`,
            cursor: 'move',
          }
          return (
            <div
              key={idx}
              style={style}
              onMouseDown={(e) => startDrag(idx, e)}
            />
          )
        })}
      </div>
      <button
        className="bg-red-500 text-white px-2 py-1"
        onClick={() => {
          if (selected !== null) {
            setItems((arr) => arr.filter((_, i) => i !== selected))
            setSelected(null)
          }
        }}
      >
        Delete Selected
      </button>
    </div>
  )
}

