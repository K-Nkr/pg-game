import React from 'react';
import { X, History, Trash2 } from 'lucide-react';
import { GameResult } from '../types/game';
import { BestStats } from '../utils/storage';
import { sound } from '../utils/audio';

interface RecipeHistoryModalProps {
  history: GameResult[];
  bestStats: BestStats;
  onClose: () => void;
  onClearHistory: () => void;
}

export const RecipeHistoryModal: React.FC<RecipeHistoryModalProps> = ({
  history,
  bestStats,
  onClose,
  onClearHistory,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-800 to-amber-800 p-4 text-white text-center relative border-b-2 border-amber-400">
          <h2 className="text-xl font-black text-amber-200 flex items-center justify-center gap-2">
            <History size={22} />
            <span>注文履歴＆自己ベスト</span>
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

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Best Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              <span className="text-[10px] text-stone-500 font-bold block">最高スコア</span>
              <span className="text-lg font-black text-red-700">
                {bestStats.bestScore.toLocaleString()}
              </span>
            </div>
            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              <span className="text-[10px] text-stone-500 font-bold block">最小誤差</span>
              <span className="text-lg font-black text-amber-800">
                {bestStats.minDiffPrice === 9999 ? '-' : `±${bestStats.minDiffPrice}円`}
              </span>
            </div>
            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              <span className="text-[10px] text-stone-500 font-bold block">1,000円達成</span>
              <span className="text-lg font-black text-emerald-700">
                {bestStats.perfectCount}回
              </span>
            </div>
            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              <span className="text-[10px] text-stone-500 font-bold block">総来店数</span>
              <span className="text-lg font-black text-stone-700">
                {bestStats.playCount}回
              </span>
            </div>
          </div>

          {/* History List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-xs text-stone-700">
                過去の麻辣湯 ({history.length}件)
              </h3>
              {history.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('履歴をリセットしますか？')) {
                      sound.playRemove();
                      onClearHistory();
                    }
                  }}
                  className="text-[11px] text-red-600 hover:text-red-800 flex items-center gap-1 font-bold"
                >
                  <Trash2 size={12} />
                  <span>履歴消去</span>
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="py-8 text-center text-stone-400 text-xs">
                まだ履歴がありません。1,000円麻辣湯に挑戦しよう！
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-red-700 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {item.rank}
                      </span>
                      <div>
                        <div className="font-bold text-stone-800 truncate max-w-[170px] sm:max-w-[220px]">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {item.date} • {item.soup.name} ({item.items.length}品)
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-sm text-stone-900 font-mono">
                        {item.totalPrice.toLocaleString()}円
                      </div>
                      <div className="text-[10px] text-stone-500 font-bold">
                        {item.totalWeight.toFixed(1)}g ({item.score.toLocaleString()}点)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
