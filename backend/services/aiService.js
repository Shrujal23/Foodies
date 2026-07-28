const groq = require("../config/groq");

class ChatService {
  async generateResponse(message) {
    try {
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content: `
You are Foody, the AI assistant for the Foodies application.

Rules:
- Be friendly and conversational.
- Help users with recipes, cooking tips, ingredients, nutrition and food recommendations.
- Keep responses concise unless the user requests more detail.
- Use bullet points where appropriate.
- If the user greets you, greet them naturally.
`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_completion_tokens: 1024,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error("Groq Error:", error);

      throw new Error("Unable to generate AI response.");
    }
  }
}

module.exports = new ChatService();