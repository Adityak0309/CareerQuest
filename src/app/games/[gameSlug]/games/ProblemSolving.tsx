'use client';
import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Puzzle {
  question: string;
  answer: string;
}

const puzzles: Puzzle[] = [
  { question: "A man has a wolf, a goat, and a cabbage. He must cross a river with a boat that can only carry him and one other item. If he leaves the wolf and goat alone, the wolf will eat the goat. If he leaves the goat and cabbage alone, the goat will eat the cabbage. How does he get all three across? (Answer with the number of one-way trips he makes)", answer: "7" },
  { question: "What is the next number in the sequence: 1, 4, 9, 16, 25, ?", answer: "36" },
  { question: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost? (Answer in cents, e.g., '5')", answer: "5" },
];

const TIME_LIMIT = 60; // 60 seconds

export function ProblemSolving({ onGameComplete }: { onGameComplete: (score: number) => void }) {
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const puzzle = useMemo(() => puzzles[Math.floor(Math.random() * puzzles.length)], []);

  useEffect(() => {
    if (isCorrect !== null) return;
    if (timeLeft <= 0) {
      onGameComplete(0);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onGameComplete, isCorrect]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim().toLowerCase() === puzzle.answer) {
      setIsCorrect(true);
      const score = Math.max(10, Math.round((timeLeft / TIME_LIMIT) * 100));
      setTimeout(() => onGameComplete(score), 1000);
    } else {
      setIsCorrect(false);
      setTimeout(() => onGameComplete(10), 1000);
    }
  };

  const progress = (timeLeft / TIME_LIMIT) * 100;

  return (
    <div className="space-y-6">
       <div className="w-full space-y-2">
        <Progress value={progress} />
        <p className="text-sm text-muted-foreground text-center">Time Left: {timeLeft}s</p>
      </div>
      <p className="text-center text-muted-foreground">{puzzle.question}</p>
      <form onSubmit={handleSubmit} className="flex items-center justify-center gap-2">
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Your answer"
          className="max-w-xs"
          disabled={isCorrect !== null}
        />
        <Button type="submit" disabled={isCorrect !== null}>Submit</Button>
      </form>
      {isCorrect === true && (
        <div className="flex items-center justify-center text-green-600">
          <CheckCircle className="mr-2 h-5 w-5" />
          <p>Correct! Well done.</p>
        </div>
      )}
      {isCorrect === false && (
        <div className="flex items-center justify-center text-red-600">
          <AlertCircle className="mr-2 h-5 w-5" />
          <p>Incorrect. The answer was {puzzle.answer}.</p>
        </div>
      )}
    </div>
  );
}
