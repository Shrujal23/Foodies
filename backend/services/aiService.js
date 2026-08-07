const groq = require("../config/groq");

/** Fixed reply when the user goes outside food or cooking domain */
const DOMAIN_ONLY_REPLY =
  "Please ask only domain-related questions about food, recipes, cooking, ingredients, or nutrition. I'm Foody — I can help with those topics only.";

const SYSTEM_PROMPT = `You are Foody, the cooking assistant for the Foodies app.

## Domain (strict)
You ONLY answer questions about:
- recipes, cooking techniques, ingredients, kitchen tools
- meal ideas, substitutions, food storage, basic nutrition related to food
- restaurants/cuisine styles only when tied to food advice

If the user asks about ANYTHING else (coding, politics, sports scores, homework unrelated to food, general tech, gossip, or any other thing not remotely related to food domain etc.):
- Reply with EXACTLY this sentence and nothing else:
"${DOMAIN_ONLY_REPLY}"

Do not answer off-topic questions partially. Do not add extra commentary after that sentence.

## Answer format (required — chat bubble, not a document)
- Write COMPLETE answers. Never stop mid-sentence or mid-list.
- Keep answers focused: prefer short paragraphs and bullet lists.
- NEVER use markdown tables (| ... |). Tables do not render well in our chat UI.
- NEVER use markdown headings with ### or ##. Use plain bold labels instead, e.g. **Tips:**
- For comparisons use short bullets like:
  **Pros:**
  - item
  **Cons:**
  - item
  **How to improve:**
  - item
- Use **bold** sparingly for labels. Use - for bullets. Use 1. 2. 3. for steps.
- Keep replies under ~350 words unless the user asks for a full recipe.
- For a full recipe use this structure:
  **Title**
  **Servings / time**
  **Ingredients**
  - ...
  **Steps**
  1. ...
  **Tips**
  - ...

## Quality
- Be practical and clear. Do not invent precise medical claims or false ideas or hallucinated replies off topic.
- If unsure, say so briefly and stay in the food domain.
- Use conversation history for follow-ups about the same dish.`;

class ChatService {
  /*
   * Lightweight gate for obviously off-domain messages (saves tokens).
   * Model still enforces domain for borderline cases.
   */
  isObviouslyOffDomain(text) {
    const t = String(text || "").toLowerCase();
    if (!t.trim()) return false;

    // Clearly food-related, never block
    const foodHints =
      /\b(recipe|cook|cooking|bake|baking|food|ingredient|meal|dish|cuisine|kitchen|spice|sauce|grill|fry|roast|nutrition|calorie|diet|vegan|vegetarian|burger|chicken|beef|fish|veg|soup|salad|dessert|breakfast|lunch|dinner|snack|fruit|vegetable|meat|dairy|egg|flour|sugar|salt|oil|butter|cheese|bread|rice|pasta|pizza|meat|sandwich|lentils|sprouts|any fastfood|Indian Cuisine|indianfood)\b/;
    if (foodHints.test(t)) return false;

    const offHints =
      /\b(javascript|python|java\b|typescript|react|node\.?js|html|css|sql|programming|code|algorithm|homework math|politics|election|president|crypto|bitcoin|stock market|nba|nfl|football score|write (me )?(an? )?(essay|poem|story) about|movie review|dating advice|relationship advice|hello how are you|how is your day|anything related to hi or hello or goodmorning or any wishes)\b/;
    return offHints.test(t);
  }

  async generateResponse(messages) {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser && this.isObviouslyOffDomain(lastUser.content)) {
      return DOMAIN_ONLY_REPLY;
    }

    const fullMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ];

    try {
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: fullMessages,
        temperature: 0.35,
        top_p: 0.9,
        // Higher limit so answers are not cut off mid-tip or mid reply
        max_completion_tokens: 1200,
      });

      let reply = completion.choices[0]?.message?.content || "";
      reply = String(reply).trim();

      if (!reply) {
        return "I'm not sure how to answer that. Try asking about a recipe, ingredient, or cooking tip.";
      }

      // Soft cleanup: if model still emitted a huge table, keep text readable
      if ((reply.match(/\|/g) || []).length > 8) {
        // Model ignored table ban — still return; frontend will render tables if present
      }

      return reply;
    } catch (error) {
      console.error("Groq Error:", error?.message || error);
      throw new Error("Unable to generate AI response.");
    }
  }
}

module.exports = new ChatService();
module.exports.DOMAIN_ONLY_REPLY = DOMAIN_ONLY_REPLY;
