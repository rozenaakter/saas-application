// app/api/ai/chat/route.ts
// AI Chat API - Same as Task Suggestions (OpenRouter)

import { NextResponse } from "next/server";

// ✅ Same models as task suggestions
const OPENROUTER_MODELS = [
  "google/gemini-2.0-flash-001:free",
  "google/gemini-flash-1.5-8b:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "mistralai/mistral-7b-instruct:free",   // Mistral FREE
  "nousresearch/hermes-3-llama-3.1-405b:free", // Very powerful FREE
];

// System prompt for chat
const CHAT_SYSTEM_PROMPT = `You are a helpful task management assistant. 
Help users with:
- Task planning and organization
- Breaking down complex projects
- Productivity tips and advice
- Time management strategies
- Goal setting

Keep responses:
- Clear and concise (2-4 sentences)
- Actionable and practical
- Encouraging and positive
- Use bullet points when listing items`;

// Try OpenRouter Model
async function tryOpenRouterChat(
  modelName: string,
  userMessage: string
): Promise<string> {
  
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error("OpenRouter API key not configured");
  }
  
  console.log(`🤖 Trying: ${modelName}`);
  
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        {
          role: "system",
          content: CHAT_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${modelName}: ${response.status} - ${errorText.substring(0, 100)}`);
  }

  const data = await response.json();
  const aiResponse = data.choices[0]?.message?.content?.trim();
  
  if (!aiResponse) {
    throw new Error(`${modelName}: Empty response`);
  }

  console.log(`✅ ${modelName} succeeded!`);
  return aiResponse;
}

// Try Multiple Models (Same as task suggestions)
async function getChatResponse(userMessage: string): Promise<string> {
  const errors: string[] = [];
  
  for (const modelName of OPENROUTER_MODELS) {
    try {
      const response = await tryOpenRouterChat(modelName, userMessage);
      return response;
    } catch (error: any) {
      errors.push(`${modelName}: ${error.message}`);
      console.log(`⚠️ ${modelName} failed, trying next...`);
      continue;
    }
  }
  
  // All models failed
  throw new Error(`All models failed: ${errors.join(" | ")}`);
}

// Main POST Route
export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("💬 AI Chat Request");
    console.log("Message:", message);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Validation
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Message too long (max 1000 characters)" },
        { status: 400 }
      );
    }

    // Check API key
    const apiKeyExists = !!process.env.OPENROUTER_API_KEY;
    console.log("🔑 OpenRouter API Key:", apiKeyExists ? "✅ Found" : "❌ Missing");

    if (!apiKeyExists) {
      return NextResponse.json({
        response: "I'm currently in demo mode. To enable AI chat, please add OPENROUTER_API_KEY to your .env.local file.",
        success: false
      });
    }

    // Get AI response (try multiple models)
    try {
      const aiResponse = await getChatResponse(message.trim());
      
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("✅ Chat response generated");
      console.log("Response length:", aiResponse.length);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      return NextResponse.json({
        response: aiResponse,
        success: true
      });
      
    } catch (aiError: any) {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("⚠️ All AI models failed");
      console.log("Error:", aiError.message);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      
      return NextResponse.json({
        response: "I'm having trouble connecting to the AI service right now. Please try again in a moment.",
        success: false,
        error: aiError.message
      });
    }

  } catch (error: any) {
    console.error("❌ Chat API error:", error);
    
    return NextResponse.json({
      response: "An unexpected error occurred. Please try again.",
      success: false,
      error: error.message
    }, { status: 500 });
  }
}