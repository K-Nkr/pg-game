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
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Title / Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative w-11 h-11 bg-amber-400 rounded-full flex items-center justify-center shadow-inner text-2xl border-2 border-amber-200 animate-pulse">
            🍲
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-400 text-red-950 font-black px-2 py-0.5 rounded-full tracking-wider uppercase">
                Málàtàng 100g
              </span>
              {bestStats.perfectCount > 0 && (
                <span className="text-xs bg-yellow-300 text-red-900 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Sparkles size={12} className="text-amber-700" />
                  100g達成: {bestStats.perfectCount}回
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-amber-100 drop-shadow">
              麻辣湯 100g ピッタリ選手権
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Best Score Badge */}
          {bestStats.bestScore > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 bg-red-900/80 px-3 py-1.5 rounded-xl border border-amber-400/40 text-xs font-bold text-amber-200">
              <Award size={15} className="text-amber-400" />
              <span>最高: {bestStats.bestScore.toLocaleString()}点</span>
              {bestStats.minDiff < 999 && (
                <span className="text-amber-300 font-mono">
                  (誤差±{bestStats.minDiff}g)
                </span>
              )}
            </div>
          )}

          {/* How to Play */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenHowTo();
            }}
            className="p-2 bg-red-900/60 hover:bg-red-900 rounded-xl text-amber-200 border border-amber-400/30 transition-all flex items-center gap-1 text-xs font-bold"
            title="遊び方"
            aria-label="遊び方"
          >
            <HelpCircle size={18} />
            <span className="hidden sm:inline">遊び方</span>
          </button>

          {/* History */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenHistory();
            }}
            className="p-2 bg-red-900/60 hover:bg-red-900 rounded-xl text-amber-200 border border-amber-400/30 transition-all flex items-center gap-1 text-xs font-bold"
            title="注文履歴・記録"
            aria-label="履歴"
          >
            <History size={18} />
            <span className="hidden sm:inline">履歴</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
            }}
            className="p-2 bg-red-900/60 hover:bg-red-900 rounded-xl text-amber-200 border border-amber-400/30 transition-all"
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
