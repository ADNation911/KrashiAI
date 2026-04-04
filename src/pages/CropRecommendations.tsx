import React, { useEffect, useMemo, useState } from "react";
import {
  MdEco,
  MdCheckCircle,
  MdTrendingUp,
  MdWaterDrop,
  MdTimer,
  MdExplore
} from "react-icons/md";
import { useLanguage } from "../context/LanguageContext"; // Ensure this path is correct in your web project
// If colors are not imported, use the local definition below based on your previous code
const colors = {
  primary: "#2E7D32",
  primaryLight: "#E8F5E9",
  primaryDark: "#1B5E20",
  secondary: "#81C784",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  background: "#FFFFFF",
  surface: "#F3F4F6",
  surfaceHover: "#F9FAFB",
  border: "#E5E7EB",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
  white: "#FFFFFF",
  black: "#000000",
};

// --- TYPES (Unchanged) ---

interface SoilDeficiencyInfo {
  deficiency: string;
  hiDeficiency: string;
  recommendation: string;
  hiRecommendation: string;
  dosage: string;
  notes: string;
  hiNotes: string;
}

interface FertilizerInfo {
  production: {
    name: string;
    hiName: string;
    dosage: string;
    notes: string;
    hiNotes: string;
  };
  diseaseControl: {
    name: string;
    hiName: string;
    dosage: string;
    notes: string;
    hiNotes: string;
  };
  herbicide: {
    name: string;
    hiName: string;
    dosage: string;
    notes: string;
    hiNotes: string;
  };
  soilDeficiency: SoilDeficiencyInfo;
}

interface SustainabilityDetails {
  carbonEmissions: number;
  carbonSequestration: number;
  waterUsage: string;
  soilImpact: string;
  otherImpacts: string;
  hiWaterUsage: string;
  hiSoilImpact: string;
  hiOtherImpacts: string;
}

interface CropData {
  id: number;
  name: string;
  hiName: string;
  match: number;
  image: string;
  description: string;
  hiDescription: string;
  soilMatch: number;
  weatherSuitability: number;
  yieldPotential: "High" | "Medium" | "Low";
  yieldPerAcre: number;
  duration: string;
  durationInDays: number;
  waterRequirement: "High" | "Medium" | "Low";
  reasons: string[];
  hiReasons: string[];
  totalYield: string;
  fertilizerInfo?: FertilizerInfo;
  addressesDeficiency?: "Nitrogen" | "Phosphorus" | "Potassium";
  sustainabilityScore?: number;
  sustainabilityDetails?: SustainabilityDetails;
}

interface FarmData {
  landSize: string;
  soilType?: string;
  climate?: string;
  irrigation?: boolean;
}

type FilterType =
  | "all"
  | "highYield"
  | "lowWater"
  | "shortDuration"
  | "regionalDeficiency";

// --- REUSABLE COMPONENTS ---

const LoadingSpinner: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <span style={styles.loadingText}>{t.analyzingData || "Analyzing Data..."}</span>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const ProgressBar: React.FC<{ value: number; color: string }> = ({
  value,
  color,
}) => (
  <div style={styles.progressBarBackground}>
    <div
      style={{
        ...styles.progressBar,
        width: `${value}%`,
        backgroundColor: color,
      }}
    />
  </div>
);

const BadgeTag: React.FC<{
  value: string;
  type: "high" | "medium" | "low" | "default";
}> = ({ value, type }) => {
  const getBadgeStyle = (badgeType: string) => {
    switch (badgeType) {
      case "high":
        return { ...styles.badge, ...styles.badgeHigh };
      case "medium":
        return { ...styles.badge, ...styles.badgeMedium };
      case "low":
        return { ...styles.badge, ...styles.badgeLow };
      default:
        return { ...styles.badge, ...styles.badgeDefault };
    }
  };
  return (
    <div style={getBadgeStyle(type)}>
      <span style={styles.badgeText}>{value}</span>
    </div>
  );
};

// --- CROP CARD COMPONENT ---

