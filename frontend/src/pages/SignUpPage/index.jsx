import { useState } from 'react'
import { LogIn, UserPlus } from 'lucide-react'
import { AuthCard } from '../../components/AuthCard'
import { API_BASE } from '../../constants/config'
import { getErrorMessage } from '../../utils/errors'

export function SignUpPage({ onSignedUp, onSignIn }) {
  const [form, setForm] = useState({
    nombre_apellido: '',
    username: '',
    password: '',
    id_turno: '1',
  })
  const [status, setStatus] = useState('')

  async function submit(event) {
    event.preventDefault()
    setStatus('Creating account...')

    try {
      const response = await fetch(`${API_BASE}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_apellido: form.nombre_apellido,
          username: form.username,
          password: form.password,
          id_usuario: Math.floor(Date.now() / 1000),
          id_turno: Number(form.id_turno),
          cargo: 'Co-Worker',
          rol: 'operario',
          activo: true,
        }),
      })
      const payload = await response.json()

      if (!response.ok) throw new Error(getErrorMessage(payload.mensaje, 'Could not create the account'))

      setStatus('Account created. Returning to sign in...')
      window.setTimeout(onSignedUp, 700)
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <AuthCard eyebrow="New Operator" title="Create Account" subtitle="Register an operator account." onSubmit={submit} status={status} wide>
      <label>
        Full name
        <input
          autoComplete="name"
          value={form.nombre_apellido}
          onChange={(event) => setForm({ ...form, nombre_apellido: event.target.value })}
          required
        />
      </label>
      <label>
        Username
        <input
          autoComplete="username"
          value={form.username}
          onChange={(event) => setForm({ ...form, username: event.target.value })}
          required
        />
      </label>
      <label className="full-row">
        Password
        <input
          autoComplete="new-password"
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
        />
      </label>
      <div className="form-grid">
        <label>
          Shift
          <select
            value={form.id_turno}
            onChange={(event) => setForm({ ...form, id_turno: event.target.value })}
            required
          >
            <option value="1">Shift 1</option>
            <option value="2">Shift 2</option>
            <option value="3">Shift 3</option>
          </select>
        </label>
      </div>
      <button className="form-button" type="submit">
        <UserPlus size={18} aria-hidden="true" />
        Create Account
      </button>
      <button className="link-button" type="button" onClick={onSignIn}>
        <LogIn size={17} aria-hidden="true" />
        Already have an account? Sign in
      </button>
    </AuthCard>
  )
}
