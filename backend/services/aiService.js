const groq = require("../config/groq");

class ChatService {
  async generateResponse(messages) {
    const systemInstructions = {
      role: "system",
      content: `
You are Foody, the AI assistant for the Foodies application.

Guidelines:
- Use the conversation history to maintain context.
- Do not invent information or hallucinate facts.
- If you do not know the answer, say: "I'm not sure about that, but I can help with recipes, cooking, and food recommendations."
- Stay focused on recipes, cooking tips, ingredients, nutrition, and food recommendations.
- If the user asks about something outside the app's domain, explain that you only provide cooking and recipe advice.
- Provide clear, direct answers and use bullet points when helpful.
- Avoid giving false timelines, ingredient quantities, or food science details unless you are confident in them.
- If a follow-up question relies on earlier chat, continue the thread based on prior user and assistant messages.
`
};

    const fullMessages = [systemInstructions, ...messages];
    
    try {
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: fullMessages,
        temperature: 0.3,
        top_p: 0.9,
        max_completion_tokens: 512,
      });

      return completion.choices[0].message.content;
      
    } catch (error) {
      console.error("Groq Error:", error);

      throw new Error("Unable to generate AI response.");
    }
  }
}

module.exports = new ChatService();