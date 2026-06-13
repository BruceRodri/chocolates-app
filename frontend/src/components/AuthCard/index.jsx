import './AuthCard.css'

export function AuthCard({ eyebrow, title, subtitle, children, onSubmit, status, statusType = '', wide = false }) {
  return (
    <section className={`auth-card${wide ? ' wide' : ''}`} aria-labelledby={`${title}-title`}>
      <p className="eyebrow">{eyebrow}</p>
      <h1 id={`${title}-title`}>{title}</h1>
      <p>{subtitle}</p>
      <form onSubmit={onSubmit}>{children}</form>
      {status && <p className={`form-status ${statusType}`} key={status}>{status}</p>}
    </section>
  )
}
