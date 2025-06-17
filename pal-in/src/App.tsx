import { useState } from 'react'
import './App.css'
import { loadFromFile, saveToFile } from './data/jsonIO'
import type { PalletProject } from './data/interfaces'
import { PPB_VERSION_NO } from './data/interfaces'

const MM_TO_INCH = 25.4

const defaultProject: PalletProject = {
  name: 'New Project',
  dimensions: {
    length: 1200,
    width: 800,
    maxLoadHeight: 1200,
    palletHeight: 150,
  },
  productDimensions: {
    length: 200,
    width: 200,
    height: 200,
    weight: 1,
  },
  maxGrip: 0,
  maxGripAuto: false,
  labelOrientation: '0',
  units: 'mm',
  overhang: 0,
  guiSettings: { PPB_VERSION_NO },
  layerTypes: [],
  layers: [],
}

function App() {
  const [project, setProject] = useState<PalletProject>(defaultProject)

  const updateDimensions = (key: keyof typeof project.dimensions, value: number) => {
    setProject((prev) => ({
      ...prev,
      dimensions: { ...prev.dimensions, [key]: value },
    }))
  }

  const updateProduct = (key: keyof typeof project.productDimensions, value: number) => {
    setProject((prev) => ({
      ...prev,
      productDimensions: { ...prev.productDimensions, [key]: value },
    }))
  }

  const convertProjectUnits = (p: PalletProject, to: 'mm' | 'inch'): PalletProject => {
    if (p.units === to) return p
    const factor = to === 'mm' ? MM_TO_INCH : 1 / MM_TO_INCH
    const convert = (n: number) => parseFloat((n * factor).toFixed(2))
    return {
      ...p,
      units: to,
      dimensions: {
        length: convert(p.dimensions.length),
        width: convert(p.dimensions.width),
        maxLoadHeight: convert(p.dimensions.maxLoadHeight),
        palletHeight: convert(p.dimensions.palletHeight),
      },
      productDimensions: {
        ...p.productDimensions,
        length: convert(p.productDimensions.length),
        width: convert(p.productDimensions.width),
        height: convert(p.productDimensions.height),
      },
      overhang: p.overhang !== undefined ? convert(p.overhang) : p.overhang,
    }
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const proj = await loadFromFile(file)
        if (!proj.units) proj.units = 'mm'
        if (proj.overhang === undefined) proj.overhang = 0
        setProject(proj)
        alert('Loaded project ' + proj.name)
      } catch (err) {
        alert('Error: ' + (err as Error).message)
      }
    }
  }

  const handleSave = () => {
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
      <div className="mb-4 flex flex-col gap-2 max-w-md mx-auto text-left">
        <div>
          <label className="mr-2">Units</label>
          <select
            className="border"
            value={project.units}
            onChange={(e) =>
              setProject((p) => convertProjectUnits(p, e.target.value as 'mm' | 'inch'))
            }
          >
            <option value="mm">mm</option>
            <option value="inch">inch</option>
          </select>
        </div>
        <div>
          <label className="mr-2">Pallet length</label>
          <input
            className="border"
            type="number"
            value={project.dimensions.length}
            onChange={(e) => updateDimensions('length', e.target.valueAsNumber)}
          />
        </div>
        <div>
          <label className="mr-2">Pallet width</label>
          <input
            className="border"
            type="number"
            value={project.dimensions.width}
            onChange={(e) => updateDimensions('width', e.target.valueAsNumber)}
          />
        </div>
        <div>
          <label className="mr-2">Pallet height</label>
          <input
            className="border"
            type="number"
            value={project.dimensions.palletHeight}
            onChange={(e) => updateDimensions('palletHeight', e.target.valueAsNumber)}
          />
        </div>
        <div>
          <label className="mr-2">Stack height</label>
          <input
            className="border"
            type="number"
            value={project.dimensions.maxLoadHeight}
            onChange={(e) => updateDimensions('maxLoadHeight', e.target.valueAsNumber)}
          />
        </div>
        <div>
          <label className="mr-2">Product length</label>
          <input
            className="border"
            type="number"
            value={project.productDimensions.length}
            onChange={(e) => updateProduct('length', e.target.valueAsNumber)}
          />
        </div>
        <div>
          <label className="mr-2">Product width</label>
          <input
            className="border"
            type="number"
            value={project.productDimensions.width}
            onChange={(e) => updateProduct('width', e.target.valueAsNumber)}
          />
        </div>
        <div>
          <label className="mr-2">Product height</label>
          <input
            className="border"
            type="number"
            value={project.productDimensions.height}
            onChange={(e) => updateProduct('height', e.target.valueAsNumber)}
          />
        </div>
        <div>
          <label className="mr-2">Product weight</label>
          <input
            className="border"
            type="number"
            value={project.productDimensions.weight}
            onChange={(e) => updateProduct('weight', e.target.valueAsNumber)}
          />
        </div>
        <div>
          <label className="mr-2">Max grip</label>
          <input
            className="border"
            type="number"
            value={project.maxGrip}
            onChange={(e) =>
              setProject((prev) => ({ ...prev, maxGrip: e.target.valueAsNumber }))
            }
          />
        </div>
        <div>
          <label className="mr-2">Max grip auto</label>
          <input
            className="border"
            type="checkbox"
            checked={project.maxGripAuto}
            onChange={(e) =>
              setProject((prev) => ({ ...prev, maxGripAuto: e.target.checked }))
            }
          />
        </div>
        <div>
          <label className="mr-2">Overhang</label>
          <input
            className="border"
            type="number"
            value={project.overhang}
            onChange={(e) =>
              setProject((prev) => ({ ...prev, overhang: e.target.valueAsNumber }))
            }
          />
        </div>
        <div>
          <label className="mr-2">Label orientation</label>
          <input
            className="border"
            type="text"
            value={project.labelOrientation}
            onChange={(e) =>
              setProject((prev) => ({ ...prev, labelOrientation: e.target.value }))
            }
          />
        </div>
      </div>
      <div className="mb-4">
        <p className="font-bold">{project.name}</p>
        <p>
          {project.dimensions.length} x {project.dimensions.width} /{' '}
          {project.dimensions.maxLoadHeight}
        </p>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSave}
      >
        Zapisz
      </button>
    </div>
  )
}

export default App
