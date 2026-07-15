import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  XMarkIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';

const INITIAL_MESSAGES = [
  {
    id: 1,
    type: 'bot',
    content: "Hey, I'm Foody. Need a recipe idea or a quick cooking tip?",
    timestamp: 'Just now'
  }
];

export default function FloatingAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Close on Escape and focus the input when opening the chat
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setMessages(INITIAL_MESSAGES);
        setInput('');
        setIsTyping(false);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', onKey);
      const inputEl = document.querySelector('#foody-chat-input');
      if (inputEl) inputEl.focus();
    }
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // Local canned responses (fallback when external API doesn't return a match)
  const getLocalResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes('vegan') || q.includes('substitute')) {
      return {
        content: 'Here are some useful vegan substitutions:',
        tips: [
          'Egg → 1 tbsp flaxseed + 3 tbsp water',
          'Milk → Almond or oat milk',
          'Butter → Coconut oil',
          'Cheese → Nutritional yeast'
        ]
      };
    }

    if (q.includes('quick') || q.includes('30') || q.includes('fast')) {
      return {
        content: 'Try this quick dinner idea:',
        recipe: {
          title: 'Garlic Butter Shrimp Pasta',
          cuisine: 'Italian',
          time: '25 min',
          difficulty: 'Easy',
          ingredients: 'Pasta, shrimp, garlic, butter',
          instructions: 'Boil pasta → Sauté shrimp in garlic butter → Combine.'
        }
      };
    }

    return null;
  };

  // Query TheMealDB (free, no API key) for recipe matches. Falls back to random meal when no match.
  const fetchMealDB = async (query) => {
    try {
      const base = 'https://www.themealdb.com/api/json/v1/1';
      const searchUrl = `${base}/search.php?s=${encodeURIComponent(query)}`;
      const res = await fetch(searchUrl);
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.meals) {
        const meal = data.meals[0];
        // build ingredients list
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
          const ing = meal['strIngredient' + i];
          const measure = meal['strMeasure' + i];
          if (ing && ing.trim()) ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ing.trim()}`);
        }
        return {
          content: `Found a recipe: ${meal.strMeal}`,
          recipe: {
            title: meal.strMeal,
            cuisine: meal.strArea || 'Various',
            time: meal.strTime || 'Varies',
            difficulty: 'Medium',
            ingredients: ingredients.join(', '),
            instructions: meal.strInstructions || ''
          }
        };
      }

      // no search result — try random suggestion
      const rnd = await fetch(`${base}/random.php`);
      if (!rnd.ok) return null;
      const rndData = await rnd.json();
      if (rndData && rndData.meals) {
        const meal = rndData.meals[0];
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
          const ing = meal['strIngredient' + i];
          const measure = meal['strMeasure' + i];
          if (ing && ing.trim()) ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ing.trim()}`);
        }
        return {
          content: `Couldn't find an exact match — here's a recommendation: ${meal.strMeal}`,
          recipe: {
            title: meal.strMeal,
            cuisine: meal.strArea || 'Various',
            time: meal.strTime || 'Varies',
            difficulty: 'Medium',
            ingredients: ingredients.join(', '),
            instructions: meal.strInstructions || ''
          }
        };
      }

      return null;
    } catch (err) {
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      content: input.trim(),
      timestamp: 'Just now'
    }]);

    const currentQuery = input.trim();
    setInput('');
    setIsTyping(true);

    // Try external API first
    const apiResp = await fetchMealDB(currentQuery);
    if (apiResp) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        content: apiResp.content,
        recipe: apiResp.recipe,
        timestamp: 'Just now'
      }]);
      setIsTyping(false);
      return;
    }

    // Fallback to local canned responses
    const local = getLocalResponse(currentQuery);
    if (local) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        content: local.content,
        recipe: local.recipe,
        tips: local.tips,
        timestamp: 'Just now'
      }]);
    } else {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        content: "That's a great question — try searching for 'chicken', 'pasta', or 'vegetarian' to get recipe matches.",
        timestamp: 'Just now'
      }]);
    }

    setIsTyping(false);
  };

  const closeChat = useCallback(() => {
    setIsOpen(false);
    setMessages(INITIAL_MESSAGES);
    setInput('');
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, []);

  const toggleChat = () => {
    if (isOpen) {
      closeChat();
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-600 rounded-full shadow-lg flex items-center justify-center z-50 hover:scale-105 active:scale-95 transition-transform"
      >
        <ChatBubbleLeftEllipsisIcon className="w-7 h-7 text-white" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-xs sm:max-w-sm h-auto max-h-[72vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col border border-gray-200 dark:border-gray-700">
          
          {/* Header */}
          <div className="bg-orange-600 p-4 text-white flex items-center justify-between" role="banner">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-2xl flex items-center justify-center text-sm font-semibold">F</div>
              <div>
                <p className="font-semibold">Foody</p>
                <p className="text-xs opacity-90">How can I help you today?</p>
              </div>
            </div>
            <button 
              onClick={closeChat}
              aria-label="Close chat"
              className="hover:bg-white/20 p-2 rounded-xl transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-900"
              role="log"
              aria-live="polite"
            >
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm transform transition duration-200 ease-out ${
                  msg.type === 'user' 
                    ? 'bg-orange-600 text-white rounded-br-none' 
                    : 'bg-gray-50 dark:bg-gray-800 rounded-bl-none'
                }`}>
                  {msg.content}

                  {/* Recipe Preview */}
                  {msg.recipe && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl text-sm border border-gray-100 dark:border-gray-800">
                      <p className="font-bold">{msg.recipe.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {msg.recipe.cuisine} • {msg.recipe.time} • {msg.recipe.difficulty}
                      </p>
                      <p className="mt-3 text-xs font-medium">Ingredients: {msg.recipe.ingredients}</p>
                      <p className="mt-2 text-xs">{msg.recipe.instructions}</p>
                    </div>
                  )}

                  {msg.tips && (
                    <div className="mt-3 space-y-1">
                      {msg.tips.map((tip, i) => (
                        <div key={i} className="text-xs bg-orange-50 dark:bg-gray-800 p-2 rounded-xl">• {tip}</div>
                      ))}
                    </div>
                  )}

                  <p className="text-[10px] opacity-60 text-right mt-3">{msg.timestamp}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-3xl rounded-bl-none flex items-center gap-3 shadow">
                  <div className="w-8 flex items-center gap-1">
                    <span className="bg-gray-400 w-1.5 h-1.5 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="bg-gray-400 w-1.5 h-1.5 rounded-full animate-bounce" style={{ animationDelay: '120ms' }} />
                    <span className="bg-gray-400 w-1.5 h-1.5 rounded-full animate-bounce" style={{ animationDelay: '240ms' }} />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-200">Thinking…</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="relative">
              <input
                id="foody-chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask for a recipe or tip..."
                className="w-full py-4 pl-6 pr-20 rounded-3xl border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-400/50 text-sm"
                aria-label="Type a message"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                aria-label="Send message"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-orange-600 text-white rounded-full text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}