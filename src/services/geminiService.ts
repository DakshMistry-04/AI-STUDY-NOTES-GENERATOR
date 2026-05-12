import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateSummary(text: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Summarize the following text:\n\n${text}`,
    config: {
      systemInstruction: "You are an expert study assistant. Provide a concise, well-structured summary of the provided text. Use markdown bullet points for clarity.",
    }
  });
  return response.text;
}

export async function generateKeyPoints(text: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract key points from the following text:\n\n${text}`,
    config: {
      systemInstruction: "You are an expert study assistant. Extract the most important key points and definitions from the provided text. Use markdown.",
    }
  });
  return response.text;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export async function generateQuiz(text: string): Promise<QuizQuestion[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on the following text, generate 5 multiple-choice questions for a quiz. Return ONLY a JSON array of objects with fields: question (string), options (array of 4 strings), correctAnswer (index 0-3), explanation (string).\n\nText: ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse quiz JSON", e);
    return [];
  }
}

export async function generateFlashcards(text: string): Promise<Flashcard[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on the following text, generate 8 study flashcards. Return ONLY a JSON array of objects with fields: front (string), back (string).\n\nText: ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            front: { type: Type.STRING },
            back: { type: Type.STRING }
          },
          required: ["front", "back"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse flashcards JSON", e);
    return [];
  }
}
