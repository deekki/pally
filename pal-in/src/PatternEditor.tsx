import React, { useEffect, useRef, useState } from 'react'
import type {
  LayerDefinition,
  PatternItem,
  Dimensions,
  ProductDimensions,
  AltLayout,
} from './data/interfaces'

interface Props {
  layer: LayerDefinition
  dims: Dimensions
  product: ProductDimensions
  altLayout?: AltLayout
  onChange: (layer: LayerDefinition) => void
}

export default function PatternEditor({
  layer,
  dims,
  product,
  altLayout = 'default',
  onChange,
}: Props) {
  const [items, setItems] = useState<PatternItem[]>(layer.pattern ?? [])
  const [editingAlt, setEditingAlt] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // pixels per unit
  const SCALE = 300 / Math.max(dims.length, dims.width)
  const boxW = product.width * SCALE
  const boxH = product.length * SCALE

  const generateAltPattern = (
    pattern: PatternItem[],
    layout: AltLayout,
  ): PatternItem[] => {
    switch (layout) {
      case 'mirror':
        return pattern.map((it) => ({
          ...it,
          x: dims.width - it.x - product.width,
          r: (360 - (it.r ?? 0)) % 360,
        }))
      case 'alternate':
        return pattern.map((it) => ({
          ...it,
          x: dims.width - it.x - product.width,
          y: dims.length - it.y - product.length,
          r: ((it.r ?? 0) + 180) % 360,
        }))
      default:
        return [...pattern]
    }
  }

  useEffect(() => {
    setItems(editingAlt ? layer.altPattern ?? [] : layer.pattern ?? [])
  }, [layer.pattern, layer.altPattern, editingAlt])

  useEffect(() => {
    if (editingAlt) {
      onChange({ ...layer, altPattern: items })
    } else {
      onChange({ ...layer, pattern: items })
    }
  }, [items, editingAlt])

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
      <div className="flex gap-2">
        <button
          className={`border px-2 py-1 ${!editingAlt ? 'bg-blue-200' : ''}`}
          onClick={() => setEditingAlt(false)}
        >
          Pattern
        </button>
        <button
          className={`border px-2 py-1 ${editingAlt ? 'bg-blue-200' : ''}`}
          onClick={() => setEditingAlt(true)}
        >
          Alt Pattern
        </button>
        {editingAlt && (
          <button
            className="border px-2 py-1"
            onClick={() =>
              setItems(generateAltPattern(layer.pattern ?? [], altLayout))
            }
          >
            Auto
          </button>
        )}
      </div>
      <div
        ref={containerRef}
        onClick={handleContainerClick}
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

