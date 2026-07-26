"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

const GREETING: Message = {
  id: "greeting",
  role: "assistant",
  content:
    "Hello. I'm the JinzuuVisuals assistant. Inquire about capabilities, timeline estimates, pricing specs, or creative direction.",
};

function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <div className="chat-dot" />
      <div className="chat-dot" />
      <div className="chat-dot" />
    </div>
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [unread, setUnread] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (open) {
      scrollToBottom();
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const assistantId = `a-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", streaming: true },
    ]);

    try {
      abortRef.current = new AbortController();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          messages: [...messages, userMsg]
            .filter((m) => m.id !== "greeting")
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("API error");
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: accumulated, streaming: true }
              : m
          )
        );
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: accumulated, streaming: false }
            : m
        )
      );

      if (!open) setUnread((n) => n + 1);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  "Sorry, I'm having trouble connecting right now. Please try again or reach out via the contact form.",
                streaming: false,
              }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle AI Assistant"
        className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-primary)] shadow-bryl-hover hover:border-[var(--text-primary)] transition-colors cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {open ? <X size={18} /> : <MessageSquare size={18} />}

        {unread > 0 && !open && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--text-primary)] text-[var(--bg)] font-mono text-[10px] font-bold flex items-center justify-center"
          >
            {unread}
          </motion.div>
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] flex flex-col border border-[var(--border)] bg-[var(--bg-secondary)] rounded-xl overflow-hidden shadow-bryl-hover"
            style={{ height: 460 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--bg)] flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded border border-[var(--border-strong)] bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-primary)]">
                  <Bot size={14} />
                </div>
                <div>
                  <p className="font-mono text-xs font-bold text-[var(--text-primary)] leading-none mb-0.5 uppercase tracking-wider">
                    JINZUU // AI BOT
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                      ACTIVE SPECS
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer bg-transparent"
              >
                <X size={13} />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 font-sans text-xs">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" &&
                  msg.content === "" &&
                  msg.streaming ? (
                    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)]">
                      <LoadingDots />
                    </div>
                  ) : (
                    <div
                      className={`max-w-[85%] rounded-lg px-3.5 py-2.5 leading-relaxed border ${
                        msg.role === "user"
                          ? "bg-[var(--text-primary)] text-[var(--bg)] border-[var(--text-primary)] font-medium"
                          : "bg-[var(--bg)] text-[var(--text-primary)] border-[var(--border)]"
                      }`}
                    >
                      <ReactMarkdown>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-[var(--border)] bg-[var(--bg)] flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about design specs..."
                disabled={loading}
                className="flex-1 input-minimal text-xs py-2 px-3"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded border border-[var(--border-strong)] bg-[var(--bg-secondary)] text-[var(--text-primary)] flex items-center justify-center hover:bg-[var(--border)] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <Send size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}