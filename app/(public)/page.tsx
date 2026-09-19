import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Search, BookOpen, FileText, Download, TrendingUp, Compass, Grid, FileQuestion, BookMarked, GraduationCap, ArrowRight } from 'lucide-react'
import { CommunityLinksWrapper } from '@/components/ui/CommunityLinksWrapper'
import { RoleBannersWrapper } from '@/components/ui/RoleBannersWrapper'
import { ResourceCard } from '@/components/ui/ResourceCard'
import { getDictionary } from '@/lib/i18n'

export const metadata = {
  title: 'TamilEduHub - Modern Tamil Educational Resources',
  description: 'Download study materials, question papers, and educational resources for Tamil Nadu school students.',
}

export default async function HomePage() {
  const supabase = await createClient()
  const dict = await getDictionary()

  // Execute all queries in parallel
  const [
    { data: standards },
    { data: studyGuides },
    { data: textbooks },
    { data: questionPapers },
    { data: collections },
    { data: latestResources },
    { data: popularResources }
  ] = await Promise.all([
    supabase.from('standards').select('name, slug, display_order').order('display_order'),
    (supabase.from('resources') as any).select('id, title, slug, description, file_size, views_count, year, standards(name), subjects(name), resource_types(slug, name)').eq('status', 'published').ilike('title', '%guide%').order('created_at', { ascending: false }).limit(4),
    (supabase.from('resources') as any).select('id, title, slug, description, file_size, views_count, year, standards(name), subjects(name), resource_types(slug, name)').eq('status', 'published').ilike('title', '%textbook%').order('created_at', { ascending: false }).limit(4),
    supabase.from('question_papers').select('id, title, slug, description, file_size:pdf_size, views_count, year, standards(name), subjects(name)').eq('status', 'published').order('created_at', { ascending: false }).limit(4),
    (supabase.from('collections') as any).select('id, title, slug, description').order('created_at', { ascending: false }).limit(3),
    (supabase.from('resources') as any).select('id, title, slug, description, file_size, views_count, year, standards(name), subjects(name), resource_types(slug, name)').eq('status', 'published').order('created_at', { ascending: false }).limit(4),
    (supabase.from('resources') as any).select('id, title, slug, description, file_size, views_count, year, standards(name), subjects(name), resource_types(slug, name)').eq('status', 'published').order('views_count', { ascending: false }).limit(4)
  ])

  // Extract standard numbers for the grid (1 to 12)
  const standardCards = standards?.filter((s: any) => s.display_order >= 1 && s.display_order <= 12) || []

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white pt-24 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-800/50 text-blue-200 text-sm font-medium mb-6 border border-blue-700/50 backdrop-blur-sm">
            {dict.heroPill}
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            {dict.heroTitle1}<br className="hidden md:block" /> {dict.heroTitle2}
          </h1>
          <p className="text-base md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            {dict.heroDescription}
          </p>
          
          <form action="/search" method="GET" className="max-w-3xl mx-auto relative flex items-center shadow-2xl group">
            <Search className="absolute left-4 md:left-5 h-5 w-5 md:h-6 md:w-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="search" 
              name="q" 
              placeholder={dict.searchPlaceholder}
              className="w-full h-14 md:h-20 pl-10 md:pl-14 pr-24 md:pr-36 rounded-xl md:rounded-2xl text-slate-900 text-base md:text-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all border-none"
              required
            />
            <Button type="submit" size="lg" className="absolute right-1.5 md:right-3 h-11 md:h-14 px-4 md:px-8 rounded-lg md:rounded-xl bg-blue-600 hover:bg-blue-700 text-sm md:text-lg font-semibold transition-all">
              {dict.searchButton}
            </Button>
          </form>
        </div>
      </section>

      {/* 2. QUICK ACCESS CARDS */}
      <section className="container mx-auto px-4 max-w-7xl -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {[
            { title: dict.textbooks, href: '/textbooks', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
            { title: dict.studyMaterials, href: '/study-guides', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { title: dict.questionPapers, href: '/question-papers', icon: FileQuestion, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { title: dict.notesAndGuides || 'Notes & Guides', href: '/search?q=notes', icon: BookMarked, color: 'text-amber-600', bg: 'bg-amber-50' },
            { title: dict.pdfResources || 'PDF Resources', href: '/resources', icon: Download, color: 'text-rose-600', bg: 'bg-rose-50' },
            { title: dict.popular, href: '/search?sort=popular', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' }
          ].map((item) => (
            <Link href={item.href} key={item.title}>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all h-full flex flex-col items-center justify-center text-center group">
                <div className={`${item.bg} ${item.color} p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="font-semibold text-slate-800 text-sm md:text-base group-hover:text-blue-700 transition-colors">{item.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-16 max-w-7xl space-y-24">
        
        {/* 2.5 CUSTOM ROLE BANNERS */}
        <RoleBannersWrapper />

        {/* 3. STANDARD SELECTOR */}
        {standardCards.length > 0 && (
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">{dict.chooseStandard}</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">{dict.chooseStandardDesc}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {standardCards.map((std: any) => {
                const isHighDemand = std.display_order >= 9;
                return (
                  <Link href={`/${std.slug}`} key={std.slug} className="group block">
                    <div className={`bg-white rounded-2xl p-6 text-center shadow-sm border transition-all h-full flex flex-col items-center justify-center relative overflow-hidden ${isHighDemand ? 'border-blue-200 hover:border-blue-500 hover:shadow-blue-100' : 'border-slate-200 hover:border-blue-400'}`}>
                      {isHighDemand && <div className="absolute top-0 right-0 w-12 h-12 bg-blue-50 transform rotate-45 translate-x-6 -translate-y-6 group-hover:bg-blue-100 transition-colors" />}
                      <span className={`text-4xl md:text-5xl font-black mb-2 ${isHighDemand ? 'text-blue-600' : 'text-slate-700 group-hover:text-blue-600 transition-colors'}`}>
                        {std.display_order}
                      </span>
                      <span className="text-sm md:text-base font-semibold text-slate-600">{dict.class}</span>
                      <div className="flex gap-2 mt-3 opacity-60 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Tamil</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">English</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* 4. FEATURED COLLECTIONS */}
        {collections && collections.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">{dict.featuredCollections || 'Featured Collections'}</h2>
                <p className="text-slate-500">பல்வேறு வளங்களை ஒன்றிணைத்த சிறப்பு தொகுப்புகள்.</p>
              </div>
              <Link href="/search?q=collections" className="hidden md:flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2 rounded-full">
                அனைத்தும் <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {collections.map((col: any) => (
                <Link href={`/collections/${col.slug}`} key={col.id} className="group">
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all h-full flex flex-col">
                    <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform group-hover:bg-blue-600 group-hover:text-white">
                      <Grid className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">{col.title}</h3>
                    <p className="text-slate-500 mb-6 line-clamp-3">{col.description}</p>
                    <div className="mt-auto text-blue-600 font-medium flex items-center group-hover:translate-x-2 transition-transform">
                      தொகுப்பை பார்க்க <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 5. SPLIT VIEW: LATEST & POPULAR */}
        <section className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* POPULAR */}
          <div>
            <div className="flex justify-between items-center border-b-2 border-slate-200 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-rose-100 text-rose-600 rounded-lg"><TrendingUp className="h-5 w-5" /></div>
                {dict.popularResources}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {popularResources?.map((res: any) => <ResourceCard key={res.id} resource={res} />)}
            </div>
            <div className="mt-6 text-center">
              <Link href="/resources" className="text-blue-600 font-medium hover:underline flex items-center justify-center gap-2">
                {dict.viewAllPopular} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* LATEST */}
          <div>
            <div className="flex justify-between items-center border-b-2 border-slate-200 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><BookOpen className="h-5 w-5" /></div>
                {dict.latestResources}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {latestResources?.map((res: any) => <ResourceCard key={res.id} resource={res} />)}
            </div>
            <div className="mt-6 text-center">
              <Link href="/resources" className="text-blue-600 font-medium hover:underline flex items-center justify-center gap-2">
                {dict.viewAllLatest} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. COMMUNITY ACQUISITION (CORE) */}
        <div className="max-w-[1100px] mx-auto w-full px-4 mb-16">
          <CommunityLinksWrapper location="homepage_bottom" compact={false} />
        </div>

      </main>
    </div>
  )
}
