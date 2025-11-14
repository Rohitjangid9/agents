"use client";

import React, { useState } from "react";
import { Play, Loader, CheckCircle, AlertCircle } from "lucide-react";

interface SimulationResult {
  nodeId: string;
  nodeName: string;
  status: "pending" | "running" | "success" | "error";
  output?: string;
  reasoning?: string;
  duration?: number;
}

interface WorkflowSimulatorProps {
  workflowId?: string;
}

export const WorkflowSimulator: React.FC<WorkflowSimulatorProps> = ({ workflowId }) => {
  const [testInput, setTestInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<SimulationResult[]>([]);

  const handleRunSimulation = async () => {
    if (!testInput.trim()) return;

    setIsRunning(true);
    setResults([]);

    // Simulate workflow execution
    const mockResults: SimulationResult[] = [
      {
        nodeId: "1",
        nodeName: "Intent Classifier",
        status: "running",
        reasoning: "Analyzing user input to determine intent...",
      },
      {
        nodeId: "2",
        nodeName: "Knowledge Base Retrieval",
        status: "pending",
      },
      {
        nodeId: "3",
        nodeName: "Agent Response",
        status: "pending",
      },
    ];

    setResults(mockResults);

    // Simulate execution steps
    await new Promise((resolve) => setTimeout(resolve, 1000));
    mockResults[0] = {
      ...mockResults[0],
      status: "success",
      output: "Intent: Customer Support",
      duration: 1200,
    };
    setResults([...mockResults]);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    mockResults[1] = {
      ...mockResults[1],
      status: "running",
      reasoning: "Searching knowledge base for relevant documents...",
    };
    setResults([...mockResults]);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    mockResults[1] = {
      ...mockResults[1],
      status: "success",
      output: "Found 3 relevant documents",
      duration: 1500,
    };
    setResults([...mockResults]);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    mockResults[2] = {
      ...mockResults[2],
      status: "running",
      reasoning: "Generating response based on retrieved context...",
    };
    setResults([...mockResults]);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    mockResults[2] = {
      ...mockResults[2],
      status: "success",
      output: "Here's the solution to your problem...",
      duration: 2000,
    };
    setResults([...mockResults]);

    setIsRunning(false);
  };

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "rgb(var(--foreground))" }}>
          Test Input
        </label>
        <textarea
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
          placeholder="Enter sample input to test your workflow..."
          className="w-full px-4 py-2 rounded-lg border text-sm"
          style={{
            backgroundColor: "rgb(var(--background))",
            color: "rgb(var(--foreground))",
            borderColor: "rgb(var(--border))",
          }}
          rows={3}
          disabled={isRunning}
        />
      </div>

      {/* Run Button */}
      <button
        onClick={handleRunSimulation}
        disabled={isRunning || !testInput.trim()}
        className="w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-50"
        style={{
          backgroundColor: "rgb(var(--primary))",
          color: "rgb(var(--primary-foreground))",
        }}
      >
        {isRunning ? (
          <>
            <Loader size={18} className="animate-spin" />
            Running...
          </>
        ) : (
          <>
            <Play size={18} />
            Run Simulation
          </>
        )}
      </button>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold" style={{ color: "rgb(var(--foreground))" }}>
            Execution Flow
          </h3>
          {results.map((result, index) => (
            <div
              key={result.nodeId}
              className="p-3 rounded-lg border"
              style={{
                backgroundColor: "rgb(var(--background))",
                borderColor: "rgb(var(--border))",
              }}
            >
              <div className="flex items-start gap-3">
                {result.status === "success" && (
                  <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                )}
                {result.status === "running" && (
                  <Loader size={18} className="text-blue-500 flex-shrink-0 mt-0.5 animate-spin" />
                )}
                {result.status === "error" && (
                  <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                )}
                {result.status === "pending" && (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: "rgb(var(--foreground))" }}>
                    {result.nodeName}
                  </p>
                  {result.reasoning && (
                    <p className="text-xs mt-1" style={{ color: "rgb(var(--muted-foreground))" }}>
                      {result.reasoning}
                    </p>
                  )}
                  {result.output && (
                    <p className="text-xs mt-1 p-2 rounded" style={{ backgroundColor: "rgb(var(--muted))", color: "rgb(var(--foreground))" }}>
                      {result.output}
                    </p>
                  )}
                  {result.duration && (
                    <p className="text-xs mt-1" style={{ color: "rgb(var(--muted-foreground))" }}>
                      ⏱️ {result.duration}ms
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

