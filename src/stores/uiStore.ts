import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Locale } from '@/lib/i18n'

interface UIState {
  sidebarCollapsed: boolean
  locale: Locale
  toggleSidebar: () => void
  setLocale: (locale: Locale) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      locale: 'pt-BR',
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'pitch-ai-ui',
    }
  )
)
