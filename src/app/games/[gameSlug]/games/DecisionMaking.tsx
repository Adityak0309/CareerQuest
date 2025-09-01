'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface Dilemma {
  scenario: string;
  optionA: { text: string; score: number };
  optionB: { text: string; score: number };
  justification: string;
}

const dilemmas: Dilemma[] = [
  {
    scenario: "Your team can deliver a client project today with 60% accuracy, or in 3 days with 95% accuracy. The client is demanding a quick turnaround but also expects high quality.",
    optionA: { text: "Deliver today (60% accuracy)", score: 40 },
    optionB: { text: "Deliver in 3 days (95% accuracy)", score: 80 },
    justification: "Prioritizing quality over speed often leads to better long-term client relationships, though sometimes quick delivery is a strategic necessity."
  },
  {
    scenario: "You can allocate your marketing budget to a reliable, low-return campaign (guaranteed 2% ROI) or a high-risk, high-return experimental campaign (potential 20% ROI, but 50% chance of failure).",
    optionA: { text: "Low-risk, low-return", score: 60 },
    optionB: { text: "High-risk, high-return", score: 75 },
    justification: "Calculated risks are often necessary for growth. The potential upside can outweigh the risk of failure in many business contexts."
  },
  {
    scenario: "A key employee requests a significant raise that is outside the budget. Refusing might cause them to leave, but accepting will strain finances and require cuts elsewhere.",
    optionA: { text: "Grant the raise and make cuts", score: 85 },
    optionB: { text: "Refuse the raise and risk departure", score: 45 },
    justification: "Retaining top talent is often more cost-effective than hiring and training a replacement, even if it requires difficult short-term financial adjustments."
  }
];

const TIME_LIMIT = 15; // 15 seconds per dilemma

export function DecisionMaking({ onGameComplete }: { onGameComplete: (score: number) => void }) {
  const [currentDilemmaIndex, setCurrentDilemmaIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [totalScore, setTotalScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentDilemma = dilemmas[currentDilemmaIndex];
  const progress = (timeLeft / TIME_LIMIT) * 100;

  useEffect(() => {
    if (selectedOption) return;

    if (timeLeft <= 0) {
      // Time's up, move to the next question with 0 points for this one.
      handleNextDilemma(0);
    }

    const timer = setTimeout(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, selectedOption]);

  const handleNextDilemma = (score: number) => {
    setSelectedOption('locked'); // Lock selection
    const finalScore = score + (timeLeft * 2); // Bonus points for speed

    setTimeout(() => {
      const newTotalScore = totalScore + finalScore;
      setTotalScore(newTotalScore);

      if (currentDilemmaIndex < dilemmas.length - 1) {
        setCurrentDilemmaIndex(prev => prev + 1);
        setTimeLeft(TIME_LIMIT);
        setSelectedOption(null);
      } else {
        onGameComplete(Math.round(newTotalScore / dilemmas.length));
      }
    }, 1500);
  };
  
  const handleOptionClick = (option: 'A' | 'B') => {
    setSelectedOption(option);
    const score = option === 'A' ? currentDilemma.optionA.score : currentDilemma.optionB.score;
    handleNextDilemma(score);
  };

  return (
    <div className="space-y-6 text-center">
        <h3 className="text-xl font-headline font-semibold">Decision-Making Under Pressure</h3>
        <Card className="text-left shadow-lg">
            <CardHeader>
                <CardDescription>Dilemma {currentDilemmaIndex + 1} of {dilemmas.length}</CardDescription>
                <CardTitle>{currentDilemma.scenario}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="w-full space-y-2">
                    <Progress value={progress} />
                    <p className="text-sm text-muted-foreground text-center flex items-center justify-center gap-2"><Clock size={14}/> Time Left: {timeLeft}s</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                        variant="outline"
                        className={cn("h-auto py-4 whitespace-normal", selectedOption === 'A' && 'bg-primary text-primary-foreground')}
                        onClick={() => handleOptionClick('A')}
                        disabled={!!selectedOption}
                    >
                        {currentDilemma.optionA.text}
                    </Button>
                    <Button 
                        variant="outline"
                        className={cn("h-auto py-4 whitespace-normal", selectedOption === 'B' && 'bg-primary text-primary-foreground')}
                        onClick={() => handleOptionClick('B')}
                        disabled={!!selectedOption}
                    >
                        {currentDilemma.optionB.text}
                    </Button>
                </div>
                {selectedOption && (
                    <div className="p-3 bg-secondary/50 rounded-md text-sm text-center animate-in fade-in-50">
                        <p className="font-semibold">Justification:</p>
                        <p className="text-muted-foreground">{currentDilemma.justification}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
