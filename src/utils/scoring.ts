import { GameResult, Ingredient, PlacedIngredient, SoupType } from '../types/game';

export const PRICE_PER_GRAM = 4; // 1グラム4円
export const TARGET_PRICE = 1000; // 目標1000円
export const TARGET_WEIGHT = TARGET_PRICE / PRICE_PER_GRAM; // 250g

export function calculateScore(
  placed: PlacedIngredient[],
  ingredientsMap: Map<string, Ingredient>,
  soup: SoupType
): GameResult {
  const totalWeight = Math.round(
    placed.reduce((sum, item) => sum + item.actualWeight, 0) * 10
  ) / 10;

  const totalPrice = Math.round(totalWeight * PRICE_PER_GRAM);
  const diffPrice = Math.abs(totalPrice - TARGET_PRICE);
  const diffWeight = Math.round(Math.abs(totalWeight - TARGET_WEIGHT) * 10) / 10;

  let baseScore = 0;
  let rank: GameResult['rank'] = 'D';
  let title = '麻辣湯ビギナー';
  let comment = '';

  if (diffPrice === 0) {
    baseScore = 10000;
    rank = 'SSS';
    title = '奇跡の神会計！麻辣湯仙人';
    comment = 'まさに神業！寸分の狂いもなくピッタリ1,000円（250.0g）のお会計を叩き出しました！伝説の常連客として語り継がれます。';
  } else if (diffPrice <= 8) { // 誤差2g以内
    baseScore = Math.round(9800 - diffPrice * 70);
    rank = 'SS';
    title = '凄腕！プロ会計マスター';
    comment = `わずか${diffPrice}円（誤差${diffWeight}g）！卓越した目利きと計量センスを持っています。お店公認のプロ！`;
  } else if (diffPrice <= 20) { // 誤差5g以内
    baseScore = Math.round(9000 - diffPrice * 50);
    rank = 'S';
    title = '一流トッピング職人';
    comment = `誤差${diffPrice}円（${diffWeight}g）！素晴らしい感覚です。1,000円札1枚でほぼピッタリお会計できます！`;
  } else if (diffPrice <= 60) { // 誤差15g以内
    baseScore = Math.round(8000 - diffPrice * 30);
    rank = 'A';
    title = 'やり手常連客';
    comment = `誤差${diffPrice}円。かなり惜しい！もう一具材の微調整で1,000円ジャストが狙えそうです。`;
  } else if (diffPrice <= 150) { // 誤差37.5g以内
    baseScore = Math.round(6200 - diffPrice * 15);
    rank = 'B';
    title = '気ままな食いしん坊';
    comment = `合計${totalPrice}円（誤差${diffPrice}円）。美味しそうですが、1,000円ピッタリにはもう少し研ぎ澄まされた勘が必要かも！`;
  } else if (diffPrice <= 350) {
    baseScore = Math.max(1000, Math.round(4000 - diffPrice * 8));
    rank = 'C';
    title = totalPrice > TARGET_PRICE ? 'お財布贅沢ボリューム派' : 'お財布控えめ小食派';
    comment = totalPrice > TARGET_PRICE
      ? `合計${totalPrice}円（${totalWeight}g）！ちょっと欲張って1,000円を超えちゃいました！`
      : `合計${totalPrice}円（${totalWeight}g）。ちょっと控えめすぎかも？もう少し具材を盛っちゃいましょう！`;
  } else {
    baseScore = Math.max(200, Math.round(2000 - diffPrice * 4));
    rank = 'D';
    title = totalPrice > TARGET_PRICE ? '限界突破メガ盛り麻辣湯' : 'ほぼスープのみ';
    comment = totalPrice > TARGET_PRICE
      ? `合計${totalPrice}円（${totalWeight}g）！ボウルから溢れるメガ盛り！お会計が予算オーバーです！`
      : `合計${totalPrice}円（${totalWeight}g）…具材が少なすぎて寂しい麻辣湯になっちゃいました！`;
  }

  // 具材の内訳リスト
  const items = placed.map((p) => {
    const ing = ingredientsMap.get(p.ingredientId)!;
    const price = Math.round(p.actualWeight * PRICE_PER_GRAM);
    return {
      ingredient: ing,
      actualWeight: p.actualWeight,
      price,
      instanceId: p.instanceId,
    };
  }).filter((item) => item.ingredient !== undefined);

  // 特別称号チェック（具材構成による遊び心）
  const categories = items.map((i) => i.ingredient.category);
  const isAllVeg = categories.length >= 4 && categories.every((c) => c === 'veg');
  const isAllMeat = categories.length >= 4 && categories.every((c) => c === 'meat');

  if (diffPrice <= 12) {
    if (isAllVeg) title = '1,000円のヘルシー野菜マスター';
    else if (isAllMeat) title = '1,000円の肉食系麻辣覇者';
  }

  return {
    totalWeight,
    totalPrice,
    diffWeight,
    diffPrice,
    score: baseScore,
    rank,
    title,
    comment,
    soup,
    items,
    date: new Date().toLocaleString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}
