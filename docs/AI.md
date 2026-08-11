# Gemini AI Integration - Dettroin Assistant

## Architecture & Security
- Server-side route handler `/api/ai/bug-analysis` ensures `GEMINI_API_KEY` is never exposed in client bundles.
- Uses `@google/generative-ai` SDK (Gemini 1.5/3.6 models).

## Capabilities
1. **Ticket Summarization**: Condenses long discussion threads into root cause & required action.
2. **Auto Classification**: Categorizes issue as `api_issue`, `ui_issue`, `database_issue`, etc.
3. **Bug Fix Suggestion**: Generates proposed SQL/TypeScript code fixes.
4. **Reproduction Steps**: Generates step-by-step QA verification checklists.
