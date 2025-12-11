export const WORKFLOW_KEY = "hr_workflow_data";

export function saveWorkflow(nodes: any, edges: any) {
  localStorage.setItem(
    WORKFLOW_KEY,
    JSON.stringify({
      nodes,
      edges,
      savedAt: new Date().toISOString(),
    })
  );
}

export function loadWorkflow() {
  const data = localStorage.getItem(WORKFLOW_KEY);
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function clearWorkflow() {
  localStorage.removeItem(WORKFLOW_KEY);
}