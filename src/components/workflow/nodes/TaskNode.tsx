import React from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { WorkflowNodeData } from "../../../types/workflow";

export const TaskNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data }) => {
  return (
    <div className="node-card node-hover">
      {/* Handles for connecting edges */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: "#3b82f6",
          width: 10,
          height: 10,
          borderRadius: "50%",
        }}
      />

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "#3b82f6",
          width: 10,
          height: 10,
          borderRadius: "50%",
        }}
      />

      {/* Node Content */}
      <div className="node-title">📝 {data.label ?? "Task"}</div>

      {data.assignee && (
        <div className="node-subtext">👤 {data.assignee}</div>
      )}

      {data.priority && (
        <div className="node-meta">
          Priority: {data.priority}
        </div>
      )}
    </div>
  );
};