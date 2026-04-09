import {
  User, Idea, ContentPlan, SnsPost, PressRelease,
  MediaContact, Asset, Approval, PerformanceReport,
  PREvent, Template, DashboardStats
} from './types';

// =====================
// ユーザー
// =====================
export const mockUsers: User[] = [
  { id: 'u1', name: '田中太郎', email: 'tanaka@example.com', role: '管理者', department: '広報部', createdAt: '2025-01-01' },
  { id: 'u2', name: '鈴木花子', email: 'suzuki@example.com', role: '広報担当', department: '広報部', createdAt: '2025-01-15' },
  { id: 'u3', name: '佐藤次郎', email: 'sato@example.com', role: '承認者', department: '経営企画部', createdAt: '2025-02-01' },
  { id: 'u4', name: '山本美咲', email: 'yamamoto@example.com', role: '閲覧者', department: '営業部', createdAt: '2025-03-01' },
  { id: 'u5', name: '高橋健一', email: 'takahashi@example.com', role: '現場担当', department: '教室運営部', createdAt: '2025-03-15' },
];

// =====================
// 広報ネタ
// =====================
export const mockIdeas: Idea[] = [
  {
    id: 'idea1',
    title: '春の体験教室キャンペーン',
    summary: '4月の入会キャンペーンに合わせた体験教室の告知。親子参加型にして集客力を高める。',
    purpose: '集客・入会促進',
    target: '小学生の保護者',
    media: ['Instagram', 'LINE', 'Web'],
    deadline: '2026-04-15',
    submitterId: 'u2',
    attachments: [],
    status: '制作中',
    priority: '高',
    createdAt: '2026-03-01',
    updatedAt: '2026-04-01',
  },
  {
    id: 'idea2',
    title: '指導員インタビュー連載 Vol.3',
    summary: '人気指導員の日々の指導への想いをインタビュー形式で発信。採用にもつなげたい。',
    purpose: 'ブランディング・採用PR',
    target: '保護者・求職者',
    media: ['Instagram', 'Web'],
    deadline: '2026-04-20',
    submitterId: 'u5',
    attachments: [],
    status: '企画中',
    priority: '中',
    createdAt: '2026-03-10',
    updatedAt: '2026-03-28',
  },
  {
    id: 'idea3',
    title: '夏休み特別プログラム先行告知',
    summary: '7〜8月の夏休みプログラムを5月から先行告知。早期割引で囲い込み。',
    purpose: '集客',
    target: '既存会員・見込み客',
    media: ['Instagram', 'X', 'LINE', 'Web', 'プレスリリース'],
    deadline: '2026-05-10',
    submitterId: 'u2',
    attachments: [],
    status: '未着手',
    priority: '高',
    createdAt: '2026-03-20',
    updatedAt: '2026-03-20',
  },
  {
    id: 'idea4',
    title: '新規教室オープンのお知らせ',
    summary: '横浜エリアに新教室がオープン。地域メディアへの露出も狙う。',
    purpose: '認知拡大',
    target: '横浜エリアの保護者',
    media: ['プレスリリース', 'Web', 'Instagram', 'LINE'],
    deadline: '2026-04-25',
    submitterId: 'u2',
    attachments: [],
    status: '承認待ち',
    priority: '高',
    createdAt: '2026-03-15',
    updatedAt: '2026-04-05',
  },
  {
    id: 'idea5',
    title: '会員の声 特集ページ',
    summary: '実際に通っている会員のインタビューをまとめた特集ページを作成。',
    purpose: 'ブランディング',
    target: '見込み客',
    media: ['Web'],
    deadline: '2026-05-30',
    submitterId: 'u5',
    attachments: [],
    status: '保留',
    priority: '低',
    createdAt: '2026-02-20',
    updatedAt: '2026-03-01',
  },
  {
    id: 'idea6',
    title: 'GW特別イベント告知',
    summary: 'ゴールデンウィーク中の特別イベントについてSNSで告知。',
    purpose: 'イベント告知',
    target: '既存会員・一般',
    media: ['Instagram', 'X', 'TikTok'],
    deadline: '2026-04-20',
    submitterId: 'u2',
    attachments: [],
    status: '企画中',
    priority: '中',
    createdAt: '2026-03-25',
    updatedAt: '2026-04-02',
  },
];

