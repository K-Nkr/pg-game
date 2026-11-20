import React from 'react';
import { Volume2, VolumeX, HelpCircle, History, Sparkles, Award } from 'lucide-react';
import { sound } from '../utils/audio';
import { BestStats } from '../utils/storage';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHowTo: () => void;
  onOpenHistory: () => void;
  bestStats: BestStats;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenHowTo,
  onOpenHistory,
  bestStats,
}) => {
  return (
    <header className="w-full bg-gradient-to-r from-red-800 via-red-700 to-amber-800 text-white shadow-lg border-b-4 border-amber-400">
      <div className="max-w-6xl mx-auto px-3 py-2 flex items-center justify-between gap-2">
        {/* Title / Logo */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative w-9 h-9 shrink-0 bg-amber-400 rounded-full flex items-center justify-center shadow-inner text-xl border-2 border-amber-200 animate-pulse">
            🍲
          </div>
          <div className="min-w-0">
            {/* サブ情報（1g=4円など）*/}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[10px] bg-amber-400 text-red-950 font-black px-1.5 py-0.5 rounded-full tracking-wider">
                1g＝4円
              </span>
              <span className="text-[10px] bg-red-950/80 text-amber-300 font-bold px-1.5 py-0.5 rounded-full border border-amber-400/40">
                目標 1,000円
              </span>
              {bestStats.perfectCount > 0 && (
                <span className="text-[10px] bg-yellow-300 text-red-900 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                  <Sparkles size={10} className="text-amber-700" />
                  達成{bestStats.perfectCount}回
                </span>
              )}
            </div>
            <h1 className="text-base sm:text-xl font-black tracking-tight text-amber-100 drop-shadow leading-tight">
              麻辣湯 1,000円ピッタリ選手権
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Best Score Badge - PCのみ表示 */}
          {bestStats.bestScore > 0 && (
            <div className="hidden sm:flex items-center gap-1 bg-red-900/80 px-2 py-1 rounded-xl border border-amber-400/40 text-xs font-bold text-amber-200">
              <Award size={13} className="text-amber-400" />
              <span>最高: {bestStats.bestScore.toLocaleString()}点</span>
            </div>
          )}

          {/* How to Play */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenHowTo();
            }}
            className="p-2 bg-red-900/60 hover:bg-red-900 active:bg-red-950 rounded-xl text-amber-200 border border-amber-400/30 transition-all"
            title="遊び方"
            aria-label="遊び方"
          >
            <HelpCircle size={18} />
          </button>

          {/* History */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenHistory();
            }}
            className="p-2 bg-red-900/60 hover:bg-red-900 active:bg-red-950 rounded-xl text-amber-200 border border-amber-400/30 transition-all"
            title="注文履歴・記録"
            aria-label="履歴"
          >
            <History size={18} />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 bg-red-900/60 hover:bg-red-900 active:bg-red-950 rounded-xl text-amber-200 border border-amber-400/30 transition-all"
            title={soundEnabled ? '音声をミュート' : '音声を有効化'}
            aria-label="サウンド切替"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-stone-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
