'use server';
/**
 * @fileOverview AI flow to enhance a single work experience entry on a resume.
 *
 * - enhanceExperience - A function that enhances a single work experience.
 */

import {ai} from '@/ai/genkit';
import {ExperienceEntrySchema, type ExperienceEntry} from '@/ai/schemas';

export async function enhanceExperience(
  input: ExperienceEntry
): Promise<ExperienceEntry> {
  return enhanceExperienceFlow(input);
}

const enhanceExperienceFlow = ai.defineFlow(
  {
    name: 'enhanceExperienceFlow',
    inputSchema: ExperienceEntrySchema,
    outputSchema: ExperienceEntrySchema,
  },
  async experience => {
    const {output} = await ai.generate({
      prompt: `You are a professional resume writing assistant. Your task is to enhance a single work experience entry provided in JSON format.
Rewrite the 'description' to be more impactful by using strong action verbs and quantifying achievements where possible. Make it sound professional and ATS-friendly.
You may subtly polish the 'title' for clarity, but keep it aligned with the original role.
The 'company' and 'dates' fields MUST remain unchanged.
Your entire output must be ONLY the updated JSON object. Do not include any extra text, markdown, or commentary.

Original Experience Entry:
${JSON.stringify(experience, null, 2)}
`,
      output: {
        schema: ExperienceEntrySchema,
      },
    });
    return output!;
  }
);
