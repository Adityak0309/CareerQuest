'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

const GRID_SIZE = 4;
const INITIAL_PATTERN_LENGTH = 3;
const MAX_LEVEL = 7;

type Tile = { row: number; col: number };

const generatePattern = (length: number): Tile[] => {
  const pattern: Tile[] = [];
  const usedCoords = new Set<string>();

  while (pattern.length < length) {
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);
    const coord = `${row}-${col}`;
    if (!usedCoords.has(coord)) {
      pattern.push({ row, col });
      usedCoords.add(coord);
    }
  }
  return pattern;
};

export function MemoryGame({ onGameComplete }: { onGameComplete: (score: number) => void }) {
  const [level, setLevel] = useState(1);
  const [pattern, setPattern] = useState<Tile[]>([]);
  const [playerPattern, setPlayerPattern] = useState<Tile[]>([]);
  const [gameState, setGameState] = useState<'start' | 'showing' | 'playing' | 'result'>('start');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const startLevel = useCallback(() => {
    const newPattern = generatePattern(INITIAL_PATTERN_LENGTH + level - 1);
    setPattern(newPattern);
    setPlayerPattern([]);
    setFeedback(null);
    setGameState('showing');

    newPattern.forEach((tile, index) => {
      setTimeout(() => {
        highlightTile(tile, true);
        setTimeout(() => {
          highlightTile(tile, false);
          if (index === newPattern.length - 1) {
            setGameState('playing');
          }
        }, 600);
      }, (index + 1) * 700);
    });
  }, [level]);

  const highlightTile = ({ row, col }: Tile, show: boolean) => {
    const tileElement = document.getElementById(`tile-${row}-${col}`);
    if (tileElement) {
      if (show) {
        tileElement.classList.add('bg-primary', 'ring-4', 'ring-primary/50');
      } else {
        tileElement.classList.remove('bg-primary', 'ring-4', 'ring-primary/50');
      }
    }
  };
  
  const handleTileClick = (tile: Tile) => {
    if (gameState !== 'playing' || playerPattern.some(p => p.row === tile.row && p.col === tile.col)) return;
    const newPlayerPattern = [...playerPattern, tile];
    setPlayerPattern(newPlayerPattern);

    const patternSoFar = pattern.slice(0, newPlayerPattern.length);
    const isCorrectSoFar = newPlayerPattern.every(
      (playerTile, i) =>
        playerTile.row === patternSoFar[i].row && playerTile.col === patternSoFar[i].col
    );

    if (!isCorrectSoFar) {
      setFeedback('incorrect');
      setGameState('result');
      setTimeout(() => onGameComplete(Math.max(0, (level - 1) * 15)), 1500);
    } else if (newPlayerPattern.length === pattern.length) {
      setFeedback('correct');
      setGameState('result');
      if (level === MAX_LEVEL) {
        setTimeout(() => onGameComplete(100), 1500);
      } else {
        setTimeout(() => {
          setLevel(prev => prev + 1);
        }, 1500);
      }
    }
  };
  
  useEffect(() => {
    if (gameState === 'result' && level < MAX_LEVEL && feedback === 'correct') {
      setTimeout(startLevel, 1500);
    }
  }, [gameState, level, feedback, startLevel]);


  const getTileState = (tile: Tile) => {
    const isInPlayerPattern = playerPattern.some(p => p.row === tile.row && p.col === tile.col);
    if (!isInPlayerPattern) return 'default';
    const playerIndex = playerPattern.findIndex(p => p.row === tile.row && p.col === tile.col);
    return pattern[playerIndex].row === tile.row && pattern[playerIndex].col === tile.col ? 'correct' : 'incorrect';
  }

  return (
    <div className="flex flex-col items-center space-y-4">
       <div className="h-10 text-center font-semibold">
        {gameState === 'start' && <p>Memorize the sequence on the grid.</p>}
        {gameState === 'showing' && <p>Watch carefully...</p>}
        {gameState === 'playing' && <p>Your turn! Repeat the pattern.</p>}
        {gameState === 'result' && feedback === 'correct' && <div className="flex items-center text-green-500"><Check className="mr-2"/> Level {level} Complete!</div>}
        {gameState === 'result' && feedback === 'incorrect' && <div className="flex items-center text-destructive"><X className="mr-2"/> Incorrect Pattern!</div>}
      </div>
      <div className="relative">
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const row = Math.floor(i / GRID_SIZE);
            const col = i % GRID_SIZE;
            const tileState = getTileState({row, col});
            return (
              <button
                key={i}
                id={`tile-${row}-${col}`}
                onClick={() => handleTileClick({ row, col })}
                disabled={gameState !== 'playing'}
                className={cn(
                  "h-16 w-16 rounded-lg transition-all duration-200 border-2",
                  "bg-secondary/50 border-secondary",
                   tileState === 'correct' && 'bg-blue-500 border-blue-400',
                   tileState === 'incorrect' && 'bg-red-500 border-red-400',
                  "disabled:opacity-70 disabled:cursor-not-allowed"
                )}
              />
            );
          })}
        </div>
      </div>
      {gameState === 'start' && <Button onClick={startLevel}>Start Level {level}</Button>}
       <p className="text-sm text-muted-foreground">Level: {level} / {MAX_LEVEL}</p>
    </div>
  );
}
