// =====================
// 定数定義
// =====================

export const IDEA_STATUSES = ['未着手', '企画中', '制作中', '承認待ち', '公開済み', '保留'] as const;

export const SNS_POST_STATUSES = ['下書き', '確認中', '承認済み', '投稿済み'] as const;

export const PRESS_RELEASE_STATUSES = ['下書き', '確認依頼中', '差し戻し', '承認済み', '公開済み'] as const;

export const APPROVAL_STATUSES = ['確認依頼中', '差し戻し', '承認済み'] as const;

export const EVENT_STATUSES = ['準備中', '告知中', '実施済み', '報告完了'] as const;

export const PRIORITIES = ['高', '中', '低'] as const;

export const PLATFORMS: readonly string[] = ['Instagram', 'X', 'TikTok', 'Web', 'プレスリリース', 'LINE', 'Facebook', 'YouTube'] as const;

export const CONTENT_PURPOSES = ['認知', '集客', '採用', 'ブランディング', 'イベント告知', 'その他'] as const;

export const USER_ROLES = ['管理者', '広報担当', '承認者', '閲覧者', '現場担当'] as const;

export const TEMPLATE_CATEGORIES = ['謝罪文', 'お知らせ', '休講・延期', 'システム不具合', '事故・トラブル', 'プレスリリース'] as const;

export const ASSET_FILE_TYPES = ['画像', '動画', 'ロゴ', 'PDF', 'その他'] as const;

export const STATUS_COLORS: Record<string, string> = {
  // Idea statuses
  '未着手': 'bg-gray-100 text-gray-700',
  '企画中': 'bg-blue-100 text-blue-700',
  '制作中': 'bg-purple-100 text-purple-700',
  '承認待ち': 'bg-yellow-100 text-yellow-700',
  '公開済み': 'bg-green-100 text-green-700',
  '保留': 'bg-red-100 text-red-700',
  // SNS Post statuses
  '下書き': 'bg-gray-100 text-gray-700',
  '確認中': 'bg-yellow-100 text-yellow-700',
  '承認済み': 'bg-blue-100 text-blue-700',
  '投稿済み': 'bg-green-100 text-green-700',
  // Press Release statuses
  '確認依頼中': 'bg-yellow-100 text-yellow-700',
  '差し戻し': 'bg-red-100 text-red-700',
  // Event statuses
  '準備中': 'bg-blue-100 text-blue-700',
  '告知中': 'bg-purple-100 text-purple-700',
  '実施済み': 'bg-green-100 text-green-700',
  '報告完了': 'bg-teal-100 text-teal-700',
  // Content Plan statuses
  '完了': 'bg-green-100 text-green-700',
};

export const PRIORITY_COLORS: Record<string, string> = {
  '高': 'bg-red-100 text-red-700',
  '中': 'bg-yellow-100 text-yellow-700',
  '低': 'bg-green-100 text-green-700',
};

export const PLATFORM_COLORS: Record<string, string> = {
  'Instagram': 'bg-pink-100 text-pink-700',
  'X': 'bg-gray-900 text-white',
  'TikTok': 'bg-gray-800 text-white',
  'Web': 'bg-blue-100 text-blue-700',
  'プレスリリース': 'bg-indigo-100 text-indigo-700',
  'LINE': 'bg-green-100 text-green-700',
  'Facebook': 'bg-blue-200 text-blue-800',
  'YouTube': 'bg-red-100 text-red-700',
};

// サイドバーナビゲーション
export const SIDEBAR_NAV = [
  { label: 'ダッシュボード', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: '広報ネタ管理', href: '/ideas', icon: 'Lightbulb' },
  { label: 'コンテンツカレンダー', href: '/content-plans', icon: 'Calendar' },
  { label: 'SNS投稿管理', href: '/sns-posts', icon: 'Send' },
  { label: 'プレスリリース', href: '/press-releases', icon: 'FileText' },
  { label: 'メディア管理', href: '/media', icon: 'Users' },
  { label: '素材管理', href: '/assets', icon: 'Image' },
  { label: '承認一覧', href: '/approvals', icon: 'CheckCircle' },
  { label: '効果測定', href: '/analytics', icon: 'BarChart3' },
  { label: 'イベント管理', href: '/events', icon: 'CalendarDays' },
  { label: '緊急テンプレート', href: '/templates', icon: 'AlertTriangle' },
] as const;
