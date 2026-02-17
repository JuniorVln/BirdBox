import { useState } from 'react'
import { motion } from 'framer-motion'
import { Monitor, Tablet, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface PitchPreviewProps {
  html: string
}

const devices = [
  { id: 'desktop', icon: Monitor, label: 'Desktop', width: '100%' },
  { id: 'tablet', icon: Tablet, label: 'Tablet', width: '768px' },
  { id: 'mobile', icon: Smartphone, label: 'Mobile', width: '375px' },
] as const

type DeviceType = (typeof devices)[number]['id']

export function PitchPreview({ html }: PitchPreviewProps) {
  const [device, setDevice] = useState<DeviceType>('desktop')
  const currentDevice = devices.find((d) => d.id === device)!

  return (
    <div className="flex flex-col h-full">
      {/* Device Toggle */}
      <div className="flex items-center gap-1 mb-4">
        {devices.map((d) => (
          <Button
            key={d.id}
            variant="ghost"
            size="sm"
            onClick={() => setDevice(d.id)}
            className={cn(
              'gap-2',
              device === d.id
                ? 'bg-accent/10 text-accent'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            <d.icon className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">{d.label}</span>
          </Button>
        ))}
      </div>

      {/* Preview Frame */}
      <div className="flex-1 rounded-xl border border-border bg-surface overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border bg-surface-raised">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
          <span className="ml-3 text-[11px] text-text-muted">Preview — {currentDevice.label}</span>
        </div>
        <div className="flex justify-center bg-zinc-900 overflow-auto" style={{ minHeight: '500px' }}>
          <motion.iframe
            key={device}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1, width: currentDevice.width }}
            transition={{ duration: 0.3 }}
            srcDoc={html}
            className="h-[600px] border-0 bg-white"
            style={{ width: currentDevice.width, maxWidth: '100%' }}
            title="Pitch Preview"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  )
}
