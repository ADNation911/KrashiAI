# KrishimitraWeb - Complete Setup Guide 🌾

This guide will help you set up and run the Krishimitra application locally. The application is built as a responsive web application using React and Vite.

## 📋 Prerequisites

Before starting, make sure you have the following installed:

- **Node.js** (version 18.x or later) - [Download here](https://nodejs.org/)
- **VSCode** - [Download here](https://code.visualstudio.com/)
- **Git** (for version control) - [Download here](https://git-scm.com/)

## 🚀 Quick Start

### Step 1: Clone the Repository
```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd krishimitra-web
```

### Step 2: Install Project Dependencies
```bash
# Install all required npm packages
npm install
```

### Step 3: Configure Environment Variables
- Create a `.env` file in the root directory based on the required Firebase and API configurations.
- Ensure your Firebase credentials (for Authentication and Firestore) are properly set up.

### Step 4: Run the Development Server
```bash
# Start the development server
npm run dev
```
The app will completely launch and automatically be available in your browser at:
`http://localhost:5173`

## 🔧 VSCode Setup

### Recommended Extensions
Install these VSCode extensions for a better development experience:
1. **ES7+ React/Redux/React-Native snippets**
2. **Prettier - Code formatter**
3. **Auto Rename Tag**
4. **GitLens**
5. **Tailwind CSS IntelliSense**

### VSCode Settings
Create or update `.vscode/settings.json` in your project:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 🧪 Testing the Application

1. Open your browser and navigate to `http://localhost:5173`.
2. Explore the features such as the Dashboard, Weather Forecast, and Crop Recommendations.
3. Test the language toggle (English ↔ Hindi, or other supported languages) to ensure translations work as expected.
4. Verify responsiveness by resizing your browser window or using browser developer tools to simulate mobile devices.

## 🚢 Building for Production

To create a production-ready build:

```bash
# Generate the production bundle
npm run build

# Preview the production build locally
npm run preview
```
The built files will be located in the `dist` directory, ready to be deployed to hosting services like Netlify, Vercel, or Firebase Hosting.

## 🐛 Troubleshooting

### Common Issues:

- **Port already in use**: If port 5173 is busy, Vite will automatically try the next available port. Check the terminal output for the correct URL.
- **Dependency errors**: Run `rm -rf node_modules package-lock.json && npm install` to perform a clean install.
- **Firebase connection issues**: Verify your `.env` variables and ensure your Firebase project allows `localhost` origins in Authentication domains.

## 🎉 You're All Set!

Your Krishimitra application is ready for development. The project uses modern tooling for fast hot module replacement and an optimized build process. Happy farming! 🌱🚜