// src/components/workflow/SimulationPanel.tsx
import React, { useState } from "react";
import type { Node, Edge } from "reactflow";
import type { WorkflowNodeData } from "../../types/workflow";

import {
  validateWorkflow,
  type ValidationResult,
} from "../../utils/validateWorkflow";

import { playNodeSound } from "../../utils/soundPlayer";

interface Props {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  setActiveNode: (id: string | null) => void;
}

interface LogEntry {
  time: string;
  kind: "info" | "error" | "warn";
  message: string;
}

export const SimulationPanel: React.FC<Props> = ({
  nodes,
  edges,
  setActiveNode,
}) => {
  const [status, setStatus] = useState<"idle" | "running">("idle");
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  /* -------------------------------------------------------
     📝 Log Helper
  ------------------------------------------------------- */
  const log = (entry: Omit<LogEntry, "time">) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [{ time, ...entry }, ...prev]);
  };

  /* -------------------------------------------------------
     ✔ Validate Workflow
  ------------------------------------------------------- */
  const handleValidate = () => {
    const result = validateWorkflow(nodes, edges);
    setValidation(result);

    if (result.ok) {
      log({ kind: "info", message: "Validation passed successfully." });
    } else {
      log({
        kind: "error",
        message: `Validation failed: ${result.errors.length} errors, ${result.warnings.length} warnings.`,
      });
      playNodeSound("error");
    }
  };

  /* Utility delay */
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  /* -------------------------------------------------------
     ▶ RUN WORKFLOW (with Mock API)
  ------------------------------------------------------- */
  const handleRun = async () => {
    if (status === "running") return;

    // --- Re-run validation ---
    const result = validateWorkflow(nodes, edges);
    setValidation(result);

    if (!result.ok) {
      playNodeSound("error");
      alert(
        "Cannot run until errors are fixed:\n\n" +
          result.errors.map((e) => "• " + e).join("\n")
      );
      log({ kind: "error", message: "Simulation blocked due to validation errors." });
      return;
    }

    const startNode = nodes.find((n) => n.data.type === "start");
    if (!startNode) {
      log({ kind: "error", message: "No Start node found — simulation aborted." });
      playNodeSound("error");
      return;
    }

    setStatus("running");
    setActiveNode(startNode.id);
    playNodeSound("start");
    log({ kind: "info", message: "Simulation started." });

    /* -------------------------------------------------------
       ⭐ 1. CALL MOCK API (/simulate)
    ------------------------------------------------------- */
    log({ kind: "info", message: "Calling simulation API..." });

    const apiResponse = await fetch("/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodes, edges }),
    }).then((res) => res.json());

    log({ kind: "info", message: "API responded: Simulation timeline loaded." });

    /* -------------------------------------------------------
       ⭐ 2. Animate the real workflow path visually
    ------------------------------------------------------- */
    let current = startNode;

    while (true) {
      await delay(900);

      // if we reach end
      if (current.data.type === "end") {
        playNodeSound("end");
        log({ kind: "info", message: `Reached End node "${current.data.label ?? current.id}"` });
        break;
      }

      // find the outgoing edge
      const nextEdge = edges.find((e) => e.source === current.id);
      if (!nextEdge) {
        playNodeSound("error");
        log({
          kind: "warn",
          message: `Stopped at "${current.data.label}" — no outgoing edge.`,
        });
        break;
      }

      const next = nodes.find((n) => n.id === nextEdge.target);
      if (!next) {
        playNodeSound("error");
        log({ kind: "warn", message: `Missing target node: ${nextEdge.target}` });
        break;
      }

      current = next;
      setActiveNode(current.id);
      playNodeSound(current.data.type);
    }

    /* -------------------------------------------------------
       ⭐ 3. Append API timeline to logs
    ------------------------------------------------------- */
    apiResponse.timeline.forEach((t: any) =>
      log({ kind: "info", message: t.event })
    );

    await delay(300);
    setActiveNode(null);
    playNodeSound("complete");
    setStatus("idle");

    log({ kind: "info", message: "Simulation completed successfully." });
  };

  /* -------------------------------------------------------
     🎨 UI
  ------------------------------------------------------- */
  return (
    <div className="config-panel">
      <h2 style={{ marginBottom: "0.5rem" }}>🎬 Workflow Simulation</h2>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem" }}>
        <button onClick={handleValidate} disabled={status === "running"} style={{ flex: 1 }}>
          🔍 Validate
        </button>

        <button onClick={handleRun} disabled={status === "running"} style={{ flex: 1 }}>
          {status === "running" ? "⏳ Running..." : "▶ Run"}
        </button>
      </div>

      {/* Node + Edge Count Box */}
      <div
        style={{
          fontSize: "0.8rem",
          marginBottom: "1rem",
          padding: "0.5rem",
          background: "var(--panel)",
          borderRadius: 6,
          border: "1px solid var(--border)",
        }}
      >
        <div>🧩 <b>Nodes:</b> {nodes.length}</div>
        <div>🔗 <b>Edges:</b> {edges.length}</div>
      </div>

      {/* Validation */}
      {validation && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.7rem",
            borderRadius: 6,
            background: validation.ok ? "#ecfdf5" : "#fef2f2",
            border: validation.ok ? "1px solid #16a34a" : "1px solid #f87171",
            fontSize: "0.8rem",
          }}
        >
          <b>{validation.ok ? "✔ All Good" : "⚠ Issues Found"}</b>

          {!!validation.errors.length && (
            <ul style={{ paddingLeft: "1rem", marginTop: 6 }}>
              {validation.errors.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          )}

          {!!validation.warnings.length && (
            <ul style={{ paddingLeft: "1rem", marginTop: 6 }}>
              {validation.warnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Timeline */}
      <div style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: 6 }}>
        📜 Simulation Timeline
      </div>

      <div
        style={{
          maxHeight: 200,
          overflowY: "auto",
          padding: "0.5rem",
          fontSize: "0.75rem",
          border: "1px solid var(--border)",
          borderRadius: 6,
          background: "var(--panel)",
        }}
      >
        {logs.length === 0 ? (
          <div style={{ color: "#9ca3af" }}>No simulation events yet.</div>
        ) : (
          logs.map((logItem, idx) => (
            <div key={idx} style={{ marginBottom: 4 }}>
              <span style={{ opacity: 0.6, marginRight: 4 }}>
                [{logItem.time}]
              </span>
              <span
                style={{
                  color:
                    logItem.kind === "error"
                      ? "#b91c1c"
                      : logItem.kind === "warn"
                      ? "#d97706"
                      : "var(--text)",
                }}
              >
                {logItem.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};