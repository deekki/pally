import React, { useState } from 'react'
import type { LayerDefinition, PatternItem } from './data/interfaces'

import type { AltLayout, Dimensions } from './data/interfaces'

interface Props {
  layer: LayerDefinition
  onChange: (layer: LayerDefinition) => void
  altLayout?: AltLayout
  dimensions: Dimensions
}

const stringify = (p?: PatternItem[]) => (p ? JSON.stringify(p, null, 2) : '')

export default function PatternEditor({ layer, onChange, altLayout, dimensions }: Props) {
  const [patternText, setPatternText] = useState(stringify(layer.pattern))
  const [altText, setAltText] = useState(stringify(layer.altPattern))
  const [view, setView] = useState<'base' | 'alt'>('base')

  const mirrorFromBase = () => {
    if (!patternText) return
    try {
      const items: PatternItem[] = JSON.parse(patternText)
      const mirrored = items.map((it) => {
        const m = { ...it }
        if (altLayout === 'alternate') {
          m.y = dimensions.length - it.y
        } else {
          m.x = dimensions.width - it.x
        }
        m.r = (360 - it.r) % 360
        return m
      })
      setAltText(JSON.stringify(mirrored, null, 2))
    } catch {
      alert('Invalid base pattern JSON')
    }
  }

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
      <div className="flex gap-2 mb-2">
        <button
          className={`border px-2 py-1 ${view === 'base' ? 'bg-blue-200' : ''}`}
          onClick={() => setView('base')}
        >
          Base Pattern
        </button>
        <button
          className={`border px-2 py-1 ${view === 'alt' ? 'bg-blue-200' : ''}`}
          onClick={() => setView('alt')}
        >
          Alt Pattern
        </button>
      </div>
      {view === 'base' ? (
        <textarea
          className="border p-1 font-mono text-sm"
          rows={4}
          value={patternText}
          onChange={(e) => setPatternText(e.target.value)}
          placeholder="Pattern JSON"
        />
      ) : (
        <div className="flex flex-col gap-2">
          <textarea
            className="border p-1 font-mono text-sm"
            rows={4}
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Alt Pattern JSON"
          />
          <button className="border px-2 py-1" onClick={mirrorFromBase}>
            Mirror from base pattern
          </button>
        </div>
      )}
      <button className="bg-blue-500 text-white px-2 py-1" onClick={applyChanges}>
        Apply
      </button>
    </div>
  )
}
