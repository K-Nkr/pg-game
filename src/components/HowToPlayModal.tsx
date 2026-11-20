import React from 'react';
import { X, HelpCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-800 to-amber-800 p-4 text-white text-center relative border-b-2 border-amber-400">
          <h2 className="text-xl font-black text-amber-200 flex items-center justify-center gap-2">
            <HelpCircle size={22} />
            <span>麻辣湯1000円選手権の遊び方</span>
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

        {/* Content (ヒント＆キラキラマークの説明は完全削除) */}
        <div className="p-5 space-y-4 text-stone-700 text-xs sm:text-sm">
          {/* Rule Overview */}
          <div className="bg-red-50 p-3.5 rounded-2xl border-2 border-red-300 text-center">
            <span className="text-xs text-red-700 font-bold block">【基本ルール】</span>
            <span className="text-lg font-black text-red-900">
              1グラム ＝ 4円！ 目標金額は 1,000円（250g）
            </span>
          </div>

          {/* Step 1 */}
          <div className="flex gap-3 items-start bg-amber-50 p-3 rounded-2xl border border-amber-200">
            <div className="w-7 h-7 rounded-full bg-red-700 text-white font-black flex items-center justify-center shrink-0 text-xs">
              1
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">
                お好みのスープを選ぶ！
              </h3>
              <p className="mt-0.5 text-stone-600">
                定番中辛、本格激辛、濃厚白湯、完熟トマト麻辣から今日のスープを選びます。
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-3 items-start bg-amber-50 p-3 rounded-2xl border border-amber-200">
            <div className="w-7 h-7 rounded-full bg-red-700 text-white font-black flex items-center justify-center shrink-0 text-xs">
              2
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">
                具材を自由にトッピング＆レイアウト！
              </h3>
              <p className="mt-0.5 text-stone-600">
                パレットから具材をタップしてボウルに盛り付けます。具材をタップして<strong>回転</strong>や<strong>削除</strong>、ドラッグ移動で好きなように配置できます。
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-3 items-start bg-amber-50 p-3 rounded-2xl border border-amber-200">
            <div className="w-7 h-7 rounded-full bg-red-700 text-white font-black flex items-center justify-center shrink-0 text-xs">
              3
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">
                重さは隠しパラメータ！目指せピッタリ 1,000円 ⚖️
              </h3>
              <p className="mt-0.5 text-stone-600">
                具材の重さは秘密！1g＝4円なので、<strong>ピッタリ250.0g盛るとジャスト1,000円</strong>になります！寸分の狂いもなく1,000円を叩き出すと、最高ランク『SSS 神会計麻辣湯仙人』の称号を獲得！
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-white font-black text-sm shadow-md transition-all active:scale-95 border border-amber-300"
          >
            さっそく挑戦する！
          </button>
        </div>
      </div>
    </div>
  );
};
