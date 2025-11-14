"use client";

import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { CheckCircle2 } from "lucide-react";

export const OutputNode: React.FC<NodeProps> = ({ data, selected }) => {
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
          background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
        }}
      />

      {/* Main node - Rounded rectangle with accent */}
      <div
        className={`relative border-2 backdrop-blur-sm transition-all duration-200 overflow-hidden rounded-3xl ${
          selected
            ? "border-teal-500 shadow-2xl"
            : "border-teal-300 dark:border-teal-600 shadow-lg hover:shadow-xl"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(13, 148, 136, 0.08) 100%)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Top accent bar */}
        <div
          className="h-1 w-full"
          style={{
            background: "linear-gradient(90deg, #14b8a6 0%, #0d9488 100%)",
          }}
        />

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
              }}
            >
              <CheckCircle2 size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-teal-900 dark:text-teal-100 truncate">
                {data.label || "Output"}
              </p>
              <p className="text-xs text-teal-600 dark:text-teal-300">
                Response
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-4 h-4 bg-teal-500 border-2 border-white dark:border-slate-900 shadow-lg hover:w-5 hover:h-5 transition-all"
        style={{
          background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
        }}
      />
    </div>
  );
};