const CropCard: React.FC<{
  crop: CropData;
}> = ({ crop }) => {
  const { language, t } = useLanguage();

  const getYieldType = (potential: string): "high" | "medium" | "low" =>
    potential.toLowerCase() as "high" | "medium" | "low";
  const getWaterType = (requirement: string): "high" | "medium" | "low" =>
    requirement.toLowerCase() as "high" | "medium" | "low";

  const displayYield =
    language === "hi"
      ? crop.yieldPotential === "High"
        ? t.highYield
        : crop.yieldPotential === "Medium"
          ? t.mediumYield
          : t.lowYield
      : crop.yieldPotential;
  const displayWater =
    language === "hi"
      ? crop.waterRequirement === "High"
        ? t.highWater
        : crop.waterRequirement === "Medium"
          ? t.mediumWater
          : t.lowWater
      : crop.waterRequirement;

  return (
    <div style={{ ...styles.cropCard, marginBottom: "20px" }}>
      {/* Header Image */}
      <div style={styles.cropImageContainer}>
        <img
          src={crop.image}
          alt={crop.name}
          style={styles.cropImage}
        />
        <div style={styles.matchBadge}>
          <span style={styles.matchBadgeText}>
            {crop.match}% {t.matchPercentage || "Match"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={styles.cropContent}>
        <h3 style={styles.cropName}>
          {language === "en" ? crop.name : crop.hiName}
        </h3>
        <p style={styles.cropDescription}>
          {language === "en" ? crop.description : crop.hiDescription}
        </p>

        {/* Progress Bars */}
        <div style={styles.progressSection}>
          <div style={styles.progressRow}>
            <span style={styles.progressLabel}>{t.soilMatch || "Soil Match"}</span>
            <span style={styles.progressValue}>{crop.soilMatch}%</span>
          </div>
          <ProgressBar value={crop.soilMatch} color={colors.success} />
          <div style={styles.progressRow}>
            <span style={styles.progressLabel}>{t.weatherSuitability || "Weather"}</span>
            <span style={styles.progressValue}>{crop.weatherSuitability}%</span>
          </div>
          <ProgressBar value={crop.weatherSuitability} color={colors.warning} />
        </div>

        {/* Info Grid */}
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>{t.yieldPotential || "Yield"}</span>
            <BadgeTag
              value={displayYield}
              type={getYieldType(crop.yieldPotential)}
            />
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>{t.duration || "Duration"}</span>
            <BadgeTag value={crop.duration} type="default" />
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>{t.waterRequirement || "Water"}</span>
            <BadgeTag
              value={displayWater}
              type={getWaterType(crop.waterRequirement)}
            />
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>{t.totalYield || "Total Yield"}</span>
            <BadgeTag value={`${crop.totalYield} ${t.tons || "tons"}`} type="default" />
          </div>
        </div>

        {/* Reasons */}
        <div style={styles.reasonsSection}>
          <h4 style={styles.reasonsTitle}>{t.whyThisCrop || "Why this crop?"}</h4>
          {(language === "en" ? crop.reasons : crop.hiReasons).map(
            (reason, i) => (
              <div key={i} style={styles.reasonItem}>
                <MdCheckCircle size={16} color={colors.success} style={{ minWidth: "16px" }} />
                <span style={styles.reasonText}>{reason}</span>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const CropRecommendations: React.FC<{ farmData?: FarmData }> = ({
  farmData = { landSize: "10" },
}) => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [allCrops, setAllCrops] = useState<CropData[]>([]);

  // State for filters
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // State for regional deficiency
  const [regionalDeficiency, setRegionalDeficiency] = useState<string | null>(
    null
  );

  useEffect(() => {
    console.log("Fetching regional deficiency data (simulation)...");
    const deficiencyTimer = setTimeout(() => {
      setRegionalDeficiency("Nitrogen");
    }, 500);
    return () => clearTimeout(deficiencyTimer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const landSize = parseFloat(farmData.landSize) || 1;
      const cropSuggestions: CropData[] = [
        {
          id: 1,
          name: "Wheat",
          hiName: "गेहूँ",
          match: 95,
          image:
            "https://media.istockphoto.com/id/177537480/photo/gold-wheat-field-and-blue-sky.jpg?s=612x612&w=0&k=20&c=CAxLzTeCt4qBn7fifuoOh70ycoHr9w7FyeNVzkde_IM=",
          description:
            "Excellent crop for your soil conditions with high yield potential.",
          hiDescription:
            "आपकी मिट्टी की स्थिति के लिए उच्च उपज क्षमता वाली उत्कृष्ट फसल।",
          soilMatch: 92,
          weatherSuitability: 88,
          yieldPotential: "High",
          yieldPerAcre: 3.5,
          duration: "120 days",
          durationInDays: 120,
          waterRequirement: "Medium",
          reasons: [
            "Perfect pH range (6.5-7.5)",
            "Ideal for loamy soil texture",
            "Good market demand and pricing",
          ],
          hiReasons: [
            "सही पीएच रेंज (6.5-7.5)",
            "दोमट मिट्टी की बनावट के लिए आदर्श",
            "अच्छी बाजार मांग और कीमत",
          ],
          totalYield: (3.5 * landSize).toFixed(1),
          fertilizerInfo: {
            production: {
              name: "Urea & DAP",
              hiName: "यूरिया और डीएपी",
              dosage: "120kg/acre",
              notes:
                "Apply Urea in two split doses during tillering and flowering stages.",
              hiNotes:
                "यूरिया को दो भागों में टिलरिंग और फूल आने की अवस्था में डालें।",
            },
            diseaseControl: {
              name: "Mancozeb",
              hiName: "मैनकोज़ेब",
              dosage: "2.5g/litre water",
              notes: "Spray to prevent rust and blight diseases.",
              hiNotes: "रस्ट और ब्लाइट रोगों से बचाव के लिए स्प्रे करें।",
            },
            herbicide: {
              name: "Clodinafop",
              hiName: "क्लोडीनाफॉप",
              dosage: "60g/acre",
              notes: "Effective against grassy weeds like Phalaris minor.",
              hiNotes:
                "घास वाले खरपतवार जैसे कि फालारिस माइनर के खिलाफ प्रभावी।",
            },
            soilDeficiency: {
              deficiency: "Zinc Deficiency",
              hiDeficiency: "जिंक की कमी",
              recommendation: "Zinc Sulphate",
              hiRecommendation: "जिंक सल्फेट",
              dosage: "10kg/acre",
              notes: "Apply during land preparation to boost enzyme functions.",
              hiNotes:
                "एंजाइम कार्यों को बढ़ावा देने के लिए भूमि की तैयारी के दौरान लागू करें।",
            },
          },
          addressesDeficiency: "Nitrogen",
          sustainabilityScore: 75,
          sustainabilityDetails: {
            carbonEmissions: 450,
            carbonSequestration: 600,
            waterUsage: "Medium (450mm)",
            soilImpact: "Minimal",
            otherImpacts: "Stubble burning can be an issue if not managed.",
            hiWaterUsage: "मध्यम (450मिमी)",
            hiSoilImpact: "न्यूनतम",
            hiOtherImpacts:
              "यदि प्रबंधन न किया जाए तो पराली जलाना एक समस्या हो सकती है।",
          },
        },
        {
          id: 2,
          name: "Corn (Maize)",
          hiName: "मक्का",
          match: 89,
          image:
            "https://thumbs.dreamstime.com/b/corn-field-drone-perspective-aerial-view-cultivated-green-landscape-140491930.jpg",
          description:
            "Highly suitable due to favorable rainfall patterns and soil texture.",
          hiDescription:
            "अनुकूल वर्षा पैटर्न और मिट्टी की बनावट के कारण अत्यधिक उपयुक्त।",
          soilMatch: 85,
          weatherSuitability: 91,
          yieldPotential: "High",
          yieldPerAcre: 4.2,
          duration: "110 days",
          durationInDays: 110,
          waterRequirement: "Medium",
          reasons: [
            "Ideal for high phosphorus levels",
            "Good tolerance for current temperature range",
            "High nutritional value",
          ],
          hiReasons: [
            "उच्च फास्फोरस स्तर के लिए आदर्श",
            "वर्तमान तापमान सीमा के लिए अच्छी सहनशीलता",
            "उच्च पोषणीय मूल्य",
          ],
          totalYield: (4.2 * landSize).toFixed(1),
          fertilizerInfo: {
            production: {
              name: "NPK (12:32:16)",
              hiName: "एनपीके (12:32:16)",
              dosage: "150kg/acre",
              notes: "Apply as a basal dose before sowing for robust growth.",
              hiNotes:
                "मजबूत विकास के लिए बुवाई से पहले आधार खुराक के रूप में डालें।",
            },
            diseaseControl: {
              name: "Carbendazim",
              hiName: "कार्बेन्डाजिम",
              dosage: "1g/litre water",
              notes: "Effective against leaf spot and downy mildew.",
              hiNotes: "पत्ती धब्बा और डाउनी मिल्ड्यू के खिलाफ प्रभावी।",
            },
            herbicide: {
              name: "Atrazine",
              hiName: "एट्राज़िन",
              dosage: "500g/acre",
              notes: "Pre-emergence herbicide for broad-leaf weeds.",
              hiNotes:
                "चौड़ी पत्ती वाले खरपतवारों के लिए प्री-इमरजेंस हर्बिसाइड।",
            },
            soilDeficiency: {
              deficiency: "Magnesium Deficiency",
              hiDeficiency: "मैग्नीशियम की कमी",
              recommendation: "Magnesium Sulphate",
              hiRecommendation: "मैग्नीशियम सल्फेट",
              dosage: "20kg/acre",
              notes:
                "Prevents yellowing of leaves (chlorosis) and improves photosynthesis.",
              hiNotes:
                "पत्तियों के पीलेपन (क्लोरोसिस) को रोकता है और प्रकाश संश्लेषण में सुधार करता है।",
            },
          },
          addressesDeficiency: "Phosphorus",
          sustainabilityScore: 68,
          sustainabilityDetails: {
            carbonEmissions: 600,
            carbonSequestration: 700,
            waterUsage: "Medium (500mm)",
            soilImpact: "Moderate",
            otherImpacts: "Requires significant nitrogen fertilizer.",
            hiWaterUsage: "मध्यम (500मिमी)",
            hiSoilImpact: "मध्यम",
            hiOtherImpacts: "महत्वपूर्ण नाइट्रोजन उर्वरक की आवश्यकता है।",
          },
        },
        {
          id: 3,
          name: "Chickpea",
          hiName: "चना",
          match: 82,
          image: "https://i.ibb.co/9mrBpB2d/chickpea.jpg",
          description:
            "Excellent low-water crop that enriches the soil with nitrogen.",
          hiDescription:
            "कम पानी वाली उत्कृष्ट फसल जो मिट्टी को नाइट्रोजन से समृद्ध करती है।",
          soilMatch: 88,
          weatherSuitability: 80,
          yieldPotential: "Medium",
          yieldPerAcre: 1.5,
          duration: "95 days",
          durationInDays: 95,
          waterRequirement: "Low",
          reasons: [
            "Low water needs, ideal for dry seasons",
            "Fixes atmospheric nitrogen, improving soil fertility",
            "Strong demand in local markets",
          ],
          hiReasons: [
            "कम पानी की जरूरत, शुष्क मौसम के लिए आदर्श",
            "वायुमंडलीय नाइट्रोजन को स्थिर करता है, मिट्टी की उर्वरता में सुधार करता है",
            "स्थानीय बाजारों में मजबूत मांग",
          ],
          totalYield: (1.5 * landSize).toFixed(1),
          fertilizerInfo: {
            production: {
              name: "SSP (Single Super Phosphate)",
              hiName: "एसएसपी (सिंगल सुपर फॉस्फेट)",
              dosage: "80kg/acre",
              notes: "Promotes root development. Less nitrogen needed.",
              hiNotes:
                "जड़ विकास को बढ़ावा देता है। कम नाइट्रोजन की आवश्यकता होती है।",
            },
            diseaseControl: {
              name: "Thiram",
              hiName: "थाइरम",
              dosage: "3g/kg seed",
              notes: "Seed treatment to prevent wilt and root rot.",
              hiNotes: "उकठा और जड़ सड़न से बचाव के लिए बीज उपचार।",
            },
            herbicide: {
              name: "Pendimethalin",
              hiName: "पेंडीमेथालिन",
              dosage: "1L/acre",
              notes: "Apply within 3 days of sowing for weed control.",
              hiNotes:
                "खरपतवार नियंत्रण के लिए बुवाई के 3 दिनों के भीतर प्रयोग करें।",
            },
            soilDeficiency: {
              deficiency: "Sulphur Deficiency",
              hiDeficiency: "सल्फर की कमी",
              recommendation: "Bentonite Sulphur",
              hiRecommendation: "बेंटोनाइट सल्फर",
              dosage: "8kg/acre",
              notes:
                "Essential for protein synthesis and improves oil content in seeds.",
              hiNotes:
                "प्रोटीन संश्लेषण के लिए आवश्यक है और बीजों में तेल की मात्रा में सुधार करता है।",
            },
          },
          addressesDeficiency: "Nitrogen",
          sustainabilityScore: 92,
          sustainabilityDetails: {
            carbonEmissions: 150,
            carbonSequestration: 400,
            waterUsage: "Low (200mm)",
            soilImpact: "Improves Fertility",
            otherImpacts: "Excellent for crop rotation.",
            hiWaterUsage: "कम (200मिमी)",
            hiSoilImpact: "उर्वरता में सुधार करता है",
            hiOtherImpacts: "फसल चक्र के लिए उत्कृष्ट।",
          },
        },
        {
          id: 4,
          name: "Sugarcane",
          hiName: "गन्ना",
          match: 78,
          image: "https://i.ibb.co/ZzP534y2/banana.webp",
          description:
            "A high-yield cash crop suitable for areas with ample water supply.",
          hiDescription:
            "भरपूर पानी की आपूर्ति वाले क्षेत्रों के लिए उपयुक्त एक उच्च उपज वाली नकदी फसल।",
          soilMatch: 75,
          weatherSuitability: 85,
          yieldPotential: "High",
          yieldPerAcre: 35,
          duration: "300 days",
          durationInDays: 300,
          waterRequirement: "High",
          reasons: [
            "High profitability",
            "Long harvest window",
            "Resistant to many pests",
          ],
          hiReasons: [
            "उच्च लाभप्रदता",
            "लंबी कटाई खिड़की",
            "कई कीटों के प्रतिरोधी",
          ],
          totalYield: (35 * landSize).toFixed(1),
          fertilizerInfo: {
            production: {
              name: "Potash & Urea",
              hiName: "पोटाश और यूरिया",
              dosage: "100kg/acre",
              notes: "Apply in multiple split doses for sustained growth.",
              hiNotes: "निरंतर विकास के लिए कई विभाजित खुराकों में डालें।",
            },
            diseaseControl: {
              name: "Propiconazole",
              hiName: "प्रोपिकोनाज़ोल",
              dosage: "1ml/litre water",
              notes: "Controls red rot and smut diseases.",
              hiNotes: "रेड रॉट और स्मट रोगों को नियंत्रित करता है।",
            },
            herbicide: {
              name: "Metribuzin",
              hiName: "मेट्रिबुज़िन",
              dosage: "400g/acre",
              notes: "Effective against broad-leaf weeds.",
              hiNotes: "चौड़ी पत्ती वाले खरपतवारों के खिलाफ प्रभावी।",
            },
            soilDeficiency: {
              deficiency: "Boron Deficiency",
              hiDeficiency: "बोरॉन की कमी",
              recommendation: "Borax",
              hiRecommendation: "बोरेक्स",
              dosage: "4kg/acre",
              notes: "Crucial for cell wall formation and sugar transport.",
              hiNotes:
                "कोशिका भित्ति निर्माण और चीनी परिवहन के लिए महत्वपूर्ण।",
            },
          },
          sustainabilityScore: 45,
          sustainabilityDetails: {
            carbonEmissions: 1200,
            carbonSequestration: 1500,
            waterUsage: "Very High (1500mm)",
            soilImpact: "Depletes Nutrients",
            otherImpacts: "High water consumption is a major concern.",
            hiWaterUsage: "बहुत अधिक (1500मिमी)",
            hiSoilImpact: "पोषक तत्वों को कम करता है",
            hiOtherImpacts: "उच्च पानी की खपत एक प्रमुख चिंता का विषय है।",
          },
        },
        {
          id: 5,
          name: "Banana",
          hiName: "केला",
          match: 72,
          image: "https://i.ibb.co/9mrBpB2d/chickpea.jpg",
          description:
            "A tropical fruit crop that requires rich soil and consistent moisture.",
          hiDescription:
            "एक उष्णकटिबंधीय फल फसल जिसे समृद्ध मिट्टी और लगातार नमी की आवश्यकता होती है।",
          soilMatch: 80,
          weatherSuitability: 70,
          yieldPotential: "Medium",
          yieldPerAcre: 15,
          duration: "365 days",
          durationInDays: 365,
          waterRequirement: "High",
          reasons: [
            "Year-round income potential",
            "High potassium content",
            "Good for intercropping",
          ],
          hiReasons: [
            "साल भर आय की संभावना",
            "उच्च पोटेशियम सामग्री",
            "अंतर-फसल के लिए अच्छा",
          ],
          totalYield: (15 * landSize).toFixed(1),
          fertilizerInfo: {
            production: {
              name: "Muriate of Potash (MOP)",
              hiName: "म्यूरेट ऑफ पोटाश (एमओपी)",
              dosage: "200kg/acre",
              notes: "Essential for fruit development and quality.",
              hiNotes: "फल के विकास और गुणवत्ता के लिए आवश्यक।",
            },
            diseaseControl: {
              name: "Copper Oxychloride",
              hiName: "कॉपर ऑक्सीक्लोराइड",
              dosage: "3g/litre water",
              notes: "Controls Sigatoka leaf spot disease.",
              hiNotes: "सिगाटोका पत्ती धब्बा रोग को नियंत्रित करता है।",
            },
            herbicide: {
              name: "Glyphosate",
              hiName: "ग्लाइफोसेट",
              dosage: "1.5L/acre",
              notes: "Use carefully to avoid contact with the main plant.",
              hiNotes:
                "मुख्य पौधे के संपर्क से बचने के लिए सावधानी से प्रयोग करें।",
            },
            soilDeficiency: {
              deficiency: "Iron Deficiency",
              hiDeficiency: "आयरन की कमी",
              recommendation: "Chelated Iron (Fe-EDTA)",
              hiRecommendation: "चेलेटेड आयरन (Fe-EDTA)",
              dosage: "500g/acre",
              notes:
                "Apply via foliar spray for quick absorption to correct leaf yellowing.",
              hiNotes:
                "पत्तियों के पीलेपन को ठीक करने के लिए त्वरित अवशोषण के लिए पर्ण स्प्रे के माध्यम से लागू करें।",
            },
          },
          addressesDeficiency: "Potassium",
          sustainabilityScore: 58,
          sustainabilityDetails: {
            carbonEmissions: 800,
            carbonSequestration: 950,
            waterUsage: "High (1200mm)",
            soilImpact: "Moderate",
            otherImpacts: "Susceptible to various fungal diseases.",
            hiWaterUsage: "उच्च (1200मिमी)",
            hiSoilImpact: "मध्यम",
            hiOtherImpacts: "विभिन्न फंगल रोगों के प्रति संवेदनशील।",
          },
        },
        {
          id: 6,
          name: "Potato",
          hiName: "आलू",
          match: 88,
          image: "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?auto=format&fit=crop&q=80&w=1000",
          description: "A common tuber crop with high demand, preferring loose, well-drained soil.",
          hiDescription: "उच्च मांग वाली एक सामान्य कंद की फसल, जो ढीली, अच्छी जल निकासी वाली मिट्टी पसंद करती है।",
          soilMatch: 85,
          weatherSuitability: 90,
          yieldPotential: "High",
          yieldPerAcre: 8,
          duration: "90 days",
          durationInDays: 90,
          waterRequirement: "Medium",
          reasons: [
            "Good weather alignment for tuber growth",
            "High market value short-duration crop",
            "Suits current soil conditions well"
          ],
          hiReasons: [
            "कंद के विकास के लिए अच्छे मौसम का संरेखण",
            "उच्च बाजार मूल्य वाली छोटी अवधि की फसल",
            "वर्तमान मिट्टी की स्थिति के अनुकूल"
          ],
          totalYield: (8 * landSize).toFixed(1)
        },
        {
          id: 7,
          name: "Tomato",
          hiName: "टमाटर",
          match: 75,
          image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=1000",
          description: "A versatile vegetable crop requiring well-distributed watering.",
          hiDescription: "एक बहुमुखी सब्जी की फसल जिसके लिए समान रूप से पानी देने की आवश्यकता होती है।",
          soilMatch: 70,
          weatherSuitability: 82,
          yieldPotential: "High",
          yieldPerAcre: 12,
          duration: "100 days",
          durationInDays: 100,
          waterRequirement: "High",
          reasons: [
            "Consistent demand and high profit margins",
            "Grows well in the moderate climate forecasted",
            "Favorable humidity levels"
          ],
          hiReasons: [
            "लगातार मांग और उच्च लाभ मार्जिन",
            "अनुमानित मध्यम जलवायु में अच्छी तरह से बढ़ता है",
            "अनुकूल आर्द्रता का स्तर"
          ],
          totalYield: (12 * landSize).toFixed(1)
        },
      ];
      setAllCrops(cropSuggestions);
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [farmData]);

  // Memoized filtering logic
  const filteredCrops = useMemo(() => {
    switch (activeFilter) {
      case "highYield":
        return allCrops.filter((crop) => crop.yieldPotential === "High");
      case "lowWater":
        return allCrops.filter((crop) => crop.waterRequirement === "Low");
      case "shortDuration":
        return allCrops.filter((crop) => crop.durationInDays < 120);
      case "regionalDeficiency":
        if (!regionalDeficiency) return allCrops;
        return allCrops.filter(
          (crop) => crop.addressesDeficiency === regionalDeficiency
        );
      case "all":
      default:
        return allCrops;
    }
  }, [allCrops, activeFilter, regionalDeficiency]);


  return (
    <div style={styles.container}>
      <div style={styles.scrollView}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.titleContainer}>
            <h1 style={styles.title}>{t.cropSuggestionsTitle || "Crop Suggestions"}</h1>
            <p style={styles.subtitle}>{t.cropSuggestionsSubtitle || "Based on your farm data"}</p>
          </div>
        </div>

        {/* Filter Component */}
        <div style={styles.filterContainer}>
          <h4 style={styles.filterTitle}>{t.filterRecommendations || "Filter"}</h4>
          <div style={styles.filterButtonsContainer}>
            <button
              onClick={() => setActiveFilter("all")}
              style={{
                ...styles.filterButton,
                ...(activeFilter === "all" ? styles.filterButtonActive : {}),
              }}
            >
              <MdEco
                size={16}
                color={
                  activeFilter === "all" ? colors.white : colors.textSecondary
                }
              />
              <span
                style={{
                  ...styles.filterButtonText,
                  ...(activeFilter === "all"
                    ? styles.filterButtonTextActive
                    : {}),
                }}
              >
                {t.allCrops || "All"}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter("highYield")}
              style={{
                ...styles.filterButton,
                ...(activeFilter === "highYield"
                  ? styles.filterButtonActive
                  : {}),
              }}
            >
              <MdTrendingUp
                size={16}
                color={
                  activeFilter === "highYield"
                    ? colors.white
                    : colors.textSecondary
                }
              />
              <span
                style={{
                  ...styles.filterButtonText,
                  ...(activeFilter === "highYield"
                    ? styles.filterButtonTextActive
                    : {}),
                }}
              >
                {t.highYield || "High Yield"}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter("lowWater")}
              style={{
                ...styles.filterButton,
                ...(activeFilter === "lowWater"
                  ? styles.filterButtonActive
                  : {}),
              }}
            >
              <MdWaterDrop
                size={16}
                color={
                  activeFilter === "lowWater"
                    ? colors.white
                    : colors.textSecondary
                }
              />
              <span
                style={{
                  ...styles.filterButtonText,
                  ...(activeFilter === "lowWater"
                    ? styles.filterButtonTextActive
                    : {}),
                }}
              >
                {t.lowWater || "Low Water"}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter("shortDuration")}
              style={{
                ...styles.filterButton,
                ...(activeFilter === "shortDuration"
                  ? styles.filterButtonActive
                  : {}),
              }}
            >
              <MdTimer
                size={16}
                color={
                  activeFilter === "shortDuration"
                    ? colors.white
                    : colors.textSecondary
                }
              />
              <span
                style={{
                  ...styles.filterButtonText,
                  ...(activeFilter === "shortDuration"
                    ? styles.filterButtonTextActive
                    : {}),
                }}
              >
                {t.shortDuration || "Short Duration"}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter("regionalDeficiency")}
              style={{
                ...styles.filterButton,
                ...(activeFilter === "regionalDeficiency"
                  ? styles.filterButtonActive
                  : {}),
              }}
            >
              <MdExplore
                size={16}
                color={
                  activeFilter === "regionalDeficiency"
                    ? colors.white
                    : colors.textSecondary
                }
              />
              <span
                style={{
                  ...styles.filterButtonText,
                  ...(activeFilter === "regionalDeficiency"
                    ? styles.filterButtonTextActive
                    : {}),
                }}
              >
                {t.regionalDeficiency || "Regional Fix"}
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div style={styles.cropsList}>
            {filteredCrops.map((crop) => (
              <CropCard
                key={crop.id}
                crop={crop}
              />
            ))}
          </div>
        )}
      </div>


    </div>
  );
};

