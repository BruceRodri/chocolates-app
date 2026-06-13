import { REMEMBERED_LOGIN_KEY, SESSION_TOKEN_KEY, SESSION_USER_KEY } from '../constants/config'

export function getStoredSession() {
  const token = localStorage.getItem(SESSION_TOKEN_KEY)
  const user = localStorage.getItem(SESSION_USER_KEY)
  return token && user ? { token, user: JSON.parse(user) } : null
}

export function saveSession(session) {
  localStorage.setItem(SESSION_TOKEN_KEY, session.token)
  localStorage.setItem(SESSION_USER_KEY, JSON.stringify(session.user))
}

export function clearSession() {
  localStorage.removeItem(SESSION_TOKEN_KEY)
  localStorage.removeItem(SESSION_USER_KEY)
}

export function getRememberedLogin() {
  const remembered = localStorage.getItem(REMEMBERED_LOGIN_KEY)

  if (!remembered) {
    return { username: '', password: '', rememberPassword: false }
  }

  try {
    const parsed = JSON.parse(remembered)
    return {
      username: parsed.username || '',
      password: parsed.password || '',
      rememberPassword: Boolean(parsed.password),
    }
  } catch {
    localStorage.removeItem(REMEMBERED_LOGIN_KEY)
    return { username: '', password: '', rememberPassword: false }
  }
}

export function saveRememberedLogin(form) {
  localStorage.setItem(REMEMBERED_LOGIN_KEY, JSON.stringify(form))
}

export function clearRememberedLogin() {
  localStorage.removeItem(REMEMBERED_LOGIN_KEY)
}
