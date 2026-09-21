import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { CommunityLinksWrapper } from '@/components/ui/CommunityLinksWrapper'

import { getDictionary } from "@/lib/i18n";

export async function Footer() {
  const dict = await getDictionary();
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6 group">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white group-hover:bg-blue-500 transition-colors">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="font-bold text-2xl text-white">TamilEduHub</span>
            </Link>
            <p className="text-slate-400 mb-6 leading-relaxed max-w-sm">{dict.footerDesc}</p>
            <div className="mb-4">
              <h4 className="text-white font-semibold mb-3">{dict.footerConnect}</h4>
              <CommunityLinksWrapper location="footer" variant="icon" />
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">School Resources</h4>
            <ul className="space-y-3">
              <li><Link href="/resources" className="hover:text-white transition-colors">{dict.footerStandards}</Link></li>
              <li><Link href="/resources" className="hover:text-white transition-colors">{dict.footerSubjects}</Link></li>
              <li><Link href="/textbook" className="hover:text-white transition-colors">{dict.footerTextbooks}</Link></li>
              <li><Link href="/study-guide" className="hover:text-white transition-colors">{dict.footerStudyMaterials}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-6 tracking-wider text-sm">{dict.footerResources}</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/question-papers" className="hover:text-white transition-colors">{dict.footerQuestionPapers}</Link></li>
              <li><Link href="/collections" className="hover:text-white transition-colors">{dict.footerCollections}</Link></li>
              <li><Link href="/articles" className="hover:text-white transition-colors">{dict.footerEducationalNews}</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">{dict.footerSearchResources}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Legal & Help</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} TamilEduHub. All rights reserved.</p>
          <p>{dict.builtFor}</p>
        </div>
      </div>
    </footer>
  )
}
