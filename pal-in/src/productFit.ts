import type { PalletProject } from './data/interfaces'

export function productFits(project: PalletProject): boolean {
  const overhang = project.overhang ?? 0
  const allowedLength = project.dimensions.length + overhang
  const allowedWidth = project.dimensions.width + overhang
  const pad = project.productDimensions.boxPadding ?? 0
  return (
    project.productDimensions.length + pad * 2 <= allowedLength &&
    project.productDimensions.width + pad * 2 <= allowedWidth
  )
}
