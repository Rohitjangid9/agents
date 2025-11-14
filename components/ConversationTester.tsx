"use client";

import React, { useState } from "react";
import { Send, Loader } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  agentName?: string;
  reasoning?: string;
  timestamp: Date;
}

interface ConversationTesterProps {
  workflowId?: string;
}

export const ConversationTester: React.FC<ConversationTesterProps> = ({ workflowId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      agentName: "Orchestrator",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate assistant response
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const assistantMessage: Message = {
      id: `msg-${Date.now()}-response`,
      role: "assistant",
      content: "I've processed your request and found relevant information. Here's what I found...",
      agentName: "Knowledge Base Agent",
      reasoning: "Matched user query with 3 documents from knowledge base. Confidence: 92%",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4" style={{ backgroundColor: "rgb(var(--background))" }}>
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-xs rounded-lg p-3"
              style={{
                backgroundColor:
                  message.role === "user"
                    ? "rgb(var(--primary))"
                    : "rgb(var(--card))",
                color:
                  message.role === "user"
                    ? "rgb(var(--primary-foreground))"
                    : "rgb(var(--foreground))",
                borderColor: message.role === "assistant" ? "rgb(var(--border))" : undefined,
                borderWidth: message.role === "assistant" ? "1px" : undefined,
              }}
            >
              {message.agentName && (
                <p className="text-xs font-semibold mb-1" style={{ opacity: 0.8 }}>
                  {message.agentName}
                </p>
              )}
              <p className="text-sm">{message.content}</p>
              {message.reasoning && (
                <p className="text-xs mt-2 p-2 rounded" style={{ backgroundColor: "rgb(var(--muted))", color: "rgb(var(--muted-foreground))" }}>
                  💡 {message.reasoning}
                </p>
              )}
              <p className="text-xs mt-1" style={{ opacity: 0.7 }}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div
              className="rounded-lg p-3 flex items-center gap-2"
              style={{
                backgroundColor: "rgb(var(--card))",
                color: "rgb(var(--foreground))",
                borderColor: "rgb(var(--border))",
                borderWidth: "1px",
              }}
            >
              <Loader size={16} className="animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 p-4 border-t" style={{ borderTopColor: "rgb(var(--border))" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-lg border text-sm"
          style={{
            backgroundColor: "rgb(var(--background))",
            color: "rgb(var(--foreground))",
            borderColor: "rgb(var(--border))",
          }}
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
          className="p-2 rounded-lg transition-all hover:shadow-md disabled:opacity-50"
          style={{
            backgroundColor: "rgb(var(--primary))",
            color: "rgb(var(--primary-foreground))",
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

