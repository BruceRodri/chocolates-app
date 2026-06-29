import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Edit3,
  Factory,
  Gauge,
  Info,
  MapPin,
  PackageCheck,
  Plus,
  Printer,
  RefreshCw,
  Save,
  Search,
  Scale,
  Settings2,
  Trash2,
  X,
} from 'lucide-react'
import { API_BASE } from '../../constants/config'
import { useToast } from '../../components/Toast'
import { openPrintWindow } from '../../utils/printReport'
import { getSavedReports, saveReport, deleteReport } from '../../utils/reportStorage'
import './CrudPage.css'

const PAGE_SIZE = 4
const SKELETON_ROWS = Array.from({ length: PAGE_SIZE }, (_, index) => index)
const DATE_FILTER_RESOURCES = ['controles', 'productos', 'tipos', 'tanques']

function getHeaders(session) {
  return {
    'Content-Type': 'application/json',
    ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
  }
}

function groupFields(fields) {
  return fields.reduce((groups, field) => {
    const section = field.section || 'General'
    const current = groups.find((group) => group.title === section)

    if (current) {
      current.fields.push(field)
      return groups
    }

    return [...groups, { title: section, fields: [field] }]
  }, [])
}

function getSectionIcon(title) {
  const icons = {
    General: Info,
    Production: Factory,
    'Tanks & Floor': Gauge,
    System: Settings2,
    Weight: Scale,
    Packaging: PackageCheck,
    Machinery: Boxes,
    Locations: MapPin,
  }

  return icons[title] || ClipboardList
}

function getResourceDateField(resource) {
  return resource.id === 'controles' ? 'fecha' : 'fechaActualizacion'
}

function getResourceDate(resource, item) {
  const fieldName = getResourceDateField(resource)
  const date = new Date(item[fieldName])
  return Number.isNaN(date.getTime()) ? 0 : date.getTime()
}

