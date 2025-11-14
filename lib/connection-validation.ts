import { ConnectionValidation, NodeType } from '@/types/workflow';

// Define valid connections between node types
const VALID_CONNECTIONS: Record<NodeType, NodeType[]> = {
  orchestrator: ['intent-classifier', 'agent', 'output'],
  'intent-classifier': ['agent', 'knowledge-base', 'output'],
  agent: ['tool', 'knowledge-base', 'api-endpoint', 'output'],
  'knowledge-base': ['agent', 'output'],
  'api-endpoint': ['agent', 'output'],
  tool: ['agent', 'output'],
  output: [],
};

// Nodes that cannot have incoming connections from themselves
const NO_SELF_LOOPS = ['orchestrator', 'output'];

export const validateConnection = (
  sourceType: NodeType,
  targetType: NodeType,
  sourceId: string,
  targetId: string
): ConnectionValidation => {
  // Prevent self-loops for certain nodes
  if (sourceId === targetId && NO_SELF_LOOPS.includes(sourceType)) {
    return {
      isValid: false,
      reason: `${sourceType} cannot connect to itself`,
    };
  }

  // Check if connection is in valid connections map
  const validTargets = VALID_CONNECTIONS[sourceType];
  if (!validTargets || !validTargets.includes(targetType)) {
    return {
      isValid: false,
      reason: `Cannot connect ${sourceType} to ${targetType}`,
    };
  }

  // Prevent cycles (simplified check)
  if (sourceType === 'output' && targetType !== 'output') {
    return {
      isValid: false,
      reason: 'Output nodes cannot have outgoing connections',
    };
  }

  return { isValid: true };
};

export const getConnectionColor = (isValid: boolean): string => {
  return isValid ? '#10b981' : '#ef4444'; // green for valid, red for invalid
};

