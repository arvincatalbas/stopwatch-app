# Stopwatch

A calm, dark-themed stopwatch app built with Expo, React Native, and TypeScript. It runs on Android, iOS, and the web.

## Features

- Start, pause, resume, and reset the stopwatch.
- Record lap splits and review lap times during a session.
- Save completed, paused sessions to on-device history, including duration and lap count.
- Review saved sessions or clear all history.
- Save haptic feedback, sound, and keep-screen-awake preference toggles in Settings. These preferences are not currently connected to runtime behavior.
- See a first-launch introduction and use a responsive layout across screen sizes.

Session history, settings, and the first-launch introduction state are stored locally with AsyncStorage. History is not synced to an account or between devices.

## Requirements

- Node.js `^20.19.4`, `^22.13.0`, `^24.3.0`, or `>=25.0.0` (see `engines` in `package.json`).
- npm, included with Node.js.
- For device simulators, the corresponding Android or iOS development tools. Expo Go can also be used for supported features.

## Get started

From the project directory:

```bash
npm install
npm start
```

Then use the Expo CLI prompts to open the app in Expo Go, an emulator/simulator, or a web browser.

Platform-specific development commands:

```bash
npm run android
npm run ios
npm run web
```

## Quality checks

```bash
npm run lint
npx tsc --noEmit
```

There is currently no test script configured in `package.json`.

## Project structure

```text
.
├── assets/
│   ├── expo.icon/                 # iOS app icon source assets
│   └── images/                    # App icons, splash screen, and image assets
├── scripts/
│   └── reset-project.js           # Expo starter reset utility; see warning below
├── src/
│   ├── app/                       # Expo Router routes and navigation layouts
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx        # Stopwatch, History, and Settings tabs
│   │   │   ├── history.tsx        # Saved session history
│   │   │   ├── index.tsx          # Stopwatch and lap controls
│   │   │   └── settings.tsx       # User preferences
│   │   ├── _layout.tsx            # Root stack and status bar
│   │   └── index.tsx              # Redirects to the tab navigator
│   ├── components/                # Shared screen and UI components
│   │   ├── ui/
│   │   │   └── collapsible.tsx
│   │   ├── animated-icon.module.css
│   │   ├── animated-icon.tsx
│   │   ├── animated-icon.web.tsx
│   │   ├── app-tabs.tsx
│   │   ├── app-tabs.web.tsx
│   │   ├── ControlButton.tsx
│   │   ├── external-link.tsx
│   │   ├── hint-row.tsx
│   │   ├── LapItem.tsx
│   │   ├── LapList.tsx
│   │   ├── ScreenHeader.tsx
│   │   ├── StopwatchDisplay.tsx
│   │   ├── themed-text.tsx
│   │   ├── themed-view.tsx
│   │   └── web-badge.tsx
│   ├── constants/
│   │   └── theme.ts               # Shared theme values
│   ├── hooks/
│   │   ├── use-color-scheme.ts
│   │   ├── use-color-scheme.web.ts
│   │   ├── use-theme.ts
│   │   └── useStopwatch.ts        # Stopwatch timing and lap state
│   ├── types/
│   │   └── stopwatch.ts           # Stopwatch and lap types
│   ├── utils/
│   │   ├── formatTime.ts           # Millisecond-to-display formatting
│   │   └── storage.ts              # AsyncStorage session history helpers
│   └── global.css                  # Shared web font variables
├── .claude/                        # Claude project settings
├── .vscode/                        # VS Code workspace settings
├── app.json                        # Expo app, platform, and plugin configuration
├── eslint.config.js                # ESLint configuration
├── package.json                   # Dependencies and npm scripts
├── package-lock.json              # npm dependency lockfile
├── tsconfig.json                   # TypeScript configuration
├── expo-env.d.ts                   # Expo-generated TypeScript declarations
├── .nvmrc                          # Preferred Node.js version for nvm
├── .gitignore
├── AGENTS.md                       # Repository-specific agent guidance
├── CLAUDE.md                       # Project-specific Claude guidance
└── LICENSE
```

Expo-generated folders and installed dependencies such as `.expo/`, `dist/`, and `node_modules/` are not part of the application source and are ignored by Git.

### Where to make changes

- Add or edit screens and navigation in `src/app/`. Files in this directory are Expo Router routes; `_layout.tsx` files configure navigators.
- Put reusable UI in `src/components/`.
- Keep stopwatch state and timing logic in `src/hooks/useStopwatch.ts`.
- Keep persistence and other shared helpers in `src/utils/`.
- Update app icons, splash assets, and other bundled images in `assets/`; platform behavior and Expo plugins are configured in `app.json`.

The `reset-project` script is leftover starter tooling, not part of normal development. Running `npm run reset-project` can move or delete `src/`, `scripts/`, and selected image assets, so do not run it unless you intend to reset the application.

## Technology

- Expo SDK 58 and Expo Router (file-based navigation)
- React 19 and React Native 0.88
- TypeScript with strict checking and typed routes
- AsyncStorage for local preferences and session history
- ESLint using the Expo flat configuration