// =====================
// コンテンツ企画
// =====================
export const mockContentPlans: ContentPlan[] = [
  {
    id: 'cp1', title: '春の体験教室告知投稿', media: 'Instagram', publishDate: '2026-04-10',
    purpose: '集客', target: '保護者', assigneeId: 'u2', priority: '高',
    relatedAssets: [], notes: 'リール動画で制作予定', status: '制作中',
    createdAt: '2026-03-15', updatedAt: '2026-04-01',
  },
  {
    id: 'cp2', title: 'インタビュー連載 Vol.3', media: 'Web', publishDate: '2026-04-18',
    purpose: 'ブランディング', target: '保護者・求職者', assigneeId: 'u2', priority: '中',
    relatedAssets: [], notes: '写真撮影は4/12予定', status: '企画中',
    createdAt: '2026-03-20', updatedAt: '2026-03-28',
  },
  {
    id: 'cp3', title: 'GWイベント告知①', media: 'Instagram', publishDate: '2026-04-22',
    purpose: 'イベント告知', target: '既存会員', assigneeId: 'u2', priority: '中',
    relatedAssets: [], notes: '', status: '企画中',
    createdAt: '2026-04-01', updatedAt: '2026-04-01',
  },
  {
    id: 'cp4', title: 'GWイベント告知②', media: 'X', publishDate: '2026-04-23',
    purpose: 'イベント告知', target: '一般', assigneeId: 'u2', priority: '中',
    relatedAssets: [], notes: '', status: '企画中',
    createdAt: '2026-04-01', updatedAt: '2026-04-01',
  },
  {
    id: 'cp5', title: '新教室オープン告知', media: 'LINE', publishDate: '2026-04-25',
    purpose: '認知', target: '横浜エリア会員', assigneeId: 'u2', priority: '高',
    relatedAssets: [], notes: 'プレスリリースと連動', status: '企画中',
    createdAt: '2026-04-02', updatedAt: '2026-04-02',
  },
  {
    id: 'cp6', title: '月末成果まとめ投稿', media: 'Instagram', publishDate: '2026-04-30',
    purpose: 'ブランディング', target: 'フォロワー', assigneeId: 'u2', priority: '低',
    relatedAssets: [], notes: '', status: '企画中',
    createdAt: '2026-04-05', updatedAt: '2026-04-05',
  },
];

// =====================
// SNS投稿
// =====================
export const mockSnsPosts: SnsPost[] = [
  {
    id: 'sp1',
    title: '春の体験教室キャンペーン告知',
    body: '🌸春の体験教室キャンペーン開催中！🌸\n\n今なら体験レッスンが無料✨\n親子で一緒に楽しめるプログラムをご用意しています！\n\n📅 4/10（金）〜 4/30（木）\n📍 全教室で開催\n\n詳細はプロフィールのリンクから🔗',
    hashtags: ['#体験教室', '#春キャンペーン', '#親子体験', '#習い事'],
    scheduledAt: '2026-04-10T10:00:00',
    platform: 'Instagram',
    attachments: [],
    purpose: '体験申込の促進',
    cta: '体験申込',
    status: '承認済み',
    ideaId: 'idea1',
    createdBy: 'u2',
    createdAt: '2026-04-01',
    updatedAt: '2026-04-05',
  },
  {
    id: 'sp2',
    title: '指導員インタビュー紹介投稿',
    body: '👨‍🏫指導員インタビュー連載 Vol.3👨‍🏫\n\n「子どもたちの成長を見るのが何よりのやりがいです」\n\n今回は人気指導員の山田先生にお話を伺いました！\n詳しくはWebサイトにて📖',
    hashtags: ['#指導員紹介', '#インタビュー', '#教育'],
    scheduledAt: '2026-04-18T12:00:00',
    platform: 'Instagram',
    attachments: [],
    purpose: 'ブランディング',
    cta: 'HP誘導',
    status: '下書き',
    ideaId: 'idea2',
    createdBy: 'u2',
    createdAt: '2026-04-02',
    updatedAt: '2026-04-02',
  },
  {
    id: 'sp3',
    title: 'GWイベント告知',
    body: '🎉GW特別イベント開催決定🎉\n\n今年のゴールデンウィークは特別プログラムが盛りだくさん！\n会員でなくても参加OK👌\n\n📅 5/3-5/5\n📍 各教室\n\n予約はお早めに！',
    hashtags: ['#GW', '#ゴールデンウィーク', '#イベント'],
    scheduledAt: '2026-04-22T10:00:00',
    platform: 'Instagram',
    attachments: [],
    purpose: 'イベント告知',
    cta: 'イベント申込',
    status: '確認中',
    createdBy: 'u2',
    createdAt: '2026-04-05',
    updatedAt: '2026-04-08',
  },
  {
    id: 'sp4',
    title: '新教室オープン告知ツイート',
    body: '📢横浜エリアに新教室がオープンします！\n\n2026年5月1日（金）グランドオープン🎊\nオープン記念キャンペーンも実施予定。\n\n詳細は後日発表します！',
    hashtags: ['#新教室', '#横浜', '#オープン'],
    scheduledAt: '2026-04-25T09:00:00',
    platform: 'X',
    attachments: [],
    purpose: '認知拡大',
    cta: 'HP誘導',
    status: '下書き',
    ideaId: 'idea4',
    createdBy: 'u2',
    createdAt: '2026-04-06',
    updatedAt: '2026-04-06',
  },
];

