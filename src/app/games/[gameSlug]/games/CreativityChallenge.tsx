'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const objects = [
  "a brick",
  "a paperclip",
  "a coffee mug",
  "an empty bottle",
  "a rubber band",
];

export function CreativityChallenge({ onGameComplete }: { onGameComplete: (score: number) => void }) {
  const [uses, setUses] = useState('');
  const object = useMemo(() => objects[Math.floor(Math.random() * objects.length)], []);

  const handleSubmit = () => {
    // Split by newline, filter out empty lines, then count.
    const usesList = uses.trim().split('\n').filter(line => line.trim() !== '');
    const uniqueUses = new Set(usesList.map(u => u.toLowerCase().trim()));
    
    // Simple scoring: more unique uses = higher score.
    const score = Math.min(100, uniqueUses.size * 10);
    onGameComplete(score);
  };

  const usesCount = uses.trim() === '' ? 0 : uses.trim().split('\n').filter(line => line.trim() !== '').length;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-lg">List as many creative and unusual uses as you can for:</p>
        <p className="text-2xl font-bold font-headline text-primary my-2">{object}</p>
        <p className="text-muted-foreground text-sm">Separate each use on a new line. Try to be unique!</p>
      </div>
      <div className="grid w-full gap-1.5">
        <Textarea
          id="uses"
          placeholder="e.g., A doorstop&#10;A makeshift hammer&#10;A piece of abstract art"
          value={uses}
          onChange={(e) => setUses(e.target.value)}
          rows={7}
        />
        <p className="text-sm text-right text-muted-foreground">{usesCount} uses listed</p>
      </div>
      <Button onClick={handleSubmit} disabled={usesCount < 3}>
        Submit Uses
      </Button>
    </div>
  );
}
