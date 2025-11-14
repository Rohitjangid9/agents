"use client";

import React, { useState } from "react";
import { Mail, Lock, User, Github, Chrome, ArrowRight, Zap, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsLoading(true);
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
            Start Building Today
          </h2>
          <p className="text-lg" style={{ color: "rgb(var(--muted-foreground))" }}>
            Join thousands of developers creating intelligent AI workflows.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle size={24} className="text-green-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold" style={{ color: "rgb(var(--foreground))" }}>
                Free to Start
              </h3>
              <p style={{ color: "rgb(var(--muted-foreground))" }}>
                No credit card required
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle size={24} className="text-green-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold" style={{ color: "rgb(var(--foreground))" }}>
                Instant Setup
              </h3>
              <p style={{ color: "rgb(var(--muted-foreground))" }}>
                Start building in minutes
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle size={24} className="text-green-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold" style={{ color: "rgb(var(--foreground))" }}>
                24/7 Support
              </h3>
              <p style={{ color: "rgb(var(--muted-foreground))" }}>
                Our team is always here to help
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: "rgb(var(--foreground))" }}>
              Create Account
            </h1>
            <p style={{ color: "rgb(var(--muted-foreground))" }}>
              Join AgentFlow and start building AI workflows
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "rgb(var(--foreground))" }}>
                Full Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3" style={{ color: "rgb(var(--muted-foreground))" }} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  style={{
                    backgroundColor: "rgb(var(--card))",
                    color: "rgb(var(--foreground))",
                    borderColor: "rgb(var(--border))",
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "rgb(var(--foreground))" }}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3" style={{ color: "rgb(var(--muted-foreground))" }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "rgb(var(--foreground))" }}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3" style={{ color: "rgb(var(--muted-foreground))" }} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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

            {/* Terms Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="terms" style={{ color: "rgb(var(--muted-foreground))" }}>
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !agreeToTerms}
              className="w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-50"
              style={{
                backgroundColor: "rgb(var(--primary))",
                color: "rgb(var(--primary-foreground))",
              }}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div style={{ backgroundColor: "rgb(var(--border))", height: "1px", flex: 1 }} />
            <span style={{ color: "rgb(var(--muted-foreground))" }}>Or sign up with</span>
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

          {/* Login Link */}
          <p style={{ color: "rgb(var(--muted-foreground))" }}>
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold" style={{ color: "rgb(var(--primary))" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

