"use client";

import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Database } from "lucide-react";

export const KnowledgeBaseNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div
      className={`relative transition-all duration-200 ${
        selected ? "drop-shadow-2xl" : "drop-shadow-lg"
      }`}
      style={{ width: "200px" }}
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-3xl blur-xl transition-all duration-200 ${
          selected ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        }}
      />

      {/* Main node - Rounded rectangle */}
      <div
        className={`relative border-2 backdrop-blur-sm transition-all duration-200 overflow-hidden rounded-3xl ${
          selected
            ? "border-amber-500 shadow-2xl"
            : "border-amber-300 dark:border-amber-600 shadow-lg hover:shadow-xl"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.08) 100%)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              }}
            >
              <Database size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-amber-900 dark:text-amber-100 truncate">
                {data.label || "Knowledge Base"}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-300">
                Data Source
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-4 h-4 bg-amber-500 border-2 border-white dark:border-slate-900 shadow-lg hover:w-5 hover:h-5 transition-all"
        style={{
          background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-4 h-4 bg-amber-500 border-2 border-white dark:border-slate-900 shadow-lg hover:w-5 hover:h-5 transition-all"
        style={{
          background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        }}
      />
    </div>
  );
};
