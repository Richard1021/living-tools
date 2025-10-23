import { GoogleGenAI } from "@google/genai";
import type { ChatMessage, GroundingChunk } from '../types';
import { 
    GEMINI_FLASH_MODEL, 
    GEMINI_PRO_MODEL, 
    IMAGEN_MODEL,
    INITIAL_ANALYSIS_PROMPT,
    IMAGEN_PROMPT_GENERATION_SYSTEM_INSTRUCTION
} from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * Analyzes the uploaded room image.
 */
export async function analyzeImage(imageBase64: string): Promise<string> {
  const response = await ai.models.generateContent({
      model: GEMINI_FLASH_MODEL,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
          { text: INITIAL_ANALYSIS_PROMPT },
        ],
      },
  });
  return response.text;
}

/**
 * Generates design ideas based on chat history and an image, using Google Search for grounding.
 */
export async function generateDesignIdea(
  chatHistory: ChatMessage[],
  imageBase64: string
): Promise<{ text: string; groundingChunks: GroundingChunk[] }> {
  // FIX: The original implementation mutated an array with an inferred type, causing a type error.
  // This was refactored to create a new array with the correct multimodal parts, ensuring type safety.
  const baseContents = chatHistory.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  // Add the image to the latest user message
  const lastUserMessageIndex = baseContents.map(c => c.role).lastIndexOf('user');
  
  const contents = baseContents.map((content, index) => {
    if (index === lastUserMessageIndex) {
      return {
        ...content,
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
          ...content.parts,
        ],
      };
    }
    return content;
  });

  const response = await ai.models.generateContent({
      model: GEMINI_FLASH_MODEL,
      contents: contents,
      config: {
          tools: [{ googleSearch: {} }],
      },
  });

  const text = response.text;
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return { text, groundingChunks };
}

/**
 * Generates a detailed, descriptive prompt for the Imagen model based on the conversation.
 */
export async function generateImagenPrompt(
    chatHistory: ChatMessage[],
    imageBase64: string
): Promise<string> {
    const conversation = chatHistory.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
    const prompt = `Based on the user's room and the following conversation, create a photorealistic, detailed prompt for an image generation model.

    Conversation:
    ---
    ${conversation}
    ---
    
    The prompt should describe the final designed room, including furniture, colors, lighting, materials, and overall style. The final output should be ONLY the prompt itself.`;

    const response = await ai.models.generateContent({
        model: GEMINI_PRO_MODEL,
        contents: {
            parts: [
                { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
                { text: prompt },
            ]
        },
        config: {
            systemInstruction: IMAGEN_PROMPT_GENERATION_SYSTEM_INSTRUCTION,
        },
    });

    return response.text;
}

/**
 * Generates an image using the Imagen model from a text prompt.
 */
export async function generateImage(prompt: string): Promise<string> {
    const response = await ai.models.generateImages({
        model: IMAGEN_MODEL,
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '4:3',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error('Image generation failed, no images were returned.');
    }

    return response.generatedImages[0].image.imageBytes;
}
