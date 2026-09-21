import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamil-edu-hub.vercel.app'
  const supabase = await createClient()

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/students`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/teachers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/competitive-exams`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/question-papers`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/articles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ]

  // Fetch dynamic slugs
  const [
    { data: resources },
    { data: qps },
    { data: articles },
    { data: standards },
    { data: subjects },
    { data: collections },
    { data: examTypes }
  ] = await Promise.all([
    supabase.from('resources').select('slug, updated_at').eq('status', 'published'),
    supabase.from('question_papers').select('slug, updated_at').eq('status', 'published'),
    supabase.from('articles').select('slug, updated_at').eq('status', 'published'),
    supabase.from('standards').select('slug'),
    supabase.from('subjects').select('slug'),
    (supabase.from('collections') as any).select('slug, updated_at'),
    supabase.from('exam_types').select('slug')
  ])

  // Append dynamic routes
  if (resources) {
    resources.forEach((res: any) => {
      routes.push({
        url: `${baseUrl}/resources/${res.slug}`,
        lastModified: new Date(res.updated_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    })
  }

  if (qps) {
    qps.forEach((qp: any) => {
      routes.push({
        url: `${baseUrl}/question-papers/${qp.slug}`,
        lastModified: new Date(qp.updated_at || new Date()),
        changeFrequency: 'yearly',
        priority: 0.7,
      })
    })
  }

  if (articles) {
    articles.forEach((article: any) => {
      routes.push({
        url: `${baseUrl}/articles/${article.slug}`,
        lastModified: new Date(article.updated_at || new Date()),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    })
  }

  if (standards && subjects) {
    standards.forEach((std: any) => {
      routes.push({
        url: `${baseUrl}/${std.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
      subjects.forEach((sub: any) => {
        routes.push({
          url: `${baseUrl}/${std.slug}/${sub.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      })
    })
  }

  if (examTypes) {
    examTypes.forEach((exam: any) => {
      routes.push({
        url: `${baseUrl}/${exam.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })
  }

  if (collections) {
    collections.forEach((col: any) => {
      routes.push({
        url: `${baseUrl}/collections/${col.slug}`,
        lastModified: col.updated_at ? new Date(col.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })
  }

  return routes
}
