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
    .describe(
      'The data URI of the generated animated data background, as a video/mp4. Data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' /* The data URI of the generated image. */
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
    let { operation } = await ai.generate({
      model: 'googleai/veo-2.0-generate-001',
      prompt: input.prompt,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes. Note that this may take some time, maybe even up to a minute. Design the UI accordingly.
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      // Sleep for 5 seconds before checking again.
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error('failed to generate video: ' + operation.error.message);
    }

    const video = operation.output?.message?.content.find(p => !!p.media);
    if (!video) {
      throw new Error('Failed to find the generated video');
    }
    const fetch = (await import('node-fetch')).default;
    // Add API key before fetching the video.
    const videoDownloadResponse = await fetch(
      `${video.media!.url}&key=${process.env.GEMINI_API_KEY}`
    );
    if (
      !videoDownloadResponse ||
      videoDownloadResponse.status !== 200 ||
      !videoDownloadResponse.body
    ) {
      throw new Error('Failed to fetch video');
    }
    const fs = require('fs');
    const {Readable} = require('stream');
    const path = 'output.mp4';

    Readable.from(videoDownloadResponse.body).pipe(fs.createWriteStream(path));

    const backgroundDataUri = await new Promise<string>((resolve, reject) => {
      fs.readFile(path, {encoding: 'base64'}, (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve('data:video/mp4;base64,' + data);
        }
      });
    });

    return {backgroundDataUri};
  }
);
