// src/api/mockApi.ts

export interface AutomationDefinition {
    id: string;
    label: string;
    params: string[];
  }
  
  const automations: AutomationDefinition[] = [
    { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
    { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  ];
  
  export async function getAutomations(): Promise<AutomationDefinition[]> {
    await new Promise((res) => setTimeout(res, 200)); // simulate delay
    return automations;
  }
  
  export interface SimulateRequest {
    workflow: unknown;
  }
  
  export interface SimulateStep {
    id: string;
    message: string;
  }
  
  export interface SimulateResponse {
    steps: SimulateStep[];
    valid: boolean;
  }
  
  export async function simulateWorkflow(
    _payload: SimulateRequest,
  ): Promise<SimulateResponse> {
    await new Promise((res) => setTimeout(res, 300));
  
    return {
      valid: true,
      steps: [
        { id: '1', message: 'Start workflow' },
        { id: '2', message: 'Execute step 1' },
        { id: '3', message: 'Execute step 2' },
        { id: '4', message: 'End workflow' },
      ],
    };
  }