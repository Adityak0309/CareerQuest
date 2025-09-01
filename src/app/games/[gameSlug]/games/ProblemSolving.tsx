'use client';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

type Entity = 'farmer' | 'wolf' | 'goat' | 'cabbage';
type Bank = 'left' | 'right';

interface GameState {
  entities: Record<Entity, Bank>;
  boat: Bank;
  history: { entities: Record<Entity, Bank>; boat: Bank }[];
}

const INITIAL_STATE: GameState = {
  entities: {
    farmer: 'left',
    wolf: 'left',
    goat: 'left',
    cabbage: 'left',
  },
  boat: 'left',
  history: [],
};

const TIME_LIMIT = 180; // 3 minutes

export function ProblemSolving({ onGameComplete }: { onGameComplete: (score: number) => void }) {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [moves, setMoves] = useState(0);

  const isInvalidState = (entities: Record<Entity, Bank>): boolean => {
    const { farmer, wolf, goat, cabbage } = entities;
    if (wolf === goat && farmer !== wolf) return true; // Wolf eats goat
    if (goat === cabbage && farmer !== goat) return true; // Goat eats cabbage
    return false;
  };

  const isWinState = (entities: Record<Entity, Bank>): boolean => {
    return Object.values(entities).every(bank => bank === 'right');
  };
  
  const move = (passenger: Entity | null) => {
    const newHistory = [...state.history, { entities: state.entities, boat: state.boat }];
    const newBoatPosition = state.boat === 'left' ? 'right' : 'left';
    let newEntities = { ...state.entities, boat: newBoatPosition };

    // Farmer always moves with the boat
    newEntities.farmer = newBoatPosition;
    if (passenger) {
      newEntities[passenger] = newBoatPosition;
    }
    
    setMoves(m => m + 1);
    setState({
      entities: newEntities,
      boat: newBoatPosition,
      history: newHistory,
    });
  };

  const undo = () => {
    const lastState = state.history[state.history.length - 1];
    if (lastState) {
      setState({
        ...lastState,
        history: state.history.slice(0, -1),
      });
    }
  };
  
  const hasLost = useMemo(() => isInvalidState(state.entities), [state.entities]);
  const hasWon = useMemo(() => isWinState(state.entities), [state.entities]);

  useEffect(() => {
    if (hasWon) {
      const score = Math.max(10, Math.round(100 - (moves * 2) - ((TIME_LIMIT - timeLeft) / 10)));
      onGameComplete(score);
      return;
    }
    if (hasLost) {
      onGameComplete(0);
      return;
    }
    if (timeLeft <= 0) {
      onGameComplete(0);
      return;
    }

    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [state, hasWon, hasLost, timeLeft, onGameComplete, moves]);


  const renderBank = (bank: Bank) => {
    const entitiesOnBank = Object.entries(state.entities).filter(([, b]) => b === bank).map(([e]) => e as Entity);
    const boatEntities = entitiesOnBank.filter(e => e !== 'farmer');
    
    return (
      <Card className="w-48 h-64 flex flex-col justify-between p-2">
        <CardHeader className="p-2 text-center">
            <h3 className="font-bold">{bank === 'left' ? 'Starting Bank' : 'Destination'}</h3>
        </CardHeader>
        <CardContent className="flex-1 space-y-2 p-2">
          {entitiesOnBank.includes('farmer') && <div className="p-2 bg-blue-200 rounded text-center">Farmer</div>}
          {entitiesOnBank.includes('wolf') && <div className={cn("p-2 rounded text-center", hasLost && state.entities.goat === bank ? 'bg-red-300' : 'bg-gray-200')}>Wolf</div>}
          {entitiesOnBank.includes('goat') && <div className={cn("p-2 rounded text-center", hasLost ? 'bg-red-300' : 'bg-gray-200')}>Goat</div>}
          {entitiesOnBank.includes('cabbage') && <div className={cn("p-2 rounded text-center", hasLost && state.entities.goat === bank ? 'bg-red-300' : 'bg-gray-200')}>Cabbage</div>}
        </CardContent>
        {state.boat === bank && (
          <div className="space-y-1">
            <Button size="sm" className="w-full" onClick={() => move(null)} disabled={hasWon || hasLost}>Move Farmer Only</Button>
            {boatEntities.map(e => (
              <Button key={e} size="sm" variant="secondary" className="w-full" onClick={() => move(e)} disabled={hasWon || hasLost}>+ Move {e}</Button>
            ))}
          </div>
        )}
      </Card>
    );
  };

  const progress = (timeLeft / TIME_LIMIT) * 100;

  return (
    <div className="space-y-4">
      <div className="w-full space-y-2 text-center">
        <p className="font-semibold">Get everyone and everything to the other side!</p>
        <ul className="text-xs text-muted-foreground list-disc list-inside">
            <li>The boat can only hold the farmer and one other item.</li>
            <li>The wolf can't be left alone with the goat.</li>
            <li>The goat can't be left alone with the cabbage.</li>
        </ul>
        <Progress value={progress} />
        <p className="text-sm text-muted-foreground">Time Left: {timeLeft}s | Moves: {moves}</p>
      </div>

      <div className="flex items-center justify-center gap-4">
        {renderBank('left')}
        <div className="flex flex-col gap-4">
            <ArrowRight size={32} className={cn("transition-transform", state.boat === 'right' && 'rotate-180')}/>
            <Button onClick={undo} variant="outline" size="icon" disabled={state.history.length === 0 || hasWon || hasLost}>
                <Undo2 size={16} />
            </Button>
        </div>
        {renderBank('right')}
      </div>
       {hasLost && <p className="text-center font-bold text-destructive">Oh no! A rule was broken.</p>}
       {hasWon && <p className="text-center font-bold text-green-500">Congratulations! You solved it!</p>}
    </div>
  );
}
