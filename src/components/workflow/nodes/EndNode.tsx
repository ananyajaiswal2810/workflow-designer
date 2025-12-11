import React from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { WorkflowNodeData } from "../../../types/workflow";

export const EndNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data }) => {
  return (
    <div
      className="node-card node-hover"
      style={{
        background: "#fee2e2",
        border: "1px solid #ef4444",
        borderRadius: "999px",
        padding: "10px 16px",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        minWidth: 150,
      }}
    >
      {/* Left Target Handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: "#ef4444",
          width: 10,
          height: 10,
          borderRadius: "50%",
        }}
      />

      {/* End Label */}
      <span style={{ fontSize: "1rem" }}>🔴</span>
      <span style={{ fontWeight: 600 }}>{data.label ?? "End"}</span>
    </div>
  );
};