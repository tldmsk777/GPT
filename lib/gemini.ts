import { GoogleGenerativeAI } from "@google/generative-ai";

export const MODEL_NAME = "gemini-3-flash-preview";

export const callGeminiJson = async (apiKey: string, prompt: string) => {
  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: MODEL_NAME });
  const response = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });

  return response.response.text();
};

export const safeParseJson = <T>(raw: string): T => {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned) as T;
};
