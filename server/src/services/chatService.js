import OpenAI from "openai";

// Lazily initialized so dotenv has time to load before we read env vars
let _client = null;
function getClient() {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return _client;
}

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
    // If no key is configured, fallback immediately
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_api_key_here') {
      return getMockResponse(messages) + "\n\n*(Note: This is a simulated response because the Groq API key is missing. Add a valid GROQ_API_KEY to server/.env for real AI responses.)*";
    }

    // Format messages for the OpenAI-compatible API
    const formattedMessages = [
      { role: "system", content: ASTHMA_DOCTOR_SYSTEM_PROMPT },
      ...messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }))
    ];

    const completion = await getClient().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: formattedMessages,
      max_tokens: 1024,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Chat service error:", error);

    // Fallback if the API key is invalid so the UI doesn't break
    if (error.status === 401 || (error.message && error.message.includes('API key'))) {
      return getMockResponse(messages) + "\n\n*(Note: This is a simulated response because the xAI Grok API key is invalid. Update your XAI_API_KEY in server/.env for real AI responses.)*";
    }

    throw new Error("Failed to get AI response: " + error.message);
  }
};

function getMockResponse(messages) {
  const lastMsg = messages[messages.length - 1].text.toLowerCase();
  
  if (lastMsg.includes('trouble breathing') || lastMsg.includes('cannot breathe') || lastMsg.includes('attack')) {
    return "I hear that you're having trouble breathing. Please stay calm and sit upright. If you have your rescue inhaler (like Albuterol), take one or two puffs immediately. If your symptoms do not improve within 15 minutes, please call emergency services right away or tap the EMERGENCY MODE button at the top of the screen.";
  }
  
  if (lastMsg.includes('inhaler') || lastMsg.includes('use')) {
    return "To use your inhaler correctly:\n1) Shake the inhaler well.\n2) Breathe out completely.\n3) Put the mouthpiece in your mouth and close your lips tightly around it.\n4) As you start to breathe in slowly, press down on the inhaler one time.\n5) Keep breathing in slowly and deeply.\n6) Hold your breath for 10 seconds.\n\nLet me know if you need help with a spacer!";
  }
  
  if (lastMsg.includes('trigger') || lastMsg.includes('causes') || lastMsg.includes('common')) {
    return "Common asthma triggers include pollen, dust mites, mold, pet dander, cold air, smoke, and strong odors. Have you noticed any specific patterns when your asthma flares up?";
  }
  
  if (lastMsg.includes('emergency') || lastMsg.includes('when should i')) {
    return "You should seek emergency help immediately if:\n- You are severely short of breath and it's getting worse\n- Your rescue inhaler isn't helping after 15-20 minutes\n- You have chest pain or tightness\n- Your lips or fingernails are turning blue\n- You are having trouble walking or talking due to shortness of breath.";
  }

  return "I understand. Managing asthma can be challenging, but tracking your symptoms and avoiding triggers makes a huge difference. Can you tell me a little more about how you're feeling right now? Remember, if you ever feel severe shortness of breath, don't hesitate to seek emergency help.";
}
