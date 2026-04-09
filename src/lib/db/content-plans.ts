import { createClient } from '@/lib/supabase/client';

// =====================
// Content Plans - コンテンツ企画
// =====================

export async function getContentPlans() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('content_plans')
    .select('*, assignee:profiles!assignee_id(name)')
    .order('publish_date', { ascending: true });
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

export async function updateContentPlan(id: string, updates: Record<string, unknown>) {
  const supabase = createClient();
  const { data, error } = await supabase.from('content_plans').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteContentPlan(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('content_plans').delete().eq('id', id);
  if (error) throw error;
}
