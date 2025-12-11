import type { Node, Edge } from "reactflow";

/**
 * Auto-layout algorithm
 * Positions nodes horizontally in sequence order.
 */
export function autoLayout(nodes: Node[], edges: Edge[]): Node[] {
  const sortedNodes = [...nodes];

  // Simple ordering by creation time (id timestamp)
  sortedNodes.sort((a, b) => {
    const aTime = parseInt(a.id.split("-")[1] || "0");
    const bTime = parseInt(b.id.split("-")[1] || "0");
    return aTime - bTime;
  });

  // Space nodes across canvas
  return sortedNodes.map((node, index) => ({
    ...node,
    position: { x: index * 200 + 50, y: 150 },
  }));
}