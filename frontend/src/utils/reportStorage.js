const STORAGE_KEY = 'chocolates_reportes'

export function getSavedReports() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveReport(data) {
  const reports = getSavedReports()
  const report = {
    id: Date.now(),
    fecha: new Date().toISOString(),
    data,
  }
  reports.unshift(report)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
  return report
}

export function deleteReport(id) {
  const reports = getSavedReports().filter((r) => r.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
}

export function getReport(id) {
  return getSavedReports().find((r) => r.id === id) || null
}
