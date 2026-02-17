import { useNavigate } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() => navigate('/dashboard/pitches/new')}
        className="bg-accent hover:bg-accent-hover text-white"
      >
        <Plus className="mr-2 h-4 w-4" />
        New Pitch
      </Button>
      <Button
        variant="outline"
        onClick={() => navigate('/dashboard/leads')}
        className="border-border text-text-primary hover:bg-surface-raised"
      >
        <Search className="mr-2 h-4 w-4" />
        Find Leads
      </Button>
    </div>
  )
}
