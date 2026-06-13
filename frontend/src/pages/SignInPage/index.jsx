import { useRef, useState } from 'react'
import { Eye, EyeOff, Loader, LogIn, UserPlus } from 'lucide-react'
import { AuthCard } from '../../components/AuthCard'
import { API_BASE } from '../../constants/config'
import { getErrorMessage } from '../../utils/errors'
import { clearRememberedLogin, getRememberedLogin, saveRememberedLogin } from '../../utils/session'

const MIN_LOADING_MS = 700
const ERROR_DISPLAY_MS = 3000

export function SignInPage({ onSignedIn, onSignUp }) {
  const [rememberedLogin] = useState(getRememberedLogin)
  const [form, setForm] = useState({
    username: rememberedLogin.username,
    password: rememberedLogin.password,
  })
  const [rememberPassword, setRememberPassword] = useState(rememberedLogin.rememberPassword)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [buttonLabel, setButtonLabel] = useState('Sign in')
  const errorTimer = useRef(null)

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setButtonLabel('Signing in...')

    if (errorTimer.current) {
      clearTimeout(errorTimer.current)
      errorTimer.current = null
    }

    const startTime = Date.now()

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const payload = await response.json()

      if (!response.ok) throw new Error(getErrorMessage(payload.mensaje, 'Could not sign in'))

      if (rememberPassword) {
        saveRememberedLogin(form)
      } else {
        clearRememberedLogin()
      }

      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed)

      await new Promise((resolve) => setTimeout(resolve, remaining))

      onSignedIn({ token: payload.token, user: payload.data })
    } catch (error) {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed)

      await new Promise((resolve) => setTimeout(resolve, remaining))

      setLoading(false)
      setButtonLabel(error.message)

      errorTimer.current = setTimeout(() => {
        setButtonLabel('Sign in')
        errorTimer.current = null
      }, ERROR_DISPLAY_MS)
    }
  }

  const isError = !loading && buttonLabel !== 'Sign in'

  return (
    <AuthCard eyebrow="Plant Access" title="Sign In" subtitle="Use your operator account." onSubmit={submit}>
      <label>
        Username
        <input
          autoComplete="username"
          value={form.username}
          onChange={(event) => setForm({ ...form, username: event.target.value })}
          disabled={loading}
          required
        />
      </label>
      <label>
        Password
        <span className="password-field">
          <input
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            disabled={loading}
            required
          />
          <button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </span>
      </label>
      <label className="check-row">
        <input
          checked={rememberPassword}
          type="checkbox"
          onChange={(event) => setRememberPassword(event.target.checked)}
          disabled={loading}
        />
        Remember password
      </label>
      <button className="form-button" type="submit" disabled={loading}>
        {loading ? <Loader size={18} className="spin" aria-hidden="true" /> : <LogIn size={18} aria-hidden="true" />}
        {buttonLabel}
      </button>
      <button className="link-button" type="button" onClick={onSignUp}>
        <UserPlus size={17} aria-hidden="true" />
        Create account
      </button>
    </AuthCard>
  )
}