import { createClient } from '@/lib/supabase/client';

// =====================
// Ideas - 広報ネタ
// =====================

export async function getIdeas(filters?: { status?: string; search?: string }) {
  const supabase = createClient();
  let query = supabase.from('ideas').select('*, submitter:profiles!submitter_id(name)').order('created_at', { ascending: false });

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,summary.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getIdeaById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('ideas')
    .select('*, submitter:profiles!submitter_id(name)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createIdea(idea: {
  title: string; summary: string; purpose: string; target: string;
  media: string[]; deadline: string; status: string; priority: string;
  submitter_id: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from('ideas').insert(idea).select().single();
  if (error) throw error;
  return data;
}

export async function updateIdea(id: string, updates: Record<string, unknown>) {
  const supabase = createClient();
  const { data, error } = await supabase.from('ideas').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteIdea(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('ideas').delete().eq('id', id);
  if (error) throw error;
}
