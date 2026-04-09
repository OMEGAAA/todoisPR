// =====================
// 型定義
// =====================

export type UserRole = '管理者' | '広報担当' | '承認者' | '閲覧者' | '現場担当';

export type IdeaStatus = '未着手' | '企画中' | '制作中' | '承認待ち' | '公開済み' | '保留';

export type ContentPlanStatus = '企画中' | '制作中' | '完了';

export type SnsPostStatus = '下書き' | '確認中' | '承認済み' | '投稿済み';

export type PressReleaseStatus = '下書き' | '確認依頼中' | '差し戻し' | '承認済み' | '公開済み';

export type ApprovalStatus = '確認依頼中' | '差し戻し' | '承認済み';

export type ApprovalTargetType = 'sns_post' | 'press_release' | 'content';

export type AssetFileType = '画像' | '動画' | 'ロゴ' | 'PDF' | 'その他';

export type EventStatus = '準備中' | '告知中' | '実施済み' | '報告完了';

export type TemplateCategory = '謝罪文' | 'お知らせ' | '休講・延期' | 'システム不具合' | '事故・トラブル' | 'プレスリリース';

export type Priority = '高' | '中' | '低';

export type Platform = 'Instagram' | 'X' | 'TikTok' | 'Web' | 'プレスリリース' | 'LINE' | 'Facebook' | 'YouTube';

export type ContentPurpose = '認知' | '集客' | '採用' | 'ブランディング' | 'イベント告知' | 'その他';

// =====================
// インターフェース
// =====================

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Idea {
  id: string;
  title: string;
  summary: string;
  purpose: string;
  target: string;
  media: Platform[];
  deadline: string;
  submitterId: string;
  attachments: Attachment[];
  status: IdeaStatus;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export interface ContentPlan {
  id: string;
  title: string;
  media: Platform;
  publishDate: string;
  purpose: ContentPurpose;
  target: string;
  assigneeId: string;
  priority: Priority;
  relatedAssets: string[];
  notes: string;
  status: ContentPlanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SnsPost {
  id: string;
  title: string;
  body: string;
  hashtags: string[];
  scheduledAt: string;
  platform: Platform;
  attachments: Attachment[];
  purpose: string;
  cta: string;
  status: SnsPostStatus;
  ideaId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PressRelease {
  id: string;
  title: string;
  subtitle: string;
  releaseDate: string;
  summary: string;
  body: string;
  images: Attachment[];
  contactInfo: string;
  distributionTargets: string[];
  templateId?: string;
  status: PressReleaseStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaContact {
  id: string;
  outletName: string;
  contactName: string;
  email: string;
  phone: string;
  genres: string[];
  history: ContactHistory[];
  coverageRecords: CoverageRecord[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactHistory {
  date: string;
  type: string;
  content: string;
}

export interface CoverageRecord {
  date: string;
  title: string;
  url?: string;
}

export interface Asset {
  id: string;
  filename: string;
  fileType: AssetFileType;
  fileUrl: string;
  thumbnailUrl: string;
  folder: string;
  tags: string[];
  usageScope: string;
  relatedProjectId?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Approval {
  id: string;
  targetType: ApprovalTargetType;
  targetId: string;
  targetTitle: string;
  requesterId: string;
  approverId: string;
  status: ApprovalStatus;
  comment: string;
  requestedAt: string;
  resolvedAt?: string;
}

export interface PerformanceReport {
  id: string;
  targetType: 'sns_post' | 'press_release' | 'event';
  targetId: string;
  targetTitle: string;
  impressions: number;
  likes: number;
  saves: number;
  comments: number;
  inquiries: number;
  applications: number;
  coverageCount: number;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
}

export interface PREvent {
  id: string;
  name: string;
  eventDate: string;
  venue: string;
  targetAudience: string;
  announcementStart: string;
  requiredAssets: string[];
  postingPlan: string;
  photographer: string;
  report: string;
  tasks: EventTask[];
  photoCollected: boolean;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EventTask {
  id: string;
  title: string;
  phase: 'before' | 'during' | 'after';
  completed: boolean;
  assignee: string;
}

export interface Template {
  id: string;
  category: TemplateCategory;
  title: string;
  body: string;
  variables: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
}

// =====================
// ダッシュボード
// =====================

export interface DashboardStats {
  todayTasks: number;
  pendingApprovals: number;
  weeklyPosts: number;
  monthlyProjects: number;
  totalPosts: number;
  totalReactions: number;
  totalInquiries: number;
}
