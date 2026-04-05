# KrishiMitra - Smart Agricultural Intelligence Platform 🌾

A cutting-edge, responsive React web application built with **Vite** that provides comprehensive agricultural solutions. It features AI-powered crop recommendations, Gemini Vision soil health card scanning, disease detection, weather forecasting, and farm management tools.

---

## ✨ Features

### 🎯 Core Functionality

- **Smart Crop Recommendations**: AI-powered crop suggestions based on soil conditions, weather patterns, and historical data. Includes a fallback local recommendation engine when the server is offline.
- **AI Soil Health Card Scanner (New!)**: Upload a photo of your **Soil Health Card (मृदा स्वास्थ्य कार्ड)** and let **Gemini 2.0 Flash Vision** automatically extract parameters like Nitrogen, Phosphorus, Potassium, pH, Zinc, and Sulfur.
- **Disease Detection**: Advanced plant disease identification using image recognition and voice descriptions.
- **Weather Integration**: Real-time weather data and 7-day forecasts.
- **Data Management**: Comprehensive farm data entry and analytics.

### 🌐 Platform Support

- **Web Browsers**: Optimized for Chrome, Firefox, Safari, Edge.
- **Responsive Design**: Seamless experience on desktop, tablet, and mobile devices.

### 🌍 Accessibility & Localization

- **Bilingual Support**: Complete English and Hindi language support with instant switching.
- **Voice Input**: Web Speech API integration for voice commands and input in Hindi/English.
- **Accessible UI**: Proper accessibility labels and semantic markup.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 18 or higher recommended)
- **Python 3.8+** (for the Flask ML Backend)
- **Gemini API Key** (for Soil Health Card scanning)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SPMProject
   ```

2. **Frontend Setup**
   ```bash
   # Install dependencies
   npm install

   # Setup environment variables (add your Gemini API key)
   echo VITE_GEMINI_API_KEY="your_api_key_here" > .env

   # Start the frontend server (runs on port 3000)
   npm run dev
   ```

3. **Node API Server Setup (Proxies & Transcriptions)**
   ```bash
   cd agrismart-server
   npm install
   node server.js
   # Runs on port 8081
   ```

4. **Flask ML Backend Setup (Optional but recommended for full ML power)**
   ```bash
   cd ../Crop-Recommendation-System
   pip install -r requirements.txt
   python app.py
   # Runs on port 5000
   ```

---

## 📱 How to Use

1. Open `http://localhost:3000` in your browser.
2. **Dashboard**: Access the main dashboard with weather and quick actions.
3. **Data Entry & Scanner**: 
   - Navigate to "Enter Data".
   - Use the **Camera** or **Upload** button to scan a Soil Health Card. 
   - Apply the AI-extracted values directly to the form.
   - Click "Get Crop Recommendations" to receive custom advice.
4. **Disease Detection**: Upload an image of a diseased crop leaf to get instant AI treatment recommendations.

---

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **Vite** for fast building
- **Node.js + Express** proxy server
- **Flask + Python** for Machine Learning Model (`app.py`)
- **Google Gemini 2.0 Flash API** for Multimodal Vision OCR
- **Tailwind CSS & Material-UI** for styling

---

## 📁 Project Structure

```text
SPMProject/
├── agrismart-server/        # Node.js backend proxy and upload handlers
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/             # React contexts (Language, Theme)
│   ├── pages/               # Main pages (Dashboard, DataEntryForm, etc.)
│   ├── services/            # APIs (e.g., soilHealthCardScanner.ts)
│   ├── theme/               # Colors and global styles
│   └── App.tsx              # Main routing component
├── .env                     # Environment variables (Gemini API Key goes here)
└── vite.config.ts           # Vite configuration
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.