// =====================
// プレスリリース
// =====================
export const mockPressReleases: PressRelease[] = [
  {
    id: 'pr1',
    title: '横浜エリアに新教室オープンのお知らせ',
    subtitle: '〜地域の子どもたちに新しい学びの場を〜',
    releaseDate: '2026-04-25',
    summary: '当社は2026年5月1日（金）、横浜市中区に新教室をオープンいたします。地域の子どもたちにより身近な学びの場を提供し、教育の機会拡大に貢献してまいります。',
    body: `【横浜エリアに新教室オープンのお知らせ】

当社は2026年5月1日（金）、神奈川県横浜市中区に新教室「横浜みなとみらい教室」をオープンいたします。

■ 新教室概要
教室名：横浜みなとみらい教室
所在地：神奈川県横浜市中区○○ 1-2-3 ○○ビル2F
オープン日：2026年5月1日（金）
営業時間：10:00〜20:00（月〜土）

■ オープン記念キャンペーン
オープンを記念し、5月中にご入会いただいた方を対象に、入会金無料＋初月月謝50%OFFキャンペーンを実施いたします。

■ 本件に関するお問い合わせ
広報部 田中太郎
TEL: 03-XXXX-XXXX
Email: pr@example.com`,
    images: [],
    contactInfo: '広報部 田中太郎 TEL: 03-XXXX-XXXX Email: pr@example.com',
    distributionTargets: ['PR TIMES', '地方紙', '教育メディア'],
    status: '確認依頼中',
    createdBy: 'u2',
    createdAt: '2026-04-05',
    updatedAt: '2026-04-08',
  },
  {
    id: 'pr2',
    title: '夏休み特別プログラム2026のご案内',
    subtitle: '〜この夏、子どもたちに忘れられない体験を〜',
    releaseDate: '2026-05-15',
    summary: '2026年7月〜8月にかけて、全教室にて夏休み特別プログラムを実施いたします。',
    body: '（下書き中）',
    images: [],
    contactInfo: '広報部 鈴木花子',
    distributionTargets: [],
    status: '下書き',
    createdBy: 'u2',
    createdAt: '2026-04-08',
    updatedAt: '2026-04-08',
  },
];

