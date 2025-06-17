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
  /** allowed overhang past pallet sides (width) */
  overhangSides?: number
  /** allowed overhang past pallet ends (length) */
  overhangEnds?: number
  onChange: (layer: LayerDefinition) => void
}

export default function PatternEditor({
  layer,
  dims,
  product,
  overhangSides = 0,
  overhangEnds = 0,
  onChange,
}: Props) {
  const [items, setItems] = useState<PatternItem[]>(layer.pattern ?? [])
  const [selected, setSelected] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // pixels per unit
  const SCALE = 300 / Math.max(dims.length + overhangEnds, dims.width + overhangSides)
  const boxW = product.width * SCALE
  const boxH = product.length * SCALE

  // allowed area taking overhang into account
  const allowedWidth = dims.width + overhangSides
  const allowedLength = dims.length + overhangEnds
  const offsetX = overhangSides / 2
  const offsetY = overhangEnds / 2
  const minX = -offsetX
  const minY = -offsetY
  const maxX = allowedWidth - product.width
  const maxY = allowedLength - product.length

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
    let x = (e.clientX - rect.left) / SCALE - offsetX
    let y = (e.clientY - rect.top) / SCALE - offsetY
    x = Math.min(Math.max(x, minX), maxX)
    y = Math.min(Math.max(y, minY), maxY)
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
      let x = itemX + dx
      let y = itemY + dy
      x = Math.min(Math.max(x, minX), maxX)
      y = Math.min(Math.max(y, minY), maxY)
      copy[index] = { ...copy[index], x, y }
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
        style={{ width: allowedWidth * SCALE, height: allowedLength * SCALE }}
      >
        {items.map((item, idx) => {
          const style: React.CSSProperties = {
            position: 'absolute',
            left: (item.x + offsetX) * SCALE,
            top: (item.y + offsetY) * SCALE,
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
        <div
          className="absolute border-dashed border-red-500 pointer-events-none"
          style={{
            left: offsetX * SCALE,
            top: offsetY * SCALE,
            width: dims.width * SCALE,
            height: dims.length * SCALE,
          }}
        />
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

