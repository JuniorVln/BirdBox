import { useNavigate } from 'react-router-dom'
import { Search, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/hooks/useI18n'

export function QuickActions() {
  const navigate = useNavigate()
  const { t } = useI18n()

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() => navigate('/dashboard/leads')}
        className="bg-accent hover:bg-accent-hover text-white"
      >
        <Search className="mr-2 h-4 w-4" />
        {t.dashboard.findLeads}
      </Button>
      <Button
        variant="outline"
        onClick={() => navigate('/dashboard/prospects')}
        className="border-border text-text-primary hover:bg-surface-raised"
      >
        <Users className="mr-2 h-4 w-4" />
        {t.dashboard.viewProspects}
      </Button>
    </div>
  )
}
