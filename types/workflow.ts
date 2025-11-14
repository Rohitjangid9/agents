// Workflow and Node Types
export type NodeType = 
  | 'orchestrator' 
  | 'intent-classifier' 
  | 'agent' 
  | 'knowledge-base' 
  | 'api-endpoint' 
  | 'tool' 
  | 'output';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  data: Record<string, any>;
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  data?: {
    condition?: string;
    label?: string;
  };
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  settings: WorkflowSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowSettings {
  model?: string;
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface NodeConfig {
  type: NodeType;
  label: string;
  icon: string;
  color: string;
  defaultData: Record<string, any>;
}

export interface ConnectionValidation {
  isValid: boolean;
  reason?: string;
}

