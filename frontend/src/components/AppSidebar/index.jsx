import { ChevronDown, LogOut, Menu, UserCircle, X } from 'lucide-react'
import { NAV_ITEMS } from '../../constants/navigation'
import './AppSidebar.css'

export function AppSidebar({ activeView, mobileOpen, onNavigate, onToggleMobile, onSignOut, session }) {
  return (
    <>
      <button className="mobile-sidebar-button" type="button" onClick={onToggleMobile}>
        {mobileOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        Modules
        <ChevronDown size={16} aria-hidden="true" />
      </button>

      <aside className={`app-sidebar${mobileOpen ? ' open' : ''}`} aria-label="Main modules">
        <div className="sidebar-title">
          <div>
            <strong>Modules</strong>
            <span>Panel</span>
          </div>
        </div>
        <nav className="sidebar-nav sidebar-nav--main">
          {NAV_ITEMS.filter((item) => item.roles.includes(session?.user?.rol)).map((item) => {
            const Icon = item.icon
            return (
              <a
                className={activeView === item.id ? 'active' : ''}
                href={item.path}
                key={item.id}
                onClick={(event) => {
                  event.preventDefault()
                  onNavigate(item.path)
                }}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
              </a>
            )
          })}
        </nav>

        <div className="sidebar-divider" />

        <div className="sidebar-account">
          <div className="sidebar-account-info">
            <UserCircle size={18} aria-hidden="true" />
            <div>
              <strong>{session?.user?.nombreCompleto || 'User'}</strong>
              <span>{session?.user?.puestoTrabajo || 'Operator'}</span>
            </div>
          </div>
          <button type="button" className="sidebar-signout" onClick={onSignOut}>
            <LogOut size={16} aria-hidden="true" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
