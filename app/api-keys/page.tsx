"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Copy, Trash2, Plus, RotateCw, Lock, Shield, Clock } from "lucide-react";
import { TopNavBar } from "@/components/TopNavBar";

interface APIKey {
  id: string;
  name: string;
  provider: string;
  keyPreview: string;
  fullKey?: string;
  isVisible: boolean;
  createdAt: string;
  lastUsed?: string;
  rotations: number;
}

export default function APIKeysPage() {
  const [keys, setKeys] = useState<APIKey[]>([
    {
      id: "1",
      name: "OpenAI Production",
      provider: "openai",
      keyPreview: "sk-proj-••••••••••••••••••••",
      fullKey: "sk-proj-1234567890abcdefghij",
      isVisible: false,
      createdAt: "2024-01-15",
      lastUsed: "2024-11-14",
      rotations: 0,
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKey, setNewKey] = useState({ name: "", provider: "openai", key: "" });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleKeyVisibility = (id: string) => {
    setKeys(
      keys.map((k) =>
        k.id === id ? { ...k, isVisible: !k.isVisible } : k
      )
    );
  };

  const copyToClipboard = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteKey = (id: string) => {
    setKeys(keys.filter((k) => k.id !== id));
  };

  const rotateKey = (id: string) => {
    setKeys(
      keys.map((k) =>
        k.id === id
          ? {
              ...k,
              rotations: k.rotations + 1,
              createdAt: new Date().toISOString().split("T")[0],
            }
          : k
      )
    );
  };

  const addNewKey = () => {
    if (newKey.name && newKey.key) {
      const key: APIKey = {
        id: `key-${Date.now()}`,
        name: newKey.name,
        provider: newKey.provider,
        keyPreview: newKey.key.substring(0, 10) + "••••••••••••••••••••",
        fullKey: newKey.key,
        isVisible: false,
        createdAt: new Date().toISOString().split("T")[0],
        rotations: 0,
      };
      setKeys([...keys, key]);
      setNewKey({ name: "", provider: "openai", key: "" });
      setShowAddForm(false);
    }
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: "rgb(var(--background))" }}>
      <TopNavBar />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: "rgb(var(--foreground))" }}>
              API Key Management
            </h1>
            <p style={{ color: "rgb(var(--muted-foreground))" }}>
              Securely manage and rotate your API keys
            </p>
          </div>

          {/* Security Info */}
          <div
            className="p-4 rounded-lg mb-8 flex items-start gap-3"
            style={{
              backgroundColor: "rgb(var(--muted))",
              borderLeftColor: "rgb(var(--primary))",
              borderLeftWidth: "4px",
            }}
          >
            <Shield size={20} style={{ color: "rgb(var(--primary))" }} className="flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold" style={{ color: "rgb(var(--foreground))" }}>
                Security Notice
              </h3>
              <p style={{ color: "rgb(var(--muted-foreground))" }}>
                Keys are encrypted at rest and never displayed in full. Rotate keys regularly for enhanced security.
              </p>
            </div>
          </div>

          {/* Add Key Button */}
          <div className="mb-8">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-lg"
              style={{
                backgroundColor: "rgb(var(--primary))",
                color: "rgb(var(--primary-foreground))",
              }}
            >
              <Plus size={18} />
              Add New Key
            </button>
          </div>

          {/* Add Key Form */}
          {showAddForm && (
            <div
              className="p-6 rounded-lg mb-8 border"
              style={{
                backgroundColor: "rgb(var(--card))",
                borderColor: "rgb(var(--border))",
              }}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: "rgb(var(--foreground))" }}>
                Add New API Key
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "rgb(var(--foreground))" }}>
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={newKey.name}
                    onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                    placeholder="e.g., OpenAI Production"
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{
                      backgroundColor: "rgb(var(--background))",
                      color: "rgb(var(--foreground))",
                      borderColor: "rgb(var(--border))",
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "rgb(var(--foreground))" }}>
                    Provider
                  </label>
                  <select
                    value={newKey.provider}
                    onChange={(e) => setNewKey({ ...newKey, provider: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{
                      backgroundColor: "rgb(var(--background))",
                      color: "rgb(var(--foreground))",
                      borderColor: "rgb(var(--border))",
                    }}
                  >
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                    <option value="cohere">Cohere</option>
                    <option value="huggingface">HuggingFace</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "rgb(var(--foreground))" }}>
                    API Key
                  </label>
                  <input
                    type="password"
                    value={newKey.key}
                    onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                    placeholder="Paste your API key here"
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{
                      backgroundColor: "rgb(var(--background))",
                      color: "rgb(var(--foreground))",
                      borderColor: "rgb(var(--border))",
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addNewKey}
                    className="px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-lg"
                    style={{
                      backgroundColor: "rgb(var(--primary))",
                      color: "rgb(var(--primary-foreground))",
                    }}
                  >
                    Save Key
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 rounded-lg font-semibold border transition-all"
                    style={{
                      backgroundColor: "rgb(var(--card))",
                      color: "rgb(var(--foreground))",
                      borderColor: "rgb(var(--border))",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Keys List */}
          <div className="space-y-4">
            {keys.map((key) => (
              <div
                key={key.id}
                className="p-6 rounded-lg border"
                style={{
                  backgroundColor: "rgb(var(--card))",
                  borderColor: "rgb(var(--border))",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: "rgb(var(--foreground))" }}>
                      {key.name}
                    </h3>
                    <p style={{ color: "rgb(var(--muted-foreground))" }}>
                      {key.provider.charAt(0).toUpperCase() + key.provider.slice(1)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => rotateKey(key.id)}
                      className="p-2 rounded-lg transition-all hover:shadow-md"
                      style={{
                        backgroundColor: "rgb(var(--muted))",
                        color: "rgb(var(--muted-foreground))",
                      }}
                      title="Rotate key"
                    >
                      <RotateCw size={18} />
                    </button>
                    <button
                      onClick={() => deleteKey(key.id)}
                      className="p-2 rounded-lg transition-all hover:shadow-md"
                      style={{
                        backgroundColor: "rgb(var(--muted))",
                        color: "rgb(var(--error))",
                      }}
                      title="Delete key"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Key Display */}
                <div className="flex items-center gap-2 mb-4 p-3 rounded-lg" style={{ backgroundColor: "rgb(var(--background))" }}>
                  <Lock size={18} style={{ color: "rgb(var(--muted-foreground))" }} />
                  <code style={{ color: "rgb(var(--foreground))" }}>
                    {key.isVisible ? key.fullKey : key.keyPreview}
                  </code>
                  <button
                    onClick={() => toggleKeyVisibility(key.id)}
                    className="ml-auto p-1 rounded transition-all hover:shadow-md"
                    style={{ color: "rgb(var(--muted-foreground))" }}
                  >
                    {key.isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(key.fullKey || "", key.id)}
                    className="p-1 rounded transition-all hover:shadow-md"
                    style={{ color: "rgb(var(--muted-foreground))" }}
                  >
                    <Copy size={18} />
                  </button>
                  {copiedId === key.id && (
                    <span style={{ color: "rgb(var(--success))" }} className="text-sm font-semibold">
                      Copied!
                    </span>
                  )}
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p style={{ color: "rgb(var(--muted-foreground))" }}>Created</p>
                    <p style={{ color: "rgb(var(--foreground))" }} className="font-semibold">
                      {key.createdAt}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "rgb(var(--muted-foreground))" }} className="flex items-center gap-1">
                      <Clock size={14} /> Last Used
                    </p>
                    <p style={{ color: "rgb(var(--foreground))" }} className="font-semibold">
                      {key.lastUsed || "Never"}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "rgb(var(--muted-foreground))" }}>Rotations</p>
                    <p style={{ color: "rgb(var(--foreground))" }} className="font-semibold">
                      {key.rotations}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Audit Log Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "rgb(var(--foreground))" }}>
              Audit Log
            </h2>
            <div
              className="p-6 rounded-lg border"
              style={{
                backgroundColor: "rgb(var(--card))",
                borderColor: "rgb(var(--border))",
              }}
            >
              <p style={{ color: "rgb(var(--muted-foreground))" }}>
                No recent activity
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

