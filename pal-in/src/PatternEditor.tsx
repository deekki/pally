import React, { useState } from 'react'
import type { LayerDefinition, PatternItem } from './data/interfaces'

interface Props {
  layer: LayerDefinition
  onChange: (layer: LayerDefinition) => void
}

const stringify = (p?: PatternItem[]) => (p ? JSON.stringify(p, null, 2) : '')

export default function PatternEditor({ layer, onChange }: Props) {
  const [patternText, setPatternText] = useState(stringify(layer.pattern))
  const [altText, setAltText] = useState(stringify(layer.altPattern))

  const applyChanges = () => {
    try {
      const newLayer: LayerDefinition = {
        ...layer,
        pattern: patternText ? JSON.parse(patternText) : undefined,
        altPattern: altText ? JSON.parse(altText) : undefined,
      }
      onChange(newLayer)
    } catch {
      alert('Invalid JSON')
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea
        className="border p-1 font-mono text-sm"
        rows={4}
        value={patternText}
        onChange={(e) => setPatternText(e.target.value)}
        placeholder="Pattern JSON"
      />
      <textarea
        className="border p-1 font-mono text-sm"
        rows={4}
        value={altText}
        onChange={(e) => setAltText(e.target.value)}
        placeholder="Alt Pattern JSON"
      />
      <button className="bg-blue-500 text-white px-2 py-1" onClick={applyChanges}>
        Apply
      </button>
    </div>
  )
}
