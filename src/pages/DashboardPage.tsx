import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Send, Eye, MessageSquare } from 'lucide-react'
import { usePitches } from '@/hooks/usePitches'
import { StatCard } from '@/components/dashboard/StatCard'
import { RecentPitches } from '@/components/dashboard/RecentPitches'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { staggerContainer, staggerItem } from '@/lib/animations'

export function DashboardPage() {
  const { data: pitches, isLoading } = usePitches()
  const navigate = useNavigate()

  const totalPitches = pitches?.length ?? 0
  const sentPitches = pitches?.filter((p) => p.status !== 'draft').length ?? 0
  const openedPitches = pitches?.filter((p) => p.status === 'opened' || p.status === 'feedback').length ?? 0
  const feedbackPitches = pitches?.filter((p) => p.status === 'feedback').length ?? 0

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Quick Actions */}
      <motion.div variants={staggerItem}>
        <QuickActions />
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={staggerItem} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Total Pitches" value={totalPitches} />
        <StatCard icon={Send} label="Sent" value={sentPitches} />
        <StatCard icon={Eye} label="Opened" value={openedPitches} />
        <StatCard icon={MessageSquare} label="Feedback" value={feedbackPitches} />
      </motion.div>

      {/* Recent Pitches */}
      <motion.div variants={staggerItem}>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Pitches</h2>
        <RecentPitches
          pitches={pitches}
          isLoading={isLoading}
          onNewPitch={() => navigate('/dashboard/pitches/new')}
        />
      </motion.div>
    </motion.div>
  )
}
