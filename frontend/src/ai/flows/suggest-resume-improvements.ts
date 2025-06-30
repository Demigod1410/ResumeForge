'use server';

/**
 * @fileOverview AI flow to provide suggestions for an entire resume.
 *
 * - suggestResumeImprovements - A function that handles the resume improvement process.
 */

import {ai} from '@/ai/genkit';
import {ResumeData, ResumeDataSchema} from '@/ai/schemas';

export async function suggestResumeImprovements(
  input: ResumeData
): Promise<ResumeData> {
  return suggestResumeImprovementsFlow(input);
}

const suggestResumeImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestResumeImprovementsFlow',
    inputSchema: ResumeDataSchema,
    outputSchema: ResumeDataSchema,
  },
  async (resumeData) => {
    const {output} = await ai.generate({
      prompt: `You are an AI resume enhancement expert. Your task is to review and improve resume data provided in JSON format. The goal is to rewrite the data with enhanced phrasing, polished grammar, and strong keyword optimization tailored for Applicant Tracking Systems (ATS). You must ensure the revised content meets the following guidelines:

    Action-Oriented Language: Begin bullet points with strong, industry-relevant action verbs (e.g., “Developed,” “Led,” “Optimized,” “Engineered,” “Streamlined”).

    Quantify Achievements: Wherever possible, add or enhance numerical metrics (e.g., "Increased load time efficiency by 35%", "Reduced bug reports by 50%", "Served over 1,000 users") to highlight measurable impact.

    Enhance Clarity & Grammar: Ensure each point is grammatically correct, easy to read, and clearly conveys the individual’s contributions and outcomes.

    Keyword Optimization:

        Include relevant technical and soft skills naturally into bullet points.

        Use role-specific terminology and current industry jargon.

        Avoid keyword stuffing—keywords must fit organically within the rewritten descriptions.

    Preserve Data Structure: Do not remove or rename any fields from the original JSON. If any field is missing content, retain it as-is in the output. Ensure the format and hierarchy of the JSON object remain strictly identical.

    Rewrite All Content: Revise all applicable fields, including:

        "title"

        "company"

        "duration"

        "description" or any similar array field listing achievements/responsibilities.

    Output Requirements:

        Your entire output must be ONLY the updated JSON object.

        Do not include code blocks, markdown formatting, or extra commentary of any kind.

    Tone & Style:

        Keep the tone professional and achievement-driven.

        Favor concise yet descriptive phrasing.

        Avoid passive voice.

    Assume the role fits a tech, software development, or design-oriented context unless otherwise specified in the content.'

Original Resume Data:
${JSON.stringify(resumeData, null, 2)}
`,
      output: {
        schema: ResumeDataSchema,
      },
    });
    return output!;
  }
);
