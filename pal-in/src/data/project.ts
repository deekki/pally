import type { PalletProject } from './interfaces'

export function removeLayer(project: PalletProject, index: number): PalletProject {
  const name = project.layers[index]
  const layers = project.layers.filter((_, i) => i !== index)
  const stillUsed = layers.includes(name)
  const layerTypes = stillUsed
    ? project.layerTypes
    : project.layerTypes.filter((lt) => lt.name !== name)
  return { ...project, layers, layerTypes }
}
