export type TaskStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type AIProvider = 
  | 'GEMINI_FLASH' 
  | 'GPT_5' 
  | 'CLAUDE_SONNET' 
  | 'SAP_AI_CORE'
  | 'MULTI_AGENT_TEAM'
  | 'UNKNOWN';

export type RiskCategory = 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' | 'CRITICAL' | 'PII_PROTECTED';

export type AuditStatus = 'APPROVED' | 'FLAGGED_FOR_REVIEW' | 'FLAGGED_FOR_MANUAL_REVIEW' | 'COMPLIANT';

export interface TaskPayload {
  vendorId: string;
  invoiceAmount: number;
  poNumber?: string;
  pageCount?: number;
  containsPII: boolean;
  taskType?: string;
  fileName?: string;
  filePath?: string;
  [key: string]: any;
}

export interface TaskEntity {
  taskId: string;
  taskType: string;
  rawPayload: string;
  filePath?: string;
  finalDecision?: string;
  riskScore?: number;
  status: TaskStatus;
  createdAt: string;
}

export interface MultiAgentDossier {
  extractionAgent?: any;
  sapReconciliationAgent?: any;
  forensicAgent?: any;
  adjudicatorAgent?: any;
}

export interface AuditResultData {
  provider?: string;
  vendorId?: string;
  vendorName?: string;
  sapAccountStatus?: string;
  overallVendorRiskScore?: number;
  riskCategory?: RiskCategory;
  audit_status?: AuditStatus;
  keyFindings?: string[];
  counterfactualExplanation?: string;
  recommendedAction?: string;
  multiAgentDossier?: MultiAgentDossier;
  [key: string]: any;
}

export interface CachedTaskResult {
  status: TaskStatus;
  provider: AIProvider;
  taskType: string;
  finalDecision?: string;
  compositeRiskScore?: number;
  riskCategory?: RiskCategory;
  result: AuditResultData;
}

export interface ServiceHealth {
  status: 'UP' | 'DOWN' | 'UNKNOWN';
  components?: {
    db?: { status: string };
    rabbit?: { status: string };
    redis?: { status: string };
    [key: string]: any;
  };
}
