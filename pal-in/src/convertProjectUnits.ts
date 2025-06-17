import type { PalletProject } from './data/interfaces'

const MM_TO_INCH = 25.4

export const convertProjectUnits = (
  p: PalletProject,
  to: 'mm' | 'inch'
): PalletProject => {
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
