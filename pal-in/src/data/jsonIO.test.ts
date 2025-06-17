import { loadFromFile, saveToFile } from './jsonIO'
import { PPB_VERSION_NO, type PalletProject } from './interfaces'

const baseProject: PalletProject = {
  name: 'Test Project',
  dimensions: { length: 10, width: 10, maxLoadHeight: 50, palletHeight: 10 },
  productDimensions: {
    length: 1,
    width: 1,
    height: 1,
    weight: 1,
    boxPadding: 0,
  },
  guiSettings: { PPB_VERSION_NO },
  layerTypes: [
    { name: 'layer1', class: 'layer', pattern: [{ x: 0, y: 0, r: 0 }] },
  ],
  layers: ['layer1'],
}

describe('loadFromFile', () => {
  test('parses valid project', async () => {
    const file = new File([JSON.stringify(baseProject)], 'p.json')
    const result = await loadFromFile(file)
    expect(result.name).toBe('Test Project')
    expect(result.guiSettings.PPB_VERSION_NO).toBe(PPB_VERSION_NO)
    expect(result.productDimensions.boxPadding).toBe(0)
  })

  test('accepts mirror altLayout', async () => {
    const proj = {
      ...baseProject,
      guiSettings: { ...baseProject.guiSettings, altLayout: 'mirror' },
    }
    const file = new File([JSON.stringify(proj)], 'p.json')
    const result = await loadFromFile(file)
    expect(result.guiSettings.altLayout).toBe('mirror')
  })

  test('rejects unsupported version', async () => {
    const bad = { ...baseProject, guiSettings: { PPB_VERSION_NO: '0.0.0' } }
    const file = new File([JSON.stringify(bad)], 'p.json')
    await expect(loadFromFile(file)).rejects.toThrow('Unsupported PPB version')
  })

  test('rejects pattern outside bounds', async () => {
    const bad = {
      ...baseProject,
      layerTypes: [
        { name: 'l', class: 'layer', pattern: [{ x: 20, y: 0, r: 0 }] },
      ],
      layers: ['l'],
    }
    const file = new File([JSON.stringify(bad)], 'p.json')
    await expect(loadFromFile(file)).rejects.toThrow('Pattern item outside pallet bounds')
  })

  test('rejects invalid boxPadding', async () => {
    const bad = {
      ...baseProject,
      productDimensions: { ...baseProject.productDimensions, boxPadding: -1 },
    }
    const file = new File([JSON.stringify(bad)], 'p.json')
    await expect(loadFromFile(file)).rejects.toThrow('Invalid boxPadding value')
  })

  test('allows separator layer with height', async () => {
    const proj: PalletProject = {
      ...baseProject,
      layerTypes: [
        { name: 'shim', class: 'separator', height: 2 },
        ...baseProject.layerTypes,
      ],
    }
    const file = new File([JSON.stringify(proj)], 'p.json')
    const result = await loadFromFile(file)
    const shim = result.layerTypes.find((lt) => lt.name === 'shim')!
    expect(shim.height).toBe(2)
  })

  test('defaults separator height when missing', async () => {
    const proj: PalletProject = {
      ...baseProject,
      layerTypes: [
        { name: 'shim', class: 'separator' },
        ...baseProject.layerTypes,
      ],
    }
    const file = new File([JSON.stringify(proj)], 'p.json')
    const result = await loadFromFile(file)
    const shim = result.layerTypes.find((lt) => lt.name === 'shim')!
    expect(shim.height).toBe(1)
  })

  test('rejects negative separator height', async () => {
    const proj: PalletProject = {
      ...baseProject,
      layerTypes: [
        { name: 'shim', class: 'separator', height: -1 },
        ...baseProject.layerTypes,
      ],
    }
    const file = new File([JSON.stringify(proj)], 'p.json')
    await expect(loadFromFile(file)).rejects.toThrow('Invalid layer height')
  })
})

describe('saveToFile', () => {
  test('produces json blob with version', async () => {
    const proj: PalletProject = {
      ...baseProject,
      guiSettings: {} as any,
    }
    const blob = saveToFile(proj)
    const text = await blob.text()
    const data = JSON.parse(text)
    expect(data.guiSettings.PPB_VERSION_NO).toBe(PPB_VERSION_NO)
    expect(data.productDimensions.boxPadding).toBe(0)
  })
})
