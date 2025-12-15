import { GoogleGenAI, Type } from '@google/genai';
import { Entry } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateLexicalReflection = async (entries: Entry[]): Promise<string[]> => {
  const client = getAiClient();
  if (!client) return ["Error: No API Key provided."];

  // Prepare data context (only recent 50 entries to save tokens/relevance)
  const context = entries.slice(0, 50).map(e => `[${e.timestamp.split('T')[0]}] ${e.text}`).join('\n');

  const systemInstruction = `
    You are a mirror that does not just reflect the surface, but questions the depth.
    The user is writing in a minimalist journal that logs "evidence" of existence.
    
    Your Goal:
    Read the provided entries. Do not just look at the words. Look at the *intent*.
    Ask yourself: "Who is the person writing this? Why was *this* specific moment important enough to keep?"
    
    Output:
    Identify 3 subtle currents in the text.
    Convert these currents into **open-ended, existential questions** for the user.
    
    Core Principles:
    1. NO PREACHING. Do not give advice. Do not suggest they "explore feelings."
    2. NO THERAPY SPEAK. Avoid words like "process," "heal," "mental health," "coping."
    3. LOOK FOR THE UNSAID. If they describe noise, ask about the silence. If they describe objects, ask about the space around them.
    4. BE OBLIQUE. The question should feel like a riddle or a poem that only they can answer.
    
    Examples of the desired Output Style:
    - "You document the texture of walls and stones. What are your hands trying to remember?"
    - "The entries often end abruptly. What is the thought you are choosing not to write?"
    - "You write about light only when it is fading. What does the darkness offer you?"
    - "There is a recurring mention of 'waiting'. Who is the one waiting, and what arrives in the delay?"
    
    Return ONLY a JSON array of strings. No intro, no markdown.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze these entries and return 3 deep inquiries:\n${context}`,
      config: {
        systemInstruction,
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
    console.error("Reflection generation failed", error);
    return ["The mirror is cloudy right now."];
  }
};