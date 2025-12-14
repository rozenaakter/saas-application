// app/api/ai/suggestions/route.ts - OPENROUTER VERSION
import { NextResponse } from "next/server";

// Fallback suggestions (যদি AI fail করে)
const FALLBACK_SUGGESTIONS = {
  subtasks: [
    "Research and gather requirements",
    "Create a detailed action plan",
    "Break down into smaller milestones",
    "Execute step by step",
    "Review and optimize the results"
  ],
  priority: "medium",
  timeEstimate: 90,
  tips: [
    "Start with the most critical part first",
    "Set specific deadlines for each subtask",
    "Review progress regularly"
  ]
};

// ✨ OpenRouter Models (FREE MODELS!)
const OPENROUTER_MODELS = [
  "google/gemini-2.0-flash-001:free",     // ⭐ Google's best FREE model!
  "google/gemini-flash-1.5-8b:free",      // Fast & FREE
  "meta-llama/llama-3.2-3b-instruct:free", // Meta's FREE model
  "mistralai/mistral-7b-instruct:free",   // Mistral FREE
  "nousresearch/hermes-3-llama-3.1-405b:free", // Very powerful FREE!
];

// System Prompt
const SYSTEM_PROMPT = `You are a smart task management assistant. When given a task, provide:
1. 3-5 specific, actionable subtasks
2. Priority (low/medium/high)
3. Time estimate in minutes
4. 2-3 helpful tips

IMPORTANT: Respond with ONLY valid JSON in this exact format:
{
  "subtasks": ["step 1", "step 2", "step 3"],
  "priority": "medium",
  "timeEstimate": 60,
  "tips": ["tip 1", "tip 2"]
}`;

// Parse AI Response
function parseResponse(text: string): any {
  let clean = text.trim();
  
  // Remove markdown
  if (clean.includes("```json")) {
    clean = clean.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  } else if (clean.includes("```")) {
    clean = clean.replace(/```\n?/g, "");
  }
  
  // Extract JSON
  const jsonMatch = clean.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    clean = jsonMatch[0];
  }
  
  return JSON.parse(clean.trim());
}

// Try OpenRouter Model
async function tryOpenRouterModel(
  modelName: string,
  title: string,
  description: string
): Promise<any> {
  
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error("OpenRouter API key not found");
  }
  
  console.log(`🤖 Trying FREE model: ${modelName}`);
  
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://your-app.com", // Optional
      "X-Title": "Task Manager AI", // Optional
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `Task: ${title}\nDescription: ${description || "None"}\n\nProvide JSON response only.`
        }
      ],
      temperature: 0.7,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${modelName}: ${response.status} - ${errorText.substring(0, 100)}`);
  }

  const data = await response.json();
  const responseText = data.choices[0]?.message?.content?.trim();
  
  if (!responseText) {
    throw new Error(`${modelName}: Empty response`);
  }

  console.log(`✅ ${modelName} succeeded! (FREE)`);

  const aiData = parseResponse(responseText);

  if (!aiData.subtasks || !Array.isArray(aiData.subtasks) || aiData.subtasks.length === 0) {
    throw new Error(`${modelName}: Invalid response structure`);
  }

  return {
    subtasks: aiData.subtasks,
    priority: aiData.priority || "medium",
    timeEstimate: aiData.timeEstimate || 60,
    tips: aiData.tips || [],
    aiModel: `${modelName} (FREE via OpenRouter)`,
    success: true
  };
}

// Try Multiple Models
async function tryMultipleModels(title: string, description: string) {
  const errors: string[] = [];
  
  for (const modelName of OPENROUTER_MODELS) {
    try {
      const result = await tryOpenRouterModel(modelName, title, description);
      return result;
    } catch (error: any) {
      errors.push(`${modelName}: ${error.message}`);
      console.log(`⚠️ ${modelName} failed, trying next...`);
      continue;
    }
  }
  
  throw new Error(`All FREE models failed: ${errors.join(" | ")}`);
}

// Main POST Route
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;
    
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🆓 OpenRouter FREE AI Request");
    console.log("Title:", title);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // Validation
    if (!title || title.trim().length < 3) {
      return NextResponse.json(
        { error: "Task title must be at least 3 characters" },
        { status: 400 }
      );
    }

    // Check API Key
    const apiKeyExists = !!process.env.OPENROUTER_API_KEY;
    console.log("🔑 OpenRouter API Key:", apiKeyExists ? "✅ Found" : "❌ Missing");

    if (!apiKeyExists) {
      console.log("⚠️ No OpenRouter API key, using fallback");
      return NextResponse.json({
        ...FALLBACK_SUGGESTIONS,
        aiModel: "fallback",
        success: false,
        error: "OpenRouter API key not configured"
      });
    }

    // Try FREE models
    try {
      const aiResponse = await tryMultipleModels(title, description || "");
      
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("✅ Success with:", aiResponse.aiModel);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      
      return NextResponse.json(aiResponse);
      
    } catch (aiError: any) {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("⚠️ All FREE AI models failed");
      console.log("Using fallback suggestions");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      
      return NextResponse.json({
        ...FALLBACK_SUGGESTIONS,
        aiModel: "fallback",
        success: false,
        error: `AI temporarily unavailable: ${aiError.message}`
      });
    }
    
  } catch (error: any) {
    console.error("❌ API Route Error:", error);
    
    return NextResponse.json({
      ...FALLBACK_SUGGESTIONS,
      aiModel: "fallback",
      success: false,
      error: error.message || "Unknown error occurred"
    }, { status: 500 });
  }
}