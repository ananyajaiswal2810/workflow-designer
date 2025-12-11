// src/components/workflow/WorkflowBuilder.tsx
import React, { useState, useCallback, useEffect } from "react";
import type { Node, Edge } from "reactflow";

import { WorkflowCanvas } from "./WorkflowCanvas";
import { NodeConfigPanel } from "./NodeConfigPanel";
import { SimulationPanel } from "./SimulationPanel";

import type { WorkflowNodeData, NodeKind } from "../../types/workflow";
import { createNodeData } from "../../utils/createNodeData";
import { loadWorkflow, saveWorkflow, clearWorkflow } from "../../utils/storageManager";

export const WorkflowBuilder: React.FC = () => {
  const [nodes, setNodes] = useState<Node<WorkflowNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  /* =====================================================
     🔄 LOAD SAVED WORKFLOW
  ===================================================== */
  useEffect(() => {
    const saved = loadWorkflow();
    if (saved?.nodes && saved?.edges) {
      setNodes(saved.nodes);
      setEdges(saved.edges);
      console.log("🔄 Loaded saved workflow:", saved.meta);
    }
  }, []);

  /* =====================================================
     ➕ ADD NODE
  ===================================================== */
  const onAddNode = useCallback(
    (kind: NodeKind, position: { x: number; y: number }) => {
      const id = `node-${Date.now()}`;
      setNodes((prev) => [
        ...prev,
        {
          id,
          type: kind,
          position,
          data: { ...createNodeData(kind), id },
        },
      ]);
    },
    []
  );

  /* =====================================================
     ✏️ UPDATE NODE
  ===================================================== */
  const onUpdateNode = useCallback(
    (id: string, data: Partial<WorkflowNodeData>) => {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, ...data } } : node
        )
      );
    },
    []
  );

  /* =====================================================
     🎯 SELECT NODE
  ===================================================== */
  const handleSelectNode = (id: string | null) => {
    setActiveNodeId(null);
    setSelectedNodeId(id);
  };

  /* =====================================================
     💾 SAVE
  ===================================================== */
  const handleSave = () => {
    saveWorkflow(nodes, edges, { note: "User clicked Save" });
    alert("💾 Workflow Saved!");
  };

  /* =====================================================
     🧹 CLEAR
  ===================================================== */
  const handleClear = () => {
    const sure = confirm("⚠ This will remove all nodes & edges. Continue?");
    if (!sure) return;

    clearWorkflow();
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setActiveNodeId(null);
  };

  /* =====================================================
     🎨 UI LAYOUT
  ===================================================== */
  return (
    <div className="workflow-page">

      {/* ========================= HEADER ========================= */}
      <header className="workflow-header">
        <div className="header-content">
          <h1>Workflow Designer</h1>
        </div>

        <div className="header-actions">
          <button className="header-btn" onClick={handleSave}>💾 Save</button>
          <button className="header-btn" onClick={handleClear}>🧹 Clear</button>
        </div>
      </header>

      {/* ========================= MAIN GRID ========================= */}
      <div className="workflow-main">

        {/* ============== SIDEBAR ============== */}
        <aside className="sidebar">
          <h2 className="sidebar-title">Steps</h2>
          <p className="sidebar-hint">Drag to canvas</p>

          <div className="sidebar-nodes">
            {["start", "task", "approval", "automated", "end"].map((type) => (
              <div
                key={type}
                className="node-item"
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("application/reactflow", type)
                }
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </div>
            ))}
          </div>
        </aside>

        {/* ============== CANVAS ============== */}
        <section className="canvas-container">
          <WorkflowCanvas
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
            onSelectNode={handleSelectNode}
            onAddNode={onAddNode}
            activeNodeId={activeNodeId}
          />
        </section>

        {/* ============== RIGHT PANEL ============== */}
        <aside className="panel-container">
          {selectedNodeId ? (
            <NodeConfigPanel
              nodes={nodes}
              nodeId={selectedNodeId}
              onUpdate={onUpdateNode}
            />
          ) : (
            <SimulationPanel
              nodes={nodes}
              edges={edges}
              setActiveNode={setActiveNodeId}
            />
          )}
        </aside>
      </div>
    </div>
  );
};