// =====================
// メディア連絡先
// =====================
export const mockMediaContacts: MediaContact[] = [
  {
    id: 'mc1',
    outletName: '教育新聞',
    contactName: '中村記者',
    email: 'nakamura@kyoiku-news.example.com',
    phone: '03-XXXX-1111',
    genres: ['教育', '子ども', '習い事'],
    history: [
      { date: '2026-02-15', type: 'メール', content: '新教室の情報提供' },
      { date: '2026-01-10', type: '電話', content: '冬季プログラムの取材依頼' },
    ],
    coverageRecords: [
      { date: '2026-01-25', title: '冬季体験プログラムの紹介記事', url: 'https://example.com/article1' },
    ],
    notes: '教育全般の取材に積極的',
    createdAt: '2025-06-01',
    updatedAt: '2026-02-15',
  },
  {
    id: 'mc2',
    outletName: '横浜タウンニュース',
    contactName: '小林記者',
    email: 'kobayashi@yokohama-tn.example.com',
    phone: '045-XXX-2222',
    genres: ['地域', 'イベント', '新規開業'],
    history: [
      { date: '2026-03-20', type: 'メール', content: '新教室オープンの情報提供' },
    ],
    coverageRecords: [],
    notes: '横浜エリアのローカル情報に強い',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-20',
  },
  {
    id: 'mc3',
    outletName: 'キッズメディアOnline',
    contactName: '吉田編集長',
    email: 'yoshida@kidsmedia.example.com',
    phone: '03-XXXX-3333',
    genres: ['子ども', '教育', '体験'],
    history: [],
    coverageRecords: [],
    notes: 'Web媒体。PR案件にも対応可能',
    createdAt: '2026-01-15',
    updatedAt: '2026-01-15',
  },
];

// =====================
// 素材
// =====================
export const mockAssets: Asset[] = [
  {
    id: 'a1', filename: 'spring-campaign-banner.png', fileType: '画像',
    fileUrl: '/images/placeholder.png', thumbnailUrl: '/images/placeholder.png',
    folder: 'キャンペーン', tags: ['春', 'キャンペーン', 'バナー'],
    usageScope: 'SNS・Web', relatedProjectId: 'idea1',
    uploadedBy: 'u2', uploadedAt: '2026-03-28',
  },
  {
    id: 'a2', filename: 'company-logo.svg', fileType: 'ロゴ',
    fileUrl: '/images/placeholder.png', thumbnailUrl: '/images/placeholder.png',
    folder: 'ロゴ', tags: ['ロゴ', '企業'],
    usageScope: '全用途', uploadedBy: 'u1', uploadedAt: '2025-01-01',
  },
  {
    id: 'a3', filename: 'interview-vol3-photo.jpg', fileType: '画像',
    fileUrl: '/images/placeholder.png', thumbnailUrl: '/images/placeholder.png',
    folder: 'インタビュー', tags: ['インタビュー', '写真', 'Vol.3'],
    usageScope: 'Web・SNS', relatedProjectId: 'idea2',
    uploadedBy: 'u2', uploadedAt: '2026-04-02',
  },
  {
    id: 'a4', filename: 'yokohama-classroom-brochure.pdf', fileType: 'PDF',
    fileUrl: '/images/placeholder.png', thumbnailUrl: '/images/placeholder.png',
    folder: '新教室', tags: ['横浜', 'パンフレット'],
    usageScope: '印刷・Web', relatedProjectId: 'idea4',
    uploadedBy: 'u2', uploadedAt: '2026-04-05',
  },
  {
    id: 'a5', filename: 'gw-event-promo.mp4', fileType: '動画',
    fileUrl: '/images/placeholder.png', thumbnailUrl: '/images/placeholder.png',
    folder: 'イベント', tags: ['GW', 'イベント', '動画'],
    usageScope: 'SNS', relatedProjectId: 'idea6',
    uploadedBy: 'u2', uploadedAt: '2026-04-07',
  },
];

// =====================
// 承認
// =====================
export const mockApprovals: Approval[] = [
  {
    id: 'ap1', targetType: 'sns_post', targetId: 'sp1', targetTitle: '春の体験教室キャンペーン告知',
    requesterId: 'u2', approverId: 'u3', status: '承認済み',
    comment: 'OK。投稿日時に問題なし。', requestedAt: '2026-04-03', resolvedAt: '2026-04-04',
  },
  {
    id: 'ap2', targetType: 'sns_post', targetId: 'sp3', targetTitle: 'GWイベント告知',
    requesterId: 'u2', approverId: 'u3', status: '確認依頼中',
    comment: '', requestedAt: '2026-04-08',
  },
  {
    id: 'ap3', targetType: 'press_release', targetId: 'pr1', targetTitle: '横浜エリアに新教室オープンのお知らせ',
    requesterId: 'u2', approverId: 'u3', status: '確認依頼中',
    comment: '', requestedAt: '2026-04-08',
  },
];

