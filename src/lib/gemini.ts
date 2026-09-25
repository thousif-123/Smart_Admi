import { GoogleGenAI, Type } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

export function isApiKeyValid(): boolean {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return false;
  const clean = apiKey.trim().replace(/^["']|["']$/g, "").trim();
  if (
    clean === "" ||
    clean === "MY_GEMINI_API_KEY" ||
    clean.toLowerCase().includes("placeholder") ||
    clean.startsWith("YOUR_") ||
    clean.startsWith("MY_") ||
    clean.length < 15
  ) {
    return false;
  }
  return true;
}

function getAiClient(): GoogleGenAI {
  if (!isApiKeyValid()) {
    throw new Error("Placeholder or missing Gemini API Key detected. Bypassing live API request and using fallback.");
  }
  if (!aiClient) {
    let apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please set your Gemini API key in the Settings > Secrets tab.");
    }
    // Clean API Key from whitespace and quotes in case of environment parsing issues
    const cleanApiKey = apiKey.trim().replace(/^["']|["']$/g, "").trim();
    aiClient = new GoogleGenAI({
      apiKey: cleanApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Keep the model name in one place. The previous `gemini-3.6-flash` value is
// not an available Gemini API model, which made every chat request fail.
export const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export async function generateSOP(studentData: any) {
  const prompt = `Generate a professional Statement of Purpose (SOP) for a student with the following details:
  Name: ${studentData.name}
  Academic Marks: Math ${studentData.math}%, Physics ${studentData.physics}%, Chemistry ${studentData.chemistry}%
  Selected Course: ${studentData.course}
  Interests: ${studentData.interests || 'Technology, Science, Innovation'}
  
  The SOP should be around 300 words, formal, and highlight why the student is a good fit for the course.`;

  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text;
}

export async function recommendCourses(marks: any, interests: string) {
  const prompt = `Based on the following academic performance and interests, suggest 3 best-fit university courses:
  Marks: Math ${marks.math}%, Physics ${marks.physics}%, Chemistry ${marks.chemistry}%
  Interests: ${interests}
  
  Return the suggestions in JSON format with 'courseName' and 'reason'.`;

  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            courseName: { type: Type.STRING },
            reason: { type: Type.STRING }
          }
        }
      }
    }
  });

  return JSON.parse(response.text);
}

export async function performOCR(base64Image: string, mimeType: string) {
  const prompt = "Extract all relevant information from this academic certificate/marksheet. Include Name, Subject Marks, Date of Issue, and Institution Name.";
  
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { text: prompt },
        { inlineData: { data: base64Image, mimeType } }
      ]
    }
  });

  return response.text;
}

export async function detectFraud(formData: any, ocrText: string) {
  const prompt = `Compare the following form data with the extracted OCR text from the document. 
  Identify any mismatches in names, marks, or dates. 
  Assign a fraud-risk score from 0 to 100 (0 means no detected fraud risk; 100 means highly suspicious/tampered).
  
  Form Data: ${JSON.stringify(formData)}
  OCR Text: ${ocrText}
  
  Return JSON with 'fraudScore', 'mismatches' (array of strings), and 'isAuthentic' (boolean).`;

  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          fraudScore: { type: Type.NUMBER },
          mismatches: { type: Type.ARRAY, items: { type: Type.STRING } },
          isAuthentic: { type: Type.BOOLEAN }
        }
      }
    }
  });

  return JSON.parse(response.text);
}

export async function getFinalDecision(profile: any) {
  const prompt = `Evaluate the following student profile for admission:
  Profile: ${JSON.stringify(profile)}
  
  Consider academic performance, document fraud-risk score (0 = low risk, 100 = high risk), and SOP quality.
  Return JSON with 'decision' (Approved/Rejected), 'recommendation' (Approve/Reject), and 'feedback' (string).`;

  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          decision: { type: Type.STRING },
          recommendation: { type: Type.STRING },
          feedback: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text);
}

export async function chatWithAssistant(message: string, history: any[] = []) {
  const ai = getAiClient();
  const chat = ai.chats.create({
    model,
    history: history,
    config: {
      systemInstruction: "You are a helpful AI Admission Assistant for SmartAdmi. Help students with their application, document requirements, and course queries."
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
}
