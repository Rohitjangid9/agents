"use client";

import React, { useEffect } from "react";
import { useWorkflowStore } from "@/lib/store";
import { Workflow } from "@/types/workflow";
import { ResizableLayout } from "@/components/ResizableLayout";

export default function WorkflowPage() {
  const setWorkflow = useWorkflowStore((state) => state.setWorkflow);

  // Initialize with a sample workflow
  useEffect(() => {
    const sampleWorkflow: Workflow = {
      id: "workflow-1",
      name: "Customer Support Agent",
      description: "AI-powered customer support workflow",
      nodes: [],
      edges: [],
      settings: {
        model: "GPT-4",
        temperature: 0.7,
        maxTokens: 2000,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setWorkflow(sampleWorkflow);
  }, [setWorkflow]);

  const handleTest = () => {
    console.log("Test workflow");
  };

  const handleSave = () => {
    console.log("Save workflow");
  };

  return <ResizableLayout onTest={handleTest} onSave={handleSave} />;
}
