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

export interface GuiSettings {
  PPB_VERSION_NO: string
  altLayout?: string
  [key: string]: unknown
}

export interface PalletProject {
  name: string
  description?: string
  dimensions: Dimensions
  productDimensions: ProductDimensions
  maxGrip?: number
  maxGripAuto?: boolean
  labelOrientation?: string
  /** unit system used for dimensions */
  units?: 'mm' | 'inch'
  /** product overhang beyond pallet edge */
  overhang?: number
  guiSettings: GuiSettings
  layerTypes: LayerDefinition[]
  layers: string[]
}
