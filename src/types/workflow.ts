// src/types/workflow.ts

export type NodeKind = "start" | "task" | "approval" | "automated" | "end";

export interface KeyValue {
  key: string;
  value: string;
}

export interface WorkflowNodeData {
  id?: string;
  type: NodeKind;

  // Common
  label?: string;
  description?: string;

  // Start
  metadata?: KeyValue[];

  // Task
  assignee?: string;
  due?: string; // ISO date string
  priority?: "High" | "Medium" | "Low";
  department?: string;
  sla?: number | string;
  comments?: string;
  custom?: KeyValue[];

  // Approval
  approver?: string;
  threshold?: number | string;

  // Automated
  action?: string;
  params?: string[];

  // End
  message?: string;
  summary?: boolean;
}