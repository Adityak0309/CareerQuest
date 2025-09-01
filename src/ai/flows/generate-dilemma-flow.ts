'use server';
/**
 * @fileOverview A Genkit flow for generating business dilemmas for the Decision-Making game.
 *
 * - generateDilemma - A function that returns a unique business dilemma.
 * - DilemmaOutput - The return type for the generateDilemma function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DilemmaOutputSchema = z.object({
  scenario: z.string().describe('A challenging but brief business scenario (1-2 sentences) requiring a decision.'),
  optionA: z.object({
    text: z.string().describe('The first choice or course of action. Keep it concise.'),
    score: z.number().describe('A score from 0-100 representing the quality of this choice.'),
  }),
  optionB: z.object({
    text: z.string().describe('The second choice or course of action. Keep it concise.'),
    score: z.number().describe('A score from 0-100 representing the quality of this choice.'),
  }),
  justification: z.string().describe('A brief, simple explanation of why one choice might be better, to be shown after the user decides.'),
});

export type DilemmaOutput = z.infer<typeof DilemmaOutputSchema>;

export async function generateDilemma(): Promise<DilemmaOutput> {
  return generateDilemmaFlow();
}

const prompt = ai.definePrompt({
  name: 'generateDilemmaPrompt',
  output: { schema: DilemmaOutputSchema },
  prompt: `Generate a unique and realistic business dilemma for a decision-making game.

The scenario should be a short, clear paragraph (max 2 sentences).
The two options should be distinct, concise choices with clear trade-offs.
The scores should reflect the nuanced quality of the decisions (e.g., not just 0 and 100, but maybe 60 and 85).
The justification should provide a brief, easy-to-understand rationale for the better choice.

Ensure the dilemma is different from previous ones. Topics can include marketing, project management, HR, finance, or operations. Focus on clarity and readability.
`,
});

const generateDilemmaFlow = ai.defineFlow(
  {
    name: 'generateDilemmaFlow',
    outputSchema: DilemmaOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);
