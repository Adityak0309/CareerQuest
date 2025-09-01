'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, TriangleAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ReportItem {
  item: string;
  value: string;
}

const generateReport = (): ReportItem[] => {
  const items = ["Q3 Sales", "New Leads", "Marketing ROI", "Customer Churn", "Top Performing Region", "Project Alpha Budget"];
  const values = ["$2.1M", "4,280", "15.2%", "1.8%", "North-East", "$250,000"];
  const shuffledItems = items.sort(() => 0.5 - Math.random());
  return shuffledItems.slice(0, 5).map((item, i) => ({ item, value: values[items.indexOf(item)] }));
};

const VIEW_TIME = 10; // 10 seconds to view the report

export function MemoryChallenge({ onGameComplete }: { onGameComplete: (score: number) => void }) {
  const [gameState, setGameState] = useState<'viewing' | 'answering' | 'result'>('viewing');
  const [timeLeft, setTimeLeft] = useState(VIEW_TIME);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const report = useMemo(generateReport, []);
  const questionIndex = useMemo(() => Math.floor(Math.random() * report.length), [report]);
  const questionItem = report[questionIndex];

  const progress = (timeLeft / VIEW_TIME) * 100;

  useEffect(() => {
    if (gameState !== 'viewing') return;

    if (timeLeft <= 0) {
      setGameState('answering');
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback) return;
    const isCorrect = answer.trim().toLowerCase() === questionItem.value.toLowerCase();

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
      <h3 className="text-xl font-headline font-semibold">Memory & Focus Challenge</h3>
      {gameState === 'viewing' && (
        <Card className="shadow-lg animate-in fade-in-0">
          <CardHeader>
            <CardTitle>Memorize the Report</CardTitle>
            <CardDescription>You have {VIEW_TIME} seconds to memorize these key metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="w-full space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground text-center">Time Left: {timeLeft}s</p>
            </div>
            <ul className="space-y-2 text-left">
              {report.map(({ item, value }) => (
                <li key={item} className="flex justify-between border-b pb-1">
                  <span className="font-medium text-muted-foreground">{item}:</span>
                  <span className="font-bold">{value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {gameState === 'answering' && (
        <Card className="shadow-lg animate-in fade-in-0">
          <CardHeader>
             <CardTitle>Recall Test</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label htmlFor="answer" className="block text-lg font-medium">What was the value for <span className="text-primary font-bold">{questionItem.item}</span>?</label>
                <Input 
                    id="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter the value here"
                    disabled={!!feedback}
                    className="text-center"
                />
                <Button type="submit" disabled={!answer || !!feedback}>Submit Answer</Button>
            </form>
             {feedback === 'correct' && (
                <Alert className="text-left mt-4">
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Correct!</AlertTitle>
                <AlertDescription>Excellent recall!</AlertDescription>
                </Alert>
            )}
            {feedback === 'incorrect' && (
                <Alert variant="destructive" className="text-left mt-4">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Incorrect!</AlertTitle>
                <AlertDescription>The correct answer was {questionItem.value}.</AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
