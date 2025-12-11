import React from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { WorkflowNodeData } from "../../../types/workflow";

export const StartNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data }) => {
  return (
    <div
      className="node-card node-hover"
      style={{
        padding: "10px 16px",
        borderRadius: "999px",
        background: "#dcfce7",
        border: "2px solid #16a34a",
        fontSize: "0.85rem",
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        minWidth: 130,
        justifyContent: "center",
      }}
    >
      {/* 🟢 Start icon & label */}
      <span>🟢</span>
      <span>{data.label ?? "Start"}</span>

      {/* ➡️ Outgoing connection */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "#16a34a",
          width: 10,
          height: 10,
          borderRadius: "50%",
        }}
      />
    </div>
  );
};