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
  onChange: (layer: LayerDefinition) => void
}

export default function PatternEditor({ layer, dims, product, onChange }: Props) {
  const [items, setItems] = useState<PatternItem[]>(layer.pattern ?? [])
  const [selected, setSelected] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const draggingNew = useRef(false)

  // pixels per unit
  const SCALE = 300 / Math.max(dims.length, dims.width)
  const boxW = product.width * SCALE
  const boxH = product.length * SCALE

  const handleDragStart = () => {
    draggingNew.current = true
  }

  const handleDragEnd = () => {
    draggingNew.current = false
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (draggingNew.current) e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    if (!draggingNew.current) return
    e.preventDefault()
    const rect = containerRef.current!.getBoundingClientRect()
    const x = (e.clientX - rect.left) / SCALE
    const y = (e.clientY - rect.top) / SCALE
    const newItem: PatternItem = { x, y, r: 0, f: 1 }
    setItems((arr) => [...arr, newItem])
    draggingNew.current = false
  }

  useEffect(() => {
    setItems(layer.pattern ?? [])
  }, [layer])

  useEffect(() => {
    onChange({ ...layer, pattern: items })
  }, [items, onChange, layer])

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
      <div className="flex items-start gap-2">
        <div
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className="w-6 h-6 bg-blue-200 border cursor-grab"
        />
        <div
          ref={containerRef}
          onClick={handleContainerClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative border bg-gray-100 mx-auto"
          style={{ width: dims.width * SCALE, height: dims.length * SCALE }}
        >
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

