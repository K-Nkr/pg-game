import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Ingredient, IngredientCategory, GameMode, PlacedIngredient } from '../types/game';
import { INGREDIENTS } from '../data/ingredients';
import { sound } from '../utils/audio';

interface IngredientPickerProps {
  onAddIngredient: (ingredient: Ingredient) => void;
  placedIngredients: PlacedIngredient[];
  gameMode: GameMode;
}

type TabType = 'all' | IngredientCategory;

export const IngredientPicker: React.FC<IngredientPickerProps> = ({
  onAddIngredient,
  placedIngredients,
  gameMode,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'all', label: 'すべて', icon: '🍲' },
    { id: 'veg', label: '野菜', icon: '🥬' },
    { id: 'meat', label: '肉・魚介', icon: '🥩' },
    { id: 'processed', label: '練り物・豆', icon: '🥟' },
    { id: 'mushroom', label: 'キノコ', icon: '🍄' },
    { id: 'noodle', label: '麺・主食', icon: '🍜' },
  ];

  const filteredIngredients = INGREDIENTS.filter((item) => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  // 各具材が現在ボウルに何個置かれているか
  const countsMap = placedIngredients.reduce<Record<string, number>>((acc, item) => {
    acc[item.ingredientId] = (acc[item.ingredientId] || 0) + 1;
    return acc;
  }, {});

  const handleCardClick = (item: Ingredient) => {
    sound.playDrop();
    onAddIngredient(item);
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border-2 border-amber-200 p-3 sm:p-4">
      {/* Category Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              setActiveTab(tab.id);
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
              activeTab === tab.id
                ? 'bg-red-800 text-amber-200 border-amber-400 shadow-sm scale-102'
                : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Ingredients Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 mt-3 max-h-[380px] overflow-y-auto pr-1">
        {filteredIngredients.map((item) => {
          const count = countsMap[item.id] || 0;

          return (
            <button
              key={item.id}
              onClick={() => handleCardClick(item)}
              className="group relative flex flex-col items-center bg-gradient-to-b from-amber-50/50 to-white hover:from-amber-100/60 hover:to-amber-50 p-2.5 rounded-2xl border border-amber-200/80 hover:border-amber-400 hover:shadow-md transition-all active:scale-95 text-center"
            >
              {/* Placed count badge */}
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-md border-2 border-white animate-bounce">
                  {count}
                </span>
              )}

              {/* Free SVG image of ingredient */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center p-1 group-hover:scale-110 transition-transform">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain filter drop-shadow"
                  loading="lazy"
                />
              </div>

              {/* Name (Japanese + Chinese) */}
              <div className="mt-1 w-full">
                <span className="block text-xs font-bold text-stone-800 truncate">
                  {item.name}
                </span>
                <span className="block text-[10px] text-stone-400 font-medium truncate">
                  {item.nameZh}
                </span>
              </div>

              {/* Flavor / Weight tag */}
              <div className="mt-1 flex items-center justify-between w-full text-[10px] gap-1">
                <span className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 font-bold truncate">
                  {item.flavor}
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-red-50 text-red-700 font-black">
                  {gameMode === 'normal' ? `約${item.baseWeight}g` : '???g'}
                </span>
              </div>

              {/* Plus Overlay Indicator */}
              <div className="absolute inset-0 bg-amber-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-red-700 text-white flex items-center justify-center shadow-lg">
                  <Plus size={18} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
