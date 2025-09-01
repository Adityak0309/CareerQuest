'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, TriangleAlert } from 'lucide-react';

interface Riddle {
  question: string;
  answer: string;
}

const riddles: Riddle[] = [
  { question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", answer: "echo" },
  { question: "What has keys, but opens no locks?", answer: "piano" },
  { question: "What has an eye, but cannot see?", answer: "needle" },
  { question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?", answer: "map" },
];

export function LogicPuzzle({ onGameComplete }: { onGameComplete: (score: number) => void }) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const riddle = useMemo(() => riddles[Math.floor(Math.random() * riddles.length)], []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCorrect = answer.trim().toLowerCase() === riddle.answer;
    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => onGameComplete(100), 1500);
    } else {
      setFeedback('incorrect');
      setTimeout(() => onGameComplete(20), 1500);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <p className="text-lg italic text-muted-foreground">{riddle.question}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
          <Label htmlFor="answer">Your Answer</Label>
          <Input 
            id="answer" 
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            disabled={!!feedback}
          />
        </div>
        <Button type="submit" disabled={!!feedback}>Submit Answer</Button>
      </form>
      {feedback === 'correct' && (
        <Alert className="text-left">
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>Correct!</AlertTitle>
          <AlertDescription>Great job! That's the right answer.</AlertDescription>
        </Alert>
      )}
      {feedback === 'incorrect' && (
        <Alert variant="destructive" className="text-left">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Not quite!</AlertTitle>
          <AlertDescription>That wasn't the correct answer. The correct answer was: {riddle.answer}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
