'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized career suggestions based on a user's skill profile.
 *
 * - personalizedCareerSuggestions - A function that takes a skill profile as input and returns personalized career suggestions.
 * - SkillProfileInput - The input type for the personalizedCareerSuggestions function, representing the user's skill profile.
 * - CareerSuggestionsOutput - The output type for the personalizedCareerSuggestions function, providing a list of career suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillProfileInputSchema = z.object({
  analyticalThinking: z.number().describe('Score representing analytical thinking skills.'),
  memory: z.number().describe('Score representing memory and recall abilities.'),
  creativity: z.number().describe('Score representing creativity and imagination.'),
  problemSolving: z.number().describe('Score representing problem-solving abilities.'),
  confidence: z.number().describe('Score representing confidence and communication skills.'),
});

export type SkillProfileInput = z.infer<typeof SkillProfileInputSchema>;

const CareerSuggestionSchema = z.object({
  careerPath: z.string().describe('The suggested career path.'),
  description: z.string().describe('A brief description of the career path and why it suits the user.'),
});

const CareerSuggestionsOutputSchema = z.object({
  suggestions: z.array(CareerSuggestionSchema).describe('A list of personalized career suggestions.'),
});

export type CareerSuggestionsOutput = z.infer<typeof CareerSuggestionsOutputSchema>;

export async function personalizedCareerSuggestions(input: SkillProfileInput): Promise<CareerSuggestionsOutput> {
  return personalizedCareerSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedCareerSuggestionsPrompt',
  input: {schema: SkillProfileInputSchema},
  output: {schema: CareerSuggestionsOutputSchema},
  prompt: `Based on the following skill profile, suggest 2-3 relevant career paths. Provide a brief description of each career path and why it suits the user.

Skill Profile:
- Analytical Thinking: {{analyticalThinking}}
- Memory: {{memory}}
- Creativity: {{creativity}}
- Problem Solving: {{problemSolving}}
- Confidence: {{confidence}}

Format the output as a JSON object with a 'suggestions' array. Each object in the array must contain 'careerPath' and 'description' fields describing the career and why it suits the user. The description should reference the user's skills in the profile.
`,
});

const personalizedCareerSuggestionsFlow = ai.defineFlow(
  {
    name: 'personalizedCareerSuggestionsFlow',
    inputSchema: SkillProfileInputSchema,
    outputSchema: CareerSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
