import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdWbSunny, MdCloudQueue, MdCloud, MdFoggy, MdGrain, MdAcUnit,
  MdUmbrella, MdFlashOn, MdWarning, MdLocationOn, MdEdit,
  MdGpsFixed, MdUploadFile, MdCameraAlt,
  MdThermostat, MdOpacity, MdAir, MdEco, MdCheckCircle,
  MdChat, MdSearch, MdClose
} from 'react-icons/md';

import { useLanguage } from '../context/LanguageContext';

// --- THEME ---
const colors = {
  gradientStart: '#4CAF50',
  gradientEnd: '#81C784',
  background: '#F0F2F5',
  surface: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#4B5563',
  textLight: '#9CA3AF',
  primary: '#2E7D32',
  warning: '#F59E0B',
  error: '#EF4444',
  success: '#10B981',
  info: '#3B82F6',
  white: '#FFFFFF',
  border: '#E5E7EB',
  backgroundActive: '#F3F4F6',
};

// --- TYPES ---
interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
}

interface ForecastItem {
  date: string;
  icon: string;
  tempHigh: number;
  tempLow: number;
  rain: number;
}

const DEFAULT_LOCATION: LocationData = {
  name: 'Nashik, Maharashtra',
  latitude: 19.9975,
  longitude: 73.7898
};

// --- ICON HELPER ---
const WeatherIcon = ({ name, size = 24, color = '#000' }: any) => {
  const props = { size, color };
  switch (name) {
    case 'wb-sunny': return <MdWbSunny {...props} />;
    case 'cloud-queue': return <MdCloudQueue {...props} />;
    case 'cloud': return <MdCloud {...props} />;
    case 'foggy': return <MdFoggy {...props} />;
    case 'grain': return <MdGrain {...props} />;
    case 'ac-unit': return <MdAcUnit {...props} />;
    case 'umbrella': return <MdUmbrella {...props} />;
    case 'flash-on': return <MdFlashOn {...props} />;
    default: return <MdCloud {...props} />;
  }
};

