import type { Node, Edge } from "reactflow";
import YAML from "yaml";

/* =======================================================
   📤 EXPORT JSON & YAML
======================================================= */

export function saveAsJSON(nodes: Node[], edges: Edge[]) {
  const data = { nodes, edges };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  downloadFile(url, "workflow.json");
}

export function saveAsYAML(nodes: Node[], edges: Edge[]) {
  const data = { nodes, edges };
  const yamlString = YAML.stringify(data);
  const blob = new Blob([yamlString], { type: "application/x-yaml" });
  const url = URL.createObjectURL(blob);
  downloadFile(url, "workflow.yaml");
}

/* =======================================================
   📥 IMPORT JSON or YAML
======================================================= */

export async function importWorkflowFile(): Promise<
  | { nodes: Node[]; edges: Edge[] }
  | null
> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,.yaml,.yml";

    input.onchange = async () => {
      if (!input.files?.length) return resolve(null);
      const file = input.files[0];
      const text = await file.text();

      try {
        let parsed;
        if (file.name.endsWith(".yaml") || file.name.endsWith(".yml")) {
          parsed = YAML.parse(text);
        } else {
          parsed = JSON.parse(text);
        }

        if (!parsed.nodes || !parsed.edges) {
          alert("⚠ Invalid workflow file.");
          return resolve(null);
        }

        resolve({
          nodes: parsed.nodes,
          edges: parsed.edges,
        });
      } catch (err) {
        alert("❌ Failed to read file. Check format.");
        resolve(null);
      }
    };

    input.click();
  });
}

/* =======================================================
   🛠 File Download Helper
======================================================= */

function downloadFile(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}