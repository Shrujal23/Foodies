import { useState, useRef, useEffect, useCallback } from 'react';
import {
  XMarkIcon,
  ChatBubbleLeftEllipsisIcon,
} from '@heroicons/react/24/outline';
import { apiFetch } from './apiClient';

const INITIAL_MESSAGES = [
  {
    id: 1,
    type: 'bot',
    content:
      "Hey, I'm Foody. Ask me about recipes, cooking tips, ingredients, or food domain only!",
    timestamp: new Date().toLocaleString(),
  },
];

export default function FloatingAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const escapeHtml = (unsafe) =>
    String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  /** Inline markdown: **bold**, *italic*, `code` */
  const formatInline = (text) => {
    let s = escapeHtml(text);
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    s = s.replace(/\*(?!\*)([^*]+?)\*/g, '<em>$1</em>');
    s = s.replace(
      /`([^`]+?)`/g,
      '<code class="rounded bg-gray-200/80 dark:bg-gray-700 px-1 py-0.5 text-[12px] font-mono">$1</code>'
    );
    return s;
  };

  const isTableSeparator = (line) =>
    /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(line);

  const parseTableRow = (line) =>
    line
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((c) => c.trim());

  /**
   * Convert AI markdown-ish text into safe HTML for the chat bubble.
   * Supports: paragraphs, bullets, numbered lists, headings, bold, tables.
   */
  const formatMessage = (text) => {
    if (text == null || text === '') return '';

    const lines = String(text).replace(/\r\n/g, '\n').split('\n');
    const out = [];
    let i = 0;
    let inUl = false;
    let inOl = false;

    const closeLists = () => {
      if (inUl) {
        out.push('</ul>');
        inUl = false;
      }
      if (inOl) {
        out.push('</ol>');
        inOl = false;
      }
    };

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // Markdown table block
      if (
        trimmed.includes('|') &&
        i + 1 < lines.length &&
        isTableSeparator(lines[i + 1])
      ) {
        closeLists();
        const headerCells = parseTableRow(trimmed);
        i += 2; // skip header + separator
        const bodyRows = [];
        while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
          bodyRows.push(parseTableRow(lines[i]));
          i += 1;
        }
        out.push(
          '<div class="my-2 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">'
        );
        out.push(
          '<table class="min-w-full text-left text-xs border-collapse">'
        );
        out.push('<thead class="bg-orange-50 dark:bg-gray-700/80"><tr>');
        headerCells.forEach((cell) => {
          out.push(
            `<th class="px-2 py-1.5 font-semibold border-b border-gray-200 dark:border-gray-600 whitespace-nowrap">${formatInline(
              cell
            )}</th>`
          );
        });
        out.push('</tr></thead><tbody>');
        bodyRows.forEach((row, ri) => {
          out.push(
            `<tr class="${
              ri % 2 === 0
                ? 'bg-white dark:bg-gray-800'
                : 'bg-gray-50 dark:bg-gray-800/60'
            }">`
          );
          row.forEach((cell) => {
            out.push(
              `<td class="px-2 py-1.5 border-b border-gray-100 dark:border-gray-700 align-top">${formatInline(
                cell
              )}</td>`
            );
          });
          out.push('</tr>');
        });
        out.push('</tbody></table></div>');
        continue;
      }

      if (!trimmed) {
        closeLists();
        out.push('<div class="h-2"></div>');
        i += 1;
        continue;
      }

      // Headings #### / ### / ## / #
      const heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
      if (heading) {
        closeLists();
        out.push(
          `<p class="m-0 mt-2 mb-1 text-sm font-bold text-orange-700 dark:text-orange-300">${formatInline(
            heading[2]
          )}</p>`
        );
        i += 1;
        continue;
      }

      // Unordered list
      if (/^[-*•]\s+/.test(trimmed)) {
        if (inOl) {
          out.push('</ol>');
          inOl = false;
        }
        if (!inUl) {
          out.push('<ul class="my-1 pl-4 list-disc space-y-1">');
          inUl = true;
        }
        out.push(
          `<li class="text-sm leading-relaxed">${formatInline(
            trimmed.replace(/^[-*•]\s+/, '')
          )}</li>`
        );
        i += 1;
        continue;
      }

      // Numbered list
      if (/^\d+[.)]\s+/.test(trimmed)) {
        if (inUl) {
          out.push('</ul>');
          inUl = false;
        }
        if (!inOl) {
          out.push('<ol class="my-1 pl-4 list-decimal space-y-1">');
          inOl = true;
        }
        out.push(
          `<li class="text-sm leading-relaxed">${formatInline(
            trimmed.replace(/^\d+[.)]\s+/, '')
          )}</li>`
        );
        i += 1;
        continue;
      }

      closeLists();
      out.push(
        `<p class="m-0 text-sm leading-relaxed">${formatInline(trimmed)}</p>`
      );
      i += 1;
    }

    closeLists();
    return out.join('');
  };

  const closeChat = useCallback(() => {
    setIsOpen(false);
    setMessages(INITIAL_MESSAGES);
    setInput('');
    setIsTyping(false);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isOpen) closeChat();
    };
    if (isOpen) {
      document.addEventListener('keydown', onKey);
      const inputEl = document.querySelector('#foody-chat-input');
      if (inputEl) inputEl.focus();
    }
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeChat]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleString(),
    };

    const historyForApi = [...messages, userMessage].map((msg) => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await apiFetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyForApi,
          message: userMessage.content,
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data = await response.json();
      const replyText =
        (data.reply && String(data.reply).trim()) ||
        "I couldn't generate a full reply. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'bot',
          content: replyText,
          timestamp: new Date().toLocaleString(),
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch AI response:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'bot',
          content:
            "Sorry, I'm having trouble connecting right now. Please try again later.",
          timestamp: new Date().toLocaleString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleChat = () => {
    if (isOpen) closeChat();
    else setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={toggleChat}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-600 rounded-full shadow-lg flex items-center justify-center z-50 hover:scale-105 active:scale-95 transition-transform"
      >
        <ChatBubbleLeftEllipsisIcon className="w-7 h-7 text-white" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[min(100vw-1.5rem,24rem)] sm:w-[26rem] h-auto max-h-[75vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col border border-gray-200 dark:border-gray-700">
          <div
            className="bg-orange-600 p-4 text-white flex items-center justify-between shrink-0"
            role="banner"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-2xl flex items-center justify-center text-sm font-semibold">
                F
              </div>
              <div>
                <p className="font-semibold">Foody</p>
                <p className="text-xs opacity-90">Food &amp; cooking only</p>
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

          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-900 min-h-[12rem]"
            role="log"
            aria-live="polite"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[92%] px-3.5 py-3 rounded-2xl shadow-sm ${
                    msg.type === 'user'
                      ? 'bg-orange-600 text-white rounded-br-none'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-700'
                  }`}
                >
                  {msg.type === 'bot' ? (
                    <div
                      className="foody-msg space-y-0.5 break-words"
                      dangerouslySetInnerHTML={{
                        __html: formatMessage(msg.content),
                      }}
                    />
                  ) : (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>
                  )}
                  <p className="text-[10px] opacity-60 text-right mt-2">
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div
                  className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-3 shadow-sm border border-gray-100 dark:border-gray-700"
                  role="status"
                >
                  <div className="flex gap-1 px-1">
                    <span
                      className="bg-orange-400 w-2 h-2 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="bg-orange-400 w-2 h-2 rounded-full animate-bounce"
                      style={{ animationDelay: '140ms' }}
                    />
                    <span
                      className="bg-orange-400 w-2 h-2 rounded-full animate-bounce"
                      style={{ animationDelay: '280ms' }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Foody is thinking…
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
            <div className="relative">
              <input
                id="foody-chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask about food or recipes…"
                className="w-full py-3.5 pl-4 pr-[5.5rem] rounded-3xl border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-400/40"
                aria-label="Type a message"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-2 bg-orange-600 text-white rounded-full text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-700"
              >
                {isTyping ? '…' : 'Send'}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5 px-1">
              Food domain only · off-topic questions are declined
            </p>
          </div>
        </div>
      )}
    </>
  );
}
