import React, { useCallback, useEffect, useState } from 'react';
import Icon from '../components/Icon';
import { useLanguage } from '../context/LanguageContext';
import { colors } from '../theme/colors';

interface FormCardProps {
  title: string;
  icon: string;
  iconColor: string;
  children: React.ReactNode;
}
interface InputRowProps {
  icon: string;
  label: string;
  children: React.ReactNode;
}
type PickerItem = { label: string; value: string };

// pick file from storage
const handleUploadFile = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      alert(`File Selected: ${file.name}`);
    }
  };
  input.click();
};

// open camera
const handleOpenCamera = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.capture = 'environment';
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      alert('Photo Captured: Image selected successfully');
    }
  };
  input.click();
};

const FormCard: React.FC<FormCardProps> = ({ title, icon, iconColor, children }) => (
  <div style={{
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: `1px solid ${colors.border}`
  }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: iconColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
      }}>
        <Icon name={icon} size={22} color={colors.white} />
      </div>
      <span style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary }}>{title}</span>
    </div>
    <div>{children}</div>
  </div>
);

const InputRow: React.FC<InputRowProps> = ({ icon, label, children }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
      <Icon name={icon} size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
      <span style={{ fontSize: 14, fontWeight: '500', color: colors.textSecondary }}>{label}</span>
    </div>
    <div>{children}</div>
  </div>
);

