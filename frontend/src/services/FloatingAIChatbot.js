import { useState, useRef, useEffect, useCallback } from 'react';
import {
  XMarkIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';
import { API_BASE_URL } from '../config';

const INITIAL_MESSAGES = [
  {
    id: 1,
    type: 'bot',
    content: "Hey, I'm Foody. Ask me anything about recipes, cooking, or food!",
    timestamp: new Date().toLocaleString()
  }
];

export default function FloatingAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Escape and lightly format AI output (preserve newlines and simple bullet lists)
  const escapeHtml = (unsafe) => {
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const formatMessage = (text) => {
    if (!text && text !== 0) return '';
    // escape first to avoid raw HTML from user/model
    let escaped = escapeHtml(text);

    // Lightweight markdown-like formatting: bold, italic, inline code
    // Replace bold (**text**)
    escaped = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Replace italic (*text*) but avoid replacing inside bold
    escaped = escaped.replace(/\*(?!\*)([^*]+?)\*/g, '<em>$1</em>');
    // Replace inline code `code`
    escaped = escaped.replace(/`([^`]+?)`/g, '<code class="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">$1</code>');

    const lines = escaped.split(/\r?\n/);
    let inList = false;
    const out = [];
    lines.forEach((line) => {
      if (/^\s*[-*]\s+/.test(line)) {
        if (!inList) { out.push('<ul class="pl-5 list-disc">'); inList = true; }
        out.push('<li class="mb-1">' + line.replace(/^\s*[-*]\s+/, '') + '</li>');
      } else {
        if (inList) { out.push('</ul>'); inList = false; }
        out.push('<p class="m-0 text-sm leading-relaxed">' + line + '</p>');
      }
    });
    if (inList) out.push('</ul>');
    return out.join('');
  };

  const closeChat = useCallback(() => {
    setIsOpen(false);
    // Reset state on close
    setMessages(INITIAL_MESSAGES);
    setInput('');
    setIsTyping(false);
  }, []);

  // Close on Escape and focus the input when opening the chat
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeChat();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', onKey);
      // Focus input on open
      const inputEl = document.querySelector('#foody-chat-input');
      if (inputEl) inputEl.focus();
    }

    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeChat]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({ role: msg.type === 'user' ? 'user' : 'assistant', content: msg.content })),
          message: userMessage.content,
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.reply,
        timestamp: new Date().toLocaleString()
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Failed to fetch AI response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

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
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
                }`}>
                  {/* Render formatted content (escaped + simple markdown -> HTML) */}
                  {msg.type === 'bot' ? (
                    <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                  ) : (
                    <div>{msg.content}</div>
                  )}
                  <p className="text-[10px] opacity-60 text-right mt-3">{msg.timestamp}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-3 shadow-sm" role="status" aria-live="polite">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-7 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center px-2">
                      <span className="bg-gray-400 w-2.5 h-2.5 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="bg-gray-400 w-2.5 h-2.5 rounded-full animate-bounce" style={{ animationDelay: '140ms' }} />
                      <span className="bg-gray-400 w-2.5 h-2.5 rounded-full animate-bounce" style={{ animationDelay: '280ms' }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Foody is thinking…</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Fetching a helpful reply</p>
                    </div>
                  </div>
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
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-orange-600 text-white rounded-full text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-700 transition-colors flex items-center gap-2"
              >
                {isTyping ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Thinking…
                  </>
                ) : (
                  'Send'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}