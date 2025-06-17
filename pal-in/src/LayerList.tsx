import React from 'react'

interface LayerListProps {
  layers: string[]
  /** all available layer type names */
  types: string[]
  onSelect: (index: number) => void
  /** update the layer reference when a new type is chosen */
  onChange: (index: number, name: string) => void
  selected: number | null
  moveUp: (index: number) => void
  moveDown: (index: number) => void
}

export default function LayerList({
  layers,
  types,
  onSelect,
  onChange,
  selected,
  moveUp,
  moveDown,
}: LayerListProps) {
  return (
    <div className="flex flex-col gap-1">
      {layers.map((name, idx) => (
        <div key={idx} className="flex items-center gap-1">
          <button className="border px-1" onClick={() => moveUp(idx)} disabled={idx===0}>↑</button>
          <button className="border px-1" onClick={() => moveDown(idx)} disabled={idx===layers.length-1}>↓</button>
          <select
            className={`flex-1 border px-2 ${selected===idx ? 'bg-blue-200' : ''}`}
            value={name}
            onChange={(e) => onChange(idx, e.target.value)}
            onClick={() => onSelect(idx)}
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}
