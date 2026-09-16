import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamileduhub.com'
  const supabase = await createClient()

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/school`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/question-papers`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/articles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  // Fetch dynamic slugs
  const [
    { data: resources },
    { data: qps },
    { data: articles }
  ] = await Promise.all([
    supabase.from('resources').select('slug, updated_at').eq('status', 'published'),
    supabase.from('question_papers').select('slug, updated_at').eq('status', 'published'),
    supabase.from('articles').select('slug, updated_at').eq('status', 'published'),
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
        changeFrequency: 'yearly', // Q-papers rarely change
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

  return routes
}
