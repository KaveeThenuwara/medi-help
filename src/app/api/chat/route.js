import { ChatOpenAI } from "@langchain/openai";

// Medical knowledge base for RAG
const medicalKnowledgeBase = `
Medical Knowledge Base:

Common Cold and Flu:
- Symptoms: Fever (100-103°F), cough, sore throat, runny nose, body aches
- Treatment: Rest, fluids, over-the-counter pain relievers, honey for cough
- Duration: Usually 7-10 days
- When to see doctor: Symptoms persist beyond 2 weeks, high fever (>104°F)

Headache and Migraines:
- Migraine symptoms: Severe throbbing pain, sensitivity to light/sound, nausea, vomiting
- Common triggers: Stress, lack of sleep, certain foods, hormonal changes
- Treatment: Dark quiet room, pain medication, hydration
- Tension headache: Usually dull, pressing sensation on both sides
- When urgent: Sudden worst headache of life, stiff neck, confusion

Abdominal Pain:
- Mild: Usually resolves with rest and fluids, light diet
- Moderate: Could be gastritis, food poisoning, or indigestion
- Severe: Sharp pain, persistent pain >2 hours needs medical attention
- Red flags: Severe vomiting, bloody stools, inability to keep food down
- Treatment: Anti-nausea medication, electrolyte solutions

Chest Pain (URGENT):
- If chest pain is present with shortness of breath, call emergency immediately
- Could indicate heart attack, pulmonary embolism, or other serious conditions
- Do not delay seeking medical attention

Cough:
- Dry cough: Usually viral, try honey, cough drops, hydration
- Productive cough: With mucus, usually indicates infection
- Persistent cough: >3 weeks needs medical evaluation
- Treatment: Cough suppressants, expectorants, steam inhalation

Fever:
- Normal body temperature: 98.6°F (37°C)
- Low fever: 99-101°F (37.2-38.3°C) - usually viral
- High fever: >103°F (39.4°C) - needs medical attention
- Treatment: Fever reducers, adequate hydration, rest
- When to seek help: Fever in infants <3 months, persistent fever >3 days

Nausea and Vomiting:
- Causes: Food poisoning, viral infection, gastritis, motion sickness
- Treatment: Small frequent sips of water, electrolyte solution (Gatorade, coconut water)
- Avoid: Solid foods, dairy, fatty foods until recovered
- When urgent: Persistent vomiting >4 hours, dehydration signs, blood in vomit

Back Pain:
- Muscle strain: Usually from poor posture or heavy lifting
- Treatment: Ice for first 48 hours, then heat, stretching, over-the-counter pain relief
- Prevention: Good posture, proper lifting technique, regular exercise
- When to see doctor: Pain after injury, numbness/tingling, loss of bladder control

Sore Throat:
- Viral: Usually self-limiting, 7-10 days
- Bacterial (strep): May need antibiotics
- Treatment: Warm salt water gargle, throat lozenges, hydration
- Warning signs: Severe difficulty swallowing, drooling, difficulty breathing

General Health Tips:
- Stay hydrated: Drink 8-10 glasses of water daily
- Sleep: Get 7-9 hours of quality sleep
- Exercise: 30 minutes moderate activity most days
- Nutrition: Balanced diet with fruits, vegetables, proteins
- Hygiene: Wash hands frequently, especially before eating and after using restroom
- When in doubt, consult a healthcare professional
`;

let vectorStore = [];

function splitIntoChunks(text, chunkSize = 500) {
  const chunks = [];
  const words = text.split(/\s+/);
  let currentChunk = [];
  let currentSize = 0;

  words.forEach(word => {
    currentChunk.push(word);
    currentSize += word.length + 1;

    if (currentSize > chunkSize) {
      chunks.push(currentChunk.join(" "));
      currentChunk = [];
      currentSize = 0;
    }
  });

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }

  return chunks;
}

function initializeVectorStore() {
  const chunks = splitIntoChunks(medicalKnowledgeBase);
  vectorStore = chunks.map((chunk, i) => ({
    id: i,
    content: chunk,
    embedding: chunk.toLowerCase()
  }));
}

function retrieveRelevantDocs(query, topK = 2) {
  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(/\s+/);

  const scored = vectorStore.map(doc => {
    let score = 0;
    keywords.forEach(keyword => {
      if (doc.embedding.includes(keyword)) {
        score += 1;
      }
    });
    return { ...doc, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(doc => doc.content);
}

initializeVectorStore();

const systemPrompt = `You are MediHelp AI, a helpful medical assistant for a healthcare application. 
You provide general health information and symptom guidance based on medical knowledge.

IMPORTANT GUIDELINES:
1. Always remind users to consult healthcare professionals for serious conditions
2. For chest pain, difficulty breathing, severe symptoms - ALWAYS recommend emergency services
3. Provide evidence-based information
4. Be empathetic and professional
5. Do not diagnose - only provide information about symptoms
6. Suggest booking appointments for persistent or severe symptoms

When answering:
- Be concise but informative
- Ask clarifying questions if needed
- Provide first-aid or self-care suggestions when appropriate
- Always err on the side of caution for serious symptoms`;

export async function POST(request) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message || !process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Message and OPENAI_API_KEY environment variable are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const relevantDocs = retrieveRelevantDocs(message);
    const context = relevantDocs.join("\n\n");

    const messages = [
      {
        role: "system",
        content: `${systemPrompt}\n\nMedical Context:\n${context}`
      },
      ...conversationHistory.map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text
      })),
      {
        role: "user",
        content: message
      }
    ];

    const llm = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
      maxTokens: 500,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const response = await llm.invoke(messages);
    const responseText = response.content;

    return new Response(
      JSON.stringify({
        message: responseText.trim(),
        success: true
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to process chat request",
        success: false
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
