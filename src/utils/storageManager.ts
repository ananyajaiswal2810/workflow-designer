// src/utils/storageManager.ts
import type { Node, Edge } from "reactflow";
import type { WorkflowNodeData } from "../types/workflow";

const STORAGE_KEY = "hr-workflow-designer";

interface StoredWorkflow {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  meta?: {
    note?: string;
    savedAt?: string;
  };
}

export function saveWorkflow(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
  meta?: Record<string, any>
) {
  const payload: StoredWorkflow = {
    nodes,
    edges,
    meta: {
      ...meta,
      savedAt: new Date().toISOString(),
    },
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadWorkflow(): StoredWorkflow | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredWorkflow;
  } catch {
    return null;
  }
}

export function clearWorkflow() {
  localStorage.removeItem(STORAGE_KEY);
}