// --- COMPONENTS ---
const DashboardCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  gradient?: boolean;
  className?: string;
}> = ({ children, style, onClick, gradient = false }) => {
  const cardStyle: React.CSSProperties = {
    ...styles.cardBase,
    ...style,
    background: gradient
      ? `linear-gradient(135deg, ${colors.gradientStart}, ${colors.gradientEnd})`
      : colors.surface,
    cursor: onClick ? 'pointer' : 'default',
  };

  return (
    <div style={cardStyle} onClick={onClick}>
      {children}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // --- STATE ---
  const [location, setLocation] = useState<LocationData | null>(null);
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecastData, setForecastData] = useState<ForecastItem[]>([]);
  const [weatherAlert, setWeatherAlert] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<any | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // --- API FUNCTIONS ---
  const fetchWeatherData = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setWeatherAlert(null);
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relativehumidity_2m,precipitation,windspeed_10m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`);
      const data = await response.json();

      setCurrentWeather({
        temperature: Math.round(data.current.temperature_2m),
        humidity: data.current.relativehumidity_2m,
        rainfall: data.current.precipitation,
        windSpeed: Math.round(data.current.windspeed_10m),
        weathercode: data.current.weathercode,
      });

      const mapCodeToIcon = (code: number) => {
        if (code <= 1) return 'wb-sunny';
        if (code === 2) return 'cloud-queue';
        if (code === 3) return 'cloud';
        if ([45, 48].includes(code)) return 'foggy';
        if ([51, 53, 55, 66, 67].includes(code)) return 'grain';
        if ([56, 57, 71, 73, 75, 77, 85, 86].includes(code)) return 'ac-unit';
        if ([61, 63, 65, 80, 81, 82].includes(code)) return 'umbrella';
        if ([95, 96, 99].includes(code)) return 'flash-on';
        return 'cloud';
      };

      const formattedForecast = data.daily.time.slice(0, 7).map((date: string, index: number) => ({
        date: new Date(date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { day: '2-digit', month: '2-digit' }),
        icon: mapCodeToIcon(data.daily.weathercode[index]),
        tempHigh: Math.round(data.daily.temperature_2m_max[index]),
        tempLow: Math.round(data.daily.temperature_2m_min[index]),
        rain: data.daily.precipitation_probability_max[index],
      }));

      setForecastData(formattedForecast);

      // Simple alert logic
      if (formattedForecast.some((day: any) => day.rain > 50)) {
        setWeatherAlert(t.rainAlert || "Rain Alert: High chance of rain soon.");
      }
    } catch (error) {
      console.error('Weather fetch error', error);
    } finally {
      setLoading(false);
    }
  }, [language, t.rainAlert]);

  const resolveLocation = useCallback(async (lat: number, lon: number) => {
    try {
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
      const data = await response.json();
      const name = data.city ? `${data.city}, ${data.principalSubdivision}` : (t.unknownLocation || "Unknown Location");
      setLocation({ name, latitude: lat, longitude: lon });
      await fetchWeatherData(lat, lon);
    } catch {
      setLocation({ name: "Unknown Location", latitude: lat, longitude: lon });
      await fetchWeatherData(lat, lon);
    }
  }, [fetchWeatherData, t.unknownLocation]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolveLocation(pos.coords.latitude, pos.coords.longitude),
        () => resolveLocation(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude)
      );
    } else {
      resolveLocation(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
    }
  }, [resolveLocation]);

  // --- HANDLERS (Simplified for brevity) ---
  const handleLocationSearch = (text: string) => {
    setCityInput(text);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    if (text.length < 3) return;
    debounceTimeout.current = setTimeout(async () => {
      setIsSuggestionsLoading(true);
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${text}&count=5&format=json`);
      const data = await res.json();
      setSuggestions(data.results || []);
      setIsSuggestionsLoading(false);
    }, 500);
  };

  const submitLocation = async () => {
    const target = selectedSuggestion || suggestions[0];
    if (target) {
      setLocation({ name: `${target.name}, ${target.admin1 || ''}`, latitude: target.latitude, longitude: target.longitude });
      await fetchWeatherData(target.latitude, target.longitude);
      closeModal();
    }
  };

  const closeModal = () => { setIsModalVisible(false); setCityInput(''); setSuggestions([]); };
  const handleUpload = () => document.getElementById('file-upload')?.click();
  const handleCamera = () => alert("Camera feature coming soon!");

  // --- RENDER ---
  return (
    <div style={styles.container}>

      {/* --- HEADER --- */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>{t.welcome || "Welcome"} 👋</h1>
          <p style={styles.headerSubtitle}>{t.smartCropSubtitle || "Your smart farming assistant"}</p>
        </div>
        <div style={styles.headerLocationPill}>
          <MdLocationOn color={colors.primary} size={22} />
          <span style={styles.locationTextPill}>{location?.name || "Loading..."}</span>
          <button onClick={() => setIsModalVisible(true)} style={styles.pillIconBtn}><MdEdit size={16} /></button>
          <button onClick={() => { if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(pos => resolveLocation(pos.coords.latitude, pos.coords.longitude)); } }} style={styles.pillIconBtn}><MdGpsFixed size={16} /></button>
        </div>
      </div>

      {/* --- MAIN GRID LAYOUT --- */}
      <div style={styles.grid}>

        {/* COLUMN 1: LEFT SIDEBAR (Actions) */}
        <div style={styles.columnLeft}>
          {/* Quick Actions Card */}
          <DashboardCard style={styles.quickActionsCard}>
            <h3 style={styles.cardTitle}>{t.quickAccess || "Quick Access"}</h3>

            <div style={styles.actionButtons}>
              <button style={styles.actionBtnPrimary} onClick={handleUpload}>
                <MdUploadFile size={20} /> {t.upload || "Upload"}
                <input id="file-upload" type="file" hidden />
              </button>
              <button style={styles.actionBtnSecondary} onClick={handleCamera}>
                <MdCameraAlt size={20} /> Camera
              </button>
            </div>
          </DashboardCard>

          {/* Weather Alert (If Active) */}
          {weatherAlert && (
            <div style={styles.alertBox}>
              <MdWarning size={24} color={colors.warning} />
              <div style={{ marginLeft: 12 }}>
                <div style={{ fontWeight: 'bold', color: colors.textPrimary }}>{t.weatherAlert || "Alert"}</div>
                <div style={{ fontSize: 13, color: colors.textSecondary }}>{weatherAlert}</div>
              </div>
            </div>
          )}

        </div>

        {/* COLUMN 2: CENTER (Main Data) */}
        <div style={styles.columnCenter}>
          {/* Banner */}
          <div style={styles.banner}>
            <div style={styles.bannerContent}>
              <h2 style={styles.bannerTitle}>{t.smartCropRecommendation || "Smart Crop AI"}</h2>
              <p style={styles.bannerText}>{t.smartCropSubtitle || "Get recommendations based on your soil & weather."}</p>
            </div>
          </div>

          {/* Today's Overview Grid */}
          <h3 style={styles.sectionHeader}>{t.todaysOverview || "Today's Overview"}</h3>
          <div style={styles.overviewGrid}>
            {/* Weather Card */}
            <DashboardCard style={{ ...styles.overviewCard, borderLeft: `4px solid ${colors.info}` }}>
              <div style={styles.cardHeader}>
                <MdWbSunny color={colors.info} size={20} />
                <span style={styles.cardHeaderTitle}>{t.todaysWeather || "Weather"}</span>
              </div>
              <div style={styles.metricsGrid}>
                <Metric icon={MdThermostat} label={t.temperature || "Temp"} value={currentWeather ? `${currentWeather.temperature}°C` : '--'} />
                <Metric icon={MdOpacity} label={t.humidity || "Humidity"} value={currentWeather ? `${currentWeather.humidity}%` : '--'} />
                <Metric icon={MdGrain} label={t.rainfall || "Rain"} value={currentWeather ? `${currentWeather.rainfall}mm` : '--'} />
                <Metric icon={MdAir} label={t.windSpeed || "Wind"} value={currentWeather ? `${currentWeather.windSpeed} km/h` : '--'} />
              </div>
            </DashboardCard>

            {/* Soil Card */}
            <DashboardCard style={{ ...styles.overviewCard, borderLeft: `4px solid ${colors.warning}` }}>
              <div style={styles.cardHeader}>
                <MdEco color={colors.warning} size={20} />
                <span style={styles.cardHeaderTitle}>{t.soilCondition || "Soil"}</span>
              </div>
              <div style={styles.soilList}>
                <SoilRow label="pH Level" value="6.8" status="good" />
                <SoilRow label="Nitrogen" value="Medium" status="warning" />
                <SoilRow label="Phosphorus" value="High" status="good" />
              </div>
              <div style={styles.soilFooter}>
                <MdCheckCircle color={colors.success} size={16} />
                <span>{t.overallGood || "Soil is healthy"}</span>
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* COLUMN 3: RIGHT (Forecast) */}
        <div style={styles.columnRight}>
          <DashboardCard style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={styles.cardTitle}>{t.sevenDayForecast || "7-Day Forecast"}</h3>
            <div style={styles.forecastList}>
              {forecastData.map((item, i) => (
                <div key={i} style={styles.forecastRow}>
                  <span style={styles.forecastDay}>{item.date.split(',')[0]}</span>
                  <div style={styles.forecastIcon}><WeatherIcon name={item.icon} size={24} color={colors.primary} /></div>
                  <div style={styles.forecastTemps}>
                    <span style={{ fontWeight: 'bold' }}>{item.tempHigh}°</span>
                    <span style={{ color: colors.textLight, fontSize: 12 }}>{item.tempLow}°</span>
                  </div>
                </div>
              ))}
              {loading && <div style={{ textAlign: 'center', padding: 20 }}>Loading weather...</div>}
            </div>
          </DashboardCard>
        </div>

      </div>

      {/* Floating Chat Button */}
      <button style={styles.fab} onClick={() => navigate('/ChatbotFloating')}>
        <MdChat size={24} color="white" />
      </button>

      {/* Modal */}
      {isModalVisible && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3>Search Location</h3>
              <button onClick={closeModal} style={styles.closeBtn}><MdClose /></button>
            </div>
            <div style={styles.inputWrapper}>
              <MdSearch color={colors.textLight} size={20} />
              <input
                style={styles.modalInput}
                placeholder="Search city..."
                value={cityInput}
                onChange={e => handleLocationSearch(e.target.value)}
              />
            </div>
            {isSuggestionsLoading && <div style={{ padding: 10, fontSize: 12 }}>Searching...</div>}
            <div style={styles.suggestionsList}>
              {suggestions.map((s, i) => (
                <div key={i} style={styles.suggestionItem} onClick={() => { setSelectedSuggestion(s); setCityInput(s.name); }}>
                  {s.name}, {s.country}
                </div>
              ))}
            </div>
            <button style={styles.submitBtn} onClick={submitLocation}>Set Location</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---
const Metric = ({ icon: Icon, label, value }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: colors.textSecondary, fontSize: 12 }}>
      <Icon size={14} /> {label}
    </div>
    <div style={{ fontSize: 16, fontWeight: 'bold', color: colors.textPrimary }}>{value}</div>
  </div>
);

