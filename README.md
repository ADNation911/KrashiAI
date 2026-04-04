# KrishiMitra - Smart Agricultural Intelligence Platform 🌾

A cutting-edge, responsive React web application built with Vite that provides comprehensive agricultural solutions including AI-powered crop recommendations, disease detection, weather forecasting, and farm management tools.

## ✨ Features

### 🎯 Core Functionality
- **Smart Crop Recommendations**: AI-powered crop suggestions based on soil conditions, weather patterns, and historical data
- **Disease Detection**: Advanced plant disease identification using image recognition and voice descriptions
- **Weather Integration**: Real-time weather data and 7-day forecasts with automatic location detection
- **Data Management**: Comprehensive farm data entry, storage, and analytics
- **Historical Analytics**: Track yield patterns, weather correlations, and optimization opportunities
- **Market Prices**: Real-time market price tracking for various crops
- **Chatbot Support**: AI-powered chatbot for farming queries and assistance

### 🌐 Platform Support
- **Web Browsers**: Optimized for all modern web browsers (Chrome, Firefox, Safari, Edge)
- **Responsive Design**: Seamless experience on desktop, tablet, and mobile devices
- **Progressive Web App**: Installable on devices with offline capabilities

### 🌍 Accessibility & Localization
- **Bilingual Support**: Complete English and Hindi language support with instant switching
- **Voice Input**: Web Speech API integration for voice commands and input
- **Touch Optimized**: Large touch targets and gesture-friendly navigation
- **Screen Reader Support**: Proper accessibility labels and semantic markup

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn
- Firebase account (for authentication and database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd krishimitra-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Copy your Firebase configuration to `src/context/firebase.tsx`
   - Set up Firebase Authentication and Firestore

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## 📱 How to Use

1. **Web**: Open `http://localhost:5173` in your browser after running `npm run dev`
2. **Authentication**: Sign up or log in using email/password or Google authentication
3. **Dashboard**: Access the main dashboard with weather, soil data, and quick actions
4. **Crop Recommendations**: Navigate to "Crop Recommendations" to get AI-powered suggestions
5. **Data Entry**: Enter your farm data in the "Data Entry" section
6. **Disease Detection**: Upload images or describe symptoms for disease identification
7. **Market Prices**: Check real-time market prices for various crops
8. **Weather Forecast**: View 7-day weather forecasts for your location

## 📖 Documentation

- See `SETUP.md` for detailed setup instructions
- Check `MIGRATION_SUMMARY.md` for migration details

## 🎯 Key Features

### 🎨 UI/UX Design
- **Modern Design System**: Professional card-based layout with consistent spacing and typography
- **Interactive Elements**: Smooth hover effects, animations, and micro-interactions
- **Gradient Backgrounds**: Beautiful gradient overlays for key action items
- **Responsive Navigation**: Seamless routing with React Router DOM
- **Visual Hierarchy**: Clear content organization with proper color contrast

### 🔧 Technical Features
- **Global State Management**: Centralized language context for consistent translations
- **Firebase Integration**: Authentication, Firestore database, and storage
- **API Integration**: Working backend server with disease detection and voice transcription
- **Error Handling**: Graceful fallbacks and user-friendly error messages
- **Performance**: Optimized rendering, lazy loading, and smooth animations
- **Type Safety**: Complete TypeScript implementation with proper type definitions

### 🐛 Recent Improvements
- **Language Switching**: Fixed conflicting language switches
- **Image Handling**: Replaced problematic image URLs with proper fallbacks
- **Navigation**: Resolved routing conflicts and improved page transitions
- **Voice Input**: Enhanced voice recognition functionality

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **React Router DOM** for client-side routing
- **Firebase** for authentication and database
- **Material-UI** for UI components
- **Tailwind CSS** for styling
- **React Icons** for iconography
- **Emotion** for styled components

## 📁 Project Structure

```
krishimitra-web/
├── public/
│   ├── assets/
│   │   └── images/          # Static images and icons
│   └── index.html           # Main HTML template
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Icon.tsx         # Custom icon component
│   │   └── LinearGradient.tsx # Gradient component
│   ├── context/             # React contexts
│   │   ├── firebase.tsx     # Firebase configuration
│   │   └── LanguageContext.tsx # Language management
│   ├── pages/               # Main application pages
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── CropRecommendations.tsx # AI crop suggestions
│   │   ├── DiseaseDetection.tsx # Disease identification
│   │   ├── WeatherForecast.tsx # Weather data
│   │   ├── DataEntryForm.tsx # Farm data entry
│   │   ├── MarketPrices.tsx  # Market price tracking
│   │   ├── HistoricalData.tsx # Analytics and history
│   │   └── Profile.tsx       # User profile
│   ├── services/            # External service integrations
│   ├── styles/              # Global styles
│   ├── theme/               # Theme configuration
│   └── App.tsx              # Main app component
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
└── README.md                # This file
```

## 🎨 Key Components

### Dashboard
- **Weather Overview**: Current weather and 7-day forecast
- **Soil Analysis**: Real-time soil condition monitoring
- **Quick Actions**: Upload files, camera access, disease detection
- **Analytics Teaser**: Link to historical data and trends

### Crop Recommendations
- **AI-Powered Suggestions**: Based on soil, weather, and regional data
- **Visual Progress Bars**: Soil match and weather suitability indicators
- **Smart Badges**: Color-coded yield potential and water requirements
- **Detailed Information**: Duration, expected yield, and expert reasons
- **Fertilizer Recommendations**: Specific fertilizer and pesticide suggestions
- **Sustainability Scores**: Environmental impact assessment

### Disease Detection
- **Image Upload**: Upload plant images for analysis
- **Voice Description**: Describe symptoms using voice input
- **AI Analysis**: Machine learning-powered disease identification
- **Treatment Recommendations**: Suggested remedies and preventive measures

## 📱 Testing the Application

1. Start the development server: `npm run dev`
2. Open `http://localhost:5173` in your browser
3. Sign up or use demo credentials (if available)
4. Navigate through different sections:
   - Dashboard for overview
   - Crop Recommendations for AI suggestions
   - Weather Forecast for weather data
   - Data Entry for farm data input
5. Test language switching between English and Hindi
6. Test responsiveness by resizing the browser window

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Weather data provided by Open-Meteo API
- Geocoding services by BigDataCloud
- Icons from Material Design Icons and React Icons
- Images from Unsplash and iStock

---

**Ready to start farming smarter? Run `npm run dev` and get started today!** 🚜✨

## 🚀 Deploying to Netlify

This project is built with Vite. To deploy to Netlify, follow these steps:

1. In Netlify, connect your Git repository (GitHub/GitLab/Bitbucket).
2. Set the build command to:

```bash
npm run build
```

3. Set the publish directory to:

```
dist
```

4. Add any required environment variables (for example, Firebase config values) in Netlify -> Site settings -> Build & deploy -> Environment.

5. The project contains an SPA redirect in `netlify.toml` so client-side routing will work. Netlify will rewrite all requests to `index.html`.

6. Trigger a deploy. Netlify will run the build and publish the `dist` directory.

Notes:
- We updated `netlify.toml` to publish `dist` (Vite's output) and added a redirect for SPA routing.
- If the TypeScript compilation (`tsc`) causes build failures on Netlify, it's better to fix the TypeScript errors locally and keep `npm run build` as-is. As a temporary workaround you could change the build command to `vite build`, but that skips type checking.


#   K r a s h i S P M  
 