import type { LucideProps } from 'lucide-react';
import { BrainCircuit, MemoryStick, Brush, Puzzle, Mic } from 'lucide-react';

export type GameSlug = 'logic' | 'memory' | 'creativity' | 'problem-solving' | 'confidence';

export type Skill = 'analyticalThinking' | 'memory' | 'creativity' | 'problemSolving' | 'confidence';

export interface Game {
  slug: GameSlug;
  title: string;
  description: string;
  skill: Skill;
  Icon: React.ComponentType<LucideProps>;
}

export const games: Game[] = [
  { slug: 'logic', title: 'Logic Puzzle', description: 'Test your analytical thinking.', skill: 'analyticalThinking', Icon: BrainCircuit },
  { slug: 'memory', title: 'Memory Game', description: 'Challenge your sequence recall.', skill: 'memory', Icon: MemoryStick },
  { slug: 'creativity', title: 'Creativity Challenge', description: 'Build a story or doodle.', skill: 'creativity', Icon: Brush },
  { slug: 'problem-solving', title: 'Problem-Solving Puzzle', description: 'Solve an escape room style puzzle.', skill: 'problemSolving', Icon: Puzzle },
  { slug: 'confidence', title: 'Confidence Pitch', description: 'Record a quick pitch.', skill: 'confidence', Icon: Mic },
];

export const gameSequence: GameSlug[] = games.map(g => g.slug);

export const gameData: Record<GameSlug, Game> = games.reduce((acc, game) => {
    acc[game.slug] = game;
    return acc;
}, {} as Record<GameSlug, Game>);
