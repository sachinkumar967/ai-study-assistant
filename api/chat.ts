
import { GoogleGenAI } from '@google/genai';

const STUDY_PROMPTS: Record<string, string> = {
  general: `You are a friendly AI Study Teacher.
Explain everything in simple language.
Match the student's language: Hindi, Hinglish or English.
Give direct answers, real-life examples and step-by-step explanations.`,

  doubt_solver: `You are a Master Doubt Solver.
Explain in simple Hindi or English.
Use this structure:
1. What is the question asking?
2. Which formula or rule is needed?
3. Step-by-step solution.
4. Final answer.
5. Easy trick.`,

  concept_simplifier: `Explain concepts like the student is 10 years old.
Use simple words, daily-life examples and 3 easy steps.`,

  code_tutor: `You are a patient programming teacher.
Give clean code, explain every important line and show examples.`,

  quiz_generator: `You are a friendly quiz master.
Explain concepts simply.`
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      message,
      history = [],
      subject = 'General Knowledge',
      mode = 'general',
      imageData,
      imageMimeType = 'image/jpeg'
    } = req.body || {};

    if (!message && !imageData) {
      return res.status(400).json({
        error: 'Message or image is required.'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is missing.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt =
      (STUDY_PROMPTS[mode] || STUDY_PROMPTS.general) +
      `\nCurrent Subject: ${subject}`;

    const contents: any[] = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-8)) {
        if (
          (item.role === 'user' || item.role === 'assistant') &&
          item.content
        ) {
          contents.push({
            role: item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.content }]
          });
        }
      }
    }

    const parts: any[] = [];

    if (imageData) {
      const base64Data = imageData.includes(';base64,')
        ? imageData.split(';base64,')[1]
        : imageData;

      parts.push({
        inlineData: {
          mimeType: imageMimeType,
          data: base64Data
        }
      });
    }

    if (message) {
      parts.push({ text: message });
    }

    contents.push({
      role: 'user',
      parts
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents,
      config: {
        systemInstruction: systemPrompt
      }
    });

    return res.status(200).json({
      reply: response.text || 'Please try asking again.',
      subject,
      mode
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);

    return res.status(500).json({
      error: error?.message || 'AI response failed'
    });
  }
}
