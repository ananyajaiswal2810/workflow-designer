Workflow Designer-
A visual workflow builder with drag-and-drop nodes, custom configuration panels, animated edges, live validation & simulation.

📌 Overview

Workflow Designer is a modern React application built using Vite + TypeScript + React Flow that allows users to visually create, edit, validate, and simulate workflows.

Users can:
	•	Drag & drop workflow steps
	•	Configure node properties
	•	Connect steps with animated edges
	•	Validate workflow structure
	•	Simulate execution step-by-step
	•	Auto-layout nodes
	•	Save, clear, and reload workflows

This project is suitable for HR workflows, automation flows, approval chains, or any rule-based process visualization.


🌟 Features

✅ 1. Drag & Drop Workflow Canvas
	•	React Flow–powered smooth node movement
	•	Custom nodes: Start, Task, Approval, Automated, End
	•	Animated edges with gradient flow
	•	Mini-map, grid background, zoom & pan

🎨 2. Custom Node Types (Fully Styled)

Each node has custom UI and metadata:
	•	Start Node → Green pill, workflow entry
	•	Task Node → Assignee + priority
	•	Approval Node → Approver role
	•	Automated Node → System action
	•	End Node → Red pill, workflow termination

⚙️ 3. Node Editing Sidebar

Update node properties live:
	•	Labels
	•	Assignee / Approver
	•	Actions
	•	Priorities
	•	Metadata fields

🧪 4. Workflow Simulation (Timeline View)
	•	Step-by-step execution with delays
	•	Highlights active nodes with animation
	•	Displays logs: info, warnings, errors
	•	Plays sounds for steps, transitions, errors
🛠 5. Workflow Validation

Ensures correct flow:
	•	Must have exactly one Start and one End
	•	No cycles
	•	No disconnected nodes
	•	Every node must have an outgoing edge (except End)

🗃 6. Local Storage Persistence
	•	Auto-loads saved workflow
	•	Manual Save & Clear buttons

🎉 7. Beautiful Modern UI
	•	Animated gradient page background
	•	Glowing canvas border
	•	White rounded UI buttons
	•	Smooth hover effects
	•	Theme-ready structure

🏗 Project Architecture

src/
│
├── components/
│   └── workflow/
│       ├── WorkflowBuilder.tsx      # Main container
│       ├── WorkflowCanvas.tsx       # React Flow canvas
│       ├── SimulationPanel.tsx      # Simulation + timeline
│       ├── NodeConfigPanel.tsx      # Edit node properties
│       ├── NodeSidebar.tsx          # Drag & drop node list
│       ├── nodes/
│       │   ├── StartNode.tsx
│       │   ├── TaskNode.tsx
│       │   ├── ApprovalNode.tsx
│       │   ├── AutomatedNode.tsx
│       │   └── EndNode.tsx
│
├── utils/
│   ├── autoLayout.ts                # Layout engine
│   ├── validateWorkflow.ts          # Validation logic
│   ├── soundPlayer.ts               # Node sound effects
│   ├── createNodeData.ts            # Node metadata creator
│   ├── storageManager.ts            # Save/load workflow
│   └── exportUtil.ts                # Export future support
│
├── api/
│   └── mockApi.ts                   # Mocked API responses
│
├── types/
│   └── workflow.ts                  # Node & edge typings
│
├── App.tsx
├── main.tsx
├── index.css                        # Global, theme-based CSS
└── README.md

🧩 Design Choices

🔹 React Flow as Canvas Engine

React Flow is the industry standard for:
	•	Node-based editors
	•	Workflow builders
	•	Automation pipelines

We selected it for:
	•	High performance
	•	Plugin-free custom nodes
	•	Built-in zoom, pan, edges, minimap
	•	Easy serialization (save workflow)

🎨 Modern UI / UX

The project follows:
	•	Clean white buttons for consistency
	•	Soft neumorphic card nodes
	•	Animated glowing canvas border
	•	Gradient animated background
	•	Visual cues during simulation (highlight pulses)

🛡 Validation-First Execution

We enforce correctness before simulation:
	•	No invalid workflows can run
	•	Users receive clear warnings + errors
	•	Prevents broken flows during testing

🔊 Audio-Enhanced Experience

Each action triggers a sound:
	•	Node placement
	•	Edge connection
	•	Simulation step
	•	Error tones
	•	Flow completion

This increases intuitiveness + delight.


🧪 Mock API (MSW or Custom Mock)

Used for:
	•	Fetching suggested node templates
	•	Simulating workflow submission
	•	Mimicking enterprise workflow systems

No backend required.


Assumptions:
	•	No authentication required
	•	Local storage is enough for persistence
	•	Workflows contain at least one Start and End
	•	Single outgoing edge per node is acceptable for demo
	•	Mock API simulates network requests but does not store workflows
	•	UI is tailored for HR/approval workflows but flexible enough for general use
  


