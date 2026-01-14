Write-Output "🚀 Smart Cafeteria System Project Init Script"

Write-Output "→ Installing dependencies..."
pnpm install

Write-Output "→ Checking current branch..."
git branch --show-current

if (-Not (Test-Path ".env")) {
    Write-Output "→ Creating .env file..."
    Copy-Item ".env.example" ".env"
} else {
    Write-Output "→ .env file already exists."
}

Write-Output "✅ Init complete! You can now run: pnpm dev" 