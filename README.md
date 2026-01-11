# Contraction Timer

A simple, privacy-focused contraction timing app for expectant parents. Built with React Native and Expo for iOS, Android, and Web.

## Features

- **One-tap timing** - Start and stop contractions with a single tap
- **Contraction history** - View all recorded contractions with duration and time between
- **Statistics** - See average duration and frequency at a glance
- **Save sessions** - Save contraction sets for later reference
- **Dark mode** - Automatic theme support based on system preferences
- **Privacy-first** - All data stays on your device, no accounts or cloud sync
- **Cross-platform** - Works on iOS, Android, and web browsers

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/) package manager
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/contraction-timer.git
   cd contraction-timer
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dlx expo start
   ```

4. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan the QR code with Expo Go on your device

## Usage

1. **Start timing** - Tap the large button when a contraction begins
2. **Stop timing** - Tap again when the contraction ends
3. **View history** - See all recorded contractions in the list below
4. **Check statistics** - Average duration and frequency appear automatically
5. **Save session** - Save your contraction set for later reference
6. **Clear history** - Start fresh when needed

## Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) SDK 54
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: React Context + useReducer
- **Storage**: AsyncStorage (local device storage)
- **Styling**: React Native StyleSheet

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── TimerButton.tsx
│   ├── ContractionList.tsx
│   ├── ContractionItem.tsx
│   ├── Statistics.tsx
│   └── Instructions.tsx
├── context/            # State management
│   ├── ContractionContext.tsx
│   └── ThemeContext.tsx
├── screens/            # App screens
│   ├── HomeScreen.tsx
│   ├── SavedSetsScreen.tsx
│   └── SettingsScreen.tsx
├── types/              # TypeScript definitions
│   └── index.ts
└── utils/              # Helper functions
    ├── storage.ts
    └── formatting.ts
```

## Development

### Available Scripts

```bash
# Start development server
pnpm start

# Start on specific platform
pnpm ios      # iOS simulator
pnpm android  # Android emulator
pnpm web      # Web browser

# Build for production
pnpm dlx expo build:ios
pnpm dlx expo build:android
pnpm dlx expo export:web
```

### Code Style

- Functional components with hooks
- Named exports preferred
- TypeScript strict mode enabled
- Components are focused and single-purpose

## Privacy

This app is designed with privacy as a core principle:

- **No accounts required** - Use immediately without signing up
- **No cloud storage** - All data stored locally on your device
- **No analytics** - No tracking or data collection
- **No ads** - Being a parent is expensive enough already
- **No network calls** - Works completely offline

Your contraction data never leaves your device.

## Disclaimer

**This app is a timing tool only.** It does not provide medical advice, diagnoses, or recommendations about when to go to the hospital or contact your healthcare provider. Always consult with your doctor, midwife, or healthcare provider for medical guidance during pregnancy and labor.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

GNU AGPLv3. See the [LICENSE](LICENSE) file for details.