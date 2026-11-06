import { SubjectId, StudyModeId, QuizQuestion } from '../types';

export interface SendChatParams {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  subject: SubjectId;
  mode: StudyModeId;
  imageData?: string;
  imageMimeType?: string;
}

export interface SendChatResponse {
  reply: string;
  subject: SubjectId;
  mode: StudyModeId;
}

export async function checkServerHealth(): Promise<{ status: string; hasKey: boolean }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    return { status: 'error', hasKey: false };
  }
}

export async function askAIStudyAssistant(params: SendChatParams): Promise<SendChatResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let message = errorData.error || `Server returned error (${response.status})`;
      // If error message is a raw JSON string from upstream API, parse the human message
      if (typeof message === 'string' && message.includes('message')) {
        try {
          const parsed = JSON.parse(message);
          if (parsed?.error?.message) {
            message = parsed.error.message;
          }
        } catch {}
      }
      throw new Error(message);
    }

    return await response.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err?.name === 'AbortError') {
      throw new Error('Response timed out after 35 seconds. Please try asking again.');
    }
    throw err;
  }
}

export async function fetchGeneratedQuiz(topic: string, gradeLevel: string = 'High School'): Promise<QuizQuestion[]> {
  const response = await fetch('/api/generate-quiz', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic, gradeLevel }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate quiz');
  }

  const data = await response.json();
  return data.quiz || [];
}
