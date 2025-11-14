"use client";

import React, { useState } from "react";
import { WorkflowNode } from "@/types/workflow";
import { useWorkflowStore } from "@/lib/store";
import { getNodeConfig } from "@/lib/node-config";
import { MonacoEditor } from "./MonacoEditor";
import { Trash2 } from "lucide-react";

interface ConfigurationPanelProps {
  node: WorkflowNode;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  node,
}) => {
  const updateNode = useWorkflowStore((state) => state.updateNode);
  const removeNode = useWorkflowStore((state) => state.removeNode);
  const selectNode = useWorkflowStore((state) => state.selectNode);
  const config = getNodeConfig(node.type);

  if (!config) return null;

  const handleInputChange = (key: string, value: any) => {
    updateNode(node.id, {
      data: {
        ...node.data,
        [key]: value,
      },
    });
  };

  const handleCodeChange = (key: string, value: string) => {
    handleInputChange(key, value);
  };

  const handleDeleteNode = () => {
    if (
      confirm(
        `Are you sure you want to delete the "${
          node.data.name || config.label
        }" node?`
      )
    ) {
      removeNode(node.id);
      selectNode(null);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Node Type Badge */}
      <div
        className="flex items-center gap-2 pb-4"
        style={{
          borderBottomColor: "rgb(var(--border))",
          borderBottomWidth: "1px",
        }}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: config.color }}
        />
        <span
          className="text-sm font-medium"
          style={{ color: "rgb(var(--foreground))" }}
        >
          {config.label}
        </span>
      </div>

      {/* Node Name */}
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "rgb(var(--foreground))" }}
        >
          Name
        </label>
        <input
          type="text"
          value={node.data.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm"
          style={{
            backgroundColor: "rgb(var(--background))",
            color: "rgb(var(--foreground))",
            borderColor: "rgb(var(--border))",
          }}
          placeholder="Node name"
        />
      </div>

      {/* Description */}
      {node.data.description !== undefined && (
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "rgb(var(--foreground))" }}
          >
            Description
          </label>
          <textarea
            value={node.data.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            style={{
              backgroundColor: "rgb(var(--background))",
              color: "rgb(var(--foreground))",
              borderColor: "rgb(var(--border))",
            }}
            placeholder="Node description"
            rows={2}
          />
        </div>
      )}

      {/* System Prompt */}
      {node.data.systemPrompt !== undefined && (
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "rgb(var(--foreground))" }}
          >
            System Prompt
          </label>
          <MonacoEditor
            value={node.data.systemPrompt || ""}
            onChange={(value) => handleCodeChange("systemPrompt", value)}
            language="markdown"
            height={150}
          />
        </div>
      )}

      {/* Code Snippet */}
      {node.data.code !== undefined && (
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "rgb(var(--foreground))" }}
          >
            Code
          </label>
          <MonacoEditor
            value={node.data.code || ""}
            onChange={(value) => handleCodeChange("code", value)}
            language="python"
            height={200}
          />
        </div>
      )}

      {/* URL */}
      {node.data.url !== undefined && (
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "rgb(var(--foreground))" }}
          >
            URL
          </label>
          <input
            type="text"
            value={node.data.url || ""}
            onChange={(e) => handleInputChange("url", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            style={{
              backgroundColor: "rgb(var(--background))",
              color: "rgb(var(--foreground))",
              borderColor: "rgb(var(--border))",
            }}
            placeholder="https://api.example.com"
          />
        </div>
      )}

      {/* Method */}
      {node.data.method !== undefined && (
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "rgb(var(--foreground))" }}
          >
            Method
          </label>
          <select
            value={node.data.method || "GET"}
            onChange={(e) => handleInputChange("method", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            style={{
              backgroundColor: "rgb(var(--background))",
              color: "rgb(var(--foreground))",
              borderColor: "rgb(var(--border))",
            }}
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
            <option>PATCH</option>
          </select>
        </div>
      )}

      {/* Format */}
      {node.data.format !== undefined && (
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "rgb(var(--foreground))" }}
          >
            Format
          </label>
          <select
            value={node.data.format || "json"}
            onChange={(e) => handleInputChange("format", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            style={{
              backgroundColor: "rgb(var(--background))",
              color: "rgb(var(--foreground))",
              borderColor: "rgb(var(--border))",
            }}
          >
            <option>json</option>
            <option>text</option>
            <option>xml</option>
          </select>
        </div>
      )}

      {/* Delete Button */}
      <div
        className="pt-4 border-t"
        style={{
          borderTopColor: "rgb(var(--border))",
          borderTopWidth: "1px",
        }}
      >
        <button
          onClick={handleDeleteNode}
          className="w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          style={{
            backgroundColor: "rgb(239, 68, 68)",
            color: "white",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgb(220, 38, 38)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(239, 68, 68, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgb(239, 68, 68)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <Trash2 size={18} />
          Delete Node
        </button>
      </div>
    </div>
  );
};
