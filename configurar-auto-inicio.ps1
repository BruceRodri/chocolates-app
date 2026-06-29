$taskName = "Chocolates App"
$scriptPath = "$PSScriptRoot\iniciar-servidor.bat"

Write-Host "Configurando inicio automatico del Sistema de Chocolates..."
Write-Host ""

# Crear tarea en Task Scheduler que se ejecuta al iniciar sesion
$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$scriptPath`""
$trigger = New-ScheduledTaskTrigger -AtStartup
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -RunLevel Highest

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force

Write-Host "Listo! La tarea '$taskName' se ejecutara automaticamente al encender la PC."
Write-Host ""
Write-Host "Para probar, reinicia la PC o ejecuta manualmente:"
Write-Host "  $scriptPath"
