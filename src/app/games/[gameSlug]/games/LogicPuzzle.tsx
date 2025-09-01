'use client';
import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, TriangleAlert } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SequencePuzzle {
  sequence: number[];
  answer: number;
  type: string;
}

const puzzles: SequencePuzzle[] = [
  { sequence: [2, 4, 6, 8], answer: 10, type: "Arithmetic Progression" },
  { sequence: [3, 9, 27, 81], answer: 243, type: "Geometric Progression" },
  { sequence: [1, 1, 2, 3, 5], answer: 8, type: "Fibonacci Sequence" },
  { sequence: [1, 4, 9, 16], answer: 25, type: "Squared Numbers" },
  { sequence: [10, 22, 34, 46], answer: 58, type: "Arithmetic Progression" },
];

const TIME_LIMIT = 25; // 25 seconds

export function LogicPuzzle({ onGameComplete }: { onGameComplete: (score: number) => void }) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const puzzle = useMemo(() => puzzles[Math.floor(Math.random() * puzzles.length)], []);
  const progress = (timeLeft / TIME_LIMIT) * 100;

  useEffect(() => {
    if (feedback) return;

    if (timeLeft <= 0) {
      setFeedback('incorrect');
      setTimeout(() => onGameComplete(0), 1500);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, feedback, onGameComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback) return;
    const isCorrect = parseInt(answer, 10) === puzzle.answer;
    if (isCorrect) {
      setFeedback('correct');
      const score = Math.max(20, Math.round((timeLeft / TIME_LIMIT) * 100));
      setTimeout(() => onGameComplete(score), 1500);
    } else {
      setFeedback('incorrect');
      setTimeout(() => onGameComplete(10), 1500);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="w-full space-y-2">
        <p className="text-sm font-medium">Time Remaining</p>
        <Progress value={progress} />
      </div>
      <div>
        <h3 className="font-semibold">What is the next number in this sequence?</h3>
        <p className="text-2xl font-bold tracking-widest my-4">{puzzle.sequence.join(', ')}, ?</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
          <Label htmlFor="answer">Your Answer</Label>
          <Input 
            id="answer"
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Next number"
            disabled={!!feedback}
            className="text-center"
          />
        </div>
        <Button type="submit" disabled={!!feedback}>Submit</Button>
      </form>
      {feedback === 'correct' && (
        <Alert className="text-left">
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>Correct!</AlertTitle>
          <AlertDescription>Great job! The pattern was a {puzzle.type}.</AlertDescription>
        </Alert>
      )}
      {feedback === 'incorrect' && (
        <Alert variant="destructive" className="text-left">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Time's up or Incorrect!</AlertTitle>
          <AlertDescription>The correct answer was {puzzle.answer}.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
