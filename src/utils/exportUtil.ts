// src/utils/exportUtil.ts
export function download(filename: string, content: string, type = "application/json") {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  export function exportJSON(nodes: any[], edges: any[]) {
    download("workflow.json", JSON.stringify({ nodes, edges }, null, 2), "application/json");
  }
  
  export function exportYAML(nodes: any[], edges: any[]) {
    // very small YAML conversion (for export only)
    const yamlize = (obj: any) => {
      const json = JSON.stringify(obj);
      // naive conversion using indentation — works for basic structures
      const yaml = json
        .replace(/":/g, '":')
        .replace(/^{\n?/, "")
        .replace(/}$/, "")
        .replace(/\n/g, "\n");
      return yaml;
    };
    download("workflow.yaml", yamlize({ nodes, edges }), "text/yaml");
  }
  
  export function importWorkflowFile(): Promise<{ nodes: any[]; edges: any[] } | null> {
    return new Promise((res) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json,.yaml,.yml";
      input.onchange = async () => {
        const f = input.files?.[0];
        if (!f) return res(null);
        const txt = await f.text();
        try {
          const parsed = JSON.parse(txt);
          if (parsed.nodes && parsed.edges) return res({ nodes: parsed.nodes, edges: parsed.edges });
          // fallback: try YAML-ish parse (very simple)
          alert("Imported file not recognized as JSON with nodes/edges.");
          return res(null);
        } catch {
          alert("Only JSON import is supported in this demo. Convert YAML to JSON and import.");
          return res(null);
        }
      };
      input.click();
    });
  }