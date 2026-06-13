import './Metric.css'

export function Metric({ label, value }) {
  return (
    <article className="metric">
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  )
}
