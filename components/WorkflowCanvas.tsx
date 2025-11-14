"use client";

import React, { useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  EdgeTypes,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { useWorkflowStore } from "@/lib/store";
import { WorkflowNode as WorkflowNodeType } from "@/types/workflow";
import { validateConnection } from "@/lib/connection-validation";
import { OrchestratorNode } from "./nodes/OrchestratorNode";
import { IntentClassifierNode } from "./nodes/IntentClassifierNode";
import { AgentNode } from "./nodes/AgentNode";
import { KnowledgeBaseNode } from "./nodes/KnowledgeBaseNode";
import { ApiEndpointNode } from "./nodes/ApiEndpointNode";
import { ToolNode } from "./nodes/ToolNode";
import { OutputNode } from "./nodes/OutputNode";
import { CustomEdge } from "./edges/CustomEdge";

const nodeTypes: NodeTypes = {
  orchestrator: OrchestratorNode,
  "intent-classifier": IntentClassifierNode,
  agent: AgentNode,
  "knowledge-base": KnowledgeBaseNode,
  "api-endpoint": ApiEndpointNode,
  tool: ToolNode,
  output: OutputNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const WorkflowCanvasContent: React.FC = () => {
  const workflow = useWorkflowStore((state) => state.workflow);
  const selectNode = useWorkflowStore((state) => state.selectNode);
  const selectEdge = useWorkflowStore((state) => state.selectEdge);
  const addNode = useWorkflowStore((state) => state.addNode);
  const addEdge = useWorkflowStore((state) => state.addEdge);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  // Initialize nodes and edges from workflow
  useEffect(() => {
    if (workflow) {
      const rfNodes = workflow.nodes.map((node: WorkflowNodeType) => ({
        id: node.id,
        data: { label: node.label, ...node.data },
        position: node.position,
        type: node.type,
      }));
      const rfEdges = workflow.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: "custom",
        data: edge.data,
      }));
      setNodes(rfNodes);
      setEdges(rfEdges);
    }
  }, [workflow, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const sourceNode = workflow?.nodes.find(
        (n) => n.id === connection.source
      );
      const targetNode = workflow?.nodes.find(
        (n) => n.id === connection.target
      );

      if (!sourceNode || !targetNode) return;

      const validation = validateConnection(
        sourceNode.type,
        targetNode.type,
        connection.source!,
        connection.target!
      );

      if (validation.isValid) {
        const edgeId = `${connection.source}-${
          connection.target
        }-${Date.now()}`;
        addEdge({
          id: edgeId,
          source: connection.source!,
          target: connection.target!,
        });
      }
    },
    [workflow, addEdge]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData("application/reactflow");

      if (!nodeType) return;

      // Convert screen coordinates to flow coordinates
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: WorkflowNodeType = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType as any,
        label: nodeType.charAt(0).toUpperCase() + nodeType.slice(1),
        data: {},
        position,
      };

      addNode(newNode);
    },
    [addNode, screenToFlowPosition]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      selectEdge(edge.id);
    },
    [selectEdge]
  );

  return (
    <div
      ref={reactFlowWrapper}
      className="w-full h-full"
      style={{
        backgroundColor: "rgb(var(--background))",
        transition: "background-color 0.3s ease",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView={false}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          type: "custom",
          animated: true,
        }}
      >
        <Background
          color="rgb(var(--border))"
          gap={16}
          size={1}
          style={{
            opacity: 0.15,
          }}
          variant="dots"
        />
        <Controls
          position="bottom-right"
          style={{
            display: "flex",
            gap: "8px",
            backgroundColor: "rgb(var(--card))",
            border: "1px solid rgb(var(--border))",
            borderRadius: "8px",
            padding: "8px",
          }}
        />
        <MiniMap
          position="bottom-left"
          style={{
            backgroundColor: "rgb(var(--card))",
            border: "1px solid rgb(var(--border))",
            borderRadius: "8px",
          }}
        />
      </ReactFlow>
    </div>
  );
};

export const WorkflowCanvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <div className="w-full h-full">
        <WorkflowCanvasContent />
      </div>
    </ReactFlowProvider>
  );
};
