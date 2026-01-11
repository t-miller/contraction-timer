# Findings

## Overview
Research notes and discoveries for the contraction timer project.

## Codebase Structure

### Key Directories
- `src/components/` - Reusable UI components
- `src/context/` - State management (ContractionContext)
- `src/types/` - TypeScript definitions
- `src/utils/` - Helper functions (storage, formatting)
- `src/screens/` - App screens

### Core Data Model
```typescript
interface Contraction {
  id: string;
  startTime: number;    // Unix timestamp
  endTime: number | null; // null if ongoing
}
```

### State Actions
- `START_CONTRACTION` - Begin timing
- `END_CONTRACTION` - Stop timing
- `CLEAR_HISTORY` - Clear all data
- `LOAD_CONTRACTIONS` - Load from storage

## Technical Stack
- React Native + Expo SDK 52
- TypeScript (strict mode)
- AsyncStorage for persistence
- React Context + useReducer for state

## Research Notes
[Add discoveries here as you explore]

## API/Library Notes
[Document any API findings]

## Patterns Observed
[Note code patterns to follow]

## Questions to Resolve
- [ ] [Add questions as they arise]
