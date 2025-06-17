import { ReactSortable } from 'react-sortablejs'

interface LayerListProps {
  layers: string[]
  onSelect: (index: number) => void
  selected: number | null
  moveUp: (index: number) => void
  moveDown: (index: number) => void
  reorder: (from: number, to: number) => void
}

export default function LayerList({ layers, onSelect, selected, moveUp, moveDown, reorder }: LayerListProps) {
  const items = layers.map((name, id) => ({ id, name }))

  return (
    <ReactSortable
      list={items}
      setList={() => {}}
      onEnd={(evt) => {
        if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
          reorder(evt.oldIndex, evt.newIndex)
        }
      }}
    >
      {items.map((item, idx) => (
        <div key={item.id} className="flex items-center gap-1">
          <button className="border px-1" onClick={() => moveUp(idx)} disabled={idx===0}>↑</button>
          <button className="border px-1" onClick={() => moveDown(idx)} disabled={idx===items.length-1}>↓</button>
          <button
            className={`flex-1 text-left border px-2 ${selected===idx ? 'bg-blue-200' : ''}`}
            onClick={() => onSelect(idx)}
          >
            {item.name}
          </button>
        </div>
      ))}
    </ReactSortable>
  )
}
