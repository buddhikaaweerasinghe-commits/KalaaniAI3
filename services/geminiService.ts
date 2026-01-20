
import { GoogleGenAI, Type } from "@google/genai";
import { OutlineItem, SlideContent, GammaTheme, GammaFolder } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const GAMMA_API_KEY = process.env.GAMMA_API_KEY;

const fetchFromGammaApi = async <T>(endpoint: string): Promise<T[]> => {
  if (!GAMMA_API_KEY) {
    console.warn("Gamma API key is not configured.");
    return [];
  }

  try {
    const response = await fetch(`https://public-api.gamma.app/v1.0/${endpoint}?limit=50`, {
      headers: {
        'X-API-KEY': GAMMA_API_KEY,
      }
    });

    if (!response.ok) {
      throw new Error(`Gamma API request failed for ${endpoint}: ${response.status}`);
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error fetching from Gamma API (${endpoint}):`, error);
    return [];
  }
};

export const listGammaThemes = (): Promise<GammaTheme[]> => fetchFromGammaApi<GammaTheme>('themes');
export const listGammaFolders = (): Promise<GammaFolder[]> => fetchFromGammaApi<GammaFolder>('folders');


export const generateOutline = async (topic: string, slideCount: number, tone: string, lang: string): Promise<OutlineItem[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create a professional presentation outline for: "${topic}". 
      Total slides: ${slideCount}. Tone: ${tone}. Language: ${lang}.
      
      CRITICAL RULES:
      1. Use a mix of layout types for variety.
      2. 'title' for the first slide.
      3. 'agenda' should be the second slide to outline the schedule.
      4. 'section' for introducing new chapters.
      5. 'split' for comparison or balanced data.
      6. 'image' for visual emphasis.
      7. 'quote' for key insights.
      8. 'highlight' for punchy 3-5 word statements.
      9. 'content' for standard lists.
      10. 'closing' for the final slide.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            slideType: { 
              type: Type.STRING, 
              enum: ['title', 'content', 'image', 'split', 'closing', 'quote', 'highlight', 'section', 'agenda'] 
            },
          },
          required: ["id", "title", "description", "slideType"],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse outline JSON", e);
    throw new Error("Failed to generate outline");
  }
};

export const generateSlideFullContent = async (outline: OutlineItem[], tone: string, lang: string): Promise<SlideContent[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Transform this outline into slide content: ${JSON.stringify(outline)}. 
      Tone: ${tone}, Language: ${lang}.
      Provide:
      - Title: High-impact header.
      - Points: 3-5 concise bullets. 
        - For 'agenda' slides: Points MUST be formatted as "Time: Description" (e.g., "09:00: Introduction").
        - For 'section' slides: First point is a summary paragraph.
      - imagePrompt: A professional, minimalistic prompt. For 'agenda', suggest an illustration of a calendar or clock.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            points: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            type: { 
              type: Type.STRING, 
              enum: ['title', 'content', 'image', 'split', 'closing', 'quote', 'highlight', 'section', 'agenda'] 
            },
            imagePrompt: { type: Type.STRING }
          },
          required: ["id", "title", "points", "type", "imagePrompt"],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse slide content JSON", e);
    throw new Error("Failed to generate slide content");
  }
};

export const generateImageForSlide = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `Professional vector illustration or 3D render for presentation: ${prompt}. Flat design, corporate colors, clean lines, minimalist background.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return '';
};

export const generatePresentationWithGamma = async (
  topic: string, 
  slideCount: number, 
  tone: string, 
  language: string,
  themeId: string,
  folderId?: string
): Promise<{ generationId: string }> => {
  if (!GAMMA_API_KEY) {
    throw new Error("Gamma API key is not configured.");
  }

  const languageMap: { [key: string]: string } = {
    'English': 'en', 'Spanish': 'es', 'French': 'fr',
    'German': 'de', 'Chinese': 'zh', 'Japanese': 'ja',
  };

  const payload: any = {
    inputText: topic,
    textMode: "generate",
    format: "presentation",
    themeId: themeId,
    numCards: slideCount,
    textOptions: {
      amount: "detailed",
      tone: tone,
      language: languageMap[language] || 'en',
    },
    imageOptions: {
      source: "aiGenerated",
      model: "imagen-4-pro",
      style: "photorealistic"
    },
  };
  
  if (folderId) {
    payload.folderIds = [folderId];
  }
  
  const response = await fetch('https://public-api.gamma.app/v1.0/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': GAMMA_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gamma API request failed: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  return response.json();
};
