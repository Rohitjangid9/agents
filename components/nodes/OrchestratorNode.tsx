"use client";

import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Network } from "lucide-react";

export const OrchestratorNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div
      className={`relative transition-all duration-200 ${
        selected ? "drop-shadow-2xl" : "drop-shadow-lg"
      }`}
      style={{ width: "200px" }}
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-2xl blur-xl transition-all duration-200 ${
          selected ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
        }}
      />

      {/* Main node */}
      <div
        className={`relative rounded-2xl border-2 backdrop-blur-sm transition-all duration-200 overflow-hidden ${
          selected
            ? "border-blue-500 shadow-2xl"
            : "border-blue-300 dark:border-blue-600 shadow-lg hover:shadow-xl"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(30, 64, 175, 0.08) 100%)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Top accent bar */}
        <div
          className="h-1 w-full"
          style={{
            background: "linear-gradient(90deg, #3b82f6 0%, #1e40af 100%)",
          }}
        />

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
              }}
            >
              <Network size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 truncate">
                {data.label || "Orchestrator"}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                Central Hub
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-4 h-4 bg-blue-500 border-2 border-white dark:border-slate-900 shadow-lg hover:w-5 hover:h-5 transition-all"
        style={{
          background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-4 h-4 bg-blue-500 border-2 border-white dark:border-slate-900 shadow-lg hover:w-5 hover:h-5 transition-all"
        style={{
          background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
        }}
      />
    </div>
  );
};
