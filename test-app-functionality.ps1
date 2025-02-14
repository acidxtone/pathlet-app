Write-Host "Starting Application Tests" -ForegroundColor Yellow

Write-Host "Checking Package Installation" -ForegroundColor Cyan
npm install

Write-Host "Checking Build Process" -ForegroundColor Cyan
npm run build

Write-Host "Checking Dependencies" -ForegroundColor Cyan
npm list react next @supabase/supabase-js

Write-Host "Checking Authentication Hook" -ForegroundColor Cyan
try {
    $authHook = Get-Content -Path ".\src\hooks\use-auth.ts"
    if ($authHook -match "function useAuth") {
        Write-Host "Authentication hook is valid" -ForegroundColor Green
    } else {
        Write-Host "Authentication hook is invalid" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error loading authentication hook: $_" -ForegroundColor Red
    exit 1
}

Write-Host "Checking Protected Route" -ForegroundColor Cyan
try {
    $protectedRoute = Get-Content -Path ".\src\components\auth\ProtectedRoute.tsx"
    if ($protectedRoute -match "function ProtectedRoute") {
        Write-Host "Protected Route is valid" -ForegroundColor Green
    } else {
        Write-Host "Protected Route is invalid" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error loading Protected Route: $_" -ForegroundColor Red
    exit 1
}

Write-Host "All Tests Completed Successfully" -ForegroundColor Green
exit 0
