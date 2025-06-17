import { useState } from 'react'
import './App.css'
import { loadFromFile, saveToFile } from './data/jsonIO'
import type { PalletProject } from './data/interfaces'

function App() {
  const [project, setProject] = useState<PalletProject | null>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const proj = await loadFromFile(file)
        setProject(proj)
        alert('Loaded project ' + proj.name)
      } catch (err) {
        alert('Error: ' + (err as Error).message)
      }
    }
  }

  const handleSave = () => {
    if (!project) return
    const blob = saveToFile(project)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = project.name + '.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-4 text-center">
      <div className="mb-4">
        <input type="file" accept="application/json" onChange={handleFile} />
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave} disabled={!project}>
        Zapisz
      </button>
    </div>
  )
}

export default App
