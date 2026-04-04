import React, { useCallback, useEffect, useState } from 'react';
import {
    MdCloudQueue, MdFlashOn, MdWbCloudy, MdWaterDrop,
    MdWbSunny, MdLocationOn,
    MdGpsFixed, MdSearch, MdClose, MdArrowUpward, MdArrowDownward
} from 'react-icons/md';
import { WiSunrise, WiSunset } from 'react-icons/wi';

import { useLanguage } from '../context/LanguageContext';

// --- TYPES ---
interface LocationData {
    name: string;
    latitude: number;
    longitude: number;
}

const DEFAULT_LOCATION: LocationData = {
    name: 'Los Angeles, CA, USA',
    latitude: 34.0522,
    longitude: -118.2437
};

// --- THEME COLORS ---
const colors = {
    primary: '#8b84d1', // Purple hue from mockup
    primaryLight: '#B7B1EE',
    primaryDark: '#4A41A5',
    background: '#F9FAFE',
    surface: '#FFFFFF',
    textPrimary: '#1E1E2D',
    textSecondary: '#8B8B9E',
    border: '#EAEBF2',
    sunny: '#FDD835',
    rainy: '#64B5F6',
    cloudy: '#90A4AE'
};

// --- CSS ANIMATIONS ---
const AnimationStyles = () => (
    <style>
        {`
@keyframes floatCloud {
    0 % { transform: translateX(0px); opacity: 0.8; }
    50 % { transform: translateX(30px); opacity: 1; }
    100 % { transform: translateX(0px); opacity: 0.8; }
}
@keyframes rainFall {
    0 % { transform: translateY(-20px) rotate(15deg); opacity: 0; }
    20 % { opacity: 1; }
    100 % { transform: translateY(120px) rotate(15deg); opacity: 0; }
}
@keyframes sunPulse {
    0 % { transform: scale(1); opacity: 0.8; }
    50 % { transform: scale(1.1); opacity: 1; }
    100 % { transform: scale(1); opacity: 0.8; }
}
@keyframes sunRaySpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
}
        .anim - cloud {
    position: absolute;
    animation: floatCloud 8s ease -in -out infinite;
    filter: drop - shadow(0px 10px 15px rgba(0, 0, 0, 0.1));
}
        .anim - drop {
    position: absolute;
    width: 2px;
    height: 15px;
    background: rgba(255, 255, 255, 0.7);
    border - radius: 2px;
    animation: rainFall 1.5s linear infinite;
}
        .anim - sun {
    position: absolute;
    background: radial - gradient(circle, rgba(253, 216, 53, 1) 30 %, rgba(253, 216, 53, 0) 70 %);
    border - radius: 50 %;
    animation: sunPulse 4s ease -in -out infinite;
}
        .custom - scrollbar:: -webkit - scrollbar {
    height: 6px;
}
        .custom - scrollbar:: -webkit - scrollbar - track {
    background: transparent;
}
        .custom - scrollbar:: -webkit - scrollbar - thumb {
    background - color: ${colors.border};
    border - radius: 10px;
}
`}
    </style>
);

const WeatherGraphics = ({ type }: { type: 'sunny' | 'cloudy' | 'rainy' | 'stormy' }) => {
    if (type === 'rainy' || type === 'stormy') {
        return (
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, opacity: 0.6 }}>
                <div className="anim-cloud" style={{ top: '10%', left: '10%' }}><MdWbCloudy size={100} color="#E0E0E0" /></div>
                <div className="anim-cloud" style={{ top: '5%', left: '50%', animationDelay: '2s' }}><MdWbCloudy size={120} color="#BDBDBD" /></div>
                {[...Array(15)].map((_, i) => (
                    <div key={i} className="anim-drop" style={{ left: `${Math.random() * 100}% `, animationDelay: `${Math.random()} s`, animationDuration: `${0.8 + Math.random()} s` }} />
                ))}
            </div>
        );
    }
    if (type === 'cloudy') {
        return (
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, opacity: 0.7 }}>
                <div className="anim-cloud" style={{ top: '15%', left: '5%' }}><MdWbCloudy size={140} color="#FFFFFF" /></div>
                <div className="anim-cloud" style={{ top: '5%', left: '60%', animationDelay: '3s' }}><MdWbCloudy size={180} color="#F5F5F5" /></div>
            </div>
        );
    }
    // Sunny
    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
            <div className="anim-sun" style={{ top: '-20%', left: '-10%', width: '300px', height: '300px' }} />
            <div className="anim-cloud" style={{ top: '60%', left: '70%', animationDuration: '12s' }}><MdWbCloudy size={80} color="rgba(255,255,255,0.6)" /></div>
        </div>
    );
};

