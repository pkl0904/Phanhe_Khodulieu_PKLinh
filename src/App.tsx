import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Database, 
  History, 
  Settings, 
  Bell, 
  HelpCircle, 
  ChevronRight, 
  ChevronDown,
  Plus, 
  Download, 
  RefreshCw, 
  MoreVertical, 
  Trash2, 
  ExternalLink,
  Search,
  ArrowLeft,
  Check,
  CheckCircle2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Link2Off,
  Loader2,
  Info,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  UserPlus,
  X,
  ChevronLeft,
  RotateCcw,
  Table,
  Clock,
  Upload,
  FileText,
  Edit2,
  Save,
  Power,
  CornerDownRight,
  Building,
  Globe,
  Cpu,
  Building2,
  Users,
  CheckSquare,
  BarChart3,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { SourceDatabase, ConnectionStatus, SyncItem, UserPermission, EventLog, ReconciliationRecord, ReconciliationStatus, ExtractionRecord, ExtractionStatus } from './types';

// --- Mock Data ---
const MOCK_SOURCES: SourceDatabase[] = [
  {
    id: '1',
    name: 'Thông tin về Mã số, mã vạch quốc gia',
    ministry: 'Bộ Khoa học và Công nghệ',
    unit: 'Cục Sở hữu trí tuệ',
    creator: 'Nguyễn Văn A',
    status: 'connected',
    lastUpdated: '2024-03-12 14:30',
    type: 'REST API',
    api: 'https://api.most.gov.vn/v1/barcode',
    tableCount: 4,
    whitelist: ['192.168.1.1', 'api.gov.vn'],
    permissions: [
      { id: 'u1', name: 'Nguyễn Văn A', email: 'a@gov.vn', role: 'editor', avatar: 'https://i.pravatar.cc/150?u=a' },
      { id: 'u2', name: 'Trần Thị B', email: 'b@gov.vn', role: 'viewer', avatar: 'https://i.pravatar.cc/150?u=b' },
    ],
    syncs: [
      { id: 's1', name: 'Sync Thông tin cơ bản', status: 'success', duration: '5m 20s', startTime: '2024-03-12 14:00', endTime: '2024-03-12 14:05', creator: 'Nguyễn Văn A' },
      { id: 's2', name: 'Sync Địa chỉ', status: 'error', creator: 'Nguyễn Văn A', errorDetail: 'Connection timeout at 192.168.1.1' },
    ],
    schema: [
      { id: '1', name: 'TrangThaiDuLieu', isGreenFlow: false, isRequired: false, dataType: 'Đối tượng (Object)', conditions: [], isEditing: false, children: [
        { id: '1-1', name: 'SuKien', isGreenFlow: false, isRequired: false, dataType: 'Chữ (String)', conditions: [], isEditing: false },
        { id: '1-2', name: 'LoaiSuKien', isGreenFlow: false, isRequired: false, dataType: 'Chữ (String)', conditions: [], isEditing: false },
      ]},
      { id: '2', name: 'MoTa', isGreenFlow: false, isRequired: false, dataType: 'Đối tượng (Object)', conditions: [], isEditing: false, children: [
        { id: '2-1', name: 'LyDoCapNhat', isGreenFlow: false, isRequired: false, dataType: 'Chữ (String)', conditions: [], isEditing: false },
        { id: '2-2', name: 'ChiTietLyDoCapNhat', isGreenFlow: false, isRequired: false, dataType: 'Chữ (String)', conditions: [], isEditing: false },
      ]},
      { id: '3', name: 'PhienBan', isGreenFlow: false, isRequired: false, dataType: 'Số nguyên 32-bit (Int32)', conditions: [], isEditing: false },
      { id: '4', name: 'NgayHieuLuc', isGreenFlow: false, isRequired: false, dataType: 'Chữ (String)', conditions: [], isEditing: false },
      { id: '5', name: 'DuLieuTiepNhan', isGreenFlow: false, isRequired: false, dataType: 'Đối tượng (Object)', conditions: [], isEditing: false, children: [
        { id: '5-1', name: 'IdBangGhi', isGreenFlow: false, isRequired: false, dataType: 'Chữ (String)', conditions: [], isEditing: false },
        { id: '5-2', name: 'SoDinhDanh', isGreenFlow: false, isRequired: false, dataType: 'Chữ (String)', conditions: [], isEditing: false },
        { id: '5-3', name: 'NgayCap', isGreenFlow: false, isRequired: false, dataType: 'Chữ (String)', conditions: [], isEditing: false },
      ]}
    ],
    schemaVersion: '1.2.4',
    schemaVersions: [
      { id: 'v1', version: '1.2.4', versionName: 'Phiên bản bổ sung thông tin tiếp nhận', createdAt: '2024-03-12 14:30', createdBy: 'Nguyễn Văn A', description: 'Cập nhật thêm trường DuLieuTiepNhan và các trường con IdBangGhi, SoDinhDanh để phục vụ việc trích rút dữ liệu định danh.', tableCount: 154 },
      { id: 'v2', version: '1.2.3', versionName: 'Cập nhật ràng buộc dữ liệu', createdAt: '2024-02-28 10:15', createdBy: 'Trần Thị B', description: 'Bổ sung các điều kiện ràng buộc (Conditions) cho trường PhienBan và NgayHieuLuc nhằm đảm bảo tính toàn vẹn dữ liệu.', tableCount: 153 },
    ],
    tags: ['Mã số mã vạch', 'Quan trọng'],
    isNormalizationEnabled: true,
    isReconciliationEnabled: true
  },
  {
    id: '2',
    name: 'Thông tin về Quy chuẩn kỹ thuật',
    ministry: 'Bộ Khoa học và Công nghệ',
    unit: 'Cục Sở hữu trí tuệ',
    creator: 'Trần Thị B',
    status: 'error',
    lastUpdated: '2024-03-11 09:15',
    type: 'REST API',
    api: 'https://api.most.gov.vn/v2/standards',
    tableCount: 89,
    whitelist: ['10.0.0.5'],
    permissions: [
      { id: 'u2', name: 'Trần Thị B', email: 'b@gov.vn', role: 'editor', avatar: 'https://i.pravatar.cc/150?u=b' },
    ],
    syncs: [
      { id: 's3', name: 'Sync Quy chuẩn', status: 'error', creator: 'Trần Thị B', errorDetail: 'Invalid credentials' },
    ],
    schema: [
      { id: '1', name: 'BusinessInfo', isGreenFlow: false, isRequired: true, dataType: 'Đối tượng (Object)', conditions: [], isEditing: false, children: [
        { id: '1-1', name: 'TaxCode', isGreenFlow: false, isRequired: true, dataType: 'Chữ (String)', conditions: [], isEditing: false },
        { id: '1-2', name: 'CompanyName', isGreenFlow: false, isRequired: true, dataType: 'Chữ (String)', conditions: [], isEditing: false },
      ]}
    ],
    schemaVersion: '2.0.1',
    schemaVersions: [
      { id: 'v2-1', version: '2.0.1', versionName: 'Cập nhật schema doanh nghiệp', createdAt: '2024-03-10 10:00', createdBy: 'Trần Thị B', description: 'Bổ sung các trường thông tin mã số thuế và tên công ty vào BusinessInfo.', tableCount: 89 },
    ],
    tags: ['Quy chuẩn']
  },
  {
    id: '3',
    name: 'Thông tin về Tiêu chuẩn quốc gia',
    ministry: 'Bộ Khoa học và Công nghệ',
    unit: 'Cục Sở hữu trí tuệ',
    creator: 'Lê Văn C',
    status: 'disconnected',
    lastUpdated: '2024-03-10 16:45',
    type: 'REST API',
    api: 'https://api.most.gov.vn/v1/national-standards',
    tableCount: 210,
    whitelist: [],
    permissions: [
      { id: 'u3', name: 'Lê Văn C', email: 'c@gov.vn', role: 'editor', avatar: 'https://i.pravatar.cc/150?u=c' },
    ],
    syncs: [
      { id: 's4', name: 'Sync Tiêu chuẩn', status: 'paused', creator: 'Lê Văn C' },
    ],
    schema: [
      { id: '1', name: 'IntellectualProperty', isGreenFlow: false, isRequired: true, dataType: 'Đối tượng (Object)', conditions: [], isEditing: false, children: [
        { id: '1-1', name: 'PatentID', isGreenFlow: false, isRequired: true, dataType: 'Chữ (String)', conditions: [], isEditing: false },
        { id: '1-2', name: 'OwnerName', isGreenFlow: false, isRequired: true, dataType: 'Chữ (String)', conditions: [], isEditing: false },
      ]}
    ],
    schemaVersion: '1.0.0',
    schemaVersions: [
      { id: 'v3-1', version: '1.0.0', versionName: 'Khởi tạo schema', createdAt: '2024-03-01 09:00', createdBy: 'Lê Văn C', description: 'Thiết lập cấu trúc IntellectualProperty ban đầu.', tableCount: 210 },
    ],
    tags: ['Tiêu chuẩn']
  },
  {
    id: '4',
    name: 'Thông tin chung về đơn xác lập quyền sở hữu trí tuệ',
    ministry: 'Bộ Khoa học và Công nghệ',
    unit: 'Ủy ban Tiêu chuẩn Đo lường Chất lượng Quốc gia',
    creator: 'Phạm Thị D',
    status: 'connected',
    lastUpdated: '2024-03-09 16:45',
    type: 'MySQL',
    api: 'https://api.tcvn.gov.vn/v1',
    tableCount: 120,
    whitelist: [],
    permissions: [
      { id: 'u4', name: 'Phạm Thị D', email: 'd@gov.vn', role: 'editor', avatar: 'https://i.pravatar.cc/150?u=d' },
    ],
    syncs: [],
    schema: [
      { id: '1', name: 'StandardInfo', isGreenFlow: false, isRequired: true, dataType: 'Đối tượng (Object)', conditions: [], isEditing: false, children: [
        { id: '1-1', name: 'StandardCode', isGreenFlow: false, isRequired: true, dataType: 'Chữ (String)', conditions: [], isEditing: false },
        { id: '1-2', name: 'MeasurementUnit', isGreenFlow: false, isRequired: true, dataType: 'Chữ (String)', conditions: [], isEditing: false },
      ]}
    ],
    schemaVersion: '1.1.0',
    schemaVersions: [
      { id: 'v4-1', version: '1.1.0', versionName: 'Cập nhật tiêu chuẩn mới', createdAt: '2024-03-05 15:30', createdBy: 'Phạm Thị D', description: 'Bổ sung các trường StandardCode và MeasurementUnit cho StandardInfo.', tableCount: 120 },
    ],
    tags: ['Tiêu chuẩn', 'Đo lường']
  }
];

const MOCK_EVENT_LOGS: EventLog[] = [
  { 
    id: 'l1', 
    name: 'Tạo dịch vụ trích rút dữ liệu', 
    status: 'success', 
    startTime: '2024-03-12 14:00', 
    modifiedBy: 'Nguyễn Văn A',
    changeDescription: 'Hệ thống khởi tạo dịch vụ "Thông tin về Tiêu chuẩn quốc gia" thành công với cấu hình mặc định.'
  },
  { 
    id: 'l2', 
    name: 'Sửa cấu hình thông tin dịch vụ trích rút dữ liệu', 
    status: 'success', 
    startTime: '2024-03-12 14:10', 
    modifiedBy: 'Nguyễn Văn A',
    changeDescription: 'Cập nhật API Endpoint từ v1 sang v2. Thay đổi đơn vị quản lý thành Cục Sở hữu trí tuệ.'
  },
  { 
    id: 'l3', 
    name: 'Sửa cấu hình dịch vụ đối soát', 
    status: 'failure', 
    reason: 'Dữ liệu không hợp lệ', 
    startTime: '2024-03-12 14:30', 
    modifiedBy: 'Nguyễn Văn A',
    changeDescription: 'Lỗi: Tiêu chí đối soát "Tổng bản ghi" không được để trống. Cấu hình không được lưu.'
  },
  { 
    id: 'l4', 
    name: 'Sửa cấu hình thông tin dịch vụ trích rút dữ liệu', 
    status: 'failure', 
    reason: 'Sai lệch dữ liệu đầu vào', 
    startTime: '2024-03-12 15:00', 
    modifiedBy: 'Hệ thống',
    changeDescription: 'Lỗi kết nối đến API nguồn trong quá trình xác thực cấu hình mới. Mã lỗi: 503 Service Unavailable.'
  },
  { 
    id: 'l5', 
    name: 'Sửa cấu hình tiêu chí kiểm tra chuẩn hóa dữ liệu', 
    status: 'success', 
    startTime: '2024-03-12 15:15', 
    modifiedBy: 'Hệ thống',
    changeDescription: 'Bổ sung 02 tiêu chí kiểm tra cho trường "StandardCode": Kiểm tra định dạng Regex và Kiểm tra độ dài tối thiểu.'
  },
  { 
    id: 'l6', 
    name: 'Kích hoạt dịch vụ trích rút dữ liệu', 
    status: 'success', 
    startTime: '2024-03-12 16:00', 
    modifiedBy: 'Trần Thị B',
    changeDescription: 'Dịch vụ đã được chuyển sang trạng thái "Đang hoạt động". Hệ thống bắt đầu lập lịch trích rút.'
  },
  { 
    id: 'l7', 
    name: 'Vô hiệu hóa dịch vụ trích rút dữ liệu', 
    status: 'success', 
    startTime: '2024-03-12 16:30', 
    modifiedBy: 'Trần Thị B',
    changeDescription: 'Dịch vụ đã được tạm dừng. Tất cả các tiến trình trích rút đang chạy đã được hủy bỏ an toàn.'
  },
  { 
    id: 'l8', 
    name: 'Bật dịch vụ kiểm tra dữ liệu', 
    status: 'success', 
    startTime: '2024-03-12 17:00', 
    modifiedBy: 'Nguyễn Văn A',
    changeDescription: 'Dịch vụ kiểm tra phục vụ chuẩn hóa dữ liệu đã được kích hoạt thành công.'
  },
  { 
    id: 'l9', 
    name: 'Tắt dịch vụ kiểm tra dữ liệu', 
    status: 'success', 
    startTime: '2024-03-12 17:15', 
    modifiedBy: 'Nguyễn Văn A',
    changeDescription: 'Dịch vụ kiểm tra phục vụ chuẩn hóa dữ liệu đã được vô hiệu hóa.'
  },
  { 
    id: 'l10', 
    name: 'Bật dịch vụ đối soát', 
    status: 'success', 
    startTime: '2024-03-12 17:30', 
    modifiedBy: 'Trần Thị B',
    changeDescription: 'Dịch vụ đối soát dữ liệu đã được kích hoạt thành công.'
  },
  { 
    id: 'l11', 
    name: 'Tắt dịch vụ đối soát', 
    status: 'success', 
    startTime: '2024-03-12 17:45', 
    modifiedBy: 'Trần Thị B',
    changeDescription: 'Dịch vụ đối soát dữ liệu đã được vô hiệu hóa.'
  },
  { 
    id: 'l12', 
    name: 'Tạo dịch vụ trích rút dữ liệu', 
    status: 'failure', 
    reason: 'Tên dịch vụ đã tồn tại', 
    startTime: '2024-03-12 18:00', 
    modifiedBy: 'Nguyễn Văn A',
    changeDescription: 'Không thể tạo dịch vụ mới do trùng tên với một dịch vụ hiện có trong hệ thống.'
  },
];

const HOURLY_TRAFFIC_DATA = [
  { time: '08:00', requests: 620 },
  { time: '09:00', requests: 930 },
  { time: '10:00', requests: 840 },
  { time: '11:00', requests: 580 },
  { time: '12:00', requests: 90 },
  { time: '13:00', requests: 140 },
  { time: '14:00', requests: 670 },
  { time: '15:00', requests: 890 },
  { time: '16:00', requests: 790 },
  { time: '17:00', requests: 640 },
  { time: '18:00', requests: 120 },
  { time: '19:00', requests: 60 },
  { time: '20:00', requests: 20 },
];

const SOURCE_SYNC_STATS = [
  { name: 'Thông tin về Tiêu chuẩn quốc gia', success: 5000, dataError: 500, connError: 100 },
  { name: 'Thông tin về Mã số, mã vạch quốc gia', success: 3500, dataError: 400, connError: 50 },
  { name: 'Thông tin về Quy chuẩn kỹ thuật', success: 2300, dataError: 300, connError: 20 },
  { name: 'Thông tin chung về đơn xác lập quyền sở hữu trí tuệ', success: 1000, dataError: 200, connError: 30 },
];

const PIE_DATA = [
  { name: 'Kích hoạt', value: 10, color: '#10b981' },
  { name: 'Vô hiệu hóa', value: 3, color: '#94a3b8' },
];

const MINISTRY_UNIT_MAPPING: Record<string, string[]> = {
  'Bộ Công an': ['Cục C06'],
  'Bộ Kế hoạch & Đầu tư': ['Cục Quản lý đăng ký kinh doanh'],
  'Bộ Khoa học và Công nghệ': ['Cục Sở hữu trí tuệ', 'Ủy ban Tiêu chuẩn Đo lường Chất lượng Quốc gia'],
  'Bộ Tài chính': ['Tổng cục Thuế', 'Tổng cục Hải quan'],
};

const MOCK_RECONCILIATION_RECORDS: ReconciliationRecord[] = [
  { 
    id: 'r1', 
    time: '14:32:01', 
    sourceName: 'Thông tin về Mã số, mã vạch quốc gia', 
    ministry: 'Bộ Khoa học và Công nghệ',
    unit: 'Cục Sở hữu trí tuệ',
    recordId: 'DN-00412', 
    status: 'data_error',
    processingTime: '72ms',
    startTime: '16-01-2026 19:06:00',
    endTime: '16-01-2026 19:06:00',
    waitTime: '0ms',
    duration: '1m 12s',
    totalRecords: 1,
    validRecordsCount: 0,
    validRate: '0%',
    formatErrors: 1,
    duplicates: 0,
    message: '- /DuLieuTiepNhan/HoVaTen:\n  + Không được để trống,\n- /DuLieuTiepNhan/SoDinhDanh:\n  + Không được để trống',
    errorType: 'Sai format — mst',
    errorDetails: {
      formatErrors: {
        total: 1,
        missingFields: [{ fields: ['HoVaTen', 'SoDinhDanh'], count: 1 }]
      }
    }
  },
  { 
    id: 'r2', 
    time: '14:31:48', 
    sourceName: 'Thông tin về Quy chuẩn kỹ thuật', 
    ministry: 'Bộ Khoa học và Công nghệ',
    unit: 'Cục Sở hữu trí tuệ',
    recordId: 'BH-19823', 
    status: 'connection_error',
    processingTime: '0ms',
    startTime: '16-01-2026 18:30:12',
    endTime: '16-01-2026 18:30:12',
    waitTime: '5000ms',
    duration: '5s',
    totalRecords: 1,
    validRecordsCount: 0,
    validRate: '0%',
    formatErrors: 0,
    duplicates: 0,
    message: 'Connection timeout at 192.168.1.1. Không thể thiết lập kết nối tới máy chủ nguồn dữ liệu.',
    retryCount: 1,
    maxRetry: 3,
    errorType: 'Timeout',
    errorDetails: {
      connectionError: 'Connection timeout at 192.168.1.1'
    }
  },
  { 
    id: 'r3', 
    time: '14:31:35', 
    sourceName: 'Thông tin chung về đơn xác lập quyền sở hữu trí tuệ', 
    ministry: 'Bộ Khoa học và Công nghệ',
    unit: 'Ủy ban Tiêu chuẩn Đo lường Chất lượng Quốc gia',
    recordId: 'TX-88203', 
    status: 'success',
    processingTime: '224ms',
    startTime: '16-01-2026 18:26:34',
    endTime: '16-01-2026 18:26:34',
    waitTime: '0ms',
    duration: '45s',
    totalRecords: 1,
    validRecordsCount: 1,
    validRate: '100%',
    formatErrors: 0,
    duplicates: 0,
    message: '-'
  },
  { 
    id: 'r4', 
    time: '14:31:22', 
    sourceName: 'Thông tin về Mã số, mã vạch quốc gia', 
    ministry: 'Bộ Khoa học và Công nghệ',
    unit: 'Cục Sở hữu trí tuệ',
    recordId: 'DN-00411', 
    status: 'data_error',
    processingTime: '45ms',
    startTime: '16-01-2026 18:20:10',
    endTime: '16-01-2026 18:20:10',
    waitTime: '0ms',
    duration: '58s',
    totalRecords: 1,
    validRecordsCount: 0,
    validRate: '0%',
    formatErrors: 1,
    duplicates: 0,
    message: '- /DuLieuTiepNhan/Email:\n  + Định dạng email không hợp lệ',
    errorType: 'Sai format — email',
    errorDetails: {
      formatErrors: {
        total: 1,
        typeErrors: [{ field: 'Email', expected: 'email', actual: 'string', count: 1 }]
      }
    }
  },
  { 
    id: 'r5', 
    time: '14:31:10', 
    sourceName: 'Thông tin chung về đơn xác lập quyền sở hữu trí tuệ', 
    ministry: 'Bộ Khoa học và Công nghệ',
    unit: 'Ủy ban Tiêu chuẩn Đo lường Chất lượng Quốc gia',
    recordId: 'TX-88202', 
    status: 'success',
    processingTime: '180ms',
    startTime: '16-01-2026 18:15:00',
    endTime: '16-01-2026 18:15:00',
    waitTime: '0ms',
    duration: '32s',
    totalRecords: 1,
    validRecordsCount: 1,
    validRate: '100%',
    formatErrors: 0,
    duplicates: 0
  },
  { 
    id: 'r6', 
    time: '14:30:58', 
    sourceName: 'Thông tin về Tiêu chuẩn quốc gia', 
    ministry: 'Bộ Khoa học và Công nghệ',
    unit: 'Cục Sở hữu trí tuệ',
    recordId: 'DC-55043', 
    status: 'success',
    processingTime: '310ms',
    startTime: '16-01-2026 18:10:00',
    endTime: '16-01-2026 18:10:00',
    waitTime: '0ms',
    duration: '1m 05s',
    totalRecords: 1,
    validRecordsCount: 1,
    validRate: '100%',
    formatErrors: 0,
    duplicates: 0
  },
  { 
    id: 'r7', 
    time: '14:30:44', 
    sourceName: 'Thông tin chung về đơn xác lập quyền sở hữu trí tuệ', 
    ministry: 'Bộ Khoa học và Công nghệ',
    unit: 'Ủy ban Tiêu chuẩn Đo lường Chất lượng Quốc gia',
    recordId: 'TX-88201', 
    status: 'success',
    processingTime: '150ms',
    startTime: '16-01-2026 18:05:00',
    endTime: '16-01-2026 18:05:00',
    waitTime: '0ms',
    duration: '28s',
    totalRecords: 1,
    validRecordsCount: 1,
    validRate: '100%',
    formatErrors: 0,
    duplicates: 0
  },
  { 
    id: 'r8', 
    time: '14:30:30', 
    sourceName: 'Thông tin về Tiêu chuẩn quốc gia', 
    ministry: 'Bộ Khoa học và Công nghệ',
    unit: 'Cục Sở hữu trí tuệ',
    recordId: 'DC-55042', 
    status: 'success',
    processingTime: '290ms',
    startTime: '16-01-2026 18:00:00',
    endTime: '16-01-2026 18:00:00',
    waitTime: '0ms',
    duration: '55s',
    totalRecords: 1,
    validRecordsCount: 1,
    validRate: '100%',
    formatErrors: 0,
    duplicates: 0
  },
  { 
    id: 'r9', 
    time: '14:30:11', 
    sourceName: 'Thông tin về Tiêu chuẩn quốc gia', 
    ministry: 'Bộ Khoa học và Công nghệ',
    unit: 'Cục Sở hữu trí tuệ',
    recordId: 'DC-55041', 
    status: 'data_error',
    processingTime: '60ms',
    startTime: '16-01-2026 17:55:00',
    endTime: '16-01-2026 17:55:00',
    waitTime: '0ms',
    duration: '1m 10s',
    totalRecords: 1,
    validRecordsCount: 0,
    validRate: '0%',
    formatErrors: 1,
    duplicates: 0,
    message: '- /DuLieuTiepNhan/BirthDate:\n  + Sai định dạng ngày sinh (yyyy-MM-dd)',
    retryCount: 2,
    maxRetry: 3,
    errorType: 'Sai format — birth...',
    errorDetails: {
      formatErrors: {
        total: 1,
        typeErrors: [{ field: 'BirthDate', expected: 'yyyy-MM-dd', actual: 'dd/MM/yyyy', count: 1 }]
      }
    }
  },
  { 
    id: 'r10', 
    time: '14:29:55', 
    sourceName: 'Thông tin về Quy chuẩn kỹ thuật', 
    ministry: 'Bộ Khoa học và Công nghệ',
    unit: 'Cục Sở hữu trí tuệ',
    recordId: 'BH-19820', 
    status: 'success',
    processingTime: '210ms',
    startTime: '16-01-2026 17:50:00',
    endTime: '16-01-2026 17:50:00',
    waitTime: '0ms',
    duration: '40s',
    totalRecords: 1,
    validRecordsCount: 1,
    validRate: '100%',
    formatErrors: 0,
    duplicates: 0
  }
];

