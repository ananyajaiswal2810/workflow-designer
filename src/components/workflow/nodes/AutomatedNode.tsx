import React from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { WorkflowNodeData } from "../../../types/workflow";

export const AutomatedNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data }) => {
  return (
    <div
      className="node-card node-hover"
      style={{
        background: "#eef2ff",
        border: "1px solid #6366f1",
        padding: "12px 14px",
        borderRadius: "12px",
        minWidth: 190,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {/* Incoming edge */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: "#6366f1",
          width: 10,
          height: 10,
          borderRadius: "50%",
        }}
      />

      {/* Title */}
      <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
        <span>🤖</span>
        <span>{data.label ?? "Automated Step"}</span>
      </div>

      {/* Action */}
      {data.action && (
        <div style={{ color: "#6b7280", fontSize: "0.78rem" }}>
          Action: {data.action}
        </div>
      )}

      {/* Outgoing edge */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "#6366f1",
          width: 10,
          height: 10,
          borderRadius: "50%",
        }}
      />
    </div>
  );
};