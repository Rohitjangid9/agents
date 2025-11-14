"use client";

import React, { useEffect, useState } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { TopNavBar } from "./TopNavBar";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";
import { BottomPanel } from "./BottomPanel";
import { WorkflowCanvas } from "./WorkflowCanvas";

interface ResizableLayoutProps {
  onTest: () => void;
  onSave: () => void;
}

const STORAGE_KEY = "agentflow-layout-sizes";

export const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  onTest,
  onSave,
}) => {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [bottomCollapsed, setBottomCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load saved sizes from localStorage
  const [sizes, setSizes] = useState({
    left: 18,
    right: 18,
    bottom: 30,
  });

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSizes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load layout sizes:", e);
      }
    }
  }, []);

  const handleSizeChange = (newSizes: typeof sizes) => {
    setSizes(newSizes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSizes));
  };

  if (!mounted) return null;

  return (
    <div
      className="flex flex-col h-screen"
      style={{
        backgroundColor: "rgb(var(--background))",
        color: "rgb(var(--foreground))",
      }}
    >
      {/* Top Navigation */}
      <TopNavBar onTest={onTest} onSave={onSave} />

      {/* Resizable Layout */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">
          {/* Left Sidebar */}
          <Panel
            defaultSize={sizes.left}
            minSize={12}
            maxSize={35}
            onResize={(size) => handleSizeChange({ ...sizes, left: size })}
            collapsible={true}
            onCollapse={() => setLeftCollapsed(true)}
            onExpand={() => setLeftCollapsed(false)}
            className="overflow-hidden"
          >
            <div className="h-full overflow-auto">
              <LeftSidebar
                isCollapsed={leftCollapsed}
                onToggle={() => setLeftCollapsed(!leftCollapsed)}
              />
            </div>
          </Panel>

          {/* Resize Handle - Left */}
          <PanelResizeHandle
            className="w-1 hover:w-1.5 transition-all"
            style={{
              backgroundColor: "rgb(var(--border))",
            }}
          >
            <div
              className="w-full h-full hover:bg-blue-500 transition-colors"
              style={{
                backgroundColor: "rgb(var(--border))",
              }}
            />
          </PanelResizeHandle>

          {/* Center Area with Canvas and Bottom Panel */}
          <Panel defaultSize={64} minSize={35} className="overflow-hidden">
            <PanelGroup direction="vertical" className="h-full">
              {/* Workflow Canvas */}
              <Panel defaultSize={70} minSize={40} className="overflow-hidden">
                <div className="h-full w-full overflow-hidden">
                  <WorkflowCanvas />
                </div>
              </Panel>

              {/* Resize Handle - Bottom */}
              <PanelResizeHandle
                className="h-1 hover:h-1.5 transition-all"
                style={{
                  backgroundColor: "rgb(var(--border))",
                }}
              >
                <div
                  className="w-full h-full hover:bg-blue-500 transition-colors"
                  style={{
                    backgroundColor: "rgb(var(--border))",
                  }}
                />
              </PanelResizeHandle>

              {/* Bottom Panel */}
              <Panel
                defaultSize={30}
                minSize={15}
                maxSize={50}
                onResize={(size) =>
                  handleSizeChange({ ...sizes, bottom: size })
                }
                collapsible={true}
                onCollapse={() => setBottomCollapsed(true)}
                onExpand={() => setBottomCollapsed(false)}
                className="overflow-hidden"
              >
                <div className="h-full overflow-auto">
                  <BottomPanel
                    isCollapsed={bottomCollapsed}
                    onToggle={() => setBottomCollapsed(!bottomCollapsed)}
                  />
                </div>
              </Panel>
            </PanelGroup>
          </Panel>

          {/* Resize Handle - Right */}
          <PanelResizeHandle
            className="w-1 hover:w-1.5 transition-all"
            style={{
              backgroundColor: "rgb(var(--border))",
            }}
          >
            <div
              className="w-full h-full hover:bg-blue-500 transition-colors"
              style={{
                backgroundColor: "rgb(var(--border))",
              }}
            />
          </PanelResizeHandle>

          {/* Right Sidebar */}
          <Panel
            defaultSize={sizes.right}
            minSize={12}
            maxSize={35}
            onResize={(size) => handleSizeChange({ ...sizes, right: size })}
            collapsible={true}
            onCollapse={() => setRightCollapsed(true)}
            onExpand={() => setRightCollapsed(false)}
            className="overflow-hidden"
          >
            <div className="h-full overflow-auto">
              <RightSidebar
                isCollapsed={rightCollapsed}
                onToggle={() => setRightCollapsed(!rightCollapsed)}
              />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};
