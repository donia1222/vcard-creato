'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { t, LANGS, DEFAULT_LANG, LS_KEY, type Lang } from '@/lib/i18n'

interface I18nContextValue {
  lang: Lang
  tr: (key: string) => string
  setLang: (lang: Lang) => void
}

const I18nContext = createContext<I18nContextValue>({
  lang: DEFAULT_LANG,
  tr: (k) => k,
  setLang: () => {},
})

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG)

  useEffect(() => {
    // 1. Check localStorage
    const saved = localStorage.getItem(LS_KEY) as Lang | null
    if (saved && LANGS.includes(saved)) {
      setLangState(saved)
      return
    }
    // 2. Detect from browser — same logic as portfolio
    const browser = (navigator.language || 'de').slice(0, 2).toLowerCase() as Lang
    const detected = LANGS.includes(browser) ? browser : DEFAULT_LANG
    setLangState(detected)
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem(LS_KEY, l)
  }, [])

  const tr = useCallback(
    (key: string) => t[lang]?.[key] ?? t[DEFAULT_LANG]?.[key] ?? key,
    [lang]
  )

  return (
    <I18nContext.Provider value={{ lang, tr, setLang }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}

// Language switcher buttons — same style as portfolio footer
export function LangSwitcher() {
  const { lang, setLang } = useI18n()
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '6px 13px', borderRadius: 1000,
            border: `1.5px solid ${lang === l ? '#fe6c75' : '#c8d5e3'}`,
            background: lang === l ? '#fe6c75' : 'transparent',
            color: lang === l ? '#fff' : '#6b7d99',
            fontSize: 12, fontWeight: 700,
            fontFamily: 'inherit', cursor: 'pointer',
            transition: 'all 200ms ease',
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
