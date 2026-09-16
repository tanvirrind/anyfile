import { AppRoute, CategoryType, FileTypeInfo } from '../../types';
import { FileAnalysis } from '../analyzer/types';

export type FileHealthStatus = 'Healthy' | 'Warning' | 'Needs Attention' | 'Unknown';

export interface FileHealthSignal {
  id: string;
  name: string;
  passed: boolean;
  status: 'pass' | 'warn' | 'fail' | 'info';
  message: string;
}

export interface FileHealthAssessment {
  status: FileHealthStatus;
  badgeClass: string;
  summary: string;
  signals: FileHealthSignal[];
  technicalReason: string;
  disclaimer: string;
}

export interface HumanReadableDiagnostic {
  title: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  recommendedAction: string;
  actionRoute?: AppRoute;
  actionLabel?: string;
}

export interface ConversionTargetInfo {
  format: string; // e.g. "jpg"
  name: string; // e.g. "JPEG Image"
  mime: string;
  rationale: string;
  popularUseCases: string[];
  isRecommended?: boolean;
}

export interface SmartActionItem {
  id: string;
  category: 'convert' | 'optimize' | 'understand' | 'open' | 'analyze' | 'diagnose' | 'workflow';
  title: string;
  description: string;
  badge?: string;
  iconName: string;
  isPrimary?: boolean;
  route?: AppRoute;
  onClickAction?: string; // e.g. 'launch_workflow', 'compress_now', 'convert_to_jpg'
  payload?: any;
}

export interface SmartActionsResult {
  fileHealth: FileHealthAssessment;
  diagnostics: HumanReadableDiagnostic[];
  conversionTargets: ConversionTargetInfo[];
  recommendedWorkflows: Array<{
    id: string;
    title: string;
    description: string;
    stepNames: string[];
    steps: WorkflowStepConfig[];
  }>;
  actionGroups: {
    convert: SmartActionItem[];
    optimize: SmartActionItem[];
    understand: SmartActionItem[];
    open: SmartActionItem[];
    analyze: SmartActionItem[];
  };
}

export interface WorkflowStepConfig {
  type: 'analyze' | 'convert' | 'resize' | 'compress' | 'strip_metadata' | 'zip_package' | 'verify';
  targetFormat?: 'jpg' | 'png' | 'webp' | 'pdf';
  quality?: number; // 0-100
  targetWidth?: number;
  targetHeight?: number;
  lockRatio?: boolean;
  scalePercent?: number;
  mode?: 'contain' | 'cover' | 'exact';
  archiveName?: string;
}

export interface WorkflowStep {
  id: string;
  type: WorkflowStepConfig['type'];
  name: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'failed' | 'skipped';
  config: WorkflowStepConfig;
  resultBlob?: Blob;
  resultBlobUrl?: string;
  resultFileName?: string;
  resultSize?: number;
  metrics?: {
    originalSizeBytes?: number;
    outputSizeBytes?: number;
    savedBytes?: number;
    savedPercent?: number;
    width?: number;
    height?: number;
    durationMs?: number;
  };
  error?: string;
}

export interface FileWorkflow {
  id: string;
  name: string;
  sourceFile: File;
  sourceAnalysis?: FileAnalysis;
  steps: WorkflowStep[];
  status: 'draft' | 'running' | 'completed' | 'failed' | 'cancelled';
  currentStepIndex: number;
  finalOutput?: {
    blob: Blob;
    blobUrl: string;
    fileName: string;
    size: number;
    verification?: FileAnalysis;
  };
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface BatchFileItem {
  id: string;
  file: File;
  analysis?: FileAnalysis;
  groupKey: string; // e.g. "image-heic", "image-png", "document-pdf"
  status: 'pending' | 'processing' | 'completed' | 'failed';
  workflow?: FileWorkflow;
  outputBlob?: Blob;
  outputFileName?: string;
  error?: string;
}

export interface BatchGroup {
  groupKey: string;
  title: string;
  format: string;
  category: string;
  items: BatchFileItem[];
  supportedActions: Array<{
    id: string;
    title: string;
    description: string;
    iconName: string;
    steps: WorkflowStepConfig[];
  }>;
}

export interface WorkflowHistoryRecord {
  id: string;
  workflowTitle: string;
  fileName: string;
  sourceFormat: string;
  targetFormat?: string;
  originalSize: number;
  finalSize: number;
  stepsCount: number;
  status: 'completed' | 'failed';
  executedAt: string;
  durationMs: number;
}
