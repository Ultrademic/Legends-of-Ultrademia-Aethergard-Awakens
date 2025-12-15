import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { NPC_SYSTEM_INSTRUCTION } from '../constants';

let ai: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} else {
  console.warn("API_KEY is not defined in process.env");
}

export const generateNPCResponse = async (userMessage: string): Promise<string> => {
  if (!ai) {
    return "The spirits are silent (API Key missing).";
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: NPC_SYSTEM_INSTRUCTION,
        maxOutputTokens: 100,
      }
    });

    return response.text || "...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I cannot hear you clearly, adventurer. (Error)";
  }
};