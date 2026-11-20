import { GameResult } from '../types/game';

const STORAGE_KEY = 'malatang_100g_history_v1';
const BEST_KEY = 'malatang_100g_best_v1';

export interface BestStats {
  bestScore: number;
  minDiff: number;
  perfectCount: number;
  playCount: number;
}

export function saveGameResult(result: GameResult): void {
  try {
    const history = getGameHistory();
    history.unshift(result);
    // 最大20件保持
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 20)));

    const currentBest = getBestStats();
    const updatedBest: BestStats = {
      bestScore: Math.max(currentBest.bestScore, result.score),
      minDiff: Math.min(currentBest.minDiff, result.diff),
      perfectCount: currentBest.perfectCount + (result.diff === 0 ? 1 : 0),
      playCount: currentBest.playCount + 1,
    };
    localStorage.setItem(BEST_KEY, JSON.stringify(updatedBest));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export function getGameHistory(): GameResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getBestStats(): BestStats {
  try {
    const raw = localStorage.getItem(BEST_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          bestScore: 0,
          minDiff: 999,
          perfectCount: 0,
          playCount: 0,
        };
  } catch {
    return {
      bestScore: 0,
      minDiff: 999,
      perfectCount: 0,
      playCount: 0,
    };
  }
}
