const chatService = require("../services/aiService");
class ChatController {
  async chat(req, res) {
    try {
      const { message } = req.body;

      if (!message || message.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Message is required.",
        });
      }

      const reply = await chatService.generateResponse(message);

      return res.status(200).json({
        success: true,
        reply,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Something went wrong.",
      });
    }
  }
}

module.exports = new ChatController();