const SoilRow = ({ label, value, status }: any) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, marginBottom: 8 }}>
    <span style={{ color: colors.textSecondary }}>{label}</span>
    <span style={{
      fontWeight: 'bold',
      color: status === 'good' ? colors.primary : colors.warning,
      backgroundColor: status === 'good' ? '#E8F5E9' : '#FFF3E0',
      padding: '2px 8px', borderRadius: 4
    }}>{value}</span>
  </div>
);

// --- STYLES (CSS GRID) ---
const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: colors.background,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    overflowX: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 30px',
    backgroundColor: colors.surface,
    borderBottom: `1px solid ${colors.border}`,
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, margin: 0 },
  headerSubtitle: { fontSize: 14, color: colors.textSecondary, margin: 0 },
  // Old headerLocation removed, replaced by Pill UI below
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', color: colors.textSecondary, display: 'flex' },

  // Location Pill UI
  headerLocationPill: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#F3F4F6', // Light gray background
    borderRadius: '24px',
    padding: '8px 16px',
    gap: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  locationTextPill: {
    fontWeight: '700', // Bolder text
    color: '#1F2937', // Dark navy/gray text
    fontSize: '16px',
    marginLeft: '4px',
    marginRight: '8px',
  },
  pillIconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#4B5563', // Gray icons
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
  },

  // --- GRID LAYOUT ---
  grid: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr 300px', // Left Sidebar | Main Content | Right Sidebar
    gap: '24px',
    padding: '24px 30px',
    flex: 1,
    maxWidth: 1600,
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  columnLeft: { display: 'flex', flexDirection: 'column', gap: 20 },
  columnCenter: { display: 'flex', flexDirection: 'column', gap: 20 },
  columnRight: { display: 'flex', flexDirection: 'column', gap: 20 },

  // --- CARDS ---
  cardBase: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: `1px solid ${colors.border}`,
    boxSizing: 'border-box',
  },
  cardTitle: { fontSize: 16, fontWeight: '700', margin: '0 0 16px 0', color: colors.textPrimary },
  cardTitleSm: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  cardSubtitle: { fontSize: 12, color: colors.textSecondary },

  // Quick Actions
  actionButtons: { display: 'flex', gap: 10, marginBottom: 16 },
  actionBtnPrimary: {
    flex: 1, padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer',
    backgroundColor: '#E8F5E9', color: colors.primary, fontWeight: 600,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
  },
  actionBtnSecondary: {
    flex: 1, padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer',
    backgroundColor: colors.primary, color: 'white', fontWeight: 600,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
  },
  diseaseCard: {
    background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
    borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    color: 'white', cursor: 'pointer'
  },
  alertBox: {
    backgroundColor: '#FFF8E1', borderLeft: `4px solid ${colors.warning}`,
    padding: 12, borderRadius: 8, display: 'flex', alignItems: 'flex-start', marginTop: 20
  },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#E3F2FD',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },

  // Center Content
  banner: {
    height: 180, borderRadius: 16,
    backgroundImage: 'url(https://i.ibb.co/SD9MMMpL/Farmer-Working.jpg)',
    backgroundSize: 'cover', backgroundPosition: 'center',
    position: 'relative', overflow: 'hidden'
  },
  bannerContent: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 20, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
    color: 'white'
  },
  bannerTitle: { margin: 0, fontSize: 20, fontWeight: 'bold' },
  bannerText: { margin: '4px 0 0', fontSize: 14, opacity: 0.9 },

  sectionHeader: { fontSize: 18, fontWeight: 'bold', margin: '10px 0 0', color: colors.textPrimary },
  overviewGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  overviewCard: { padding: 20 },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 },
  cardHeaderTitle: { fontWeight: 600, color: colors.textPrimary },
  metricsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  soilList: { marginBottom: 12 },
  soilFooter: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: colors.success, borderTop: `1px solid ${colors.border}`, paddingTop: 12 },

  // Right Content (Forecast)
  forecastList: { display: 'flex', flexDirection: 'column', gap: 0, height: '100%', overflowY: 'auto' },
  forecastRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 0', borderBottom: `1px solid ${colors.backgroundActive}`
  },
  forecastDay: { fontSize: 14, fontWeight: 500, color: colors.textPrimary, width: 80 },
  forecastIcon: { flex: 1, textAlign: 'center' as const },
  forecastTemps: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },

  // Floating Action Button
  fab: {
    position: 'fixed', bottom: 30, right: 30,
    width: 56, height: 56, borderRadius: '50%',
    backgroundColor: colors.primary, border: 'none',
    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.4)',
    color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 100
  },

  // Modal
  modalOverlay: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  modal: {
    backgroundColor: 'white', padding: 24, borderRadius: 16, width: 400,
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
  },
  modalHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 16 },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 },
  inputWrapper: {
    display: 'flex', alignItems: 'center', border: `1px solid ${colors.border}`,
    borderRadius: 8, padding: '8px 12px', gap: 8
  },
  modalInput: { border: 'none', outline: 'none', width: '100%', fontSize: 14 },
  suggestionsList: { maxHeight: 200, overflowY: 'auto', margin: '10px 0' },
  suggestionItem: { padding: '8px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', fontSize: 14 },
  submitBtn: {
    width: '100%', padding: 12, backgroundColor: colors.primary, color: 'white',
    border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', marginTop: 10
  }
};

export default Dashboard;