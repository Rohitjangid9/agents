"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Zap, Workflow, Database, Key, LogOut } from "lucide-react";

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/workflow", label: "Workflow", icon: Workflow },
    { href: "/knowledge-base", label: "Knowledge Base", icon: Database },
    { href: "/api-keys", label: "API Keys", icon: Key },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav
      className="border-b backdrop-blur-sm"
      style={{
        backgroundColor: "rgb(var(--card) / 0.95)",
        borderBottomColor: "rgb(var(--border))",
        borderBottomWidth: "1px",
      }}
    >
      <div className="px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: "rgb(var(--foreground))" }}>
              AgentFlow
            </h1>
            <p className="text-xs" style={{ color: "rgb(var(--muted-foreground))" }}>
              AI Workflows
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                style={{
                  backgroundColor: isActive(item.href)
                    ? "rgb(var(--primary))"
                    : "transparent",
                  color: isActive(item.href)
                    ? "rgb(var(--primary-foreground))"
                    : "rgb(var(--muted-foreground))",
                }}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            style={{
              backgroundColor: "rgb(var(--muted))",
              color: "rgb(var(--muted-foreground))",
            }}
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Sign In</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg transition-all"
            style={{
              backgroundColor: "rgb(var(--muted))",
              color: "rgb(var(--muted-foreground))",
            }}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          className="md:hidden border-t"
          style={{
            backgroundColor: "rgb(var(--background))",
            borderTopColor: "rgb(var(--border))",
          }}
        >
          <div className="px-8 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                  style={{
                    backgroundColor: isActive(item.href)
                      ? "rgb(var(--primary))"
                      : "rgb(var(--card))",
                    color: isActive(item.href)
                      ? "rgb(var(--primary-foreground))"
                      : "rgb(var(--foreground))",
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

