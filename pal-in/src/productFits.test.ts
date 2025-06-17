import { productFits } from './productFit'
import { PPB_VERSION_NO, type PalletProject } from './data/interfaces'

describe('productFits', () => {
  const base: PalletProject = {
    name: 'P',
    dimensions: { length: 100, width: 100, maxLoadHeight: 100, palletHeight: 10 },
    productDimensions: {
      length: 50,
      width: 50,
      height: 50,
      weight: 1,
      boxPadding: 0,
    },
    guiSettings: { PPB_VERSION_NO },
    layerTypes: [],
    layers: [],
    overhang: 0,
  }

  test('fits when within pallet size', () => {
    expect(productFits(base)).toBe(true)
  })

  test('fails when too large', () => {
    const p = { ...base, productDimensions: { ...base.productDimensions, width: 120 } }
    expect(productFits(p)).toBe(false)
  })

  test('allows overhang', () => {
    const p = {
      ...base,
      overhang: 20,
      productDimensions: { ...base.productDimensions, width: 110 },
    }
    expect(productFits(p)).toBe(true)
  })

  test('fails if overhang insufficient', () => {
    const p = {
      ...base,
      overhang: 5,
      productDimensions: { ...base.productDimensions, length: 110 },
    }
    expect(productFits(p)).toBe(false)
  })

  test('padding counts against available space', () => {
    const p = {
      ...base,
      productDimensions: { ...base.productDimensions, width: 90, boxPadding: 10 },
    }
    expect(productFits(p)).toBe(false)
  })
})
