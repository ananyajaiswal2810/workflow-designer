// src/App.tsx
import React from "react";
import { WorkflowBuilder } from "./components/workflow/WorkflowBuilder";

export default function App() {
  return (
    <div className="app-root">
      {/* Removed the HR Workflow Designer header completely */}
      <WorkflowBuilder />
    </div>
  );
}