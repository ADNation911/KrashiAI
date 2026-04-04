import React, { useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import Icon from './components/Icon';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import './styles/index.css';
import { colors } from './theme/colors';

// Import pages
import ChatbotFloating from './pages/ChatbotFloating';
import CropRecommendations from './pages/CropRecommendations';
import Dashboard from './pages/Dashboard';
import DataEntryForm from './pages/DataEntryForm';
import Profile from './pages/Profile';
import WeatherForecast from './pages/WeatherForecast';




// Custom Header Component
const CustomHeader: React.FC = () => {
  const location = useLocation();
  const { toggleLanguage, t } = useLanguage();

  const menuItems = [
    { name: t.home, icon: "home", route: "/" },
    { name: t.weather, icon: "wb-sunny", route: "/WeatherForecast" },
    { name: t.enterData, icon: "storage", route: "/DataEntryForm" },
    { name: t.suggestions, icon: "eco", route: "/CropRecommendations" },
  ];

  return (
    <div style={styles.navbarContainer}>
      <div style={styles.topRowContainer}>
        <div style={styles.logoContainer}>
          <Icon name="track-changes" size={28} color={colors.white} />
          <span style={styles.logoText}>KrishiAI</span>
        </div>
        <div style={styles.rightActionsContainer}>
          <button style={styles.langButton} onClick={toggleLanguage}>
            <Icon
              name="language"
              size={16}
              color={colors.primary}
              style={{ marginRight: 6 }}
            />
            <span style={styles.langButtonText}>{t.changeLanguage}</span>
          </button>
        </div>
      </div>

      <div style={styles.navContentContainer}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.route;
          return (
            <Link key={item.route} to={item.route} style={{ ...styles.navItem, ...(isActive ? styles.navItemActive : {}) }}>
              <Icon
                name={item.icon}
                size={24}
                color={isActive ? colors.white : colors.textLight}
              />
              <span style={{ ...styles.navText, ...(isActive ? { color: colors.white } : {}) }}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

// Main App Layout
const AppLayout: React.FC = () => {
  return (
    <LanguageProvider>
      <CustomHeader />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/WeatherForecast" element={<WeatherForecast />} />
        <Route path="/DataEntryForm" element={<DataEntryForm />} />
        <Route path="/CropRecommendations" element={<CropRecommendations />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/ChatbotFloating" element={<ChatbotFloating />} />
      </Routes>
    </LanguageProvider>
  );
};




// Main App Component
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;

// ---------------------------------------------
// UPDATED STYLES FOR ATTRACTIVE, COMPACT LAYOUT
// ---------------------------------------------
const styles: Record<string, React.CSSProperties> = {
  // Modal Overlay (AppLayout)
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)', // Adds a nice blur effect behind modal
  },
  modalContent: {
    width: '100%',
    maxWidth: '440px', // Restricts width so it doesn't stretch
    maxHeight: '95vh',
    overflowY: 'auto',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
    backgroundColor: colors.background, // Ensure background is set
  },

  // Login Logic
  loginContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: colors.background, // Light gray usually
    paddingBottom: '20px',
  },
  scrollContent: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px 24px',
    justifyContent: 'flex-start', // <--- CHANGED from 'center' to 'flex-start'
    minHeight: '100%',            // Ensures it takes full height but doesn't force centering
  },

  // Header Section
  header: {
    textAlign: 'center',
    marginBottom: 25, // Reduced gap between header and card
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  loginLogoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  appNameText: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: '80%',
  },

  // The Card (Inputs + Buttons)
  cardContainer: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: '30px 25px',
    width: '100%',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },

  // Inputs
  // 1. Container remains mostly the same, ensuring content is centered
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    border: `2px solid ${colors.border}`,
    padding: '0 16px', // Outer padding for the whole box
    height: 52,
    width: '100%',
    overflow: 'hidden',
  },

  // 2. REDUCED MARGIN HERE (This brings the input closer to the icon)
  inputIcon: {
    marginRight: 1.5, // Changed from 12 to 8 to reduce the gap
    opacity: 0.7,
  },

  // 3. REMOVED PADDING HERE (This removes the extra space inside the input)
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    width: '100%',
    height: '100%',
    paddingLeft: 0, // Changed from 8 to 0 to remove inner gap
    marginLeft: 0,  // Ensures no extra margin pushes it away
  },
  eyeIcon: {
    padding: 8,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },

  // Buttons
  loginButton: {
    marginTop: 10,
    marginBottom: 16,
    border: 'none',
    cursor: 'pointer',
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
    padding: 0,
  },
  gradientButton: {
    borderRadius: 12,
    height: 52,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: '0.5px',
  },

  // Socials
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    margin: '20px 0',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    margin: '0 12px',
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  socialContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  socialButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    height: 52,
    border: `1px solid ${colors.border}`,
    padding: '0 16px',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.2s',
  },
  guestButton: {
    borderColor: colors.info,
    backgroundColor: '#e3f2fd', // Light blue tint
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: 600,
    color: colors.textPrimary,
    marginLeft: 10,
  },
  guestButtonText: {
    color: colors.info,
  },

  // Utilities
  forgotPassword: {
    textAlign: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 600,
  },
  signUpContainer: {
    marginTop: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signUpLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
    cursor: 'pointer',
    marginLeft: 4,
  },

  // Language & Demo
  languageToggle: {
    position: 'absolute',
    top: 20,
    right: 20,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: '6px 12px',
    borderRadius: '20px',
    border: `1px solid ${colors.border}`,
    cursor: 'pointer',
    zIndex: 10,
  },
  languageText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: 700,
    color: colors.primary,
  },
  demoContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
    padding: '10px 15px',
    width: '100%',
    textAlign: 'center',
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  demoText: {
    fontSize: 11,
    color: colors.textSecondary,
    margin: 0,
  },

  // Navbar (Kept mostly same, just tweaks)
  navbarContainer: {
    backgroundColor: colors.primary,
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    zIndex: 10,
  },
  topRowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: '0 16px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logoText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: 700,
    marginLeft: 10,
  },
  rightActionsContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  langButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: '6px 12px',
    borderRadius: 20,
    border: 'none',
    cursor: 'pointer',
  },
  langButtonText: {
    color: colors.primary,
    fontWeight: 700,
    fontSize: 12,
  },
  profileButton: {
    marginLeft: 16,
    textDecoration: 'none',
  },
  headerLoginButton: {
    marginLeft: 16,
    backgroundColor: colors.white,
    padding: '8px 20px',
    borderRadius: 20,
    border: 'none',
    cursor: 'pointer',
  },
  headerLoginButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  navContentContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '0 12px',
    overflowX: 'auto',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    borderRadius: 12,
    width: 90,
    marginRight: 8,
    textDecoration: 'none',
    minWidth: 90,
  },
  navItemActive: {
    backgroundColor: colors.backgroundActive,
  },
  navText: {
    color: colors.textLight,
    fontSize: 10,
    fontWeight: 600,
    marginTop: 4,
    textAlign: 'center',
    height: 24,
  },
};
