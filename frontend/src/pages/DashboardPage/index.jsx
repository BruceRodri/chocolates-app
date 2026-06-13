import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Package } from 'lucide-react'
import { BarChart } from '../../components/BarChart'
import { API_BASE } from '../../constants/config'
import { formatNumber } from '../../utils/formatters'
import './DashboardPage.css'

function getChartData(reporte) {
  if (!reporte) return []

  return [
    { label: 'Moldes', value: reporte.calculosLibras?.enMoldes },
    { label: 'Banda', value: reporte.calculosLibras?.enBanda },
    { label: 'Morcos', value: reporte.calculosLibras?.enTanqueMorcos },
    { label: 'Temper', value: reporte.calculosLibras?.enTemperUnit },
    { label: 'PTI', value: reporte.calculosLibras?.enTanquePti },
    { label: 'Hopper', value: reporte.calculosLibras?.enHopper },
    { label: 'Piso', value: reporte.calculosLibras?.enPiso },
    { label: 'Bandejas', value: reporte.calculosLibras?.enBandejas },
    { label: 'Proceso', value: reporte.calculosLibras?.enProcesoTerminado },
  ].map((item) => ({ ...item, value: Number(item.value || 0) }))
}

function getDateString(dateValue) {
  if (!dateValue) return ''
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

function getLatestReportDate(reportes) {
  const latest = reportes.reduce((current, reporte) => {
    const time = new Date(reporte.fecha).getTime()
    if (Number.isNaN(time)) return current
    return time > current.time ? { time, fecha: reporte.fecha } : current
  }, { time: 0, fecha: '' })

  return getDateString(latest.fecha)
}

export function DashboardPage({ session }) {
  const [reportes, setReportes] = useState([])
  const [status, setStatus] = useState('Loading dashboard...')
  const [filterDate, setFilterDate] = useState('')

  useEffect(() => {
    let active = true

    async function loadBalances() {
      try {
        const response = await fetch(`${API_BASE}/controles/balance`, {
          headers: session?.token ? { Authorization: `Bearer ${session.token}` } : {},
        })
        const payload = await response.json()

        if (!response.ok) throw new Error(payload.mensaje || 'Could not load the balance')

        if (active) {
          const data = payload.data || []
          setReportes(data)
          setFilterDate(getLatestReportDate(data))
          setStatus('')
        }
      } catch (error) {
        if (active) setStatus(error.message)
      }
    }

    loadBalances()

    return () => { active = false }
  }, [session?.token])

  const reporte = useMemo(() => {
    if (!reportes.length) return null
    if (!filterDate) return reportes[0]
    return reportes.find((r) => {
      const d = r.fecha
      if (!d) return false
      const dateStr = typeof d === 'string' ? d.slice(0, 10) : new Date(d).toISOString().slice(0, 10)
      return dateStr === filterDate
    }) || null
  }, [reportes, filterDate])

  const chartData = getChartData(reporte)
  const totalStock = reporte?.totalesSistema?.totalChocolateFisico || chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <section className="report-panel" aria-labelledby="dashboard-title">
      <div className="dashboard-filters">
        <label className="dashboard-date-filter">
          <CalendarDays size={17} />
          <input
            value={filterDate}
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            onChange={(event) => setFilterDate(event.target.value || getLatestReportDate(reportes))}
          />
        </label>
      </div>

      {status && <p className="form-status">{status}</p>}
      {!status && !reporte && <p className="form-status">No controls registered yet.</p>}

      {reporte && (
        <BarChart
          data={chartData}
          formatValue={(value) => `${formatNumber(value)} lb`}
          label="Bar chart of available stock by location"
          title="Daily Summary"
          xAxisLabel="Location"
          yAxisLabel="Available quantity (lb)"
          titleExtra={
            <span className="total-badge">
              <Package size={16} />
              Total: <strong>{formatNumber(totalStock)} lb</strong>
            </span>
          }
        />
      )}
    </section>
  )
}
