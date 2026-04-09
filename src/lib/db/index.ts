import { createClient } from '@/lib/supabase/client';

// =====================
// SNS Posts - SNS投稿
// =====================

export async function getSnsPosts(filters?: { status?: string; platform?: string; search?: string }) {
  const supabase = createClient();
  let query = supabase.from('sns_posts').select('*, creator:profiles!created_by(name)').order('scheduled_at', { ascending: true });
  if (filters?.status && filters.status !== 'all') query = query.eq('status', filters.status);
  if (filters?.platform && filters.platform !== 'all') query = query.eq('platform', filters.platform);
  if (filters?.search) query = query.or(`title.ilike.%${filters.search}%,body.ilike.%${filters.search}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getSnsPostById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from('sns_posts').select('*, creator:profiles!created_by(name)').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createSnsPost(post: {
  title: string; body: string; hashtags: string[]; scheduled_at: string;
  platform: string; purpose: string; cta: string; status: string;
  created_by: string; idea_id?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from('sns_posts').insert(post).select().single();
  if (error) throw error;
  return data;
}

export async function updateSnsPost(id: string, updates: Record<string, unknown>) {
  const supabase = createClient();
  const { data, error } = await supabase.from('sns_posts').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function duplicateSnsPost(id: string, newPlatform?: string) {
  const supabase = createClient();
  const { data: original, error: fetchError } = await supabase.from('sns_posts').select('*').eq('id', id).single();
  if (fetchError) throw fetchError;
  const { id: _id, created_at, updated_at, ...rest } = original;
  const { data, error } = await supabase.from('sns_posts').insert({
    ...rest, platform: newPlatform || rest.platform, status: '下書き', title: rest.title + '（複製）',
  }).select().single();
  if (error) throw error;
  return data;
}

// =====================
// Content Plans - コンテンツ企画
// =====================

export async function getContentPlans() {
  const supabase = createClient();
  const { data, error } = await supabase.from('content_plans').select('*, assignee:profiles!assignee_id(name)').order('publish_date', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createContentPlan(plan: {
  title: string; media: string; publish_date: string; purpose: string;
  target: string; assignee_id: string; priority: string; notes: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from('content_plans').insert(plan).select().single();
  if (error) throw error;
  return data;
}

// =====================
// Press Releases - プレスリリース
// =====================

export async function getPressReleases(search?: string) {
  const supabase = createClient();
  let query = supabase.from('press_releases').select('*, creator:profiles!created_by(name)').order('release_date', { ascending: false });
  if (search) {
    query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getPressReleaseById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from('press_releases').select('*, creator:profiles!created_by(name)').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createPressRelease(pr: {
  title: string; subtitle: string; release_date: string; summary: string;
  body: string; contact_info: string; distribution_targets: string[];
  created_by: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from('press_releases').insert(pr).select().single();
  if (error) throw error;
  return data;
}

export async function updatePressRelease(id: string, updates: Record<string, unknown>) {
  const supabase = createClient();
  const { data, error } = await supabase.from('press_releases').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// =====================
// Media Contacts - メディア連絡先
// =====================

export async function getMediaContacts(search?: string) {
  const supabase = createClient();
  let query = supabase.from('media_contacts').select('*').order('outlet_name');
  if (search) {
    query = query.or(`outlet_name.ilike.%${search}%,contact_name.ilike.%${search}%`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getMediaContactById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from('media_contacts').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createMediaContact(contact: {
  outlet_name: string; contact_name: string; email: string;
  phone: string; genres: string[]; notes: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from('media_contacts').insert(contact).select().single();
  if (error) throw error;
  return data;
}

export async function updateMediaContact(id: string, updates: Record<string, unknown>) {
  const supabase = createClient();
  const { data, error } = await supabase.from('media_contacts').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// =====================
// Assets - 素材管理
// =====================

export async function getAssets(filters?: { type?: string; search?: string }) {
  const supabase = createClient();
  let query = supabase.from('assets').select('*').order('uploaded_at', { ascending: false });
  if (filters?.type && filters.type !== 'all') {
    query = query.eq('file_type', filters.type);
  }
  if (filters?.search) {
    query = query.or(`filename.ilike.%${filters.search}%,tags.cs.{${filters.search}}`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function uploadAsset(file: File, metadata: {
  filename: string; file_type: string; folder: string;
  tags: string[]; usage_scope: string; uploaded_by: string;
}) {
  const supabase = createClient();
  const filePath = `${metadata.folder}/${Date.now()}_${file.name}`;

  const { error: uploadError } = await supabase.storage.from('assets').upload(filePath, file);
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from('assets').getPublicUrl(filePath);

  const { data, error } = await supabase.from('assets').insert({
    ...metadata,
    file_url: urlData.publicUrl,
    thumbnail_url: urlData.publicUrl,
  }).select().single();
  if (error) throw error;
  return data;
}

// =====================
// Approvals - 承認
// =====================

export async function getApprovals(status?: string) {
  const supabase = createClient();
  let query = supabase.from('approvals')
    .select('*, requester:profiles!requester_id(name), approver:profiles!approver_id(name)')
    .order('requested_at', { ascending: false });
  if (status && status !== 'all') {
    query = query.eq('status', status);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createApproval(approval: {
  target_type: string; target_id: string; target_title: string;
  requester_id: string; approver_id: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from('approvals').insert(approval).select().single();
  if (error) throw error;
  return data;
}

export async function updateApprovalStatus(id: string, status: string, comment?: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from('approvals').update({
    status,
    comment: comment || '',
    resolved_at: status !== '確認依頼中' ? new Date().toISOString() : null,
  }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// =====================
// Performance Reports - 効果測定
// =====================

export async function getPerformanceReports() {
  const supabase = createClient();
  const { data, error } = await supabase.from('performance_reports').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createPerformanceReport(report: {
  target_type: string; target_id: string; target_title: string;
  impressions: number; likes: number; saves: number; comments: number;
  inquiries: number; applications: number; coverage_count: number;
  period_start: string; period_end: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from('performance_reports').insert(report).select().single();
  if (error) throw error;
  return data;
}

// =====================
// Events - イベント
// =====================

export async function getEvents() {
  const supabase = createClient();
  const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getEventById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createEvent(event: {
  name: string; event_date: string; venue: string; target_audience: string;
  announcement_start: string; required_assets: string[]; posting_plan: string;
  photographer: string; tasks: unknown[];
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from('events').insert(event).select().single();
  if (error) throw error;
  return data;
}

export async function updateEvent(id: string, updates: Record<string, unknown>) {
  const supabase = createClient();
  const { data, error } = await supabase.from('events').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// =====================
// Templates - テンプレート
// =====================

export async function getTemplates(filters?: { category?: string; search?: string }) {
  const supabase = createClient();
  let query = supabase.from('templates').select('*').order('category');
  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,body.ilike.%${filters.search}%`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createTemplate(tmpl: {
  category: string; title: string; body: string;
  variables: string[]; created_by: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from('templates').insert(tmpl).select().single();
  if (error) throw error;
  return data;
}

export async function updateTemplate(id: string, updates: Record<string, unknown>) {
  const supabase = createClient();
  const { data, error } = await supabase.from('templates').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// =====================
// Profiles - ユーザー
// =====================

export async function getProfiles() {
  const supabase = createClient();
  const { data, error } = await supabase.from('profiles').select('*').order('name');
  if (error) throw error;
  return data;
}

export async function getProfileById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

// =====================
// Dashboard Stats
// =====================

export async function getDashboardStats() {
  const supabase = createClient();

  const [ideas, approvals, snsPosts, reports] = await Promise.all([
    supabase.from('ideas').select('id, status', { count: 'exact' }),
    supabase.from('approvals').select('id, status', { count: 'exact' }).eq('status', '確認依頼中'),
    supabase.from('sns_posts').select('id, status, scheduled_at', { count: 'exact' }),
    supabase.from('performance_reports').select('impressions, likes, inquiries'),
  ]);

  const totalReactions = (reports.data || []).reduce((s, r) => s + (r.likes || 0), 0);
  const totalInquiries = (reports.data || []).reduce((s, r) => s + (r.inquiries || 0), 0);

  return {
    todayTasks: (ideas.data || []).filter(i => i.status === '制作中' || i.status === '承認待ち').length,
    pendingApprovals: approvals.count || 0,
    weeklyPosts: (snsPosts.data || []).filter(p => p.status !== '投稿済み').length,
    monthlyProjects: ideas.count || 0,
    totalPosts: snsPosts.count || 0,
    totalReactions,
    totalInquiries,
  };
}
