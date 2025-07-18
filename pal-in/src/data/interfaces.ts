export const PPB_VERSION_NO = '3.1.1'

export interface Dimensions {
  /** pallet length */
  length: number
  /** pallet width */
  width: number
  /** allowed load height */
  maxLoadHeight: number
  /** pallet height */
  palletHeight: number
}

export interface ProductDimensions {
  length: number
  width: number
  height: number
  weight: number
  /** optional padding added around each product box */
  boxPadding?: number
}

export interface PatternItem {
  /** x position on the pallet */
  x: number
  /** y position on the pallet */
  y: number
  /** rotation */
  r: number
  /** optional grouping id */
  g?: number
  /** optional flip/index */
  f?: number
}

export interface LayerDefinition {
  name: string
  class: 'layer' | 'separator'
  height?: number
  pattern?: PatternItem[]
  altPattern?: PatternItem[]
  approach?: string
  altApproach?: string
}

export type AltLayout = 'default' | 'alternate' | 'mirror'

export interface GuiSettings {
  PPB_VERSION_NO: string
  altLayout?: AltLayout
  [key: string]: unknown
}

export const LABEL_ORIENTATIONS = [
  'front',
  'back',
  'left',
  'right',
  'none',
] as const
export type LabelOrientation = typeof LABEL_ORIENTATIONS[number]

export interface PalletProject {
  name: string
  description?: string
  dimensions: Dimensions
  productDimensions: ProductDimensions
  maxGrip?: number
  maxGripAuto?: boolean
  labelOrientation?: LabelOrientation
  /** unit system used for dimensions */
  units?: 'mm' | 'inch'
  /** product overhang beyond pallet sides */
  overhangSides?: number
  /** product overhang beyond pallet ends */
  overhangEnds?: number
  /** symmetric overhang applied to both length and width */
  overhang?: number
  guiSettings: GuiSettings
  layerTypes: LayerDefinition[]
  layers: string[]
}
