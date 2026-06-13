import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { AppSidebar } from './components/AppSidebar'
import { ToastProvider } from './components/Toast'
import { CRUD_RESOURCES, NAV_ITEMS } from './constants/navigation'
import { CrudPage } from './pages/CrudPage'
import { DashboardPage } from './pages/DashboardPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { clearSession, getStoredSession, saveSession } from './utils/session'

const SIGN_IN_PATH = '/signin'
const SIGN_UP_PATH = '/signup'
const DASHBOARD_PATH = '/dashboard'
const PUBLIC_PATHS = [SIGN_IN_PATH, SIGN_UP_PATH]

function getCurrentPath() {
  return window.location.pathname || '/'
}

function App() {
  const [session, setSession] = useState(getStoredSession)
  const [path, setPath] = useState(getCurrentPath)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const activeItem = useMemo(() => NAV_ITEMS.find((item) => item.path === path), [path])
  const activeView = activeItem?.id || 'dashboard'
  const publicView = path === SIGN_UP_PATH ? 'signup' : 'signin'

  const navigateTo = useCallback((nextPath, options = {}) => {
    if (nextPath === path) {
      setPath(nextPath)
      return
    }

    if (options.replace) {
      window.history.replaceState({}, '', nextPath)
    } else {
      window.history.pushState({}, '', nextPath)
    }

    setPath(nextPath)
  }, [path])

  useEffect(() => {
    function handlePopState() {
      setSidebarOpen(false)
      setPath(getCurrentPath())
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const isPublicPath = PUBLIC_PATHS.includes(path)
    const isAppPath = NAV_ITEMS.some((item) => item.path === path)

    if (session) {
      if (path === '/' || isPublicPath || !isAppPath) {
        navigateTo(DASHBOARD_PATH, { replace: true })
        return
      }

      const activeItem = NAV_ITEMS.find((item) => item.path === path)
      if (activeItem && !activeItem.roles.includes(session?.user?.rol)) {
        navigateTo(DASHBOARD_PATH, { replace: true })
      }
      return
    }

    if (!isPublicPath) {
      navigateTo(SIGN_IN_PATH, { replace: true })
    }
  }, [navigateTo, path, session])

  function goSignIn() {
    setSidebarOpen(false)
    navigateTo(SIGN_IN_PATH)
  }

  function goSignUp() {
    setSidebarOpen(false)
    navigateTo(SIGN_UP_PATH)
  }

  function navigateApp(nextPath) {
    setSidebarOpen(false)
    navigateTo(nextPath)
  }

  function handleSignedIn(nextSession) {
    saveSession(nextSession)
    setSession(nextSession)
    navigateTo(DASHBOARD_PATH, { replace: true })
  }

  function signOut() {
    clearSession()
    setSidebarOpen(false)
    setSession(null)
    navigateTo(SIGN_IN_PATH, { replace: true })
  }

  return (
    <>
      <ToastProvider>
        {session ? (
          <div className="app-body">
            <AppSidebar
              activeView={activeView}
              mobileOpen={sidebarOpen}
              onNavigate={navigateApp}
              onToggleMobile={() => setSidebarOpen(!sidebarOpen)}
              onSignOut={signOut}
              session={session}
            />

            <main className="app-shell with-sidebar">
              {activeView === 'dashboard' && <DashboardPage key="dashboard" session={session} />}
              {CRUD_RESOURCES[activeView] && (
                <CrudPage
                  key={activeView}
                  resource={CRUD_RESOURCES[activeView]}
                  session={session}
                />
              )}
            </main>
          </div>
        ) : (
          <main className="app-shell">
            {publicView === 'signin' && <SignInPage key="signin" onSignedIn={handleSignedIn} onSignUp={goSignUp} />}
            {publicView === 'signup' && <SignUpPage key="signup" onSignedUp={goSignIn} onSignIn={goSignIn} />}
          </main>
        )}
      </ToastProvider>
    </>
  )
}

export default App
