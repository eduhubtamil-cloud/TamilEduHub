import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">TamilEduHub</h3>
            <p className="text-sm text-slate-500">
              A modern educational resource platform for Tamil Nadu school students, providing study materials, guides, and articles.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/school" className="hover:text-blue-600">School Standards</Link></li>
              <li><Link href="/resources" className="hover:text-blue-600">Study Materials</Link></li>
              <li><Link href="/articles" className="hover:text-blue-600">Educational Articles</Link></li>
              <li><Link href="/search" className="hover:text-blue-600">Search Resources</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-blue-600">Disclaimer</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} TamilEduHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
