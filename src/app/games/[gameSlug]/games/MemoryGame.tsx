'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SEQUENCE_LENGTH = 5;
const COLORS = ['red', 'blue', 'green', 'yellow'];

const colorClasses = {
  red: 'bg-red-500 hover:bg-red-600',
  blue: 'bg-blue-500 hover:bg-blue-600',
  green: 'bg-green-500 hover:bg-green-600',
  yellow: 'bg-yellow-400 hover:bg-yellow-500',
};

export function MemoryGame({ onGameComplete }: { onGameComplete: (score: number) => void }) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'watching' | 'playing' | 'start'>('start');
  const [activeColor, setActiveColor] = useState<string | null>(null);

  const generateSequence = () => {
    return Array.from({ length: SEQUENCE_LENGTH }, () => COLORS[Math.floor(Math.random() * COLORS.length)]);
  };

  const startGame = () => {
    const newSequence = generateSequence();
    setSequence(newSequence);
    setPlayerSequence([]);
    setGameState('watching');
    
    newSequence.forEach((color, index) => {
      setTimeout(() => {
        setActiveColor(color);
        setTimeout(() => {
          setActiveColor(null);
          if (index === newSequence.length - 1) {
            setGameState('playing');
          }
        }, 500);
      }, (index + 1) * 800);
    });
  };

  const handleColorClick = (color: string) => {
    if (gameState !== 'playing') return;
    setPlayerSequence([...playerSequence, color]);
  };

  useEffect(() => {
    if (gameState === 'playing' && playerSequence.length > 0) {
      const currentStep = playerSequence.length - 1;
      if (playerSequence[currentStep] !== sequence[currentStep]) {
        // Incorrect
        onGameComplete(0);
        return;
      }
      if (playerSequence.length === sequence.length) {
        // Correct sequence
        const score = (SEQUENCE_LENGTH / 5) * 100;
        onGameComplete(score);
      }
    }
  }, [playerSequence, sequence, gameState, onGameComplete]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="h-8 text-center">
        {gameState === 'start' && <p>Click start to begin the memory test.</p>}
        {gameState === 'watching' && <p>Watch the sequence carefully...</p>}
        {gameState === 'playing' && <p>Your turn! Repeat the sequence.</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {COLORS.map(color => (
          <button
            key={color}
            onClick={() => handleColorClick(color)}
            disabled={gameState !== 'playing'}
            className={cn(
              "h-24 w-24 rounded-lg transition-all duration-200 disabled:opacity-50",
              colorClasses[color as keyof typeof colorClasses],
              activeColor === color ? 'ring-4 ring-white ring-offset-2' : ''
            )}
          />
        ))}
      </div>
      {gameState === 'start' && <Button onClick={startGame}>Start Game</Button>}
    </div>
  );
}
