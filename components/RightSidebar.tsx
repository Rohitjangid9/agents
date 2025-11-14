"use client";

import React from "react";
import { useWorkflowStore } from "@/lib/store";
import { ChevronDown, X, Settings } from "lucide-react";
import { ConfigurationPanel } from "./ConfigurationPanel";

interface RightSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isCollapsed = false,
  onToggle,
}) => {
  const { selectedNodeId, selectedEdgeId, workflow } = useWorkflowStore();

  const selectedNode = workflow?.nodes.find((n) => n.id === selectedNodeId);
  const selectedEdge = workflow?.edges.find((e) => e.id === selectedEdgeId);

  const hasSelection = selectedNodeId || selectedEdgeId;

  if (isCollapsed) {
    return (
      <div
        className="w-16 h-full flex flex-col items-center py-4 gap-4 border-l"
        style={{
          backgroundColor: "rgb(var(--card))",
          borderLeftColor: "rgb(var(--border))",
          borderLeftWidth: "1px",
        }}
      >
        <button
          onClick={onToggle}
          className="p-3 rounded-lg transition-all hover:shadow-lg"
          style={{
            backgroundColor: "rgb(var(--muted))",
            color: "rgb(var(--primary))",
          }}
          title="Open Properties"
        >
          <Settings size={20} />
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
      className="w-full h-full flex flex-col overflow-hidden"
      style={{
        backgroundColor: "rgb(var(--card))",
        borderLeftColor: "rgb(var(--border))",
        borderLeftWidth: "1px",
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
              {hasSelection ? "Configuration" : "Properties"}
            </h3>
            <p
              className="text-xs mt-1"
              style={{ color: "rgb(var(--muted-foreground))" }}
            >
              {hasSelection ? "Edit node settings" : "Select to configure"}
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedNode ? (
          <ConfigurationPanel node={selectedNode} />
        ) : selectedEdge ? (
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "rgb(var(--foreground))" }}
                >
                  Connection Label
                </label>
                <input
                  type="text"
                  defaultValue={selectedEdge.data?.label || ""}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{
                    backgroundColor: "rgb(var(--background))",
                    color: "rgb(var(--foreground))",
                    borderColor: "rgb(var(--border))",
                  }}
                  placeholder="e.g., On Success"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "rgb(var(--foreground))" }}
                >
                  Condition
                </label>
                <textarea
                  defaultValue={selectedEdge.data?.condition || ""}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{
                    backgroundColor: "rgb(var(--background))",
                    color: "rgb(var(--foreground))",
                    borderColor: "rgb(var(--border))",
                  }}
                  placeholder="Optional routing condition"
                  rows={3}
                />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="p-4 text-center"
            style={{ color: "rgb(var(--muted-foreground))" }}
          >
            <p className="text-sm">
              Select a node or connection to view properties
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
