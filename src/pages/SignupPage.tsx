import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { useI18n } from '@/hooks/useI18n'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signUp } = useAuth()
  const session = useAuthStore((s) => s.session)
  const loading = useAuthStore((s) => s.loading)
  const navigate = useNavigate()
  const { t } = useI18n()

  if (loading) return null
  if (session) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsSubmitting(true)

    try {
      await signUp(email, password, fullName)
      navigate('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create account'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <Card className="bg-surface border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-text-primary">{t.auth.createAccount}</CardTitle>
          <CardDescription className="text-text-secondary">
            {t.auth.createAccountDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-950/50 border border-red-900 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-text-secondary">
                {t.auth.fullName}
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder={t.auth.fullNamePlaceholder}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-background border-border text-text-primary placeholder:text-text-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-text-secondary">
                {t.auth.email}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t.auth.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-border text-text-primary placeholder:text-text-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-text-secondary">
                {t.auth.password}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={t.auth.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background border-border text-text-primary placeholder:text-text-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-text-secondary">
                {t.auth.confirmPassword}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t.auth.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-background border-border text-text-primary placeholder:text-text-muted"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent hover:bg-accent-hover text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.auth.creatingAccount}
                </>
              ) : (
                t.auth.createAccount
              )}
            </Button>

            <p className="text-center text-sm text-text-secondary">
              {t.auth.hasAccount}{' '}
              <Link to="/login" className="text-accent hover:text-accent-hover font-medium">
                {t.auth.signInLink}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
