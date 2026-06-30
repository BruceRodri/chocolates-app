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
  @page { margin: 8mm 8mm; size: letter; }
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
  <div style="text-align: left; margin-bottom: 4px;">
    <img src="data:image/jpeg;base64,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ABjggCRThRAiAAARQACwAAAAAAAAAATAABAgQRhSgChwgywAQggSAgwRgQigAAAAAAAAAABBxhCDTDwggBBBxDCBCAABDgTCCjyAAAAAAAAAAAAAAAACQhxxzSzRAiShTCSyCwAChyQQAAAAAAAAAAAAAAAACBQRzDBCQiCDCTCQAACCBACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAgADAAAAEPPPPPPPPPPPPPPMOILBONPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPOEAOCMPJGPNPPPPPPPPPPPPPPPPPPPPPPPPPPPPPMFKPPPPPDFGNPPPPPPPPPPPPPPPPPPPPPOOGPPPOHJPPPPPPPPDGPPPPOOPPPPPPPPPPPPPPPKDLOPPOJPPPPPPPPPPLFPOGLLBPPPPPPPPPPPPPPAGPLPLKPPPPPPPPPPPPAOBOFDDHPPPPPPPPPPPPPLBJPIHHPPPPPPPPPPPPDLONOPJHPPPPPPPPPPPPPMEPLHBOPPPPPPPPPPPPPLBOGDJPPPPPPPPPPPPPLCLMNMPGPPPPPPPPPPPPFHHPLBFPPPPPPPPPPPPPKALOPDPHFPPPPPPPPPPKLLOPPPONPPPPPPPPPPPPPDIPHPPOMPPPPPPPPPPCPHPDFKNPPPPPPPPPPPPPPPPPPPPPCNMPPPPPPMAHNPPPHLHPPPPPPPPPPPPPPPPPPPPPPLJPMOMNCCODPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPDHLALPMLPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPHHPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPNGLENPPPPPPPPPPCFPPPPPABNPPPPPPPPPPPPPPKMBDEPONNONNNPMMPMPPPMILLDOPMPPPPPPPPPPPPLPPPOCOHKHFCINMMIMOPCFPPOIHMPPPPPPPPPPPKEPPPONPDLHPABHPHLKLHDHPPOJPLMPPPPPPPPPPLIEOCNENJPFPKPGONPENPOMMPOJNIJPPPPPPPPPPPDACFHDJBBHPMHPOCFOAPPLFFPGMBPPPPPPPPPPPPPPPPPIHANMPKNFNCHBKFBFKPNEPNNPPPPPPPPPPPPPPPPKPJCHHBPPHNNHKPIPEHNNCPFPP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" style="height:40px;">
  </div>
  <h1>DAILY CONTROL MOLDING 1 — Chocolate Balance</h1>

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
    <tr><td>Assembled displays</td><td class="num">${ins.assembledDisplays ?? '—'}</td></tr>
    <tr><td>Finished Product in Process</td><td class="num">${ins.productoTerminadoProceso ?? '—'}</td></tr>
  </table>

  <div class="section-title">Tanks &amp; Floor</div>
  <table>
    <tr><th>Concept</th><th class="num">Value</th></tr>
    <tr><td>% Morcos Tank</td><td class="num">${ins.porcentajeTanqueMorcos != null ? ins.porcentajeTanqueMorcos + '%' : '—'}</td></tr>
    <tr><td>Temper Unit (lb)</td><td class="num">${fmt(ins.temperUnitLibras)}</td></tr>
    <tr><td>% PTI Tank</td><td class="num">${ins.porcentajeTanquePti != null ? ins.porcentajeTanquePti + '%' : '—'}</td></tr>
    <tr><td>Hopper (lb)</td><td class="num">${fmt(ins.hopperLibras)}</td></tr>
    <tr><td>boxes on the floor chocolate</td><td class="num">${ins.porcentajeChocolatePiso ?? '—'}</td></tr>
    <tr><td>total amount of chocolate on the floor</td><td class="num">${fmt(ins.totalPesoPalet)}</td></tr>

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
    <tr><td>Floor</td><td class="num">${fmt(ins.totalPesoPalet)}</td></tr>
    <tr><td>Trays</td><td class="num">${fmt(calc.enBandejas)}</td></tr>
    <tr><td>Assembled displays</td><td class="num">${fmt(calc.enDisplays)}</td></tr>
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

