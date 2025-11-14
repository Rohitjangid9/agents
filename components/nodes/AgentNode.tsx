"use client";

import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Zap } from "lucide-react";

export const AgentNode: React.FC<NodeProps> = ({ data, selected }) => {
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
          background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
        }}
      />

      {/* Main node - Diamond shape */}
      <div
        className={`relative border-2 backdrop-blur-sm transition-all duration-200 overflow-hidden ${
          selected
            ? "border-pink-500 shadow-2xl"
            : "border-pink-300 dark:border-pink-600 shadow-lg hover:shadow-xl"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(190, 24, 93, 0.08) 100%)",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          padding: "16px",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Content */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
            }}
          >
            <Zap size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-pink-900 dark:text-pink-100 truncate">
              {data.label || "Agent"}
            </p>
            <p className="text-xs text-pink-600 dark:text-pink-300">
              Autonomous
            </p>
          </div>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-4 h-4 bg-pink-500 border-2 border-white dark:border-slate-900 shadow-lg hover:w-5 hover:h-5 transition-all"
        style={{
          background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-4 h-4 bg-pink-500 border-2 border-white dark:border-slate-900 shadow-lg hover:w-5 hover:h-5 transition-all"
        style={{
          background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-4 h-4 bg-pink-500 border-2 border-white dark:border-slate-900 shadow-lg hover:w-5 hover:h-5 transition-all"
        style={{
          background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
        }}
      />
    </div>
  );
};
