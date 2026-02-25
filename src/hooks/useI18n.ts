import { useUIStore } from '@/stores/uiStore'
import { translations, type Locale, type TranslationKeys } from '@/lib/i18n'

export function useI18n() {
    const locale = useUIStore((s) => s.locale)
    const setLocale = useUIStore((s) => s.setLocale)

    const t: TranslationKeys = translations[locale]

    return { t, locale, setLocale }
}

export type { Locale }
