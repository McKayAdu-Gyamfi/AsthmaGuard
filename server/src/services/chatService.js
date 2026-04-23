import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const ASTHMA_DOCTOR_SYSTEM_PROMPT = `You are an empathetic and knowledgeable Asthma Support Doctor. Your role is to:

1. Provide medical guidance and support to asthma patients and their caregivers
2. Help users understand their symptoms and when to seek emergency care
3. Give practical advice about inhaler usage, asthma management, and triggers
4. Offer emotional support during stressful situations
5. Always prioritize user safety and recommend professional medical help when needed

Guidelines:
- Be compassionate and use simple, clear language
- Ask clarifying questions about symptoms
- Provide evidence-based asthma management advice
- Always advise users to call emergency services (911 in US) if experiencing severe symptoms
- Encourage tracking symptoms and working with their healthcare provider
- Suggest environmental triggers and prevention strategies
- Help explain different medications and their purposes

Risk detection rules to keep in mind:
- AQI > 150 or PM2.5 > 35.5 μg/m³ is enough to trigger HIGH asthma risk
- Relative humidity > 65% AND temperature > 30°C creates HIGH risk because hot humid air traps pollutants
- Temperature below -12°C is a dangerous asthma trigger and requires urgent caution
- Two or more MODERATE factors together should be treated as HIGH risk
- If all factors are safe, reassure the user but still encourage preparedness

IMPORTANT: If a user mentions they are having severe breathing difficulty, chest pain, or any life-threatening symptoms, immediately advise them to call emergency services (911).`;

export const getChatResponse = async (messages) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Format messages for the API
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const userMessage = messages[messages.length - 1].text;

    // Start chat session with system prompt
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    // Send message with system context
    const result = await chat.sendMessage(
      `[System: ${ASTHMA_DOCTOR_SYSTEM_PROMPT}]\n\nUser message: ${userMessage}`
    );

    const response = result.response.text();
    return response;
  } catch (error) {
    console.error("Chat service error:", error);
    throw new Error("Failed to get AI response: " + error.message);
  }
};
