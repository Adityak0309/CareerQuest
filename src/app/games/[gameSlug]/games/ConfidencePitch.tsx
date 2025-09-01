'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

const adjectives = ["Inflatable", "Glow-in-the-dark", "Self-tying", "Edible", "Solar-powered", "Quantum", "Invisible"];
const nouns = ["Toaster", "Shoelaces", "Hammer", "Bookmark", "Houseplant", "Keyboard", "Umbrella"];
const features = ["that sings opera", "that also works underwater", "that can predict the weather", "with bluetooth connectivity", "that is also a frisbee"];

const generateProduct = () => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const feature = features[Math.floor(Math.random() * features.length)];
    return `${adj} ${noun} ${feature}.`;
}

const TIME_LIMIT = 60; // 60 seconds to write a pitch

export function ConfidencePitch({ onGameComplete }: { onGameComplete: (score: number) => void }) {
  const [pitch, setPitch] = useState('');
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const product = useMemo(generateProduct, []);

  useEffect(() => {
    if (isTimeUp) return;
    
    if (timeLeft <= 0) {
      setIsTimeUp(true);
      // More sophisticated scoring: length, plus keywords related to persuasion
      const wordCount = pitch.trim().split(/\s+/).length;
      const persuasiveWords = ['amazing', 'revolutionary', 'guaranteed', 'limited time', 'new', 'discover', 'results'];
      const persuasiveCount = pitch.toLowerCase().split(/\s+/).filter(word => persuasiveWords.includes(word)).length;
      const score = Math.min(100, (wordCount * 1.5) + (persuasiveCount * 10));
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
        <h3 className="font-semibold">Your incredible new product is:</h3>
        <p className="text-primary text-xl font-bold font-headline my-2">{product}</p>
        <p className="text-muted-foreground">You have {TIME_LIMIT} seconds to write a short, compelling sales pitch for it.</p>
      </div>
      
      <div className="w-full space-y-2">
        <Progress value={progress} />
        <p className="text-sm text-muted-foreground text-center">Time Left: {timeLeft}s</p>
      </div>

      <Textarea
        placeholder="Start writing your pitch here. Make it sound convincing!"
        value={pitch}
        onChange={(e) => setPitch(e.target.value)}
        rows={6}
        disabled={isTimeUp}
      />
      {isTimeUp && <p className="text-center font-bold text-destructive">Time's up!</p>}
       {!isTimeUp && (
        <Button 
          onClick={() => setTimeLeft(0)} 
          disabled={pitch.trim().split(/\s+/).length < 10}
        >
          Finish Pitch
        </Button>
      )}
    </div>
  );
}
