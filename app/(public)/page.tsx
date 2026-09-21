import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Search, BookOpen, FileText, Download, TrendingUp, Compass, Grid, FileQuestion, BookMarked, GraduationCap, ArrowRight, MessageCircle, Send } from 'lucide-react'
import { CommunityLinksWrapper } from '@/components/ui/CommunityLinksWrapper'
import { RoleBannersWrapper } from '@/components/ui/RoleBannersWrapper'
import { FeaturesBanner } from '@/components/ui/FeaturesBanner'
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
      <section className="relative pt-24 pb-32 md:pb-40 px-4 text-center overflow-hidden flex flex-col items-center justify-center bg-[#0B0F19]">
        
        {/* Animated Aurora / Glow Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen"></div>
          <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] mix-blend-screen"></div>
          <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[120px] mix-blend-screen"></div>
          
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        </div>

        {/* Floating Decorative Banners (Large Desktop Only) - Fixed Overlap */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1400px] h-[600px] pointer-events-none z-0 hidden xl:block">
          
          {/* Top Left */}
          <div className="absolute left-4 top-10 animate-bounce [animation-duration:5s] bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 text-left shadow-2xl">
            <div className="bg-[#25D366]/20 text-[#25D366] p-3 rounded-full border border-[#25D366]/30">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Join WhatsApp</p>
              <p className="text-slate-400 text-xs">10,000+ Students</p>
            </div>
          </div>
          
          {/* Bottom Left */}
          <div className="absolute left-16 bottom-16 animate-bounce [animation-duration:6s] [animation-delay:1s] bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex items-center gap-3 text-left shadow-2xl">
            <div className="bg-amber-500/20 text-amber-500 p-2 rounded-full border border-amber-500/30">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Free Materials</p>
            </div>
          </div>

          {/* Top Right */}
          <div className="absolute right-4 top-20 animate-bounce [animation-duration:5.5s] [animation-delay:0.5s] bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 text-left shadow-2xl">
            <div className="bg-[#0088cc]/20 text-[#0088cc] p-3 rounded-full border border-[#0088cc]/30">
              <Send className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Telegram Group</p>
              <p className="text-slate-400 text-xs">Daily Updates</p>
            </div>
          </div>

          {/* Bottom Right */}
          <div className="absolute right-16 bottom-24 animate-bounce [animation-duration:5s] [animation-delay:1.5s] bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex items-center gap-3 text-left shadow-2xl">
            <div className="bg-emerald-500/20 text-emerald-500 p-2 rounded-full border border-emerald-500/30">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Verified Papers</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 w-full">
          {/* Premium Pill */}
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-blue-200 text-sm font-semibold tracking-wide uppercase">
              {dict.heroPill}
            </span>
          </div>

          {/* Gradient Text Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.15] text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-slate-300 drop-shadow-sm">
            {dict.heroTitle1}<br className="hidden md:block" /> {dict.heroTitle2}
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            {dict.heroDescription}
          </p>
          
          {/* Premium Search Bar */}
          <form action="/search" method="GET" className="max-w-3xl mx-auto relative flex items-center group w-full px-4 md:px-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-20 group-focus-within:opacity-40 transition-opacity duration-500"></div>
            <Search className="absolute left-8 md:left-6 h-5 w-5 md:h-6 md:w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10" />
            <input 
              type="search" 
              name="q" 
              placeholder={dict.searchPlaceholder}
              className="w-full h-14 md:h-20 pl-14 md:pl-16 pr-24 md:pr-40 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-base md:text-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 backdrop-blur-xl transition-all shadow-2xl relative z-0"
              required
            />
            <Button type="submit" size="lg" className="absolute right-6 md:right-3 h-10 md:h-14 px-4 md:px-8 rounded-lg md:rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm md:text-lg font-bold transition-all shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 z-10 border border-blue-500/50">
              {dict.searchButton}
            </Button>
          </form>
        </div>
      </section>

      {/* 2. QUICK ACCESS CARDS */}
      <section className="container mx-auto px-4 max-w-7xl -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/students">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 hover:shadow-2xl hover:border-blue-300 transition-all h-full flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-150 transition-transform duration-500" />
              <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl mb-6 w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors relative z-10">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 relative z-10">Students</h3>
              <p className="text-slate-500 font-medium relative z-10 flex-1">Classes 1–12 Textbooks, notes, guides, question papers and more.</p>
              <div className="mt-6 flex items-center text-blue-600 font-semibold relative z-10 group-hover:translate-x-2 transition-transform">
                Explore Students <ArrowRight className="h-5 w-5 ml-2" />
              </div>
            </div>
          </Link>

          <Link href="/teachers">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 hover:shadow-2xl hover:border-indigo-300 transition-all h-full flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-150 transition-transform duration-500" />
              <div className="bg-indigo-100 text-indigo-600 p-4 rounded-2xl mb-6 w-fit group-hover:bg-indigo-600 group-hover:text-white transition-colors relative z-10">
                <GraduationCap className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 relative z-10">Teachers & Educators</h3>
              <p className="text-slate-500 font-medium relative z-10 flex-1">Lesson plans, worksheets, teaching materials and question banks.</p>
              <div className="mt-6 flex items-center text-indigo-600 font-semibold relative z-10 group-hover:translate-x-2 transition-transform">
                Explore Teachers <ArrowRight className="h-5 w-5 ml-2" />
              </div>
            </div>
          </Link>

          <Link href="/competitive-exams">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 hover:shadow-2xl hover:border-emerald-300 transition-all h-full flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-150 transition-transform duration-500" />
              <div className="bg-emerald-100 text-emerald-600 p-4 rounded-2xl mb-6 w-fit group-hover:bg-emerald-600 group-hover:text-white transition-colors relative z-10">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 relative z-10">Competitive Exams</h3>
              <p className="text-slate-500 font-medium relative z-10 flex-1">Previous papers, study materials, syllabus and preparation resources.</p>
              <div className="mt-6 flex items-center text-emerald-600 font-semibold relative z-10 group-hover:translate-x-2 transition-transform">
                Explore Exams <ArrowRight className="h-5 w-5 ml-2" />
              </div>
            </div>
          </Link>
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
              <Link href="/collections" className="hidden md:flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2 rounded-full">
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

        <FeaturesBanner dict={dict} />

        {/* 6. COMMUNITY ACQUISITION (CORE) */}
        <div className="max-w-[1100px] mx-auto w-full px-4 mb-16">
          <CommunityLinksWrapper location="homepage_bottom" compact={false} />
        </div>

      </main>
    </div>
  )
}
