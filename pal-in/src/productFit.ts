import type { PalletProject } from './data/interfaces'

export function productFits(project: PalletProject): boolean {
  const overhang = project.overhang ?? 0
  const allowedLength = project.dimensions.length + overhang
  const allowedWidth = project.dimensions.width + overhang
  return (
    project.productDimensions.length <= allowedLength &&
    project.productDimensions.width <= allowedWidth
  )
}
