import React from 'react';
import { X, Sparkles, HelpCircle } from 'lucide-react';
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
            <span>麻辣湯100g選手権の遊び方</span>
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
        <div className="p-5 space-y-4 text-stone-700 text-xs sm:text-sm">
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
                定番の中辛、痺れる本格大辛、マイルドな白湯、完熟トマト麻辣から今日のスープを選びます。
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
                下のパレットから具材をタップして丼に入れます。具材は自由にドラッグ移動可能！
                タップすると<strong>回転</strong>や<strong>✨キラキラ最前面エフェクト</strong>、<strong>削除</strong>ができます。
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
                重さは隠しパラメータ！目指せピッタリ 100.0g ⚖️
              </h3>
              <p className="mt-0.5 text-stone-600">
                各具材の重さは<strong>完全非表示の隠しパラメータ</strong>！本物の麻辣湯のリアルな重量をもとに設定されています。あなたの料理勘を研ぎ澄まして、ピッタリ100.0gの神計量を目指しましょう！
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-red-50 p-3 rounded-2xl border border-red-200 text-red-900">
            <h4 className="font-black flex items-center gap-1.5 text-xs">
              <Sparkles size={14} className="text-amber-600" />
              <span>現実の麻辣湯に基づくヒント</span>
            </h4>
            <ul className="mt-1 space-y-1 text-[11px] text-red-800 list-disc list-inside">
              <li>麺（特太タンミョン・中華麺）は1玉で約45〜48g！一気に半分近く占めます。</li>
              <li>厚切りスパムや牛肉は重量感があり、青梗菜も水分で意外とずっしり。</li>
              <li>うずらの卵（約11g）やパクチー（約6g）、きくらげ（約10g）は微調整に最適！</li>
            </ul>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-white font-black text-sm shadow-md transition-all active:scale-95 border border-amber-300"
          >
            さっそく遊ぶ！
          </button>
        </div>
      </div>
    </div>
  );
};
