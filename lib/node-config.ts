import { NodeConfig } from '@/types/workflow';

export const NODE_CONFIGS: Record<string, NodeConfig> = {
  orchestrator: {
    type: 'orchestrator',
    label: 'Orchestrator',
    icon: 'Network',
    color: '#3b82f6',
    defaultData: {
      name: 'Orchestrator',
      description: 'Central workflow orchestrator',
    },
  },
  'intent-classifier': {
    type: 'intent-classifier',
    label: 'Intent Classifier',
    icon: 'GitBranch',
    color: '#8b5cf6',
    defaultData: {
      name: 'Intent Classifier',
      systemPrompt: 'Classify user intent...',
    },
  },
  agent: {
    type: 'agent',
    label: 'Agent',
    icon: 'Zap',
    color: '#ec4899',
    defaultData: {
      name: 'Agent',
      systemPrompt: '',
      tools: [],
    },
  },
  'knowledge-base': {
    type: 'knowledge-base',
    label: 'Knowledge Base',
    icon: 'Database',
    color: '#f59e0b',
    defaultData: {
      name: 'Knowledge Base',
      source: '',
      type: 'vector',
    },
  },
  'api-endpoint': {
    type: 'api-endpoint',
    label: 'API Endpoint',
    icon: 'Globe',
    color: '#10b981',
    defaultData: {
      name: 'API Endpoint',
      url: '',
      method: 'GET',
      headers: {},
    },
  },
  tool: {
    type: 'tool',
    label: 'Tool/Function',
    icon: 'Wrench',
    color: '#06b6d4',
    defaultData: {
      name: 'Tool',
      description: '',
      code: '',
    },
  },
  output: {
    type: 'output',
    label: 'Output/Response',
    icon: 'CheckCircle2',
    color: '#14b8a6',
    defaultData: {
      name: 'Output',
      format: 'json',
    },
  },
};

export const getNodeConfig = (type: string): NodeConfig | undefined => {
  return NODE_CONFIGS[type];
};

