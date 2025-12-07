export interface TechStackItem {
  component: string;
  technology: string;
  reasoning: string;
}

export interface AnalysisResult {
  mermaidCode: string;
  techStack: TechStackItem[];
  summary: string;
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
