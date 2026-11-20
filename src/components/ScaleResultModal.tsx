import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Share2, RefreshCw, X, Award, Sparkles } from 'lucide-react';
import { GameResult } from '../types/game';
import { sound } from '../utils/audio';

interface ScaleResultModalProps {
  result: GameResult;
  onClose: () => void;
  onRestart: () => void;
}

export const ScaleResultModal: React.FC<ScaleResultModalProps> = ({
  result,
  onClose,
  onRestart,
}) => {
  const [measuring, setMeasuring] = useState<boolean>(true);
  const [displayWeight, setDisplayWeight] = useState<number>(0);

  // デジタルスケールのカウントアップ測定アニメーション
  useEffect(() => {
    let current = 0;
    const target = result.totalWeight;
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
      current = Math.round(target * ease * 10) / 10;
      setDisplayWeight(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        clearInterval(tickInterval);
        setDisplayWeight(target);
        setMeasuring(false);

        const isPerfect = result.diff === 0;
        sound.playScaleDone(isPerfect);

        // 好記録（誤差1g以内）なら紙吹雪発射！
        if (result.diff <= 1.0) {
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
    const count = isSuper ? 200 : 90;
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
        ? '🏆【神計量SSS】'
        : result.rank === 'SS'
        ? '✨【SSランク】'
        : result.rank === 'S'
        ? '🌟【Sランク】'
        : '🍜';
    const text = `${rankEmoji} 麻辣湯100gピッタリ選手権で【${result.totalWeight}g】(誤差±${result.diff}g) を達成！\n称号:『${result.title}』\nスコア: ${result.score.toLocaleString()}点！\n\nあなたもピッタリ100gの麻辣湯を作れるか挑戦してみてね！ #麻辣湯100gチャレンジ #マーラータン`;
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
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-amber-50 to-stone-100 rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden my-auto">
        {/* Chinese decorative header bar */}
        <div className="bg-gradient-to-r from-red-800 via-red-700 to-amber-800 p-4 text-white text-center relative border-b-2 border-amber-400">
          <h2 className="text-xl sm:text-2xl font-black tracking-wide text-amber-200">
            {measuring ? '⚖️ 計量中...' : '🧾 お会計・計量結果'}
          </h2>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-3 right-3 p-1 text-amber-200 hover:text-white rounded-full bg-red-900/60 hover:bg-red-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* Digital Scale Machine Display (電子はかり) */}
          <div className="bg-gradient-to-b from-stone-900 to-stone-950 rounded-2xl p-4 sm:p-5 border-4 border-stone-700 shadow-inner text-center relative overflow-hidden">
            {/* Scale Plate highlight */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>

            <span className="text-[11px] font-bold tracking-widest text-stone-400 uppercase">
              HIGH PRECISION SCALE 100.0g TARGET
            </span>

            {/* Big LED Numbers */}
            <div className="my-2 flex items-baseline justify-center gap-1 font-mono-scale">
              <span
                className={`text-5xl sm:text-6xl font-black tracking-tighter ${
                  measuring
                    ? 'text-amber-400 animate-pulse'
                    : result.diff === 0
                    ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]'
                    : result.diff <= 1.0
                    ? 'text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.7)]'
                    : 'text-amber-400'
                }`}
              >
                {displayWeight.toFixed(1)}
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-stone-400">g</span>
            </div>

            {/* Difference / status indicator */}
            {!measuring && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold mt-1 bg-stone-800 text-stone-200 border border-stone-700">
                {result.diff === 0 ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Sparkles size={14} /> ピッタリ 100.0g 達成！
                  </span>
                ) : (
                  <span>
                    目標まで{' '}
                    <strong
                      className={
                        result.totalWeight > 100 ? 'text-red-400' : 'text-blue-400'
                      }
                    >
                      {result.totalWeight > 100 ? '+' : '-'}
                      {result.diff}g
                    </strong>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Result Card (計量完了後にフェードイン) */}
          {!measuring && (
            <div className="space-y-4 animate-fadeIn">
              {/* Score & Rank Banner */}
              <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border-2 border-amber-200 shadow-sm">
                <div className="flex items-center gap-3">
                  {/* Rank Stamp */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black border-2 shadow-lg ${getRankBadgeColor(
                      result.rank
                    )}`}
                  >
                    <span className="text-[10px] leading-none opacity-80 uppercase">RANK</span>
                    <span className="text-2xl leading-none mt-0.5">{result.rank}</span>
                  </div>

                  <div>
                    <span className="text-xs text-stone-500 font-bold block">獲得スコア</span>
                    <span className="text-2xl font-black text-red-700">
                      {result.score.toLocaleString()}
                      <span className="text-xs font-bold text-stone-600 ml-1">点</span>
                    </span>
                  </div>
                </div>

                {/* Soup Badge */}
                <div className="text-right">
                  <span className="text-[11px] text-stone-500 font-medium block">スープ</span>
                  <span className="text-xs font-bold text-stone-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    {result.soup.name}
                  </span>
                </div>
              </div>

              {/* Title & Comment */}
              <div className="bg-amber-100/70 p-3.5 rounded-2xl border border-amber-300/80 text-stone-800">
                <div className="flex items-center gap-1.5 text-red-800 font-black text-sm sm:text-base">
                  <Award size={18} className="text-amber-600" />
                  <span>称号: 『{result.title}』</span>
                </div>
                <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                  {result.comment}
                </p>
              </div>

              {/* Receipt Details (レシート風明細) */}
              <div className="bg-white p-3 rounded-2xl border border-dashed border-stone-300 font-mono text-xs text-stone-700">
                <div className="text-center font-bold text-stone-500 border-b border-dashed border-stone-300 pb-1.5 mb-2">
                  🍲 麻辣湯 トッピング明細 🍲
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                  {result.items.map((item, index) => (
                    <div
                      key={item.instanceId || index}
                      className="flex items-center justify-between text-[11px]"
                    >
                      <span className="truncate pr-2">{item.ingredient.name}</span>
                      <span className="font-bold text-stone-900 whitespace-nowrap">
                        {item.actualWeight.toFixed(1)}g
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-dashed border-stone-300 pt-1.5 mt-2 flex justify-between font-bold text-xs text-red-950">
                  <span>合計重量 ({result.items.length}品):</span>
                  <span>{result.totalWeight.toFixed(1)}g</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                {/* Twitter Share */}
                <button
                  onClick={handleShare}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Share2 size={16} />
                  <span>X (Twitter) で結果をシェア</span>
                </button>

                {/* Try Again */}
                <button
                  onClick={() => {
                    sound.playClick();
                    onRestart();
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 border border-amber-300"
                >
                  <RefreshCw size={16} />
                  <span>もう一度作る！</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