const RECON_STATUS_DISPLAY = {
  connection_error: { label: 'Lỗi kết nối', color: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20' },
  data_error: { label: 'Lỗi dữ liệu', color: 'bg-red-500/10 text-red-600 border border-red-500/20' },
  success: { label: 'Thành công', color: 'bg-green-500/10 text-green-600 border border-green-500/20' },
};

const MOCK_EXTRACTION_RECORDS: ExtractionRecord[] = [
  {
    id: 'e1',
    time: '14:32:01',
    sourceName: 'Thông tin về Mã số, mã vạch quốc gia',
    ministry: 'Bộ Khoa học và Công nghệ',
    unit: 'Cục Sở hữu trí tuệ',
    recordId: 'DN-00412',
    status: 'success',
    startTime: '16-01-2026 19:06:00',
    endTime: '16-01-2026 19:06:01',
    processingTime: '120ms',
    payload: '{"barcode": "8931234567890"}',
    response: '{"status": "valid", "product": "Sữa tươi tiệt trùng"}'
  },
  {
    id: 'e2',
    time: '14:31:48',
    sourceName: 'Thông tin về Quy chuẩn kỹ thuật',
    ministry: 'Bộ Khoa học và Công nghệ',
    unit: 'Cục Sở hữu trí tuệ',
    recordId: 'BH-19823',
    status: 'error',
    startTime: '16-01-2026 18:30:12',
    endTime: '16-01-2026 18:30:15',
    processingTime: '3000ms',
    errorMessage: 'Connection timeout at 192.168.1.1'
  },
  {
    id: 'e3',
    time: '14:31:35',
    sourceName: 'Thông tin chung về đơn xác lập quyền sở hữu trí tuệ',
    ministry: 'Bộ Khoa học và Công nghệ',
    unit: 'Ủy ban Tiêu chuẩn Đo lường Chất lượng Quốc gia',
    recordId: 'TX-88203',
    status: 'success',
    startTime: '16-01-2026 18:26:34',
    endTime: '16-01-2026 18:26:35',
    processingTime: '450ms'
  }
];

const EXTRACTION_STATUS_DISPLAY = {
  success: { label: 'Thành công', color: 'bg-green-500/10 text-green-600 border border-green-500/20' },
  error: { label: 'Thất bại', color: 'bg-red-500/10 text-red-600 border border-red-500/20' },
};

const MOCK_RECONCILIATION_SUMMARY = [
  {
    unit: 'Cục Sở hữu Trí Tuệ',
    ministry: 'Bộ KH&CN',
    services: [
      { name: 'Thông tin về Mã số, mã vạch quốc gia', total: 435, success: 405, error: 30 },
      { name: 'Thông tin về Quy chuẩn kỹ thuật', total: 532, success: 513, error: 19 },
      { name: 'Thông tin về Tiêu chuẩn quốc gia', total: 342, success: 323, error: 19 },
    ]
  },
  {
    unit: 'Ủy ban Tiêu chuẩn Đo lường Chất lượng Quốc gia',
    ministry: 'Bộ KH&CN',
    services: [
      { name: 'Thông tin chung về đơn xác lập quyền sở hữu trí tuệ', total: 256, success: 240, error: 16 }
    ]
  }
];

const LOG_STATUS_DISPLAY: Record<string, { label: string, color: string }> = {
  success: { label: 'THÀNH CÔNG', color: 'bg-green-100 text-green-700' },
  failure: { label: 'THẤT BẠI', color: 'bg-red-100 text-red-700' },
  error: { label: 'LỖI', color: 'bg-amber-100 text-amber-700' }
};

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick, 
  collapsed, 
  subItems, 
  isOpen, 
  onToggle 
}: { 
  icon: any, 
  label: string, 
  active?: boolean, 
  onClick?: () => void, 
  collapsed?: boolean,
  subItems?: { label: string, active: boolean, onClick: () => void }[],
  isOpen?: boolean,
  onToggle?: () => void
}) => {
  const hasSubItems = subItems && subItems.length > 0;

  return (
    <div className="mb-1">
      <button 
        onClick={hasSubItems ? onToggle : onClick}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all rounded-lg relative group",
          active && !hasSubItems
            ? "bg-blue-700 text-white shadow-sm" 
            : "text-blue-100 hover:bg-blue-800/50 hover:text-white",
          collapsed && "justify-center px-0"
        )}
        title={collapsed ? label : undefined}
      >
        <Icon size={18} className={cn("shrink-0", active || isOpen ? "text-white" : "text-blue-300 group-hover:text-white")} />
        {!collapsed && <span className="truncate flex-1 text-left">{label}</span>}
        {!collapsed && hasSubItems && (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} className="text-blue-400" />
          </motion.div>
        )}
        {active && collapsed && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-l-full" />}
      </button>

      {!collapsed && hasSubItems && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden ml-4 mt-1 space-y-1 border-l border-blue-800/50 pl-2"
            >
              {subItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.onClick}
                  className={cn(
                    "w-full text-left px-4 py-2 text-xs font-medium rounded-lg transition-all",
                    item.active 
                      ? "bg-blue-800 text-white" 
                      : "text-blue-200 hover:text-white hover:bg-blue-800/30"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const MultiSelectFilter = ({ 
  label, 
  options, 
  selectedValues, 
  onChange,
  placeholder = "Tất cả"
}: { 
  label: string, 
  options: { label: string, value: string }[], 
  selectedValues: string[], 
  onChange: (values: string[]) => void,
  placeholder?: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const isAllSelected = options.length > 0 && selectedValues.length === options.length;

  const toggleAll = () => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange(options?.map(o => o.value) || []);
    }
  };

  const displayText = selectedValues.length === 0 
    ? placeholder 
    : selectedValues.length === options?.length 
      ? "Tất cả"
      : selectedValues.map(v => options?.find(o => o.value === v)?.label).filter(Boolean).join(', ');

  return (
    <div className="space-y-1.5 relative">
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</label>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm border border-gray-200 rounded-lg p-2 bg-white hover:border-blue-400 transition-all text-left"
      >
        <span className="truncate pr-2 text-gray-700">
          {displayText}
        </span>
        <ChevronDown size={14} className={cn("text-gray-400 transition-transform shrink-0", isOpen && "rotate-180")} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-xl z-[70] p-2 max-h-48 overflow-y-auto custom-scrollbar"
            >
              <div className="space-y-1">
                {/* "Tất cả" Option */}
                <label className="flex items-center gap-2 cursor-pointer group p-1.5 hover:bg-gray-50 rounded-md transition-colors border-b border-gray-50 mb-1">
                  <div 
                    onClick={(e) => { e.stopPropagation(); toggleAll(); }}
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0",
                      isAllSelected 
                        ? "bg-blue-600 border-blue-600 text-white" 
                        : "border-gray-300 bg-white group-hover:border-blue-400"
                    )}
                  >
                    {isAllSelected && <Check size={10} strokeWidth={4} />}
                  </div>
                  <span className="text-xs font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Tất cả</span>
                </label>

                {options?.map(option => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer group p-1.5 hover:bg-gray-50 rounded-md transition-colors">
                    <div 
                      onClick={(e) => { e.stopPropagation(); toggleOption(option.value); }}
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0",
                        selectedValues.includes(option.value) 
                          ? "bg-blue-600 border-blue-600 text-white" 
                          : "border-gray-300 bg-white group-hover:border-blue-400"
                      )}
                    >
                      {selectedValues.includes(option.value) && <Check size={10} strokeWidth={4} />}
                    </div>
                    <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors truncate">{option.label}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const TagInput = ({ values, onChange, placeholder }: { values: string[], onChange: (newValues: string[]) => void, placeholder?: string }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!values.includes(inputValue.trim())) {
        onChange([...values, inputValue.trim()]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-1 bg-white border border-gray-200 rounded min-h-[30px] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
      {values?.map((val, idx) => (
        <span key={idx} className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] border border-gray-200">
          {val}
          <button onClick={() => removeTag(idx)} className="hover:text-red-500">
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={values.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[40px] bg-transparent border-none focus:ring-0 p-0 text-xs"
      />
    </div>
  );
};

const Switch = ({ enabled, onChange }: { enabled: boolean, onChange: () => void }) => (
  <button 
    onClick={(e) => {
      e.stopPropagation();
      onChange();
    }}
    className={cn(
      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
      enabled ? "bg-blue-600" : "bg-gray-200"
    )}
  >
    <span
      className={cn(
        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
        enabled ? "translate-x-6" : "translate-x-1"
      )}
    />
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'sources' | 'reconciliation' | 'extraction' | 'reconciliation_summary'>('overview');
  const [view, setView] = useState<'list' | 'detail' | 'wizard'>('list');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>(['data_warehouse']);

  const toggleMenu = (menuId: string) => {
    setOpenMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId) 
        : [...prev, menuId]
    );
  };
  const [selectedSource, setSelectedSource] = useState<SourceDatabase | null>(null);
  const [wizardStep, setWizardStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionResult, setConnectionResult] = useState<'success' | 'error' | null>(null);
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);
  const [isEditRestrictedOpen, setIsEditRestrictedOpen] = useState(false);
  const [isSaveInfoConfirmOpen, setIsSaveInfoConfirmOpen] = useState(false);
  const [isNormalizationConfirmOpen, setIsNormalizationConfirmOpen] = useState(false);
  const [isReconciliationConfirmOpen, setIsReconciliationConfirmOpen] = useState(false);
  const [dashboardTimeRange, setDashboardTimeRange] = useState<'today' | 'week' | 'month' | 'custom'>('today');
  const [dashboardCustomRange, setDashboardCustomRange] = useState({ start: '', end: '' });
  const [notification, setNotification] = useState<{ message: string; visible: boolean } | null>(null);

  const showNotification = (message: string) => {
    setNotification({ message, visible: true });
    setTimeout(() => {
      setNotification(prev => prev ? { ...prev, visible: false } : null);
    }, 3000);
  };

  const toggleSourceStatus = () => {
    if (!selectedSource) return;
    const newStatus = selectedSource.status === 'connected' ? 'disconnected' : 'connected';
    setSelectedSource({ ...selectedSource, status: newStatus });
  };

  const toggleNormalization = () => {
    if (!selectedSource) return;
    setSelectedSource({ 
      ...selectedSource, 
      isNormalizationEnabled: !selectedSource.isNormalizationEnabled 
    });
    showNotification(`Dịch vụ kiểm tra chuẩn hóa đã được ${!selectedSource.isNormalizationEnabled ? 'bật' : 'tắt'}.`);
  };

  const toggleReconciliation = () => {
    if (!selectedSource) return;
    setSelectedSource({ 
      ...selectedSource, 
      isReconciliationEnabled: !selectedSource.isReconciliationEnabled 
    });
    showNotification(`Dịch vụ đối soát đã được ${!selectedSource.isReconciliationEnabled ? 'bật' : 'tắt'}.`);
  };
  
  // List State
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    ministries: [] as string[],
    units: [] as string[],
    creators: [] as string[],
    statuses: [] as string[],
    tags: [] as string[],
    dateRange: { start: '', end: '' }
  });
  const [tempFilters, setTempFilters] = useState(filters);
  const [sortConfig, setSortConfig] = useState<{ key: keyof SourceDatabase, direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Detail State
  const [detailTab, setDetailTab] = useState<'overview' | 'edit' | 'logs' | 'versions'>('overview');
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [logCurrentPage, setLogCurrentPage] = useState(1);
  const [logSortConfig, setLogSortConfig] = useState<{ key: keyof EventLog, direction: 'asc' | 'desc' } | null>(null);
  const [selectedLog, setSelectedLog] = useState<EventLog | null>(null);
  const [isLogDetailOpen, setIsLogDetailOpen] = useState(false);
  const [selectedVersionSnapshot, setSelectedVersionSnapshot] = useState<any | null>(null);
  const [logFilters, setLogFilters] = useState({
    statuses: [] as string[],
    creators: [] as string[],
    dateRange: { start: '', end: '' }
  });
  const [versionFilters, setVersionFilters] = useState({
    creators: [] as string[],
    dateRange: { start: '', end: '' }
  });
  const [versionSearchQuery, setVersionSearchQuery] = useState('');
  const [versionCurrentPage, setVersionCurrentPage] = useState(1);
  const [isVersionFilterOpen, setIsVersionFilterOpen] = useState(false);
  const [tempVersionFilters, setTempVersionFilters] = useState(versionFilters);
  const [tempLogFilters, setTempLogFilters] = useState(logFilters);
  const [activeReconMenu, setActiveReconMenu] = useState<string | null>(null);
  const [activeDetailReconMenu, setActiveDetailReconMenu] = useState<string | null>(null);

  const RECON_MASTER_OPTIONS = {
    quantity: [
      { id: 'q1', label: 'Tổng bản ghi đã nhận' },
      { id: 'q2', label: 'Số bản ghi thành công' },
      { id: 'q3', label: 'Số bản ghi thất bại' }
    ]
  };

  // Wizard State
  const [reconCategories, setReconCategories] = useState([
    {
      id: 'quantity',
      title: 'Đối soát số lượng',
      options: [
        { id: 'q1', label: 'Tổng bản ghi đã nhận', enabled: true },
        { id: 'q2', label: 'Số bản ghi thành công', enabled: true },
        { id: 'q3', label: 'Số bản ghi thất bại', enabled: true }
      ]
    }
  ]);

  const [detailReconCategories, setDetailReconCategories] = useState([
    {
      id: 'quantity',
      title: 'Đối soát số lượng',
      options: [
        { id: 'q1', label: 'Tổng bản ghi đã nhận', enabled: true },
        { id: 'q2', label: 'Số bản ghi thành công', enabled: true },
        { id: 'q3', label: 'Số bản ghi thất bại', enabled: true }
      ]
    }
  ]);

  const addReconOption = (categoryId: string, option: { id: string, label: string }) => {
    setReconCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, options: [...cat.options, { ...option, enabled: true }] }
        : cat
    ));
    setActiveReconMenu(null);
  };

  const removeReconOption = (categoryId: string, optionId: string) => {
    setReconCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, options: cat.options.filter(opt => opt.id !== optionId) }
        : cat
    ));
  };

  const updateReconOption = (categoryId: string, optionId: string, updates: Partial<{ label: string, enabled: boolean }>) => {
    setReconCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, options: cat.options.map(opt => opt.id === optionId ? { ...opt, ...updates } : opt) }
        : cat
    ));
  };

  const addDetailReconOption = (categoryId: string, option: { id: string, label: string }) => {
    setDetailReconCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, options: [...cat.options, { ...option, enabled: true }] }
        : cat
    ));
    setActiveDetailReconMenu(null);
  };

  const removeDetailReconOption = (categoryId: string, optionId: string) => {
    setDetailReconCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, options: cat.options.filter(opt => opt.id !== optionId) }
        : cat
    ));
  };

  const updateDetailReconOption = (categoryId: string, optionId: string, updates: Partial<{ label: string, enabled: boolean }>) => {
    setDetailReconCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, options: cat.options.map(opt => opt.id === optionId ? { ...opt, ...updates } : opt) }
        : cat
    ));
  };

  const [newSource, setNewSource] = useState({
    name: '',
    ministry: '',
    unit: '',
    api: '',
    secret: '',
    token: '',
    whitelist: [] as string[],
    tags: [] as string[]
  });

  const [sampleType, setSampleType] = useState<'XML' | 'CSV'>('XML');
  const [sampleContent, setSampleContent] = useState('');
  const [detectedSchema, setDetectedSchema] = useState<any[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [deleteConditionConfirm, setDeleteConditionConfirm] = useState<{ fieldId: string, conditionId: string } | null>(null);
  const [deleteFieldConfirm, setDeleteFieldConfirm] = useState<string | null>(null);
  const [isEditingSchema, setIsEditingSchema] = useState(false);
  const [editingSchema, setEditingSchema] = useState<any[]>([]);
  const [isSaveAsNewVersionModalOpen, setIsSaveAsNewVersionModalOpen] = useState(false);
  const [newVersionInfo, setNewVersionInfo] = useState({ name: '', description: '' });

  const removeField = (fieldId: string) => {
    const targetSchema = isEditingSchema ? editingSchema : detectedSchema;
    const setSchema = isEditingSchema ? setEditingSchema : setDetectedSchema;

    setSchema(prev => {
      const updateField = (fields: any[]): any[] => {
        return fields.filter(f => f.id !== fieldId).map(f => {
          if (f.children) {
            return { ...f, children: updateField(f.children) };
          }
          return f;
        });
      };
      return updateField(prev);
    });
  };

  const addCondition = (fieldId: string) => {
    const setSchema = isEditingSchema ? setEditingSchema : setDetectedSchema;
    setSchema(prev => {
      const updateField = (fields: any[]): any[] => {
        return fields.map(f => {
          if (f.id === fieldId) {
            return {
              ...f,
              conditions: [
                ...(f.conditions || []),
                { id: Math.random().toString(36).substr(2, 9), type: 'Loại con duy nhất', errorMessage: '', conditionValues: [] as string[], dependentField: '', dependentValues: [] as string[] }
              ]
            };
          }
          if (f.children) {
            return { ...f, children: updateField(f.children) };
          }
          return f;
        });
      };
      return updateField(prev);
    });
  };

  const removeCondition = (fieldId: string, conditionId: string) => {
    const setSchema = isEditingSchema ? setEditingSchema : setDetectedSchema;
    setSchema(prev => {
      const updateField = (fields: any[]): any[] => {
        return fields.map(f => {
          if (f.id === fieldId) {
            return {
              ...f,
              conditions: (f.conditions || []).filter((c: any) => c.id !== conditionId)
            };
          }
          if (f.children) {
            return { ...f, children: updateField(f.children) };
          }
          return f;
        });
      };
      return updateField(prev);
    });
  };

  const updateCondition = (fieldId: string, conditionId: string, updates: any) => {
    const setSchema = isEditingSchema ? setEditingSchema : setDetectedSchema;
    setSchema(prev => {
      const updateField = (fields: any[]): any[] => {
        return fields.map(f => {
          if (f.id === fieldId) {
            return {
              ...f,
              conditions: (f.conditions || []).map((c: any) => c.id === conditionId ? { ...c, ...updates } : c)
            };
          }
          if (f.children) {
            return { ...f, children: updateField(f.children) };
          }
          return f;
        });
      };
      return updateField(prev);
    });
  };

  const toggleRequired = (fieldId: string) => {
    const setSchema = isEditingSchema ? setEditingSchema : setDetectedSchema;
    setSchema(prev => {
      const updateField = (fields: any[]): any[] => {
        return fields.map(f => {
          if (f.id === fieldId) {
            return { ...f, isRequired: !f.isRequired };
          }
          if (f.children) {
            return { ...f, children: updateField(f.children) };
          }
          return f;
        });
      };
      return updateField(prev);
    });
  };

  const updateFieldType = (fieldId: string, newType: string) => {
    const setSchema = isEditingSchema ? setEditingSchema : setDetectedSchema;
    setSchema(prev => {
      const updateField = (fields: any[]): any[] => {
        return fields.map(f => {
          if (f.id === fieldId) {
            return { ...f, dataType: newType };
          }
          if (f.children) {
            return { ...f, children: updateField(f.children) };
          }
          return f;
        });
      };
      return updateField(prev);
    });
  };

  const handleDetectSchema = () => {
    setIsDetecting(true);
    setTimeout(() => {
      if (sampleType === 'XML') {
        setDetectedSchema([
          { id: '1', name: 'TrangThaiDuLieu', isGreenFlow: false, isRequired: false, dataType: 'Đối tượng (Object)', conditions: [], isEditing: false, children: [
            { id: '1-1', name: 'SuKien', isGreenFlow: false, isRequired: false, dataType: 'Chữ (String)', conditions: [], isEditing: false },
            { id: '1-2', name: 'LoaiSuKien', isGreenFlow: false, isRequired: false, dataType: 'Chữ (String)', conditions: [], isEditing: false },
          ]},
          { id: '2', name: 'MoTa', isGreenFlow: false, isRequired: false, dataType: 'Đối tượng (Object)', conditions: [], isEditing: false, children: [
            { id: '2-1', name: 'LyDoCapNhat', isGreenFlow: false, isRequired: false, dataType: 'Chữ (String)', conditions: [], isEditing: false },
            { id: '2-2', name: 'ChiTietLyDoCapNhat', isGreenFlow: false, isRequired: false, dataType: 'Chữ (String)', conditions: [], isEditing: false },
          ]},
          { id: '3', name: 'PhienBan', isGreenFlow: false, isRequired: false, dataType: 'Số nguyên 32-bit (Int32)', conditions: [], isEditing: false },
          { id: '4', name: 'NgayHieuLuc', isGreenFlow: false, isRequired: false, dataType: 'Chữ (String)', conditions: [], isEditing: false },
          { id: '5', name: 'DuLieuTiepNhan', isGreenFlow: false, isRequired: false, dataType: 'Đối tượng (Object)', conditions: [], isEditing: false, children: [
            { id: '5-1', name: 'IdBangGhi', isGreenFlow: false, isRequired: false, dataType: 'Chữ (String)', conditions: [], isEditing: false },
            { id: '5-2', name: 'SoDinhDanh', isGreenFlow: false, isRequired: false, dataType: 'Chữ (String)', conditions: [], isEditing: false },
            { id: '5-3', name: 'NgayCap', isGreenFlow: false, isRequired: false, dataType: 'Chữ (String)', conditions: [], isEditing: false },
          ]}
        ]);
      } else {
        setDetectedSchema([
          { id: '1', name: 'ID', isGreenFlow: true, isRequired: true, dataType: 'Chữ (String)', conditions: [], isEditing: false },
          { id: '2', name: 'Name', isGreenFlow: false, isRequired: true, dataType: 'Chữ (String)', conditions: [], isEditing: false },
          { id: '3', name: 'Age', isGreenFlow: false, isRequired: false, dataType: 'Số nguyên 32-bit (Int32)', conditions: [], isEditing: false },
        ]);
      }
      setIsDetecting(false);
    }, 1500);
  };

  // Reconciliation State
  const [reconView, setReconView] = useState<'list' | 'detail'>('list');
  const [selectedRecon, setSelectedRecon] = useState<ReconciliationRecord | null>(null);
  const [isReconDetailOpen, setIsReconDetailOpen] = useState(false);
  const [reconSearchQuery, setReconSearchQuery] = useState('');
  const [isReconFilterOpen, setIsReconFilterOpen] = useState(false);
  const [reconFilters, setReconFilters] = useState({
    sources: [] as string[],
    ministries: [] as string[],
    units: [] as string[],
    statuses: [] as string[],
    dateRange: { start: '', end: '' }
  });
  const [tempReconFilters, setTempReconFilters] = useState(reconFilters);
  const [reconSortConfig, setReconSortConfig] = useState<{ key: keyof ReconciliationRecord, direction: 'asc' | 'desc' } | null>(null);
  const [reconCurrentPage, setReconCurrentPage] = useState(1);

  // Reconciliation Summary State
  const [reconSummarySearchQuery, setReconSummarySearchQuery] = useState('');
  const [isReconSummaryFilterOpen, setIsReconSummaryFilterOpen] = useState(false);
  const [reconSummaryFilters, setReconSummaryFilters] = useState({
    ministries: [] as string[],
    units: [] as string[],
    dateRange: { start: '', end: '' }
  });
  const [tempReconSummaryFilters, setTempReconSummaryFilters] = useState(reconSummaryFilters);

  // Extraction State
  const [selectedExtraction, setSelectedExtraction] = useState<ExtractionRecord | null>(null);
  const [isExtractionDetailOpen, setIsExtractionDetailOpen] = useState(false);
  const [extractionSearchQuery, setExtractionSearchQuery] = useState('');
  const [isExtractionFilterOpen, setIsExtractionFilterOpen] = useState(false);
  const [extractionFilters, setExtractionFilters] = useState({
    sources: [] as string[],
    ministries: [] as string[],
    units: [] as string[],
    statuses: [] as string[],
    dateRange: { start: '', end: '' }
  });
  const [tempExtractionFilters, setTempExtractionFilters] = useState(extractionFilters);
  const [extractionSortConfig, setExtractionSortConfig] = useState<{ key: keyof ExtractionRecord, direction: 'asc' | 'desc' } | null>(null);
  const [extractionCurrentPage, setExtractionCurrentPage] = useState(1);

  const filteredExtractionRecords = MOCK_EXTRACTION_RECORDS
    .filter(r => r.recordId.toLowerCase().includes(extractionSearchQuery.toLowerCase()) || r.sourceName.toLowerCase().includes(extractionSearchQuery.toLowerCase()))
    .filter(r => extractionFilters.sources.length === 0 || extractionFilters.sources.includes(r.sourceName))
    .filter(r => extractionFilters.ministries.length === 0 || extractionFilters.ministries.includes(r.ministry))
    .filter(r => extractionFilters.units.length === 0 || extractionFilters.units.includes(r.unit))
    .filter(r => extractionFilters.statuses.length === 0 || extractionFilters.statuses.includes(r.status))
    .filter(r => {
      if (!extractionFilters.dateRange.start && !extractionFilters.dateRange.end) return true;
      const recordDate = new Date(r.time.split(' ')[0]); // Assuming format "YYYY-MM-DD HH:mm"
      const start = extractionFilters.dateRange.start ? new Date(extractionFilters.dateRange.start) : null;
      const end = extractionFilters.dateRange.end ? new Date(extractionFilters.dateRange.end) : null;
      
      if (start && recordDate < start) return false;
      if (end && recordDate > end) return false;
      return true;
    })
    .sort((a, b) => {
      if (!extractionSortConfig) return 0;
      const { key, direction } = extractionSortConfig;
      const aValue = a[key as keyof ExtractionRecord];
      const bValue = b[key as keyof ExtractionRecord];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      if (aValue! < bValue!) return direction === 'asc' ? -1 : 1;
      if (aValue! > bValue!) return direction === 'asc' ? 1 : -1;
      return 0;
    });

  const extractionStats = {
    total: filteredExtractionRecords.length,
    success: filteredExtractionRecords.filter(r => r.status === 'success').length,
    error: filteredExtractionRecords.filter(r => r.status === 'error').length,
    avgProcessingTime: filteredExtractionRecords.length > 0 
      ? Math.round(filteredExtractionRecords.reduce((acc, r) => acc + parseInt(r.processingTime), 0) / filteredExtractionRecords.length)
      : 0
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sourceToDelete, setSourceToDelete] = useState<SourceDatabase | null>(null);

  const filteredReconciliationRecords = MOCK_RECONCILIATION_RECORDS
    .filter(r => r.recordId.toLowerCase().includes(reconSearchQuery.toLowerCase()) || r.sourceName.toLowerCase().includes(reconSearchQuery.toLowerCase()))
    .filter(r => reconFilters.sources.length === 0 || reconFilters.sources.includes(r.sourceName))
    .filter(r => reconFilters.ministries.length === 0 || (r.ministry && reconFilters.ministries.includes(r.ministry)))
    .filter(r => reconFilters.units.length === 0 || (r.unit && reconFilters.units.includes(r.unit)))
    .filter(r => reconFilters.statuses.length === 0 || reconFilters.statuses.includes(r.status))
    .sort((a, b) => {
      if (!reconSortConfig) return 0;
      const { key, direction } = reconSortConfig;
      const aValue = a[key as keyof ReconciliationRecord];
      const bValue = b[key as keyof ReconciliationRecord];
      
      if (aValue === undefined || aValue === null) return direction === 'asc' ? -1 : 1;
      if (bValue === undefined || bValue === null) return direction === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

  const reconStats = {
    total: filteredReconciliationRecords.length,
    databases: new Set(filteredReconciliationRecords.map(r => r.sourceName)).size,
    success: filteredReconciliationRecords.filter(r => r.status === 'success').length,
    dataError: filteredReconciliationRecords.filter(r => r.status === 'data_error').length,
    connectionError: filteredReconciliationRecords.filter(r => r.status === 'connection_error').length,
    avgProcessingTime: filteredReconciliationRecords.length > 0 
      ? (filteredReconciliationRecords.reduce((acc, r) => acc + parseInt(r.processingTime || '0'), 0) / filteredReconciliationRecords.length).toFixed(0) 
      : '0',
  };

  const reconStatsPerc = {
    success: reconStats.total > 0 ? ((reconStats.success / reconStats.total) * 100).toFixed(1) : '0',
    dataError: reconStats.total > 0 ? ((reconStats.dataError / reconStats.total) * 100).toFixed(1) : '0',
    connectionError: reconStats.total > 0 ? ((reconStats.connectionError / reconStats.total) * 100).toFixed(1) : '0',
  };

  const handleLogSort = (key: keyof EventLog) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (logSortConfig && logSortConfig.key === key && logSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setLogSortConfig({ key, direction });
  };

  const handleReconSort = (key: keyof ReconciliationRecord) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (reconSortConfig && reconSortConfig.key === key && reconSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setReconSortConfig({ key, direction });
  };

  const handleSourceClick = (source: SourceDatabase) => {
    setSelectedSource(source);
    setView('detail');
    setDetailTab('overview');
    setDetailReconCategories([
      {
        id: 'quantity',
        title: 'Đối soát số lượng',
        options: [
          { id: 'q1', label: 'Tổng bản ghi đã nhận', enabled: true },
          { id: 'q2', label: 'Số bản ghi thành công', enabled: true },
          { id: 'q3', label: 'Số bản ghi thất bại', enabled: true }
        ]
      }
    ]);
  };

  const handleSort = (key: keyof SourceDatabase) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleRefresh = () => {
    setSearchQuery('');
    const resetFilters = {
      ministries: [],
      units: [],
      creators: [],
      statuses: [],
      tags: [],
      dateRange: { start: '', end: '' }
    };
    setFilters(resetFilters);
    setTempFilters(resetFilters);
    setSortConfig(null);
    setCurrentPage(1);
  };

  const handleDownload = (data: any[], filename: string) => {
    // Simulate Excel download by creating a CSV blob
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadXML = (record: ReconciliationRecord) => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<ReconciliationRecord>
  <Id>${record.id}</Id>
  <RecordId>${record.recordId}</RecordId>
  <SourceName>${record.sourceName}</SourceName>
  <Unit>${record.unit}</Unit>
  <Time>${record.time}</Time>
  <Status>${record.status}</Status>
  <ProcessingTime>${record.processingTime}</ProcessingTime>
  <StartTime>${record.startTime}</StartTime>
  <EndTime>${record.endTime}</EndTime>
  <WaitTime>${record.waitTime}</WaitTime>
  <Message>${record.message || ''}</Message>
</ReconciliationRecord>`;
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `record-${record.recordId}.xml`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredSources = MOCK_SOURCES
    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(s => filters.ministries.length === 0 || filters.ministries.includes(s.ministry))
    .filter(s => filters.units.length === 0 || filters.units.includes(s.unit))
    .filter(s => filters.creators.length === 0 || filters.creators.includes(s.creator))
    .filter(s => filters.statuses.length === 0 || filters.statuses.includes(s.status))
    .filter(s => filters.tags.length === 0 || s.tags?.some(tag => filters.tags.includes(tag)))
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

  const activeFiltersCount = Object.entries(filters).reduce((acc, [key, value]) => {
    if (key === 'dateRange') {
      const dr = value as { start: string, end: string };
      return acc + (dr.start ? 1 : 0) + (dr.end ? 1 : 0);
    }
    if (Array.isArray(value)) {
      return acc + (value.length > 0 ? 1 : 0);
    }
    return acc + (value ? 1 : 0);
  }, 0);

  const handleExtractionSort = (key: keyof ExtractionRecord) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (extractionSortConfig && extractionSortConfig.key === key && extractionSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setExtractionSortConfig({ key, direction });
  };

  const activeExtractionFiltersCount = Object.entries(extractionFilters).reduce((acc, [key, value]) => {
    if (key === 'dateRange') {
      const dr = value as { start: string, end: string };
      return acc + (dr.start ? 1 : 0) + (dr.end ? 1 : 0);
    }
    if (Array.isArray(value)) {
      return acc + (value.length > 0 ? 1 : 0);
    }
    return acc + (value ? 1 : 0);
  }, 0);

  const activeReconFiltersCount = Object.entries(reconFilters).reduce((acc, [key, value]) => {
    if (key === 'dateRange') {
      const dr = value as { start: string, end: string };
      return acc + (dr.start ? 1 : 0) + (dr.end ? 1 : 0);
    }
    if (Array.isArray(value)) {
      return acc + (value.length > 0 ? 1 : 0);
    }
    return acc + (value ? 1 : 0);
  }, 0);

  const navigateToExtraction = (filters: { 
    ministry?: string, 
    unit?: string, 
    source?: string, 
    status?: string,
    dateRange?: { start: string, end: string }
  }) => {
    setExtractionFilters({
      sources: filters.source ? [filters.source] : [],
      ministries: filters.ministry ? [filters.ministry] : [],
      units: filters.unit ? [filters.unit] : [],
      statuses: filters.status ? [filters.status] : [],
      dateRange: filters.dateRange || { start: '', end: '' }
    });
    setExtractionCurrentPage(1);
    setActiveTab('extraction');
    setView('list');
  };

  const activeLogFiltersCount = Object.entries(logFilters).reduce((acc, [key, value]) => {
    if (key === 'dateRange') {
      const dr = value as { start: string, end: string };
      return acc + (dr.start ? 1 : 0) + (dr.end ? 1 : 0);
    }
    if (Array.isArray(value)) {
      return acc + (value.length > 0 ? 1 : 0);
    }
    return acc + (value ? 1 : 0);
  }, 0);

  const activeVersionFiltersCount = Object.entries(versionFilters).reduce((acc, [key, value]) => {
    if (key === 'dateRange') {
      const dr = value as { start: string, end: string };
      return acc + (dr.start ? 1 : 0) + (dr.end ? 1 : 0);
    }
    if (Array.isArray(value)) {
      return acc + (value.length > 0 ? 1 : 0);
    }
    return acc + (value ? 1 : 0);
  }, 0);

  const startWizard = () => {
    setWizardStep(1);
    setView('wizard');
    setConnectionResult(null);
    setIsConnecting(false);
  };

  const nextStep = () => {
    if (wizardStep < 4) {
      setWizardStep(wizardStep + 1);
    } else {
      // Direct success without connection check
      setWizardStep(5);
      setConnectionResult('success');
    }
  };

  const prevStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  const handleFinalizeConnection = () => {
    setWizardStep(4);
    setConnectionResult('success');
  };

  const renderDashboardTimeFilter = () => (
    <div className="flex items-center gap-4">
      <button 
        className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
        onClick={() => showNotification('Đang làm mới dữ liệu...')}
      >
        <RefreshCw size={20} />
      </button>
      <div className="flex items-center bg-gray-100/80 p-1 rounded-xl border border-gray-200/50">
        {[
          { id: 'today', label: 'Hôm nay' },
          { id: 'week', label: 'Tuần này' },
          { id: 'month', label: 'Tháng này' },
          { id: 'custom', label: 'Tuỳ chỉnh' }
        ].map((range) => (
          <button
            key={range.id}
            onClick={() => setDashboardTimeRange(range.id as any)}
            className={cn(
              "px-5 py-1.5 text-sm font-bold rounded-lg transition-all",
              dashboardTimeRange === range.id 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {range.label}
          </button>
        ))}
      </div>
      {dashboardTimeRange === 'custom' && (
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
          <input 
            type="date" 
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
            value={dashboardCustomRange.start}
            onChange={(e) => setDashboardCustomRange({...dashboardCustomRange, start: e.target.value})}
          />
          <span className="text-gray-400">-</span>
          <input 
            type="date" 
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
            value={dashboardCustomRange.end}
            onChange={(e) => setDashboardCustomRange({...dashboardCustomRange, end: e.target.value})}
          />
        </div>
      )}
    </div>
  );

  const renderDashboard = () => (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f4f6f9] p-6 space-y-6 overflow-y-auto custom-scrollbar">
      {/* Breadcrumb & Filter Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="hover:text-blue-600 cursor-pointer">Trang chủ</span>
          <ChevronRight size={12} />
          <span className="text-blue-600 font-medium">Tổng quan</span>
        </div>
        {renderDashboardTimeFilter()}
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-gray-900">Tổng quan về phân hệ xây dựng kho dữ liệu</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
            <Database size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng dịch vụ</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">13</p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Số dịch vụ đang kích hoạt</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">10</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
            <History size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng bản ghi</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">1.2M+</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Số bản ghi thành công</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">1.1M+</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900">Thống kê số lượng bản ghi đồng bộ theo dịch vụ</h3>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400">
                <Filter size={16} />
              </button>
              <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={SOURCE_SYNC_STATS}
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={150}
                  tick={{ fontSize: 11, fontWeight: 500, fill: '#64748b' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="success" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={32} name="Thành công" />
                <Bar dataKey="dataError" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} name="Lỗi dữ liệu" />
                <Bar dataKey="connError" stackId="a" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Lỗi kết nối" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
              <span className="text-xs text-gray-500 font-medium">Thành công</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <span className="text-xs text-gray-500 font-medium">Lỗi dữ liệu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
              <span className="text-xs text-gray-500 font-medium">Lỗi kết nối</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900">Trạng thái kết nối dịch vụ</h3>
            <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400">
              <MoreVertical size={16} />
            </button>
          </div>
          <div className="h-[250px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-900">13</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Dịch vụ</span>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {PIE_DATA.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-medium text-gray-600">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">{item.value}</span>
                  <span className="text-[10px] text-gray-400 font-medium">({Math.round(item.value / 13 * 100)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-base font-bold text-gray-900 mb-6">Lưu lượng xử lý bản ghi theo khung giờ (requests/hour)</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={HOURLY_TRAFFIC_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="requests" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderSourceList = () => {
    const totalPages = Math.ceil(filteredSources.length / itemsPerPage);
    const paginatedSources = filteredSources.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
      <div className="p-6 h-full flex flex-col space-y-6">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Dịch vụ trích rút dữ liệu</h1>
            <p className="text-gray-500">Danh sách các dịch vụ trích rút dữ liệu đã tích hợp vào hệ thống.</p>
          </div>
          <button 
            onClick={startWizard}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus size={20} />
            Thêm mới dịch vụ trích rút dữ liệu
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4 relative shrink-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm theo tên dịch vụ..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  if (!isFilterOpen) setTempFilters(filters);
                  setIsFilterOpen(!isFilterOpen);
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all font-medium relative",
                  isFilterOpen ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
              >
                <Filter size={18} />
                Lọc
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white shadow-sm">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              <button 
                onClick={handleRefresh}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" 
                title="Làm mới"
              >
                <RefreshCw size={20} />
              </button>
              <button 
                onClick={() => handleDownload(filteredSources, 'danh-sach-csdl-nguon')}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" 
                title="Tải về danh sách"
              >
                <Download size={20} />
              </button>
            </div>

            {/* Filter Dropdown */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-4 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-4 space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4">
                    <MultiSelectFilter 
                      label="Bộ"
                      options={Object.keys(MINISTRY_UNIT_MAPPING).map(m => ({ label: m, value: m }))}
                      selectedValues={tempFilters.ministries}
                      onChange={(vals) => setTempFilters({...tempFilters, ministries: vals, units: []})}
                      placeholder="Tất cả các Bộ"
                    />
                    <MultiSelectFilter 
                      label="Đơn vị"
                      options={(tempFilters.ministries.length > 0 
                        ? tempFilters.ministries.flatMap(m => MINISTRY_UNIT_MAPPING[m] || [])
                        : Object.values(MINISTRY_UNIT_MAPPING).flat()
                      ).map(u => ({ label: u, value: u }))}
                      selectedValues={tempFilters.units}
                      onChange={(vals) => setTempFilters({...tempFilters, units: vals})}
                      placeholder="Tất cả đơn vị"
                    />
                    <MultiSelectFilter 
                      label="Tag"
                      options={Array.from(new Set(MOCK_SOURCES.flatMap(s => s.tags || []))).map(tag => ({ label: tag, value: tag }))}
                      selectedValues={tempFilters.tags}
                      onChange={(vals) => setTempFilters({...tempFilters, tags: vals})}
                      placeholder="Tất cả tag"
                    />
                    <MultiSelectFilter 
                      label="Người cập nhật"
                      options={[
                        { label: 'Nguyễn Văn A', value: 'Nguyễn Văn A' },
                        { label: 'Trần Thị B', value: 'Trần Thị B' },
                        { label: 'Lê Văn C', value: 'Lê Văn C' }
                      ]}
                      selectedValues={tempFilters.creators}
                      onChange={(vals) => setTempFilters({...tempFilters, creators: vals})}
                      placeholder="Tất cả người cập nhật"
                    />
                    <MultiSelectFilter 
                      label="Trạng thái"
                      options={[
                        { label: 'Kích hoạt', value: 'connected' },
                        { label: 'Vô hiệu hóa', value: 'disconnected' }
                      ]}
                      selectedValues={tempFilters.statuses}
                      onChange={(vals) => setTempFilters({...tempFilters, statuses: vals})}
                      placeholder="Tất cả trạng thái"
                    />
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Khoảng thời gian cập nhật</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="date" 
                          className="text-xs border border-gray-200 rounded-lg p-2" 
                          value={tempFilters.dateRange.start}
                          onChange={(e) => setTempFilters({...tempFilters, dateRange: {...tempFilters.dateRange, start: e.target.value}})}
                        />
                        <input 
                          type="date" 
                          className="text-xs border border-gray-200 rounded-lg p-2" 
                          value={tempFilters.dateRange.end}
                          onChange={(e) => setTempFilters({...tempFilters, dateRange: {...tempFilters.dateRange, end: e.target.value}})}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                    <button 
                      onClick={() => {
                        const reset = {
                          ministries: [],
                          units: [],
                          creators: [],
                          statuses: [],
                          tags: [],
                          dateRange: { start: '', end: '' }
                        };
                        setTempFilters(reset);
                        setFilters(reset);
                        setCurrentPage(1);
                      }}
                      className="text-xs font-bold text-gray-400 hover:text-gray-600 px-3 py-1"
                    >
                      Xóa lọc
                    </button>
                    <button 
                      onClick={() => {
                        setFilters(tempFilters);
                        setIsFilterOpen(false);
                        setCurrentPage(1);
                      }}
                      className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                    >
                      Áp dụng
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                  <th 
                    className={cn(
                      "px-6 py-4 font-semibold cursor-pointer hover:text-blue-600 transition-colors",
                      sortConfig?.key === 'name' && "text-blue-600 bg-blue-50/30"
                    )} 
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Tên dịch vụ
                      {sortConfig?.key === 'name' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} />}
                    </div>
                  </th>
                  <th 
                    className={cn(
                      "px-6 py-4 font-semibold cursor-pointer hover:text-blue-600 transition-colors",
                      sortConfig?.key === 'ministry' && "text-blue-600 bg-blue-50/30"
                    )} 
                    onClick={() => handleSort('ministry')}
                  >
                    <div className="flex items-center gap-1">
                      Bộ
                      {sortConfig?.key === 'ministry' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} />}
                    </div>
                  </th>
                  <th 
                    className={cn(
                      "px-6 py-4 font-semibold cursor-pointer hover:text-blue-600 transition-colors",
                      sortConfig?.key === 'unit' && "text-blue-600 bg-blue-50/30"
                    )} 
                    onClick={() => handleSort('unit')}
                  >
                    <div className="flex items-center gap-1">
                      Đơn vị
                      {sortConfig?.key === 'unit' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} />}
                    </div>
                  </th>
                  <th 
                    className={cn(
                      "px-6 py-4 font-semibold cursor-pointer hover:text-blue-600 transition-colors",
                      sortConfig?.key === 'status' && "text-blue-600 bg-blue-50/30"
                    )} 
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Trạng thái
                      {sortConfig?.key === 'status' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} />}
                    </div>
                  </th>
                  <th className="px-6 py-4 font-semibold">Tag</th>
                  <th 
                    className={cn(
                      "px-6 py-4 font-semibold cursor-pointer hover:text-blue-600 transition-colors",
                      sortConfig?.key === 'lastUpdated' && "text-blue-600 bg-blue-50/30"
                    )} 
                    onClick={() => handleSort('lastUpdated')}
                  >
                    <div className="flex items-center gap-1">
                      Thời gian cập nhật
                      {sortConfig?.key === 'lastUpdated' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} />}
                    </div>
                  </th>
                  <th 
                    className={cn(
                      "px-6 py-4 font-semibold cursor-pointer hover:text-blue-600 transition-colors",
                      sortConfig?.key === 'creator' && "text-blue-600 bg-blue-50/30"
                    )} 
                    onClick={() => handleSort('creator')}
                  >
                    <div className="flex items-center gap-1">
                      Người cập nhật
                      {sortConfig?.key === 'creator' ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} />}
                    </div>
                  </th>
                  <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedSources.map((source) => (
                  <tr 
                    key={source.id} 
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                    onClick={() => handleSourceClick(source)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center font-bold text-xs">
                          {source.type.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{source.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{source.ministry}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{source.unit}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                        source.status === 'connected' ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"
                      )}>
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          source.status === 'connected' ? "bg-green-600" : "bg-gray-600"
                        )} />
                        {source.status === 'connected' ? 'Kích hoạt' : 'Vô hiệu hóa'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {source.tags?.map(tag => (
                          <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{source.lastUpdated}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{source.creator}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <button 
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setSourceToDelete(source);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30 shrink-0">
            <p className="text-sm text-gray-500">
              Hiển thị <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> đến <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredSources.length)}</span> trong <span className="font-medium">{filteredSources.length}</span> kết quả
            </p>
            <div className="flex items-center gap-1">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-sm font-medium transition-all",
                    currentPage === i + 1 ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-gray-500 hover:bg-gray-100"
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReconciliationResults = () => {
    const totalPages = Math.ceil(filteredReconciliationRecords.length / itemsPerPage);
    const paginatedResults = filteredReconciliationRecords.slice((reconCurrentPage - 1) * itemsPerPage, reconCurrentPage * itemsPerPage);

    return (
      <div className="p-6 h-full flex flex-col space-y-6">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kết quả kiểm tra dữ liệu</h1>
            <p className="text-gray-500">Lịch sử các sự kiện đồng bộ và chi tiết kết quả kiểm tra dữ liệu.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4 relative shrink-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm theo Record ID hoặc Dịch vụ..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={reconSearchQuery}
                onChange={(e) => { setReconSearchQuery(e.target.value); setReconCurrentPage(1); }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  if (!isReconFilterOpen) setTempReconFilters(reconFilters);
                  setIsReconFilterOpen(!isReconFilterOpen);
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all font-medium relative",
                  isReconFilterOpen ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
              >
                <Filter size={18} />
                Lọc
                {activeReconFiltersCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white shadow-sm">
                    {activeReconFiltersCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => { 
                  setReconSearchQuery(''); 
                  const reset = { sources: [], ministries: [], units: [], statuses: [], dateRange: { start: '', end: '' } };
                  setReconFilters(reset); 
                  setTempReconFilters(reset);
                  setReconSortConfig(null); 
                  setReconCurrentPage(1); 
                }}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" 
                title="Làm mới"
              >
                <RefreshCw size={20} />
              </button>
              <button 
                onClick={() => handleDownload(filteredReconciliationRecords, 'ket-qua-kiem-tra-chuan-hoa')}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" 
                title="Tải về"
              >
                <Download size={20} />
              </button>
            </div>

            {/* Filter Dropdown */}
            <AnimatePresence>
              {isReconFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-4 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-4 space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4">
                    <MultiSelectFilter 
                      label="Bộ"
                      options={Array.from(new Set(MOCK_RECONCILIATION_RECORDS.map(r => r.ministry).filter(Boolean))).map(name => ({ label: name!, value: name! }))}
                      selectedValues={tempReconFilters.ministries}
                      onChange={(vals) => setTempReconFilters({...tempReconFilters, ministries: vals})}
                      placeholder="Tất cả bộ"
                    />
                    <MultiSelectFilter 
                      label="Đơn vị"
                      options={Array.from(new Set(MOCK_RECONCILIATION_RECORDS.map(r => r.unit).filter(Boolean))).map(name => ({ label: name!, value: name! }))}
                      selectedValues={tempReconFilters.units}
                      onChange={(vals) => setTempReconFilters({...tempReconFilters, units: vals})}
                      placeholder="Tất cả đơn vị"
                    />
                    <MultiSelectFilter 
                      label="Dịch vụ trích rút dữ liệu"
                      options={Array.from(new Set(MOCK_RECONCILIATION_RECORDS.map(r => r.sourceName))).map(name => ({ label: name, value: name }))}
                      selectedValues={tempReconFilters.sources}
                      onChange={(vals) => setTempReconFilters({...tempReconFilters, sources: vals})}
                      placeholder="Tất cả dịch vụ"
                    />
                    <MultiSelectFilter 
                      label="Trạng thái"
                      options={[
                        { label: 'Lỗi kết nối', value: 'connection_error' },
                        { label: 'Lỗi dữ liệu', value: 'data_error' },
                        { label: 'Thành công', value: 'success' }
                      ]}
                      selectedValues={tempReconFilters.statuses}
                      onChange={(vals) => setTempReconFilters({...tempReconFilters, statuses: vals})}
                      placeholder="Tất cả trạng thái"
                    />
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Khoảng thời gian</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="date" 
                          className="text-xs border border-gray-200 rounded-lg p-2" 
                          value={tempReconFilters.dateRange.start}
                          onChange={(e) => setTempReconFilters({...tempReconFilters, dateRange: {...tempReconFilters.dateRange, start: e.target.value}})}
                        />
                        <input 
                          type="date" 
                          className="text-xs border border-gray-200 rounded-lg p-2" 
                          value={tempReconFilters.dateRange.end}
                          onChange={(e) => setTempReconFilters({...tempReconFilters, dateRange: {...tempReconFilters.dateRange, end: e.target.value}})}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                    <button 
                      onClick={() => {
                        const reset = {
                          sources: [],
                          ministries: [],
                          units: [],
                          statuses: [],
                          dateRange: { start: '', end: '' }
                        };
                        setTempReconFilters(reset);
                        setReconFilters(reset);
                        setReconCurrentPage(1);
                      }}
                      className="text-xs font-bold text-gray-400 hover:text-gray-600 px-3 py-1"
                    >
                      Xóa lọc
                    </button>
                    <button 
                      onClick={() => {
                        setReconFilters(tempReconFilters);
                        setIsReconFilterOpen(false);
                        setReconCurrentPage(1);
                      }}
                      className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                    >
                      Áp dụng
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Statistics Section */}
          <div className="p-6 bg-gray-50/50 border-b border-gray-100 shrink-0">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <Database size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tổng bản ghi</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-gray-900">{reconStats.total.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-500 font-medium">({reconStats.databases} dịch vụ)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Thành công</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-gray-900">{reconStats.success.toLocaleString()}</span>
                    <span className="text-[10px] text-green-600 font-bold">{reconStatsPerc.success}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lỗi dữ liệu</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-gray-900">{reconStats.dataError.toLocaleString()}</span>
                    <span className="text-[10px] text-red-600 font-bold">{reconStatsPerc.dataError}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Xử lý trung bình</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-gray-900">{reconStats.avgProcessingTime}ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="bg-gray-50/50 text-gray-500 text-[10px] uppercase tracking-wider">
                  <th 
                    className={cn(
                      "px-6 py-4 font-semibold cursor-pointer hover:text-blue-600 transition-colors",
                      reconSortConfig?.key === 'time' && "text-blue-600 bg-blue-50/30"
                    )} 
                    onClick={() => handleReconSort('time')}
                  >
                    <div className="flex items-center gap-1">
                      Thời gian nhận
                      {reconSortConfig?.key === 'time' ? (reconSortConfig.direction === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />) : <ArrowUpDown size={10} />}
                    </div>
                  </th>
                  <th 
                    className={cn(
                      "px-6 py-4 font-semibold cursor-pointer hover:text-blue-600 transition-colors",
                      reconSortConfig?.key === 'recordId' && "text-blue-600 bg-blue-50/30"
                    )} 
                    onClick={() => handleReconSort('recordId')}
                  >
                    <div className="flex items-center gap-1">
                      ID bản ghi
                      {reconSortConfig?.key === 'recordId' ? (reconSortConfig.direction === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />) : <ArrowUpDown size={10} />}
                    </div>
                  </th>
                  <th 
                    className={cn(
                      "px-6 py-4 font-semibold cursor-pointer hover:text-blue-600 transition-colors",
                      reconSortConfig?.key === 'sourceName' && "text-blue-600 bg-blue-50/30"
                    )} 
                    onClick={() => handleReconSort('sourceName')}
                  >
                    <div className="flex items-center gap-1">
                      Dịch vụ trích rút dữ liệu
                      {reconSortConfig?.key === 'sourceName' ? (reconSortConfig.direction === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />) : <ArrowUpDown size={10} />}
                    </div>
                  </th>
                  <th className="px-6 py-4 font-semibold">Bộ</th>
                  <th className="px-6 py-4 font-semibold">Đơn vị</th>
                  <th 
                    className={cn(
                      "px-6 py-4 font-semibold cursor-pointer hover:text-blue-600 transition-colors",
                      reconSortConfig?.key === 'processingTime' && "text-blue-600 bg-blue-50/30"
                    )} 
                    onClick={() => handleReconSort('processingTime')}
                  >
                    <div className="flex items-center gap-1">
                      Thời gian xử lý
                      {reconSortConfig?.key === 'processingTime' ? (reconSortConfig.direction === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />) : <ArrowUpDown size={10} />}
                    </div>
                  </th>
                  <th 
                    className={cn(
                      "px-6 py-4 font-semibold text-center cursor-pointer hover:text-blue-600 transition-colors",
                      reconSortConfig?.key === 'status' && "text-blue-600 bg-blue-50/30"
                    )} 
                    onClick={() => handleReconSort('status')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Trạng thái
                      {reconSortConfig?.key === 'status' ? (reconSortConfig.direction === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />) : <ArrowUpDown size={10} />}
                    </div>
                  </th>
                  <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedResults.map((item) => {
                  return (
                    <tr 
                      key={item.id} 
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                      onClick={() => { setSelectedRecon(item); setIsReconDetailOpen(true); }}
                    >
                      <td className="px-6 py-4 text-xs text-gray-500 font-bold">{item.time}</td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-900">{item.recordId}</td>
                      <td className="px-6 py-4 text-xs text-gray-600">{item.sourceName}</td>
                      <td className="px-6 py-4 text-xs text-gray-600">{item.ministry || '—'}</td>
                      <td className="px-6 py-4 text-xs text-gray-600">{item.unit || '—'}</td>
                      <td className="px-6 py-4 text-xs text-gray-600">{item.processingTime || '—'}</td>
                      <td className="px-6 py-4 text-center">
                        <span 
                          className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold",
                            RECON_STATUS_DISPLAY[item.status].color
                          )}
                        >
                          {RECON_STATUS_DISPLAY[item.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                            onClick={(e) => { e.stopPropagation(); handleDownloadXML(item); }}
                            title="Tải XML"
                          >
                            <Download size={16} />
                          </button>
                          <button 
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                            onClick={(e) => { e.stopPropagation(); setSelectedRecon(item); setIsReconDetailOpen(true); }}
                          >
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30 shrink-0">
            <p className="text-sm text-gray-500">
              Hiển thị <span className="font-medium">{(reconCurrentPage - 1) * itemsPerPage + 1}</span> đến <span className="font-medium">{Math.min(reconCurrentPage * itemsPerPage, filteredReconciliationRecords.length)}</span> trong <span className="font-medium">{filteredReconciliationRecords.length}</span> kết quả
            </p>
            <div className="flex items-center gap-1">
              <button 
                disabled={reconCurrentPage === 1}
                onClick={() => setReconCurrentPage(reconCurrentPage - 1)}
                className="p-1.5 text-gray-400 hover:text-blue-600 disabled:opacity-30 transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setReconCurrentPage(i + 1)}
                  className={cn(
                    "w-7 h-7 rounded-lg text-xs font-bold transition-all",
                    reconCurrentPage === i + 1 ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-gray-500 hover:bg-gray-100"
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                disabled={reconCurrentPage === totalPages}
                onClick={() => setReconCurrentPage(reconCurrentPage + 1)}
                className="p-1.5 text-gray-400 hover:text-blue-600 disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWizard = () => {
    const steps = [
      { id: 1, title: 'Thông tin cơ bản & Xác thực' },
      { id: 2, title: 'Cấu hình dịch vụ kiểm tra dữ liệu' },
      { id: 3, title: 'Cấu hình dịch vụ đối soát dữ liệu' },
      { id: 4, title: 'Bảo mật nâng cao' }
    ];

    const isStep1Valid = newSource.name && newSource.ministry && newSource.unit && newSource.api && newSource.secret && newSource.token;
    const isStep2Valid = detectedSchema.length > 0;
    const isStep3Valid = reconCategories.some(cat => cat.options.some(opt => opt.enabled));

    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="flex items-center gap-4">
          {wizardStep === 1 && (
            <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-2xl font-bold">Thêm mới dịch vụ trích rút dữ liệu</h1>
        </div>

        {/* Progress Bar */}
        <div className="relative flex justify-between items-center px-4">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-100 -z-10" />
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
                wizardStep === step.id ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110" :
                wizardStep > step.id ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
              )}>
                {wizardStep > step.id ? <CheckCircle2 size={20} /> : step.id}
              </div>
              <span className={cn(
                "text-xs font-medium",
                wizardStep === step.id ? "text-blue-600" : "text-gray-400"
              )}>{step.title}</span>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            {wizardStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold">Thông tin cơ bản & Xác thực</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên dịch vụ trích rút dữ liệu <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="VD: Thông tin về Hộ tịch" 
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      value={newSource.name}
                      onChange={(e) => setNewSource({...newSource, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bộ chủ quản <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      value={newSource.ministry}
                      onChange={(e) => setNewSource({...newSource, ministry: e.target.value, unit: ''})}
                      required
                    >
                      <option value="">Chọn bộ...</option>
                      {Object.keys(MINISTRY_UNIT_MAPPING).map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị tích hợp <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      value={newSource.unit}
                      onChange={(e) => setNewSource({...newSource, unit: e.target.value})}
                      required
                      disabled={!newSource.ministry}
                    >
                      <option value="">Chọn đơn vị...</option>
                      {newSource.ministry && MINISTRY_UNIT_MAPPING[newSource.ministry]?.map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="VD: https://api.example.com/v1" 
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      value={newSource.api}
                      onChange={(e) => setNewSource({...newSource, api: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secret Key <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="password" 
                      placeholder="••••••••••••••••" 
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      value={newSource.secret}
                      onChange={(e) => setNewSource({...newSource, secret: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secret Token <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="password" 
                      placeholder="••••••••••••••••" 
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      value={newSource.token}
                      onChange={(e) => setNewSource({...newSource, token: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {wizardStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={prevStep} 
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div>
                      <h2 className="text-xl font-bold">Cấu hình dịch vụ kiểm tra dữ liệu</h2>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Thiết lập tiêu chí kiểm tra chuẩn hóa dữ liệu</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSampleType('XML')}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                        sampleType === 'XML' ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      XML
                    </button>
                    <button 
                      onClick={() => setSampleType('CSV')}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                        sampleType === 'CSV' ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      CSV
                    </button>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="text-red-500">*</span> {sampleType} mẫu {sampleType === 'CSV' && "(Cấu hình nguồn-export từ 'Export CSV')"}
                    </label>
                    <textarea 
                      className="w-full h-40 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono text-sm resize-none"
                      placeholder={`Dán nội dung ${sampleType} mẫu vào đây...`}
                      value={sampleContent}
                      onChange={(e) => setSampleContent(e.target.value)}
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors">
                        <Upload size={14} />
                        Tải file
                      </button>
                      <button 
                        onClick={handleDetectSchema}
                        disabled={!sampleContent || isDetecting}
                        className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDetecting ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                        Tiếp
                      </button>
                    </div>
                  </div>

                  {detectedSchema.length > 0 && (
                    <div className="border border-gray-100 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
                            <tr>
                              <th className="px-4 py-3">Trường</th>
                              <th className="px-4 py-3 text-center">Bắt buộc</th>
                              <th className="px-4 py-3">Kiểu dữ liệu</th>
                              <th colSpan={3} className="px-4 py-3 text-center border-l border-gray-200">
                                <div className="flex flex-col items-center">
                                  <span className="text-[10px] text-gray-400 mb-1">Danh sách điều kiện</span>
                                  <div className="grid grid-cols-3 w-full">
                                    <span>Loại</span>
                                    <span>Thông báo báo lỗi</span>
                                    <span>Điều kiện</span>
                                  </div>
                                </div>
                              </th>
                              <th className="px-4 py-3 text-center">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {detectedSchema?.map((field) => (
                              <React.Fragment key={field.id}>
                                <tr className="hover:bg-gray-50 transition-colors">
                                  <td className="px-4 py-3 font-medium text-gray-900">
                                    <div className="flex items-center gap-2">
                                      {field.children && <ChevronDown size={14} className="text-gray-400" />}
                                      {field.name}
                                      {field.dataType === 'Chữ (String)' && <FileText size={12} className="text-gray-400" />}
                                      {field.dataType === 'Đối tượng (Object)' && <span className="text-purple-500">{"{}"}</span>}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <input 
                                      type="checkbox" 
                                      checked={field.isRequired} 
                                      onChange={() => toggleRequired(field.id)}
                                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                                    />
                                  </td>
                                  <td className="px-4 py-3">
                                    <select 
                                      value={field.dataType}
                                      onChange={(e) => updateFieldType(field.id, e.target.value)}
                                      className="bg-transparent border-none focus:ring-0 p-0 text-xs text-gray-600"
                                    >
                                      <option value={field.dataType}>{field.dataType}</option>
                                      <option value="Chữ (String)">Chữ (String)</option>
                                      <option value="Số nguyên lớn (BigInt)">Số nguyên lớn (BigInt)</option>
                                      <option value="Số nguyên 32-bit (Int32)">Số nguyên 32-bit (Int32)</option>
                                      <option value="Số nguyên 64-bit (Int64)">Số nguyên 64-bit (Int64)</option>
                                      <option value="Số thập phân (Decimal)">Số thập phân (Decimal)</option>
                                      <option value="True/False (Boolean)">True/False (Boolean)</option>
                                      <option value="Đối tượng (Object)">Đối tượng (Object)</option>
                                    </select>
                                  </td>
                                  <td colSpan={3} className="p-0 border-l border-gray-100">
                                    <div className="flex flex-col">
                                      {field.conditions?.map((cond: any) => (
                                        <div key={cond.id} className="flex items-center gap-2 p-2 border-b border-gray-50 last:border-0">
                                          <div className="w-1/3">
                                            <select 
                                              value={cond.type}
                                              onChange={(e) => updateCondition(field.id, cond.id, { type: e.target.value })}
                                              className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            >
                                              <option>Loại con duy nhất</option>
                                              <option>Ít nhất một</option>
                                              <option>Bắt buộc (có điều kiện)</option>
                                            </select>
                                          </div>
                                          <div className="w-1/3">
                                            <input 
                                              type="text"
                                              placeholder="Thông báo lỗi"
                                              value={cond.errorMessage}
                                              onChange={(e) => updateCondition(field.id, cond.id, { errorMessage: e.target.value })}
                                              className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            />
                                          </div>
                                          <div className="flex-1 flex gap-2 items-center">
                                            {cond.type === 'Bắt buộc (có điều kiện)' ? (
                                              <>
                                                <input 
                                                  type="text"
                                                  placeholder="Trường phụ thuộc"
                                                  value={cond.dependentField}
                                                  onChange={(e) => updateCondition(field.id, cond.id, { dependentField: e.target.value })}
                                                  className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                />
                                                <div className="flex-1">
                                                  <TagInput 
                                                    values={cond.dependentValues || []}
                                                    onChange={(newValues) => updateCondition(field.id, cond.id, { dependentValues: newValues })}
                                                    placeholder="Giá trị"
                                                  />
                                                </div>
                                              </>
                                            ) : (
                                              <div className="w-full">
                                                <TagInput 
                                                  values={cond.conditionValues || []}
                                                  onChange={(newValues) => updateCondition(field.id, cond.id, { conditionValues: newValues })}
                                                  placeholder="Danh sách giá trị"
                                                />
                                              </div>
                                            )}
                                          </div>
                                          <div className="flex gap-1">
                                            <button 
                                              onClick={() => addCondition(field.id)}
                                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                              title="Thêm điều kiện"
                                            >
                                              <Plus size={14} />
                                            </button>
                                            <button 
                                              onClick={() => setDeleteConditionConfirm({ fieldId: field.id, conditionId: cond.id })}
                                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                              title="Xoá điều kiện"
                                            >
                                              <Trash2 size={14} />
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                      {(!field.conditions || field.conditions.length === 0) && (
                                        <div className="flex justify-center p-2">
                                          <button 
                                            onClick={() => addCondition(field.id)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition-colors"
                                            title="Thêm điều kiện mới"
                                          >
                                            <Plus size={16} />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <button 
                                      onClick={() => setDeleteFieldConfirm(field.id)}
                                      className="text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </td>
                                </tr>
                                {field.children?.map(child => (
                                  <tr key={child.id} className="bg-gray-50/30 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 pl-10 font-medium text-gray-600">
                                      <div className="flex items-center gap-2">
                                        {child.name}
                                        <FileText size={12} className="text-gray-400" />
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <input 
                                        type="checkbox" 
                                        checked={child.isRequired} 
                                        onChange={() => toggleRequired(child.id)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                                      />
                                    </td>
                                    <td className="px-4 py-3">
                                      <select 
                                        value={child.dataType}
                                        onChange={(e) => updateFieldType(child.id, e.target.value)}
                                        className="bg-transparent border-none focus:ring-0 p-0 text-xs text-gray-600"
                                      >
                                        <option value={child.dataType}>{child.dataType}</option>
                                        <option value="Chữ (String)">Chữ (String)</option>
                                        <option value="Số nguyên lớn (BigInt)">Số nguyên lớn (BigInt)</option>
                                        <option value="Số nguyên 32-bit (Int32)">Số nguyên 32-bit (Int32)</option>
                                        <option value="Số nguyên 64-bit (Int64)">Số nguyên 64-bit (Int64)</option>
                                        <option value="Số thập phân (Decimal)">Số thập phân (Decimal)</option>
                                        <option value="True/False (Boolean)">True/False (Boolean)</option>
                                        <option value="Đối tượng (Object)">Đối tượng (Object)</option>
                                      </select>
                                    </td>
                                     <td colSpan={3} className="p-0 border-l border-gray-100">
                                       <div className="flex flex-col">
                                         {child.conditions?.map((cond: any) => (
                                           <div key={cond.id} className="flex items-center gap-2 p-2 border-b border-gray-50 last:border-0">
                                             <div className="w-1/3">
                                               <select 
                                                 value={cond.type}
                                                 onChange={(e) => updateCondition(child.id, cond.id, { type: e.target.value })}
                                                 className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                               >
                                                 <option>Loại con duy nhất</option>
                                                 <option>Ít nhất một</option>
                                                 <option>Bắt buộc (có điều kiện)</option>
                                               </select>
                                             </div>
                                             <div className="w-1/3">
                                               <input 
                                                 type="text"
                                                 placeholder="Thông báo lỗi"
                                                 value={cond.errorMessage}
                                                 onChange={(e) => updateCondition(child.id, cond.id, { errorMessage: e.target.value })}
                                                 className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                               />
                                             </div>
                                             <div className="flex-1 flex gap-2 items-center">
                                               {cond.type === 'Bắt buộc (có điều kiện)' ? (
                                                 <>
                                                   <input 
                                                     type="text"
                                                     placeholder="Trường phụ thuộc"
                                                     value={cond.dependentField}
                                                     onChange={(e) => updateCondition(child.id, cond.id, { dependentField: e.target.value })}
                                                     className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                   />
                                                   <div className="flex-1">
                                                     <TagInput 
                                                       values={cond.dependentValues || []}
                                                       onChange={(newValues) => updateCondition(child.id, cond.id, { dependentValues: newValues })}
                                                       placeholder="Giá trị"
                                                     />
                                                   </div>
                                                 </>
                                               ) : (
                                                 <div className="w-full">
                                                   <TagInput 
                                                     values={cond.conditionValues || []}
                                                     onChange={(newValues) => updateCondition(child.id, cond.id, { conditionValues: newValues })}
                                                     placeholder="Danh sách giá trị"
                                                   />
                                                 </div>
                                               )}
                                             </div>
                                             <div className="flex gap-1">
                                               <button 
                                                 onClick={() => addCondition(child.id)}
                                                 className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                 title="Thêm điều kiện"
                                               >
                                                 <Plus size={14} />
                                               </button>
                                               <button 
                                                 onClick={() => setDeleteConditionConfirm({ fieldId: child.id, conditionId: cond.id })}
                                                 className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                 title="Xoá điều kiện"
                                               >
                                                 <Trash2 size={14} />
                                               </button>
                                             </div>
                                           </div>
                                         ))}
                                         {(!child.conditions || child.conditions.length === 0) && (
                                           <div className="flex justify-center p-2">
                                             <button 
                                               onClick={() => addCondition(child.id)}
                                               className="p-1 text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition-colors"
                                               title="Thêm điều kiện mới"
                                             >
                                               <Plus size={16} />
                                             </button>
                                           </div>
                                         )}
                                       </div>
                                     </td>
                                    <td className="px-4 py-3 text-center">
                                      <button className="text-gray-400 hover:text-red-600 transition-colors">
                                        <Trash2 size={14} />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {wizardStep === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <button 
                    onClick={prevStep} 
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                    title="Quay lại"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-xl font-bold">Cấu hình dịch vụ đối soát dữ liệu</h2>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-blue-700 text-sm">
                  <Info className="shrink-0" size={20} />
                  <p>Thiết lập các tiêu chí đối soát dữ liệu để đảm bảo tính chính xác và đầy đủ của dữ liệu được trích rút.</p>
                </div>

                <div className="space-y-8">
                  {reconCategories.map((category) => (
                    <div key={category.id} className="space-y-4">
                      <div className="flex items-center justify-end border-b border-gray-100 pb-2">
                        <div className="relative">
                          <button 
                            onClick={() => setActiveReconMenu(activeReconMenu === category.id ? null : category.id)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                          >
                            <Plus size={14} />
                            Thêm tiêu chí
                          </button>
                          
                          <AnimatePresence>
                            {activeReconMenu === category.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setActiveReconMenu(null)} />
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-2"
                                >
                                  {RECON_MASTER_OPTIONS[category.id as keyof typeof RECON_MASTER_OPTIONS]
                                    .filter(opt => !category.options.find(o => o.id === opt.id))
                                    .map(opt => (
                                      <button
                                        key={opt.id}
                                        onClick={() => addReconOption(category.id, opt)}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                                      >
                                        {opt.label}
                                      </button>
                                    ))}
                                  {RECON_MASTER_OPTIONS[category.id as keyof typeof RECON_MASTER_OPTIONS]
                                    .filter(opt => !category.options.find(o => o.id === opt.id)).length === 0 && (
                                      <div className="px-4 py-2 text-xs text-gray-400 italic">Tất cả tiêu chí đã được thêm</div>
                                    )}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {category.options.map((option) => (
                          <div key={option.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 group hover:border-blue-200 transition-all">
                            <div 
                              onClick={() => updateReconOption(category.id, option.id, { enabled: !option.enabled })}
                              className={cn(
                                "w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer shrink-0",
                                option.enabled ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 bg-white"
                              )}
                            >
                              {option.enabled && <Check size={12} strokeWidth={4} />}
                            </div>
                            <div className="flex-1">
                              <span className="text-sm font-medium text-gray-900">{option.label}</span>
                            </div>
                            <button 
                              onClick={() => removeReconOption(category.id, option.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                              title="Xóa"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        {category.options.length === 0 && (
                          <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
                            <p className="text-xs text-gray-400">Chưa có tiêu chí nào trong phần này.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {wizardStep === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <button 
                    onClick={prevStep} 
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                    title="Quay lại"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-xl font-bold">Bảo mật nâng cao (Whitelist)</h2>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-blue-700 text-sm">
                  <Info className="shrink-0" size={20} />
                  <p>Cơ chế whitelist cho phép bạn giới hạn các địa chỉ IP hoặc URL/API cụ thể được phép kết nối đến hệ thống. Điều này tăng cường bảo mật cho dữ liệu của bạn.</p>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Nhập URL/API hoặc IP..." 
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">Thêm</button>
                  </div>
                  <div className="space-y-2">
                    {['https://api.gov.vn/v1', '192.168.1.100'].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                        <span className="text-sm font-mono">{item}</span>
                        <button className="text-gray-400 hover:text-red-600 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {wizardStep === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center flex-1 py-12 text-center"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Thêm thành công!</h2>
                <p className="text-gray-500 mb-8">Dịch vụ trích rút dữ liệu "{newSource.name}" đã được thêm thành công vào hệ thống.</p>
                <button 
                  onClick={() => setView('list')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  Hoàn tất
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {wizardStep < 5 && (
            <div className="mt-auto pt-8 flex items-center justify-between border-t border-gray-100">
              <div className="flex gap-3">
                <button 
                  onClick={() => setView('list')}
                  className="text-gray-500 font-medium hover:text-gray-700 px-4 py-2"
                >
                  Hủy bỏ
                </button>
              </div>
              <div className="flex gap-3">
                {wizardStep === 4 && (
                  <button 
                    onClick={nextStep}
                    className="text-gray-500 font-medium hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
                  >
                    Bỏ qua bước này
                  </button>
                )}
                <button 
                  onClick={nextStep}
                  disabled={(wizardStep === 1 && !isStep1Valid) || (wizardStep === 2 && !isStep2Valid) || (wizardStep === 3 && !isStep3Valid)}
                  className={cn(
                    "px-8 py-2.5 rounded-xl font-bold transition-colors shadow-lg",
                    ((wizardStep === 1 && !isStep1Valid) || (wizardStep === 2 && !isStep2Valid) || (wizardStep === 3 && !isStep3Valid))
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
                  )}
                >
                  {wizardStep === 4 ? 'Hoàn tất' : 'Tiếp tục'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderReconciliationDetailModal = () => {
    if (!selectedRecon) return null;

    return (
      <AnimatePresence>
        {isReconDetailOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReconDetailOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Chi tiết kết quả kiểm tra dữ liệu</h2>
                  <p className="text-xs text-gray-500 mt-1">Record ID: {selectedRecon.recordId} • {selectedRecon.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDownloadXML(selectedRecon)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Download size={14} />
                    Tải XML
                  </button>
                  <button 
                    onClick={() => setIsReconDetailOpen(false)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="p-8 space-y-8">
                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dịch vụ trích rút dữ liệu</p>
                    <p className="text-sm font-bold text-gray-900">{selectedRecon.sourceName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bộ</p>
                    <p className="text-sm font-bold text-gray-900">{selectedRecon.ministry || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Đơn vị</p>
                    <p className="text-sm font-bold text-gray-900">{selectedRecon.unit}</p>
                  </div>
                </div>

                {/* Step Details */}
                <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-32">TRẠNG THÁI:</span>
                        <span className={cn(
                          "font-bold",
                          selectedRecon.status === 'success' ? "text-green-600" : 
                          selectedRecon.status === 'data_error' ? "text-red-600" : "text-orange-600"
                        )}>
                          {RECON_STATUS_DISPLAY[selectedRecon.status].label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-32">THỜI GIAN XỬ LÝ:</span>
                        <span className="font-bold text-gray-900">{selectedRecon.processingTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-32">BẮT ĐẦU:</span>
                        <span className="font-bold text-gray-900">{selectedRecon.startTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-32">KẾT THÚC:</span>
                        <span className="font-bold text-gray-900">{selectedRecon.endTime}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-2">THÔNG BÁO:</p>
                      {selectedRecon.status === 'success' ? (
                        <p className="text-sm text-gray-500 italic">Bản ghi đối soát thành công và đã được đưa vào kho dữ liệu tập trung.</p>
                      ) : (
                        <div className="space-y-4">
                          {selectedRecon.message && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                              <pre className="text-sm text-red-700 font-sans whitespace-pre-wrap leading-relaxed">
                                {selectedRecon.message}
                              </pre>
                            </div>
                          )}
                          
                          {!selectedRecon.message && (
                            <div className="space-y-2">
                              {selectedRecon.errorDetails?.formatErrors?.missingFields?.map((err, idx) => (
                                <div key={idx} className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-xs">
                                  <p className="font-bold mb-1">Thiếu trường dữ liệu bắt buộc</p>
                                  <p>Các trường: <span className="font-mono font-bold">{err.fields.join(', ')}</span></p>
                                </div>
                              ))}
                              {selectedRecon.errorDetails?.formatErrors?.typeErrors?.map((err, idx) => (
                                <div key={idx} className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-xs">
                                  <p className="font-bold mb-1">Sai kiểu dữ liệu</p>
                                  <p>Trường <span className="font-mono font-bold">{err.field}</span>: Nhận <span className="font-bold">{err.actual}</span>, yêu cầu <span className="font-bold">{err.expected}</span></p>
                                </div>
                              ))}
                              {selectedRecon.errorDetails?.duplicateErrors && (
                                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-yellow-800 text-xs">
                                  <p className="font-bold mb-1">Trùng lặp dữ liệu</p>
                                  <p>Trùng lặp khóa định danh <span className="font-mono font-bold">{selectedRecon.errorDetails.duplicateErrors.keyField}</span></p>
                                </div>
                              )}
                              {selectedRecon.errorDetails?.connectionError && (
                                <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg text-orange-800 text-xs">
                                  <p className="font-bold mb-1">Lỗi kết nối</p>
                                  <p>{selectedRecon.errorDetails.connectionError}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={() => setIsReconDetailOpen(false)}
                    className="px-6 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  const renderDeleteConfirmationModal = () => {
    if (!isDeleteModalOpen || !sourceToDelete) return null;

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden pt-12"
          >
            <div className="px-8 text-center">
              <div className="w-24 h-24 rounded-full border-2 border-orange-200 flex items-center justify-center mx-auto mb-8">
                <span className="text-5xl text-orange-300 font-light">!</span>
              </div>
              
              <h3 className="text-2xl font-bold text-[#1e293b] mb-4">Xác nhận xóa</h3>
              <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                Bạn có chắc chắn muốn xóa dịch vụ <span className="font-bold text-gray-900">"{sourceToDelete.name}"</span> không?
              </p>
            </div>

            <div className="border-t border-gray-100 p-8 flex justify-end gap-4">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-10 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all min-w-[140px]"
              >
                Hủy
              </button>
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSourceToDelete(null);
                  showNotification(`Đã xóa dịch vụ "${sourceToDelete.name}" thành công.`);
                }}
                className="px-10 py-3 rounded-2xl bg-[#2563eb] text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all min-w-[140px]"
              >
                Xác nhận
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  };

  const renderReconciliationSummary = () => {
    const filteredSummary = MOCK_RECONCILIATION_SUMMARY
      .filter(group => reconSummaryFilters.ministries.length === 0 || reconSummaryFilters.ministries.includes(group.ministry))
      .filter(group => reconSummaryFilters.units.length === 0 || reconSummaryFilters.units.includes(group.unit))
      .map(group => ({
        ...group,
        services: group.services.filter(s => 
          s.name.toLowerCase().includes(reconSummarySearchQuery.toLowerCase()) ||
          group.unit.toLowerCase().includes(reconSummarySearchQuery.toLowerCase()) ||
          group.ministry.toLowerCase().includes(reconSummarySearchQuery.toLowerCase())
        )
      })).filter(group => group.services.length > 0);

    const handleExportSummary = () => {
      const headers = ['Đơn vị', 'Bộ', 'Dịch vụ trích rút dữ liệu', 'Tổng bản ghi đã nhận', 'Thành công', 'Thất bại'];
      const rows = filteredSummary.flatMap(group => 
        group.services.map(s => [group.unit, group.ministry, s.name, s.total, s.success, s.error])
      );
      
      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
      const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "ket-qua-doi-soat.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <div className="p-6 h-full flex flex-col space-y-6">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kết quả đối soát</h1>
            <p className="text-gray-500">Báo cáo tổng hợp kết quả đối soát dữ liệu theo từng đơn vị.</p>
          </div>
          <button 
            onClick={handleExportSummary}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
          >
            <Download size={18} />
            Xuất file kết quả
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-4 border-b border-gray-100 shrink-0 flex items-center justify-between gap-4 relative">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm đơn vị hoặc dịch vụ..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={reconSummarySearchQuery}
                onChange={(e) => setReconSummarySearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  if (!isReconSummaryFilterOpen) setTempReconSummaryFilters(reconSummaryFilters);
                  setIsReconSummaryFilterOpen(!isReconSummaryFilterOpen);
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all font-medium relative",
                  isReconSummaryFilterOpen ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
              >
                <Filter size={18} />
                Lọc
                {(reconSummaryFilters.ministries.length > 0 || reconSummaryFilters.units.length > 0 || reconSummaryFilters.dateRange.start || reconSummaryFilters.dateRange.end) && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white">
                    {(reconSummaryFilters.ministries.length > 0 ? 1 : 0) + (reconSummaryFilters.units.length > 0 ? 1 : 0) + (reconSummaryFilters.dateRange.start || reconSummaryFilters.dateRange.end ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>

            <AnimatePresence>
              {isReconSummaryFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-4 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-6 space-y-6"
                >
                  <div className="space-y-4">
                    <MultiSelectFilter 
                      label="Bộ"
                      options={Array.from(new Set(MOCK_RECONCILIATION_SUMMARY.map(r => r.ministry))).map(m => ({ label: m, value: m }))}
                      selectedValues={tempReconSummaryFilters.ministries}
                      onChange={(vals) => setTempReconSummaryFilters({...tempReconSummaryFilters, ministries: vals})}
                      placeholder="Tất cả các Bộ"
                    />

                    <MultiSelectFilter 
                      label="Đơn vị"
                      options={Array.from(new Set(MOCK_RECONCILIATION_SUMMARY.map(r => r.unit))).map(u => ({ label: u, value: u }))}
                      selectedValues={tempReconSummaryFilters.units}
                      onChange={(vals) => setTempReconSummaryFilters({...tempReconSummaryFilters, units: vals})}
                      placeholder="Tất cả đơn vị"
                    />

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Khoảng thời gian</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="date" 
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                          value={tempReconSummaryFilters.dateRange.start}
                          onChange={(e) => setTempReconSummaryFilters({...tempReconSummaryFilters, dateRange: {...tempReconSummaryFilters.dateRange, start: e.target.value}})}
                        />
                        <input 
                          type="date" 
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                          value={tempReconSummaryFilters.dateRange.end}
                          onChange={(e) => setTempReconSummaryFilters({...tempReconSummaryFilters, dateRange: {...tempReconSummaryFilters.dateRange, end: e.target.value}})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => {
                        const reset = { ministries: [], units: [], dateRange: { start: '', end: '' } };
                        setTempReconSummaryFilters(reset);
                        setReconSummaryFilters(reset);
                        setIsReconSummaryFilterOpen(false);
                      }}
                      className="text-sm font-bold text-gray-400 hover:text-gray-600 px-4 py-2"
                    >
                      Xóa lọc
                    </button>
                    <button 
                      onClick={() => {
                        setReconSummaryFilters(tempReconSummaryFilters);
                        setIsReconSummaryFilterOpen(false);
                      }}
                      className="bg-blue-600 text-white text-sm font-bold px-6 py-2 rounded-xl shadow-lg shadow-blue-200"
                    >
                      Áp dụng
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-8">
              {filteredSummary.map((group, idx) => {
                const groupTotal = group.services.reduce((acc, s) => ({
                  total: acc.total + s.total,
                  success: acc.success + s.success,
                  error: acc.error + s.error
                }), { total: 0, success: 0, error: 0 });

                return (
                  <div key={idx} className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-l-4 border-blue-600 pl-3">
                      {group.unit} - {group.ministry}
                    </h3>
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 text-[11px] text-gray-400 uppercase tracking-widest border-b border-gray-200">
                            <th className="px-6 py-4 font-bold">Dịch vụ trích rút dữ liệu</th>
                            <th className="px-6 py-4 font-bold text-center">Tổng bản ghi đã nhận</th>
                            <th className="px-6 py-4 font-bold text-center">Thành công</th>
                            <th className="px-6 py-4 font-bold text-center">Thất bại</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {group.services.map((service, sIdx) => (
                            <tr key={sIdx} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 text-sm text-gray-700 font-medium">{service.name}</td>
                              <td 
                                className="px-6 py-4 text-sm text-gray-900 font-mono text-center hover:text-blue-600 hover:underline cursor-pointer"
                                onClick={() => navigateToExtraction({ 
                                  ministry: group.ministry, 
                                  unit: group.unit, 
                                  source: service.name,
                                  dateRange: reconSummaryFilters.dateRange 
                                })}
                              >
                                {service.total.toLocaleString()}
                              </td>
                              <td 
                                className="px-6 py-4 text-sm text-green-600 font-mono text-center hover:text-green-700 hover:underline cursor-pointer"
                                onClick={() => navigateToExtraction({ 
                                  ministry: group.ministry, 
                                  unit: group.unit, 
                                  source: service.name, 
                                  status: 'success',
                                  dateRange: reconSummaryFilters.dateRange 
                                })}
                              >
                                {service.success.toLocaleString()}
                              </td>
                              <td 
                                className="px-6 py-4 text-sm text-red-600 font-mono text-center hover:text-red-700 hover:underline cursor-pointer"
                                onClick={() => navigateToExtraction({ 
                                  ministry: group.ministry, 
                                  unit: group.unit, 
                                  source: service.name, 
                                  status: 'error',
                                  dateRange: reconSummaryFilters.dateRange 
                                })}
                              >
                                {service.error.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-50/80 border-t border-gray-200 font-bold">
                            <td className="px-6 py-4 text-sm text-gray-900 uppercase">TỔNG CỘNG</td>
                            <td 
                              className="px-6 py-4 text-sm text-gray-900 font-mono text-center hover:text-blue-600 hover:underline cursor-pointer"
                              onClick={() => navigateToExtraction({ 
                                ministry: group.ministry, 
                                unit: group.unit,
                                dateRange: reconSummaryFilters.dateRange 
                              })}
                            >
                              {groupTotal.total.toLocaleString()}
                            </td>
                            <td 
                              className="px-6 py-4 text-sm text-green-600 font-mono text-center hover:text-green-700 hover:underline cursor-pointer"
                              onClick={() => navigateToExtraction({ 
                                ministry: group.ministry, 
                                unit: group.unit, 
                                status: 'success',
                                dateRange: reconSummaryFilters.dateRange 
                              })}
                            >
                              {groupTotal.success.toLocaleString()}
                            </td>
                            <td 
                              className="px-6 py-4 text-sm text-red-600 font-mono text-center hover:text-red-700 hover:underline cursor-pointer"
                              onClick={() => navigateToExtraction({ 
                                ministry: group.ministry, 
                                unit: group.unit, 
                                status: 'error',
                                dateRange: reconSummaryFilters.dateRange 
                              })}
                            >
                              {groupTotal.error.toLocaleString()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                );
              })}

              {filteredSummary.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <Search size={48} className="mb-4 opacity-20" />
                  <p>Không tìm thấy kết quả phù hợp</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderExtractionResults = () => {
    const totalPages = Math.ceil(filteredExtractionRecords.length / itemsPerPage);
    const paginatedResults = filteredExtractionRecords.slice((extractionCurrentPage - 1) * itemsPerPage, extractionCurrentPage * itemsPerPage);

    return (
      <div className="p-6 h-full flex flex-col space-y-6">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kết quả trích rút dữ liệu</h1>
            <p className="text-gray-500">Lịch sử và chi tiết kết quả trích rút dữ liệu của từng bản ghi.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4 relative shrink-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm theo Record ID hoặc Dịch vụ..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={extractionSearchQuery}
                onChange={(e) => { setExtractionSearchQuery(e.target.value); setExtractionCurrentPage(1); }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  if (!isExtractionFilterOpen) setTempExtractionFilters(extractionFilters);
                  setIsExtractionFilterOpen(!isExtractionFilterOpen);
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all font-medium relative",
                  isExtractionFilterOpen ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
              >
                <Filter size={18} />
                Lọc
                {activeExtractionFiltersCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white shadow-sm">
                    {activeExtractionFiltersCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => { 
                  setExtractionSearchQuery(''); 
                  const reset = { sources: [], ministries: [], units: [], statuses: [], dateRange: { start: '', end: '' } };
                  setExtractionFilters(reset); 
                  setTempExtractionFilters(reset);
                  setExtractionSortConfig(null); 
                  setExtractionCurrentPage(1); 
                }}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" 
                title="Làm mới"
              >
                <RefreshCw size={20} />
              </button>
              <button 
                onClick={() => handleDownload(filteredExtractionRecords, 'ket-qua-trich-rut-du-lieu')}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" 
                title="Tải về"
              >
                <Download size={20} />
              </button>
            </div>

            {/* Filter Dropdown */}
            <AnimatePresence>
              {isExtractionFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-4 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-4 space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4">
                    <MultiSelectFilter 
                      label="Bộ"
                      options={Array.from(new Set(MOCK_EXTRACTION_RECORDS.map(r => r.ministry).filter(Boolean))).map(name => ({ label: name!, value: name! }))}
                      selectedValues={tempExtractionFilters.ministries}
                      onChange={(vals) => setTempExtractionFilters({...tempExtractionFilters, ministries: vals})}
                      placeholder="Tất cả bộ"
                    />
                    <MultiSelectFilter 
                      label="Đơn vị"
                      options={Array.from(new Set(MOCK_EXTRACTION_RECORDS.map(r => r.unit).filter(Boolean))).map(name => ({ label: name!, value: name! }))}
                      selectedValues={tempExtractionFilters.units}
                      onChange={(vals) => setTempExtractionFilters({...tempExtractionFilters, units: vals})}
                      placeholder="Tất cả đơn vị"
                    />
                    <MultiSelectFilter 
                      label="Dịch vụ trích rút dữ liệu"
                      options={Array.from(new Set(MOCK_EXTRACTION_RECORDS.map(r => r.sourceName))).map(name => ({ label: name, value: name }))}
                      selectedValues={tempExtractionFilters.sources}
                      onChange={(vals) => setTempExtractionFilters({...tempExtractionFilters, sources: vals})}
                      placeholder="Tất cả dịch vụ"
                    />
                    <MultiSelectFilter 
                      label="Trạng thái"
                      options={[
                        { label: 'Thất bại', value: 'error' },
                        { label: 'Thành công', value: 'success' }
                      ]}
                      selectedValues={tempExtractionFilters.statuses}
                      onChange={(vals) => setTempExtractionFilters({...tempExtractionFilters, statuses: vals})}
                      placeholder="Tất cả trạng thái"
                    />
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Thời gian nhận</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="date" 
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                          value={tempExtractionFilters.dateRange.start}
                          onChange={(e) => setTempExtractionFilters({...tempExtractionFilters, dateRange: {...tempExtractionFilters.dateRange, start: e.target.value}})}
                        />
                        <input 
                          type="date" 
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                          value={tempExtractionFilters.dateRange.end}
                          onChange={(e) => setTempExtractionFilters({...tempExtractionFilters, dateRange: {...tempExtractionFilters.dateRange, end: e.target.value}})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button 
                      onClick={() => {
                        const reset = {
                          sources: [],
                          ministries: [],
                          units: [],
                          statuses: [],
                          dateRange: { start: '', end: '' }
                        };
                        setTempExtractionFilters(reset);
                        setExtractionFilters(reset);
                        setExtractionCurrentPage(1);
                      }}
                      className="flex-1 px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Xóa bộ lọc
                    </button>
                    <button 
                      onClick={() => {
                        setExtractionFilters(tempExtractionFilters);
                        setIsExtractionFilterOpen(false);
                        setExtractionCurrentPage(1);
                      }}
                      className="flex-1 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-200 transition-colors"
                    >
                      Áp dụng
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Statistics Summary */}
          <div className="p-4 grid grid-cols-4 gap-4 bg-gray-50/50 border-b border-gray-100 shrink-0">
            <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <Database size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tổng bản ghi</p>
                <p className="text-xl font-bold text-gray-900">{extractionStats.total}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Thành công</p>
                <p className="text-xl font-bold text-green-600">{extractionStats.success}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                <XCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Thất bại</p>
                <p className="text-xl font-bold text-red-600">{extractionStats.error}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Xử lý trung bình</p>
                <p className="text-xl font-bold text-gray-900">{extractionStats.avgProcessingTime}ms</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto min-h-0">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="text-[11px] text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th 
                    className={cn(
                      "px-6 py-4 font-semibold cursor-pointer hover:text-blue-600 transition-colors",
                      extractionSortConfig?.key === 'time' && "text-blue-600 bg-blue-50/30"
                    )} 
                    onClick={() => handleExtractionSort('time')}
                  >
                    <div className="flex items-center gap-1">
                      Thời gian nhận
                      {extractionSortConfig?.key === 'time' ? (extractionSortConfig.direction === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />) : <ArrowUpDown size={10} />}
                    </div>
                  </th>
                  <th 
                    className={cn(
                      "px-6 py-4 font-semibold cursor-pointer hover:text-blue-600 transition-colors",
                      extractionSortConfig?.key === 'recordId' && "text-blue-600 bg-blue-50/30"
                    )} 
                    onClick={() => handleExtractionSort('recordId')}
                  >
                    <div className="flex items-center gap-1">
                      ID bản ghi
                      {extractionSortConfig?.key === 'recordId' ? (extractionSortConfig.direction === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />) : <ArrowUpDown size={10} />}
                    </div>
                  </th>
                  <th 
                    className={cn(
                      "px-6 py-4 font-semibold cursor-pointer hover:text-blue-600 transition-colors",
                      extractionSortConfig?.key === 'sourceName' && "text-blue-600 bg-blue-50/30"
                    )} 
                    onClick={() => handleExtractionSort('sourceName')}
                  >
                    <div className="flex items-center gap-1">
                      Dịch vụ trích rút dữ liệu
                      {extractionSortConfig?.key === 'sourceName' ? (extractionSortConfig.direction === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />) : <ArrowUpDown size={10} />}
                    </div>
                  </th>
                  <th className="px-6 py-4 font-semibold">Bộ</th>
                  <th className="px-6 py-4 font-semibold">Đơn vị</th>
                  <th 
                    className={cn(
                      "px-6 py-4 font-semibold cursor-pointer hover:text-blue-600 transition-colors text-center",
                      extractionSortConfig?.key === 'status' && "text-blue-600 bg-blue-50/30"
                    )} 
                    onClick={() => handleExtractionSort('status')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Trạng thái
                      {extractionSortConfig?.key === 'status' ? (extractionSortConfig.direction === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />) : <ArrowUpDown size={10} />}
                    </div>
                  </th>
                  <th 
                    className={cn(
                      "px-6 py-4 font-semibold cursor-pointer hover:text-blue-600 transition-colors text-center",
                      extractionSortConfig?.key === 'processingTime' && "text-blue-600 bg-blue-50/30"
                    )} 
                    onClick={() => handleExtractionSort('processingTime')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Thời gian xử lý
                      {extractionSortConfig?.key === 'processingTime' ? (extractionSortConfig.direction === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />) : <ArrowUpDown size={10} />}
                    </div>
                  </th>
                  <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedResults.map((item) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-blue-50/30 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedExtraction(item);
                      setIsExtractionDetailOpen(true);
                    }}
                  >
                    <td className="px-6 py-4 text-xs text-gray-500 font-bold">{item.time}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-900">{item.recordId}</td>
                    <td className="px-6 py-4 text-xs text-gray-600">{item.sourceName}</td>
                    <td className="px-6 py-4 text-xs text-gray-600">{item.ministry}</td>
                    <td className="px-6 py-4 text-xs text-gray-600">{item.unit}</td>
                    <td className="px-6 py-4 text-center">
                      <span 
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          EXTRACTION_STATUS_DISPLAY[item.status].color
                        )}
                      >
                        {EXTRACTION_STATUS_DISPLAY[item.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-medium text-gray-600">
                      {item.processingTime}ms
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Tải XML">
                          <Download size={16} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white shrink-0">
            <p className="text-xs text-gray-500">
              Hiển thị <span className="font-bold text-gray-900">{(extractionCurrentPage - 1) * itemsPerPage + 1}</span> đến <span className="font-bold text-gray-900">{Math.min(extractionCurrentPage * itemsPerPage, filteredExtractionRecords.length)}</span> trong <span className="font-bold text-gray-900">{filteredExtractionRecords.length}</span> kết quả
            </p>
            <div className="flex items-center gap-1">
              <button 
                disabled={extractionCurrentPage === 1}
                onClick={() => setExtractionCurrentPage(prev => prev - 1)}
                className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setExtractionCurrentPage(page)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                    extractionCurrentPage === page ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-gray-500 hover:bg-gray-100"
                  )}
                >
                  {page}
                </button>
              ))}
              <button 
                disabled={extractionCurrentPage === totalPages}
                onClick={() => setExtractionCurrentPage(prev => prev + 1)}
                className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderExtractionDetailModal = () => {
    if (!selectedExtraction) return null;

    return (
      <AnimatePresence>
        {isExtractionDetailOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExtractionDetailOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Chi tiết kết quả trích rút dữ liệu</h2>
                  <p className="text-xs text-gray-500 mt-1">Record ID: {selectedExtraction.recordId} • {selectedExtraction.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsExtractionDetailOpen(false)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dịch vụ trích rút dữ liệu</p>
                    <p className="text-sm font-bold text-gray-900">{selectedExtraction.sourceName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bộ</p>
                    <p className="text-sm font-bold text-gray-900">{selectedExtraction.ministry}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Đơn vị</p>
                    <p className="text-sm font-bold text-gray-900">{selectedExtraction.unit}</p>
                  </div>
                </div>

                {/* Step Details */}
                <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-32">TRẠNG THÁI:</span>
                        <span className={cn(
                          "font-bold",
                          selectedExtraction.status === 'success' ? "text-green-600" : "text-red-600"
                        )}>
                          {EXTRACTION_STATUS_DISPLAY[selectedExtraction.status].label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-32">THỜI GIAN XỬ LÝ:</span>
                        <span className="font-bold text-gray-900">{selectedExtraction.processingTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-32">BẮT ĐẦU:</span>
                        <span className="font-bold text-gray-900">{selectedExtraction.startTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-32">KẾT THÚC:</span>
                        <span className="font-bold text-gray-900">{selectedExtraction.endTime}</span>
                      </div>
                    </div>

                    {selectedExtraction.errorMessage && (
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">LỖI:</p>
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                          <p className="text-sm text-red-700 font-mono">{selectedExtraction.errorMessage}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                <button 
                  onClick={() => setIsExtractionDetailOpen(false)}
                  className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  const renderLogDetailModal = () => {
    if (!selectedLog) return null;

    return (
      <AnimatePresence>
        {isLogDetailOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogDetailOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Chi tiết sự kiện</h2>
                <button 
                  onClick={() => setIsLogDetailOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Tên sự kiện</p>
                    <p className="text-sm font-medium text-gray-900">{selectedLog.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Trạng thái</p>
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                      LOG_STATUS_DISPLAY[selectedLog.status].color
                    )}>
                      {LOG_STATUS_DISPLAY[selectedLog.status].label}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Start Time</p>
                    <p className="text-sm text-gray-600">{selectedLog.startTime}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">End Time</p>
                    <p className="text-sm text-gray-600">{selectedLog.endTime}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Thời lượng</p>
                    <p className="text-sm text-gray-600">{selectedLog.duration}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Thay đổi bởi</p>
                    <p className="text-sm text-gray-600">{selectedLog.modifiedBy}</p>
                  </div>
                </div>
                
                {(selectedLog.status === 'error' || selectedLog.status === 'failure') && (
                  <div className={cn(
                    "p-4 rounded-xl border",
                    selectedLog.status === 'error' ? "bg-amber-50 border-amber-100" : "bg-red-50 border-red-100"
                  )}>
                    <p className={cn(
                      "text-[10px] font-bold uppercase mb-1",
                      selectedLog.status === 'error' ? "text-amber-400" : "text-red-400"
                    )}>Chi tiết lỗi</p>
                    <p className={cn(
                      "text-sm",
                      selectedLog.status === 'error' ? "text-amber-700" : "text-red-700"
                    )}>{selectedLog.reason || "Không có thông tin chi tiết lỗi."}</p>
                  </div>
                )}

                {selectedLog.changeDescription && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Mô tả thay đổi</p>
                    <p className="text-sm text-blue-700">{selectedLog.changeDescription}</p>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={() => setIsLogDetailOpen(false)}
                    className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  const renderSchemaSnapshotModal = () => {
    if (!selectedVersionSnapshot) return null;

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVersionSnapshot(null)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedVersionSnapshot.versionName || `Phiên bản v${selectedVersionSnapshot.version}`}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Cập nhật lúc: {selectedVersionSnapshot.createdAt}
                </p>
              </div>
              <button 
                onClick={() => setSelectedVersionSnapshot(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="overflow-x-auto border border-gray-100 rounded-xl mb-6">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="px-4 py-3">Trường dữ liệu</th>
                      <th className="px-4 py-3 text-center">Bắt buộc</th>
                      <th className="px-4 py-3">Kiểu dữ liệu</th>
                      <th className="px-4 py-3">Điều kiện & Ràng buộc</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(selectedVersionSnapshot.schema || selectedSource?.schema || []).map((field: any) => (
                      <React.Fragment key={field.id}>
                        <tr className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-900">
                            <div className="flex items-center gap-2">
                              {field.name}
                              {field.isGreenFlow && <div className="w-2 h-2 bg-green-500 rounded-full" title="Green Flow" />}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {field.isRequired ? (
                              <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-[10px] font-bold">YES</span>
                            ) : (
                              <span className="text-gray-400 text-[10px] font-bold">NO</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-blue-600 font-mono text-[10px]">{field.dataType}</td>
                          <td className="px-4 py-3">
                            <div className="space-y-1">
                              {field.conditions?.map((cond: any) => (
                                <div key={cond.id} className="text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                  <span className="font-bold text-gray-700">{cond.type}:</span> {cond.errorMessage}
                                </div>
                              ))}
                              {(!field.conditions || field.conditions.length === 0) && <span className="text-gray-300 italic text-[10px]">Không có</span>}
                            </div>
                          </td>
                        </tr>
                        {field.children?.map((child: any) => (
                          <tr key={child.id} className="bg-gray-50/30 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 pl-10 font-medium text-gray-600">
                              <div className="flex items-center gap-2">
                                <CornerDownRight size={12} className="text-gray-400" />
                                {child.name}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {child.isRequired ? (
                                <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-[10px] font-bold">YES</span>
                              ) : (
                                <span className="text-gray-400 text-[10px] font-bold">NO</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-blue-600 font-mono text-[10px]">{child.dataType}</td>
                            <td className="px-4 py-3">
                              <div className="space-y-1">
                                {child.conditions?.map((cond: any) => (
                                  <div key={cond.id} className="text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                    <span className="font-bold text-gray-700">{cond.type}:</span> {cond.errorMessage}
                                  </div>
                                ))}
                                {(!child.conditions || child.conditions.length === 0) && <span className="text-gray-300 italic text-[10px]">Không có</span>}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedVersionSnapshot.description && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Mô tả thay đổi</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedVersionSnapshot.description}</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end bg-gray-50/30">
              <button 
                onClick={() => setSelectedVersionSnapshot(null)}
                className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  };

  const renderEditSchema = () => {
    if (!selectedSource) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsEditingSchema(false)} 
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              title="Quay lại"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-bold">Sửa tiêu chí kiểm tra dữ liệu</h2>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsEditingSchema(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Hủy bỏ
            </button>
            <button 
              onClick={() => {
                setNewVersionInfo({ name: '', description: '' });
                setIsSaveAsNewVersionModalOpen(true);
              }}
              className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all font-bold shadow-lg shadow-blue-200"
            >
              Lưu
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Trường dữ liệu</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-24">Bắt buộc</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-40">Kiểu dữ liệu</th>
                <th colSpan={3} className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Điều kiện & Ràng buộc</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {editingSchema?.map((field: any) => (
                <React.Fragment key={field.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        {field.name}
                        {field.children && <ChevronDown size={14} className="text-gray-400" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input 
                        type="checkbox" 
                        checked={field.isRequired} 
                        onChange={() => toggleRequired(field.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select 
                        value={field.dataType}
                        onChange={(e) => updateFieldType(field.id, e.target.value)}
                        className="bg-transparent border-none focus:ring-0 p-0 text-xs text-gray-600"
                      >
                        <option value={field.dataType}>{field.dataType}</option>
                        <option value="Chữ (String)">Chữ (String)</option>
                        <option value="Số nguyên lớn (BigInt)">Số nguyên lớn (BigInt)</option>
                        <option value="Số nguyên 32-bit (Int32)">Số nguyên 32-bit (Int32)</option>
                        <option value="Số nguyên 64-bit (Int64)">Số nguyên 64-bit (Int64)</option>
                        <option value="Số thập phân (Decimal)">Số thập phân (Decimal)</option>
                        <option value="True/False (Boolean)">True/False (Boolean)</option>
                        <option value="Đối tượng (Object)">Đối tượng (Object)</option>
                      </select>
                    </td>
                    <td colSpan={3} className="p-0 border-l border-gray-100">
                      <div className="flex flex-col">
                        {field.conditions?.map((cond: any) => (
                          <div key={cond.id} className="flex items-center gap-2 p-2 border-b border-gray-50 last:border-0">
                            <div className="w-1/3">
                              <select 
                                value={cond.type}
                                onChange={(e) => updateCondition(field.id, cond.id, { type: e.target.value })}
                                className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              >
                                <option>Loại con duy nhất</option>
                                <option>Ít nhất một</option>
                                <option>Bắt buộc (có điều kiện)</option>
                              </select>
                            </div>
                            <div className="w-1/3">
                              <input 
                                type="text"
                                placeholder="Thông báo lỗi"
                                value={cond.errorMessage}
                                onChange={(e) => updateCondition(field.id, cond.id, { errorMessage: e.target.value })}
                                className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex-1 flex gap-2 items-center">
                              {cond.type === 'Bắt buộc (có điều kiện)' ? (
                                <>
                                  <input 
                                    type="text"
                                    placeholder="Trường phụ thuộc"
                                    value={cond.dependentField}
                                    onChange={(e) => updateCondition(field.id, cond.id, { dependentField: e.target.value })}
                                    className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  />
                                  <div className="flex-1">
                                    <TagInput 
                                      values={cond.dependentValues || []}
                                      onChange={(newValues) => updateCondition(field.id, cond.id, { dependentValues: newValues })}
                                      placeholder="Giá trị"
                                    />
                                  </div>
                                </>
                              ) : (
                                <div className="w-full">
                                  <TagInput 
                                    values={cond.conditionValues || []}
                                    onChange={(newValues) => updateCondition(field.id, cond.id, { conditionValues: newValues })}
                                    placeholder="Danh sách giá trị"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <button 
                                onClick={() => addCondition(field.id)}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Thêm điều kiện"
                              >
                                <Plus size={14} />
                              </button>
                              <button 
                                onClick={() => setDeleteConditionConfirm({ fieldId: field.id, conditionId: cond.id })}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="Xoá điều kiện"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {(!field.conditions || field.conditions.length === 0) && (
                          <div className="flex justify-center p-2">
                            <button 
                              onClick={() => addCondition(field.id)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition-colors"
                              title="Thêm điều kiện mới"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => setDeleteFieldConfirm(field.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                  {field.children?.map((child: any) => (
                    <tr key={child.id} className="bg-gray-50/30 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 pl-10 font-medium text-gray-600">
                        <div className="flex items-center gap-2">
                          {child.name}
                          <FileText size={12} className="text-gray-400" />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={child.isRequired} 
                          onChange={() => toggleRequired(child.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select 
                          value={child.dataType}
                          onChange={(e) => updateFieldType(child.id, e.target.value)}
                          className="bg-transparent border-none focus:ring-0 p-0 text-xs text-gray-600"
                        >
                          <option value={child.dataType}>{child.dataType}</option>
                          <option value="Chữ (String)">Chữ (String)</option>
                          <option value="Số nguyên lớn (BigInt)">Số nguyên lớn (BigInt)</option>
                          <option value="Số nguyên 32-bit (Int32)">Số nguyên 32-bit (Int32)</option>
                          <option value="Số nguyên 64-bit (Int64)">Số nguyên 64-bit (Int64)</option>
                          <option value="Số thập phân (Decimal)">Số thập phân (Decimal)</option>
                          <option value="True/False (Boolean)">True/False (Boolean)</option>
                          <option value="Đối tượng (Object)">Đối tượng (Object)</option>
                        </select>
                      </td>
                       <td colSpan={3} className="p-0 border-l border-gray-100">
                         <div className="flex flex-col">
                           {child.conditions?.map((cond: any) => (
                             <div key={cond.id} className="flex items-center gap-2 p-2 border-b border-gray-50 last:border-0">
                               <div className="w-1/3">
                                 <select 
                                   value={cond.type}
                                   onChange={(e) => updateCondition(child.id, cond.id, { type: e.target.value })}
                                   className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                 >
                                   <option>Loại con duy nhất</option>
                                   <option>Ít nhất một</option>
                                   <option>Bắt buộc (có điều kiện)</option>
                                 </select>
                               </div>
                               <div className="w-1/3">
                                 <input 
                                   type="text"
                                   placeholder="Thông báo lỗi"
                                   value={cond.errorMessage}
                                   onChange={(e) => updateCondition(child.id, cond.id, { errorMessage: e.target.value })}
                                   className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                 />
                               </div>
                               <div className="flex-1 flex gap-2 items-center">
                                 {cond.type === 'Bắt buộc (có điều kiện)' ? (
                                   <>
                                     <input 
                                       type="text"
                                       placeholder="Trường phụ thuộc"
                                       value={cond.dependentField}
                                       onChange={(e) => updateCondition(child.id, cond.id, { dependentField: e.target.value })}
                                       className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                     />
                                     <div className="flex-1">
                                       <TagInput 
                                         values={cond.dependentValues || []}
                                         onChange={(newValues) => updateCondition(child.id, cond.id, { dependentValues: newValues })}
                                         placeholder="Giá trị"
                                       />
                                     </div>
                                   </>
                                 ) : (
                                   <div className="w-full">
                                     <TagInput 
                                       values={cond.conditionValues || []}
                                       onChange={(newValues) => updateCondition(child.id, cond.id, { conditionValues: newValues })}
                                       placeholder="Danh sách giá trị"
                                     />
                                   </div>
                                 )}
                               </div>
                               <div className="flex gap-1">
                                 <button 
                                   onClick={() => addCondition(child.id)}
                                   className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                   title="Thêm điều kiện"
                                 >
                                   <Plus size={14} />
                                 </button>
                                 <button 
                                   onClick={() => setDeleteConditionConfirm({ fieldId: child.id, conditionId: cond.id })}
                                   className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                   title="Xoá điều kiện"
                                 >
                                   <Trash2 size={14} />
                                 </button>
                               </div>
                             </div>
                           ))}
                           {(!child.conditions || child.conditions.length === 0) && (
                             <div className="flex justify-center p-2">
                               <button 
                                 onClick={() => addCondition(child.id)}
                                 className="p-1 text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition-colors"
                                 title="Thêm điều kiện mới"
                               >
                                 <Plus size={16} />
                               </button>
                             </div>
                           )}
                         </div>
                       </td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          onClick={() => setDeleteFieldConfirm(child.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSaveAsNewVersionModal = () => (
    <AnimatePresence>
      {isSaveAsNewVersionModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSaveAsNewVersionModalOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-[#1e293b]">Lưu phiên bản mới</h3>
                <button onClick={() => setIsSaveAsNewVersionModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>
              <p className="text-gray-500">Vui lòng nhập thông tin phiên bản để lưu lại lịch sử thay đổi.</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Tên phiên bản <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: Cập nhật tiêu chí tháng 4"
                  value={newVersionInfo.name}
                  onChange={(e) => setNewVersionInfo({ ...newVersionInfo, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Mô tả thay đổi <span className="text-red-500">*</span>
                </label>
                <textarea 
                  rows={4}
                  placeholder="Nhập chi tiết các thay đổi..."
                  value={newVersionInfo.description}
                  onChange={(e) => setNewVersionInfo({ ...newVersionInfo, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>
            </div>

            <div className="p-8 border-t border-gray-100 flex gap-4">
              <button 
                onClick={() => setIsSaveAsNewVersionModalOpen(false)}
                className="flex-1 py-3.5 border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all"
              >
                Hủy
              </button>
              <button 
                disabled={!newVersionInfo.name.trim() || !newVersionInfo.description.trim()}
                onClick={() => {
                  if (!selectedSource) return;
                  
                  const nextVersionNum = (selectedSource.schemaVersions?.length || 0) + 1;
                  const newVersion = {
                    id: Math.random().toString(36).substr(2, 9),
                    version: `1.0.${nextVersionNum}`,
                    versionName: newVersionInfo.name,
                    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                    createdBy: 'Nguyễn Văn A',
                    description: newVersionInfo.description,
                    tableCount: editingSchema.length,
                    schema: JSON.parse(JSON.stringify(editingSchema)) // Snapshot
                  };
                  
                  const updatedSource = {
                    ...selectedSource,
                    schema: editingSchema,
                    schemaVersion: newVersion.version,
                    schemaVersions: [newVersion, ...(selectedSource.schemaVersions || [])]
                  };
                  
                  setSelectedSource(updatedSource);
                  setIsSaveAsNewVersionModalOpen(false);
                  setIsEditingSchema(false);
                  setNewVersionInfo({ name: '', description: '' });
                  showNotification(`Đã lưu phiên bản "${newVersion.versionName}" thành công.`);
                }}
                className="flex-1 py-3.5 bg-[#2563eb] text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Xác nhận lưu
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderSaveInfoConfirmModal = () => (
    <AnimatePresence>
      {isSaveInfoConfirmOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSaveInfoConfirmOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Save size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận lưu thay đổi</h3>
              <p className="text-gray-500">Bạn có chắc chắn muốn lưu các thay đổi thông tin dịch vụ này không?</p>
            </div>
            
            <div className="p-6 bg-gray-50 flex gap-3">
              <button 
                onClick={() => setIsSaveInfoConfirmOpen(false)}
                className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-all"
              >
                Hủy
              </button>
              <button 
                onClick={() => {
                  setIsSaveInfoConfirmOpen(false);
                  setDetailTab('overview');
                  showNotification('Đã cập nhật thông tin dịch vụ thành công.');
                }}
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Xác nhận lưu
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderNormalizationConfirmModal = () => (
    <AnimatePresence>
      {isNormalizationConfirmOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsNormalizationConfirmOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6",
                selectedSource?.isNormalizationEnabled ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
              )}>
                <Power size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Xác nhận {selectedSource?.isNormalizationEnabled ? 'tắt' : 'bật'} dịch vụ
              </h3>
              <p className="text-gray-500">
                Bạn có chắc chắn muốn {selectedSource?.isNormalizationEnabled ? 'tắt' : 'bật'} dịch vụ kiểm tra phục vụ chuẩn hóa dữ liệu không?
              </p>
            </div>
            
            <div className="p-6 bg-gray-50 flex gap-3">
              <button 
                onClick={() => setIsNormalizationConfirmOpen(false)}
                className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-all"
              >
                Hủy
              </button>
              <button 
                onClick={() => {
                  toggleNormalization();
                  setIsNormalizationConfirmOpen(false);
                }}
                className={cn(
                  "flex-1 py-3 text-white font-bold rounded-xl transition-all shadow-lg",
                  selectedSource?.isNormalizationEnabled ? "bg-red-600 hover:bg-red-700 shadow-red-100" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
                )}
              >
                Xác nhận
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderReconciliationConfirmModal = () => (
    <AnimatePresence>
      {isReconciliationConfirmOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsReconciliationConfirmOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6",
                selectedSource?.isReconciliationEnabled ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
              )}>
                <Power size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Xác nhận {selectedSource?.isReconciliationEnabled ? 'tắt' : 'bật'} dịch vụ
              </h3>
              <p className="text-gray-500">
                Bạn có chắc chắn muốn {selectedSource?.isReconciliationEnabled ? 'tắt' : 'bật'} dịch vụ đối soát dữ liệu không?
              </p>
            </div>
            
            <div className="p-6 bg-gray-50 flex gap-3">
              <button 
                onClick={() => setIsReconciliationConfirmOpen(false)}
                className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-all"
              >
                Hủy
              </button>
              <button 
                onClick={() => {
                  toggleReconciliation();
                  setIsReconciliationConfirmOpen(false);
                }}
                className={cn(
                  "flex-1 py-3 text-white font-bold rounded-xl transition-all shadow-lg",
                  selectedSource?.isReconciliationEnabled ? "bg-red-600 hover:bg-red-700 shadow-red-100" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
                )}
              >
                Xác nhận
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderStatusConfirmModal = () => {
    if (!selectedSource) return null;
    const isDeactivating = selectedSource.status === 'connected';

    return (
      <AnimatePresence>
        {isStatusConfirmOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStatusConfirmOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden pt-12"
            >
              <div className="px-8 text-center">
                <div className="w-24 h-24 rounded-full border-2 border-orange-200 flex items-center justify-center mx-auto mb-8">
                  <span className="text-5xl text-orange-300 font-light">!</span>
                </div>
                
                <h3 className="text-2xl font-bold text-[#1e293b] mb-4">
                  Xác nhận {isDeactivating ? 'vô hiệu hóa' : 'kích hoạt'}
                </h3>
                <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                  {isDeactivating 
                    ? "Dịch vụ sẽ ngừng hoạt động và không thể thực hiện trích rút dữ liệu cho đến khi được kích hoạt lại." 
                    : "Dịch vụ sẽ bắt đầu hoạt động và sẵn sàng cho các yêu cầu trích rút dữ liệu."}
                </p>
              </div>

              <div className="border-t border-gray-100 p-8 flex justify-end gap-4">
                <button 
                  onClick={() => setIsStatusConfirmOpen(false)}
                  className="px-10 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all min-w-[140px]"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => {
                    toggleSourceStatus();
                    setIsStatusConfirmOpen(false);
                    showNotification(`Đã ${isDeactivating ? 'vô hiệu hóa' : 'kích hoạt'} dịch vụ thành công.`);
                  }}
                  className="px-10 py-3 rounded-2xl bg-[#2563eb] text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all min-w-[140px]"
                >
                  Xác nhận
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  const renderEditRestrictedModal = () => {
    return (
      <AnimatePresence>
        {isEditRestrictedOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditRestrictedOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden pt-12"
            >
              <div className="px-8 text-center">
                <div className="w-24 h-24 rounded-full border-2 border-orange-200 flex items-center justify-center mx-auto mb-8">
                  <span className="text-5xl text-orange-300 font-light">!</span>
                </div>
                
                <h3 className="text-2xl font-bold text-[#1e293b] mb-4">
                  Không thể chỉnh sửa
                </h3>
                <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                  Dịch vụ dữ liệu đang được <span className="font-bold text-blue-600">kích hoạt</span>. Để chỉnh sửa cấu hình, vui lòng <span className="font-bold text-red-600">vô hiệu hóa</span> dịch vụ trước.
                </p>
              </div>

              <div className="border-t border-gray-100 p-8 flex justify-end">
                <button 
                  onClick={() => setIsEditRestrictedOpen(false)}
                  className="px-10 py-3 rounded-2xl bg-[#2563eb] text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all min-w-[140px]"
                >
                  Đã hiểu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  const renderSourceDetail = () => {
    if (!selectedSource) return null;

    return (
      <div className="p-6 space-y-6">
        {isEditingSchema ? (
          renderEditSchema()
        ) : (
          <>
            <div className="flex items-center gap-4">
          <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
              {selectedSource.type.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedSource.name}</h1>
              <p className="text-sm text-gray-500">{selectedSource.type}</p>
            </div>
          </div>
          <div className="ml-auto flex gap-3">
            <button 
              onClick={() => setIsStatusConfirmOpen(true)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border shadow-sm",
                selectedSource.status === 'connected' 
                  ? "bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300" 
                  : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-blue-100"
              )}
            >
              <Power size={16} />
              {selectedSource.status === 'connected' ? 'Vô hiệu hóa dịch vụ' : 'Kích hoạt dịch vụ'}
            </button>
          </div>
        </div>
        {renderStatusConfirmModal()}

        <div className="flex border-b border-gray-200">
          {[
            { id: 'overview', label: 'Tổng quan' },
            { id: 'edit', label: 'Thông tin dịch vụ' },
            { id: 'versions', label: 'Lịch sử thiết lập tiêu chí' },
            { id: 'logs', label: 'Lịch sử thay đổi' }
          ].map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => setDetailTab(tab.id as any)}
              className={cn(
                "px-6 py-3 text-sm font-medium border-b-2 transition-all",
                detailTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={cn(
          "grid gap-6",
          (detailTab === 'edit' || detailTab === 'logs' || detailTab === 'versions') ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
        )}>
          <div className={cn(
            "space-y-6",
            (detailTab === 'edit' || detailTab === 'logs' || detailTab === 'versions') ? "" : "lg:col-span-2"
          )}>
            {detailTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 font-bold text-gray-900">
                        <Database size={20} className="text-blue-600" />
                        Dịch vụ kiểm tra phục vụ chuẩn hóa dữ liệu
                      </div>
                      <Switch 
                        enabled={!!selectedSource.isNormalizationEnabled} 
                        onChange={() => setIsNormalizationConfirmOpen(true)} 
                      />
                    </div>
                    <button 
                      onClick={() => {
                        if (selectedSource.status === 'connected') {
                          setIsEditRestrictedOpen(true);
                        } else {
                          setEditingSchema(selectedSource.schema || []);
                          setIsEditingSchema(true);
                        }
                      }}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Edit2 size={16} />
                      Sửa
                    </button>
                  </div>
                  {renderEditRestrictedModal()}
                  
                  {selectedSource.schema ? (
                    <div className={cn("space-y-4 transition-opacity", !selectedSource.isNormalizationEnabled && "opacity-50 pointer-events-none")}>
                      <div className="text-sm font-bold text-gray-700">Bảng tiêu chí kiểm tra chuẩn hóa dữ liệu</div>
                      <div className="overflow-x-auto border border-gray-100 rounded-xl">
                        <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold">
                          <tr>
                            <th className="px-4 py-3">Trường dữ liệu</th>
                            <th className="px-4 py-3 text-center">Bắt buộc</th>
                            <th className="px-4 py-3">Kiểu dữ liệu</th>
                            <th className="px-4 py-3">Điều kiện & Ràng buộc</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {selectedSource.schema?.map((field) => (
                            <React.Fragment key={field.id}>
                              <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-3 font-medium text-gray-900">
                                  <div className="flex items-center gap-2">
                                    {field.name}
                                    {field.isGreenFlow && <div className="w-2 h-2 bg-green-500 rounded-full" title="Green Flow" />}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  {field.isRequired ? (
                                    <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-[10px] font-bold">YES</span>
                                  ) : (
                                    <span className="text-gray-400 text-[10px] font-bold">NO</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-blue-600 font-mono text-[10px]">{field.dataType}</td>
                                <td className="px-4 py-3">
                                  <div className="space-y-1">
                                    {field.conditions?.map((cond) => (
                                      <div key={cond.id} className="text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                        <span className="font-bold text-gray-700">{cond.type}:</span> {cond.errorMessage}
                                      </div>
                                    ))}
                                    {(!field.conditions || field.conditions.length === 0) && <span className="text-gray-300 italic text-[10px]">Không có</span>}
                                  </div>
                                </td>
                              </tr>
                              {field.children?.map((child) => (
                                <tr key={child.id} className="bg-gray-50/30 hover:bg-gray-50 transition-colors">
                                  <td className="px-4 py-3 pl-10 font-medium text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <CornerDownRight size={12} className="text-gray-400" />
                                      {child.name}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {child.isRequired ? (
                                      <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-[10px] font-bold">YES</span>
                                    ) : (
                                      <span className="text-gray-400 text-[10px] font-bold">NO</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-blue-600 font-mono text-[10px]">{child.dataType}</td>
                                  <td className="px-4 py-3">
                                    <div className="space-y-1">
                                      {child.conditions?.map((cond) => (
                                        <div key={cond.id} className="text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                          <span className="font-bold text-gray-700">{cond.type}:</span> {cond.errorMessage}
                                        </div>
                                      ))}
                                      {(!child.conditions || child.conditions.length === 0) && <span className="text-gray-300 italic text-[10px]">Không có</span>}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Database className="text-gray-300" size={32} />
                      </div>
                      <p className="text-gray-500 text-sm">Chưa có thông tin schema cho dịch vụ này.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {detailTab === 'logs' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[500px]">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 shrink-0 relative bg-white">
                  <div className="font-bold text-gray-900 whitespace-nowrap">
                    Lịch sử thay đổi
                  </div>
                  
                  <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm nhật ký..." 
                      className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={logSearchQuery}
                      onChange={(e) => { setLogSearchQuery(e.target.value); setLogCurrentPage(1); }}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        if (!isFilterOpen) setTempLogFilters(logFilters);
                        setIsFilterOpen(!isFilterOpen);
                      }}
                      className={cn(
                        "p-2 rounded-lg transition-all relative border",
                        isFilterOpen ? "bg-blue-50 border-blue-200 text-blue-600" : "text-gray-500 border-transparent hover:bg-gray-100"
                      )}
                      title="Lọc"
                    >
                      <Filter size={20} />
                      {activeLogFiltersCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                          {activeLogFiltersCount}
                        </span>
                      )}
                    </button>
                    <button 
                      onClick={() => { setLogSearchQuery(''); setLogCurrentPage(1); setLogFilters({ statuses: [], creators: [], dateRange: { start: '', end: '' } }); setTempLogFilters({ statuses: [], creators: [], dateRange: { start: '', end: '' } }); setLogSortConfig(null); }}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-transparent" 
                      title="Làm mới"
                    >
                      <RefreshCw size={20} />
                    </button>
                    <button 
                      onClick={() => handleDownload(MOCK_EVENT_LOGS, `nhat-ky-${selectedSource.name}`)}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-transparent" 
                      title="Tải về"
                    >
                      <Download size={20} />
                    </button>
                  </div>

                  {/* Log Filter Dropdown */}
                  <AnimatePresence>
                    {isFilterOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-4 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-4 space-y-4"
                      >
                        <div className="space-y-3">
                          <MultiSelectFilter 
                            label="Trạng thái"
                            options={[
                              { label: 'Thành công', value: 'success' },
                              { label: 'Thất bại', value: 'failure' },
                              { label: 'Lỗi', value: 'error' }
                            ]}
                            selectedValues={tempLogFilters.statuses}
                            onChange={(vals) => setTempLogFilters({...tempLogFilters, statuses: vals})}
                            placeholder="Tất cả trạng thái"
                          />
                          <MultiSelectFilter 
                            label="Thay đổi bởi"
                            options={[
                              { label: 'Nguyễn Văn A', value: 'Nguyễn Văn A' },
                              { label: 'Trần Thị B', value: 'Trần Thị B' },
                              { label: 'Lê Văn C', value: 'Lê Văn C' },
                              { label: 'Hệ thống', value: 'Hệ thống' }
                            ]}
                            selectedValues={tempLogFilters.creators}
                            onChange={(vals) => setTempLogFilters({...tempLogFilters, creators: vals})}
                            placeholder="Tất cả"
                          />
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Khoảng thời gian</label>
                            <div className="grid grid-cols-2 gap-2">
                              <input 
                                type="date" 
                                className="w-full px-2 py-1.5 text-[10px] rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                value={tempLogFilters.dateRange.start}
                                onChange={(e) => setTempLogFilters({...tempLogFilters, dateRange: {...tempLogFilters.dateRange, start: e.target.value}})}
                              />
                              <input 
                                type="date" 
                                className="w-full px-2 py-1.5 text-[10px] rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                value={tempLogFilters.dateRange.end}
                                onChange={(e) => setTempLogFilters({...tempLogFilters, dateRange: {...tempLogFilters.dateRange, end: e.target.value}})}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                          <button 
                            onClick={() => {
                              const reset = { statuses: [], creators: [], dateRange: { start: '', end: '' } };
                              setTempLogFilters(reset);
                              setLogFilters(reset);
                              setLogCurrentPage(1);
                            }}
                            className="text-[10px] font-bold text-gray-400 hover:text-gray-600 px-3 py-1"
                          >
                            Xóa lọc
                          </button>
                          <button 
                            onClick={() => {
                              setLogFilters(tempLogFilters);
                              setIsFilterOpen(false);
                              setLogCurrentPage(1);
                            }}
                            className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-lg"
                          >
                            Áp dụng
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 text-gray-500 text-[10px] uppercase tracking-wider sticky top-0 bg-white z-10">
                        <th 
                          onClick={() => handleLogSort('name')}
                          className={cn(
                            "px-6 py-3 font-semibold cursor-pointer hover:text-blue-600 transition-colors",
                            logSortConfig?.key === 'name' && "text-blue-600 bg-blue-50/30"
                          )}
                        >
                          <div className="flex items-center gap-1">
                            Tên sự kiện 
                            {logSortConfig?.key === 'name' ? (
                              logSortConfig.direction === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />
                            ) : <ArrowUpDown size={10} />}
                          </div>
                        </th>
                        <th 
                          onClick={() => handleLogSort('status')}
                          className={cn(
                            "px-6 py-3 font-semibold cursor-pointer hover:text-blue-600 transition-colors",
                            logSortConfig?.key === 'status' && "text-blue-600 bg-blue-50/30"
                          )}
                        >
                          <div className="flex items-center gap-1">
                            Trạng thái 
                            {logSortConfig?.key === 'status' ? (
                              logSortConfig.direction === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />
                            ) : <ArrowUpDown size={10} />}
                          </div>
                        </th>
                        <th 
                          onClick={() => handleLogSort('startTime')}
                          className={cn(
                            "px-6 py-3 font-semibold cursor-pointer hover:text-blue-600 transition-colors",
                            logSortConfig?.key === 'startTime' && "text-blue-600 bg-blue-50/30"
                          )}
                        >
                          <div className="flex items-center gap-1">
                            Thời gian 
                            {logSortConfig?.key === 'startTime' ? (
                              logSortConfig.direction === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />
                            ) : <ArrowUpDown size={10} />}
                          </div>
                        </th>
                        <th 
                          onClick={() => handleLogSort('modifiedBy')}
                          className={cn(
                            "px-6 py-3 font-semibold cursor-pointer hover:text-blue-600 transition-colors",
                            logSortConfig?.key === 'modifiedBy' && "text-blue-600 bg-blue-50/30"
                          )}
                        >
                          <div className="flex items-center gap-1">
                            Thay đổi bởi 
                            {logSortConfig?.key === 'modifiedBy' ? (
                              logSortConfig.direction === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />
                            ) : <ArrowUpDown size={10} />}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {MOCK_EVENT_LOGS
                        .filter(l => l.name.toLowerCase().includes(logSearchQuery.toLowerCase()))
                        .filter(l => logFilters.statuses.length === 0 || logFilters.statuses.includes(l.status))
                        .filter(l => logFilters.creators.length === 0 || logFilters.creators.includes(l.modifiedBy))
                        .filter(l => {
                          if (!logFilters.dateRange.start && !logFilters.dateRange.end) return true;
                          const logTime = new Date(l.startTime || '').getTime();
                          const start = logFilters.dateRange.start ? new Date(logFilters.dateRange.start).getTime() : 0;
                          const end = logFilters.dateRange.end ? new Date(logFilters.dateRange.end).getTime() + 86399999 : Infinity;
                          return logTime >= start && logTime <= end;
                        })
                        .sort((a, b) => {
                          if (!logSortConfig) return 0;
                          const { key, direction } = logSortConfig;
                          const aVal = a[key] || '';
                          const bVal = b[key] || '';
                          if (aVal < bVal) return direction === 'asc' ? -1 : 1;
                          if (aVal > bVal) return direction === 'asc' ? 1 : -1;
                          return 0;
                        })
                        .slice((logCurrentPage - 1) * 10, logCurrentPage * 10)
                        .map((log) => (
                          <tr 
                            key={log.id} 
                            className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                            onClick={() => { setSelectedLog(log); setIsLogDetailOpen(true); }}
                          >
                            <td className="px-6 py-4 text-sm font-medium text-blue-600">{log.name}</td>
                            <td className="px-6 py-4">
                              <span className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                LOG_STATUS_DISPLAY[log.status].color
                              )}>
                                {LOG_STATUS_DISPLAY[log.status].label}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-500">{log.startTime}</td>
                            <td className="px-6 py-4 text-xs text-gray-600 font-medium">{log.modifiedBy}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination for logs */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30 shrink-0">
                  <p className="text-xs text-gray-500">
                    Hiển thị <span className="font-medium">{(logCurrentPage - 1) * 10 + 1}</span> đến <span className="font-medium">{Math.min(logCurrentPage * 10, MOCK_EVENT_LOGS.length)}</span> trong <span className="font-medium">{MOCK_EVENT_LOGS.length}</span> kết quả
                  </p>
                  <div className="flex items-center gap-1">
                    <button 
                      disabled={logCurrentPage === 1}
                      onClick={() => setLogCurrentPage(logCurrentPage - 1)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 disabled:opacity-30 transition-colors"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button 
                      disabled={logCurrentPage * 10 >= MOCK_EVENT_LOGS.length}
                      onClick={() => setLogCurrentPage(logCurrentPage + 1)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 disabled:opacity-30 transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {detailTab === 'versions' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[500px]">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 shrink-0 relative bg-white">
                  <div className="font-bold text-gray-900 whitespace-nowrap">
                    Lịch sử thiết lập tiêu chí
                  </div>
                  
                  <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm phiên bản..." 
                      className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={versionSearchQuery}
                      onChange={(e) => { setVersionSearchQuery(e.target.value); setVersionCurrentPage(1); }}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        if (!isVersionFilterOpen) setTempVersionFilters(versionFilters);
                        setIsVersionFilterOpen(!isVersionFilterOpen);
                      }}
                      className={cn(
                        "p-2 rounded-lg transition-all relative border",
                        isVersionFilterOpen ? "bg-blue-50 border-blue-200 text-blue-600" : "text-gray-500 border-transparent hover:bg-gray-100"
                      )}
                      title="Lọc"
                    >
                      <Filter size={20} />
                      {activeVersionFiltersCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                          {activeVersionFiltersCount}
                        </span>
                      )}
                    </button>
                    <button 
                      onClick={() => { setVersionSearchQuery(''); setVersionFilters({ creators: [], dateRange: { start: '', end: '' } }); setTempVersionFilters({ creators: [], dateRange: { start: '', end: '' } }); }}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-transparent" 
                      title="Làm mới"
                    >
                      <RefreshCw size={20} />
                    </button>
                    <button 
                      onClick={() => handleDownload(selectedSource.schemaVersions || [], `lich-su-thiet-lap-tieu-chi-${selectedSource.name}`)}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-transparent" 
                      title="Tải về"
                    >
                      <Download size={20} />
                    </button>
                  </div>

                  {/* Version Filter Dropdown */}
                  <AnimatePresence>
                    {isVersionFilterOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-4 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-4 space-y-4"
                      >
                        <div className="space-y-3">
                          <MultiSelectFilter 
                            label="Người cập nhật"
                            options={[
                              { label: 'Nguyễn Văn A', value: 'Nguyễn Văn A' },
                              { label: 'Trần Thị B', value: 'Trần Thị B' },
                              { label: 'Lê Văn C', value: 'Lê Văn C' }
                            ]}
                            selectedValues={tempVersionFilters.creators}
                            onChange={(vals) => setTempVersionFilters({...tempVersionFilters, creators: vals})}
                            placeholder="Tất cả"
                          />
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Khoảng thời gian</label>
                            <div className="grid grid-cols-2 gap-2">
                              <input 
                                type="date" 
                                className="w-full px-2 py-1.5 text-[10px] rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                value={tempVersionFilters.dateRange.start}
                                onChange={(e) => setTempVersionFilters({...tempVersionFilters, dateRange: {...tempVersionFilters.dateRange, start: e.target.value}})}
                              />
                              <input 
                                type="date" 
                                className="w-full px-2 py-1.5 text-[10px] rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                value={tempVersionFilters.dateRange.end}
                                onChange={(e) => setTempVersionFilters({...tempVersionFilters, dateRange: {...tempVersionFilters.dateRange, end: e.target.value}})}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                          <button 
                            onClick={() => {
                              const reset = { creators: [], dateRange: { start: '', end: '' } };
                              setTempVersionFilters(reset);
                              setVersionFilters(reset);
                              setVersionCurrentPage(1);
                            }}
                            className="text-[10px] font-bold text-gray-400 hover:text-gray-600 px-3 py-1"
                          >
                            Xóa lọc
                          </button>
                          <button 
                            onClick={() => {
                              setVersionFilters(tempVersionFilters);
                              setIsVersionFilterOpen(false);
                              setVersionCurrentPage(1);
                            }}
                            className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-lg"
                          >
                            Áp dụng
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-gray-500 text-[10px] uppercase font-bold sticky top-0 bg-white z-10">
                      <tr>
                        <th className="px-6 py-3">Tên phiên bản</th>
                        <th className="px-6 py-3">Thời gian cập nhật</th>
                        <th className="px-6 py-3">Người cập nhật</th>
                        <th className="px-6 py-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedSource.schemaVersions
                        ?.filter(v => v.versionName?.toLowerCase().includes(versionSearchQuery.toLowerCase()) || `v${v.version}`.includes(versionSearchQuery.toLowerCase()))
                        .filter(v => versionFilters.creators.length === 0 || versionFilters.creators.includes(v.createdBy))
                        .filter(v => {
                          if (!versionFilters.dateRange.start && !versionFilters.dateRange.end) return true;
                          const vTime = new Date(v.createdAt).getTime();
                          const start = versionFilters.dateRange.start ? new Date(versionFilters.dateRange.start).getTime() : 0;
                          const end = versionFilters.dateRange.end ? new Date(versionFilters.dateRange.end).getTime() + 86399999 : Infinity;
                          return vTime >= start && vTime <= end;
                        })
                        .slice((versionCurrentPage - 1) * 10, versionCurrentPage * 10)
                        .map((v) => (
                        <tr 
                          key={v.id} 
                          className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                          onClick={() => setSelectedVersionSnapshot(v)}
                        >
                          <td className="px-6 py-4 text-xs font-bold text-gray-900">
                            {v.versionName || `Phiên bản v${v.version}`}
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500">{v.createdAt}</td>
                          <td className="px-6 py-4 text-xs text-gray-600 font-medium">{v.createdBy}</td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-gray-400 hover:text-blue-600 transition-colors">
                              <MoreVertical size={16} />
                            </button>
                          </td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-gray-500 text-sm">Chưa có lịch sử version.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination for versions */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30 shrink-0">
                  <p className="text-xs text-gray-500">
                    Hiển thị <span className="font-medium">{(versionCurrentPage - 1) * 10 + 1}</span> đến <span className="font-medium">{Math.min(versionCurrentPage * 10, selectedSource.schemaVersions?.length || 0)}</span> trong <span className="font-medium">{selectedSource.schemaVersions?.length || 0}</span> kết quả
                  </p>
                  <div className="flex items-center gap-1">
                    <button 
                      disabled={versionCurrentPage === 1}
                      onClick={() => setVersionCurrentPage(versionCurrentPage - 1)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 disabled:opacity-30 transition-colors"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button 
                      disabled={versionCurrentPage * 10 >= (selectedSource.schemaVersions?.length || 0)}
                      onClick={() => setVersionCurrentPage(versionCurrentPage + 1)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 disabled:opacity-30 transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {detailTab === 'edit' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên dịch vụ</label>
                    <input 
                      type="text" 
                      defaultValue={selectedSource.name}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bộ</label>
                    <select 
                      defaultValue={selectedSource.ministry}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    >
                      {Object.keys(MINISTRY_UNIT_MAPPING).map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
                    <select 
                      defaultValue={selectedSource.unit}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    >
                      {Object.values(MINISTRY_UNIT_MAPPING).flat().map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API</label>
                    <input 
                      type="text" 
                      defaultValue={selectedSource.api}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="font-bold">Dịch vụ đối soát dữ liệu</h3>
                    <Switch 
                      enabled={!!selectedSource.isReconciliationEnabled} 
                      onChange={() => setIsReconciliationConfirmOpen(true)} 
                    />
                  </div>
                  <div className={cn("space-y-8 transition-opacity", !selectedSource.isReconciliationEnabled && "opacity-50 pointer-events-none")}>
                    {detailReconCategories.map((category) => (
                      <div key={category.id} className="space-y-4">
                        <div className="flex items-center justify-end border-b border-gray-100 pb-2">
                          <div className="relative">
                            <button 
                              onClick={() => setActiveDetailReconMenu(activeDetailReconMenu === category.id ? null : category.id)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                            >
                              <Plus size={14} />
                              Thêm tiêu chí
                            </button>
                            
                            <AnimatePresence>
                              {activeDetailReconMenu === category.id && (
                                <>
                                  <div className="fixed inset-0 z-10" onClick={() => setActiveDetailReconMenu(null)} />
                                  <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-2"
                                  >
                                    {RECON_MASTER_OPTIONS[category.id as keyof typeof RECON_MASTER_OPTIONS]
                                      .filter(opt => !category.options.find(o => o.id === opt.id))
                                      .map(opt => (
                                        <button
                                          key={opt.id}
                                          onClick={() => addDetailReconOption(category.id, opt)}
                                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                                        >
                                          {opt.label}
                                        </button>
                                      ))}
                                    {RECON_MASTER_OPTIONS[category.id as keyof typeof RECON_MASTER_OPTIONS]
                                      .filter(opt => !category.options.find(o => o.id === opt.id)).length === 0 && (
                                        <div className="px-4 py-2 text-xs text-gray-400 italic">Tất cả tiêu chí đã được thêm</div>
                                      )}
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {category.options.map((option) => (
                            <div key={option.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 group hover:border-blue-200 transition-all">
                              <div 
                                onClick={() => updateDetailReconOption(category.id, option.id, { enabled: !option.enabled })}
                                className={cn(
                                  "w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer shrink-0",
                                  option.enabled ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 bg-white"
                                )}
                              >
                                {option.enabled && <Check size={12} strokeWidth={4} />}
                              </div>
                              <div className="flex-1">
                                <span className="text-sm font-medium text-gray-900">{option.label}</span>
                              </div>
                              <button 
                                onClick={() => removeDetailReconOption(category.id, option.id)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                title="Xóa"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="font-bold mb-4">Danh sách Whitelist</h3>
                  <div className="space-y-2">
                    {selectedSource.whitelist?.map((ip, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                        <span className="text-sm font-mono">{ip}</span>
                        <button className="text-gray-400 hover:text-red-600 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2">
                      <input type="text" placeholder="Thêm URL/API..." className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg" />
                      <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold">Thêm</button>
                    </div>
                  </div>
                </div>


                
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    onClick={() => setDetailTab('overview')}
                    className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Huỷ bỏ
                  </button>
                  <button 
                    disabled={!detailReconCategories.some(cat => cat.options.some(opt => opt.enabled))}
                    onClick={() => setIsSaveInfoConfirmOpen(true)}
                    className={cn(
                      "px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg",
                      !detailReconCategories.some(cat => cat.options.some(opt => opt.enabled))
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
                    )}
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            )}

          </div>

          {detailTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="font-bold mb-2">Số lượng bảng</h3>
                  <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
                    <Database size={24} />
                    {selectedSource.tableCount}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="font-bold mb-4">Tags</h3>
                  <button className="text-blue-600 text-sm font-medium hover:underline">+ Thêm tags</button>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="font-bold mb-4">Metadata</h3>
                  <div className="space-y-3 text-xs text-gray-500">
                    <div>
                      <p>Tạo bởi <span className="text-gray-900 font-medium">{selectedSource.creator}</span></p>
                      <p>Wed, Jul 5, 2023, 11:59 PM</p>
                    </div>
                    <div>
                      <p>Cập nhật lần cuối bởi <span className="text-gray-900 font-medium">{selectedSource.creator}</span></p>
                      <p>Fri, Jul 7, 2023, 11:30 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
          </>
        )}
      </div>
    );
  };

  const renderNotification = () => {
    if (!notification) return null;
    return (
      <AnimatePresence>
        {notification.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-8 right-8 z-[300] bg-[#4caf50] text-white p-6 rounded-lg shadow-2xl flex items-center gap-4 min-w-[400px]"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Check size={24} strokeWidth={3} />
            </div>
            <div>
              <h4 className="font-bold text-lg mb-0.5">Thông báo</h4>
              <p className="text-white/90">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="flex h-screen bg-[#f4f6f9] overflow-hidden font-sans text-gray-900">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-[#003399] text-white transition-all duration-300 ease-in-out flex flex-col relative z-[60] shadow-xl",
          isSidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Logo Area */}
        <div className={cn(
          "bg-white py-4 flex flex-col items-center justify-center border-b border-gray-200",
          isSidebarCollapsed ? "px-2" : "px-4"
        )}>
          <div className="w-16 h-12 flex items-center justify-center overflow-hidden">
            <img 
              src="https://most.gov.vn/LogoMOST.png" 
              alt="Logo" 
              className="w-full h-full object-contain" 
              referrerPolicy="no-referrer" 
            />
          </div>
          {!isSidebarCollapsed && (
            <p className="text-[#cc0000] font-bold text-lg mt-1 tracking-wider">NASTIS</p>
          )}
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-24 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 shadow-sm z-50 transition-transform duration-300"
          style={{ transform: isSidebarCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <ChevronLeft size={14} />
        </button>

        <nav className="flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Tổng quan" 
            active={activeTab === 'overview'} 
            onClick={() => { setActiveTab('overview'); setView('list'); }} 
            collapsed={isSidebarCollapsed}
          />

          <SidebarItem 
            icon={Database} 
            label="Xây dựng Kho dữ liệu Quốc gia về KH&CN" 
            collapsed={isSidebarCollapsed}
            isOpen={openMenus.includes('data_warehouse')}
            onToggle={() => toggleMenu('data_warehouse')}
            subItems={[
              { label: 'Tổng quan', active: activeTab === 'overview', onClick: () => { setActiveTab('overview'); setView('list'); } },
              { label: 'Quản lý Dịch vụ trích rút dữ liệu', active: activeTab === 'sources', onClick: () => { setActiveTab('sources'); setView('list'); } },
              { label: 'Kết quả kiểm tra dữ liệu', active: activeTab === 'reconciliation', onClick: () => { setActiveTab('reconciliation'); setView('list'); } },
              { label: 'Kết quả trích rút dữ liệu', active: activeTab === 'extraction', onClick: () => { setActiveTab('extraction'); setView('list'); } },
              { label: 'Kết quả đối soát', active: activeTab === 'reconciliation_summary', onClick: () => { setActiveTab('reconciliation_summary'); setView('list'); } },
            ]}
          />
          
          <SidebarItem 
            icon={Building} 
            label="TT Tổ chức tổng hợp" 
            onClick={() => {}} 
            collapsed={isSidebarCollapsed}
            subItems={[]}
          />

          <SidebarItem 
            icon={Globe} 
            label="Báo khoa học thế giới" 
            onClick={() => {}} 
            collapsed={isSidebarCollapsed}
            subItems={[]}
          />

          <SidebarItem 
            icon={Cpu} 
            label="AI" 
            onClick={() => {}} 
            collapsed={isSidebarCollapsed}
            subItems={[]}
          />

          <SidebarItem 
            icon={Building2} 
            label="Tổ chức KH&CN" 
            onClick={() => {}} 
            collapsed={isSidebarCollapsed}
            subItems={[]}
          />

          <SidebarItem 
            icon={Users} 
            label="Nhân lực KH&CN" 
            onClick={() => {}} 
            collapsed={isSidebarCollapsed}
            subItems={[]}
          />

          <SidebarItem 
            icon={FileText} 
            label="Công bố KH&CN" 
            onClick={() => {}} 
            collapsed={isSidebarCollapsed}
            subItems={[]}
          />

          <SidebarItem 
            icon={CheckSquare} 
            label="Nhiệm vụ KH&CN" 
            onClick={() => {}} 
            collapsed={isSidebarCollapsed}
            subItems={[]}
          />

          <SidebarItem 
            icon={BarChart3} 
            label="Thống kê KH&CN" 
            onClick={() => {}} 
            collapsed={isSidebarCollapsed}
            subItems={[]}
          />

          <SidebarItem 
            icon={Settings} 
            label="Quản trị hệ thống" 
            onClick={() => {}} 
            collapsed={isSidebarCollapsed}
            subItems={[]}
          />
        </nav>

        <div className={cn("p-4 border-t border-blue-800/50", isSidebarCollapsed && "px-2")}>
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-xl hover:bg-blue-800/50 transition-colors cursor-pointer",
            isSidebarCollapsed && "justify-center"
          )}>
            <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold shrink-0 text-xs">
              LP
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">linhpham</p>
              </div>
            )}
            {!isSidebarCollapsed && <ChevronRight size={14} className="text-blue-300" />}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-50">
          <div className="flex items-center gap-6">
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
              <Menu size={24} />
            </button>
            <div className="flex flex-col">
              <h2 className="text-[#0055aa] font-bold text-lg leading-tight">BỘ KHOA HỌC VÀ CÔNG NGHỆ</h2>
              <p className="text-[#d97706] text-sm font-bold uppercase tracking-wide">HỆ THỐNG CƠ SỞ DỮ LIỆU QUỐC GIA VỀ KHOA HỌC VÀ CÔNG NGHỆ</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer group">
              <Globe size={20} className="text-gray-600" />
              <span className="text-sm font-bold text-gray-700">VI</span>
              <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600" />
            </div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-100">
                <img src="https://i.pravatar.cc/150?u=linhpham" alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <span className="text-sm font-bold text-gray-900">linhpham</span>
              <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${view}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              {activeTab === 'overview' && <div className="overflow-y-auto flex-1 custom-scrollbar">{renderDashboard()}</div>}
              {activeTab === 'sources' && (
                view === 'list' ? renderSourceList() : 
                view === 'wizard' ? <div className="overflow-y-auto flex-1 custom-scrollbar">{renderWizard()}</div> : 
                <div className="overflow-y-auto flex-1 custom-scrollbar">{renderSourceDetail()}</div>
              )}
              {activeTab === 'reconciliation' && renderReconciliationResults()}
              {activeTab === 'extraction' && renderExtractionResults()}
              {activeTab === 'reconciliation_summary' && renderReconciliationSummary()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      {renderLogDetailModal()}
      {renderSchemaSnapshotModal()}
      {renderReconciliationDetailModal()}
      {renderExtractionDetailModal()}
      {renderDeleteConfirmationModal()}
      {renderSaveAsNewVersionModal()}
      
      {/* Delete Condition Confirmation Modal */}
      <AnimatePresence>
        {deleteConditionConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden pt-12"
            >
              <div className="px-8 text-center">
                <div className="w-24 h-24 rounded-full border-2 border-orange-200 flex items-center justify-center mx-auto mb-8">
                  <span className="text-5xl text-orange-300 font-light">!</span>
                </div>
                
                <h3 className="text-2xl font-bold text-[#1e293b] mb-4">Xác nhận xóa</h3>
                <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                  Bạn có chắc chắn muốn xóa điều kiện này không?
                </p>
              </div>

              <div className="border-t border-gray-100 p-8 flex justify-end gap-4">
                <button 
                  onClick={() => setDeleteConditionConfirm(null)}
                  className="px-10 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all min-w-[140px]"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => {
                    removeCondition(deleteConditionConfirm.fieldId, deleteConditionConfirm.conditionId);
                    setDeleteConditionConfirm(null);
                    showNotification('Đã xóa điều kiện thành công.');
                  }}
                  className="px-10 py-3 rounded-2xl bg-[#2563eb] text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all min-w-[140px]"
                >
                  Xác nhận
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Field Confirmation Modal */}
      <AnimatePresence>
        {deleteFieldConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden pt-12"
            >
              <div className="px-8 text-center">
                <div className="w-24 h-24 rounded-full border-2 border-orange-200 flex items-center justify-center mx-auto mb-8">
                  <span className="text-5xl text-orange-300 font-light">!</span>
                </div>
                
                <h3 className="text-2xl font-bold text-[#1e293b] mb-4">Xác nhận xóa</h3>
                <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                  Bạn có chắc chắn muốn xóa trường này không?
                </p>
              </div>

              <div className="border-t border-gray-100 p-8 flex justify-end gap-4">
                <button 
                  onClick={() => setDeleteFieldConfirm(null)}
                  className="px-10 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all min-w-[140px]"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => {
                    removeField(deleteFieldConfirm);
                    setDeleteFieldConfirm(null);
                    showNotification('Đã xóa trường dữ liệu thành công.');
                  }}
                  className="px-10 py-3 rounded-2xl bg-[#2563eb] text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all min-w-[140px]"
                >
                  Xác nhận
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {renderSaveInfoConfirmModal()}
      {renderNormalizationConfirmModal()}
      {renderReconciliationConfirmModal()}
      {renderNotification()}
    </div>
  );
}
