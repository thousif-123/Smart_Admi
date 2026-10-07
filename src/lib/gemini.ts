import { GoogleGenAI, Type } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

export function getCleanApiKey(): string | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const clean = apiKey.trim().replace(/^["']|["']$/g, "").trim();
  if (
    clean === "" ||
    clean === "MY_GEMINI_API_KEY" ||
    clean.toLowerCase().includes("placeholder") ||
    clean.startsWith("YOUR_") ||
    clean.startsWith("MY_") ||
    clean.length < 15
  ) {
    return null;
  }
  return clean;
}

export function isApiKeyValid(): boolean {
  return getCleanApiKey() !== null;
}

export function getAiClient(): GoogleGenAI {
  const cleanApiKey = getCleanApiKey();
  if (!cleanApiKey) {
    throw new Error("Missing or invalid Gemini API Key detected. Please configure GEMINI_API_KEY in your environment.");
  }
  if (!aiClient) {
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

export async function explainDocument(documentData: any) {
  const prompt = `You are SmartAdmi AI Document Explainer. Provide a simple, clear, human-readable breakdown of the extracted document OCR information and verification results.

DOCUMENT DATA PROVIDED:
${JSON.stringify(documentData, null, 2)}

RULES & CRITICAL DISTINCTIONS:
1. Use ONLY the extracted OCR and verification data supplied above.
2. NEVER invent marks, document types, or student names.
3. CRITICAL DISTINCTION:
   - OCR Extraction means "Information was extracted from the uploaded document image".
   - Authenticity Verification means "Checking if extracted data matches application entries and security rules".
   - NEVER claim a document is authentic solely because OCR succeeded.
   - NEVER claim a document is fraudulent solely because of an OCR scan issue.
4. Explain any warnings ONLY if actual verification flags or reasons exist in the data.
5. Keep explanations student-friendly, simple, structured, and helpful. Do not expose sensitive IDs.

Return JSON with:
- documentType: string (e.g. "12th Marks Memo", "EAMCET Rank Card", etc.)
- extractionStatus: string (e.g. "Completed")
- extractedHighlights: array of strings (key extracted fields like subject marks or rank)
- highestSubject: string or null
- simpleExplanation: string (2-3 paragraphs written directly to the student explaining what was extracted, how it compares with their application, and what it means)
- extractionVsVerificationNote: string (1 sentence reinforcing that OCR extraction is separate from authenticity verification)`;

  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          documentType: { type: Type.STRING },
          extractionStatus: { type: Type.STRING },
          extractedHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
          highestSubject: { type: Type.STRING },
          simpleExplanation: { type: Type.STRING },
          extractionVsVerificationNote: { type: Type.STRING }
        },
        required: ["documentType", "extractionStatus", "extractedHighlights", "simpleExplanation", "extractionVsVerificationNote"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function getAdmissionCopilotResponse(userMessage: string, contextData: any) {
  const systemInstruction = `You are "SmartAdmi AI Copilot", an intelligent, context-aware admission copilot for the SmartAdmi College Admission & Verification System.
You are assisting the currently authenticated student regarding THEIR OWN specific application details.

AUTHORIZED STUDENT APPLICATION CONTEXT:
${JSON.stringify(contextData, null, 2)}

STRICT COPILOT RESPONSE RULES:
1. Answer ONLY using available verified application data and approved admission information supplied in the context above.
2. NEVER invent application details, document statuses, verification results, cutoffs, or college info.
3. NEVER claim admission is guaranteed.
4. If specific application or document information is unavailable, explicitly state that it is unavailable.
5. Clearly distinguish between:
   a) REAL APPLICATION DATA (Status, submitted documents, extracted marks)
   b) AI EXPLANATION (Analysis of verification status or marks)
   c) GENERAL ADMISSION GUIDANCE (Next steps, counseling advice)
6. NEVER expose another user's information or attempt cross-user data lookups.
7. NEVER make a binding final admission decision — final decisions are made by the college admission board.
8. Structure answers cleanly using Markdown (bold text, bullet points, numbered steps where appropriate). Keep responses direct, helpful, and polite.`;

  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model,
    contents: userMessage,
    config: {
      systemInstruction,
      temperature: 0.3
    }
  });

  return response.text;
}

export async function detectPresentCollegeCutoff(queryCollege: string, queryBranch: string, category: string = 'OC', year: number = 2026) {
  const prompt = `You are SmartAdmi College Cutoff AI. Analyze and detect the present cutoff marks/ranks for the specified college, branch, and category.

Query Parameters:
- College Name / Code: ${queryCollege}
- Branch / Specialization: ${queryBranch}
- Category: ${category} (OC/BC/SC/ST/EWS)
- Target Academic Year: ${year}

Analyze typical AP/Telangana EAMCET / EAPCET cutoff trends, competition shifts, and seat allocation parameters for this college.

Return structured JSON with:
- collegeName: string
- branch: string
- targetYear: number (e.g. ${year})
- estimatedCutoffRank: number (estimated 2026 cutoff rank)
- previousYearCutoffRank: number (2025 cutoff rank)
- category: string
- competitionTrend: string ("Rising", "Stable", or "Dropping")
- reasoning: string (2-3 concise sentences explaining the cutoff trends, category shifts, and counseling advice)
- safeRankRange: string (e.g. "Rank 1 to 4,500")`;

  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          collegeName: { type: Type.STRING },
          branch: { type: Type.STRING },
          targetYear: { type: Type.INTEGER },
          estimatedCutoffRank: { type: Type.INTEGER },
          previousYearCutoffRank: { type: Type.INTEGER },
          category: { type: Type.STRING },
          competitionTrend: { type: Type.STRING },
          reasoning: { type: Type.STRING },
          safeRankRange: { type: Type.STRING }
        },
        required: ["collegeName", "branch", "targetYear", "estimatedCutoffRank", "previousYearCutoffRank", "category", "competitionTrend", "reasoning", "safeRankRange"]
      }
    }
  });

  return JSON.parse(response.text);
}


