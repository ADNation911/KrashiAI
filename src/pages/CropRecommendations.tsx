import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { useLanguage } from "../context/LanguageContext";
import { useRecommendation } from "../context/RecommendationContext";
import { getCropData, getCropImage } from "./cropDataMapping";
import { colors } from "../theme/colors";

interface RecommendationItem {
  crop: string;
  score: number;
  fertilizer?: string;
  rainfall_status?: string;
  season?: string;
}

interface RecommendationResponse {
  success?: boolean;
  recommendations?: RecommendationItem[];
  calculated_rainfall?: number | string;
  source?: string;
}

const pageCopy = {
  en: {
    submitFirst:
      "Submit your farm data first to view crop suggestions on this page.",
    resultIntro: "Ranked crop results based on your submitted soil and weather data.",
    topRecommendations: "Top recommendations",
    source: "Source",
    season: "Season",
    landSize: "Land Size",
    temperature: "Temperature",
    humidity: "Humidity",
    rainfall: "Rainfall",
    fitScore: "Fit Score",
    fertilizer: "Fertilizer",
    rainfallStatus: "Rainfall Status",
    reasons: "Why this crop",
    soilMatch: "Soil Match",
    weatherFit: "Weather Fit",
    duration: "Duration",
    waterNeed: "Water Need",
    expectedYield: "Yield / Acre",
    notAvailable: "Not available",
    bestMatch: "Best Match",
    acres: "acres",
  },
  hi: {
    submitFirst:
      "इस पेज पर फसल सुझाव देखने के लिए पहले अपना फार्म डेटा जमा करें।",
    resultIntro: "आपकी मिट्टी और मौसम के आधार पर रैंक की गई फसल सिफारिशें।",
    topRecommendations: "शीर्ष सिफारिशें",
    source: "स्रोत",
    season: "मौसम",
    landSize: "भूमि का आकार",
    temperature: "तापमान",
    humidity: "आर्द्रता",
    rainfall: "वर्षा",
    fitScore: "उपयुक्तता स्कोर",
    fertilizer: "उर्वरक",
    rainfallStatus: "वर्षा स्थिति",
    reasons: "यह फसल क्यों",
    soilMatch: "मिट्टी अनुकूलता",
    weatherFit: "मौसम अनुकूलता",
    duration: "अवधि",
    waterNeed: "पानी की जरूरत",
    expectedYield: "उपज / एकड़",
    notAvailable: "उपलब्ध नहीं",
    bestMatch: "सबसे बेहतर मेल",
    acres: "एकड़",
  },
  te: {
    submitFirst:
      "ఈ పేజీలో పంట సూచనలు చూడాలంటే ముందుగా మీ ఫారం డేటాను సమర్పించండి.",
    resultIntro: "మీ నేల మరియు వాతావరణ డేటా ఆధారంగా ర్యాంక్ చేసిన పంట సూచనలు.",
    topRecommendations: "అగ్ర సూచనలు",
    source: "మూలం",
    season: "సీజన్",
    landSize: "భూమి పరిమాణం",
    temperature: "ఉష్ణోగ్రత",
    humidity: "ఆర్ద్రత",
    rainfall: "వర్షపాతం",
    fitScore: "అనుకూలత స్కోరు",
    fertilizer: "ఎరువు",
    rainfallStatus: "వర్ష స్థితి",
    reasons: "ఈ పంట ఎందుకు",
    soilMatch: "నేల అనుకూలత",
    weatherFit: "వాతావరణ అనుకూలత",
    duration: "వ్యవధి",
    waterNeed: "నీటి అవసరం",
    expectedYield: "ఉత్పత్తి / ఎకరం",
    notAvailable: "అందుబాటులో లేదు",
    bestMatch: "అత్యుత్తమ ఎంపిక",
    acres: "ఎకరాలు",
  },
} as const;

const getScoreColor = (score: number) => {
  if (score >= 80) return colors.cropHigh;
  if (score >= 60) return colors.cropMedium;
  return colors.cropLow;
};

