function fmt(val, decimals = 2) {
  if (val === null || val === undefined) return '—'
  return Number(val).toFixed(decimals)
}

function labelFor(value, options) {
  if (!options) return value
  const opt = options.find((o) => o.value === value)
  return opt ? opt.label : value
}

export function openPrintWindow(data, resource) {
  const turnoLabel = labelFor(data.turno, resource.fields.find((f) => f.name === 'id_turno')?.options)
  const chocoLabel = data.tipoChocolate ? `${data.tipoChocolate.codigo} - ${data.tipoChocolate.categoria}` : '—'
  const prodLabel = data.producto ? `${data.producto.codigo} - ${data.producto.nombre}` : '—'
  const ins = data.insumos || {}
  const calc = data.calculosLibras || {}
  const tot = data.totalesSistema || {}
  const fecha = data.fecha ? new Date(data.fecha).toLocaleString('en-US') : '—'

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Daily Control Report</title>
<style>
  @page { margin: 15mm 10mm; size: letter; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #1a1a1a; line-height: 1.35; padding: 0; }
  .report { max-width: 210mm; margin: 0 auto; }
  h1 { font-size: 16px; text-align: center; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px; padding-bottom: 6px; border-bottom: 2px solid #222; }
  .meta { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px 16px; margin-bottom: 10px; font-size: 10px; }
  .meta span { white-space: nowrap; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
  th, td { border: 1px solid #444; padding: 4px 6px; text-align: left; vertical-align: top; }
  th { background: #e8e4df; font-weight: 700; font-size: 10px; text-transform: uppercase; }
  td { font-size: 10.5px; }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 10px 0 4px; padding-bottom: 2px; border-bottom: 1px solid #888; }
  .summary-table td:first-child { font-weight: 600; }
  .summary-table .label { width: 65%; }
  .summary-table .value { width: 35%; text-align: right; font-weight: 700; font-size: 12px; }
  .add-positive { background-color: #d4edda; }
  .remove-positive { background-color: #f8d7da; }
  .footer { text-align: center; margin-top: 12px; font-size: 9px; color: #666; border-top: 1px solid #aaa; padding-top: 6px; }
  .no-print { display: none; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>
<div class="report">
  <h1>Daily Control — Chocolate Balance</h1>

  <div class="meta">
    <span><strong>Date:</strong> ${fecha}</span>
    <span><strong>Shift:</strong> ${turnoLabel}</span>
    <span><strong>Operator:</strong> ${data.operario || '—'}</span>
    <span><strong>Chocolate:</strong> ${chocoLabel}</span>
    <span><strong>Running Item:</strong> ${prodLabel}</span>
  </div>

  <div class="section-title">Production</div>
  <table>
    <tr><th>Concept</th><th class="num">Value</th></tr>
    <tr><td>Molds Filled</td><td class="num">${ins.moldesLlenados ?? '—'}</td></tr>
    <tr><td>% Singles Piece on Belt</td><td class="num">${ins.porcentajeSinglesBanda != null ? ins.porcentajeSinglesBanda + '%' : '—'}</td></tr>
    <tr><td>Tray with Chocolate</td><td class="num">${ins.bandejasConChocolate ?? '—'}</td></tr>
    <tr><td>Finished Product in Process</td><td class="num">${ins.productoTerminadoProceso ?? '—'}</td></tr>
  </table>

  <div class="section-title">Tanks &amp; Floor</div>
  <table>
    <tr><th>Concept</th><th class="num">Value</th></tr>
    <tr><td>% Morcos Tank</td><td class="num">${ins.porcentajeTanqueMorcos != null ? ins.porcentajeTanqueMorcos + '%' : '—'}</td></tr>
    <tr><td>Temper Unit (lb)</td><td class="num">${fmt(ins.temperUnitLibras)}</td></tr>
    <tr><td>% PTI Tank</td><td class="num">${ins.porcentajeTanquePti != null ? ins.porcentajeTanquePti + '%' : '—'}</td></tr>
    <tr><td>Hopper (lb)</td><td class="num">${fmt(ins.hopperLibras)}</td></tr>
    <tr><td>% Chocolate on the Floor</td><td class="num">${ins.porcentajeChocolatePiso != null ? ins.porcentajeChocolatePiso + '%' : '—'}</td></tr>

  </table>

  <div class="section-title">System</div>
  <table>
    <tr><th>Concept</th><th class="num">Total (lb)</th></tr>
    <tr><td>Total Chocolate System</td><td class="num">${fmt(tot.totalChocolateTeoricoSistema)}</td></tr>
  </table>

  <div class="section-title">Locations — Calculated Pounds</div>
  <table>
    <tr><th>Location</th><th class="num">Pounds</th></tr>
    <tr><td>Molds</td><td class="num">${fmt(calc.enMoldes)}</td></tr>
    <tr><td>Belt</td><td class="num">${fmt(calc.enBanda)}</td></tr>
    <tr><td>Morcos Tank</td><td class="num">${fmt(calc.enTanqueMorcos)}</td></tr>
    <tr><td>Temper Unit</td><td class="num">${fmt(calc.enTemperUnit)}</td></tr>
    <tr><td>PTI Tank</td><td class="num">${fmt(calc.enTanquePti)}</td></tr>
    <tr><td>Hopper</td><td class="num">${fmt(calc.enHopper)}</td></tr>
    <tr><td>Floor</td><td class="num">${fmt(calc.enPiso)}</td></tr>
    <tr><td>Trays</td><td class="num">${fmt(calc.enBandejas)}</td></tr>
    <tr><td>FG Process</td><td class="num">${fmt(calc.enProcesoTerminado)}</td></tr>
  </table>

  <div class="section-title">Summary</div>
  <table class="summary-table">
    <tr><td class="label">Total Physical Chocolate</td><td class="value">${fmt(tot.totalChocolateFisico)} lb</td></tr>
    <tr><td class="label">Total Chocolate in the System</td><td class="value">${fmt(tot.totalChocolateTeoricoSistema)} lb</td></tr>
    <tr class="${tot.ajusteAdicionRetiro > 0 ? 'add-positive' : ''}"><td class="label">Amount to Add to the System</td><td class="value">${fmt(tot.ajusteAdicionRetiro)} lb</td></tr>
    <tr class="${tot.ajusteRetiro > 0 ? 'remove-positive' : ''}"><td class="label">Amount to Remove from the System</td><td class="value">${tot.ajusteRetiro > 0 ? '-' : ''}${fmt(tot.ajusteRetiro)} lb</td></tr>
  </table>

  <div class="footer">Report generated on ${new Date().toLocaleString('en-US')} — Chocolate Daily Control System</div>
</div>
<script>window.print()</script>
</body>
</html>`

  const win = window.open('', '_blank', 'width=850,height=700,scrollbars=yes')
  if (win) {
    win.document.write(html)
    win.document.close()
  }
}
