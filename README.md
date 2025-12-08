# Bet Tracker

A React-based betting tracker application that helps you track your gambling bets, analyze performance, and view detailed analytics.

## Features

- **User Authentication**: Secure login/signup with Firebase Authentication
- **Bet Tracking**: Add, edit, and delete bets with detailed information
- **Deposit Tracking**: Track your deposits to calculate net profit
- **Real-time Data**: Data syncs in real-time using Firestore
- **Analytics Dashboard**: Comprehensive analytics including:
  - Profit trends
  - Win/loss ratios
  - Performance by game and sport league
  - ROI calculations
  - Risk metrics
  - And much more!

## Tech Stack

- React 19
- Vite
- Firebase (Authentication & Firestore)
- React Router
- Recharts (for analytics visualizations)

## Setup Instructions

### 1. Firebase Configuration

The Firebase configuration is already set up in `src/firebase/config.js`. If you need to use your own Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication (Email/Password)
4. Create a Firestore database
5. Copy your Firebase config and update `src/firebase/config.js`

### 2. Firestore Security Rules

Deploy the security rules from `firestore.rules` to your Firestore database:

1. In Firebase Console, go to Firestore Database
2. Click on "Rules" tab
3. Copy the contents of `firestore.rules` and paste them
4. Click "Publish"

These rules ensure users can only access their own data.

### 3. Firestore Indexes

The app queries bets and deposits by date in descending order. Firestore may prompt you to create indexes. If you see an error about missing indexes:

1. Click the link in the error message
2. It will take you to Firebase Console to create the index
3. Click "Create Index"

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Application

```bash
npm run dev
```

## Data Migration

When you first log in, the app will automatically migrate any existing data from localStorage to Firestore. This happens once per user and won't duplicate data on subsequent logins.

## Project Structure

```
src/
├── components/          # React components
│   ├── Auth.jsx        # Authentication UI
│   ├── Layout.jsx      # Main layout with navigation
│   ├── Dashboard.jsx   # Dashboard view
│   ├── BetCard.jsx     # Individual bet card
│   └── AddBetModal.jsx # Modal for adding/editing bets
├── context/            # React Context providers
│   ├── AuthContext.jsx # Authentication context
│   └── BetContext.jsx  # Bet data context (Firestore)
├── firebase/           # Firebase configuration
│   └── config.js       # Firebase setup
└── pages/              # Page components
    ├── History.jsx     # Bet history page
    └── Analytics.jsx   # Analytics page
```

## Data Structure

### Firestore Collections

- `users/{userId}/bets/{betId}` - User's bets
- `users/{userId}/deposits/{depositId}` - User's deposits

Each user's data is isolated in their own subcollection for security and organization.

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