const DataEntryForm: React.FC = () => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    soilColor: '',
    pH: 6.0,
    nitrogen: 50,
    phosphorus: 30,
    potassium: 40,
    sulfur: 25,
    zinc: 15,
    season: '',
    humidity: 65,
    temperature: 25,
    rainfall: 100,
    windSpeed: 10,
    groundwater: '',
    cloudCoverage: 50,
    surfacePressure: 1013,
    landSize: '',
  });

  const [pickerModal, setPickerModal] = useState<{
    visible: boolean;
    field: keyof typeof formData | null;
    items: PickerItem[];
    title: string;
  }>({ visible: false, field: null, items: [], title: '' });

  const [location, setLocation] = useState<{ coords: { latitude: number; longitude: number } } | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  const handleInputChange = useCallback(
    (field: keyof typeof formData, value: string | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation(position),
        (error) => alert('Permission to access location was denied')
      );
    }
  }, []);

  const fetchWeatherData = useCallback(async () => {
    if (!location) {
      alert('Location not available. Please enable location services.');
      return;
    }
    setIsWeatherLoading(true);

    setTimeout(() => {
      const dummyWeatherData = {
        humidity: 78,
        temperature: 31,
        rainfall: 250,
        windSpeed: 15,
        cloudCoverage: 60,
        surfacePressure: 1008,
      };
      handleInputChange('humidity', dummyWeatherData.humidity);
      handleInputChange('temperature', dummyWeatherData.temperature);
      handleInputChange('rainfall', dummyWeatherData.rainfall);
      handleInputChange('windSpeed', dummyWeatherData.windSpeed);
      handleInputChange('cloudCoverage', dummyWeatherData.cloudCoverage);
      handleInputChange('surfacePressure', dummyWeatherData.surfacePressure);
      setIsWeatherLoading(false);
    }, 1500);
  }, [location, handleInputChange]);

  const onSpeechResults = (event: any) => {
    const text = event.results[0][0].transcript;
    setRecognizedText(text);
    parseVoiceCommand(text.toLowerCase());
  };

  const startListening = async () => {
    setIsListening(true);
    setRecognizedText('');
    try {
      const recognition = new (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition();
      recognition.lang = t.pageTitle === 'Enter Farm Data' ? 'en-US' : 'te-IN';
      recognition.onresult = onSpeechResults;
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    setIsListening(false);
  };

  const parseVoiceCommand = useCallback(
    (command: string) => {
      const keywords: {
        [key: string]: { field: keyof typeof formData; type: 'number' };
      } = {
        nitrogen: { field: 'nitrogen', type: 'number' },
        phosphorus: { field: 'phosphorus', type: 'number' },
        potassium: { field: 'potassium', type: 'number' },
        sulfur: { field: 'sulfur', type: 'number' },
        zinc: { field: 'zinc', type: 'number' },
        ph: { field: 'pH', type: 'number' },
        'p.h.': { field: 'pH', type: 'number' },
        humidity: { field: 'humidity', type: 'number' },
        temperature: { field: 'temperature', type: 'number' },
        rainfall: { field: 'rainfall', type: 'number' },
        'wind speed': { field: 'windSpeed', type: 'number' },
        'land size': { field: 'landSize', type: 'number' },
      };
      for (const keyword in keywords) {
        if (command.includes(keyword)) {
          const { field } = keywords[keyword];
          const match = command.match(
            new RegExp(`${keyword}[^\\d]*(\\d*\\.?\\d+)`)
          );
          if (match && match[1]) {
            handleInputChange(field, parseFloat(match[1]));
          }
        }
      }
    },
    [handleInputChange]
  );

  const handleSubmit = () => {
    console.log('Form Submitted:', formData);

    fetch('https://your-backend.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        alert('Data submitted! All form data sent to backend.');
      })
      .catch((err) => {
        console.error(err);
        alert('Error: Failed to submit data.');
      });
  };

  const openPicker = (
    field: keyof typeof formData,
    items: PickerItem[],
    title: string
  ) => {
    setPickerModal({ visible: true, field, items, title });
  };

  const handlePickerSelect = (value: string) => {
    if (pickerModal.field) handleInputChange(pickerModal.field, value);
    setPickerModal({ visible: false, field: null, items: [], title: '' });
  };

  const soilColorItems: PickerItem[] = [
    { label: t.soilColorAlluvial || 'Alluvial', value: 'alluvial' },
    { label: t.soilColorBlack || 'Black', value: 'black' },
    { label: t.soilColorRed || 'Red', value: 'red' },
  ];
  const seasonItems: PickerItem[] = [
    { label: t.seasonMonsoon || 'Monsoon', value: 'monsoon' },
    { label: t.seasonSummer || 'Summer', value: 'summer' },
    { label: t.seasonWinter || 'Winter', value: 'winter' },
  ];
  const groundwaterItems: PickerItem[] = [
    { label: t.groundwaterHigh || 'High', value: 'high' },
    { label: t.groundwaterMedium || 'Medium', value: 'medium' },
    { label: t.groundwaterLow || 'Low', value: 'low' },
  ];

  const renderStyledSlider = (
    icon: string,
    label: string,
    field: keyof typeof formData,
    unit: string,
    min: number,
    max: number,
    step: number,
    toFixed: number = 0
  ) => {
    const value = formData[field] as number;
    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon name={icon} size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <span style={{ fontSize: 14, fontWeight: '500', color: colors.textSecondary }}>{label}</span>
          </div>
          <div style={{ backgroundColor: colors.secondaryLight, padding: '2px 8px', borderRadius: 6 }}>
            <span style={{ fontSize: 12, fontWeight: '500', color: colors.textPrimary }}>
              {value.toFixed(toFixed)}{unit}
            </span>
          </div>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => handleInputChange(field, parseFloat(e.target.value))}
          style={{ width: '100%', height: 40 }}
        />
      </div>
    );
  };

  return (
    <div style={{ flex: 1, backgroundColor: colors.background, minHeight: '100vh', padding: '0 16px' }}>
      <div style={{ flex: 1, paddingBottom: 60 }}>
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 16, marginBottom: 16 }}>
          <div style={{ flex: 1, marginRight: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 'bold', color: colors.textPrimary }}>{t.pageTitle}</span>
            <span style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4, display: 'block' }}>{t.pageSubtitle}</span>
          </div>
          <div style={{ display: 'flex' }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: colors.primary,
                padding: 8,
                borderRadius: 8,
                border: 'none',
                color: colors.white
              }}
              onClick={startListening}
            >
              <Icon name="mic" size={16} color={colors.white} />
              <span style={{ marginLeft: 4 }}>{t.voice}</span>
            </button>
          </div>
        </div>

        {/* Upload + Camera quick buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 16px',
            borderRadius: 12,
            backgroundColor: '#E9F5E9',
            border: 'none',
            flex: 1,
            marginRight: 10
          }} onClick={handleUploadFile}>
            <Icon name="upload-file" size={20} color={colors.primary} />
            <span style={{ marginLeft: 8, fontSize: 14, fontWeight: '600', color: colors.primary }}>{t.upload}</span>
          </button>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 16px',
            borderRadius: 12,
            backgroundColor: colors.primary,
            border: 'none',
            flex: 1
          }} onClick={handleOpenCamera}>
            <Icon name="camera-alt" size={20} color={colors.white} />
            <span style={{ marginLeft: 8, fontSize: 14, fontWeight: '600', color: colors.white }}>Camera</span>
          </button>
        </div>

        {/* SOIL PROPERTIES FORM */}
        <FormCard
          title={t.soilProperties}
          icon="science"
          iconColor={colors.secondaryDark}
        >
          <InputRow icon="palette" label={t.soilColor}>
            <button
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                padding: 8,
                backgroundColor: 'transparent',
                width: '100%'
              }}
              onClick={() =>
                openPicker('soilColor', soilColorItems, t.selectSoilColor)
              }
            >
              <span style={formData.soilColor ? { color: colors.textPrimary } : { color: colors.textLight }}>
                {formData.soilColor
                  ? soilColorItems.find((i) => i.value === formData.soilColor)?.label
                  : t.selectSoilColor}
              </span>
              <Icon name="arrow-drop-down" size={24} color={colors.textSecondary} />
            </button>
          </InputRow>
          {renderStyledSlider('science', t.phLevel, 'pH', '', 1, 14, 0.1, 1)}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: colors.textSecondary }}>{t.acidic} (1)</span>
            <span style={{ fontSize: 12, color: colors.textSecondary }}>{t.neutral} (7)</span>
            <span style={{ fontSize: 12, color: colors.textSecondary }}>{t.alkaline} (14)</span>
          </div>
          {renderStyledSlider('grass', t.nitrogen, 'nitrogen', ' kg/ha', 0, 750, 5)}
          {renderStyledSlider('spa', t.phosphorus, 'phosphorus', ' kg/ha', 0, 50, 1)}
          {renderStyledSlider('local-florist', t.potassium, 'potassium', ' kg/ha', 0, 500, 5)}
          {renderStyledSlider('compost', t.sulfur, 'sulfur', ' ppm', 0, 50, 1)}
          {renderStyledSlider('healing', t.zinc, 'zinc', ' ppm', 0, 10, 0.1, 1)}
        </FormCard>

        {/* WEATHER INFO */}
        <FormCard title={t.weatherInfo} icon="cloud" iconColor={colors.info}>
          <button
            style={{ display: 'flex', alignItems: 'center', marginBottom: 12, border: 'none', backgroundColor: 'transparent' }}
            onClick={fetchWeatherData}
            disabled={isWeatherLoading}
          >
            {isWeatherLoading ? (
              <div style={{ color: colors.primary, fontSize: 16 }}>Loading...</div>
            ) : (
              <Icon name="sync" size={20} color={colors.primary} />
            )}
            <span style={{ color: colors.primary, marginLeft: 4 }}>
              {isWeatherLoading ? t.fetchingWeather : t.fetchWeather}
            </span>
          </button>
          <InputRow icon="calendar-today" label={t.currentSeason}>
            <button
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                padding: 8,
                backgroundColor: 'transparent',
                width: '100%'
              }}
              onClick={() =>
                openPicker('season', seasonItems, t.selectCurrentSeason)
              }
            >
              <span style={formData.season ? { color: colors.textPrimary } : { color: colors.textLight }}>
                {formData.season
                  ? seasonItems.find((i) => i.value === formData.season)?.label
                  : t.selectCurrentSeason}
              </span>
              <Icon name="arrow-drop-down" size={24} color={colors.textSecondary} />
            </button>
          </InputRow>
          {renderStyledSlider('water-drop', t.humidity, 'humidity', '%', 0, 100, 1)}
          {renderStyledSlider('thermostat', t.temperature, 'temperature', '°C', -10, 50, 1)}
          {renderStyledSlider('grain', t.rainfall, 'rainfall', 'mm', 0, 2000, 10)}
        </FormCard>

        {/* CLIMATE DATA */}
        <FormCard
          title={t.climateData}
          icon="public"
          iconColor={colors.primaryDark}
        >
          {renderStyledSlider('air', t.windSpeed, 'windSpeed', ' km/h', 0, 100, 1)}
          {renderStyledSlider('filter-drama', t.cloudCoverage, 'cloudCoverage', '%', 0, 100, 1)}
          {renderStyledSlider('speed', t.surfacePressure, 'surfacePressure', ' hPa', 900, 1100, 1)}
        </FormCard>

        {/* FARM DETAILS */}
        <FormCard
          title={t.farmDetails}
          icon="agriculture"
          iconColor={colors.primary}
        >
          <InputRow icon="square-foot" label={t.landSize}>
            <input
              placeholder={t.enterLandSize}
              value={String(formData.landSize)}
              onChange={(e) => handleInputChange('landSize', e.target.value)}
              type="number"
              style={{
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                padding: 8,
                fontSize: 14,
                color: colors.textPrimary,
                width: '100%'
              }}
            />
          </InputRow>
          <InputRow icon="layers" label={t.groundwaterLevel}>
            <button
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                padding: 8,
                backgroundColor: 'transparent',
                width: '100%'
              }}
              onClick={() =>
                openPicker('groundwater', groundwaterItems, t.selectGroundwater)
              }
            >
              <span style={formData.groundwater ? { color: colors.textPrimary } : { color: colors.textLight }}>
                {formData.groundwater
                  ? groundwaterItems.find((i) => i.value === formData.groundwater)?.label
                  : t.selectGroundwater}
              </span>
              <Icon name="arrow-drop-down" size={24} color={colors.textSecondary} />
            </button>
          </InputRow>
        </FormCard>

        <button style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.primary,
          padding: 12,
          borderRadius: 12,
          border: 'none',
          marginTop: 16,
          marginBottom: 16,
          width: '100%'
        }} onClick={handleSubmit}>
          <Icon name="send" size={20} color={colors.white} />
          <span style={{ color: colors.white, fontSize: 16, fontWeight: '600', marginLeft: 8 }}>{t.submit}</span>
        </button>
      </div>

      {/* PICKER MODAL */}
      {pickerModal.visible && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          display: 'flex',
          justifyContent: 'flex-end',
          zIndex: 1000
        }} onClick={() => setPickerModal({ ...pickerModal, visible: false })}>
          <div style={{
            backgroundColor: colors.white,
            padding: 16,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            width: '100%',
            maxWidth: 400
          }} onClick={(e) => e.stopPropagation()}>
            <span style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, display: 'block' }}>{pickerModal.title}</span>
            {pickerModal.items.map((item) => (
              <button
                key={item.value}
                style={{ paddingTop: 12, paddingBottom: 12, border: 'none', backgroundColor: 'transparent', width: '100%', textAlign: 'left' }}
                onClick={() => handlePickerSelect(item.value)}
              >
                <span style={{ fontSize: 14, color: colors.textPrimary }}>{item.label}</span>
              </button>
            ))}
            <button
              style={{ paddingTop: 12, paddingBottom: 12, border: 'none', backgroundColor: 'transparent', width: '100%', textAlign: 'center' }}
              onClick={() => setPickerModal({ ...pickerModal, visible: false })}
            >
              <span style={{ fontSize: 14, color: colors.primary, fontWeight: '600' }}>{t.cancel}</span>
            </button>
          </div>
        </div>
      )}

      {/* VOICE MODAL */}
      {isListening && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: colors.white,
            padding: 24,
            borderRadius: 16,
            textAlign: 'center',
            width: '80%',
            maxWidth: 300
          }}>
            <span style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, display: 'block' }}>{t.listening}</span>
            <Icon name="mic" size={48} color={colors.primary} />
            <span style={{ fontSize: 14, fontStyle: 'italic', marginTop: 12, marginBottom: 12, display: 'block' }}>{recognizedText || '...'}</span>
            <span style={{ fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginBottom: 12, display: 'block' }}>
              {t.voiceInstructions}
            </span>
            <button
              style={{
                backgroundColor: colors.primary,
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                color: colors.white,
                fontWeight: '600'
              }}
              onClick={stopListening}
            >
              Stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataEntryForm;