// =====================
// 効果測定
// =====================
export const mockPerformanceReports: PerformanceReport[] = [
  {
    id: 'perf1', targetType: 'sns_post', targetId: 'sp1', targetTitle: '春の体験教室キャンペーン告知',
    impressions: 12500, likes: 340, saves: 85, comments: 28,
    inquiries: 15, applications: 8, coverageCount: 0,
    periodStart: '2026-04-10', periodEnd: '2026-04-16', createdAt: '2026-04-16',
  },
  {
    id: 'perf2', targetType: 'sns_post', targetId: 'sp1', targetTitle: '春の体験教室キャンペーン告知',
    impressions: 18200, likes: 520, saves: 120, comments: 45,
    inquiries: 22, applications: 12, coverageCount: 0,
    periodStart: '2026-03-01', periodEnd: '2026-03-31', createdAt: '2026-04-01',
  },
  {
    id: 'perf3', targetType: 'press_release', targetId: 'pr1', targetTitle: '横浜新教室オープン',
    impressions: 5000, likes: 0, saves: 0, comments: 0,
    inquiries: 8, applications: 3, coverageCount: 2,
    periodStart: '2026-04-01', periodEnd: '2026-04-08', createdAt: '2026-04-09',
  },
];

// =====================
// イベント
// =====================
export const mockEvents: PREvent[] = [
  {
    id: 'ev1',
    name: 'GW特別体験イベント',
    eventDate: '2026-05-03',
    venue: '各教室',
    targetAudience: '未入会の親子',
    announcementStart: '2026-04-15',
    requiredAssets: ['バナー画像', 'チラシ', 'SNS投稿画像'],
    postingPlan: '4/15, 4/22, 4/29にSNS投稿。リマインド前日投稿。',
    photographer: '鈴木花子',
    report: '',
    tasks: [
      { id: 't1', title: '告知バナー作成', phase: 'before', completed: true, assignee: '鈴木花子' },
      { id: 't2', title: 'SNS投稿文作成', phase: 'before', completed: true, assignee: '鈴木花子' },
      { id: 't3', title: 'チラシ配布', phase: 'before', completed: false, assignee: '高橋健一' },
      { id: 't4', title: '会場設営', phase: 'during', completed: false, assignee: '高橋健一' },
      { id: 't5', title: '写真撮影', phase: 'during', completed: false, assignee: '鈴木花子' },
      { id: 't6', title: '参加者アンケート回収', phase: 'after', completed: false, assignee: '高橋健一' },
      { id: 't7', title: '写真整理・選定', phase: 'after', completed: false, assignee: '鈴木花子' },
      { id: 't8', title: '実施レポート作成', phase: 'after', completed: false, assignee: '鈴木花子' },
    ],
    photoCollected: false,
    status: '準備中',
    createdAt: '2026-03-25',
    updatedAt: '2026-04-05',
  },
  {
    id: 'ev2',
    name: '横浜新教室オープニングセレモニー',
    eventDate: '2026-05-01',
    venue: '横浜みなとみらい教室',
    targetAudience: '地域住民・メディア',
    announcementStart: '2026-04-20',
    requiredAssets: ['招待状', 'プレスキット', '会場装飾素材'],
    postingPlan: 'プレスリリース配信後、SNSで当日レポート投稿',
    photographer: '外部カメラマン',
    report: '',
    tasks: [
      { id: 't9', title: 'プレスリリース配信', phase: 'before', completed: false, assignee: '田中太郎' },
      { id: 't10', title: '招待状送付', phase: 'before', completed: false, assignee: '鈴木花子' },
      { id: 't11', title: '当日進行台本作成', phase: 'before', completed: false, assignee: '鈴木花子' },
      { id: 't12', title: '当日受付', phase: 'during', completed: false, assignee: '高橋健一' },
      { id: 't13', title: 'SNSリアルタイム投稿', phase: 'during', completed: false, assignee: '鈴木花子' },
      { id: 't14', title: 'メディア掲載確認', phase: 'after', completed: false, assignee: '田中太郎' },
    ],
    photoCollected: false,
    status: '準備中',
    createdAt: '2026-04-01',
    updatedAt: '2026-04-08',
  },
];

