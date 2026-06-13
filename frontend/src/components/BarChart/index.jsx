import './BarChart.css'

export function BarChart({ data, formatValue, label, title, xAxisLabel, yAxisLabel, titleExtra }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1)
  const ticks = [1, 0.75, 0.5, 0.25, 0]

  return (
    <section className="chart-card" aria-label={label}>
      <div className="chart-title">
        <h2>{title}</h2>
        {titleExtra}
        <p>{yAxisLabel}</p>
      </div>
      <div className="chart-layout">
        <div className="chart-y-axis" aria-hidden="true">
          {ticks.map((tick) => (
            <span key={tick}>{formatValue(maxValue * tick)}</span>
          ))}
        </div>
        <div className="chart-panel">
          {data.map((item, index) => (
            <div className="bar-column" key={item.label} style={{ '--bar-index': index }}>
              <strong>{formatValue(item.value)}</strong>
              <span style={{ height: `${Math.max((item.value / maxValue) * 100, 8)}%` }} />
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="chart-x-axis">{xAxisLabel}</p>
    </section>
  )
}
