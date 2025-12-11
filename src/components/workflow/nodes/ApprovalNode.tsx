import React from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { WorkflowNodeData } from "../../../types/workflow";

export const ApprovalNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data }) => {
  return (
    <div
      className="node-card node-hover"
      style={{
        background: "#fef9c3",
        border: "1px solid #facc15",
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
          background: "#facc15",
          width: 10,
          height: 10,
          borderRadius: "50%",
        }}
      />

      {/* Title */}
      <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
        <span>🟡</span>
        <span>{data.label ?? "Approval"}</span>
      </div>

      {/* Approver Role */}
      {data.approver && (
        <div style={{ color: "#6b7280", fontSize: "0.78rem" }}>
          Role: {data.approver}
        </div>
      )}

      {/* Outgoing edge */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "#facc15",
          width: 10,
          height: 10,
          borderRadius: "50%",
        }}
      />
    </div>
  );
};