"use client";

import React, { useState } from "react";
import { Mail, Lock, Github, Chrome, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "rgb(var(--background))" }}>
      {/* Left Side - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{
          backgroundColor: "rgb(var(--card))",
          borderRightColor: "rgb(var(--border))",
          borderRightWidth: "1px",
        }}
      >
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Zap size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "rgb(var(--foreground))" }}>
              AgentFlow
            </h1>
          </div>
          <h2 className="text-4xl font-bold mb-4" style={{ color: "rgb(var(--foreground))" }}>
            Build Intelligent Workflows
          </h2>
          <p className="text-lg" style={{ color: "rgb(var(--muted-foreground))" }}>
            Create, test, and deploy AI agent workflows with visual simplicity and powerful capabilities.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: "rgb(var(--foreground))" }}>
                Visual Workflow Builder
              </h3>
              <p style={{ color: "rgb(var(--muted-foreground))" }}>
                Drag and drop to create complex agent workflows
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: "rgb(var(--foreground))" }}>
                Knowledge Base Integration
              </h3>
              <p style={{ color: "rgb(var(--muted-foreground))" }}>
                Connect documents and data sources seamlessly
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: "rgb(var(--foreground))" }}>
                Real-time Testing
              </h3>
              <p style={{ color: "rgb(var(--muted-foreground))" }}>
                Test and debug workflows instantly
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: "rgb(var(--foreground))" }}>
              Welcome Back
            </h1>
            <p style={{ color: "rgb(var(--muted-foreground))" }}>
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "rgb(var(--foreground))" }}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3" style={{ color: "rgb(var(--muted-foreground))" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  style={{
                    backgroundColor: "rgb(var(--card))",
                    color: "rgb(var(--foreground))",
                    borderColor: "rgb(var(--border))",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "rgb(var(--foreground))" }}>
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3" style={{ color: "rgb(var(--muted-foreground))" }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  style={{
                    backgroundColor: "rgb(var(--card))",
                    color: "rgb(var(--foreground))",
                    borderColor: "rgb(var(--border))",
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg"
              style={{
                backgroundColor: "rgb(var(--primary))",
                color: "rgb(var(--primary-foreground))",
              }}
            >
              {isLoading ? "Signing in..." : "Sign In"}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div style={{ backgroundColor: "rgb(var(--border))", height: "1px", flex: 1 }} />
            <span style={{ color: "rgb(var(--muted-foreground))" }}>Or continue with</span>
            <div style={{ backgroundColor: "rgb(var(--border))", height: "1px", flex: 1 }} />
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              className="w-full py-2 rounded-lg border font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-md"
              style={{
                backgroundColor: "rgb(var(--card))",
                color: "rgb(var(--foreground))",
                borderColor: "rgb(var(--border))",
              }}
            >
              <Chrome size={18} />
              Google
            </button>
            <button
              className="w-full py-2 rounded-lg border font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-md"
              style={{
                backgroundColor: "rgb(var(--card))",
                color: "rgb(var(--foreground))",
                borderColor: "rgb(var(--border))",
              }}
            >
              <Github size={18} />
              GitHub
            </button>
          </div>

          {/* Sign Up Link */}
          <p style={{ color: "rgb(var(--muted-foreground))" }}>
            Don't have an account?{" "}
            <Link href="/auth/signup" className="font-semibold" style={{ color: "rgb(var(--primary))" }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

