/// src/components/workflow/WorkflowCanvas.tsx
import React, { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type OnConnect,
} from "reactflow";

import "reactflow/dist/style.css";

import type { Node, Edge } from "reactflow";
import type { WorkflowNodeData, NodeKind } from "../../types/workflow";

import { StartNode } from "./nodes/StartNode";
import { TaskNode } from "./nodes/TaskNode";
import { ApprovalNode } from "./nodes/ApprovalNode";
import { AutomatedNode } from "./nodes/AutomatedNode";
import { EndNode } from "./nodes/EndNode";

import { autoLayout } from "../../utils/autoLayout";
import { validateOnConnect } from "../../utils/validateWorkflow";
import { playNodeSound } from "../../utils/soundPlayer";

/* -----------------------------------------------------
   🧱 Custom Node Types
----------------------------------------------------- */
const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};

type WFNode = Node<WorkflowNodeData>;
type WFEdge = Edge;

interface CanvasProps {
  nodes: WFNode[];
  setNodes: React.Dispatch<React.SetStateAction<WFNode[]>>;
  edges: WFEdge[];
  setEdges: React.Dispatch<React.SetStateAction<WFEdge[]>>;
  onSelectNode: (id: string | null) => void;
  onAddNode: (kind: NodeKind, position: { x: number; y: number }) => void;
  activeNodeId: string | null;
}

/* -----------------------------------------------------
   🎨 MAIN COMPONENT
----------------------------------------------------- */
export const WorkflowCanvas: React.FC<CanvasProps> = ({
  nodes,
  setNodes,
  edges,
  setEdges,
  onSelectNode,
  onAddNode,
  activeNodeId,
}) => {
  /* -----------------------------------------------------
     🎯 DROP NODE FROM SIDEBAR
  ----------------------------------------------------- */
  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      const type = e.dataTransfer.getData("application/reactflow") as NodeKind;
      if (!type) return;

      const bounds = e.currentTarget.getBoundingClientRect();
      const position = {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      };

      playNodeSound(type);
      onAddNode(type, position);
    },
    [onAddNode]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  /* -----------------------------------------------------
     🔧 MOVE / DRAG NODES — FIXED!
  ----------------------------------------------------- */
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((prev) => applyNodeChanges(changes, prev));
    },
    [setNodes]
  );

  /* -----------------------------------------------------
     🔧 MOVE / DELETE EDGES
  ----------------------------------------------------- */
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((prev) => applyEdgeChanges(changes, prev));
    },
    [setEdges]
  );

  /* -----------------------------------------------------
     🔗 CONNECT NODES — WITH ANIMATION
  ----------------------------------------------------- */
  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      if (!validateOnConnect(params, nodes, edges)) return;

      playNodeSound("connect");

      setEdges((prev) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: {
              strokeWidth: 3,
              stroke: "url(#animatedEdgeGradient)",
            },
            type: "smoothstep",
          },
          prev
        )
      );
    },
    [nodes, edges, setEdges]
  );

  /* -----------------------------------------------------
     ❌ Deletions
  ----------------------------------------------------- */
  const onNodesDelete = useCallback(() => playNodeSound("delete"), []);
  const onEdgesDelete = useCallback(() => playNodeSound("delete"), []);

  /* -----------------------------------------------------
     🌟 ACTIVE NODE HIGHLIGHT
  ----------------------------------------------------- */
  const decoratedNodes = nodes.map((node) => ({
    ...node,
    className: node.id === activeNodeId ? "active-node" : "node-hover",
  }));

  /* -----------------------------------------------------
     ⚡ AUTO-LAYOUT
  ----------------------------------------------------- */
  const handleAutoLayout = () => {
    setNodes((prev) => autoLayout(prev, edges));
    playNodeSound("layout");
  };

  /* -----------------------------------------------------
     🎨 RENDER CANVAS
  ----------------------------------------------------- */
  return (
    <div className="canvas-wrapper colorful-canvas" onDrop={onDrop} onDragOver={onDragOver}>
      {/* Canvas Border Glow */}
      <div className="canvas-glow"></div>

      {/* Auto Layout Button */}
      <button className="layout-btn" onClick={handleAutoLayout}>
        ⚡ Auto Layout
      </button>

      <ReactFlow
        nodes={decoratedNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onNodeClick={(_, node) => {
          playNodeSound(node.data.type);
          onSelectNode(node.id);
        }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        connectionLineStyle={{ strokeWidth: 3, stroke: "#60a5fa" }}
        defaultEdgeOptions={{
          style: { strokeWidth: 3, stroke: "#64748b" },
          type: "smoothstep",
        }}
        deleteKeyCode={"Delete"}
      >
        {/* Gradient for animated edges */}
        <svg width="0" height="0">
          <defs>
            <linearGradient id="animatedEdgeGradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
        </svg>

        <MiniMap
          nodeColor={(n) => {
            switch (n.type) {
              case "start":
                return "#22c55e";
              case "task":
                return "#3b82f6";
              case "approval":
                return "#a855f7";
              case "automated":
                return "#f59e0b";
              case "end":
                return "#ef4444";
              default:
                return "#94a3b8";
            }
          }}
          nodeStrokeColor="#0ea5e9"
          nodeBorderRadius={4}
        />

        <Controls position="bottom-right" />
        <Background gap={18} color="#cbd5e1" size={1} />
      </ReactFlow>
    </div>
  );
};