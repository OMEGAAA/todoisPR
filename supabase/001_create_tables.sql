-- =============================================
-- PR Manager - データベース作成スクリプト
-- Supabase SQL Editor で実行してください
-- =============================================

-- 1. profiles テーブル（Supabase Auth と連携）
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '閲覧者' CHECK (role IN ('管理者','広報担当','承認者','閲覧者','現場担当')),
  department TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ideas テーブル
CREATE TABLE IF NOT EXISTS public.ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT DEFAULT '',
  purpose TEXT DEFAULT '',
  target TEXT DEFAULT '',
  media TEXT[] DEFAULT '{}',
  deadline DATE,
  submitter_id UUID REFERENCES public.profiles(id),
  attachments JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT '未着手' CHECK (status IN ('未着手','企画中','制作中','承認待ち','公開済み','保留')),
  priority TEXT NOT NULL DEFAULT '中' CHECK (priority IN ('高','中','低')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. content_plans テーブル
CREATE TABLE IF NOT EXISTS public.content_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  media TEXT DEFAULT '',
  publish_date DATE,
  purpose TEXT DEFAULT '',
  target TEXT DEFAULT '',
  assignee_id UUID REFERENCES public.profiles(id),
  priority TEXT NOT NULL DEFAULT '中' CHECK (priority IN ('高','中','低')),
  related_assets UUID[] DEFAULT '{}',
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT '企画中' CHECK (status IN ('企画中','制作中','完了')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. sns_posts テーブル
CREATE TABLE IF NOT EXISTS public.sns_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT DEFAULT '',
  hashtags TEXT[] DEFAULT '{}',
  scheduled_at TIMESTAMPTZ,
  platform TEXT DEFAULT '',
  attachments JSONB DEFAULT '[]',
  purpose TEXT DEFAULT '',
  cta TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT '下書き' CHECK (status IN ('下書き','確認中','承認済み','投稿済み')),
  idea_id UUID REFERENCES public.ideas(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. press_releases テーブル
CREATE TABLE IF NOT EXISTS public.press_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  release_date DATE,
  summary TEXT DEFAULT '',
  body TEXT DEFAULT '',
  images JSONB DEFAULT '[]',
  contact_info TEXT DEFAULT '',
  distribution_targets TEXT[] DEFAULT '{}',
  template_id UUID,
  status TEXT NOT NULL DEFAULT '下書き' CHECK (status IN ('下書き','確認依頼中','差し戻し','承認済み','公開済み')),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. media_contacts テーブル
CREATE TABLE IF NOT EXISTS public.media_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_name TEXT NOT NULL,
  contact_name TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  genres TEXT[] DEFAULT '{}',
  history JSONB DEFAULT '[]',
  coverage_records JSONB DEFAULT '[]',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. assets テーブル
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  file_type TEXT DEFAULT '' CHECK (file_type IN ('画像','動画','ロゴ','PDF','その他','')),
  file_url TEXT DEFAULT '',
  thumbnail_url TEXT DEFAULT '',
  folder TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  usage_scope TEXT DEFAULT '',
  related_project_id UUID,
  uploaded_by UUID REFERENCES public.profiles(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. approvals テーブル
CREATE TABLE IF NOT EXISTS public.approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type TEXT NOT NULL CHECK (target_type IN ('sns_post','press_release','content')),
  target_id UUID NOT NULL,
  target_title TEXT DEFAULT '',
  requester_id UUID REFERENCES public.profiles(id),
  approver_id UUID REFERENCES public.profiles(id),
  status TEXT NOT NULL DEFAULT '確認依頼中' CHECK (status IN ('確認依頼中','差し戻し','承認済み')),
  comment TEXT DEFAULT '',
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 9. performance_reports テーブル
CREATE TABLE IF NOT EXISTS public.performance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type TEXT NOT NULL CHECK (target_type IN ('sns_post','press_release','event')),
  target_id UUID NOT NULL,
  target_title TEXT DEFAULT '',
  impressions INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  inquiries INTEGER DEFAULT 0,
  applications INTEGER DEFAULT 0,
  coverage_count INTEGER DEFAULT 0,
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. events テーブル
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  event_date DATE,
  venue TEXT DEFAULT '',
  target_audience TEXT DEFAULT '',
  announcement_start DATE,
  required_assets TEXT[] DEFAULT '{}',
  posting_plan TEXT DEFAULT '',
  photographer TEXT DEFAULT '',
  report TEXT DEFAULT '',
  tasks JSONB DEFAULT '[]',
  photo_collected BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT '準備中' CHECK (status IN ('準備中','告知中','実施済み','報告完了')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. templates テーブル
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('謝罪文','お知らせ','休講・延期','システム不具合','事故・トラブル','プレスリリース')),
  title TEXT NOT NULL,
  body TEXT DEFAULT '',
  variables TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RLS (Row Level Security) ポリシー
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sns_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーへの全アクセス許可（シンプルなポリシー）
-- 本番ではロールベースにさらに細分化可能

CREATE POLICY "認証済みユーザーは全テーブル参照可" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "自分のプロフィールは更新可" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "プロフィール作成" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "ideas_select" ON public.ideas FOR SELECT TO authenticated USING (true);
CREATE POLICY "ideas_insert" ON public.ideas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "ideas_update" ON public.ideas FOR UPDATE TO authenticated USING (true);
CREATE POLICY "ideas_delete" ON public.ideas FOR DELETE TO authenticated USING (true);

CREATE POLICY "content_plans_select" ON public.content_plans FOR SELECT TO authenticated USING (true);
CREATE POLICY "content_plans_insert" ON public.content_plans FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "content_plans_update" ON public.content_plans FOR UPDATE TO authenticated USING (true);
CREATE POLICY "content_plans_delete" ON public.content_plans FOR DELETE TO authenticated USING (true);

CREATE POLICY "sns_posts_select" ON public.sns_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "sns_posts_insert" ON public.sns_posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "sns_posts_update" ON public.sns_posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "sns_posts_delete" ON public.sns_posts FOR DELETE TO authenticated USING (true);

CREATE POLICY "press_releases_select" ON public.press_releases FOR SELECT TO authenticated USING (true);
CREATE POLICY "press_releases_insert" ON public.press_releases FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "press_releases_update" ON public.press_releases FOR UPDATE TO authenticated USING (true);
CREATE POLICY "press_releases_delete" ON public.press_releases FOR DELETE TO authenticated USING (true);

CREATE POLICY "media_contacts_select" ON public.media_contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "media_contacts_insert" ON public.media_contacts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "media_contacts_update" ON public.media_contacts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "media_contacts_delete" ON public.media_contacts FOR DELETE TO authenticated USING (true);

CREATE POLICY "assets_select" ON public.assets FOR SELECT TO authenticated USING (true);
CREATE POLICY "assets_insert" ON public.assets FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "assets_update" ON public.assets FOR UPDATE TO authenticated USING (true);
CREATE POLICY "assets_delete" ON public.assets FOR DELETE TO authenticated USING (true);

CREATE POLICY "approvals_select" ON public.approvals FOR SELECT TO authenticated USING (true);
CREATE POLICY "approvals_insert" ON public.approvals FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "approvals_update" ON public.approvals FOR UPDATE TO authenticated USING (true);

CREATE POLICY "performance_reports_select" ON public.performance_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "performance_reports_insert" ON public.performance_reports FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "performance_reports_update" ON public.performance_reports FOR UPDATE TO authenticated USING (true);

CREATE POLICY "events_select" ON public.events FOR SELECT TO authenticated USING (true);
CREATE POLICY "events_insert" ON public.events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "events_update" ON public.events FOR UPDATE TO authenticated USING (true);
CREATE POLICY "events_delete" ON public.events FOR DELETE TO authenticated USING (true);

CREATE POLICY "templates_select" ON public.templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "templates_insert" ON public.templates FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "templates_update" ON public.templates FOR UPDATE TO authenticated USING (true);
CREATE POLICY "templates_delete" ON public.templates FOR DELETE TO authenticated USING (true);

-- =============================================
-- 自動更新トリガー
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_ideas BEFORE UPDATE ON public.ideas FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_content_plans BEFORE UPDATE ON public.content_plans FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_sns_posts BEFORE UPDATE ON public.sns_posts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_press_releases BEFORE UPDATE ON public.press_releases FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_media_contacts BEFORE UPDATE ON public.media_contacts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_events BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_templates BEFORE UPDATE ON public.templates FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- 新規ユーザー登録時に自動でprofileを作成
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', '閲覧者')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- Storage バケット
-- =============================================

INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "認証済みユーザーはアップロード可"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'assets');

CREATE POLICY "全員がファイル参照可"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'assets');

CREATE POLICY "アップロード者はファイル削除可"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'assets');
