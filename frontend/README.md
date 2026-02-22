# Frontend Base (React Native + JavaScript + Expo)

Base template for a large team, with a clear structure, explicit naming, and the essentials to start building software.

## Requirements

- Node.js LTS
- npm
- Expo Go (optional on mobile)

## First Run

1. Install dependencies:

  ```bash
  npm install
  ```

2. Copy environment variables:

  ```bash
  cp .env.example .env
  ```

3. Start the project:

  ```bash
  npm start
  ```

## Scripts

- `npm start` - Expo in development mode
- `npm run android` - launch on Android
- `npm run ios` - launch on iOS
- `npm run web` - launch in browser
- `npm run lint` - code quality linting

## Base Structure

```text
frontend/
├── assets/
│   ├── fonts/
│   ├── icons/
│   └── images/
├── src/
│   ├── components/
│   │   └── CustomButton.js
│   ├── constants/
│   │   ├── config.js
│   │   └── theme.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── hooks/
│   │   └── useGeolocation.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   └── LoginScreen.js
│   ├── services/
│   │   └── apiClient.js
│   ├── styles/
│   │   └── globalStyles.js
│   └── utils/
│       └── helpers.js
├── .eslintrc.json
├── .prettierrc
├── App.js
├── app.json
├── babel.config.js
├── package.json
└── README.md
```

## What Is Already Included

- Main navigation with a basic authentication flow (`Login`/`Home`).
- Global auth context with token persistence in AsyncStorage.
- Axios client prepared for JWT token injection via interceptor.
- Reusable geolocation hook.
- Global theme and shared styles.
- ESLint + Prettier for team collaboration.
