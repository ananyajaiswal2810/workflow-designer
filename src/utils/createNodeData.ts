// src/utils/createNodeData.ts
import type { WorkflowNodeData, NodeKind } from "../types/workflow";

export function createNodeData(kind: NodeKind): WorkflowNodeData {
  switch (kind) {
    case "start":
      return {
        type: "start",
        label: "Start",
        metadata: [],
      };
    case "task":
      return {
        type: "task",
        label: "Task",
        description: "",
        assignee: "",
        due: "",
        priority: "Medium",
        department: "",
        sla: 72,
        comments: "",
        custom: [],
      };
    case "approval":
      return {
        type: "approval",
        label: "Approval",
        description: "",
        approver: "",
        threshold: 48,
      };
    case "automated":
      return {
        type: "automated",
        label: "Automated Step",
        description: "",
        action: "",
        params: [],
      };
    case "end":
      return {
        type: "end",
        label: "End",
        message: "Workflow completed",
        summary: true,
      };
    default:
      return { type: kind, label: "Step" };
  }
}