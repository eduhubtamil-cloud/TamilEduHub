-- Create roles table
CREATE TABLE roles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE
);

-- Insert default roles
INSERT INTO roles (name) VALUES ('Super Admin'), ('Editor'), ('Author'), ('User');

-- Create profiles table
CREATE TABLE profiles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role_id uuid REFERENCES roles(id) ON DELETE SET NULL,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create standards table
CREATE TABLE standards (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    seo_title text,
    seo_description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create subjects table
CREATE TABLE subjects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    seo_title text,
    seo_description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create mediums table
CREATE TABLE mediums (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create categories table
CREATE TABLE categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create resource_types table
CREATE TABLE resource_types (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create tags table
CREATE TABLE tags (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create articles table
CREATE TABLE articles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    excerpt text,
    content text,
    featured_image text,
    category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
    author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'scheduled', 'published', 'archived', 'deleted')),
    published_at timestamp with time zone,
    seo_title text,
    seo_description text,
    canonical_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create resources table
CREATE TABLE resources (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    standard_id uuid REFERENCES standards(id) ON DELETE SET NULL,
    subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL,
    resource_type_id uuid REFERENCES resource_types(id) ON DELETE SET NULL,
    medium_id uuid REFERENCES mediums(id) ON DELETE SET NULL,
    year integer,
    thumbnail_url text,
    file_url text,
    file_size integer,
    page_count integer,
    author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'scheduled', 'published', 'archived', 'deleted')),
    published_at timestamp with time zone,
    seo_title text,
    seo_description text,
    canonical_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create question_papers table
CREATE TABLE question_papers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    standard_id uuid REFERENCES standards(id) ON DELETE SET NULL,
    subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL,
    exam_type text,
    year integer,
    medium_id uuid REFERENCES mediums(id) ON DELETE SET NULL,
    pdf_url text,
    answer_key_url text,
    thumbnail_url text,
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'scheduled', 'published', 'archived', 'deleted')),
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create announcements table
CREATE TABLE announcements (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    content text,
    date timestamp with time zone,
    source text,
    featured_image text,
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'scheduled', 'published', 'archived', 'deleted')),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create article_tags table
CREATE TABLE article_tags (
    article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
    tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

-- Create resource_tags table
CREATE TABLE resource_tags (
    resource_id uuid REFERENCES resources(id) ON DELETE CASCADE,
    tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (resource_id, tag_id)
);

-- Create bookmarks table
CREATE TABLE bookmarks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    content_type text NOT NULL CHECK (content_type IN ('article', 'resource', 'question_paper')),
    content_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create downloads table
CREATE TABLE downloads (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
    resource_id uuid REFERENCES resources(id) ON DELETE CASCADE,
    ip_address text,
    device_type text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create media table
CREATE TABLE media (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    filename text NOT NULL,
    file_url text NOT NULL,
    mime_type text,
    size integer,
    uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create advertisements table
CREATE TABLE advertisements (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    placement text NOT NULL,
    config text,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    is_active boolean DEFAULT true,
    priority integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create site_settings table
CREATE TABLE site_settings (
    key text PRIMARY KEY,
    value text NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

-- Create navigation_items table
CREATE TABLE navigation_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    label text NOT NULL,
    url text NOT NULL,
    parent_id uuid REFERENCES navigation_items(id) ON DELETE SET NULL,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE audit_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
    action text NOT NULL,
    entity_type text,
    entity_id uuid,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Add Indexes for Performance
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_resources_slug ON resources(slug);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_standard_id ON resources(standard_id);
CREATE INDEX idx_resources_subject_id ON resources(subject_id);
CREATE INDEX idx_resources_resource_type_id ON resources(resource_type_id);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_downloads_resource_id ON downloads(resource_id);

-- Add Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE mediums ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Note: RLS policies will be defined in a separate or extended migration script.
