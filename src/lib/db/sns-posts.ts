import { createClient } from '@/lib/supabase/client';

// =====================
// SNS Posts - SNS投稿
// =====================

export async function getSnsPosts(filters?: { status?: string; platform?: string; search?: string }) {
  const supabase = createClient();
  let query = supabase.from('sns_posts').select('*, creator:profiles!created_by(name)').order('scheduled_at', { ascending: true });

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters?.platform && filters.platform !== 'all') {
    query = query.eq('platform', filters.platform);
  }
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,body.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getSnsPostById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sns_posts')
    .select('*, creator:profiles!created_by(name)')
    .eq('id', id)
    .single();
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
    ...rest,
    platform: newPlatform || rest.platform,
    status: '下書き',
    title: rest.title + '（複製）',
  }).select().single();
  if (error) throw error;
  return data;
}
