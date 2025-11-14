"use client";

import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Wrench } from "lucide-react";

export const ToolNode: React.FC<NodeProps> = ({ data, selected }) => {
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
          background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
          clipPath:
            "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
        }}
      />

      {/* Main node - Octagon shape */}
      <div
        className={`relative border-2 backdrop-blur-sm transition-all duration-200 overflow-hidden ${
          selected
            ? "border-cyan-500 shadow-2xl"
            : "border-cyan-300 dark:border-cyan-600 shadow-lg hover:shadow-xl"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(8, 145, 178, 0.08) 100%)",
          clipPath:
            "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
          padding: "16px",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Content */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
            }}
          >
            <Wrench size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-cyan-900 dark:text-cyan-100 truncate">
              {data.label || "Tool"}
            </p>
            <p className="text-xs text-cyan-600 dark:text-cyan-300">
              Function/Tool
            </p>
          </div>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-4 h-4 bg-cyan-500 border-2 border-white dark:border-slate-900 shadow-lg hover:w-5 hover:h-5 transition-all"
        style={{
          background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-4 h-4 bg-cyan-500 border-2 border-white dark:border-slate-900 shadow-lg hover:w-5 hover:h-5 transition-all"
        style={{
          background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
        }}
      />
    </div>
  );
};
