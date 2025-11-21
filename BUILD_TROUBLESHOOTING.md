# Build Troubleshooting

## The Problem

You were seeing repetitive commands like:
```powershell
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue; Start-Sleep -Seconds 2; npm run build
```

This happened because:
1. **Windows file locking** - `.next` directory gets locked by Next.js or other processes
2. **OneDrive sync issues** - Your project is in OneDrive which can cause file locking
3. **Build cache corruption** - Sometimes `.next` gets into a bad state
4. **Concurrent processes** - Dev server, build, or IDE holding files

## The Solution

### ✅ Use `npm run clean`

I've added a cross-platform clean script:

```bash
npm run clean          # Cross-platform (uses Node.js)
npm run clean:win      # Windows-specific (rmdir)
npm run clean:unix     # Unix-specific (rm -rf)
npm run build:clean    # Clean + build in one command
```

### How It Works

**`scripts/clean.js`**:
- Detects platform (Windows/Unix)
- Uses PowerShell on Windows for better file handling
- Falls back to `rmdir` if PowerShell fails
- Handles locked files gracefully
- Also cleans `.turbo` and other cache dirs

### Better Workflow

Instead of manually cleaning:
```bash
# ❌ Old way
Remove-Item -Path ".next" -Recurse -Force
npm run build

# ✅ New way
npm run clean
npm run build

# Or even better
npm run build:clean
```

### Deploy Scripts Updated

Both `deploy.ps1` and `deploy.sh` now:
1. Run `npm run clean` first
2. Handle clean failures gracefully
3. Then build

### When to Clean

Clean when you see:
- `EINVAL: invalid argument, readlink`
- `EBUSY: resource busy or locked`
- Build cache issues
- Type errors that don't make sense
- After major dependency changes

### Prevention Tips

1. **Stop dev server** before building
2. **Close IDE** if files are locked
3. **Exclude from OneDrive** sync (add to `.gitignore` and OneDrive exclusions)
4. **Use `npm run build:clean`** for production builds
5. **Let deploy scripts handle it** - they auto-clean now

### OneDrive Specific

Since your project is in `OneDrive\Desktop\MartAI`:
- OneDrive can lock files during sync
- Consider excluding `.next` from OneDrive sync
- Or move project outside OneDrive for development
- The clean script handles this better than manual deletion

## Quick Reference

```bash
npm run clean          # Clean build artifacts
npm run build          # Build normally
npm run build:clean    # Clean then build
npm run deploy         # Clean, build, commit, push (auto-cleans)
```

