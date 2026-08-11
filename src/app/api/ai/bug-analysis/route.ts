import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticketTitle, description, errorPayload, codeSnippet } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback deterministic AI response if API key is not configured
      return NextResponse.json({
        summary: `The ticket "${ticketTitle}" describes a schema/interface mismatch during API payload deserialization.`,
        suggestedType: 'api_issue',
        suggestedPriority: 'high',
        duplicateDetected: false,
        rootCause: 'The server response schema sends `student` and `attendance_percentage` instead of `student_id` and `attendance`.',
        suggestedFix: `// Proposed TypeScript / SQL View Fix:\nALTER VIEW student_attendance_view AS\nSELECT id AS student_id, percentage AS attendance FROM attendance_logs;`,
        reproductionSteps: [
          '1. Send GET request to /api/students/101 in staging environment.',
          '2. Inspect JSON response body for missing student_id property.',
          '3. Observe frontend Zod / TypeScript parser exception.',
        ],
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are Dettroin AI Assistant, an expert software architecture and QA assistant. Analyze this technical issue:
Title: ${ticketTitle}
Description: ${description}
Error/Payload: ${errorPayload}
Code: ${codeSnippet}

Respond in clean JSON format with these exact keys:
"summary" (string), "suggestedType" (string), "suggestedPriority" (string), "duplicateDetected" (boolean), "rootCause" (string), "suggestedFix" (string), "reproductionSteps" (array of strings).`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    try {
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return NextResponse.json(parsed);
    } catch (parseError) {
      return NextResponse.json({
        summary: text,
        suggestedType: 'bug',
        suggestedPriority: 'high',
        duplicateDetected: false,
        rootCause: 'Detailed analysis generated.',
        suggestedFix: 'Review server route mappings.',
        reproductionSteps: ['Execute GET endpoint', 'Inspect response'],
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'AI request failed' }, { status: 500 });
  }
}
