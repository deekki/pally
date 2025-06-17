import { convertProjectUnits } from './convertProjectUnits'
import { PPB_VERSION_NO, type PalletProject } from './data/interfaces'

describe('convertProjectUnits', () => {
  const baseProject: PalletProject = {
    name: 'convert-test',
    dimensions: {
      length: 254,
      width: 254,
      maxLoadHeight: 508,
      palletHeight: 127,
    },
    productDimensions: {
      length: 50.8,
      width: 25.4,
      height: 76.2,
      weight: 2,
    },
    units: 'mm',
    overhang: 12.7,
    guiSettings: { PPB_VERSION_NO },
    layerTypes: [],
    layers: [],
  }

  test('converts mm to inch', () => {
    const converted = convertProjectUnits(baseProject, 'inch')
    expect(converted.units).toBe('inch')
    expect(converted.dimensions.length).toBe(10)
    expect(converted.dimensions.width).toBe(10)
    expect(converted.dimensions.maxLoadHeight).toBe(20)
    expect(converted.dimensions.palletHeight).toBe(5)
    expect(converted.productDimensions.length).toBe(2)
    expect(converted.productDimensions.width).toBe(1)
    expect(converted.productDimensions.height).toBe(3)
    expect(converted.productDimensions.weight).toBe(2)
    expect(converted.overhang).toBe(0.5)
  })

  test('converts inch to mm', () => {
    const inchProject = convertProjectUnits(baseProject, 'inch')
    const backToMm = convertProjectUnits(inchProject, 'mm')
    expect(backToMm.units).toBe('mm')
    expect(backToMm.dimensions.length).toBe(254)
    expect(backToMm.dimensions.width).toBe(254)
    expect(backToMm.dimensions.maxLoadHeight).toBe(508)
    expect(backToMm.dimensions.palletHeight).toBe(127)
    expect(backToMm.productDimensions.length).toBe(50.8)
    expect(backToMm.productDimensions.width).toBe(25.4)
    expect(backToMm.productDimensions.height).toBe(76.2)
    expect(backToMm.productDimensions.weight).toBe(2)
    expect(backToMm.overhang).toBe(12.7)
  })
})
