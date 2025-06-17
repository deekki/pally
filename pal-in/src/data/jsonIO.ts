import { PPB_VERSION_NO } from './interfaces'
import type { PalletProject, PatternItem } from './interfaces'

const VALID_LAYER_CLASS = new Set(['layer', 'separator'])
const VALID_LABEL_ORIENTATIONS = new Set([
  'front',
  'back',
  'left',
  'right',
  'none',
])
const VALID_ALT_LAYOUTS = new Set(['default', 'alternate'])

function validatePattern(
  pattern: PatternItem[] | undefined,
  width: number,
  length: number,
) {
  if (!pattern) return
  for (const item of pattern) {
    if (
      item.x < 0 ||
      item.y < 0 ||
      item.x > width ||
      item.y > length
    ) {
      throw new Error('Pattern item outside pallet bounds')
    }
  }
}

export async function loadFromFile(file: File): Promise<PalletProject> {
  const text = await file.text()
  const data = JSON.parse(text)

  if (!data.guiSettings || data.guiSettings.PPB_VERSION_NO !== PPB_VERSION_NO) {
    throw new Error('Unsupported PPB version')
  }

  if (!data.dimensions || !data.productDimensions) {
    throw new Error('Missing dimension information')
  }
  if (
    data.dimensions.length <= 0 ||
    data.dimensions.width <= 0 ||
    data.productDimensions.length <= 0 ||
    data.productDimensions.width <= 0 ||
    data.productDimensions.height <= 0 ||
    data.dimensions.maxLoadHeight < 0 ||
    data.dimensions.palletHeight < 0 ||
    data.productDimensions.weight < 0
  ) {
    throw new Error('Invalid dimensions')
  }

  if (!Array.isArray(data.layerTypes) || !Array.isArray(data.layers)) {
    throw new Error('Invalid layer data')
  }

  if (data.maxGrip !== undefined) {
    if (typeof data.maxGrip !== 'number' || data.maxGrip < 0) {
      throw new Error('Invalid maxGrip value')
    }
  }
  if (data.maxGripAuto !== undefined && typeof data.maxGripAuto !== 'boolean') {
    throw new Error('Invalid maxGripAuto flag')
  }
  if (
    data.labelOrientation !== undefined &&
    !VALID_LABEL_ORIENTATIONS.has(data.labelOrientation)
  ) {
    throw new Error('Invalid label orientation')
  }
  if (
    data.guiSettings.altLayout !== undefined &&
    !VALID_ALT_LAYOUTS.has(data.guiSettings.altLayout)
  ) {
    throw new Error('Invalid alt layout')
  }

  const typeNames = new Set<string>(
    data.layerTypes.map((lt: { name: string }) => lt.name),
  )
  for (const name of data.layers) {
    if (!typeNames.has(name)) {
      throw new Error('Layer reference not found: ' + name)
    }
  }

  for (const lt of data.layerTypes) {
    if (!VALID_LAYER_CLASS.has(lt.class)) {
      throw new Error('Invalid layer class: ' + lt.class)
    }
    if (lt.height !== undefined && lt.height < 0) {
      throw new Error('Invalid layer height')
    }
    validatePattern(lt.pattern, data.dimensions.width, data.dimensions.length)
    validatePattern(lt.altPattern, data.dimensions.width, data.dimensions.length)
  }

  return data as PalletProject
}

export function saveToFile(project: PalletProject): Blob {
  if (!project.guiSettings) project.guiSettings = { PPB_VERSION_NO }
  project.guiSettings.PPB_VERSION_NO = PPB_VERSION_NO
  const data = JSON.stringify(project, null, 2)
  return new Blob([data], { type: 'application/json' })
}