const formatLabel = (value?: string) => {
  if (!value) return "";
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const CropRecommendations: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { data } = useRecommendation();
  const copy = pageCopy[language];

  const recommendationData = (data?.recommendations ||
    {}) as RecommendationResponse;
  const recommendations = Array.isArray(recommendationData.recommendations)
    ? recommendationData.recommendations
    : [];
  const formData = data?.formData;

  if (!formData || recommendations.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.emptyState}>
            <div style={styles.emptyBadge}>
              <Icon name="eco" size={34} color={colors.primary} />
            </div>
            <h1 style={styles.emptyTitle}>
              {t.cropSuggestionsTitle || "Crop Suggestions"}
            </h1>
            <p style={styles.emptyText}>{copy.submitFirst}</p>
            <button
              type="button"
              onClick={() => navigate("/DataEntryForm")}
              style={styles.primaryButton}
            >
              <Icon name="arrow-forward" size={18} color={colors.white} />
              <span style={styles.primaryButtonText}>
                {t.enterData || "Enter Data"}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const summaryItems = [
    { label: copy.season, value: formatLabel(formData.season) || copy.notAvailable },
    {
      label: copy.landSize,
      value: `${formData.landSize || "0"} ${copy.acres}`,
    },
    {
      label: copy.temperature,
      value: `${formData.temperature ?? "-"} C`,
    },
    { label: copy.humidity, value: `${formData.humidity ?? "-"}%` },
    {
      label: copy.rainfall,
      value: `${recommendationData.calculated_rainfall ?? formData.rainfall ?? "-"} mm`,
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.heroCard}>
          <div style={styles.heroTop}>
            <div style={styles.heroIconWrap}>
              <Icon name="eco" size={28} color={colors.white} />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={styles.title}>
                {t.cropSuggestionsTitle || "Crop Recommendations"}
              </h1>
              <p style={styles.subtitle}>
                {t.cropSuggestionsSubtitle ||
                  "AI-powered suggestions based on your farm data"}
              </p>
              <p style={styles.intro}>{copy.resultIntro}</p>
            </div>
            <div style={styles.heroMeta}>
              <span style={styles.metaBadge}>
                {copy.topRecommendations}: {recommendations.length}
              </span>
              <span style={styles.metaText}>
                {copy.source}:{" "}
                {formatLabel(recommendationData.source || "recommendation engine")}
              </span>
            </div>
          </div>

          <div style={styles.summaryGrid}>
            {summaryItems.map((item) => (
              <div key={item.label} style={styles.summaryCard}>
                <span style={styles.summaryLabel}>{item.label}</span>
                <span style={styles.summaryValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.cardsList}>
          {recommendations.map((rec, index) => {
            const cropData = getCropData(rec.crop);
            const scoreColor = getScoreColor(rec.score || 0);
            const displayName =
              language === "hi" && cropData?.hiName ? cropData.hiName : cropData?.name || rec.crop;
            const description =
              language === "hi" && cropData?.hiDescription
                ? cropData.hiDescription
                : cropData?.description || "";
            const reasons =
              language === "hi" && cropData?.hiReasons?.length
                ? cropData.hiReasons
                : cropData?.reasons || [];

            return (
              <div
                key={`${rec.crop}-${index}`}
                style={{
                  ...styles.resultCard,
                  ...(index === 0 ? styles.resultCardTop : {}),
                }}
              >
                <div style={styles.cardMediaWrap}>
                  <img
                    src={getCropImage(rec.crop)}
                    alt={displayName}
                    style={styles.cardImage}
                  />
                  <div style={styles.imageOverlay}>
                    <span style={styles.rankBadge}>#{index + 1}</span>
                    {index === 0 && (
                      <span style={styles.bestBadge}>{copy.bestMatch}</span>
                    )}
                  </div>
                </div>

                <div style={styles.cardContent}>
                  <div style={styles.cardHeader}>
                    <div style={{ flex: 1 }}>
                      <h2 style={styles.cropName}>{displayName}</h2>
                      <p style={styles.cropDescription}>
                        {description || formatLabel(rec.crop)}
                      </p>
                    </div>
                    <div
                      style={{
                        ...styles.scoreBadge,
                        backgroundColor: `${scoreColor}18`,
                      }}
                    >
                      <span style={styles.scoreLabel}>{copy.fitScore}</span>
                      <span style={{ ...styles.scoreValue, color: scoreColor }}>
                        {rec.score}%
                      </span>
                    </div>
                  </div>

                  <div style={styles.progressTrack}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${Math.max(0, Math.min(rec.score || 0, 100))}%`,
                        backgroundColor: scoreColor,
                      }}
                    />
                  </div>

                  <div style={styles.statGrid}>
                    <div style={styles.statCard}>
                      <span style={styles.statLabel}>{copy.soilMatch}</span>
                      <span style={styles.statValue}>
                        {cropData?.soilMatch ?? rec.score}%
                      </span>
                    </div>
                    <div style={styles.statCard}>
                      <span style={styles.statLabel}>{copy.weatherFit}</span>
                      <span style={styles.statValue}>
                        {cropData?.weatherSuitability ?? rec.score}%
                      </span>
                    </div>
                    <div style={styles.statCard}>
                      <span style={styles.statLabel}>{copy.duration}</span>
                      <span style={styles.statValue}>
                        {cropData?.duration || copy.notAvailable}
                      </span>
                    </div>
                    <div style={styles.statCard}>
                      <span style={styles.statLabel}>{copy.waterNeed}</span>
                      <span style={styles.statValue}>
                        {cropData?.waterRequirement || copy.notAvailable}
                      </span>
                    </div>
                    <div style={styles.statCard}>
                      <span style={styles.statLabel}>{copy.expectedYield}</span>
                      <span style={styles.statValue}>
                        {cropData?.yieldPerAcre
                          ? `${cropData.yieldPerAcre}`
                          : copy.notAvailable}
                      </span>
                    </div>
                    <div style={styles.statCard}>
                      <span style={styles.statLabel}>{copy.season}</span>
                      <span style={styles.statValue}>
                        {formatLabel(rec.season || formData.season) || copy.notAvailable}
                      </span>
                    </div>
                  </div>

                  {reasons.length > 0 && (
                    <div style={styles.reasonBlock}>
                      <div style={styles.reasonTitleRow}>
                        <Icon name="check-circle" size={18} color={colors.success} />
                        <span style={styles.reasonTitle}>{copy.reasons}</span>
                      </div>
                      <div style={styles.reasonList}>
                        {reasons.slice(0, 3).map((reason) => (
                          <span key={reason} style={styles.reasonPill}>
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={styles.footerGrid}>
                    <div style={styles.footerCard}>
                      <div style={styles.footerLabelRow}>
                        <Icon name="science" size={18} color={colors.primaryDark} />
                        <span style={styles.footerLabel}>{copy.fertilizer}</span>
                      </div>
                      <p style={styles.footerValue}>
                        {rec.fertilizer || copy.notAvailable}
                      </p>
                    </div>
                    <div
                      style={{
                        ...styles.footerCard,
                        backgroundColor:
                          rec.rainfall_status === "Sufficient"
                            ? "#F0FDF4"
                            : "#FFF7ED",
                      }}
                    >
                      <div style={styles.footerLabelRow}>
                        <Icon
                          name="water-drop"
                          size={18}
                          color={
                            rec.rainfall_status === "Sufficient"
                              ? colors.success
                              : colors.secondaryDark
                          }
                        />
                        <span style={styles.footerLabel}>{copy.rainfallStatus}</span>
                      </div>
                      <p
                        style={{
                          ...styles.footerValue,
                          color:
                            rec.rainfall_status === "Sufficient"
                              ? colors.success
                              : colors.secondaryDark,
                        }}
                      >
                        {rec.rainfall_status || copy.notAvailable}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CropRecommendations;

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, rgba(18,97,68,0.1) 0%, rgba(255,255,255,1) 24%)",
  },
  container: {
    width: "100%",
    maxWidth: 1180,
    margin: "0 auto",
    padding: "24px 16px 40px",
    boxSizing: "border-box",
  },
  heroCard: {
    backgroundColor: colors.white,
    borderRadius: 26,
    border: `1px solid ${colors.border}`,
    boxShadow: "0 18px 38px rgba(15, 23, 42, 0.08)",
    padding: 24,
    marginBottom: 22,
  },
  heroTop: {
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 18,
  },
  heroIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 18,
    background: `linear-gradient(135deg, ${colors.gradientStart}, ${colors.gradientEnd})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: 30,
    fontWeight: 800,
    color: colors.textPrimary,
  },
  subtitle: {
    margin: "6px 0 0",
    fontSize: 15,
    color: colors.textSecondary,
  },
  intro: {
    margin: "10px 0 0",
    fontSize: 14,
    lineHeight: 1.6,
    color: colors.textSecondary,
    maxWidth: 680,
  },
  heroMeta: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "flex-end",
    minWidth: 180,
  },
  metaBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "9px 14px",
    borderRadius: 999,
    backgroundColor: `${colors.primary}12`,
    color: colors.primaryDark,
    fontWeight: 700,
    fontSize: 13,
  },
  metaText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "right",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 12,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: "#F8FAFC",
    border: `1px solid ${colors.border}`,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.textSecondary,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.textPrimary,
  },
  cardsList: {
    display: "grid",
    gap: 18,
  },
  resultCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    border: `1px solid ${colors.border}`,
    boxShadow: "0 16px 32px rgba(15, 23, 42, 0.06)",
    overflow: "hidden",
    display: "flex",
    flexWrap: "wrap",
  },
  resultCardTop: {
    border: `2px solid ${colors.primary}`,
    boxShadow: "0 18px 36px rgba(18, 97, 68, 0.14)",
  },
  cardMediaWrap: {
    position: "relative",
    minHeight: 100,
    backgroundColor: "#ECFDF5",
    flex: "0 0 280px",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  imageOverlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 14,
    background:
      "linear-gradient(180deg, rgba(15,23,42,0.12) 0%, rgba(15,23,42,0.35) 100%)",
  },
  rankBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 42,
    height: 32,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.92)",
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: 800,
    padding: "0 10px",
  },
  bestBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: 32,
    borderRadius: 999,
    backgroundColor: colors.secondary,
    color: colors.white,
    fontSize: 12,
    fontWeight: 800,
    padding: "0 12px",
  },
  cardContent: {
    padding: 22,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    minWidth: 0,
    flex: "1 1 320px",
  },
  cardHeader: {
    display: "flex",
    gap: 14,
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  cropName: {
    margin: 0,
    fontSize: 27,
    fontWeight: 800,
    color: colors.textPrimary,
  },
  cropDescription: {
    margin: "8px 0 0",
    fontSize: 14,
    lineHeight: 1.65,
    color: colors.textSecondary,
    maxWidth: 700,
  },
  scoreBadge: {
    minWidth: 112,
    borderRadius: 18,
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 4,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.textSecondary,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 800,
    lineHeight: 1,
  },
  progressTrack: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: 10,
  },
  statCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    border: `1px solid ${colors.border}`,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.textSecondary,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 15,
    fontWeight: 700,
    color: colors.textPrimary,
  },
  reasonBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  reasonTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  reasonTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.textPrimary,
  },
  reasonList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  reasonPill: {
    padding: "8px 12px",
    borderRadius: 999,
    backgroundColor: `${colors.primary}10`,
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.4,
  },
  footerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },
  footerCard: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: "#F8FAFC",
    border: `1px solid ${colors.border}`,
  },
  footerLabelRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  footerLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  footerValue: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.55,
    fontWeight: 600,
    color: colors.textPrimary,
  },
  emptyState: {
    maxWidth: 720,
    margin: "36px auto 0",
    backgroundColor: colors.white,
    borderRadius: 28,
    border: `1px solid ${colors.border}`,
    boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08)",
    padding: "56px 28px",
    textAlign: "center",
  },
  emptyBadge: {
    width: 76,
    height: 76,
    borderRadius: 24,
    margin: "0 auto 20px",
    backgroundColor: `${colors.primary}12`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
    color: colors.textPrimary,
  },
  emptyText: {
    margin: "12px auto 26px",
    maxWidth: 520,
    fontSize: 15,
    lineHeight: 1.7,
    color: colors.textSecondary,
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 18px",
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    background: `linear-gradient(135deg, ${colors.gradientStart}, ${colors.gradientEnd})`,
    boxShadow: "0 12px 24px rgba(18, 97, 68, 0.24)",
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: 700,
  },
};
