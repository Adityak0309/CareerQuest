'use client';
import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, TriangleAlert } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SequencePuzzle {
  sequence: (number | string)[];
  answer: number | string;
  type: string;
  explanation: string;
}

const puzzles: SequencePuzzle[] = [
  { sequence: [1, 3, 6, 10, 15], answer: 21, type: "Triangular Numbers", explanation: "The pattern is adding +2, then +3, then +4, and so on." },
  { sequence: [1, 2, 4, 8, 16], answer: 32, type: "Powers of 2", explanation: "Each number is multiplied by 2 to get the next number." },
  { sequence: ['A', 'C', 'F', 'J', 'O'], answer: 'U', type: "Alphabetical Gap", explanation: "The gap between letters increases by one each time: +1, +2, +3, +4, +5." },
  { sequence: [81, 27, 9, 3, 1], answer: 1/3, type: "Geometric Division", explanation: "Each number is divided by 3 to get the next one." },
  { sequence: [5, 11, 23, 47, 95], answer: 191, type: "Multiply by 2, Add 1", explanation: "The pattern is (x * 2) + 1 for each number in the sequence." },
];

const TIME_LIMIT = 30; // 30 seconds

export function PatternRecognition({ onGameComplete }: { onGameComplete: (score: number) => void }) {
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
    
    // Normalize answer for comparison
    const isCorrect = answer.trim().toLowerCase() === String(puzzle.answer).toLowerCase();

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
      <h3 className="text-xl font-headline font-semibold">Critical Thinking & Pattern Recognition</h3>
      <div className="w-full space-y-2">
        <p className="text-sm font-medium">Time Remaining</p>
        <Progress value={progress} />
      </div>
      <div>
        <h3 className="font-semibold">Identify the trend and find the next element in the sequence:</h3>
        <p className="text-2xl font-bold tracking-widest my-4 bg-secondary/50 p-4 rounded-lg">{puzzle.sequence.join(', ')}, ?</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
          <Label htmlFor="answer">Your Answer</Label>
          <Input 
            id="answer"
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Next in sequence"
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
          <AlertDescription>{puzzle.explanation}</AlertDescription>
        </Alert>
      )}
      {feedback === 'incorrect' && (
        <Alert variant="destructive" className="text-left">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Incorrect</AlertTitle>
          <AlertDescription>The correct answer was {puzzle.answer}. {puzzle.explanation}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
