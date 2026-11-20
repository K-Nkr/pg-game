import { GameResult, Ingredient, PlacedIngredient, SoupType } from '../types/game';

export function calculateScore(
  placed: PlacedIngredient[],
  ingredientsMap: Map<string, Ingredient>,
  soup: SoupType
): GameResult {
  const totalWeight = Math.round(
    placed.reduce((sum, item) => sum + item.actualWeight, 0) * 10
  ) / 10;

  const diff = Math.round(Math.abs(totalWeight - 100) * 10) / 10;

  let baseScore = 0;
  let rank: GameResult['rank'] = 'D';
  let title = '麻辣湯初心者';
  let comment = '';

  if (diff === 0) {
    baseScore = 10000;
    rank = 'SSS';
    title = '奇跡の神計量！麻辣湯仙人';
    comment = 'まさに神の指先！寸分の狂いもなくピッタリ100.0gを叩き出しました！伝説の店主として語り継がれます。';
  } else if (diff <= 1.0) {
    baseScore = Math.round(9800 - diff * 300);
    rank = 'SS';
    title = '凄腕！麻辣湯マスター';
    comment = `わずか${diff}gの誤差！卓越した目利きと計量センスを持っています。お店を開けるレベル！`;
  } else if (diff <= 3.0) {
    baseScore = Math.round(9000 - diff * 250);
    rank = 'S';
    title = '一流トッピング職人';
    comment = `誤差${diff}g！素晴らしい感覚です。具材の重さをしっかり把握していますね。`;
  } else if (diff <= 6.0) {
    baseScore = Math.round(8000 - diff * 200);
    rank = 'A';
    title = '期待の看板シェフ';
    comment = `誤差${diff}g。かなり惜しい！もう一具材の微調整で100gジャストが狙えそうです。`;
  } else if (diff <= 12.0) {
    baseScore = Math.round(6500 - diff * 150);
    rank = 'B';
    title = 'お腹ペコペコ一般客';
    comment = `誤差${diff}g。美味しそうですが、100gピッタリにはもう少し研ぎ澄まされた勘が必要かも！`;
  } else if (diff <= 25.0) {
    baseScore = Math.max(1000, Math.round(4500 - diff * 100));
    rank = 'C';
    title = totalWeight > 100 ? '欲張りボリューム派' : '控えめ小食派';
    comment = totalWeight > 100
      ? `なんと${totalWeight}g！ちょっと具材を盛りすぎちゃいましたね。でも美味しそう！`
      : `合計${totalWeight}g。ちょっと控えめすぎかも？もっとトッピングを乗せちゃいましょう！`;
  } else {
    baseScore = Math.max(200, Math.round(2500 - diff * 50));
    rank = 'D';
    title = totalWeight > 100 ? '超絶メガ盛り麻辣湯' : 'ほぼスープのみ';
    comment = totalWeight > 100
      ? `合計${totalWeight}g！ボウルから溢れそうなメガ盛り麻辣湯！お会計が高くなっちゃう！`
      : `合計${totalWeight}g…具材が少なすぎて寂しい麻辣湯になっちゃいました！`;
  }

  // 具材の内訳リスト
  const items = placed.map((p) => ({
    ingredient: ingredientsMap.get(p.ingredientId)!,
    actualWeight: p.actualWeight,
    instanceId: p.instanceId,
  })).filter(item => item.ingredient !== undefined);

  // 特別称号チェック（具材構成による遊び心）
  const categories = items.map((i) => i.ingredient.category);
  const isAllVeg = categories.length >= 3 && categories.every((c) => c === 'veg');
  const isAllMeat = categories.length >= 3 && categories.every((c) => c === 'meat');
  const isAllMushroom = categories.length >= 3 && categories.every((c) => c === 'mushroom');

  if (diff <= 2.0) {
    if (isAllVeg) title = '100gのヘルシー野菜マスター';
    else if (isAllMeat) title = '100gの肉食系麻辣覇者';
    else if (isAllMushroom) title = '100gのキノコ森の賢者';
  }

  return {
    totalWeight,
    diff,
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
