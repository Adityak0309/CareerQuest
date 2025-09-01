'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const storyStarters = [
  "The old clock in the town square suddenly chimed thirteen times, and then...",
  "It was a normal Tuesday, until a tiny spaceship landed in my cereal bowl...",
  "The librarian whispered that the book I was holding was magical, and I had to...",
  "Deep in the forest, I found a door that wasn't there yesterday. I opened it and saw...",
];

export function CreativityChallenge({ onGameComplete }: { onGameComplete: (score: number) => void }) {
  const [story, setStory] = useState('');
  const starter = useMemo(() => storyStarters[Math.floor(Math.random() * storyStarters.length)], []);

  const handleSubmit = () => {
    const wordCount = story.trim().split(/\s+/).length;
    // Simple scoring: more words = higher score, up to a point.
    const score = Math.min(100, Math.max(0, wordCount * 2));
    onGameComplete(score);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg text-center italic text-muted-foreground">{starter}</p>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="story">Continue the story (at least 30 words):</Label>
        <Textarea
          id="story"
          placeholder="Let your imagination run wild..."
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={6}
        />
      </div>
      <Button onClick={handleSubmit} disabled={story.trim().split(/\s+/).length < 30}>
        Finish Story
      </Button>
    </div>
  );
}
