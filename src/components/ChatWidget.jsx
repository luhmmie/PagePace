import { useState, useRef, useEffect } from "react";
import { Bot, Send, MoreVertical } from "lucide-react";

// ---------------------------------------------------------------------------
// Calling Gemini directly from the browser (no backend). Fine for a personal
// prototype — your API key is visible in the bundle, so don't ship this
// public as-is. When you're ready for real users, move this fetch behind a
// server route that holds the key server-side instead.
//
// Get a free key at https://aistudio.google.com/apikey and put it in a
// .env file (Vite: VITE_GEMINI_API_KEY=..., CRA: REACT_APP_GEMINI_API_KEY=...)
// ---------------------------------------------------------------------------
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-3.6-flash";

const BOT_NAME = "Pagepace Assistant";
const SYSTEM_INSTRUCTION = `You are ${BOT_NAME}, a helpful AI assistant for the Pagepace app. Keep replies concise and friendly.`;

async function getBotReply(history) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const contents = history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.text }],
  }));

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini request failed: ${res.status} ${errText}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Hmm, I didn't get a response.";
}

const STORAGE_KEY = "pagepace_chat_history";

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.map((m) => ({ ...m, time: new Date(m.time) }));
  } catch {
    return null;
  }
}

function saveHistory(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // storage full or unavailable — fail silently, chat still works in-memory
  }
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function MessageBubble({ role, text, time }) {
  const isUser = role === "user";
  return (
    <div className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
          <Bot size={16} className="text-white" />
        </div>
      )}
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[75%]`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-[15px] leading-snug ${
            isUser
              ? "bg-blue-500 text-white rounded-br-sm"
              : "bg-white text-slate-800 rounded-bl-sm shadow-sm"
          }`}
        >
          {text}
        </div>
        <span className="text-xs text-slate-400 mt-1 px-1">
          {formatTime(time)}
          {isUser && <span className="ml-1 text-blue-400">✓✓</span>}
        </span>
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [messages, setMessages] = useState(
    () =>
      loadHistory() ?? [
        {
          role: "assistant",
          text: `Hello 👋 I'm ${BOT_NAME}. How can I help you today?`,
          time: new Date(),
        },
      ]
  );
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg = { role: "user", text, time: new Date() };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    setIsTyping(true);

    try {
      const reply = await getBotReply(nextHistory);
      setMessages((prev) => [...prev, { role: "assistant", text: reply, time: new Date() }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, something went wrong reaching the assistant.", time: new Date() },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-[100dvh] sm:h-[700px] w-full max-w-full sm:max-w-sm mx-auto bg-slate-100 rounded-none sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-sm">{BOT_NAME}</div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              Always here to help you
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            </div>
          </div>
        </div>
        <MoreVertical size={18} className="text-slate-400" />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} text={m.text} time={m.time} />
        ))}
        {isTyping && (
          <div className="flex gap-2 justify-start">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white border-t border-slate-100">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-sm outline-none placeholder:text-slate-400"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center disabled:opacity-40 flex-shrink-0"
        >
          <Send size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}