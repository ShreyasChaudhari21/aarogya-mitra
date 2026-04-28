import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY");

export async function getTriageInsights(symptoms: string[], priority: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `As a medical triage assistant, analyze these symptoms: ${symptoms.join(', ')}. 
    The current assigned priority is ${priority}. 
    Provide a concise clinical reasoning and suggested immediate actions for the responding doctor. 
    Keep it under 60 words and professional.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "AI Triage analysis temporarily unavailable. Proceed with standard protocol AC-14.";
  }
}
