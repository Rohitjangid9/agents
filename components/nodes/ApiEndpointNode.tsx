"use client";

import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Globe } from "lucide-react";

export const ApiEndpointNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div
      className={`relative transition-all duration-200 ${
        selected ? "drop-shadow-2xl" : "drop-shadow-lg"
      }`}
      style={{ width: "200px" }}
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-full blur-xl transition-all duration-200 ${
          selected ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        }}
      />

      {/* Main node - Cloud shape */}
      <div
        className={`relative border-2 backdrop-blur-sm transition-all duration-200 overflow-hidden rounded-full ${
          selected
            ? "border-green-500 shadow-2xl"
            : "border-green-300 dark:border-green-600 shadow-lg hover:shadow-xl"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.08) 100%)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              }}
            >
              <Globe size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-green-900 dark:text-green-100 truncate">
                {data.label || "API Endpoint"}
              </p>
              <p className="text-xs text-green-600 dark:text-green-300">
                External API
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 shadow-lg hover:w-5 hover:h-5 transition-all"
        style={{
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 shadow-lg hover:w-5 hover:h-5 transition-all"
        style={{
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        }}
      />
    </div>
  );
};
