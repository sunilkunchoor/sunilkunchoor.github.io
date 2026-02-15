'use server';

/**
 * @fileOverview A flow to generate an animated data-themed background using AI.
 *
 * - generateDataBackground - A function that generates an animated data-themed background.
 * - GenerateDataBackgroundInput - The input type for the generateDataBackground function.
 * - GenerateDataBackgroundOutput - The return type for the generateDataBackground function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDataBackgroundInputSchema = z.object({
  prompt: z
    .string()
    .default(
      'Subtle animated background with particles and grid representing data and AI, dark engineering theme.'
    )
    .describe('The prompt to use for generating the data background.'),
});
export type GenerateDataBackgroundInput = z.infer<typeof GenerateDataBackgroundInputSchema>;

const GenerateDataBackgroundOutputSchema = z.object({
  backgroundDataUri: z
    .string()
    .nullable()
    .describe(
      'The data URI of the generated animated data background, as a video/mp4. Returns null if generation fails or is restricted.'
    ),
});
export type GenerateDataBackgroundOutput = z.infer<typeof GenerateDataBackgroundOutputSchema>;

export async function generateDataBackground(
  input: GenerateDataBackgroundInput
): Promise<GenerateDataBackgroundOutput> {
  return generateDataBackgroundFlow(input);
}

const generateDataBackgroundFlow = ai.defineFlow(
  {
    name: 'generateDataBackgroundFlow',
    inputSchema: GenerateDataBackgroundInputSchema,
    outputSchema: GenerateDataBackgroundOutputSchema,
  },
  async input => {
    try {
      let { operation } = await ai.generate({
        model: 'googleai/veo-2.0-generate-001',
        prompt: input.prompt,
        config: {
          durationSeconds: 5,
          aspectRatio: '16:9',
        },
      });

      if (!operation) {
        return { backgroundDataUri: null };
      }

      // Wait until the operation completes (max 12 attempts / 1 minute)
      let attempts = 0;
      while (!operation.done && attempts < 12) {
        operation = await ai.checkOperation(operation);
        if (operation.done) break;
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;
      }

      if (!operation.done || operation.error) {
        console.error('Video generation failed or timed out:', operation.error);
        return { backgroundDataUri: null };
      }

      const videoPart = operation.output?.message?.content.find(p => !!p.media);
      if (!videoPart?.media?.url) {
        return { backgroundDataUri: null };
      }

      // Use built-in fetch (Node 18+) and process in memory instead of disk
      const videoDownloadResponse = await fetch(
        `${videoPart.media.url}&key=${process.env.GEMINI_API_KEY}`
      );

      if (!videoDownloadResponse.ok) {
        return { backgroundDataUri: null };
      }

      const arrayBuffer = await videoDownloadResponse.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      
      return { 
        backgroundDataUri: `data:video/mp4;base64,${base64}` 
      };
    } catch (error) {
      console.error('Error in generateDataBackgroundFlow:', error);
      return { backgroundDataUri: null };
    }
  }
);
