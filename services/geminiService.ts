import { GoogleGenAI, Type, Modality } from "@google/genai";
import { stripBase64Prefix, getMimeTypeFromBase64 } from "../utils";

/**
 * Generates meme captions for an image using Gemini 3.0 Pro.
 */
export const generateMemeCaptions = async (base64Image: string): Promise<string[]> => {
  // Initialize client inside the function to ensure process.env is available
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const mimeType = getMimeTypeFromBase64(base64Image);
  const data = stripBase64Prefix(base64Image);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType, data } },
          { text: "Analyze this image and provide 5 funny, witty, or sarcastic meme captions that fit the context perfectly. Return ONLY a JSON array of strings." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating captions:", error);
    throw error;
  }
};

/**
 * Edits an image based on a text prompt using Gemini 2.5 Flash Image (Nano Banana).
 */
export const editImageWithPrompt = async (base64Image: string, prompt: string): Promise<string> => {
  // Initialize client inside the function to ensure process.env is available
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const mimeType = getMimeTypeFromBase64(base64Image);
  const data = stripBase64Prefix(base64Image);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { mimeType, data } },
          { text: prompt }
        ]
      },
      config: {
        responseModalities: [Modality.IMAGE],
      }
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};