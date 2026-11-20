import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Ingredient, IngredientCategory, PlacedIngredient } from '../types/game';
import { INGREDIENTS } from '../data/ingredients';
import { sound } from '../utils/audio';

interface IngredientPickerProps {
  onAddIngredient: (ingredient: Ingredient) => void;
  placedIngredients: PlacedIngredient[];
}

type TabType = 'all' | IngredientCategory;

export const IngredientPicker: React.FC<IngredientPickerProps> = ({
  onAddIngredient,
  placedIngredients,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'all',       label: 'すべて',    icon: '🍲' },
    { id: 'noodle',    label: '麺・主食',  icon: '🍜' },
    { id: 'meat',      label: '肉・魚介',  icon: '🥩' },
    { id: 'processed', label: '練り物・豆', icon: '🥟' },
    { id: 'veg',       label: '野菜',      icon: '🥬' },
    { id: 'mushroom',  label: 'キノコ',    icon: '🍄' },
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
    <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border-2 border-amber-200 p-2.5">
      {/* Category Tabs - 横スクロール */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              setActiveTab(tab.id);
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
              activeTab === tab.id
                ? 'bg-red-800 text-amber-200 border-amber-400 shadow-sm'
                : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200 active:bg-stone-300'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Ingredients - スマホ: 2行横スクロール / PC: グリッド */}
      {/* スマホ: ingredient-scroll で2行横スクロール */}
      <div className="mt-2.5">
        {/* スマホ向け2行横スクロール */}
        <div className="sm:hidden ingredient-scroll scrollbar-none" style={{ gridTemplateRows: 'repeat(2, minmax(0, 1fr))' }}>
          {filteredIngredients.map((item) => {
            const count = countsMap[item.id] || 0;
            return (
              <IngredientCard
                key={item.id}
                item={item}
                count={count}
                onClick={() => handleCardClick(item)}
                compact
              />
            );
          })}
        </div>

        {/* PC向けグリッド */}
        <div className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-[380px] overflow-y-auto pr-1">
          {filteredIngredients.map((item) => {
            const count = countsMap[item.id] || 0;
            return (
              <IngredientCard
                key={item.id}
                item={item}
                count={count}
                onClick={() => handleCardClick(item)}
                compact={false}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 具材カードコンポーネント（compact=スマホ向け小さめ）
interface CardProps {
  item: Ingredient;
  count: number;
  onClick: () => void;
  compact: boolean;
}

const IngredientCard: React.FC<CardProps> = ({ item, count, onClick, compact }) => (
  <button
    onClick={onClick}
    className={`group relative flex flex-col items-center bg-gradient-to-b from-amber-50/50 to-white active:from-amber-100/60 active:to-amber-50 rounded-2xl border border-amber-200/80 active:border-amber-400 active:shadow-md transition-all active:scale-95 text-center ${
      compact ? 'p-1.5 w-[80px]' : 'p-2.5 hover:from-amber-100/60 hover:to-amber-50 hover:border-amber-400 hover:shadow-md'
    }`}
    title={`${item.name} (${item.nameZh})\n${item.description}`}
  >
    {/* Placed count badge */}
    {count > 0 && (
      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white font-black text-[10px] flex items-center justify-center shadow-md border-2 border-white animate-bounce z-10">
        {count}
      </span>
    )}

    {/* Ingredient Image */}
    <div className={`flex items-center justify-center p-0.5 group-active:scale-110 transition-transform ${compact ? 'w-12 h-12' : 'w-16 h-16'}`}>
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-full object-contain filter drop-shadow"
        loading="lazy"
      />
    </div>

    {/* Name */}
    <div className="mt-1 w-full">
      <span className={`block font-bold text-stone-800 truncate ${compact ? 'text-[10px]' : 'text-xs'}`}>
        {item.name}
      </span>
      {!compact && (
        <span className="block text-[10px] text-stone-400 font-medium truncate">
          {item.nameZh}
        </span>
      )}
    </div>

    {/* Flavor badge */}
    <div className="mt-1 w-full">
      <span className={`inline-block w-full py-0.5 px-1 rounded-md bg-amber-100/70 text-amber-900 font-bold truncate border border-amber-200/60 ${compact ? 'text-[8px]' : 'text-[10px]'}`}>
        {item.flavor}
      </span>
    </div>

    {/* Plus Overlay (PC only) */}
    {!compact && (
      <div className="absolute inset-0 bg-amber-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
        <div className="w-7 h-7 rounded-full bg-red-700 text-white flex items-center justify-center shadow-lg">
          <Plus size={16} />
        </div>
      </div>
    )}
  </button>
);
