import React from 'react'
import type { LayerDefinition } from './data/interfaces'

interface LayerListProps {
  layers: string[]
  layerDefs: Record<string, LayerDefinition>
  onSelect: (index: number) => void
  selected: number | null
  moveUp: (index: number) => void
  moveDown: (index: number) => void
}

export default function LayerList({
  layers,
  layerDefs,
  onSelect,
  selected,
  moveUp,
  moveDown,
}: LayerListProps) {
  return (
    <div className="flex flex-col gap-1">
      {layers.map((name, idx) => {
        const def = layerDefs[name]
        const isSep = def?.class === 'separator'
        return (
          <div key={idx} className="flex items-center gap-1">
            <button className="border px-1" onClick={() => moveUp(idx)} disabled={idx===0}>↑</button>
            <button className="border px-1" onClick={() => moveDown(idx)} disabled={idx===layers.length-1}>↓</button>
            <button
              className={`flex-1 text-left border px-2 flex items-center ${selected===idx ? 'bg-blue-200' : ''} ${isSep ? 'bg-gray-100 italic' : ''}`}
              onClick={() => onSelect(idx)}
            >
              {def?.class === 'separator' ? (
                <span className="inline-block w-3 border-t border-gray-600 mr-1" />
              ) : (
                <span className="inline-block w-3 h-3 bg-gray-600 mr-1" />
              )}
              {name}
            </button>
          </div>
        )
      })}
    </div>
  )
}
