"use client";

import React, { useState } from "react";
import { Upload, FileText, Trash2, Edit2, Plus, Search } from "lucide-react";
import { TopNavBar } from "@/components/TopNavBar";

interface KnowledgeChunk {
  id: string;
  fileName: string;
  chunkIndex: number;
  content: string;
  metadata: Record<string, any>;
  embedding?: string;
}

export default function KnowledgeBasePage() {
  const [chunks, setChunks] = useState<KnowledgeChunk[]>([]);
  const [chunkingStrategy, setChunkingStrategy] = useState("semantic");
  const [embeddingModel, setEmbeddingModel] = useState("openai");
  const [testQuery, setTestQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      if (
        [
          "application/pdf",
          "text/plain",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/json",
          "text/csv",
        ].includes(file.type)
      ) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const newChunk: KnowledgeChunk = {
            id: `chunk-${Date.now()}-${Math.random()}`,
            fileName: file.name,
            chunkIndex: 0,
            content: content.substring(0, 500),
            metadata: {
              uploadedAt: new Date().toISOString(),
              fileSize: file.size,
              fileType: file.type,
            },
          };
          setChunks((prev) => [...prev, newChunk]);
        };
        reader.readAsText(file);
      }
    });
  };

  const filteredChunks = chunks.filter(
    (chunk) =>
      chunk.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chunk.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: "rgb(var(--background))" }}>
      <TopNavBar />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: "rgb(var(--foreground))" }}>
              Knowledge Base Management
            </h1>
            <p style={{ color: "rgb(var(--muted-foreground))" }}>
              Upload and manage documents for your AI agents
            </p>
          </div>

          {/* Upload Section */}
          <div
            className={`p-8 rounded-xl border-2 border-dashed mb-8 transition-all ${
              isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
            }`}
            style={{
              borderColor: isDragging ? "rgb(59 130 246)" : "rgb(var(--border))",
              backgroundColor: isDragging ? "rgb(59 130 246 / 0.05)" : "rgb(var(--card))",
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <Upload size={48} className="mx-auto mb-4" style={{ color: "rgb(var(--primary))" }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: "rgb(var(--foreground))" }}>
                Drag and drop files here
              </h3>
              <p style={{ color: "rgb(var(--muted-foreground))" }}>
                Supported: PDF, TXT, DOCX, JSON, CSV
              </p>
            </div>
          </div>

          {/* Configuration */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "rgb(var(--foreground))" }}>
                Chunking Strategy
              </label>
              <select
                value={chunkingStrategy}
                onChange={(e) => setChunkingStrategy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  backgroundColor: "rgb(var(--card))",
                  color: "rgb(var(--foreground))",
                  borderColor: "rgb(var(--border))",
                }}
              >
                <option value="semantic">Semantic</option>
                <option value="fixed">Fixed Size</option>
                <option value="sliding">Sliding Window</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "rgb(var(--foreground))" }}>
                Embedding Model
              </label>
              <select
                value={embeddingModel}
                onChange={(e) => setEmbeddingModel(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  backgroundColor: "rgb(var(--card))",
                  color: "rgb(var(--foreground))",
                  borderColor: "rgb(var(--border))",
                }}
              >
                <option value="openai">OpenAI</option>
                <option value="cohere">Cohere</option>
                <option value="huggingface">HuggingFace</option>
              </select>
            </div>
          </div>

          {/* Test Retrieval */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2" style={{ color: "rgb(var(--foreground))" }}>
              Test Retrieval
            </label>
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="Enter a query to test retrieval..."
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: "rgb(var(--card))",
                color: "rgb(var(--foreground))",
                borderColor: "rgb(var(--border))",
              }}
            />
          </div>

          {/* Chunks Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: "rgb(var(--foreground))" }}>
                Processed Chunks ({filteredChunks.length})
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search chunks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 rounded-lg border"
                  style={{
                    backgroundColor: "rgb(var(--card))",
                    color: "rgb(var(--foreground))",
                    borderColor: "rgb(var(--border))",
                  }}
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "rgb(var(--border))" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: "rgb(var(--muted))" }}>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: "rgb(var(--foreground))" }}>
                      File Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: "rgb(var(--foreground))" }}>
                      Content Preview
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: "rgb(var(--foreground))" }}>
                      Uploaded
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: "rgb(var(--foreground))" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChunks.map((chunk) => (
                    <tr key={chunk.id} style={{ borderBottomColor: "rgb(var(--border))", borderBottomWidth: "1px" }}>
                      <td className="px-6 py-4 text-sm" style={{ color: "rgb(var(--foreground))" }}>
                        {chunk.fileName}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: "rgb(var(--muted-foreground))" }}>
                        {chunk.content.substring(0, 50)}...
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: "rgb(var(--muted-foreground))" }}>
                        {new Date(chunk.metadata.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button className="p-2 rounded-lg hover:shadow-md transition-all" style={{ backgroundColor: "rgb(var(--muted))" }}>
                          <Edit2 size={16} style={{ color: "rgb(var(--muted-foreground))" }} />
                        </button>
                        <button className="p-2 rounded-lg hover:shadow-md transition-all" style={{ backgroundColor: "rgb(var(--muted))" }}>
                          <Trash2 size={16} style={{ color: "rgb(var(--error))" }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

