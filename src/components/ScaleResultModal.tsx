import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Share2, RefreshCw, Award, Sparkles } from 'lucide-react';
import { GameResult, PlacedIngredient, Ingredient } from '../types/game';
import { sound } from '../utils/audio';

interface ScaleResultModalProps {
  result: GameResult;
  placedIngredients: PlacedIngredient[];
  ingredientsMap: Map<string, Ingredient>;
  onRestart: () => void;
}

export const ScaleResultModal: React.FC<ScaleResultModalProps> = ({
  result,
  placedIngredients,
  ingredientsMap,
  onRestart,
}) => {
  const [measuring, setMeasuring] = useState<boolean>(true);
  const [displayPrice, setDisplayPrice] = useState<number>(0);
  const [displayWeight, setDisplayWeight] = useState<number>(0);

  // デジタルスケールのカウントアップ測定アニメーション (重さと金額がリアルタイム連動)
  useEffect(() => {
    const targetWeight = result.totalWeight;
    const targetPrice = result.totalPrice;
    const duration = 1800; // 1.8秒
    const startTime = performance.now();

    const tickInterval = setInterval(() => {
      sound.playScaleTick(600 + Math.random() * 200);
    }, 90);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentWeight = Math.round(targetWeight * ease * 10) / 10;
      const currentPrice = Math.round(currentWeight * 4);

      setDisplayWeight(currentWeight);
      setDisplayPrice(currentPrice);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        clearInterval(tickInterval);
        setDisplayWeight(targetWeight);
        setDisplayPrice(targetPrice);
        setMeasuring(false);

        const isPerfect = result.diffPrice === 0;
        sound.playScaleDone(isPerfect);

        // 好記録（誤差20円以内）なら紙吹雪発射！
        if (result.diffPrice <= 20) {
          triggerConfetti(isPerfect);
        }
      }
    };

    requestAnimationFrame(animate);

    return () => {
      clearInterval(tickInterval);
    };
  }, [result]);

  const triggerConfetti = (isSuper: boolean) => {
    const count = isSuper ? 250 : 100;
    const defaults = {
      origin: { y: 0.6 },
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#fcd34d'],
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  // X (Twitter) シェア
  const handleShare = () => {
    sound.playClick();
    const rankEmoji =
      result.rank === 'SSS'
        ? '🏆【神会計SSS】'
        : result.rank === 'SS'
        ? '✨【SSランク】'
        : result.rank === 'S'
        ? '🌟【Sランク】'
        : '🍜';
    const text = `${rankEmoji} 麻辣湯1000円ピッタリ選手権（1g＝4円）で【${result.totalPrice}円（${result.totalWeight}g）】(誤差±${result.diffPrice}円) を達成！\n称号:『${result.title}』\nスコア: ${result.score.toLocaleString()}点！\n\nあなたもピッタリ1,000円の麻辣湯を作れるか挑戦してみてね！ #麻辣湯1000円チャレンジ #マーラータン #1g4円`;
    const url = window.location.href;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const getRankBadgeColor = (rank: GameResult['rank']) => {
    switch (rank) {
      case 'SSS':
        return 'bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 text-red-950 border-amber-300 shadow-yellow-500/50';
      case 'SS':
        return 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-purple-300 shadow-purple-500/50';
      case 'S':
        return 'bg-gradient-to-r from-red-600 to-amber-600 text-white border-amber-300 shadow-red-500/50';
      case 'A':
        return 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-300 shadow-emerald-500/50';
      case 'B':
        return 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-blue-300 shadow-blue-500/50';
      case 'C':
        return 'bg-gradient-to-r from-stone-500 to-stone-700 text-white border-stone-400';
      default:
        return 'bg-stone-400 text-stone-900 border-stone-500';
    }
  };

  return (
    // ×ボタンや背景タップで戻れない固定モーダル（1発勝負でお会計！）
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-amber-50 to-stone-100 rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden my-auto">
        {/* Header bar (×ボタンは完全に撤廃) */}
        <div className="bg-gradient-to-r from-red-800 via-red-700 to-amber-800 p-3.5 sm:p-4 text-white text-center relative border-b-2 border-amber-400 shadow-md">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">🍲</span>
            <h2 className="text-lg sm:text-2xl font-black tracking-wide text-amber-200">
              {measuring ? '⚖️ 計量＆お会計中...' : '🧾 お会計レシート＆完成発表'}
            </h2>
          </div>
        </div>

        {/* Modal Main Body: 2 Columns on desktop (左: 完成したお皿 / 右: スケール＆レシート) */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left Column: 作ったお皿（完成した麻辣湯ボウルプレビュー） */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-stone-900/10 p-3 sm:p-4 rounded-3xl border-2 border-amber-300/60 shadow-inner">
            <div className="text-center mb-2">
              <span className="text-xs font-black text-red-900 bg-amber-200 px-3 py-1 rounded-full border border-amber-300 inline-block shadow-xs">
                ✨ あなたが作った麻辣湯 ✨
              </span>
              <div className="text-[11px] text-stone-600 font-bold mt-1">
                スープ: {result.soup.name}
              </div>
            </div>

            {/* Bowl Container */}
            <div className="relative w-full max-w-[270px] aspect-square rounded-full bg-gradient-to-br from-stone-100 via-stone-200 to-stone-400 p-3 shadow-2xl border-4 border-amber-500 flex items-center justify-center">
              {/* Decorative Red Rim */}
              <div className="absolute inset-1.5 rounded-full border-4 border-red-700 pointer-events-none opacity-90 shadow-inner flex items-center justify-center">
                <div className="w-full h-full rounded-full border border-dashed border-amber-400 opacity-60"></div>
              </div>

              {/* Soup Surface */}
              <div
                className="relative w-full h-full rounded-full overflow-hidden shadow-inner select-none pointer-events-none"
                style={{
                  background: result.soup.bgGradient,
                }}
              >
                {/* Steam */}
                <div className="absolute inset-0 flex items-center justify-center opacity-70">
                  <div className="steam-particle w-16 h-24 rounded-full bg-white/20 blur-lg"></div>
                  <div className="steam-particle steam-delayed-1 w-14 h-20 rounded-full bg-white/15 blur-md ml-6 -mt-4"></div>
                </div>

                {/* Placed Ingredients Rendering (スケール比率調整で忠実に再現) */}
                {placedIngredients.map((item) => {
                  const def = ingredientsMap.get(item.ingredientId);
                  if (!def) return null;

                  // 丼の基準サイズ(約360px)からミニボウル(約240px)へのスケール比率 (240 / 360 ≈ 0.67)
                  const scaleFactor = 0.68;
                  const miniX = item.x * scaleFactor;
                  const miniY = item.y * scaleFactor;

                  return (
                    <div
                      key={item.instanceId}
                      style={{
                        position: 'absolute',
                        left: `${miniX}px`,
                        top: `${miniY}px`,
                        transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${
                          (def.defaultScale || 1) * scaleFactor
                        })`,
                        zIndex: item.zIndex,
                      }}
                    >
                      <img
                        src={def.image}
                        alt={def.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-2 text-center text-stone-500 text-[11px] font-bold">
              盛り付け具材: <span className="text-red-700 font-black">{placedIngredients.length}</span> 品
            </div>
          </div>

          {/* Right Column: 電子スケール＆お会計レシート＆スコア */}
          <div className="lg:col-span-7 space-y-4">
            {/* Digital Scale Machine Display */}
            <div className="bg-gradient-to-b from-stone-900 to-stone-950 rounded-2xl p-4 border-4 border-stone-700 shadow-inner text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>

              <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-stone-400 uppercase border-b border-stone-800 pb-1 mb-2">
                <span>RATE: 1g = 4円</span>
                <span className="text-amber-400 font-mono">TARGET: 1,000円 (250g)</span>
              </div>

              {/* Big LED Numbers (金額メイン表示) */}
              <div className="my-1 flex items-baseline justify-center gap-1 font-mono-scale">
                <span
                  className={`text-5xl sm:text-6xl font-black tracking-tighter ${
                    measuring
                      ? 'text-amber-400 animate-pulse'
                      : result.diffPrice === 0
                      ? 'text-emerald-400 drop-shadow-[0_0_18px_rgba(52,211,153,0.9)]'
                      : result.diffPrice <= 20
                      ? 'text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.7)]'
                      : 'text-amber-400'
                  }`}
                >
                  {displayPrice.toLocaleString()}
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-stone-300">円</span>
              </div>

              {/* Sub-LED: Weight display */}
              <div className="text-stone-400 font-mono text-sm sm:text-base font-bold flex items-center justify-center gap-2">
                <span>重量:</span>
                <span className="text-white font-black">{displayWeight.toFixed(1)}</span>
                <span>g</span>
              </div>

              {/* Difference / status indicator */}
              {!measuring && (
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold mt-2 bg-stone-800 text-stone-200 border border-stone-700">
                  {result.diffPrice === 0 ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Sparkles size={14} /> 奇跡のピッタリ 1,000円 (250.0g) 達成！！
                    </span>
                  ) : (
                    <span>
                      目標まで{' '}
                      <strong
                        className={
                          result.totalPrice > 1000 ? 'text-red-400' : 'text-blue-400'
                        }
                      >
                        {result.totalPrice > 1000 ? '+' : '-'}
                        {result.diffPrice}円
                      </strong>
                      <span className="text-stone-400 text-[10px] ml-1">
                        ({result.totalWeight > 250 ? '+' : '-'}
                        {result.diffWeight}g)
                      </span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Result Card (計量完了後にフェードイン) */}
            {!measuring && (
              <div className="space-y-3.5 animate-fadeIn">
                {/* Score & Rank Banner */}
                <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border-2 border-amber-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    {/* Rank Stamp */}
                    <div
                      className={`w-13 h-13 rounded-2xl flex flex-col items-center justify-center font-black border-2 shadow-md ${getRankBadgeColor(
                        result.rank
                      )}`}
                    >
                      <span className="text-[9px] leading-none opacity-80 uppercase">RANK</span>
                      <span className="text-2xl leading-none mt-0.5">{result.rank}</span>
                    </div>

                    <div>
                      <span className="text-xs text-stone-500 font-bold block">獲得スコア</span>
                      <span className="text-xl sm:text-2xl font-black text-red-700">
                        {result.score.toLocaleString()}
                        <span className="text-xs font-bold text-stone-600 ml-1">点</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-500 font-medium block">称号</span>
                    <span className="text-xs font-black text-amber-900 bg-amber-100 px-2 py-1 rounded-lg border border-amber-300">
                      {result.title}
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div className="bg-amber-100/70 p-3 rounded-2xl border border-amber-300/80 text-stone-800 text-xs leading-relaxed">
                  <div className="flex items-center gap-1 text-red-800 font-black mb-0.5">
                    <Award size={15} className="text-amber-600" />
                    <span>店主からの評価コメント</span>
                  </div>
                  <p className="text-stone-700">{result.comment}</p>
                </div>

                {/* Receipt Details (レシート明細) */}
                <div className="bg-white p-3 rounded-2xl border border-dashed border-stone-300 font-mono text-xs text-stone-700">
                  <div className="text-center font-bold text-stone-600 border-b border-dashed border-stone-300 pb-1 mb-1.5">
                    🍲 麻辣湯 量り売りお会計伝票 (1g＝4円) 🍲
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                    {result.items.map((item, index) => (
                      <div
                        key={item.instanceId || index}
                        className="flex items-center justify-between text-[11px]"
                      >
                        <span className="truncate pr-2 font-medium">{item.ingredient.name}</span>
                        <div className="text-right shrink-0">
                          <span className="text-stone-400 mr-2">{item.actualWeight.toFixed(1)}g</span>
                          <span className="font-bold text-stone-900">{item.price}円</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-dashed border-stone-300 pt-1.5 mt-1.5 space-y-0.5">
                    <div className="flex justify-between text-xs text-stone-600">
                      <span>総重量 ({result.items.length}品):</span>
                      <span className="font-bold">{result.totalWeight.toFixed(1)}g</span>
                    </div>
                    <div className="flex justify-between font-black text-sm text-red-950 pt-0.5">
                      <span>お会計合計:</span>
                      <span>{result.totalPrice.toLocaleString()}円</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons (×ボタンでの後戻りは不可！再挑戦かシェアのみ) */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <button
                    onClick={handleShare}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                  >
                    <Share2 size={16} />
                    <span>X (Twitter) で結果をシェア</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onRestart();
                    }}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 border border-amber-300"
                  >
                    <RefreshCw size={16} />
                    <span>もう一度盛る！（新規挑戦）</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