export default CropRecommendations;

// --- STYLES (Converted for React Web) ---
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.white,
    minHeight: "100vh",
    width: "100%",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  scrollView: {
    flex: 1,
    paddingBottom: "20px",
  },
  header: {
    padding: "20px 20px 10px 20px",
    backgroundColor: colors.white,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: "4px",
    lineHeight: "40px",
    marginTop: 0,
  },
  subtitle: {
    fontSize: "16px",
    color: colors.textSecondary,
    lineHeight: "24px",
    margin: 0,
  },
  // Filter Styles
  filterContainer: {
    padding: "0 20px",
    marginBottom: "20px",
  },
  filterTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: "10px",
    marginTop: 0,
  },
  filterButtonsContainer: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
    paddingBottom: "10px",
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none", // IE/Edge
  },
  filterButton: {
    display: "flex",
    alignItems: "center",
    backgroundColor: colors.surfaceHover,
    padding: "8px 12px",
    borderRadius: "20px",
    border: `1px solid ${colors.border}`,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.2s",
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  filterButtonText: {
    marginLeft: "8px",
    fontSize: "12px",
    fontWeight: "600",
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "100px 0",
  },
  spinner: {
    border: `4px solid ${colors.surface}`,
    borderTop: `4px solid ${colors.primary}`,
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },
  loadingText: {
    fontSize: "16px",
    color: colors.textSecondary,
    fontWeight: "500",
  },
  cropsList: {
    padding: "0 12px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  cropCard: {
    backgroundColor: "#f7fde0",
    borderRadius: "16px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  cropImageContainer: {
    position: "relative",
    height: "220px",
    width: "100%",
  },
  cropImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  matchBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    backgroundColor: colors.primary,
    padding: "6px 12px",
    borderRadius: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  matchBadgeText: {
    color: colors.white,
    fontSize: "12px",
    fontWeight: "bold",
  },
  cropContent: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  cropName: {
    fontSize: "24px",
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: "8px",
    marginTop: 0,
  },
  cropDescription: {
    fontSize: "14px",
    color: colors.textSecondary,
    lineHeight: "20px",
    marginBottom: "20px",
    marginTop: 0,
  },
  progressSection: {
    marginBottom: "20px",
  },
  progressRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  progressLabel: {
    fontSize: "13px",
    color: colors.textSecondary,
    fontWeight: "500",
  },
  progressValue: {
    fontSize: "13px",
    color: colors.textPrimary,
    fontWeight: "bold",
  },
  progressBarBackground: {
    height: "6px",
    backgroundColor: colors.border,
    borderRadius: "3px",
    marginBottom: "12px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: "3px",
  },
  infoGrid: {
    display: "flex",
    flexWrap: "wrap",
    marginBottom: "10px",
    marginLeft: "-6px",
    marginRight: "-6px",
  },
  infoItem: {
    width: "50%",
    padding: "0 6px",
    marginBottom: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
  },
  infoLabel: {
    fontSize: "12px",
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: "6px",
  },
  badge: {
    padding: "6px 12px",
    borderRadius: "16px",
    minWidth: "80px",
    textAlign: "center",
    display: "inline-block",
  },
  badgeHigh: {
    backgroundColor: `${colors.success}20`, // Hex opacity
    border: `1px solid ${colors.success}`,
  },
  badgeMedium: {
    backgroundColor: `${colors.warning}20`,
    border: `1px solid ${colors.warning}`,
  },
  badgeLow: {
    backgroundColor: `${colors.error}20`,
    border: `1px solid ${colors.error}`,
  },
  badgeDefault: {
    backgroundColor: `${colors.info}20`,
    border: `1px solid ${colors.info}`,
  },
  badgeText: {
    fontSize: "11px",
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  reasonsSection: {
    borderTop: `1px solid ${colors.border}`,
    paddingTop: "16px",
    marginBottom: "10px",
  },
  reasonsTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: "12px",
    marginTop: 0,
  },
  reasonItem: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: "8px",
  },
  reasonText: {
    fontSize: "13px",
    color: colors.textSecondary,
    marginLeft: "8px",
    flex: 1,
    lineHeight: "18px",
  },
  actionButtonsContainer: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  fertilizerButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    width: "100%",
  },
  fertilizerButtonText: {
    marginLeft: "8px",
    color: "#091b07",
    fontWeight: "bold",
    fontSize: "14px",
  },
  sustainabilityButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${colors.success}20`,
    padding: "12px",
    borderRadius: "10px",
    border: `1px solid ${colors.success}`,
    cursor: "pointer",
    width: "100%",
  },
  sustainabilityButtonText: {
    marginLeft: "8px",
    color: colors.success,
    fontWeight: "bold",
    fontSize: "14px",
  },
  // Modal Styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end", // Bottom sheet style mostly for mobile feel
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    maxHeight: "85vh",
    width: "100%",
    maxWidth: "600px", // Limit width on desktop
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    // Center logic adjustment for desktop if needed
    margin: "0 auto",
    boxShadow: "0 -5px 20px rgba(0,0,0,0.2)",
  },
  modalHeader: {
    textAlign: "center",
    marginBottom: "20px",
    flexShrink: 0,
  },
  modalTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    color: colors.textPrimary,
    margin: 0,
  },
  modalSubtitle: {
    fontSize: "16px",
    color: colors.textSecondary,
    margin: 0,
  },
  modalScroll: {
    overflowY: "auto",
    paddingRight: "5px", // space for scrollbar
  },
  modalContent: {
    paddingBottom: "20px",
  },
  recommendationCard: {
    backgroundColor: colors.surfaceHover,
    borderRadius: "12px",
    padding: "15px",
    marginBottom: "15px",
  },
  recommendationHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  recommendationTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: colors.textPrimary,
    marginLeft: "10px",
  },
  recommendationName: {
    fontSize: "16px",
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: "8px",
    marginTop: 0,
  },
  recommendationDetail: {
    fontSize: "14px",
    color: colors.textSecondary,
    lineHeight: "20px",
    marginBottom: "4px",
    marginTop: 0,
  },
  bold: {
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  apiPlaceholderText: {
    fontSize: "10px",
    color: "#aaa",
    fontStyle: "italic",
    marginBottom: "10px",
    marginTop: 0,
  },
  closeButton: {
    backgroundColor: colors.primary,
    padding: "15px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    width: "100%",
    marginTop: "10px",
    flexShrink: 0,
  },
  closeButtonText: {
    color: colors.white,
    fontSize: "16px",
    fontWeight: "bold",
  },
  // Sustainability Specific
  sustainabilityScoreContainer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    marginBottom: "8px",
  },
  sustainabilityScoreValue: {
    fontSize: "64px",
    fontWeight: "bold",
    color: colors.success,
    lineHeight: 1,
  },
  sustainabilityScoreLabel: {
    fontSize: "24px",
    color: colors.textSecondary,
    fontWeight: "500",
    marginBottom: "10px",
    marginLeft: "4px",
  },
  sustainabilityScoreDescription: {
    textAlign: "center",
    fontSize: "14px",
    color: colors.textSecondary,
    marginBottom: "24px",
    marginTop: 0,
  },
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: "12px",
    padding: "15px",
  },
  breakdownTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: "15px",
    marginTop: 0,
  },
  breakdownItem: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: "15px",
  },
  breakdownIconWrapper: {
    marginRight: "15px",
    marginTop: "3px",
  },
  breakdownTextContainer: {
    flex: 1,
  },
  breakdownLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: colors.textSecondary,
    display: "block",
  },
  breakdownValue: {
    fontSize: "16px",
    fontWeight: "bold",
    color: colors.textPrimary,
    marginTop: "2px",
    marginBottom: 0,
  },
  breakdownSubValue: {
    fontSize: "12px",
    color: colors.textSecondary,
    marginTop: "4px",
    marginBottom: 0,
  },
  apiPlaceholder: {
    fontSize: "10px",
    color: "#aaa",
    textAlign: "center",
    marginTop: "20px",
    padding: "0 20px",
    fontStyle: "italic",
    whiteSpace: "pre-line",
  },
};