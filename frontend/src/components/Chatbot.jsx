import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const CHAT_API_URL = API_URL.endsWith("/api")
  ? `${API_URL}/chat`
  : `${API_URL}/api/chat`;

const suggestions = [
  "What biryani do you recommend?",
  "Show vegetarian options",
  "What is available today?",
];

function getGuestLoginStatus() {
  const token = localStorage.getItem("token");

  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return Boolean(token) && user?.role === "guest";
  } catch {
    return false;
  }
}

export default function Chatbot() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey! 👋 Welcome to BiryaniKing! I'm your AI Food Assistant. Ask me about our menu and I'll help you find your perfect meal. 🍛",
    },
  ]);

  const messagesEndRef = useRef(null);

  const isLoggedIn = getGuestLoginStatus();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading, isOpen]);

  function handleChatButton() {
    if (!getGuestLoginStatus()) {
      setIsOpen(false);
      setShowLoginPrompt(true);
      return;
    }

    setShowLoginPrompt(false);
    setIsOpen((previous) => !previous);
  }

  function handleLogin() {
    setShowLoginPrompt(false);
    navigate("/login");
  }

  function handleRegister() {
    setShowLoginPrompt(false);
    navigate("/register");
  }

  async function sendMessage(text = input) {
    const question = text.trim();

    if (!question || loading) return;

    if (!getGuestLoginStatus()) {
      setIsOpen(false);
      setShowLoginPrompt(true);
      return;
    }

    setInput("");
    setError("");

    setMessages((previous) => [
      ...previous,
      { role: "user", content: question },
    ]);

    setLoading(true);

    try {
      const response = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to get a response."
        );
      }

      if (!data.reply) {
        throw new Error("The chatbot returned an empty response.");
      }

      setMessages((previous) => [
        ...previous,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setError(
        `${err.message} Please check your connection and try again.`
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <div className="fixed bottom-5 right-5 z-[1000] font-sans">

      {/* LOGIN PROMPT */}
      {showLoginPrompt && !isLoggedIn && (
        <section className="glass-panel page-enter mb-4 w-[min(330px,calc(100vw-40px))] overflow-hidden rounded-3xl">

          <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-900 p-5 text-white">
            <button
              type="button"
              onClick={() => setShowLoginPrompt(false)}
              className="absolute right-3 top-2 rounded-full px-2 py-1 text-2xl hover:bg-white/10"
              aria-label="Close login prompt"
            >
              ×
            </button>

            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-4xl">
              🤖
            </div>

            <h2 className="text-xl font-extrabold">
              Meet Your AI Chef!
            </h2>

            <p className="mt-1 text-sm text-emerald-100">
              Your personal food assistant at BiryaniKing 🍗
            </p>
          </div>

          <div className="p-5">
            <p className="text-sm leading-relaxed text-gray-600">
              Need help choosing your next meal? Login to explore
              our menu, discover food options, and get recommendations
              from our AI assistant.
            </p>

            <button
              type="button"
              onClick={handleLogin}
              className="btn-primary mt-5 w-full px-4 py-3"
            >
              Login to Start Chatting →
            </button>

            <button
              type="button"
              onClick={handleRegister}
              className="btn-secondary mt-2 w-full px-4 py-3 text-emerald-800"
            >
              Create an Account
            </button>

            <button
              type="button"
              onClick={() => setShowLoginPrompt(false)}
              className="mt-3 w-full py-1 text-sm text-gray-500 hover:text-gray-800"
            >
              Maybe later
            </button>
          </div>
        </section>
      )}

      {/* CHAT WINDOW */}
      {isOpen && isLoggedIn && (
        <section
          className="glass-panel page-enter mb-4 flex h-[min(600px,75vh)] w-[min(370px,calc(100vw-32px))] flex-col overflow-hidden rounded-3xl"
          aria-label="BiryaniKing AI Chat"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 to-emerald-900 px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow">
                🍛
              </div>

              <div>
                <h2 className="font-extrabold">
                  BiryaniKing AI Chef
                </h2>
                <p className="text-xs text-emerald-100">
                  Here to help you choose!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full px-3 py-1 text-2xl hover:bg-white/10"
              aria-label="Close chatbot"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-white/40 to-teal-50/45 p-4">
            {messages.map((message, index) => (
              <div
                key={`${index}-${message.role}`}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-br-sm bg-emerald-700 text-white"
                      : "rounded-bl-sm border border-white/80 bg-white/80 text-gray-800 shadow-sm backdrop-blur"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
                  AI Chef is thinking
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {error}
                <button
                  type="button"
                  onClick={() => setError("")}
                  className="ml-2 font-semibold underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 border-t border-white/80 bg-white/60 px-3 py-3 backdrop-blur">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  disabled={loading}
                  onClick={() => sendMessage(suggestion)}
                  className="rounded-full border border-emerald-200 px-3 py-2 text-left text-xs text-emerald-800 transition hover:bg-emerald-50 disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Message Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-white/80 bg-white/60 p-3 backdrop-blur"
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask your AI Chef..."
              maxLength={1000}
              disabled={loading}
              className="min-w-0 flex-1 rounded-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-gray-100"
              aria-label="Type your message"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  d="M22 2 11 13"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="m22 2-7 20-4-9-9-4 20-7Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </section>
      )}

      {/* ATTRACTIVE FLOATING BUTTON */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleChatButton}
          className="glass-panel rounded-2xl px-4 py-2 text-left transition hover:-translate-y-0.5"
        >
          <p className="text-sm font-extrabold text-emerald-800">
            Hungry? 🍗
          </p>
          <p className="text-xs text-gray-600">
            Ask our AI Chef!
          </p>
        </button>

        <button
          type="button"
          onClick={handleChatButton}
          className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-900 text-3xl text-white shadow-xl ring-4 ring-emerald-100 transition duration-300 hover:scale-110 hover:shadow-2xl"
          aria-label="Chat with BiryaniKing AI"
          title="Chat with BiryaniKing AI"
        >
          {isOpen ? "×" : "🍛"}

          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-green-400" />
        </button>
      </div>
    </div>
  );
}
