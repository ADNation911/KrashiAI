import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { useLanguage } from "../context/LanguageContext";
import { useRecommendation } from "../context/RecommendationContext";
import {
  createImagePreview,
  revokeImagePreview,
  scanSoilHealthCard,
  type SoilHealthData,
} from "../services/soilHealthCardScanner";
import { colors } from "../theme/colors";

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

const FormCard: React.FC<FormCardProps> = ({
  title,
  icon,
  iconColor,
  children,
}) => (
  <div
    style={{
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      border: `1px solid ${colors.border}`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: iconColor,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Icon name={icon} size={22} color={colors.white} />
      </div>
      <span
        style={{ fontSize: 18, fontWeight: "600", color: colors.textPrimary }}
      >
        {title}
      </span>
    </div>
    <div>{children}</div>
  </div>
);

const InputRow: React.FC<InputRowProps> = ({ icon, label, children }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
      <Icon
        name={icon}
        size={20}
        color={colors.textSecondary}
        style={{ marginRight: 8 }}
      />
      <span
        style={{ fontSize: 14, fontWeight: "500", color: colors.textSecondary }}
      >
        {label}
      </span>
    </div>
    <div>{children}</div>
  </div>
);

/* ──────────────────────────────────────────────
   Scan Result Preview Card
   ────────────────────────────────────────────── */
const ScanResultCard: React.FC<{
  data: SoilHealthData;
  previewUrl: string;
  onApply: () => void;
  onDismiss: () => void;
}> = ({ data, previewUrl, onApply, onDismiss }) => {
  const fields = [
    { label: "pH", value: data.pH, unit: "" },
    { label: "Nitrogen (N)", value: data.nitrogen, unit: " kg/ha" },
    { label: "Phosphorus (P)", value: data.phosphorus, unit: " kg/ha" },
    { label: "Potassium (K)", value: data.potassium, unit: " kg/ha" },
    { label: "Sulfur (S)", value: data.sulfur, unit: " ppm" },
    { label: "Zinc (Zn)", value: data.zinc, unit: " ppm" },
    { label: "Organic Carbon", value: data.organicCarbon, unit: "%" },
    { label: "EC", value: data.ec, unit: " dS/m" },
    { label: "Iron (Fe)", value: data.iron, unit: " ppm" },
    { label: "Manganese (Mn)", value: data.manganese, unit: " ppm" },
    { label: "Copper (Cu)", value: data.copper, unit: " ppm" },
    { label: "Boron (B)", value: data.boron, unit: " ppm" },
  ].filter((f) => f.value !== null && f.value !== undefined);

  return (
    <div
      style={{
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        boxShadow: "0 4px 16px rgba(18, 97, 68, 0.15)",
        border: `2px solid ${colors.primary}`,
        animation: "fadeIn 0.4s ease-out",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.success,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
          }}
        >
          <Icon name="check-circle" size={22} color={colors.white} />
        </div>
        <div>
          <span
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: colors.textPrimary,
              display: "block",
            }}
          >
            Soil Health Card Scanned
          </span>
          <span style={{ fontSize: 12, color: colors.textSecondary }}>
            Confidence: {data.confidence}% • {fields.length} parameters detected
          </span>
        </div>
      </div>

      {/* Image preview + extracted data side by side on desktop */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {/* Image thumbnail */}
        <div
          style={{
            width: 120,
            height: 90,
            borderRadius: 8,
            overflow: "hidden",
            border: `1px solid ${colors.border}`,
            flexShrink: 0,
          }}
        >
          <img
            src={previewUrl}
            alt="Scanned card"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Extracted values grid */}
        <div
          style={{
            flex: 1,
            minWidth: 200,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: 6,
          }}
        >
          {fields.map((field) => (
            <div
              key={field.label}
              style={{
                backgroundColor: "#E8F5E9",
                borderRadius: 8,
                padding: "4px 8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: colors.textSecondary,
                  fontWeight: 500,
                }}
              >
                {field.label}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: colors.primaryDark,
                }}
              >
                {field.value}
                {field.unit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Soil type */}
      {data.soilType && (
        <div
          style={{ marginTop: 8, fontSize: 13, color: colors.textSecondary }}
        >
          <strong>Soil Type:</strong> {data.soilType}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button
          id="apply-scan-results-btn"
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.primary,
            color: colors.white,
            padding: "10px 16px",
            borderRadius: 10,
            border: "none",
            fontSize: 14,
            fontWeight: "600",
            cursor: "pointer",
            transition: "transform 0.15s ease",
          }}
          onClick={onApply}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Icon name="check" size={18} color={colors.white} />
          <span style={{ marginLeft: 6 }}>Apply to Form</span>
        </button>
        <button
          id="dismiss-scan-results-btn"
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: `1px solid ${colors.border}`,
            backgroundColor: "transparent",
            fontSize: 14,
            fontWeight: "500",
            color: colors.textSecondary,
            cursor: "pointer",
          }}
          onClick={onDismiss}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────
   Scanning Overlay / Loading Animation
   ────────────────────────────────────────────── */
const ScanningOverlay: React.FC<{ previewUrl: string | null }> = ({
  previewUrl,
}) => (
  <div
    style={{
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      border: `1px solid ${colors.border}`,
      textAlign: "center",
    }}
  >
    {previewUrl && (
      <div
        style={{
          width: "100%",
          maxHeight: 160,
          borderRadius: 10,
          overflow: "hidden",
          marginBottom: 12,
          position: "relative",
        }}
      >
        <img
          src={previewUrl}
          alt="Scanning..."
          style={{
            width: "100%",
            height: 160,
            objectFit: "cover",
            filter: "brightness(0.7)",
          }}
        />
        {/* Scanning line animation */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="scan-pulse"
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: "rgba(22, 167, 73, 0.3)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon name="document-scanner" size={28} color={colors.white} />
          </div>
        </div>
      </div>
    )}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <div
        className="scanning-spinner"
        style={{
          width: 20,
          height: 20,
          border: `3px solid ${colors.border}`,
          borderTopColor: colors.primary,
          borderRadius: "50%",
        }}
      />
      <span style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}>
        Scanning Soil Health Card with AI...
      </span>
    </div>
    <span
      style={{
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 4,
        display: "block",
      }}
    >
      Extracting soil parameters using Gemini Vision
    </span>

    {/* Inline CSS animations */}
    <style>{`
      @keyframes spinScan { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      .scanning-spinner { animation: spinScan 0.8s linear infinite; }
      @keyframes pulse { 0%,100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.3); opacity: 1; } }
      .scan-pulse { animation: pulse 1.5s ease-in-out infinite; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `}</style>
  </div>
);

/* ══════════════════════════════════════════════
   MAIN FORM COMPONENT
   ══════════════════════════════════════════════ */
const DataEntryForm: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { setData } = useRecommendation();

  const [formData, setFormData] = useState({
    soilColor: "",
    pH: 6.0,
    nitrogen: 50,
    phosphorus: 30,
    potassium: 40,
    sulfur: 25,
    zinc: 15,
    season: "",
    humidity: 65,
    temperature: 25,
    rainfall: 100,
    windSpeed: 10,
    groundwater: "",
    cloudCoverage: 50,
    surfacePressure: 1013,
    landSize: "",
  });

  // ── Soil health card scanning state ──
  const [scanningCard, setScanningCard] = useState(false);
  const [scannedPreview, setScannedPreview] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<SoilHealthData | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const [pickerModal, setPickerModal] = useState<{
    visible: boolean;
    field: keyof typeof formData | null;
    items: PickerItem[];
    title: string;
  }>({ visible: false, field: null, items: [], title: "" });

  const [location, setLocation] = useState<{
    coords: { latitude: number; longitude: number };
  } | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");

  // ── Submission state ──
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);

  const handleInputChange = useCallback(
    (field: keyof typeof formData, value: string | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  // ── Cleanup preview URL on unmount ──
  useEffect(() => {
    return () => {
      if (scannedPreview) revokeImagePreview(scannedPreview);
    };
  }, [scannedPreview]);

  /* ─────────────────────────────────────────
     SOIL HEALTH CARD SCANNING
     ───────────────────────────────────────── */
  const handleScanSoilCard = useCallback(
    async (file: File) => {
      // Clean up previous preview
      if (scannedPreview) revokeImagePreview(scannedPreview);

      // Show preview and loading state
      const previewUrl = createImagePreview(file);
      setScannedPreview(previewUrl);
      setScanningCard(true);
      setScanResult(null);
      setScanError(null);

      // Run Gemini vision scan
      const result = await scanSoilHealthCard(file);

      setScanningCard(false);

      if (result.success && result.data) {
        setScanResult(result.data);
      } else {
        setScanError(result.error || "Failed to scan the soil health card.");
      }
    },
    [scannedPreview],
  );

  // Upload file handler — triggers OCR scan
  const handleUploadFile = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleScanSoilCard(file);
    };
    input.click();
  }, [handleScanSoilCard]);

  // Camera handler — triggers OCR scan
  // On mobile: uses camera capture. On desktop: opens file picker for images.
  const handleOpenCamera = useCallback(async () => {
    // Try native camera via getUserMedia on desktop
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      // Mobile: use capture attribute
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.capture = "environment";
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) handleScanSoilCard(file);
      };
      input.click();
    } else {
      // Desktop: try webcam via getUserMedia, fallback to file picker
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        // Create a video element to capture a frame
        const video = document.createElement("video");
        video.srcObject = stream;
        video.setAttribute("playsinline", "true");
        await video.play();

        // Wait a moment for the camera to initialize
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Capture frame to canvas
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0);

        // Stop camera stream
        stream.getTracks().forEach((t) => t.stop());

        // Convert canvas to file
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "camera-capture.jpg", {
                type: "image/jpeg",
              });
              handleScanSoilCard(file);
            }
          },
          "image/jpeg",
          0.9,
        );
      } catch {
        // Webcam not available — fallback to file picker
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) handleScanSoilCard(file);
        };
        input.click();
      }
    }
  }, [handleScanSoilCard]);

  // Apply extracted data to the form
  const applyScanResultToForm = useCallback(() => {
    if (!scanResult) return;

    setFormData((prev) => ({
      ...prev,
      pH: scanResult.pH ?? prev.pH,
      nitrogen: scanResult.nitrogen ?? prev.nitrogen,
      phosphorus: scanResult.phosphorus ?? prev.phosphorus,
      potassium: scanResult.potassium ?? prev.potassium,
      sulfur: scanResult.sulfur ?? prev.sulfur,
      zinc: scanResult.zinc ?? prev.zinc,
    }));

    // Clear scan state after applying
    setScanResult(null);
    setScanError(null);
  }, [scanResult]);

  // Dismiss scan result
  const dismissScanResult = useCallback(() => {
    setScanResult(null);
    setScanError(null);
    if (scannedPreview) {
      revokeImagePreview(scannedPreview);
      setScannedPreview(null);
    }
  }, [scannedPreview]);

  /* ─────────────────────────────────────────
     LOCATION & WEATHER
     ───────────────────────────────────────── */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation(position),
        () => alert("Permission to access location was denied"),
      );
    }
  }, []);

  const fetchWeatherData = useCallback(async () => {
    if (!location) {
      alert("Location not available. Please enable location services.");
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
      handleInputChange("humidity", dummyWeatherData.humidity);
      handleInputChange("temperature", dummyWeatherData.temperature);
      handleInputChange("rainfall", dummyWeatherData.rainfall);
      handleInputChange("windSpeed", dummyWeatherData.windSpeed);
      handleInputChange("cloudCoverage", dummyWeatherData.cloudCoverage);
      handleInputChange("surfacePressure", dummyWeatherData.surfacePressure);
      setIsWeatherLoading(false);
    }, 1500);
  }, [location, handleInputChange]);

  /* ─────────────────────────────────────────
     VOICE INPUT
     ───────────────────────────────────────── */
  const onSpeechResults = (event: any) => {
    const text = event.results[0][0].transcript;
    setRecognizedText(text);
    parseVoiceCommand(text.toLowerCase());
  };

  const startListening = async () => {
    setIsListening(true);
    setRecognizedText("");
    try {
      const recognition =
        new (window as any).webkitSpeechRecognition() ||
        (window as any).SpeechRecognition();
      recognition.lang = t.pageTitle === "Enter Farm Data" ? "en-US" : "te-IN";
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
        [key: string]: { field: keyof typeof formData; type: "number" };
      } = {
        nitrogen: { field: "nitrogen", type: "number" },
        phosphorus: { field: "phosphorus", type: "number" },
        potassium: { field: "potassium", type: "number" },
        sulfur: { field: "sulfur", type: "number" },
        zinc: { field: "zinc", type: "number" },
        ph: { field: "pH", type: "number" },
        "p.h.": { field: "pH", type: "number" },
        humidity: { field: "humidity", type: "number" },
        temperature: { field: "temperature", type: "number" },
        rainfall: { field: "rainfall", type: "number" },
        "wind speed": { field: "windSpeed", type: "number" },
        "land size": { field: "landSize", type: "number" },
      };
      for (const keyword in keywords) {
        if (command.includes(keyword)) {
          const { field } = keywords[keyword];
          const match = command.match(
            new RegExp(`${keyword}[^\\d]*(\\d*\\.?\\d+)`),
          );
          if (match && match[1]) {
            handleInputChange(field, parseFloat(match[1]));
          }
        }
      }
    },
    [handleInputChange],
  );

  /* ─────────────────────────────────────────
     SUBMIT → CROP RECOMMENDATION
     ───────────────────────────────────────── */
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitResult(null);

    const payload = {
      N: formData.nitrogen,
      P: formData.phosphorus,
      K: formData.potassium,
      temperature: formData.temperature,
      humidity: formData.humidity,
      ph: formData.pH,
      rainfall: formData.rainfall,
      season: formData.season || "monsoon",
      water_source: formData.groundwater || "Groundwater",
      district: "Ranchi",
      land_size: formData.landSize || "10",
    };

    console.log("Submitting form data to crop recommendation model:", payload);

    try {
      const res = await fetch("http://localhost:8081/api/crop-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || data?.success === false) {
        throw new Error(
          data?.error || "Could not fetch crop recommendations right now.",
        );
      }

      setData({ formData, recommendations: data });
      navigate("/CropRecommendations");
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitResult({
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Could not reach the recommendation server. Please make sure the API server is running (node server.js in agrismart-server folder).",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─────────────────────────────────────────
     PICKERS
     ───────────────────────────────────────── */
  const openPicker = (
    field: keyof typeof formData,
    items: PickerItem[],
    title: string,
  ) => {
    setPickerModal({ visible: true, field, items, title });
  };

  const handlePickerSelect = (value: string) => {
    if (pickerModal.field) handleInputChange(pickerModal.field, value);
    setPickerModal({ visible: false, field: null, items: [], title: "" });
  };

  const soilColorItems: PickerItem[] = [
    { label: t.soilColorAlluvial || "Alluvial", value: "alluvial" },
    { label: t.soilColorBlack || "Black", value: "black" },
    { label: t.soilColorRed || "Red", value: "red" },
  ];
  const seasonItems: PickerItem[] = [
    { label: t.seasonMonsoon || "Monsoon", value: "monsoon" },
    { label: t.seasonSummer || "Summer", value: "summer" },
    { label: t.seasonWinter || "Winter", value: "winter" },
  ];
  const groundwaterItems: PickerItem[] = [
    { label: t.groundwaterHigh || "High", value: "high" },
    { label: t.groundwaterMedium || "Medium", value: "medium" },
    { label: t.groundwaterLow || "Low", value: "low" },
  ];

  /* ─────────────────────────────────────────
     SLIDER RENDERER
     ───────────────────────────────────────── */
  const renderStyledSlider = (
    icon: string,
    label: string,
    field: keyof typeof formData,
    unit: string,
    min: number,
    max: number,
    step: number,
    toFixed: number = 0,
  ) => {
    const value = formData[field] as number;
    return (
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Icon
              name={icon}
              size={20}
              color={colors.textSecondary}
              style={{ marginRight: 8 }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: colors.textSecondary,
              }}
            >
              {label}
            </span>
          </div>
          <div
            style={{
              backgroundColor: colors.secondaryLight,
              padding: "2px 8px",
              borderRadius: 6,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: "500",
                color: colors.textPrimary,
              }}
            >
              {value.toFixed(toFixed)}
              {unit}
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
          style={{ width: "100%", height: 40 }}
        />
      </div>
    );
  };

  /* ══════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════ */
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: colors.background,
        minHeight: "100vh",
        padding: "0 16px",
      }}
    >
      <div style={{ flex: 1, paddingBottom: 60 }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 16,
            marginBottom: 16,
          }}
        >
          <div style={{ flex: 1, marginRight: 8 }}>
            <span
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: colors.textPrimary,
              }}
            >
              {t.pageTitle}
            </span>
            <span
              style={{
                fontSize: 14,
                color: colors.textSecondary,
                marginTop: 4,
                display: "block",
              }}
            >
              {t.pageSubtitle}
            </span>
          </div>
          <div style={{ display: "flex" }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: colors.primary,
                padding: 8,
                borderRadius: 8,
                border: "none",
                color: colors.white,
              }}
              onClick={startListening}
            >
              <Icon name="mic" size={16} color={colors.white} />
              <span style={{ marginLeft: 4 }}>{t.voice}</span>
            </button>
          </div>
        </div>

        {/* ── SOIL HEALTH CARD UPLOAD SECTION ── */}
        <div
          style={{
            backgroundColor: "#E8F5E9",
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            border: `1px dashed ${colors.primary}`,
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
          >
            <Icon name="document-scanner" size={22} color={colors.primary} />
            <span
              style={{
                marginLeft: 8,
                fontSize: 16,
                fontWeight: "700",
                color: colors.primaryDark,
              }}
            >
              Scan Soil Health Card
            </span>
          </div>
          <span
            style={{
              fontSize: 13,
              color: colors.textSecondary,
              display: "block",
              marginBottom: 12,
            }}
          >
            Upload or capture your Soil Health Card (मृदा स्वास्थ्य कार्ड) image
            to auto-fill soil parameters using AI
          </span>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <button
              id="upload-soil-card-btn"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 16px",
                borderRadius: 12,
                backgroundColor: colors.white,
                border: `1px solid ${colors.primary}`,
                flex: 1,
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onClick={handleUploadFile}
              disabled={scanningCard}
            >
              <Icon name="upload-file" size={20} color={colors.primary} />
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.primary,
                }}
              >
                {t.upload || "Upload Card"}
              </span>
            </button>
            <button
              id="capture-soil-card-btn"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 16px",
                borderRadius: 12,
                backgroundColor: colors.primary,
                border: "none",
                flex: 1,
                cursor: "pointer",
                transition: "transform 0.15s",
              }}
              onClick={handleOpenCamera}
              disabled={scanningCard}
            >
              <Icon name="camera-alt" size={20} color={colors.white} />
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.white,
                }}
              >
                Camera
              </span>
            </button>
          </div>
        </div>

        {/* ── SCANNING ANIMATION ── */}
        {scanningCard && <ScanningOverlay previewUrl={scannedPreview} />}

        {/* ── SCAN ERROR ── */}
        {scanError && (
          <div
            style={{
              backgroundColor: "#FFF3E0",
              borderRadius: 12,
              padding: 12,
              marginBottom: 16,
              border: "1px solid #FFB74D",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Icon name="warning" size={20} color="#E65100" />
            <span style={{ fontSize: 13, color: "#E65100", flex: 1 }}>
              {scanError}
            </span>
            <button
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "#E65100",
                fontWeight: 600,
              }}
              onClick={dismissScanResult}
            >
              ✕
            </button>
          </div>
        )}

        {/* ── SCAN RESULT CARD ── */}
        {scanResult && scannedPreview && (
          <ScanResultCard
            data={scanResult}
            previewUrl={scannedPreview}
            onApply={applyScanResultToForm}
            onDismiss={dismissScanResult}
          />
        )}

        {/* SOIL PROPERTIES FORM */}
        <FormCard
          title={t.soilProperties}
          icon="science"
          iconColor={colors.secondaryDark}
        >
          <InputRow icon="palette" label={t.soilColor}>
            <button
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                padding: 8,
                backgroundColor: "transparent",
                width: "100%",
              }}
              onClick={() =>
                openPicker("soilColor", soilColorItems, t.selectSoilColor)
              }
            >
              <span
                style={
                  formData.soilColor
                    ? { color: colors.textPrimary }
                    : { color: colors.textLight }
                }
              >
                {formData.soilColor
                  ? soilColorItems.find((i) => i.value === formData.soilColor)
                      ?.label
                  : t.selectSoilColor}
              </span>
              <Icon
                name="arrow-drop-down"
                size={24}
                color={colors.textSecondary}
              />
            </button>
          </InputRow>
          {renderStyledSlider("science", t.phLevel, "pH", "", 1, 14, 0.1, 1)}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 12, color: colors.textSecondary }}>
              {t.acidic} (1)
            </span>
            <span style={{ fontSize: 12, color: colors.textSecondary }}>
              {t.neutral} (7)
            </span>
            <span style={{ fontSize: 12, color: colors.textSecondary }}>
              {t.alkaline} (14)
            </span>
          </div>
          {renderStyledSlider(
            "grass",
            t.nitrogen,
            "nitrogen",
            " kg/ha",
            0,
            750,
            5,
          )}
          {renderStyledSlider(
            "spa",
            t.phosphorus,
            "phosphorus",
            " kg/ha",
            0,
            50,
            1,
          )}
          {renderStyledSlider(
            "local-florist",
            t.potassium,
            "potassium",
            " kg/ha",
            0,
            500,
            5,
          )}
          {renderStyledSlider("compost", t.sulfur, "sulfur", " ppm", 0, 50, 1)}
          {renderStyledSlider("healing", t.zinc, "zinc", " ppm", 0, 10, 0.1, 1)}
        </FormCard>

        {/* WEATHER INFO */}
        <FormCard title={t.weatherInfo} icon="cloud" iconColor={colors.info}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 12,
              border: "none",
              backgroundColor: "transparent",
            }}
            onClick={fetchWeatherData}
            disabled={isWeatherLoading}
          >
            {isWeatherLoading ? (
              <div style={{ color: colors.primary, fontSize: 16 }}>
                Loading...
              </div>
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                padding: 8,
                backgroundColor: "transparent",
                width: "100%",
              }}
              onClick={() =>
                openPicker("season", seasonItems, t.selectCurrentSeason)
              }
            >
              <span
                style={
                  formData.season
                    ? { color: colors.textPrimary }
                    : { color: colors.textLight }
                }
              >
                {formData.season
                  ? seasonItems.find((i) => i.value === formData.season)?.label
                  : t.selectCurrentSeason}
              </span>
              <Icon
                name="arrow-drop-down"
                size={24}
                color={colors.textSecondary}
              />
            </button>
          </InputRow>
          {renderStyledSlider(
            "water-drop",
            t.humidity,
            "humidity",
            "%",
            0,
            100,
            1,
          )}
          {renderStyledSlider(
            "thermostat",
            t.temperature,
            "temperature",
            "°C",
            -10,
            50,
            1,
          )}
          {renderStyledSlider(
            "grain",
            t.rainfall,
            "rainfall",
            "mm",
            0,
            2000,
            10,
          )}
        </FormCard>

        {/* CLIMATE DATA */}
        <FormCard
          title={t.climateData}
          icon="public"
          iconColor={colors.primaryDark}
        >
          {renderStyledSlider(
            "air",
            t.windSpeed,
            "windSpeed",
            " km/h",
            0,
            100,
            1,
          )}
          {renderStyledSlider(
            "filter-drama",
            t.cloudCoverage,
            "cloudCoverage",
            "%",
            0,
            100,
            1,
          )}
          {renderStyledSlider(
            "speed",
            t.surfacePressure,
            "surfacePressure",
            " hPa",
            900,
            1100,
            1,
          )}
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
              onChange={(e) => handleInputChange("landSize", e.target.value)}
              type="number"
              style={{
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                padding: 8,
                fontSize: 14,
                color: colors.textPrimary,
                width: "100%",
              }}
            />
          </InputRow>
          <InputRow icon="layers" label={t.groundwaterLevel}>
            <button
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                padding: 8,
                backgroundColor: "transparent",
                width: "100%",
              }}
              onClick={() =>
                openPicker("groundwater", groundwaterItems, t.selectGroundwater)
              }
            >
              <span
                style={
                  formData.groundwater
                    ? { color: colors.textPrimary }
                    : { color: colors.textLight }
                }
              >
                {formData.groundwater
                  ? groundwaterItems.find(
                      (i) => i.value === formData.groundwater,
                    )?.label
                  : t.selectGroundwater}
              </span>
              <Icon
                name="arrow-drop-down"
                size={24}
                color={colors.textSecondary}
              />
            </button>
          </InputRow>
        </FormCard>

        {/* SUBMIT BUTTON */}
        <button
          id="submit-farm-data-btn"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: isSubmitting
              ? colors.textSecondary
              : `linear-gradient(135deg, ${colors.gradientStart}, ${colors.gradientEnd})`,
            padding: 14,
            borderRadius: 12,
            border: "none",
            marginTop: 16,
            marginBottom: 16,
            width: "100%",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
            boxShadow: "0 4px 12px rgba(18, 97, 68, 0.3)",
          }}
          onClick={handleSubmit}
          disabled={isSubmitting}
          onMouseOver={(e) => {
            if (!isSubmitting)
              e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {isSubmitting ? (
            <>
              <div
                style={{
                  width: 18,
                  height: 18,
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTopColor: colors.white,
                  borderRadius: "50%",
                  animation: "spinScan 0.8s linear infinite",
                }}
              />
              <span
                style={{
                  color: colors.white,
                  fontSize: 16,
                  fontWeight: "600",
                  marginLeft: 8,
                }}
              >
                Getting Recommendations...
              </span>
            </>
          ) : (
            <>
              <Icon name="send" size={20} color={colors.white} />
              <span
                style={{
                  color: colors.white,
                  fontSize: 16,
                  fontWeight: "600",
                  marginLeft: 8,
                }}
              >
                {t.submit || "Get Crop Recommendations"}
              </span>
            </>
          )}
        </button>

        {/* ══════ RECOMMENDATION RESULTS ══════ */}
        {submitResult && (
          <div
            id="recommendation-results"
            style={{ marginBottom: 24, animation: "fadeIn 0.4s ease-out" }}
          >
            {submitResult.success === false ? (
              /* Error state */
              <div
                style={{
                  backgroundColor: "#FFF3E0",
                  borderRadius: 16,
                  padding: 16,
                  border: "1px solid #FFB74D",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Icon name="error-outline" size={24} color="#E65100" />
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#E65100",
                    }}
                  >
                    Server Unavailable
                  </span>
                </div>
                <span style={{ fontSize: 13, color: "#BF360C" }}>
                  {submitResult.error}
                </span>
              </div>
            ) : submitResult.recommendations &&
              submitResult.recommendations.length > 0 ? (
              /* Success — show recommendations */
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      background: `linear-gradient(135deg, ${colors.gradientStart}, ${colors.gradientEnd})`,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12,
                    }}
                  >
                    <Icon name="eco" size={24} color={colors.white} />
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: colors.textPrimary,
                        display: "block",
                      }}
                    >
                      Crop Recommendations
                    </span>
                    <span style={{ fontSize: 12, color: colors.textSecondary }}>
                      Top {submitResult.recommendations.length} crops for your
                      conditions
                      {submitResult.calculated_rainfall &&
                        ` • Rainfall: ${submitResult.calculated_rainfall}mm`}
                    </span>
                  </div>
                </div>

                {submitResult.recommendations.map((rec: any, idx: number) => {
                  const scoreColor =
                    rec.score >= 70
                      ? colors.success
                      : rec.score >= 50
                        ? "#F59E0B"
                        : colors.error;
                  const medals = ["🥇", "🥈", "🥉"];
                  return (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: colors.white,
                        borderRadius: 14,
                        padding: 14,
                        marginBottom: 10,
                        boxShadow:
                          idx === 0
                            ? "0 4px 16px rgba(18, 97, 68, 0.15)"
                            : "0 2px 6px rgba(0,0,0,0.06)",
                        border:
                          idx === 0
                            ? `2px solid ${colors.primary}`
                            : `1px solid ${colors.border}`,
                        transition: "transform 0.15s ease",
                      }}
                    >
                      {/* Crop header */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span style={{ fontSize: 22, marginRight: 8 }}>
                            {medals[idx] || "🌱"}
                          </span>
                          <div>
                            <span
                              style={{
                                fontSize: 16,
                                fontWeight: "700",
                                color: colors.textPrimary,
                                display: "block",
                              }}
                            >
                              {rec.crop}
                            </span>
                            <span
                              style={{
                                fontSize: 12,
                                color: colors.textSecondary,
                              }}
                            >
                              Season: {rec.season}
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            backgroundColor: scoreColor + "18",
                            borderRadius: 20,
                            padding: "4px 12px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: "800",
                              color: scoreColor,
                            }}
                          >
                            {rec.score}%
                          </span>
                        </div>
                      </div>

                      {/* Score bar */}
                      <div
                        style={{
                          width: "100%",
                          height: 6,
                          backgroundColor: "#E5E7EB",
                          borderRadius: 3,
                          marginBottom: 8,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${rec.score}%`,
                            height: "100%",
                            backgroundColor: scoreColor,
                            borderRadius: 3,
                            transition: "width 0.6s ease",
                          }}
                        />
                      </div>

                      {/* Details grid */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 6,
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#F0FDF4",
                            borderRadius: 8,
                            padding: "6px 10px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 10,
                              color: colors.textSecondary,
                              display: "block",
                            }}
                          >
                            Fertilizer
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: "600",
                              color: colors.primaryDark,
                            }}
                          >
                            {rec.fertilizer}
                          </span>
                        </div>
                        <div
                          style={{
                            backgroundColor:
                              rec.rainfall_status === "Sufficient"
                                ? "#F0FDF4"
                                : "#FFF7ED",
                            borderRadius: 8,
                            padding: "6px 10px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 10,
                              color: colors.textSecondary,
                              display: "block",
                            }}
                          >
                            Rainfall
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: "600",
                              color:
                                rec.rainfall_status === "Sufficient"
                                  ? colors.success
                                  : "#D97706",
                            }}
                          >
                            {rec.rainfall_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* No results */
              <div
                style={{
                  backgroundColor: "#FFF8E1",
                  borderRadius: 16,
                  padding: 16,
                  border: "1px solid #FFD54F",
                  textAlign: "center",
                }}
              >
                <Icon name="info-outline" size={32} color="#F9A825" />
                <span
                  style={{
                    fontSize: 14,
                    color: "#F57F17",
                    marginTop: 8,
                    display: "block",
                  }}
                >
                  No matching crops found for current conditions. Try adjusting
                  soil or weather parameters.
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* PICKER MODAL */}
      {pickerModal.visible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "flex-end",
            zIndex: 1000,
          }}
          onClick={() => setPickerModal({ ...pickerModal, visible: false })}
        >
          <div
            style={{
              backgroundColor: colors.white,
              padding: 16,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              width: "100%",
              maxWidth: 400,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 12,
                display: "block",
              }}
            >
              {pickerModal.title}
            </span>
            {pickerModal.items.map((item) => (
              <button
                key={item.value}
                style={{
                  paddingTop: 12,
                  paddingBottom: 12,
                  border: "none",
                  backgroundColor: "transparent",
                  width: "100%",
                  textAlign: "left",
                }}
                onClick={() => handlePickerSelect(item.value)}
              >
                <span style={{ fontSize: 14, color: colors.textPrimary }}>
                  {item.label}
                </span>
              </button>
            ))}
            <button
              style={{
                paddingTop: 12,
                paddingBottom: 12,
                border: "none",
                backgroundColor: "transparent",
                width: "100%",
                textAlign: "center",
              }}
              onClick={() => setPickerModal({ ...pickerModal, visible: false })}
            >
              <span
                style={{
                  fontSize: 14,
                  color: colors.primary,
                  fontWeight: "600",
                }}
              >
                {t.cancel}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* VOICE MODAL */}
      {isListening && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: colors.white,
              padding: 24,
              borderRadius: 16,
              textAlign: "center",
              width: "80%",
              maxWidth: 300,
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 12,
                display: "block",
              }}
            >
              {t.listening}
            </span>
            <Icon name="mic" size={48} color={colors.primary} />
            <span
              style={{
                fontSize: 14,
                fontStyle: "italic",
                marginTop: 12,
                marginBottom: 12,
                display: "block",
              }}
            >
              {recognizedText || "..."}
            </span>
            <span
              style={{
                fontSize: 12,
                color: colors.textSecondary,
                textAlign: "center",
                marginBottom: 12,
                display: "block",
              }}
            >
              {t.voiceInstructions}
            </span>
            <button
              style={{
                backgroundColor: colors.primary,
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                color: colors.white,
                fontWeight: "600",
              }}
              onClick={stopListening}
            >
              Stop
            </button>
          </div>
        </div>
      )}

      {/* Global animations */}
      <style>{`
        @keyframes spinScan { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default DataEntryForm;
