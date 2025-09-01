'use server';

import { personalizedCareerSuggestions, type SkillProfileInput } from '@/ai/flows/personalized-career-suggestions';

export async function getCareerSuggestions(skillProfile: SkillProfileInput) {
  try {
    const result = await personalizedCareerSuggestions(skillProfile);
    if (!result || !result.suggestions) {
      throw new Error("Invalid response from AI model.");
    }
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching career suggestions:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, error: `Failed to get career suggestions: ${errorMessage}` };
  }
}
