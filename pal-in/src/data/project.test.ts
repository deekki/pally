import { removeLayer } from './project'
import { PPB_VERSION_NO, type PalletProject } from './interfaces'

describe('removeLayer', () => {
  const base: PalletProject = {
    name: 'P',
    dimensions: { length: 10, width: 10, maxLoadHeight: 10, palletHeight: 2 },
    productDimensions: {
      length: 1,
      width: 1,
      height: 1,
      weight: 1,
      boxPadding: 0,
    },
    guiSettings: { PPB_VERSION_NO },
    layerTypes: [],
    layers: [],
  }

  test('removes layer type when unused', () => {
    const proj: PalletProject = {
      ...base,
      layerTypes: [
        { name: 'a', class: 'layer' },
        { name: 'b', class: 'layer' },
      ],
      layers: ['a', 'b'],
    }
    const result = removeLayer(proj, 1)
    expect(result.layers).toEqual(['a'])
    expect(result.layerTypes.find((lt) => lt.name === 'b')).toBeUndefined()
  })

  test('keeps layer type when still referenced', () => {
    const proj: PalletProject = {
      ...base,
      layerTypes: [{ name: 'a', class: 'layer' }],
      layers: ['a', 'a'],
    }
    const result = removeLayer(proj, 0)
    expect(result.layers).toEqual(['a'])
    expect(result.layerTypes.length).toBe(1)
    expect(result.layerTypes[0].name).toBe('a')
  })
})
