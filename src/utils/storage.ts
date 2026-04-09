// ======================
// High Score Storage
// Saves and loads the best score using the browser's localStorage.
// ======================

const HIGH_SCORE_KEY = 'raptor-run-high-score';

export function getHighScore(): number {
  const stored = localStorage.getItem(HIGH_SCORE_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

export function setHighScore(score: number): void {
  const current = getHighScore();
  if (score > current) {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString());
  }
}
