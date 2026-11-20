export type IngredientCategory = 'veg' | 'meat' | 'processed' | 'noodle' | 'mushroom';

export interface Ingredient {
  id: string;
  name: string;
  nameZh: string;
  category: IngredientCategory;
  categoryLabel: string;
  baseWeight: number; // グラム (基準値)
  weightJitter: number; // 個体差 (±g)
  image: string; // 画像URL または SVG
  description: string;
  flavor: string;
  width: number;
  height: number;
  defaultScale?: number;
}

export interface PlacedIngredient {
  instanceId: string;
  ingredientId: string;
  x: number; // 丼ローカル座標 (px または %)
  y: number;
  rotation: number; // 0..360
  scale: number;
  actualWeight: number;
  zIndex: number;
}

export interface SoupType {
  id: string;
  name: string;
  nameZh: string;
  spiciness: number; // 0..5
  colorClass: string;
  bgGradient: string;
  surfaceColor: string;
  description: string;
  accentColor: string;
}

export interface GameResult {
  totalWeight: number;
  diff: number;
  score: number;
  rank: 'SSS' | 'SS' | 'S' | 'A' | 'B' | 'C' | 'D';
  title: string;
  comment: string;
  soup: SoupType;
  items: {
    ingredient: Ingredient;
    actualWeight: number;
    instanceId: string;
  }[];
  date: string;
}

export type GameMode = 'normal' | 'pro'; // normal: 秤のヒントなし / pro: 一切のガイドなし
