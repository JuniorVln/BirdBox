import { Globe } from 'lucide-react'
import { useI18n, type Locale } from '@/hooks/useI18n'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function LanguageSwitcher() {
    const { t, locale, setLocale } = useI18n()

    const options: { value: Locale; label: string }[] = [
        { value: 'pt-BR', label: t.language.ptBR },
        { value: 'en', label: t.language.en },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-text-secondary hover:text-text-primary"
                    title={t.language.label}
                >
                    <Globe className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase hidden sm:block">
                        {locale === 'pt-BR' ? 'PT' : 'EN'}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-surface border-border">
                {options.map((opt) => (
                    <DropdownMenuItem
                        key={opt.value}
                        onClick={() => setLocale(opt.value)}
                        className={`cursor-pointer ${locale === opt.value
                                ? 'text-accent font-medium'
                                : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        {opt.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
