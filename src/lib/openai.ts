// lib/openai.ts
// Simple OpenAI Configuration - একই API key দিয়ে অনেক models

import OpenAI from "openai";

// ============================================
// OpenAI Client (একবার initialize করো)
// ============================================

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================
// TYPES
// ============================================

export interface AISuggestions {
  subtasks: string[];
  priority: "low" | "medium" | "high";
  timeEstimate: number;
  tips?: string[];
  aiModel?: string;
  success?: boolean;
  error?: string;
}

// ============================================
// Fallback Suggestions
// ============================================

export const FALLBACK_SUGGESTIONS: AISuggestions = {
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
  ],
  aiModel: "fallback",
  success: false
};

// ============================================
// OpenAI Models List (same API key দিয়ে সব কাজ করবে)
// ============================================

const OPENAI_MODELS = [
  "gpt-4o",              // সবচেয়ে powerful
  "gpt-4o-mini",         // fast এবং সস্তা (Recommended!)
  "gpt-3.5-turbo",       // সবচেয়ে সস্তা এবং দ্রুত
  "gpt-4-turbo",         // ভালো quality
];

// ============================================
// System Prompt
// ============================================

const SYSTEM_PROMPT = `You are a smart task management assistant. 
When given a task, provide:
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

// ============================================
// Response Parse করার function
// ============================================

function parseResponse(text: string): any {
  let clean = text.trim();
  
  // Markdown remove করো
  if (clean.includes("```json")) {
    clean = clean.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  } else if (clean.includes("```")) {
    clean = clean.replace(/```\n?/g, "");
  }
  
  // JSON খুঁজে বের করো
  const jsonMatch = clean.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    clean = jsonMatch[0];
  }
  
  return JSON.parse(clean.trim());
}

// ============================================
// একটা Model Try করো
// ============================================

async function tryModel(
  modelName: string, 
  title: string, 
  description: string
): Promise<AISuggestions> {
  
  console.log(`🤖 Trying: ${modelName}...`);
  
  const completion = await openai.chat.completions.create({
    model: modelName,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { 
        role: "user", 
        content: `Task: ${title}\nDescription: ${description || "None"}\n\nProvide JSON only.` 
      }
    ],
    temperature: 0.7,
    max_tokens: 600,
  });

  const responseText = completion.choices[0]?.message?.content?.trim();
  
  if (!responseText) {
    throw new Error("Empty response");
  }

  const data = parseResponse(responseText);

  // Check করো response ঠিক আছে কিনা
  if (!data.subtasks || !Array.isArray(data.subtasks) || data.subtasks.length === 0) {
    throw new Error("Invalid response");
  }

  console.log(`✅ ${modelName} worked!`);

  return {
    subtasks: data.subtasks,
    priority: data.priority || "medium",
    timeEstimate: data.timeEstimate || 60,
    tips: data.tips || [],
    aiModel: modelName,
    success: true
  };
}

// ============================================
// MAIN FUNCTION - AI Suggestions পাও
// ============================================

export async function getAISuggestions(
  title: string,
  description?: string
): Promise<AISuggestions> {
  
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚀 Getting AI Suggestions...");
  console.log("Title:", title);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const desc = description || "";

  // একটার পর একটা model try করো
  for (const modelName of OPENAI_MODELS) {
    try {
      const result = await tryModel(modelName, title, desc);
      
      // Success! সাথে সাথে return করো
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("✅ Success with:", modelName);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      
      return result;
      
    } catch (error: any) {
      console.log(`❌ ${modelName} failed:`, error.message);
      console.log(`⚠️ Trying next model...`);
      // পরের model try করো
      continue;
    }
  }

  // সব models fail করলে fallback দাও
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("⚠️ All models failed!");
  console.log("Using fallback suggestions");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  return {
    ...FALLBACK_SUGGESTIONS,
    error: "All OpenAI models failed"
  };
}