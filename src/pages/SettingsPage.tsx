import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { fadeInUp } from '@/lib/animations'

export function SettingsPage() {
  const { profile } = useAuth()
  const setProfile = useAuthStore((s) => s.setProfile)

  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [agencyName, setAgencyName] = useState(profile?.agency_name ?? '')
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedin_url ?? '')
  const [twitterUrl, setTwitterUrl] = useState(profile?.twitter_url ?? '')
  const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setIsSaving(true)
    setSaved(false)

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        agency_name: agencyName || null,
        linkedin_url: linkedinUrl || null,
        twitter_url: twitterUrl || null,
        website_url: websiteUrl || null,
      })
      .eq('id', profile.id)
      .select()
      .single()

    if (!error && data) {
      setProfile(data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }

    setIsSaving(false)
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="max-w-2xl"
    >
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="text-text-primary">Profile Settings</CardTitle>
          <CardDescription className="text-text-secondary">
            Update your profile information. This appears on generated websites.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-text-secondary">Full Name</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-background border-border text-text-primary"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-text-secondary">Agency Name</Label>
                <Input
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="Optional"
                  className="bg-background border-border text-text-primary placeholder:text-text-muted"
                />
              </div>
            </div>

            <Separator className="bg-border" />

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-text-primary">Social Links</h3>

              <div className="space-y-2">
                <Label className="text-text-secondary">LinkedIn</Label>
                <Input
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="bg-background border-border text-text-primary placeholder:text-text-muted"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-text-secondary">Twitter / X</Label>
                <Input
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://twitter.com/..."
                  className="bg-background border-border text-text-primary placeholder:text-text-muted"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-text-secondary">Website</Label>
                <Input
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yoursite.com"
                  className="bg-background border-border text-text-primary placeholder:text-text-muted"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-accent hover:bg-accent-hover text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              {saved && (
                <span className="text-sm text-green-400">Changes saved!</span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
