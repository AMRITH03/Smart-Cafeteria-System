echo "🚀 Smart Cafeteria System Project Init Script"

echo "→ Installing dependencies..."
pnpm install

echo "→ Checking current branch..."
git branch --show-current

if [ ! -f .env ]; then
  echo "→ Creating .env file..."
  cp .env.example .env
else
  echo "→ .env file already exists."
fi

echo "✅ Init complete! You can now run: pnpm dev"