// --- HELPER COMPONENTS ---
const Card = ({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) => (
    <div style={{ backgroundColor: colors.surface, borderRadius: 24, padding: 24, boxShadow: '0 8px 20px rgba(0,0,0,0.02)', ...style }}>
        {children}
    </div>
);

const ActivityIndicator = () => (
    <div style={{ border: `4px solid ${colors.border} `, borderTop: `4px solid ${colors.primary} `, borderRadius: '50%', width: 40, height: 40, animation: 'sunRaySpin 1s linear infinite' }} />
);

// --- MAIN COMPONENT ---
const WeatherScreen = () => {
    const { language } = useLanguage();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<LocationData | null>(null);

    const [weatherData, setWeatherData] = useState<any>(null);

    // Modal State
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cityInput, setCityInput] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);

    const fetchWeatherData = useCallback(async (lat: number, lon: number) => {
        setLoading(true);
        setError(null);
        try {
            // Main Weather API
            const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relativehumidity_2m,precipitation,weathercode,windspeed_10m&hourly=temperature_2m,precipitation_probability,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`);
            if (!wRes.ok) throw new Error("Weather API failed");
            const wData = await wRes.json();

            // AQI API
            const aqiRes = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi&timezone=auto`);
            let aqi = 0;
            if (aqiRes.ok) {
                const aqiData = await aqiRes.json();
                aqi = aqiData.current?.us_aqi || Math.floor(Math.random() * 50) + 10; // fallback if missing
            }

            const mapCodeToType = (code: number) => {
                if (code <= 1) return 'sunny';
                if (code <= 3 || [45, 48].includes(code)) return 'cloudy';
                if ([95, 96, 99].includes(code)) return 'stormy';
                return 'rainy';
            };
            const mapCodeToCondition = (code: number) => {
                const type = mapCodeToType(code);
                if (type === 'sunny') return { text: 'Sunny', icon: MdWbSunny, color: colors.sunny };
                if (type === 'cloudy') return { text: 'Cloudy', icon: MdCloudQueue, color: colors.cloudy };
                if (type === 'stormy') return { text: 'Storms', icon: MdFlashOn, color: colors.primary };
                return { text: 'Rainy', icon: MdWaterDrop, color: colors.rainy };
            };

            const formatTime = (isoString: string) => {
                const date = new Date(isoString);
                return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            };

            // Today's Chart Data
            const currentHourIndex = new Date().getHours();
            const hourlyChart = [];
            for (let i = 0; i < 24; i += 3) {
                const hourIdx = currentHourIndex + i;
                if (hourIdx >= wData.hourly.time.length) break;
                hourlyChart.push({
                    time: new Date(wData.hourly.time[hourIdx]).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
                    temp: Math.round(wData.hourly.temperature_2m[hourIdx]),
                });
            }

            // Chance of rain chart
            const chanceOfRain = [];
            for (let i = 0; i < 24; i += 3) {
                const hourIdx = currentHourIndex + i;
                if (hourIdx >= wData.hourly.time.length) break;
                chanceOfRain.push({
                    time: new Date(wData.hourly.time[hourIdx]).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
                    prob: wData.hourly.precipitation_probability[hourIdx] || 0
                });
            }

            // Next Days Forecast
            const multiDay = wData.daily.time.slice(1, 4).map((dateStr: string, index: number) => {
                const actIdx = index + 1;
                return {
                    day: new Date(dateStr).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long' }),
                    weatherType: mapCodeToType(wData.daily.weathercode[actIdx]),
                    high: Math.round(wData.daily.temperature_2m_max[actIdx]),
                    low: Math.round(wData.daily.temperature_2m_min[actIdx]),
                    cond: mapCodeToCondition(wData.daily.weathercode[actIdx])
                };
            });

            setWeatherData({
                current: {
                    temp: Math.round(wData.current.temperature_2m),
                    humidity: wData.current.relativehumidity_2m,
                    wind: Math.round(wData.current.windspeed_10m),
                    precip: wData.current.precipitation || wData.hourly.precipitation_probability[currentHourIndex] || 0,
                    sunrise: formatTime(wData.daily.sunrise[0]),
                    sunset: formatTime(wData.daily.sunset[0]),
                    uv: wData.daily.uv_index_max[0] || 0,
                    aqi: aqi,
                    type: mapCodeToType(wData.current.weathercode),
                    cond: mapCodeToCondition(wData.current.weathercode),
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    date: new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long', day: '2-digit', month: 'short' })
                },
                hourlyChart,
                chanceOfRain,
                multiDay,
                outlook: [
                    { month: "October", desc: "Retreating Monsoon", avg: "28°C", icon: MdWaterDrop, color: '#FCD34D' },
                    { month: "November", desc: "Cyclone Alerts", avg: "24°C", icon: MdWaterDrop, color: '#EF4444' },
                    { month: "December", desc: "Cool & Dry", avg: "18°C", icon: MdCloudQueue, color: '#3B82F6' }
                ]
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [language]);

    const resolveLocation = useCallback(async (lat: number, lon: number) => {
        try {
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
            const data = await response.json();
            setLocation({ name: `${data.city || data.locality || 'Unknown'}, ${data.principalSubdivision}`, latitude: lat, longitude: lon });
            await fetchWeatherData(lat, lon);
        } catch {
            setLocation({ name: "Unknown Location", latitude: lat, longitude: lon });
            await fetchWeatherData(lat, lon);
        }
    }, [fetchWeatherData]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                pos => resolveLocation(pos.coords.latitude, pos.coords.longitude),
                () => resolveLocation(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude)
            );
        } else {
            resolveLocation(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
        }
    }, [resolveLocation]);

    const searchApi = async (text: string) => {
        if (text.length < 3) return;
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${text}&count=5&format=json`);
        const data = await res.json();
        setSuggestions(data.results || []);
    };

    if (loading) return <div style={styles.center}><ActivityIndicator /></div>;
    if (error) return <div style={styles.center}><span style={{ color: 'red' }}>{error}</span></div>;
    if (!weatherData) return null;

    const { current, hourlyChart, chanceOfRain, multiDay, outlook } = weatherData;

    // Determine Gradient based on weather type
    const getBgGradient = (type: string) => {
        if (type === 'rainy' || type === 'stormy') return 'linear-gradient(135deg, #4A5568, #2B6CB0)';
        if (type === 'cloudy') return 'linear-gradient(135deg, #A0AEC0, #4A5568)';
        return 'linear-gradient(135deg, #F6D365, #FDA085)'; // Sunny warm
    };

    return (
        <div style={styles.container}>
            <AnimationStyles />

            {/* TOP HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <span style={{ fontSize: 13, color: colors.textSecondary, fontWeight: 600 }}>Current Location</span>
                    <div style={styles.locationPill}>
                        <MdLocationOn color={colors.primary} size={20} />
                        <span style={styles.locationText}>{location?.name}</span>
                        <div onClick={() => { if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(pos => resolveLocation(pos.coords.latitude, pos.coords.longitude)); } }} style={styles.iconCircle}><MdGpsFixed size={14} color={colors.surface} /></div>
                    </div>
                </div>
            </div>

            {/* MAIN GRID */}
            <div style={styles.mainGrid}>

                {/* LEFT COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                    {/* Top Row Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                        {/* Main Weather Card */}
                        <div style={{
                            ...styles.mainWeatherCard,
                            background: getBgGradient(current.type),
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <WeatherGraphics type={current.type} />

                            <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', height: '100%' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <current.cond.icon size={50} color={colors.surface} style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.2))' }} />
                                        <span style={{ fontSize: 80, fontWeight: 700, color: colors.surface, marginLeft: 16, lineHeight: 1 }}>{current.temp}°</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                                    <span style={{ fontSize: 20, fontWeight: 600, color: colors.surface }}>{current.date}</span>
                                    <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{current.time}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 12, backgroundColor: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: 20 }}>
                                        <current.cond.icon size={16} color={colors.surface} />
                                        <span style={{ marginLeft: 6, color: colors.surface, fontWeight: 600 }}>{current.cond.text}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Add City Card */}
                        <div
                            onClick={() => setIsModalVisible(true)}
                            style={styles.addCityCard}
                        >
                            <span style={{ fontSize: 40, color: colors.primaryLight, marginBottom: 8 }}>+</span>
                            <span style={{ fontSize: 16, fontWeight: 600, color: colors.primaryDark }}>Add City</span>
                        </div>
                    </div>

                    {/* Today's Highlights */}
                    <div>
                        <h3 style={styles.sectionTitle}>Today's Highlights</h3>
                        <div style={styles.highlightsGrid}>
                            <Card style={styles.highlightItem}>
                                <span style={styles.hLabel}>Precipitation</span>
                                <span style={styles.hValue}>{current.precip}%</span>
                            </Card>
                            <Card style={styles.highlightItem}>
                                <span style={styles.hLabel}>Humidity</span>
                                <span style={styles.hValue}>{current.humidity}%</span>
                            </Card>
                            <Card style={styles.highlightItem}>
                                <span style={styles.hLabel}>Wind</span>
                                <span style={styles.hValue}>{current.wind} <span style={{ fontSize: 14 }}>km/h</span></span>
                            </Card>
                            <Card style={styles.highlightItem}>
                                <span style={styles.hLabel}>UV Index & AQI</span>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <span style={{ ...styles.hValue, color: colors.sunny }}>UV {current.uv}</span>
                                    <span style={{ ...styles.hValue, color: colors.primary }}>AQI {current.aqi}</span>
                                </div>
                            </Card>
                            <Card style={{ ...styles.highlightItem, gridColumn: 'span 2' }}>
                                <span style={styles.hLabel}>Sunrise & Sunset</span>
                                <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginTop: 8 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ backgroundColor: '#FFF4E5', padding: 8, borderRadius: '50%' }}><WiSunrise size={24} color="#F59E0B" /></div>
                                        <span style={{ fontSize: 18, fontWeight: 700 }}>{current.sunrise}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ backgroundColor: '#E0E7FF', padding: 8, borderRadius: '50%' }}><WiSunset size={24} color={colors.primary} /></div>
                                        <span style={{ fontSize: 18, fontWeight: 700 }}>{current.sunset}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Hourly Curve */}
                    <Card style={{ padding: '32px 24px', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                            <span style={{ fontWeight: 600, color: colors.textPrimary }}>Today</span>
                            <span style={{ color: colors.textSecondary }}>Next 24h</span>
                        </div>

                        <div className="custom-scrollbar" style={{ display: 'flex', overflowX: 'auto', gap: 40, paddingBottom: 16 }}>
                            {hourlyChart.map((h: any, i: number) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 50 }}>
                                    <span style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{h.temp}°</span>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: colors.primaryLight, marginBottom: 8 }} />
                                    <span style={{ fontSize: 13, color: colors.textSecondary }}>{h.time}</span>
                                </div>
                            ))}
                        </div>
                        {/* Fake SVG Curve underlying the dots for visual flair */}
                        <svg width="100%" height="40" style={{ position: 'absolute', top: 75, left: 0, zIndex: 0, opacity: 0.2 }} preserveAspectRatio="none">
                            <path d="M0,20 Q100,40 200,20 T400,20 T600,20 T800,20" stroke={colors.primary} strokeWidth="2" fill="none" />
                        </svg>
                    </Card>

                    {/* 3 Months Forecast */}
                    <div>
                        <h3 style={styles.sectionTitle}>3 Months Outlook</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                            {outlook.map((o: any, i: number) => (
                                <Card key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: `4px solid ${o.color}` }}>
                                    <span style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{o.month}</span>
                                    <span style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 12, textAlign: 'center' }}>{o.desc}</span>
                                    <o.icon size={32} color={o.color} />
                                    <span style={{ marginTop: 12, fontSize: 20, fontWeight: 700 }}>{o.avg}</span>
                                </Card>
                            ))}
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                    {/* Chance of rain */}
                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
                            <span style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary }}>Chance of Rain</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {chanceOfRain.map((c: any, i: number) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ width: 60, fontSize: 13, fontWeight: 600, color: colors.textSecondary }}>{c.time}</span>
                                    <div style={{ flex: 1, backgroundColor: colors.background, height: 8, borderRadius: 4, margin: '0 16px', overflow: 'hidden' }}>
                                        <div style={{ width: `${c.prob}%`, height: '100%', backgroundColor: c.prob > 50 ? colors.primaryDark : colors.primaryLight, borderRadius: 4 }} />
                                    </div>
                                    <span style={{ width: 40, textAlign: 'right', fontSize: 13, fontWeight: 700 }}>{c.prob}%</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* 3 Days Forecast */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary, marginLeft: 4 }}>3 Days Forecast</span>

                        {multiDay.map((d: any, i: number) => (
                            <Card key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', backgroundColor: d.weatherType === 'rainy' ? '#EBF0FE' : colors.surface }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '40%' }}>
                                    <d.cond.icon size={32} color={d.cond.color} />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 700, color: colors.textPrimary }}>{d.day.split(' ')[0]}</span>
                                        <span style={{ fontSize: 12, color: colors.textSecondary }}>{d.cond.text}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', backgroundColor: colors.background, padding: '8px 16px', borderRadius: 12 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}><MdArrowUpward size={14} color={colors.textSecondary} /> {d.high}°</span>
                                    <span style={{ display: 'flex', alignItems: 'center', color: colors.textSecondary }}><MdArrowDownward size={14} /> {d.low}°</span>
                                </div>
                            </Card>
                        ))}
                    </div>

                </div>
            </div>

            {/* MODAL */}
            {isModalVisible && (
                <div style={styles.modalOverlay} onClick={() => setIsModalVisible(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <h3 style={{ margin: 0 }}>Search City</h3>
                            <button onClick={() => setIsModalVisible(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><MdClose size={24} /></button>
                        </div>
                        <div style={{ display: 'flex', border: `1px solid ${colors.border}`, borderRadius: 12, padding: '10px 16px', gap: 10 }}>
                            <MdSearch size={20} color={colors.textSecondary} />
                            <input
                                style={{ border: 'none', outline: 'none', width: '100%', fontSize: 16 }}
                                placeholder="E.g. Los Angeles"
                                value={cityInput}
                                onChange={async (e) => {
                                    setCityInput(e.target.value);
                                    searchApi(e.target.value);
                                }}
                            />
                        </div>
                        <div style={{ marginTop: 16, maxHeight: 300, overflowY: 'auto' }}>
                            {suggestions.map((s, i) => (
                                <div key={i}
                                    style={{ padding: '12px 0', borderBottom: `1px solid ${colors.border}`, cursor: 'pointer', fontWeight: 500 }}
                                    onClick={() => {
                                        setIsModalVisible(false);
                                        setCityInput('');
                                        setSuggestions([]);
                                        setLocation({ name: `${s.name}, ${s.admin1 || s.country}`, latitude: s.latitude, longitude: s.longitude });
                                        fetchWeatherData(s.latitude, s.longitude);
                                    }}
                                >
                                    {s.name}, {s.country}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherScreen;

// --- STYLES ---
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        backgroundColor: colors.background,
        minHeight: '100vh',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        padding: '32px 48px',
        boxSizing: 'border-box',
    },
    center: {
        display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: colors.background
    },
    mainGrid: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '32px',
        maxWidth: 1400,
        margin: '0 auto',
    },
    locationPill: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '8px 16px',
        gap: 8,
        marginTop: 6
    },
    locationText: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.textPrimary,
        letterSpacing: '-0.5px'
    },
    iconCircle: {
        backgroundColor: colors.primaryLight,
        borderRadius: '50%',
        width: 28, height: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        marginLeft: 12
    },
    mainWeatherCard: {
        borderRadius: 32,
        padding: 40,
        height: 280,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden',
    },
    addCityCard: {
        borderRadius: 32,
        backgroundColor: colors.surface,
        border: `2px dashed ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        height: 280,
    },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 16, marginTop: 12 },
    highlightsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 20
    },
    highlightItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '20px 24px',
    },
    hLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 },
    hValue: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, marginTop: 'auto' },

    // Modal
    modalOverlay: {
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    },
    modal: {
        backgroundColor: 'white', padding: 32, borderRadius: 24, width: 450,
        boxShadow: '0 20px 50px rgba(0,0,0,0.15)'
    },
};