// =====================
// テンプレート
// =====================
export const mockTemplates: Template[] = [
  {
    id: 'tmpl1', category: '謝罪文', title: 'サービス中断のお詫び',
    body: `【お詫び】{{サービス名}}のサービス中断について

日頃より{{サービス名}}をご利用いただき、誠にありがとうございます。

{{日時}}頃より発生しておりました{{事象}}につきまして、ご利用の皆様に多大なるご不便をおかけしましたことを深くお詫び申し上げます。

現在は復旧しており、正常にご利用いただける状態となっております。

今後このような事態が発生しないよう、再発防止に努めてまいります。
引き続きご愛顧賜りますようお願い申し上げます。`,
    variables: ['サービス名', '日時', '事象'],
    createdBy: 'u1', createdAt: '2025-06-01', updatedAt: '2025-06-01',
  },
  {
    id: 'tmpl2', category: '休講・延期', title: '悪天候による休講のお知らせ',
    body: `【お知らせ】{{日付}}の教室について

{{エリア名}}エリアの教室につきまして、{{理由}}のため、{{日付}}の教室を休講とさせていただきます。

振替教室につきましては、改めてご連絡いたします。

ご不便をおかけいたしますが、何卒ご理解のほどよろしくお願いいたします。`,
    variables: ['日付', 'エリア名', '理由'],
    createdBy: 'u1', createdAt: '2025-06-01', updatedAt: '2025-06-01',
  },
  {
    id: 'tmpl3', category: 'お知らせ', title: '営業時間変更のお知らせ',
    body: `【お知らせ】営業時間変更について

いつもご利用ありがとうございます。

{{開始日}}より、{{対象教室}}の営業時間を下記の通り変更いたします。

変更前：{{変更前時間}}
変更後：{{変更後時間}}

ご不明点がございましたら、お気軽にお問い合わせください。`,
    variables: ['開始日', '対象教室', '変更前時間', '変更後時間'],
    createdBy: 'u1', createdAt: '2025-07-01', updatedAt: '2025-07-01',
  },
  {
    id: 'tmpl4', category: 'システム不具合', title: 'システムメンテナンスのお知らせ',
    body: `【お知らせ】システムメンテナンスについて

下記日程にて、システムメンテナンスを実施いたします。

日時：{{日時}}
影響範囲：{{影響範囲}}

メンテナンス中は{{サービス名}}をご利用いただけません。
ご不便をおかけいたしますが、ご理解のほどよろしくお願いいたします。`,
    variables: ['日時', '影響範囲', 'サービス名'],
    createdBy: 'u1', createdAt: '2025-08-01', updatedAt: '2025-08-01',
  },
  {
    id: 'tmpl5', category: '事故・トラブル', title: '安全に関するお知らせ（初動文案）',
    body: `【重要】{{件名}}について

{{日時}}、{{場所}}にて{{事象}}が発生いたしました。

現在、関係機関と連携のうえ対応を進めております。
{{対象者}}の安全を最優先に対応してまいります。

詳細が判明次第、改めてご報告いたします。

ご心配をおかけし大変申し訳ございません。`,
    variables: ['件名', '日時', '場所', '事象', '対象者'],
    createdBy: 'u1', createdAt: '2025-09-01', updatedAt: '2025-09-01',
  },
];

// =====================
// ダッシュボード統計
// =====================
export const mockDashboardStats: DashboardStats = {
  todayTasks: 5,
  pendingApprovals: 2,
  weeklyPosts: 3,
  monthlyProjects: 6,
  totalPosts: 24,
  totalReactions: 1580,
  totalInquiries: 45,
};

// =====================
// ユーザー名を取得するヘルパー
// =====================
export function getUserName(userId: string): string {
  const user = mockUsers.find(u => u.id === userId);
  return user?.name ?? '不明';
}
