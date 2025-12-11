import React from "react";

const NODE_TYPES: { id: string; label: string }[] = [
  { id: "start", label: "Start" },
  { id: "task", label: "Task" },
  { id: "approval", label: "Approval" },
  { id: "automated", label: "Automated Step" },
  { id: "end", label: "End" },
];

export const NodeSidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="node-sidebar">
      <h3>Nodes</h3>
      <p>Drag a node onto the canvas</p>

      {NODE_TYPES.map((n) => (
        <div
          key={n.id}
          className="node-item"
          draggable
          onDragStart={(e) => onDragStart(e, n.id)}
        >
          {n.label}
        </div>
      ))}
    </aside>
  );
};