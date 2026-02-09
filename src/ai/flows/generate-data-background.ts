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

      // Wait until the operation completes.
      while (!operation.done) {
        operation = await ai.checkOperation(operation);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      if (operation.error) {
        return { backgroundDataUri: null };
      }

      const video = operation.output?.message?.content.find(p => !!p.media);
      if (!video) {
        return { backgroundDataUri: null };
      }

      const fetch = (await import('node-fetch')).default;
      const videoDownloadResponse = await fetch(
        `${video.media!.url}&key=${process.env.GEMINI_API_KEY}`
      );

      if (!videoDownloadResponse || videoDownloadResponse.status !== 200 || !videoDownloadResponse.body) {
        return { backgroundDataUri: null };
      }

      const fs = require('fs');
      const { Readable } = require('stream');
      const path = 'output.mp4';

      const writeStream = fs.createWriteStream(path);
      await new Promise((resolve, reject) => {
        Readable.from(videoDownloadResponse.body).pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      const backgroundDataUri = await new Promise<string>((resolve, reject) => {
        fs.readFile(path, { encoding: 'base64' }, (err: any, data: any) => {
          if (err) reject(err);
          else resolve('data:video/mp4;base64,' + data);
        });
      });

      return { backgroundDataUri };
    } catch (error) {
      // Gracefully handle billing or quota errors
      return { backgroundDataUri: null };
    }
  }
);
