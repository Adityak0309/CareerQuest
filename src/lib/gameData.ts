import type { LucideProps } from 'lucide-react';
import { BrainCircuit, Puzzle, Briefcase, Lightbulb, MemoryStick, Shapes } from 'lucide-react';

export type GameSlug = 
  | 'problem-solving' 
  | 'analytical-thinking' 
  | 'decision-making' 
  | 'creativity' 
  | 'memory' 
  | 'spatial-aptitude';

export type Skill = 
  | 'problemSolving'
  | 'analyticalThinking'
  | 'decisionMaking'
  | 'creativity'
  | 'memory'
  | 'spatialAptitude';

export interface Game {
  slug: GameSlug;
  title: string;
  description: string;
  skill: Skill;
  Icon: React.ComponentType<LucideProps>;
}

export const games: Game[] = [
  { 
    slug: 'problem-solving', 
    title: 'Strategic Problem-Solving', 
    description: 'Distribute resources to maximize profit in a startup simulation.', 
    skill: 'problemSolving', 
    Icon: Puzzle 
  },
  { 
    slug: 'analytical-thinking', 
    title: 'Critical Thinking', 
    description: 'Identify trends and anomalies in complex data patterns.', 
    skill: 'analyticalThinking', 
    Icon: BrainCircuit 
  },
  { 
    slug: 'decision-making', 
    title: 'Decision-Making Under Pressure', 
    description: 'Navigate timed workplace dilemmas to test your judgment.', 
    skill: 'decisionMaking', 
    Icon: Briefcase 
  },
  { 
    slug: 'creativity', 
    title: 'Innovation Simulation', 
    description: 'Solve a problem and adapt your solution to a surprise twist.', 
    skill: 'creativity', 
    Icon: Lightbulb
  },
  { 
    slug: 'memory', 
    title: 'Memory & Focus Challenge', 
    description: 'Recall key details from a business report shown briefly.', 
    skill: 'memory', 
    Icon: MemoryStick
  },
  {
    slug: 'spatial-aptitude',
    title: 'Spatial & Technical Aptitude',
    description: 'Visualize and match complex 3D shapes and patterns.',
    skill: 'spatialAptitude',
    Icon: Shapes
  }
];

export const gameSequence: GameSlug[] = games.map(g => g.slug);

export const gameData: Record<GameSlug, Game> = games.reduce((acc, game) => {
    acc[game.slug] = game;
    return acc;
}, {} as Record<GameSlug, Game>);
