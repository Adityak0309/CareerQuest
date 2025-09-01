'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

const products = [
  "A pen that never runs out of ink.",
  "Shoes that let you walk on water.",
  "A toaster that butters the toast for you.",
  "Glasses that translate any language in real-time.",
];

const TIME_LIMIT = 45; // 45 seconds to write a pitch

export function ConfidencePitch({ onGameComplete }: { onGameComplete: (score: number) => void }) {
  const [pitch, setPitch] = useState('');
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const product = useMemo(() => products[Math.floor(Math.random() * products.length)], []);

  useEffect(() => {
    if (isTimeUp) return;
    
    if (timeLeft <= 0) {
      setIsTimeUp(true);
      const wordCount = pitch.trim().split(/\s+/).length;
      const score = Math.min(100, wordCount * 4); // Score based on length of pitch
      onGameComplete(score);
      return;
    }
    
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onGameComplete, pitch, isTimeUp]);

  const progress = (timeLeft / TIME_LIMIT) * 100;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-semibold">Your Product:</h3>
        <p className="text-primary text-lg font-bold">{product}</p>
        <p className="text-muted-foreground">You have {TIME_LIMIT} seconds to write a compelling pitch.</p>
      </div>
      
      <div className="w-full space-y-2">
        <Progress value={progress} />
        <p className="text-sm text-muted-foreground text-center">Time Left: {timeLeft}s</p>
      </div>

      <Textarea
        placeholder="Start writing your pitch..."
        value={pitch}
        onChange={(e) => setPitch(e.target.value)}
        rows={5}
        disabled={isTimeUp}
      />
      {isTimeUp && <p className="text-center font-bold text-destructive">Time's up!</p>}
    </div>
  );
}
