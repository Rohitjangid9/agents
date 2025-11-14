"use client";

import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { GitBranch } from "lucide-react";

export const IntentClassifierNode: React.FC<NodeProps> = ({
  data,
  selected,
}) => {
  return (
    <div
      className={`relative transition-all duration-200 ${
        selected ? "drop-shadow-2xl" : "drop-shadow-lg"
      }`}
      style={{ width: "200px" }}
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 blur-xl transition-all duration-200 ${
          selected ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      />

      {/* Main node - Hexagon shape */}
      <div
        className={`relative border-2 backdrop-blur-sm transition-all duration-200 overflow-hidden ${
          selected
            ? "border-purple-500 shadow-2xl"
            : "border-purple-300 dark:border-purple-600 shadow-lg hover:shadow-xl"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(109, 40, 217, 0.08) 100%)",
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          padding: "16px",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Content */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
            }}
          >
            <GitBranch size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-purple-900 dark:text-purple-100 truncate">
              {data.label || "Intent Classifier"}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-300">
              Route Requests
            </p>
          </div>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-4 h-4 bg-purple-500 border-2 border-white dark:border-slate-900 shadow-lg hover:w-5 hover:h-5 transition-all"
        style={{
          background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-4 h-4 bg-purple-500 border-2 border-white dark:border-slate-900 shadow-lg hover:w-5 hover:h-5 transition-all"
        style={{
          background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
        }}
      />
    </div>
  );
};
