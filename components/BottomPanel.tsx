"use client";

import React, { useState } from "react";
import { useWorkflowStore } from "@/lib/store";
import {
  ChevronUp,
  Settings,
  Play,
  MessageSquare,
  Terminal,
} from "lucide-react";
import { WorkflowSimulator } from "./WorkflowSimulator";
import { ConversationTester } from "./ConversationTester";

interface BottomPanelProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const BottomPanel: React.FC<BottomPanelProps> = ({
  isCollapsed = false,
  onToggle,
}) => {
  const workflow = useWorkflowStore((state) => state.workflow);
  const [activeTab, setActiveTab] = useState<
    "settings" | "simulator" | "conversation"
  >("settings");

  if (isCollapsed) {
    return (
      <div
        className="h-16 flex items-center justify-center gap-4 px-4 border-t"
        style={{
          backgroundColor: "rgb(var(--card))",
          borderTopColor: "rgb(var(--border))",
          borderTopWidth: "1px",
        }}
      >
        <button
          onClick={onToggle}
          className="p-3 rounded-lg transition-all hover:shadow-lg"
          style={{
            backgroundColor: "rgb(var(--muted))",
            color: "rgb(var(--primary))",
          }}
          title="Open Workflow Settings"
        >
          <Terminal size={20} />
        </button>
        <div
          style={{
            width: "40px",
            height: "2px",
            backgroundColor: "rgb(var(--border))",
            opacity: 0.3,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{
        backgroundColor: "rgb(var(--card))",
        borderTopColor: "rgb(var(--border))",
        borderTopWidth: "1px",
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 border-b"
        style={{
          borderBottomColor: "rgb(var(--border))",
          borderBottomWidth: "1px",
        }}
      >
        <div className="flex items-center justify-end mb-4">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg transition-all hover:shadow-md"
            style={{
              backgroundColor: "rgb(var(--muted))",
              color: "rgb(var(--muted-foreground))",
            }}
          >
            <ChevronUp size={16} />
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("settings")}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all"
            style={{
              backgroundColor:
                activeTab === "settings"
                  ? "rgb(var(--primary))"
                  : "rgb(var(--muted))",
              color:
                activeTab === "settings"
                  ? "rgb(var(--primary-foreground))"
                  : "rgb(var(--muted-foreground))",
            }}
          >
            <Settings size={16} />
            Settings
          </button>
          <button
            onClick={() => setActiveTab("simulator")}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all"
            style={{
              backgroundColor:
                activeTab === "simulator"
                  ? "rgb(var(--primary))"
                  : "rgb(var(--muted))",
              color:
                activeTab === "simulator"
                  ? "rgb(var(--primary-foreground))"
                  : "rgb(var(--muted-foreground))",
            }}
          >
            <Play size={16} />
            Simulator
          </button>
          <button
            onClick={() => setActiveTab("conversation")}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all"
            style={{
              backgroundColor:
                activeTab === "conversation"
                  ? "rgb(var(--primary))"
                  : "rgb(var(--muted))",
              color:
                activeTab === "conversation"
                  ? "rgb(var(--primary-foreground))"
                  : "rgb(var(--muted-foreground))",
            }}
          >
            <MessageSquare size={16} />
            Chat
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-4">
        {activeTab === "settings" && (
          <div className="space-y-4 overflow-y-auto h-full">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "rgb(var(--foreground))" }}
              >
                Model
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg text-sm"
                style={{
                  backgroundColor: "rgb(var(--background))",
                  color: "rgb(var(--foreground))",
                  borderColor: "rgb(var(--border))",
                }}
              >
                <option>GPT-4</option>
                <option>GPT-3.5 Turbo</option>
                <option>Claude 3 Opus</option>
                <option>Claude 3 Sonnet</option>
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "rgb(var(--foreground))" }}
              >
                API Key
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                style={{
                  backgroundColor: "rgb(var(--background))",
                  color: "rgb(var(--foreground))",
                  borderColor: "rgb(var(--border))",
                }}
                placeholder="Enter your API key"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "rgb(var(--foreground))" }}
                >
                  Temperature
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.7"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{
                    backgroundColor: "rgb(var(--background))",
                    color: "rgb(var(--foreground))",
                    borderColor: "rgb(var(--border))",
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "rgb(var(--foreground))" }}
                >
                  Max Tokens
                </label>
                <input
                  type="number"
                  defaultValue="2000"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{
                    backgroundColor: "rgb(var(--background))",
                    color: "rgb(var(--foreground))",
                    borderColor: "rgb(var(--border))",
                  }}
                />
              </div>
            </div>
          </div>
        )}
        {activeTab === "simulator" && (
          <WorkflowSimulator workflowId={workflow?.id} />
        )}
        {activeTab === "conversation" && (
          <ConversationTester workflowId={workflow?.id} />
        )}
      </div>
    </div>
  );
};
