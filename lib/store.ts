'use client';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Workflow, WorkflowNode, WorkflowEdge } from '@/types/workflow';

interface WorkflowStore {
  workflow: Workflow | null;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  history: Workflow[];
  historyIndex: number;

  // Actions
  setWorkflow: (workflow: Workflow) => void;
  selectNode: (nodeId: string | null) => void;
  selectEdge: (edgeId: string | null) => void;
  updateNode: (nodeId: string, data: Partial<WorkflowNode>) => void;
  addNode: (node: WorkflowNode) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: WorkflowEdge) => void;
  removeEdge: (edgeId: string) => void;
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
}

export const useWorkflowStore = create<WorkflowStore>()(
  immer((set, get) => ({
    workflow: null,
    selectedNodeId: null,
    selectedEdgeId: null,
    history: [],
    historyIndex: -1,

    setWorkflow: (workflow) =>
      set((state) => {
        state.workflow = workflow;
        state.history = [workflow];
        state.historyIndex = 0;
      }),

    selectNode: (nodeId) =>
      set((state) => {
        state.selectedNodeId = nodeId;
        state.selectedEdgeId = null;
      }),

    selectEdge: (edgeId) =>
      set((state) => {
        state.selectedEdgeId = edgeId;
        state.selectedNodeId = null;
      }),

    updateNode: (nodeId, data) =>
      set((state) => {
        if (state.workflow) {
          const node = state.workflow.nodes.find((n) => n.id === nodeId);
          if (node) {
            Object.assign(node, data);
          }
        }
      }),

    addNode: (node) =>
      set((state) => {
        if (state.workflow) {
          state.workflow.nodes.push(node);
        }
      }),

    removeNode: (nodeId) =>
      set((state) => {
        if (state.workflow) {
          state.workflow.nodes = state.workflow.nodes.filter(
            (n) => n.id !== nodeId
          );
          state.workflow.edges = state.workflow.edges.filter(
            (e) => e.source !== nodeId && e.target !== nodeId
          );
        }
      }),

    addEdge: (edge) =>
      set((state) => {
        if (state.workflow) {
          state.workflow.edges.push(edge);
        }
      }),

    removeEdge: (edgeId) =>
      set((state) => {
        if (state.workflow) {
          state.workflow.edges = state.workflow.edges.filter(
            (e) => e.id !== edgeId
          );
        }
      }),

    saveToHistory: () =>
      set((state) => {
        if (state.workflow) {
          state.history = state.history.slice(0, state.historyIndex + 1);
          state.history.push(JSON.parse(JSON.stringify(state.workflow)));
          state.historyIndex = state.history.length - 1;
        }
      }),

    undo: () =>
      set((state) => {
        if (state.historyIndex > 0) {
          state.historyIndex--;
          state.workflow = JSON.parse(
            JSON.stringify(state.history[state.historyIndex])
          );
        }
      }),

    redo: () =>
      set((state) => {
        if (state.historyIndex < state.history.length - 1) {
          state.historyIndex++;
          state.workflow = JSON.parse(
            JSON.stringify(state.history[state.historyIndex])
          );
        }
      }),
  }))
);

