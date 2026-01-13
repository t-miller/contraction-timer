## Claude Instructions

**IMPORTANT**: Always use the `/planning-with-files` skill at the start of any task. This creates `task_plan.md`, `findings.md`, and `progress.md` files to track work systematically.

**IMPORTANT**: Always use `pnpm` as the package manager. Never use `npm` or `yarn` for installing dependencies.

---

# Contraction Timer App

A cross-platform contraction timing tool for iOS, Android, and Web built with React Native and Expo.

## Stack Overview

- **Framework**: React Native with Expo SDK 52
- **Language**: TypeScript
- **Platforms**: iOS, Android, Web
- **State Management**: React Context + useReducer
- **Storage**: @react-native-async-storage/async-storage
- **Build Tool**: Expo CLI

## Key Commands

```bash
# Development
npx expo start           # Start dev server
npx expo start --web     # Start web only
npx expo start --ios     # Start iOS simulator
npx expo start --android # Start Android emulator

# Building
npx expo build:ios       # Build iOS
npx expo build:android   # Build Android
npx expo export:web      # Export web build

# Testing
pnpm test                # Run tests (if configured)

# Dependencies
pnpm install             # Install dependencies
```

## Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── TimerButton.tsx  # Main start/stop timer button
│   ├── ContractionList.tsx # List of recorded contractions
│   ├── ContractionItem.tsx # Individual contraction row
│   ├── Statistics.tsx   # Summary statistics display
│   └── Disclaimer.tsx   # Medical disclaimer notice
├── context/
│   └── ContractionContext.tsx # App state management
├── types/
│   └── index.ts         # TypeScript type definitions
├── utils/
│   ├── storage.ts       # AsyncStorage helpers
│   └── formatting.ts    # Time formatting utilities
└── screens/
    └── HomeScreen.tsx   # Main app screen
```

## Code Style Guidelines

- Use functional components with hooks
- Prefer named exports
- Use TypeScript strict mode
- Format durations as MM:SS
- Keep components focused and single-purpose

## Critical Rules

1. **NO MEDICAL ADVICE**: This app must never provide medical recommendations or advice about when to go to the hospital. It is purely a timing tool.
2. **Privacy First**: All data is stored locally on device only. No network calls for user data.
3. **Accessibility**: Ensure large tap targets and good contrast for use during labor.
4. **Disclaimer Required**: The medical disclaimer must always be visible in the app.

## Data Model

```typescript
interface Contraction {
  id: string;
  startTime: number;    // Unix timestamp
  endTime: number | null; // null if ongoing
}
```

## State Actions

- `START_CONTRACTION` - Begin timing a new contraction
- `END_CONTRACTION` - Stop timing the current contraction
- `CLEAR_HISTORY` - Clear all recorded contractions
- `LOAD_CONTRACTIONS` - Load contractions from storage
