import { useState, useEffect, useCallback } from 'react';

export const useGameStatus = (rowsCleared: number) => {
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(0);

  const calcScore = useCallback(() => {
    const linePoints = [40, 100, 300, 1200];
    // We have score
    if (rowsCleared > 0) {
      // This is how original Tetris score is calculated
      setScore((prev) => prev + linePoints[rowsCleared - 1] * (level + 1));
      setRows((prev) => prev + rowsCleared);
      setLevel((prev) => prev + Math.floor((rows + rowsCleared) / 10)); // Increase level every 10 rows
    }
  }, [level, rowsCleared, rows]);

  useEffect(() => {
    calcScore();
  }, [calcScore, rowsCleared]);

  return { score, setScore, rows, setRows, level, setLevel };
};