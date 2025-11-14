"use client";

import React, { useState, useEffect } from "react";
import { useWorkflowStore } from "@/lib/store";
import { useTheme } from "./ThemeProvider";
import { Save, Play, User, LogOut, Sun, Moon } from "lucide-react";

interface TopNavBarProps {
  onTest?: () => void;
  onSave?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ onTest, onSave }) => {
  const workflow = useWorkflowStore((state) => state.workflow);
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="flex items-center justify-between h-16 px-8 border-b backdrop-blur-sm"
      style={{
        backgroundColor: "rgb(var(--card) / 0.95)",
        borderBottomColor: "rgb(var(--border))",
        borderBottomWidth: "1px",
      }}
    >
      {/* Left: Logo and Workflow Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">AF</span>
          </div>
          <div>
            <h1
              className="text-lg font-bold"
              style={{ color: "rgb(var(--foreground))" }}
            >
              AgentFlow
            </h1>
            <p
              className="text-xs"
              style={{ color: "rgb(var(--muted-foreground))" }}
            >
              Workflow Builder
            </p>
          </div>
        </div>
        {workflow && (
          <>
            <div
              className="w-px h-8"
              style={{ backgroundColor: "rgb(var(--border))" }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: "rgb(var(--muted-foreground))" }}
            >
              {workflow.name}
            </span>
          </>
        )}
      </div>

      {/* Right: Actions and Profile */}
      <div className="flex items-center gap-3">
        <button
          onClick={onTest}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg hover:shadow-md transition-all"
          style={{
            backgroundColor: "rgb(var(--muted))",
            color: "rgb(var(--foreground))",
          }}
        >
          <Play size={16} />
          Test
        </button>

        <button
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg hover:shadow-lg transition-all"
          style={{
            backgroundColor: "rgb(var(--primary))",
            color: "rgb(var(--primary-foreground))",
          }}
        >
          <Save size={16} />
          Save
        </button>

        {mounted && (
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all hover:shadow-md"
            style={{
              backgroundColor: "rgb(var(--muted))",
              color: "rgb(var(--muted-foreground))",
            }}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        )}

        <button
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-all hover:shadow-md"
          style={{
            backgroundColor: "rgb(var(--muted))",
            color: "rgb(var(--muted-foreground))",
          }}
        >
          <User size={16} />
        </button>

        <button
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-all hover:shadow-md"
          style={{
            backgroundColor: "rgb(var(--muted))",
            color: "rgb(var(--muted-foreground))",
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
};
