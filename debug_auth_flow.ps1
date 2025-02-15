# PowerShell script to help debug Pathlet authentication flow

# Function to check npm dependencies
function Check-NPMDependencies {
    Write-Host "Checking NPM dependencies..." -ForegroundColor Cyan
    npm list @tanstack/react-query @hookform/resolvers zod wouter
}

# Function to verify Supabase configuration
function Check-SupabaseConfig {
    Write-Host "Checking Supabase configuration..." -ForegroundColor Cyan
    Get-Content .env.local | Where-Object { $_ -match "VITE_SUPABASE_" }
}

# Function to run development server with verbose logging
function Start-DevServer {
    Write-Host "Starting development server with verbose logging..." -ForegroundColor Cyan
    $env:DEBUG = "*" 
    npm run dev
}

# Function to run authentication tests
function Test-AuthFlow {
    Write-Host "Running authentication flow tests..." -ForegroundColor Cyan
    # Add your test commands here
}

# Main menu
function Show-Menu {
    Clear-Host
    Write-Host "Pathlet Authentication Flow Debugging" -ForegroundColor Green
    Write-Host "1: Check NPM Dependencies"
    Write-Host "2: Verify Supabase Configuration"
    Write-Host "3: Start Dev Server"
    Write-Host "4: Run Auth Flow Tests"
    Write-Host "5: Exit"

    $selection = Read-Host "Select an option"
    switch ($selection) {
        '1' { Check-NPMDependencies; Pause }
        '2' { Check-SupabaseConfig; Pause }
        '3' { Start-DevServer }
        '4' { Test-AuthFlow; Pause }
        '5' { return }
    }
}

# Run the menu
Show-Menu
