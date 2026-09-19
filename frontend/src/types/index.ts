export type TaskStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type AIProvider = 
  | 'GEMINI_FLASH' 
  | 'GPT_5' 
  | 'CLAUDE_SONNET' 
  | 'SAP_AI_CORE'
  | 'UNKNOWN';

export type RiskCategory = 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' | 'CRITICAL' | 'PII_PROTECTED';

export type AuditStatus = 'APPROVED' | 'FLAGGED_FOR_REVIEW' | 'FLAGGED_FOR_MANUAL_REVIEW' | 'COMPLIANT';

export interface TaskPayload {
  vendorId: string;
  invoiceAmount: number;
  pageCount: number;
  containsPII: boolean;
  taskType?: string;
  [key: string]: any;
}

export interface TaskEntity {
  taskId: string;
  taskType: string;
  rawPayload: string;
  status: TaskStatus;
  createdAt: string;
}

export interface AuditResultData {
  provider?: string;
  vendorId?: string;
  sapAccountStatus?: string;
  overallVendorRiskScore?: number;
  riskCategory?: RiskCategory;
  audit_status?: AuditStatus;
  keyFindings?: string[];
  riskBreakdown?: {
    financialExposure?: string;
    complianceCheck?: string;
    fraudProbabilityScore?: string;
  };
  recommendedAction?: string;
  documentAnalysis?: {
    pageCountProcessed?: number;
    crossPageConsistency?: string;
    termsAndConditionsCheck?: string;
  };
  privacyEnforcement?: {
    piiRedacted?: boolean;
    dataRetentionPolicy?: string;
    gdprHipaaCompliant?: boolean;
  };
  [key: string]: any;
}

export interface CachedTaskResult {
  status: TaskStatus;
  provider: AIProvider;
  taskType: string;
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
