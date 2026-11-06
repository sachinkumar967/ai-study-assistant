import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI SDK on server side with required User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System instructions for different study roles with emphasis on simple, student-friendly language
const STUDY_PROMPTS: Record<string, string> = {
  general: `You are "AI Study Assistant", an expert, warm, and friendly personal AI teacher.
YOUR HIGHEST PRIORITY IS TO EXPLAIN EVERYTHING IN VERY SIMPLE, CLEAR, AND EASY LANGUAGE (Bilkul aasan aur saral bhasha me).

CRITICAL TEACHING PRINCIPLES:
1. SIMPLE LANGUAGE ONLY: Never use complicated academic jargon or difficult vocabulary without immediately explaining it in very plain words. Speak like a friendly, patient teacher.
2. DIRECT ANSWER FIRST: Give the main answer or concept directly in the first 1-2 lines. Don't beat around the bush or write useless filler.
3. REAL-LIFE EXAMPLE: Always include a simple, relatable everyday example (e.g. comparing physics to cycling/cricket, computers to a kitchen/library, biology to a plant in your garden) so the concept clicks instantly.
4. LANGUAGE MATCHING:
   - If the student asks in Hindi or Hinglish (e.g., "ye kaise hota hai", "solve karo", "samjhao", "kya hai"), ALWAYS reply in friendly, conversational Hindi/Hinglish with English technical terms in brackets.
   - If asked in English, use simple, clean English (Grade 6-8 reading level) that is effortless to read.
5. STEP-BY-STEP BREAKDOWN: Use simple numbered points (Step 1, Step 2, Step 3) for all maths, code, and science problems.
6. FORMATTING: Use clean Markdown (bold for key words, small tables, and clean code blocks) so the student can scan and learn fast.`,

  doubt_solver: `You are the "Master Doubt Solver" inside AI Study Assistant.
Your goal is to solve difficult student questions in the SIMPLEST, CLEAREST, AND MOST INTUITIVE WAY possible.

Language Rule: Match the student's language. If they ask in Hindi/Hinglish, explain in simple Hindi/Hinglish!

Structure EVERY solution like this:
### 🎯 Sawal Kya Puch Raha Hai? (Problem in Simple Words)
(Explain what is given and what we need to find in 1-2 simple sentences)

### 🔑 Kaunsa Formula / Rule Lagega? (Formula & Core Idea)
(Show the basic formula or principle clearly)

### 📝 Step-by-Step Hal (Easy Step-by-Step Working)
(Show each step clearly with calculation: Step 1, Step 2, Step 3... Do not skip any intermediate step!)

### 💡 Final Answer (Sahi Uttar)
(Clearly highlight the final answer so the student sees it immediately)

### 🌟 Asaan Trick / Common Mistake (Pro-Tip)
(One simple tip to remember this forever or a common mistake to avoid)`,

  concept_simplifier: `You are the "Concept Simplifier" (ELI5 Teacher).
Explain the topic so simply that even a 10-year-old student will understand it instantly with a big smile.
1. The Core Idea in 1 Simple Sentence.
2. The Everyday Fun Analogy (e.g. cricket, cooking, mobile phone, pocket money).
3. How it Works in 3 Easy Steps.
4. Why this is Useful in Real Life.`,

  code_tutor: `You are a patient Programming & CS Mentor.
Explain coding concepts and bugs in super simple language:
1. Provide clean, well-commented code.
2. Explain line-by-line what each line does in simple words.
3. Give input and output examples.
4. Mention any simple mistake to avoid.`,

  quiz_generator: `You are a friendly Quiz Master.
Generate 3 simple, engaging practice questions with choices A, B, C, D, clear hints, and easy-to-understand explanations.`,
};

// API: Check status of AI service
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// API: Chat and Study Assistance with Gemini
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const {
      message,
      history = [],
      subject = 'General Knowledge',
      mode = 'general',
      imageData, // base64 string if student uploaded an image/photo of a doubt
      imageMimeType = 'image/jpeg',
    } = req.body;

    if (!message && !imageData) {
      return res.status(400).json({ error: 'Message or image is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error:
          'GEMINI_API_KEY is not configured on the server. Please verify your environment secrets.',
      });
    }

    const baseSystemPrompt = STUDY_PROMPTS[mode] || STUDY_PROMPTS.general;
    const contextualSystemPrompt = `${baseSystemPrompt}

Current Subject Focus: ${subject}
The student is actively studying. Adapt your tone, depth, and examples to match this subject.`;

    // Construct contents. If there's an image attachment, include inlineData
    const contents: any[] = [];

    // Append prior conversational history (sanitized, max last 10 messages for context)
    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-8);
      for (const item of recentHistory) {
        if (item.role === 'user') {
          contents.push({
            role: 'user',
            parts: [{ text: item.content || item.text || '' }],
          });
        } else if (item.role === 'assistant' || item.role === 'model') {
          contents.push({
            role: 'model',
            parts: [{ text: item.content || item.text || '' }],
          });
        }
      }
    }

    // Build the latest user message parts
    const currentParts: any[] = [];
    if (imageData) {
      // Strip base64 prefix if provided
      const base64Data = imageData.includes(';base64,')
        ? imageData.split(';base64,')[1]
        : imageData;

      currentParts.push({
        inlineData: {
          mimeType: imageMimeType || 'image/jpeg',
          data: base64Data,
        },
      });
    }

    const userTextPrompt = message
      ? message
      : 'Please analyze this problem or image carefully and solve it step by step for me.';
    currentParts.push({ text: userTextPrompt });

    contents.push({
      role: 'user',
      parts: currentParts,
    });

    // Prioritize ultra-fast gemini-3.1-flash-lite (<500ms) with fallback to gemini-3.8-flash and gemini-flash-latest
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let lastError: any = null;
    let replyText = '';

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: model,
          contents: contents,
          config: {
            systemInstruction: contextualSystemPrompt,
          },
        });
        replyText = response.text || '';
        if (replyText) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} encounter:`, err?.status || err?.message);
        // Wait 400ms before next attempt
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }

    if (!replyText && lastError) {
      throw lastError;
    }

    return res.json({
      reply: replyText || 'I could not generate an answer at this time. Please try rephrasing your question.',
      subject,
      mode,
    });
  } catch (error: any) {
    console.error('Error generating AI study response:', error);
    const errorMessage = error?.message || 'Failed to communicate with AI study assistant';
    return res.status(500).json({
      error: errorMessage,
      details: error?.status || 'INTERNAL_ERROR',
    });
  }
});

// API: Quick Question Generator (generates structured quiz/flashcards for active topic)
app.post('/api/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { topic = 'Algebra', gradeLevel = 'High School' } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const prompt = `Create a 3-question multiple choice practice quiz on the topic "${topic}" suitable for a ${gradeLevel} student.
Return the response ONLY as a JSON array with the following format:
[
  {
    "id": 1,
    "question": "Clear question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "hint": "Gentle clue to think about",
    "explanation": "Why this answer is correct step-by-step"
  }
]`;

    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let quizData: any[] = [];

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        const text = response.text || '[]';
        quizData = JSON.parse(text);
        if (Array.isArray(quizData) && quizData.length > 0) break;
      } catch (err) {
        console.warn(`Quiz model ${model} failed, trying next:`, err);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    return res.json({ quiz: quizData });
  } catch (err: any) {
    console.error('Error in generate-quiz:', err);
    return res.status(500).json({ error: err?.message || 'Could not generate quiz' });
  }
});

// Mount Vite or static server
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const port = 3000;

  if (isProduction) {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`AI Study Assistant server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});
