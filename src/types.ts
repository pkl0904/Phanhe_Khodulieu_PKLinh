export type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'connecting';

export interface SyncItem {
  id: string;
  name: string;
  status: 'success' | 'error' | 'paused' | 'cancelled';
  duration?: string;
  startTime?: string;
  endTime?: string;
  creator: string;
  errorDetail?: string;
}

export interface UserPermission {
  id: string;
  name: string;
  email: string;
  role: 'viewer' | 'editor';
  avatar?: string;
}

export interface SchemaCondition {
  id: string;
  type: string;
  errorMessage: string;
  conditionValues?: string[];
  dependentField?: string;
  dependentValues?: string[];
}

export interface SchemaField {
  id: string;
  name: string;
  isGreenFlow: boolean;
  isRequired: boolean;
  dataType: string;
  conditions: SchemaCondition[];
  children?: SchemaField[];
  isEditing?: boolean;
}

export interface DatabaseColumn {
  id: string;
  name: string;
  type: string;
  description: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
}

export interface DatabaseTable {
  id: string;
  name: string;
  description: string;
  columns: DatabaseColumn[];
  isApiPayload?: boolean;
}

export interface SchemaVersion {
  id: string;
  version: string;
  versionName?: string;
  createdAt: string;
  createdBy: string;
  description: string;
  tableCount: number;
  schema?: any[];
}

export interface SourceDatabase {
  id: string;
  name: string;
  code: string;
  dataType: 'category' | 'specialized';
  categoryType?: string;
  ministry: string;
  unit: string;
  creator: string;
  status: ConnectionStatus;
  lastUpdated: string;
  type: string;
  api?: string;
  tableCount: number;
  syncs: SyncItem[];
  whitelist: string[];
  permissions: UserPermission[];
  schema?: SchemaField[];
  schemaVersion?: string;
  schemaVersions?: SchemaVersion[];
  tags?: string[];
  isNormalizationEnabled?: boolean;
  isReconciliationEnabled?: boolean;
}

export interface EventLog {
  id: string;
  name: string;
  status: 'success' | 'failure' | 'error';
  reason?: string;
  changeDescription?: string;
  duration?: string;
  startTime?: string;
  endTime?: string;
  modifiedBy: string;
}

export type ReconciliationStatus = 'connection_error' | 'data_error' | 'success';
export type ExtractionStatus = 'success' | 'error';

export interface ExtractionRecord {
  id: string;
  time: string;
  sourceName: string;
  recordId: string;
  status: ExtractionStatus;
  ministry: string;
  unit: string;
  startTime: string;
  endTime: string;
  processingTime: string;
  payload?: string;
  response?: string;
  errorMessage?: string;
}

export interface ReconciliationRecord {
  id: string;
  time: string;
  sourceName: string;
  recordId: string;
  status: ReconciliationStatus;
  processingTime: string;
  startTime: string;
  endTime: string;
  waitTime: string;
  message?: string;
  retryCount?: number;
  maxRetry?: number;
  errorType?: string;
  unit?: string;
  ministry?: string;
  duration?: string;
  totalRecords?: number;
  validRecordsCount?: number;
  validRate?: string;
  formatErrors?: number;
  duplicates?: number;
  errorDetails?: {
    formatErrors?: {
      total: number;
      missingFields?: { fields: string[]; count: number }[];
      typeErrors?: { field: string; expected: string; actual: string; count: number }[];
    };
    duplicateErrors?: {
      total: number;
      keyField: string;
    };
    connectionError?: string;
  };
}
