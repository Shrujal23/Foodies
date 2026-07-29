const chatService = require("../services/aiService");
class ChatController {
  async chat(req, res) {
    try {
      const rawMessages = Array.isArray(req.body.messages) ? req.body.messages : [];
      const userMessage = typeof req.body.message === 'string' ? req.body.message.trim() : '';

      if (rawMessages.length === 0 && !userMessage) {
        return res.status(400).json({
          success: false,
          message: "Message is required!!!",
        });
      }

      const messages = rawMessages.length > 0
        ? rawMessages
        : [{ role: 'user', content: userMessage }];

      let cleanedMessages = messages
        .filter(msg => msg && typeof msg.role === 'string' && typeof msg.content === 'string' && msg.content.trim())
        .map(msg => ({ role: msg.role, content: msg.content.trim() }));

      // Trim conversation history to the most recent N messages to limit token usage
      const MAX_HISTORY = 12;
      if (cleanedMessages.length > MAX_HISTORY) {
        cleanedMessages = cleanedMessages.slice(-MAX_HISTORY);
      }

      if (cleanedMessages.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Message is required.",
        });
      }

      const reply = await chatService.generateResponse(cleanedMessages);

      return res.status(200).json({
        success: true,
        reply,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Something went wrong!!! Please try again later.",
      });
    }
  }
}

module.exports = new ChatController();