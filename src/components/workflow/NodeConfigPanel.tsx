// src/components/workflow/NodeConfigPanel.tsx
import React from "react";
import type { WorkflowNodeData, KeyValue } from "../../types/workflow";

const ACTIONS = [
  { id: "email", label: "Send Email", params: ["to", "subject"] },
  { id: "slack", label: "Send Slack Message", params: ["channel", "message"] },
  { id: "update", label: "Update Database", params: ["table", "recordId"] },
];

interface Props {
  nodes: any[];
  nodeId: string;
  onUpdate: (id: string, changes: Partial<WorkflowNodeData>) => void;
}

export const NodeConfigPanel: React.FC<Props> = ({
  nodes,
  nodeId,
  onUpdate,
}) => {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return <div className="config-panel">No node selected.</div>;

  const data = node.data as WorkflowNodeData;

  const update = (field: keyof WorkflowNodeData, value: any) => {
    onUpdate(nodeId, { [field]: value });
  };

  const addKV = (field: keyof WorkflowNodeData) => {
    const current = (data[field] as KeyValue[] | undefined) ?? [];
    update(field, [...current, { key: "", value: "" }]);
  };

  const updateKV = (
    field: keyof WorkflowNodeData,
    index: number,
    key: string,
    value: string
  ) => {
    const current = (data[field] as KeyValue[] | undefined) ?? [];
    const list = [...current];
    list[index] = { key, value };
    update(field, list);
  };

  const renderKV = (field: keyof WorkflowNodeData, title: string) => {
    const list = (data[field] as KeyValue[] | undefined) ?? [];
    return (
      <div className="field">
        <label>{title}</label>
        {list.map((item, idx) => (
          <div
            key={idx}
            style={{ display: "flex", gap: "4px", marginBottom: "4px" }}
          >
            <input
              placeholder="Key"
              value={item.key}
              onChange={(e) =>
                updateKV(field, idx, e.target.value, item.value ?? "")
              }
              style={{ flex: 1 }}
            />
            <input
              placeholder="Value"
              value={item.value}
              onChange={(e) =>
                updateKV(field, idx, item.key ?? "", e.target.value)
              }
              style={{ flex: 1 }}
            />
          </div>
        ))}
        <button type="button" onClick={() => addKV(field)}>
          ➕ Add
        </button>
      </div>
    );
  };

  return (
    <div className="config-panel">
      <h2>⚙ Configure: {data.type.toUpperCase()}</h2>

      <div className="field">
        <label>Title</label>
        <input
          type="text"
          value={data.label ?? ""}
          placeholder="Node title"
          onChange={(e) => update("label", e.target.value)}
        />
      </div>

      <div className="field">
        <label>Description</label>
        <input
          type="text"
          value={data.description ?? ""}
          placeholder="Optional description"
          onChange={(e) => update("description", e.target.value)}
        />
      </div>

      {/* START NODE */}
      {data.type === "start" && renderKV("metadata", "Metadata")}

      {/* TASK NODE */}
      {data.type === "task" && (
        <>
          <div className="field">
            <label>Assignee</label>
            <input
              type="text"
              value={data.assignee ?? ""}
              placeholder="Assigned to..."
              onChange={(e) => update("assignee", e.target.value)}
            />
          </div>

          <div className="field">
            <label>Department</label>
            <input
              type="text"
              value={data.department ?? ""}
              placeholder="e.g. HR, Finance"
              onChange={(e) => update("department", e.target.value)}
            />
          </div>

          <div className="field">
            <label>Due Date</label>
            <input
              type="date"
              value={data.due ?? ""}
              onChange={(e) => update("due", e.target.value)}
            />
          </div>

          <div className="field">
            <label>Priority</label>
            <select
              value={data.priority ?? "Medium"}
              onChange={(e) =>
                update("priority", e.target.value as "High" | "Medium" | "Low")
              }
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div className="field">
            <label>SLA Hours</label>
            <input
              type="number"
              value={data.sla ?? ""}
              placeholder="e.g. 72"
              onChange={(e) => update("sla", e.target.value)}
            />
          </div>

          <div className="field">
            <label>Comments</label>
            <input
              type="text"
              value={data.comments ?? ""}
              placeholder="Additional notes"
              onChange={(e) => update("comments", e.target.value)}
            />
          </div>

          {renderKV("custom", "Custom Fields")}
        </>
      )}

      {/* APPROVAL NODE */}
      {data.type === "approval" && (
        <>
          <div className="field">
            <label>Approver Role</label>
            <input
              type="text"
              value={data.approver ?? ""}
              placeholder="Manager / HRBP / Director"
              onChange={(e) => update("approver", e.target.value)}
            />
          </div>

          <div className="field">
            <label>Auto-Approve Threshold (hours)</label>
            <input
              type="number"
              value={data.threshold ?? ""}
              placeholder="e.g. 48"
              onChange={(e) => update("threshold", e.target.value)}
            />
          </div>
        </>
      )}

      {/* AUTOMATED NODE */}
      {data.type === "automated" && (
        <>
          <div className="field">
            <label>Action</label>
            <select
              value={data.action ?? ""}
              onChange={(e) => {
                const selected = ACTIONS.find((a) => a.id === e.target.value);
                update("action", e.target.value);
                update(
                  "params",
                  selected ? selected.params.map(() => "") : []
                );
              }}
            >
              <option value="">Select an Action</option>
              {ACTIONS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          {data.action && (
            <div className="field">
              <label>Parameters</label>
              {ACTIONS.find((a) => a.id === data.action)?.params.map(
                (p, idx) => (
                  <input
                    key={p}
                    placeholder={p}
                    value={data.params?.[idx] ?? ""}
                    onChange={(e) => {
                      const current = Array.isArray(data.params)
                        ? [...data.params]
                        : [];
                      current[idx] = e.target.value;
                      update("params", current);
                    }}
                    style={{ marginBottom: 4 }}
                  />
                )
              )}
            </div>
          )}
        </>
      )}

      {/* END NODE */}
      {data.type === "end" && (
        <>
          <div className="field">
            <label>End Message</label>
            <input
              type="text"
              value={data.message ?? ""}
              placeholder="Workflow completed message"
              onChange={(e) => update("message", e.target.value)}
            />
          </div>

          <div
            className="field"
            style={{ flexDirection: "row", alignItems: "center", gap: "6px" }}
          >
            <label>Generate Summary?</label>
            <input
              type="checkbox"
              checked={data.summary ?? false}
              onChange={(e) => update("summary", e.target.checked)}
            />
          </div>
        </>
      )}
    </div>
  );
};