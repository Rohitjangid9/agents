"use client";

import React, { useState } from "react";
import { NODE_CONFIGS } from "@/lib/node-config";
import { ChevronDown, ChevronRight, Layers } from "lucide-react";
import * as Icons from "lucide-react";

interface LeftSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  isCollapsed = false,
  onToggle,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    "all"
  );

  const categories = {
    all: Object.entries(NODE_CONFIGS),
  };

  const handleDragStart = (e: React.DragEvent, nodeType: string) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/reactflow", nodeType);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent size={18} /> : null;
  };

  if (isCollapsed) {
    return (
      <div
        className="w-16 h-full flex flex-col items-center py-4 gap-4 border-r"
        style={{
          backgroundColor: "rgb(var(--background))",
          borderRightColor: "rgb(var(--border))",
          borderRightWidth: "1px",
        }}
      >
        <button
          onClick={onToggle}
          className="p-3 rounded-lg transition-all hover:shadow-lg"
          style={{
            backgroundColor: "rgb(var(--muted))",
            color: "rgb(var(--primary))",
          }}
          title="Open Node Palette"
        >
          <Layers size={20} />
        </button>
        <div
          style={{
            width: "2px",
            height: "40px",
            backgroundColor: "rgb(var(--border))",
            opacity: 0.3,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden border-r"
      style={{
        backgroundColor: "rgb(var(--background))",
        borderRightColor: "rgb(var(--border))",
        borderRightWidth: "1px",
      }}
    >
      {/* Header */}
      <div
        className="p-5 border-b"
        style={{
          borderBottomColor: "rgb(var(--border))",
          borderBottomWidth: "1px",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3
              className="text-sm font-bold"
              style={{ color: "rgb(var(--foreground))" }}
            >
              Node Palette
            </h3>
            <p
              className="text-xs mt-1"
              style={{ color: "rgb(var(--muted-foreground))" }}
            >
              Drag to canvas
            </p>
          </div>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg transition-all hover:shadow-md"
            style={{
              backgroundColor: "rgb(var(--muted))",
              color: "rgb(var(--muted-foreground))",
            }}
          >
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Nodes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {categories.all.map(([key, config]) => (
          <div
            key={key}
            draggable
            onDragStart={(e) => handleDragStart(e, key)}
            className="p-3 rounded-lg cursor-move transition-all group hover:shadow-md"
            style={{
              backgroundColor: "rgb(var(--card))",
              borderColor: "rgb(var(--border))",
              borderWidth: "1px",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: config.color }}
              />
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: "rgb(var(--foreground))" }}
                >
                  {config.label}
                </p>
              </div>
              <div
                style={{ color: "rgb(var(--muted-foreground))" }}
                className="group-hover:opacity-100 opacity-60 transition-opacity"
              >
                {getIcon(config.icon)}
              </div>
            </div>
            <p
              className="text-xs mt-2"
              style={{ color: "rgb(var(--muted-foreground))" }}
            >
              Drag to canvas
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
