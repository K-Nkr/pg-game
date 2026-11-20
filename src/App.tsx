import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { BowlStage } from './components/BowlStage';
import { IngredientPicker } from './components/IngredientPicker';
import { ScaleResultModal } from './components/ScaleResultModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { RecipeHistoryModal } from './components/RecipeHistoryModal';
import { INGREDIENTS, SOUP_TYPES } from './data/ingredients';
import { Ingredient, PlacedIngredient, SoupType, GameResult } from './types/game';
import { sound } from './utils/audio';
import { calculateScore } from './utils/scoring';
import { getBestStats, getGameHistory, saveGameResult, BestStats } from './utils/storage';

export const App: React.FC = () => {
  const [placedIngredients, setPlacedIngredients] = useState<PlacedIngredient[]>([]);
  const [selectedSoup, setSelectedSoup] = useState<SoupType>(SOUP_TYPES[0]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals state
  const [showHowTo, setShowHowTo] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<GameResult | null>(null);

  // Persistent stats
  const [bestStats, setBestStats] = useState<BestStats>(getBestStats);
  const [history, setHistory] = useState<GameResult[]>(getGameHistory);

  // 具材マップ（高速ルックアップ用）
  const ingredientsMap = useMemo(() => {
    return new Map<string, Ingredient>(INGREDIENTS.map((i) => [i.id, i]));
  }, []);

  // サウンドのON/OFF切り替え
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playClick();
  };

  // 具材をボウルに追加
  const handleAddIngredient = (ingredient: Ingredient) => {
    // 丼サイズ (基準幅 約360px、中心 x:180, y:180)
    // 自然なばらつきで中央付近に配置
    const angle = Math.random() * Math.PI * 2;
    const distance = 20 + Math.random() * 60;
    const centerX = 180 + Math.cos(angle) * distance;
    const centerY = 180 + Math.sin(angle) * distance;

    // 個体ごとの重さ計算（基本重量 ± ジッター）
    const jitter = (Math.random() * 2 - 1) * ingredient.weightJitter;
    const actualWeight = Math.round((ingredient.baseWeight + jitter) * 10) / 10;

    const maxZ = Math.max(0, ...placedIngredients.map((p) => p.zIndex));

    const newItem: PlacedIngredient = {
      instanceId: `ing_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ingredientId: ingredient.id,
      x: centerX,
      y: centerY,
      rotation: Math.round(Math.random() * 360),
      scale: 1,
      actualWeight,
      zIndex: maxZ + 1,
    };

    setPlacedIngredients((prev) => [...prev, newItem]);
  };

  // 具材の位置・回転更新
  const handleUpdateIngredient = (
    instanceId: string,
    updates: Partial<PlacedIngredient>
  ) => {
    setPlacedIngredients((prev) =>
      prev.map((item) => (item.instanceId === instanceId ? { ...item, ...updates } : item))
    );
  };

  // 具材を削除
  const handleRemoveIngredient = (instanceId: string) => {
    setPlacedIngredients((prev) => prev.filter((item) => item.instanceId !== instanceId));
  };

  // ボウルを空にする
  const handleClearBowl = () => {
    setPlacedIngredients([]);
  };

  // 計量実行
  const handleMeasureBowl = () => {
    if (placedIngredients.length === 0) return;

    const result = calculateScore(placedIngredients, ingredientsMap, selectedSoup);
    saveGameResult(result);
    setBestStats(getBestStats());
    setHistory(getGameHistory());
    setCurrentResult(result);
  };

  // もう一度挑戦（ボウルを初期化してモーダルを閉じる）
  const handleRestart = () => {
    setPlacedIngredients([]);
    setCurrentResult(null);
  };

  // 履歴リセット
  const handleClearHistory = () => {
    localStorage.removeItem('malatang_100g_history_v1');
    setHistory([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 text-stone-800 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      {/* Header */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenHowTo={() => setShowHowTo(true)}
        onOpenHistory={() => setShowHistory(true)}
        bestStats={bestStats}
      />

      {/* Main Game Stage Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-5 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6">
        {/* Left Column: Bowl & Soup & Measure Control */}
        <div className="w-full lg:w-[460px] shrink-0 flex flex-col items-center">
          <BowlStage
            placedIngredients={placedIngredients}
            ingredientsMap={ingredientsMap}
            selectedSoup={selectedSoup}
            onSelectSoup={setSelectedSoup}
            onUpdateIngredient={handleUpdateIngredient}
            onRemoveIngredient={handleRemoveIngredient}
            onClearBowl={handleClearBowl}
            onMeasureBowl={handleMeasureBowl}
          />
        </div>

        {/* Right Column: Ingredients Palette */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-stone-700 flex items-center gap-1.5">
              <span>🥢 トッピング具材を選ぼう</span>
            </h2>
            <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
              重さは秘密！勘で100gを目指そう
            </span>
          </div>

          <IngredientPicker
            onAddIngredient={handleAddIngredient}
            placedIngredients={placedIngredients}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-xs text-stone-400 border-t border-stone-200">
        <p>🍲 麻辣湯 100g ピッタリ選手権 | 目指せ神計量100.0g</p>
      </footer>

      {/* Modals */}
      {currentResult && (
        <ScaleResultModal
          result={currentResult}
          onClose={() => setCurrentResult(null)}
          onRestart={handleRestart}
        />
      )}

      {showHowTo && <HowToPlayModal onClose={() => setShowHowTo(false)} />}

      {showHistory && (
        <RecipeHistoryModal
          history={history}
          bestStats={bestStats}
          onClose={() => setShowHistory(false)}
          onClearHistory={handleClearHistory}
        />
      )}
    </div>
  );
};

export default App;
