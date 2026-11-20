import React, { useRef, useState, useEffect } from 'react';
import { Trash2, RotateCw, Scale, RefreshCw } from 'lucide-react';
import { PlacedIngredient, Ingredient, SoupType } from '../types/game';
import { SOUP_TYPES } from '../data/ingredients';
import { sound } from '../utils/audio';

interface BowlStageProps {
  placedIngredients: PlacedIngredient[];
  ingredientsMap: Map<string, Ingredient>;
  selectedSoup: SoupType;
  onSelectSoup: (soup: SoupType) => void;
  onUpdateIngredient: (instanceId: string, updates: Partial<PlacedIngredient>) => void;
  onRemoveIngredient: (instanceId: string) => void;
  onClearBowl: () => void;
  onMeasureBowl: () => void;
}

export const BowlStage: React.FC<BowlStageProps> = ({
  placedIngredients,
  ingredientsMap,
  selectedSoup,
  onSelectSoup,
  onUpdateIngredient,
  onRemoveIngredient,
  onClearBowl,
  onMeasureBowl,
}) => {
  const bowlRef = useRef<HTMLDivElement>(null);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // 丼内タップで選択解除
  const handleBowlBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === bowlRef.current || (e.target as HTMLElement).classList.contains('soup-surface')) {
      setSelectedInstanceId(null);
    }
  };

  // ドラッグ開始（マウス & タッチ）
  const handleStartDrag = (
    e: React.MouseEvent | React.TouchEvent,
    item: PlacedIngredient
  ) => {
    e.stopPropagation();
    setSelectedInstanceId(item.instanceId);
    setDraggingId(item.instanceId);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (bowlRef.current) {
      const rect = bowlRef.current.getBoundingClientRect();
      setDragOffset({
        x: clientX - (rect.left + item.x),
        y: clientY - (rect.top + item.y),
      });
    }

    sound.playClick();
  };

  // ドラッグ中の移動処理
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!draggingId || !bowlRef.current) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const rect = bowlRef.current.getBoundingClientRect();
      const radius = rect.width / 2;
      const centerX = radius;
      const centerY = radius;

      // 丼の中心からの相対位置
      let newX = clientX - rect.left - dragOffset.x;
      let newY = clientY - rect.top - dragOffset.y;

      // 丼の円形境界制限（ボウルの中に収まるようにクランプ）
      const maxRadius = radius * 0.78;
      const dx = newX - centerX;
      const dy = newY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > maxRadius) {
        newX = centerX + (dx / dist) * maxRadius;
        newY = centerY + (dy / dist) * maxRadius;
      }

      onUpdateIngredient(draggingId, { x: newX, y: newY });
    };

    const handleEnd = () => {
      if (draggingId) {
        sound.playDrop(1.1);
        setDraggingId(null);
      }
    };

    if (draggingId) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [draggingId, dragOffset, onUpdateIngredient]);

  // 回転操作
  const handleRotate = (instanceId: string, currentRotation: number) => {
    sound.playClick();
    onUpdateIngredient(instanceId, {
      rotation: (currentRotation + 45) % 360,
    });
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Soup Selector Bar */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3 px-2 w-full max-w-lg">
        {SOUP_TYPES.map((soup) => (
          <button
            key={soup.id}
            onClick={() => {
              sound.playClick();
              onSelectSoup(soup);
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 border ${
              selectedSoup.id === soup.id
                ? 'bg-red-800 text-amber-200 border-amber-400 shadow-md scale-105'
                : 'bg-white/80 text-stone-700 border-stone-200 hover:bg-white'
            }`}
          >
            <span className="truncate w-full text-center">{soup.name}</span>
            <span className="text-[10px] opacity-80">
              {soup.spiciness === 0
                ? '白湯'
                : '🌶️'.repeat(Math.min(soup.spiciness, 3))}
            </span>
          </button>
        ))}
      </div>

      {/* Main Bowl Arena */}
      <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center p-3">
        {/* Outer Bowl Rim with Chinese Pattern (どんぶりの外枠・陶器) */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-stone-100 via-stone-200 to-stone-400 p-4 sm:p-5 shadow-2xl border-4 border-amber-500 flex items-center justify-center">
          {/* Decorative Red Rim Band */}
          <div className="absolute inset-1.5 sm:inset-2 rounded-full border-4 sm:border-[6px] border-red-700 pointer-events-none opacity-90 shadow-inner flex items-center justify-center">
            <div className="w-full h-full rounded-full border border-dashed border-amber-400 opacity-60"></div>
          </div>

          {/* Soup Basin (スープの内側エリア) */}
          <div
            ref={bowlRef}
            onClick={handleBowlBackgroundClick}
            className="soup-surface relative w-full h-full rounded-full overflow-hidden shadow-inner cursor-crosshair select-none"
            style={{
              background: selectedSoup.bgGradient,
            }}
          >
            {/* Soup Shimmer & Oil droplets effect */}
            <div className="absolute inset-0 soup-ripple pointer-events-none opacity-40 mix-blend-overlay bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.8),transparent_60%)]"></div>
            
            {/* Chili Oil Dots (辛味油膜のアクセント) */}
            {selectedSoup.spiciness > 0 && (
              <>
                <div className="absolute top-1/4 left-1/3 w-8 h-8 rounded-full bg-red-600/30 blur-sm pointer-events-none"></div>
                <div className="absolute bottom-1/3 right-1/4 w-12 h-12 rounded-full bg-orange-600/30 blur-sm pointer-events-none"></div>
                <div className="absolute top-1/2 right-1/3 w-6 h-6 rounded-full bg-amber-500/30 blur-xs pointer-events-none"></div>
              </>
            )}

            {/* Rising Steam Animations (湯気) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="steam-particle w-24 h-32 rounded-full bg-white/20 blur-xl"></div>
              <div className="steam-particle steam-delayed-1 w-20 h-28 rounded-full bg-white/15 blur-lg ml-8 -mt-6"></div>
              <div className="steam-particle steam-delayed-2 w-28 h-36 rounded-full bg-white/15 blur-xl -ml-10 -mt-10"></div>
            </div>

            {/* Empty Bowl Guide Message */}
            {placedIngredients.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
                <span className="text-3xl mb-1 animate-bounce">👇</span>
                <p className="text-white font-black text-sm sm:text-base drop-shadow-md">
                  下のパレットから具材をタップ！
                </p>
                <p className="text-amber-200 text-xs mt-1 drop-shadow font-bold">
                  1g＝4円！勘を頼りにピッタリ1,000円（250g）を目指そう！ ⚖️
                </p>
              </div>
            )}

            {/* Placed Ingredients (トッピング具材群) */}
            {placedIngredients.map((item) => {
              const def = ingredientsMap.get(item.ingredientId);
              if (!def) return null;

              const isSelected = selectedInstanceId === item.instanceId;
              const isBeingDragged = draggingId === item.instanceId;

              return (
                <div
                  key={item.instanceId}
                  onMouseDown={(e) => handleStartDrag(e, item)}
                  onTouchStart={(e) => handleStartDrag(e, item)}
                  style={{
                    position: 'absolute',
                    left: `${item.x}px`,
                    top: `${item.y}px`,
                    transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${
                      (def.defaultScale || 1) * (isBeingDragged ? 1.15 : 1)
                    })`,
                    zIndex: item.zIndex + (isSelected ? 20 : 0),
                    cursor: isBeingDragged ? 'grabbing' : 'grab',
                    transition: isBeingDragged ? 'none' : 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className={`group select-none touch-none ${
                    isSelected ? 'ring-2 ring-amber-300 ring-offset-2 ring-offset-transparent rounded-full' : ''
                  }`}
                >
                  <img
                    src={def.image}
                    alt={def.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain pointer-events-none drop-shadow-lg"
                    draggable={false}
                  />

                  {/* Selected Ingredient Quick Controls Bubble (回転＆削除のシンプル構成) */}
                  {isSelected && (
                    <div
                      className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-stone-900/95 text-white px-2.5 py-1 rounded-full shadow-2xl border border-amber-400 text-xs z-50 pointer-events-auto backdrop-blur-md"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Rotate */}
                      <button
                        onClick={() => handleRotate(item.instanceId, item.rotation)}
                        className="p-1 hover:text-amber-300 transition-colors flex items-center justify-center"
                        title="回転"
                        aria-label="回転"
                      >
                        <RotateCw size={14} />
                      </button>

                      <span className="w-px h-3 bg-stone-600"></span>

                      {/* Remove */}
                      <button
                        onClick={() => {
                          sound.playRemove();
                          onRemoveIngredient(item.instanceId);
                        }}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors flex items-center justify-center"
                        title="具材を削除"
                        aria-label="削除"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bowl Sub-bar */}
      <div className="flex items-center justify-between w-full max-w-md px-3 mt-1 gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-amber-100/90 px-3.5 py-1.5 rounded-xl border border-amber-300/70 shadow-xs">
          <span>具材:</span>
          <span className="text-red-700 font-black text-sm">{placedIngredients.length}</span>
          <span>品</span>
          <span className="text-[11px] text-amber-900 border-l border-amber-300/80 pl-2 font-black">
            目標: 1,000円 (250g)
          </span>
          <span className="text-[10px] text-stone-500 hidden sm:inline">
            (1g=4円)
          </span>
        </div>

        {/* Clear Bowl Button */}
        {placedIngredients.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('ボウルを空にして最初からやり直しますか？')) {
                sound.playRemove();
                onClearBowl();
              }
            }}
            className="flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2.5 py-1.5 rounded-xl transition-all border border-red-300 shadow-xs"
          >
            <RefreshCw size={13} />
            <span>リセット</span>
          </button>
        )}
      </div>

      {/* Main Measure CTA */}
      <div className="w-full max-w-md px-3 mt-3">
        <button
          onClick={() => {
            sound.playClick();
            onMeasureBowl();
          }}
          disabled={placedIngredients.length === 0}
          className={`w-full py-3.5 px-6 rounded-2xl font-black text-base sm:text-lg tracking-wide shadow-xl flex items-center justify-center gap-2 transition-all border-2 ${
            placedIngredients.length > 0
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 border-amber-200 hover:scale-[1.02] active:scale-[0.98] animate-pulse'
              : 'bg-stone-300 text-stone-500 border-stone-400 cursor-not-allowed opacity-70'
          }`}
        >
          <Scale size={22} className="text-red-950" />
          <span>計量＆お会計する！（目標1,000円）</span>
        </button>
      </div>
    </div>
  );
};
