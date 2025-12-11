// src/utils/validateWorkflow.ts
import type { Edge, Node, Connection } from "reactflow";
import type { WorkflowNodeData } from "../types/workflow";

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

function showErrors(errors: string[]) {
  if (!errors.length) return;
  alert("⚠ Workflow issue:\n\n" + errors.map((e) => "• " + e).join("\n"));
}

// ✅ Full-graph validation (used by SimulationPanel)
export function validateWorkflow(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!nodes.length) {
    errors.push("Workflow is empty. Please add at least one node.");
    return { ok: false, errors, warnings };
  }

  const startNodes = nodes.filter((n) => n.data.type === "start");
  const endNodes = nodes.filter((n) => n.data.type === "end");

  if (startNodes.length === 0) {
    errors.push("No Start node found. Add a Start node to begin the workflow.");
  } else if (startNodes.length > 1) {
    errors.push("Multiple Start nodes found. Only one Start node is allowed.");
  }

  if (endNodes.length === 0) {
    warnings.push("No End node found. Simulation may stop early.");
  } else if (endNodes.length > 1) {
    warnings.push(
      "Multiple End nodes found. Simulation will stop at the first reachable End."
    );
  }

  // Incoming edges per node
  const incomingMap = new Map<string, number>();
  edges.forEach((e) => {
    incomingMap.set(e.target, (incomingMap.get(e.target) ?? 0) + 1);
  });

  nodes.forEach((node) => {
    if (node.data.type === "start") return;
    const incoming = incomingMap.get(node.id) ?? 0;
    if (incoming === 0) {
      warnings.push(
        `Node "${node.data.label ?? node.id}" is not connected from any previous step.`
      );
    }
  });

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
}

// ✅ Edge-level validation (used by WorkflowCanvas.onConnect)
export function validateOnConnect(
  params: Connection,
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): boolean {
  if (!params.source || !params.target) return false;

  const sourceNode = nodes.find((n) => n.id === params.source);
  const targetNode = nodes.find((n) => n.id === params.target);

  const errors: string[] = [];

  if (params.source === params.target) {
    errors.push("A node cannot connect to itself.");
  }

  if (targetNode?.data.type === "start") {
    errors.push("Nothing can lead INTO the Start node.");
  }

  if (sourceNode?.data.type === "end") {
    errors.push("End cannot connect to another step.");
  }

  if (targetNode?.data.type === "end") {
    const alreadyIncoming = edges.some((e) => e.target === params.target);
    if (alreadyIncoming) {
      errors.push("End step cannot have multiple incoming connections.");
    }
  }

  if (errors.length) {
    showErrors(errors);
    return false;
  }

  return true;
}