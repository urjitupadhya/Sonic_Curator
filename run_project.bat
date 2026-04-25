@echo off
echo Initializing Sonic Curator Project...
npm install && (
  echo Dependencies installed.
  echo Running database migrations...
  npx drizzle-kit push:pg
  echo Starting development server...
  npm run dev
) || (
  echo Error occurred during setup.
)
pause
