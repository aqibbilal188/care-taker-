"use client";

import { useRef, useState, useEffect } from "react";
import { Sparkles, Send, ShieldHalf, User } from "lucide-react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "Which compliance tasks are overdue?",
  "When is the next water test?",
  "Which jobs are about to breach SLA?",
  "How do I prepare for a fire audit?",
  "Which school needs the most attention?",
];

const GREETING =
  "Hi James 👋 I'm Caretaker AI, your estates operations copilot. I'm watching compliance deadlines, contractor visits and help-desk SLAs across all your sites. Ask me anything — or tap a suggestion below.";

// Render **bold** and newlines without a markdown dependency.
function render(text: string) {
  return text.split("\n").map((line, i) => (
    <span key={i} className="block">
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={j} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={j}>{part}</span>
        )
      )}
    </span>
  ));
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply ?? "Sorry, I hit an error." },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "I couldn't reach the server just now — please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-0 w-full flex-1 max-w-3xl flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
          <Sparkles size={22} />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Caretaker AI Assistant
          </h1>
          <p className="text-sm text-slate-500">
            Natural-language access to your entire estate
          </p>
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex animate-fadeup gap-3 ${
              m.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                m.role === "user"
                  ? "bg-slate-200 text-slate-600"
                  : "bg-indigo-100 text-indigo-600"
              }`}
            >
              {m.role === "user" ? (
                <User size={16} />
              ) : (
                <ShieldHalf size={16} />
              )}
            </span>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-50 text-slate-700"
              }`}
            >
              {m.role === "assistant" ? render(m.content) : m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex animate-fadeup gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <ShieldHalf size={16} />
            </span>
            <div className="flex items-center gap-1 rounded-2xl bg-slate-50 px-4 py-3.5">
              <Dot /> <Dot delay="0.15s" /> <Dot delay="0.3s" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about compliance, contractors, SLAs, incidents…"
          className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:opacity-40"
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  );
}

function Dot({ delay = "0s" }: { delay?: string }) {
  return (
    <span
      className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
      style={{ animationDelay: delay }}
    />
  );
}
