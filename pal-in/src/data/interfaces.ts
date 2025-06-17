export const PPB_VERSION_NO = 1;

export interface Dimensions {
  x: number;
  y: number;
  z: number;
}

export interface ProductDimensions extends Dimensions {}

export type LayerType = 'single' | 'double';

export interface PatternItem {
  id: string;
  weight: number;
}

export interface PalletProject {
  PPB_VERSION_NO: number;
  name: string;
  dimensions: ProductDimensions;
  items: PatternItem[];
  layerType: LayerType;
}
