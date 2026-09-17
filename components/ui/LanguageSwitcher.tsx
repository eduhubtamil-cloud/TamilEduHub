'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, ChevronDown } from 'lucide-react'
import { setLanguage } from '@/app/actions/language'

interface LanguageSwitcherProps {
  currentLang: 'en' | 'ta'
}

export function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSwitch = async (lang: 'en' | 'ta') => {
    if (lang === currentLang) {
      setIsOpen(false)
      return
    }
    
    setIsPending(true)
    setIsOpen(false)
    
    // Save to local storage per requirements
    try {
      localStorage.setItem('tamileduhub-language', lang)
    } catch (e) {}

    // Call server action to set cookie
    await setLanguage(lang)
    
    // Refresh router to fetch new server-rendered UI
    router.refresh()
    
    // reset pending state after a delay to allow refresh to complete
    setTimeout(() => {
      setIsPending(false)
    }, 1000)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center justify-center gap-1.5 h-[38px] px-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Change language"
      >
        <Globe className="h-4 w-4 text-blue-600" />
        <span className="uppercase">{currentLang}</span>
        <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
          <button
            onClick={() => handleSwitch('en')}
            className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-slate-50 ${currentLang === 'en' ? 'font-bold text-blue-600' : 'text-slate-700'}`}
          >
            English
          </button>
          <button
            onClick={() => handleSwitch('ta')}
            className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-slate-50 ${currentLang === 'ta' ? 'font-bold text-blue-600 font-tamil' : 'text-slate-700 font-tamil'}`}
          >
            தமிழ்
          </button>
        </div>
      )}
    </div>
  )
}
