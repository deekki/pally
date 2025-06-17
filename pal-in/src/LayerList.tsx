import React from 'react'

interface LayerListProps {
  layers: string[]
  onSelect: (index: number) => void
  selected: number | null
  moveUp: (index: number) => void
  moveDown: (index: number) => void
}

export default function LayerList({ layers, onSelect, selected, moveUp, moveDown }: LayerListProps) {
  return (
    <div className="flex flex-col gap-1">
      {layers.map((name, idx) => (
        <div key={idx} className="flex items-center gap-1">
          <button className="border px-1" onClick={() => moveUp(idx)} disabled={idx===0}>↑</button>
          <button className="border px-1" onClick={() => moveDown(idx)} disabled={idx===layers.length-1}>↓</button>
          <button
            className={`flex-1 text-left border px-2 ${selected===idx ? 'bg-blue-200' : ''}`}
            onClick={() => onSelect(idx)}
          >
            {name}
          </button>
        </div>
      ))}
    </div>
  )
}
