import type { PalletProject } from './data/interfaces'

export function productFits(project: PalletProject): boolean {
  const overhangSides = project.overhangSides ?? 0
  const overhangEnds = project.overhangEnds ?? 0
  const allowedLength = project.dimensions.length + overhangEnds
  const allowedWidth = project.dimensions.width + overhangSides
  return (
    project.productDimensions.length <= allowedLength &&
    project.productDimensions.width <= allowedWidth
  )
}