function getResourceDateString(resource, item) {
  const fieldName = getResourceDateField(resource)
  const value = item[fieldName]
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

function getLatestResourceDate(resource, items) {
  const latest = items.reduce((current, item) => {
    const time = getResourceDate(resource, item)
    return time > current.time ? { time, item } : current
  }, { time: 0, item: null })

  return latest.item ? getResourceDateString(resource, latest.item) : ''
}

export function CrudPage({ resource, session }) {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [mode, setMode] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [formValues, setFormValues] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [formStep, setFormStep] = useState(0)
  const [fieldOptions, setFieldOptions] = useState({})
  const [activeFilter, setActiveFilter] = useState(0)
  const [fieldErrors, setFieldErrors] = useState({})
  const [filterDate, setFilterDate] = useState('')
  const [, setNowTick] = useState(0)
  const [printPrompt, setPrintPrompt] = useState(null)
  const [showReports, setShowReports] = useState(false)
  const [savedReports, setSavedReports] = useState([])
  const [deleteTarget, setDeleteTarget] = useState(null)
  const showToast = useToast()

  const selectedId = selectedItem ? resource.getId(selectedItem) : null
  const formTitle = mode === 'create' ? `New ${resource.title}` : `Edit ${selectedId}`
  const normalizedSearch = searchTerm.trim().toLowerCase()
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const idA = resource.getId(a)
      const idB = resource.getId(b)
      if (DATE_FILTER_RESOURCES.includes(resource.id)) {
        const dateDiff = getResourceDate(resource, b) - getResourceDate(resource, a)
        if (dateDiff !== 0) return dateDiff
      }
      const numA = Number(idA)
      const numB = Number(idB)
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB
      return String(idA).localeCompare(String(idB), undefined, { numeric: true })
    })
  }, [items, resource])
  const filteredItems = useMemo(() => {
    let result = sortedItems

    if (DATE_FILTER_RESOURCES.includes(resource.id) && filterDate) {
      const fieldName = getResourceDateField(resource)
      result = result.filter((item) => {
        const d = item[fieldName]
        if (!d) return false
        const dateStr = typeof d === 'string' ? d.slice(0, 10) : new Date(d).toISOString().slice(0, 10)
        return dateStr === filterDate
      })
    }

    if (normalizedSearch) {
      result = result.filter((item) => {
        const values = [
          resource.getTitle(item),
          resource.getSubtitle(item),
          resource.getId(item),
        ]
        return values.some((value) => String(value || '').toLowerCase().includes(normalizedSearch))
      })
    }

    return result
  }, [sortedItems, normalizedSearch, resource, filterDate])
  const pageCount = Math.max(Math.ceil(filteredItems.length / PAGE_SIZE), 1)
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredItems.slice(start, start + PAGE_SIZE)
  }, [filteredItems, page])

  const [totalRecords, setTotalRecords] = useState(0)

  async function loadItems() {
    setIsLoading(true)
    setStatus('')
    try {
      const params = resource.id === 'controles' ? `?page=${page}&limit=20` : ''
      const response = await fetch(`${API_BASE}${resource.listEndpoint || resource.endpoint}${params}`, {
        headers: session?.token ? { Authorization: `Bearer ${session.token}` } : {},
      })
      const payload = await response.json()

      if (!response.ok) throw new Error(payload.mensaje || 'Could not load the information')

      const data = payload.data || []
      setItems(data)
      setTotalRecords(payload.total ?? data.length)
      setEditVals({})
      editValsRef.current = {}
      setStatus('')
    } catch (error) {
      setStatus(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
    setMode('')
    setSelectedItem(null)
    setSearchTerm('')
    setPage(1)
    setFormStep(0)
    setActiveFilter(0)
    setFieldErrors({})
    setFilterDate('')
    setTotalRecords(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource])

  useEffect(() => {
    if (resource.id === 'controles' && page > 1) {
      loadItems()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowTick((value) => value + 1)
    }, 60000)

    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const optionFields = resource.fields.filter((field) => field.optionsEndpoint)

    if (!optionFields.length) {
      setFieldOptions({})
      return
    }

    let ignore = false

    async function loadFieldOptions() {
      const entries = await Promise.all(optionFields.map(async (field) => {
        try {
          const response = await fetch(`${API_BASE}${field.optionsEndpoint}`, {
            headers: session?.token ? { Authorization: `Bearer ${session.token}` } : {},
          })
          const payload = await response.json()

          if (!response.ok) throw new Error(payload.mensaje || 'Could not load options')

          const options = (payload.data || []).map((item) => ({
            value: field.getOptionValue(item),
            label: field.getOptionLabel(item),
          }))

          return [field.name, options]
        } catch (error) {
          setStatus(error.message)
          return [field.name, []]
        }
      }))

      if (!ignore) {
        const optionsMap = Object.fromEntries(entries)
        setFieldOptions(optionsMap)
        setFormValues((current) => {
          const next = { ...current }
          optionFields.forEach((field) => {
            const opts = optionsMap[field.name]
            if (opts && opts.length && !next[field.name]) {
              next[field.name] = opts[0].value
            }
          })
          return next
        })
      }
    }

    loadFieldOptions()

    return () => {
      ignore = true
    }
  }, [resource, session?.token])

  useEffect(() => {
    setPage(1)
  }, [searchTerm])

  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])

  function startCreate() {
    setSelectedItem(null)
    setFormValues(resource.createTemplate)
    setFormStep(0)
    setFieldErrors({})
    setMode('create')
  }

  function startEdit(item) {
    setSelectedItem(item)
    setFormValues(resource.toEditPayload(item))
    setFormStep(0)
    setFieldErrors({})
    setMode('edit')
  }

  function updateField(field, value) {
    setFormValues((current) => {
      const next = {
        ...current,
        [field.name]: value,
      }
      if (resource.id === 'productos' && (field.name === 'unidades_por_molde' || field.name === 'moldes_en_banda')) {
        const u = Number(field.name === 'unidades_por_molde' ? value : current.unidades_por_molde)
        const m = Number(field.name === 'moldes_en_banda' ? value : current.moldes_en_banda)
        next.piezas_singles_en_banda = (isNaN(u) ? 0 : u) * (isNaN(m) ? 0 : m)
      }
      if (resource.id === 'controles' && field.name === 'porcentaje_chocolate_piso') {
        const boxes = Number(value)
        next.total_peso_palet = isNaN(boxes) ? 0 : boxes * 50
      }
      return next
    })
    setFieldErrors((current) => {
      if (!current[field.name]) return current
      const next = { ...current }
      delete next[field.name]
      return next
    })
  }

  function getVisibleFields() {
    return resource.fields.filter((field) => mode === 'create' || !field.createOnly)
  }

  function getOptions(field) {
    return fieldOptions[field.name] || field.options || []
  }

  function validateFields(fields) {
    const errors = {}
    fields.forEach((field) => {
      const value = formValues[field.name]
      const isEmpty = value === '' || value === null || value === undefined
      if (isEmpty) {
        errors[field.name] = `${field.label} is required`
      }
    })
    return errors
  }

  function handleNextStep() {
    const fields = fieldGroups[formStep].fields
    const errors = validateFields(fields)
    setFieldErrors(errors)
    if (Object.keys(errors).length) return
    setFormStep((s) => s + 1)
  }

  const fieldGroups = groupFields(getVisibleFields())
  const useWizard = ['controles', 'productos'].includes(resource.id)
  const activeGroups = useWizard ? [fieldGroups[formStep]].filter(Boolean) : fieldGroups
  const isFirstStep = formStep === 0
  const isLastStep = formStep >= fieldGroups.length - 1

  async function doSave() {
    const allFields = getVisibleFields()
    const errors = validateFields(allFields)
    setFieldErrors(errors)
    if (Object.keys(errors).length) return

    let payload = { ...formValues }
    allFields.forEach((field) => {
      if (field.type === 'number' && typeof payload[field.name] === 'string') {
        payload[field.name] = Number(payload[field.name].replace(',', '.'))
      }
    })

    const url = mode === 'create'
      ? `${API_BASE}${resource.endpoint}`
      : `${API_BASE}${resource.endpoint}/${encodeURIComponent(selectedId)}`

    try {
      const response = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: getHeaders(session),
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (!response.ok) throw new Error(result.error ? `${result.mensaje}: ${result.error}` : (result.mensaje || 'Could not save'))

      setMode('')
      setSelectedItem(null)
      await loadItems()
      showToast(mode === 'create' ? 'Record created successfully' : 'Record updated successfully', 'success')

      if (resource.id === 'controles' && result.data) {
        setPrintPrompt(result.data)
      }
    } catch (error) {
      setStatus(error.message)
    }
  }

  async function submitForm(event) {
    event.preventDefault()
    if (useWizard && !isLastStep) return
    await doSave()
  }

  function handlePrintNow() {
    if (printPrompt) {
      saveReport(printPrompt)
      openPrintWindow(printPrompt, resource)
      setPrintPrompt(null)
    }
  }

  function handlePrintLater() {
    if (printPrompt) {
      saveReport(printPrompt)
      setPrintPrompt(null)
    }
  }

  function openSavedReports() {
    setSavedReports(getSavedReports())
    setShowReports(true)
  }

  function confirmDelete(item) {
    setDeleteTarget(item)
  }

  async function deleteItem() {
    if (!deleteTarget) return
    const id = resource.getId(deleteTarget)
    setDeleteTarget(null)

    try {
      const response = await fetch(`${API_BASE}${resource.endpoint}/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getHeaders(session),
      })
      const payload = await response.json()

      if (!response.ok) throw new Error(payload.mensaje || 'Could not delete')

      await loadItems()
      showToast('Record deleted successfully', 'success')
    } catch (error) {
      setStatus(error.message)
    }
  }

  const [editVals, setEditVals] = useState({})
  const editValsRef = useRef({})

  function getDisplayVal(item, field) {
    const id = resource.getId(item)
    const edits = editVals[id]
    if (edits && field.inlineEdit && edits[field.inlineEdit] !== undefined) {
      return edits[field.inlineEdit]
    }
    return undefined
  }

  function computeSinglesPiezas(item) {
    const id = resource.getId(item)
    const edits = editVals[id] || {}
    const u = edits.unidades_por_molde ?? item.maquinaria?.unidadesPorMolde ?? 0
    const m = edits.moldes_en_banda ?? item.maquinaria?.moldesEnBanda ?? 0
    return u * m
  }

  function onEditChange(item, fieldName, rawValue) {
    const id = resource.getId(item)
    const num = rawValue === '' ? 0 : parseFloat(rawValue) || 0
    setEditVals((prev) => {
      const next = { ...prev }
      const cur = { ...(next[id] || {}) }
      cur[fieldName] = num
      next[id] = cur
      editValsRef.current = next
      return next
    })
  }

  function onEditBlur(item) {
    const id = resource.getId(item)
    const edits = editValsRef.current[id]
    if (!edits) return

    const itemUnidades = item.maquinaria?.unidadesPorMolde ?? 0
    const itemMoldes = item.maquinaria?.moldesEnBanda ?? 0
    const u = edits.unidades_por_molde ?? itemUnidades
    const m = edits.moldes_en_banda ?? itemMoldes

    const payload = {
      ...resource.toEditPayload(item),
      ...edits,
      piezas_singles_en_banda: u * m,
    }

    fetch(`${API_BASE}${resource.endpoint}/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getHeaders(session),
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((result) => {
        if (!result.ok) throw new Error(result.mensaje || 'Error saving')
        return loadItems()
      })
      .catch((error) => setStatus(error.message))
  }

  function renderCell(field, item, index) {
    if (field.inlineEdit) {
      const d = getDisplayVal(item, field)
      const v = d !== undefined ? d : field.getValue(item, index)
      return (
        <input
          type="number"
          step="any"
          className="inline-edit-input"
          value={v ?? ''}
          onChange={(e) => onEditChange(item, field.inlineEdit, e.target.value)}
          onBlur={() => onEditBlur(item)}
          onClick={(e) => e.stopPropagation()}
        />
      )
    }
    if (field.calculated) {
      return computeSinglesPiezas(item)
    }
    return field.getValue(item, index)
  }

  const printModal = printPrompt ? (
    <div className="modal-backdrop" role="presentation">
      <div className="crud-modal print-prompt-modal" role="dialog" aria-modal="true">
        <div className="crud-form-title">
          <div>
            <p className="eyebrow">{resource.eyebrow}</p>
            <strong>Report saved successfully</strong>
          </div>
        </div>
        <p style={{ margin: '12px 0', lineHeight: 1.5 }}>
          Do you want to print the daily control report?
        </p>
        <div className="modal-actions">
          <button type="button" onClick={handlePrintLater}>
            No, just save
          </button>
          <button className="form-button" type="button" onClick={handlePrintNow}>
            <Printer size={16} aria-hidden="true" />
            Yes, print now
          </button>
        </div>
      </div>
    </div>
  ) : null

  const reportsModal = showReports ? (
    <div className="modal-backdrop" role="presentation">
      <div className="crud-modal saved-reports-modal" role="dialog" aria-modal="true">
        <div className="crud-form-title">
          <div>
            <p className="eyebrow">Reportes</p>
            <strong>Saved Reports ({savedReports.length})</strong>
          </div>
        </div>
        <div className="crud-form-sections">
          {savedReports.length === 0 ? (
            <p style={{ color: '#8a7a6a', padding: '20px 0', textAlign: 'center' }}>No saved reports</p>
          ) : (
            <div style={{ display: 'grid', gap: 8 }}>
              {savedReports.map((report) => {
                const d = report.data
                const fecha = d.fecha ? new Date(d.fecha).toLocaleString('en-US') : '—'
                const choco = d.tipoChocolate ? d.tipoChocolate.categoria : '—'
                const prod = d.producto ? d.producto.nombre : '—'
                return (
                  <div key={report.id} className="crud-row" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ fontSize: '0.85rem' }}>Control — {fecha}</strong>
                      <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#8a7a6a' }}>
                        {choco} &middot; {prod}
                      </p>
                    </div>
                    <button type="button" onClick={() => openPrintWindow(d, resource)} title="Print">
                      <Printer size={15} />
                    </button>
                    <button type="button" onClick={() => { deleteReport(report.id); setSavedReports(getSavedReports()) }} title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className="modal-actions">
          <button type="button" onClick={() => setShowReports(false)}>
            <X size={16} aria-hidden="true" />
            Close
          </button>
        </div>
      </div>
    </div>
  ) : null

  const modal = mode ? (
    <div className="modal-backdrop" role="presentation">
      <form className="crud-modal" onSubmit={submitForm} onKeyDown={(e) => e.key === 'Enter' && e.target.tagName === 'INPUT' && e.preventDefault()} role="dialog" aria-modal="true" aria-labelledby="crud-modal-title">
        <div className="crud-form-title">
          <div>
            <p className="eyebrow">{resource.eyebrow}</p>
            <strong id="crud-modal-title">{formTitle}</strong>
            {useWizard && <span>Step {formStep + 1} of {fieldGroups.length}</span>}
          </div>
        </div>

        {useWizard && (
          <div className="wizard-steps" aria-label="Form sections">
            {fieldGroups.map((group, index) => {
              const StepIcon = getSectionIcon(group.title)

              return (
                <button type="button" className={index === formStep ? 'active' : ''} key={group.title} onClick={() => setFormStep(index)}>
                  <StepIcon size={15} aria-hidden="true" />
                  {group.title}
                </button>
              )
            })}
          </div>
        )}

        {status && <p className="form-status modal-status">{status}</p>}

        <div className="crud-form-sections">
          {activeGroups.map((group) => {
            const SectionIcon = getSectionIcon(group.title)

            return (
              <fieldset className="crud-fieldset" key={group.title}>
                <legend>
                  <span className="section-icon">
                    <SectionIcon size={16} aria-hidden="true" />
                  </span>
                  {group.title}
                </legend>
                <div className="crud-form-grid">
                  {group.fields.map((field) => (
                    <label className={`${field.type === 'textarea' ? 'wide ' : ''}${fieldErrors[field.name] ? 'has-error' : ''}`} key={field.name}>
                      {field.label}
                      {field.type === 'textarea' ? (
                        <textarea
                          value={formValues[field.name] ?? ''}
                          onChange={(event) => updateField(field, event.target.value)}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          value={formValues[field.name] ?? ''}
                          onChange={(event) => updateField(field, event.target.value)}
                        >
                          {!getOptions(field).length && <option value="">Loading options...</option>}
                          {getOptions(field).map((option) => (
                            <option value={option.value} key={option.value}>{option.label}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          value={formValues[field.name] ?? ''}
                          type={field.type || 'text'}
                          step={field.step}
                          readOnly={field.readOnly}
                          onChange={(event) => updateField(field, event.target.value)}
                          onFocus={(event) => {
                            const val = formValues[field.name]
                            if (val === '0' || val === 0) updateField(field, '')
                          }}
                        />
                      )}
                      {fieldErrors[field.name] && <span className="field-error">{fieldErrors[field.name]}</span>}
                    </label>
                  ))}
                </div>
              </fieldset>
            )
          })}
        </div>

        <div className="modal-actions">
          <button type="button" onClick={() => setMode('')}>
            <X size={16} aria-hidden="true" />
            Cancel
          </button>
          {useWizard && !isFirstStep && (
            <button type="button" onClick={() => setFormStep(formStep - 1)}>
              <ChevronLeft size={16} aria-hidden="true" />
              Previous
            </button>
          )}
          {useWizard && !isLastStep ? (
            <button className="form-button" type="button" onClick={handleNextStep}>
              Next
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          ) : (
            <button className="form-button" type="button" onClick={doSave}>
              <Save size={17} aria-hidden="true" />
              Save
            </button>
          )}
        </div>
      </form>
    </div>
  ) : null

  return (
    <>
      <section className="crud-panel" aria-busy={isLoading} aria-labelledby={`${resource.title}-title`}>
        <div className="crud-header">
          <div>
            <p className="eyebrow">{resource.eyebrow}</p>
            <h1 id={`${resource.title}-title`}>{resource.title}</h1>
            <p>{filteredItems.length} of {totalRecords} records</p>
          </div>
          <div className="crud-actions">
            {resource.id === 'controles' && (
              <>
                <button type="button" onClick={openSavedReports}>
                  <Printer size={16} aria-hidden="true" />
                  Reports
                </button>
              </>
            )}
            <button type="button" onClick={loadItems}>
              <RefreshCw size={16} aria-hidden="true" />
              Refresh
            </button>
            {!resource.readOnly && (
              <button className="primary" type="button" onClick={startCreate}>
                <Plus size={16} aria-hidden="true" />
                New
              </button>
            )}
          </div>
        </div>

        {status && <p className="form-status">{status}</p>}

        <div className="crud-filters">
          <label className="crud-search">
            <Search size={17} aria-hidden="true" />
            <input
              value={searchTerm}
              type="search"
              placeholder="Search by code, name or description"
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          {['controles', 'productos', 'tipos', 'tanques'].includes(resource.id) && (
            <label className="crud-date-filter">
              <input
                value={filterDate}
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                onChange={(event) => {
                  setFilterDate(event.target.value)
                  setPage(1)
                }}
              />
            </label>
          )}
        </div>

        <div className="crud-list">
          {isLoading ? SKELETON_ROWS.map((row) => (
            <article className="crud-row skeleton-row" aria-hidden="true" key={row}>
              <span className="skeleton-avatar" />
              <div className="skeleton-copy">
                <span className="skeleton-line wide" />
                <span className="skeleton-line" />
              </div>
              <div className="skeleton-actions">
                <span className="skeleton-pill" />
                <span className="skeleton-pill" />
              </div>
            </article>
          )) : resource.listColumnFilters ? (
            <div className="crud-table-wrapper">
              <div className="column-filters">
                {resource.listColumnFilters.map((filter, index) => (
                  <button
                    key={filter.label}
                    type="button"
                    className={activeFilter === index ? 'active' : ''}
                    onClick={() => setActiveFilter(index)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <table className="crud-table">
                <thead>
                  <tr>
                    {resource.stickyFilterColumns
                      ? resource.listColumnFilters[0].columns.slice(0, resource.stickyFilterColumns).map((field) => (
                        <th key={field.label}>{field.label}</th>
                      ))
                      : null}
                    {resource.listColumnFilters[activeFilter].columns.slice(resource.stickyFilterColumns && activeFilter === 0 ? resource.stickyFilterColumns : 0).map((field) => (
                      <th key={field.label}>{field.label}</th>
                    ))}
                    {!resource.readOnly && <th className="actions-cell">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((item, index) => {
                    const absoluteIndex = (page - 1) * PAGE_SIZE + index
                    return (
                      <tr key={resource.getId(item)}>
                        {resource.stickyFilterColumns
                          ? resource.listColumnFilters[0].columns.slice(0, resource.stickyFilterColumns).map((field) => (
                            <td key={field.label}>{renderCell(field, item, absoluteIndex)}</td>
                          ))
                          : null}
                        {resource.listColumnFilters[activeFilter].columns.slice(resource.stickyFilterColumns && activeFilter === 0 ? resource.stickyFilterColumns : 0).map((field) => (
                          <td key={field.label}>{renderCell(field, item, absoluteIndex)}</td>
                        ))}
                        <td className="actions-cell">
                          {!resource.readOnly && (
                            <>
                              <button type="button" onClick={() => startEdit(item)}>
                                <Edit3 size={15} aria-hidden="true" />
                                Edit
                              </button>
                              <button type="button" onClick={() => confirmDelete(item)}>
                                <Trash2 size={15} aria-hidden="true" />
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : resource.listFields ? (
            <div className="crud-table-wrapper">
              <table className="crud-table">
                <thead>
                  <tr>
                    {resource.listFields.map((field) => (
                      <th key={field.label}>{field.label}</th>
                    ))}
                    {!resource.readOnly && <th className="actions-cell">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((item, index) => {
                    const absoluteIndex = (page - 1) * PAGE_SIZE + index
                    return (
                      <tr key={resource.getId(item)}>
                        {resource.listFields.map((field) => (
                          <td key={field.label}>{renderCell(field, item, absoluteIndex)}</td>
                        ))}
                        <td className="actions-cell">
                          {!resource.readOnly && (
                            <>
                              <button type="button" onClick={() => startEdit(item)}>
                                <Edit3 size={15} aria-hidden="true" />
                                Edit
                              </button>
                              <button type="button" onClick={() => confirmDelete(item)}>
                                <Trash2 size={15} aria-hidden="true" />
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : paginatedItems.map((item) => (
            <article className="crud-row" key={resource.getId(item)}>
              <div>
                <strong>{resource.getTitle(item)}</strong>
                <p>{resource.getSubtitle(item)}</p>
              </div>
              <div className="row-actions">
                <button type="button" onClick={() => startEdit(item)}>
                  <Edit3 size={15} aria-hidden="true" />
                  Edit
                </button>
                <button type="button" onClick={() => confirmDelete(item)}>
                  <Trash2 size={15} aria-hidden="true" />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>

        {!isLoading && (
          <div className="pagination">
            <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft size={16} aria-hidden="true" />
              Previous
            </button>
            <span>Page {page} of {pageCount}</span>
            <button type="button" disabled={page >= pageCount} onClick={() => setPage(page + 1)}>
              Next
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        )}
      </section>
      {modal && createPortal(modal, document.body)}
      {printModal && createPortal(printModal, document.body)}
      {reportsModal && createPortal(reportsModal, document.body)}
      {deleteTarget && createPortal(
        <div className="modal-backdrop" role="presentation">
          <div className="crud-modal confirm-modal" role="dialog" aria-modal="true">
            <div className="crud-form-title">
              <div>
                <p className="eyebrow">{resource.eyebrow}</p>
                <strong>Delete {resource.getTitle(deleteTarget)}</strong>
              </div>
            </div>
            <p style={{ margin: '12px 0', lineHeight: 1.5 }}>
              Are you sure you want to delete this record? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button type="button" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="form-button" type="button" onClick={deleteItem} style={{ background: '#b13a3a' }}>
                <Trash2 size={16} aria-hidden="true" />
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
