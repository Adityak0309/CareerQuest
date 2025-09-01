'use client';
import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface Shape {
  id: number;
  rotations: string[][];
}

const shapes: Shape[] = [
    {
        id: 1,
        rotations: [
            [['#', ' '], ['#', '#']],
            [['#', '#'], ['#', ' ']],
            [[' ', '#'], ['#', '#']],
            [['#', '#'], [' ', '#']],
        ]
    },
    {
        id: 2,
        rotations: [
            [['#', '#', '#'], [' ', '#', ' ']],
            [[' ', '#'], ['#', '#'], [' ', '#']],
            [[' ', '#', ' '], ['#', '#', '#']],
            [['#', ' '], ['#', '#'], ['#', ' ']],
        ]
    },
    {
        id: 3,
        rotations: [
            [['#', '#'], [' ', '#'], [' ', '#']],
            [[' ', ' ', '#'], ['#', '#', '#']],
            [['#', ' '], ['#', ' '], ['#', '#']],
            [['#', '#', '#'], ['#', ' ', ' ']],
        ]
    }
];


const generatePuzzle = () => {
    const mainShape = shapes[Math.floor(Math.random() * shapes.length)];
    const correctRotationIndex = Math.floor(Math.random() * mainShape.rotations.length);
    const correctRotation = mainShape.rotations[correctRotationIndex];

    const options = [correctRotation];
    const decoyPool = shapes.filter(s => s.id !== mainShape.id)
                            .flatMap(s => s.rotations)
                            .concat(mainShape.rotations.filter((_, i) => i !== correctRotationIndex));
    
    // Fisher-Yates shuffle
    for (let i = decoyPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [decoyPool[i], decoyPool[j]] = [decoyPool[j], decoyPool[i]];
    }

    while (options.length < 4 && decoyPool.length > 0) {
        options.push(decoyPool.pop()!);
    }

    // Shuffle final options
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    
    return {
        mainShape: mainShape.rotations[0], // Always show the first rotation as the reference
        options,
        correctAnswer: correctRotation
    };
};

const ShapeGrid = ({ grid }: { grid: string[][] }) => (
  <div className="grid border-2 border-primary/20 bg-secondary/30" style={{ gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`}}>
    {grid.flat().map((cell, i) => (
      <div key={i} className={`w-6 h-6 ${cell === '#' ? 'bg-primary' : ''}`} />
    ))}
  </div>
);


export function SpatialAptitude({ onGameComplete }: { onGameComplete: (score: number) => void }) {
  const [selectedOption, setSelectedOption] = useState<string[][] | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const puzzle = useMemo(generatePuzzle, []);
  
  const handleSubmit = () => {
    if (!selectedOption) return;

    // A simple way to compare 2D arrays
    const isCorrect = JSON.stringify(selectedOption) === JSON.stringify(puzzle.correctAnswer);

    if (isCorrect) {
        setFeedback('correct');
        setTimeout(() => onGameComplete(100), 1000);
    } else {
        setFeedback('incorrect');
        setTimeout(() => onGameComplete(25), 1000);
    }
  };

  return (
    <div className="space-y-6 text-center">
        <h3 className="text-xl font-headline font-semibold">Spatial & Technical Aptitude</h3>
        <p>Which of the options below is a rotation of the main shape?</p>

        <div className="flex justify-center my-6">
            <div className="p-4 border-2 border-dashed rounded-lg">
                <ShapeGrid grid={puzzle.mainShape} />
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
            {puzzle.options.map((option, i) => (
                <button
                    key={i}
                    onClick={() => setSelectedOption(option)}
                    disabled={!!feedback}
                    className={`p-2 rounded-lg border-2 transition-all ${selectedOption === option ? 'border-primary ring-2 ring-primary' : 'border-transparent hover:border-primary/50'}`}
                >
                    <ShapeGrid grid={option} />
                </button>
            ))}
        </div>

        <Button onClick={handleSubmit} disabled={!selectedOption || !!feedback}>
            Submit Answer
        </Button>

         {feedback === 'correct' && <p className="font-bold text-green-500">Correct! Great eye.</p>}
         {feedback === 'incorrect' && <p className="font-bold text-destructive">Not quite. Keep trying!</p>}
    </div>
  );
}
