export type CropProfile = {
  name: string;
  hiName: string;
  image: string;
  description: string;
  hiDescription: string;
  soilMatch: number;
  weatherSuitability: number;
  yieldPotential: "High" | "Medium" | "Low";
  yieldPerAcre: number;
  duration: string;
  durationInDays: number;
  waterRequirement: "High" | "Medium" | "Low" | "Very Low";
  reasons: string[];
  hiReasons: string[];
};

export const cropMapping: Record<string, CropProfile> = {
  Rice: {
    name: "Rice",
    hiName: "चावल",
    image: "https://i.ibb.co/4nm8TdTv/rice3.jpg",
    description:
      "High-yield staple crop suited for flooded fields with high water availability.",
    hiDescription:
      "उच्च उपज वाली मुख्य फसल जो बाढ़ वाले खेतों और उच्च जल उपलब्धता के लिए उपयुक्त है।",
    soilMatch: 85,
    weatherSuitability: 90,
    yieldPotential: "High" as const,
    yieldPerAcre: 4.0,
    duration: "120-150 days",
    durationInDays: 135,
    waterRequirement: "High" as const,
    reasons: [
      "Excellent for monsoon season",
      "High market demand as staple food",
      "Good response to NPK fertilizers",
    ],
    hiReasons: [
      "मानसून के मौसम के लिए उत्कृष्ट",
      "मुख्य भोजन के रूप में उच्च बाजार मांग",
      "एनपीके उर्वरकों पर अच्छा प्रतिक्रिया",
    ],
  },
  Maize: {
    name: "Maize (Corn)",
    hiName: "मक्का",
    image: "https://i.ibb.co/przYDBGz/maize.jpg",
    description:
      "Versatile crop with good drought tolerance and multiple uses.",
    hiDescription: "बहुमुखी फसल अच्छी सूखा सहनशीलता और कई उपयोगों के साथ।",
    soilMatch: 88,
    weatherSuitability: 85,
    yieldPotential: "High" as const,
    yieldPerAcre: 5.5,
    duration: "90-120 days",
    durationInDays: 105,
    waterRequirement: "Medium" as const,
    reasons: [
      "Fast growth cycle",
      "Multiple harvest rounds possible",
      "High nutritional value as feed",
    ],
    hiReasons: [
      "तेज़ वृद्धि चक्र",
      "एकाधिक कटाई दौर संभव",
      "चारा के रूप में उच्च पोषण मूल्य",
    ],
  },
  Chickpea: {
    name: "Chickpea",
    hiName: "चना",
    image:
      "https://images.unsplash.com/photo-1611121756368-818688e212f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description:
      "Nitrogen-fixing legume that improves soil fertility naturally.",
    hiDescription:
      "नाइट्रोजन स्थिरीकरण करने वाली फली जो मिट्टी की उर्वरता स्वाभाविक रूप से सुधारती है।",
    soilMatch: 90,
    weatherSuitability: 80,
    yieldPotential: "Medium" as const,
    yieldPerAcre: 1.8,
    duration: "90-110 days",
    durationInDays: 100,
    waterRequirement: "Low" as const,
    reasons: [
      "Low water requirement",
      "Improves soil naturally",
      "Stable market prices",
    ],
    hiReasons: [
      "कम पानी की आवश्यकता",
      "प्राकृतिक रूप से मिट्टी सुधार",
      "स्थिर बाजार मूल्य",
    ],
  },
  Kidneybeans: {
    name: "Kidney Beans",
    hiName: "राजमा",
    image:
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Protein-rich pulse crop with good market demand.",
    hiDescription: "प्रोटीन से भरपूर दाल फसल अच्छी बाजार मांग के साथ।",
    soilMatch: 82,
    weatherSuitability: 78,
    yieldPotential: "Medium" as const,
    yieldPerAcre: 1.2,
    duration: "90-100 days",
    durationInDays: 95,
    waterRequirement: "Medium" as const,
    reasons: ["Good protein content", "Short duration", "Export potential"],
    hiReasons: ["अच्छा प्रोटीन सामग्री", "छोटी अवधि", "निर्यात क्षमता"],
  },
  Pigeonpeas: {
    name: "Pigeon Peas (Tur/Arhar)",
    hiName: "अरहर/तूर दाल",
    image:
      "https://i.ibb.co/7ddQCJwq/How-to-Grow-Pigeon-Peas-Feature.jpg",
    description:
      "Perennial legume with drought tolerance and multiple harvests.",
    hiDescription: "सूखा सहनशीलता के साथ बारहमासी फली बहु-कटाई।",
    soilMatch: 85,
    weatherSuitability: 82,
    yieldPotential: "Medium" as const,
    yieldPerAcre: 2.0,
    duration: "150-180 days",
    durationInDays: 165,
    waterRequirement: "Low" as const,
    reasons: [
      "Multiple harvests possible",
      "Drought resistant",
      "Soil enrichment",
    ],
    hiReasons: ["एकाधिक कटाई संभव", "सूखा प्रतिरोधी", "मिट्टी संवर्धन"],
  },
  Mothbeans: {
    name: "Moth Beans",
    hiName: "मोठ",
    image:
      "https://i.ibb.co/pBSqtJ2s/images.jpg",
    description: "Extremely drought-tolerant pulse for arid regions.",
    hiDescription: "शुष्क क्षेत्रों के लिए अत्यधिक सूखा-सहनशील दाल।",
    soilMatch: 88,
    weatherSuitability: 75,
    yieldPotential: "Low" as const,
    yieldPerAcre: 0.8,
    duration: "75-90 days",
    durationInDays: 82,
    waterRequirement: "Very Low" as const,
    reasons: [
      "Thrives in low rainfall",
      "Shortest duration",
      "Minimum inputs needed",
    ],
    hiReasons: [
      "कम वर्षा में फलता-फूलता है",
      "सबसे छोटी अवधि",
      "न्यूनतम इनपुट की जरूरत",
    ],
  },
  Mungbean: {
    name: "Mung Bean (Green Gram)",
    hiName: "मूंग दाल",
    image: "https://i.ibb.co/pBSqtJ2s/images.jpg",
    description: "Quick-maturing summer pulse with excellent market value.",
    hiDescription:
      "तेजी से पकने वाली ग्रीष्मकालीन दाल उत्कृष्ट बाजार मूल्य के साथ।",
    soilMatch: 87,
    weatherSuitability: 85,
    yieldPotential: "Medium" as const,
    yieldPerAcre: 1.0,
    duration: "60-75 days",
    durationInDays: 67,
    waterRequirement: "Low" as const,
    reasons: [
      "Fastest maturing crop",
      "High summer suitability",
      "Good export quality",
    ],
    hiReasons: [
      "सबसे तेजी से पकने वाली फसल",
      "उच्च ग्रीष्म उपयुक्तता",
      "अच्छी निर्यात गुणवत्ता",
    ],
  },
  Blackgram: {
    name: "Black Gram (Urd)",
    hiName: "उड़द दाल",
    image:
      "https://images.unsplash.com/photo-1609926307355-9e7a7792b95a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Robust pulse with good response to moderate fertilizers.",
    hiDescription: "मध्यम उर्वरकों पर अच्छा प्रतिक्रिया देने वाली मजबूत दाल।",
    soilMatch: 86,
    weatherSuitability: 84,
    yieldPotential: "Medium" as const,
    yieldPerAcre: 1.1,
    duration: "75-90 days",
    durationInDays: 82,
    waterRequirement: "Low" as const,
    reasons: [
      "Good fertilizer response",
      "Disease resistant varieties",
      "Stable prices",
    ],
    hiReasons: [
      "अच्छा उर्वरक प्रतिक्रिया",
      "रोग प्रतिरोधी किस्में",
      "स्थिर मूल्य",
    ],
  },
  Lentil: {
    name: "Lentil",
    hiName: "मसूर दाल",
    image:
      "https://images.unsplash.com/photo-1546548970-b5bba9bccea1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Winter pulse with excellent cool weather performance.",
    hiDescription: "उत्कृष्ट शीत मौसम प्रदर्शन के साथ सर्दी की दाल।",
    soilMatch: 89,
    weatherSuitability: 88,
    yieldPotential: "Medium" as const,
    yieldPerAcre: 1.3,
    duration: "110-130 days",
    durationInDays: 120,
    waterRequirement: "Low" as const,
    reasons: [
      "Cool weather specialist",
      "High protein content",
      "Low input crop",
    ],
    hiReasons: ["शीत मौसम विशेषज्ञ", "उच्च प्रोटीन सामग्री", "कम इनपुट फसल"],
  },
  Cotton: {
    name: "Cotton",
    hiName: "कपास",
    image: "https://i.ibb.co/ynG6KtxS/cotton.jpg",
    description: "Cash crop with high economic value and fiber quality.",
    hiDescription: "उच्च आर्थिक मूल्य और रेशे गुणवत्ता के साथ नकदी फसल।",
    soilMatch: 80,
    weatherSuitability: 82,
    yieldPotential: "High" as const,
    yieldPerAcre: 6.0,
    duration: "150-180 days",
    durationInDays: 165,
    waterRequirement: "Medium" as const,
    reasons: ["High cash value", "Government MSP support", "Export demand"],
    hiReasons: ["उच्च नकद मूल्य", "सरकारी एमएसपी समर्थन", "निर्यात मांग"],
  },
  Banana: {
    name: "Banana",
    hiName: "केला",
    image:
      "https://images.unsplash.com/photo-1579586144900-b02d5b4f2b1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Year-round fruit crop with stable income potential.",
    hiDescription: "स्थिर आय क्षमता के साथ वर्ष भर फल फसल।",
    soilMatch: 78,
    weatherSuitability: 90,
    yieldPotential: "High" as const,
    yieldPerAcre: 25.0,
    duration: "12 months",
    durationInDays: 365,
    waterRequirement: "High" as const,
    reasons: [
      "Year-round harvesting",
      "High local demand",
      "Multiple varieties",
    ],
    hiReasons: ["वर्ष भर कटाई", "उच्च स्थानीय मांग", "एकाधिक किस्में"],
  },
  Mango: {
    name: "Mango",
    hiName: "आम",
    image:
      "https://images.unsplash.com/photo-1582132293820-9d2ba2b176a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Premium fruit with export quality and high returns.",
    hiDescription: "निर्यात गुणवत्ता और उच्च रिटर्न के साथ प्रीमियम फल।",
    soilMatch: 82,
    weatherSuitability: 88,
    yieldPotential: "High" as const,
    yieldPerAcre: 8.0,
    duration: "4-5 years to fruit",
    durationInDays: 1600,
    waterRequirement: "Medium" as const,
    reasons: [
      "Premium pricing",
      "Export markets",
      "Once established, long term",
    ],
    hiReasons: [
      "प्रीमियम मूल्य निर्धारण",
      "निर्यात बाजार",
      "स्थापित होने पर दीर्घकालिक",
    ],
  },
  Watermelon: {
    name: "Watermelon",
    hiName: "तरबूज",
    image:
      "https://images.unsplash.com/photo-1579556080476-5f7d2f3815e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Quick cash crop with high summer demand.",
    hiDescription: "उच्च ग्रीष्मकालीन मांग के साथ त्वरित नकदी फसल।",
    soilMatch: 80,
    weatherSuitability: 85,
    yieldPotential: "Medium" as const,
    yieldPerAcre: 15.0,
    duration: "75-90 days",
    durationInDays: 82,
    waterRequirement: "High" as const,
    reasons: [
      "Fast cash turnover",
      "High summer prices",
      "Low initial investment",
    ],
    hiReasons: ["तेज नकद परिवर्तन", "उच्च ग्रीष्म मूल्य", "कम प्रारंभिक निवेश"],
  },
  Papaya: {
    name: "Papaya",
    hiName: "पपीता",
    image:
      "https://images.unsplash.com/photo-1584748187444-5e770c0e4095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Fast-fruiting tree with year-round production.",
    hiDescription: "वर्ष भर उत्पादन के साथ तेज फल देने वाला वृक्ष।",
    soilMatch: 79,
    weatherSuitability: 87,
    yieldPotential: "High" as const,
    yieldPerAcre: 20.0,
    duration: "9-12 months",
    durationInDays: 330,
    waterRequirement: "High" as const,
    reasons: ["Quick returns", "Continuous harvesting", "Medicinal value"],
    hiReasons: ["त्वरित रिटर्न", "निरंतर कटाई", "औषधीय मूल्य"],
  },
  Coconut: {
    name: "Coconut",
    hiName: "नारियल",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Long-term plantation with multiple products.",
    hiDescription: "एकाधिक उत्पादों के साथ दीर्घकालिक वृक्षारोपण।",
    soilMatch: 75,
    weatherSuitability: 92,
    yieldPotential: "Medium" as const,
    yieldPerAcre: 8000,
    duration: "6-8 years",
    durationInDays: 2500,
    waterRequirement: "High" as const,
    reasons: [
      "Multiple revenue streams",
      "Long lifespan (60+ years)",
      "Coastal suitability",
    ],
    hiReasons: [
      "एकाधिक राजस्व धाराएँ",
      "दीर्घ जीवनकाल (60+ वर्ष)",
      "तटीय उपयुक्तता",
    ],
  },
};

export const getCropImage = (cropName: string): string => {
  const mapping = cropMapping[cropName as keyof typeof cropMapping];
  return mapping
    ? mapping.image
    : "https://images.unsplash.com/photo-1509433490477-14bb7d5cf4ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
};

export const getCropData = (cropName: string): CropProfile | null =>
  cropMapping[cropName as keyof typeof cropMapping] || null;
