import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GEMINI_MODEL_NAME, SYSTEM_INSTRUCTION } from "../constants";
import { AnalysisResult } from "../types";

// Helper to convert File to Base64
const fileToPart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    mermaidCode: {
      type: Type.STRING,
      description: "Valid Mermaid.js graph definition. IMPORTANT: You MUST use double quotes for ALL node labels to ensure parentheses and special characters are parsed correctly (e.g., A[\"User (Mobile)\"] --> B[\"API\"]).",
    },
    summary: {
      type: Type.STRING,
      description: "A concise executive summary of the architecture shown in the sketch.",
    },
    techStack: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          component: { type: Type.STRING, description: "The logical component (e.g., 'Load Balancer', 'Primary DB')" },
          technology: { type: Type.STRING, description: "Recommended technology (e.g., 'Nginx', 'PostgreSQL')" },
          reasoning: { type: Type.STRING, description: "Why this technology fits this architecture." }
        },
        required: ["component", "technology", "reasoning"]
      }
    }
  },
  required: ["mermaidCode", "summary", "techStack"]
};

export const analyzeSketch = async (file: File): Promise<AnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const base64Data = await fileToPart(file);

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data
            }
          },
          {
            text: "Analyze this system design sketch. Generate a Mermaid.js diagram code that perfectly represents the flow and structure. \n\nCRITICAL: Ensure all Mermaid node labels are wrapped in double quotes (e.g. id[\"Label Text\"]) to prevent syntax errors with parentheses. Also suggest a high-quality tech stack."
          }
        ]
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini.");
    }

    const data = JSON.parse(text) as AnalysisResult;
    return data;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
