// server.js — Unified AgriSmart Backend
// Handles: transcription, disease detection, crop recommendation proxy
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });
const app = express();
app.use(cors());
app.use(express.json());

// =============== TRANSCRIBE (for voice) ==================
app.post("/api/transcribe", upload.single("audio"), (req, res) => {
  const lang = req.body.lang || "en";

  // Mock transcription (fake text just for testing)
  if (lang === "hi") {
    res.json({ text: "पत्तियों पर पीले धब्बे और झड़न दिखाई दे रही है।" });
  } else {
    res.json({ text: "The leaves have yellow spots and look wilted." });
  }

  if (req.file && req.file.path) {
    fs.unlink(req.file.path, () => {}); // delete uploaded file
  }
});

// =============== DETECT DISEASE ==================
app.post("/api/detectDisease", upload.single("image"), (req, res) => {
  const lang = req.body.lang || "en";

  if (lang === "hi") {
    res.json({
      message:
        "पहचान: प्रारंभिक ब्लाइट। सलाह: तांबे-आधारित कवकनाशक का छिड़काव करें।",
      suggestions: ["तांबे-आधारित दवा लगाएं", "पौधों के बीच दूरी रखें"],
    });
  } else {
    res.json({
      message:
        "Detected: Early Blight. Recommendation: Apply copper-based fungicide.",
      suggestions: ["Apply copper-based fungicide", "Ensure proper spacing"],
    });
  }

  if (req.file && req.file.path) {
    fs.unlink(req.file.path, () => {}); // delete uploaded file
  }
});

// =============== CROP RECOMMENDATION PROXY ==================
// Proxies crop recommendation requests to the Flask backend
// Flask server should be running on http://localhost:5000
app.post("/api/crop-recommend", async (req, res) => {
  const { N, P, K, temperature, humidity, ph, rainfall, season, district, water_source, land_size } = req.body;

  console.log("📥 Crop recommendation request:", { N, P, K, temperature, humidity, ph, rainfall, season, district });

  try {
    // Try to forward to Flask crop recommendation model
    const flaskUrl = "http://localhost:5000";

    // Build the POST form data for the Flask endpoint
    const formData = new URLSearchParams();
    formData.append("N", String(N || 50));
    formData.append("P", String(P || 30));
    formData.append("K", String(K || 40));
    formData.append("temperature", String(temperature || 25));
    formData.append("humidity", String(humidity || 65));
    formData.append("ph", String(ph || 6.5));
    formData.append("rainfall", String(rainfall || 200));
    formData.append("water_source", water_source || "Groundwater");
    formData.append("district", district || "Ranchi");
    formData.append("season", season || "Kharif");

    const response = await fetch(flaskUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`Flask server responded with status ${response.status}`);
    }

    // Flask returns HTML, so we'll try the JSON API endpoints instead
    // Use the get_fertilizer_recommendation and calculate_rainfall endpoints
    const rainfallRes = await fetch(
      `${flaskUrl}/calculate_rainfall?season=${encodeURIComponent(season || "Kharif")}&district=${encodeURIComponent(district || "Ranchi")}&water_source=${encodeURIComponent(water_source || "Groundwater")}`
    );
    const rainfallData = await rainfallRes.json();

    console.log("✅ Flask rainfall data:", rainfallData);

    // Since Flask returns HTML for the main route, we'll generate
    // recommendations locally using the same logic
    const recommendations = generateLocalRecommendations(
      { N, P, K, temperature, humidity, ph, rainfall: rainfallData.total_water || rainfall },
      season || "Kharif",
      district || "Ranchi",
      land_size || "10"
    );

    res.json({
      success: true,
      recommendations,
      calculated_rainfall: rainfallData.total_water || rainfall,
      source: "hybrid" // Using local logic + Flask rainfall calculation
    });

  } catch (flaskError) {
    console.warn("⚠️  Flask server not available, using fallback recommendations:", flaskError.message);

    // Fallback: Generate recommendations locally without Flask
    const recommendations = generateLocalRecommendations(
      { N, P, K, temperature, humidity, ph, rainfall },
      season || "Kharif",
      district || "Ranchi",
      land_size || "10"
    );

    res.json({
      success: true,
      recommendations,
      calculated_rainfall: rainfall,
      source: "fallback"
    });
  }
});

// =============== LOCAL RECOMMENDATION ENGINE ==================
// Mirrors the Flask model's crop data for offline/fallback operation
function generateLocalRecommendations(inputData, season, district, landSize) {
  const { N, P, K, temperature, humidity, ph, rainfall } = inputData;

  // Crop database with ideal conditions (from crop_data.py)
  const cropDB = {
    Rice:       { N: [60,140], P: [30,70], K: [30,70], temp: [20,35], hum: [70,95], ph: [5.5,7.5], rain: [100,200], seasons: ["Kharif", "monsoon"] },
    Maize:      { N: [60,160], P: [30,80], K: [30,80], temp: [18,32], hum: [50,80], ph: [5.5,7.5], rain: [80,120],  seasons: ["Kharif", "monsoon"] },
    Chickpea:   { N: [10,40],  P: [20,60], K: [10,40], temp: [15,30], hum: [40,70], ph: [6.0,7.5], rain: [40,60],   seasons: ["Rabi", "winter"] },
    Kidneybeans:{ N: [10,40],  P: [20,60], K: [10,40], temp: [18,28], hum: [50,80], ph: [5.5,7.0], rain: [45,70],   seasons: ["Rabi", "winter"] },
    Pigeonpeas: { N: [10,50],  P: [20,60], K: [10,40], temp: [20,35], hum: [50,80], ph: [5.5,7.5], rain: [60,100],  seasons: ["Kharif", "monsoon"] },
    Mothbeans:  { N: [10,40],  P: [10,40], K: [10,30], temp: [25,38], hum: [30,60], ph: [6.0,8.0], rain: [30,50],   seasons: ["Kharif", "monsoon"] },
    Mungbean:   { N: [10,40],  P: [15,45], K: [10,30], temp: [25,35], hum: [50,80], ph: [6.0,7.5], rain: [50,75],   seasons: ["Kharif", "monsoon"] },
    Blackgram:  { N: [10,40],  P: [15,45], K: [10,30], temp: [25,35], hum: [50,80], ph: [6.0,7.5], rain: [50,75],   seasons: ["Kharif", "monsoon"] },
    Lentil:     { N: [10,30],  P: [20,50], K: [10,30], temp: [15,25], hum: [40,70], ph: [6.0,7.5], rain: [40,60],   seasons: ["Rabi", "winter"] },
    Cotton:     { N: [60,120], P: [20,60], K: [30,80], temp: [25,35], hum: [50,80], ph: [5.5,8.0], rain: [60,90],   seasons: ["Kharif", "monsoon"] },
    Banana:     { N: [80,160], P: [40,80], K: [40,80], temp: [22,35], hum: [70,90], ph: [5.5,7.0], rain: [100,150], seasons: ["Zaid", "summer"] },
    Mango:      { N: [40,120], P: [20,60], K: [20,60], temp: [24,36], hum: [50,80], ph: [5.5,7.5], rain: [60,100],  seasons: ["Zaid", "summer"] },
    Watermelon: { N: [30,70],  P: [15,45], K: [20,60], temp: [24,35], hum: [50,80], ph: [5.5,7.0], rain: [50,80],   seasons: ["Zaid", "summer"] },
    Papaya:     { N: [30,80],  P: [15,45], K: [20,60], temp: [22,35], hum: [60,85], ph: [5.5,7.0], rain: [80,120],  seasons: ["Zaid", "summer"] },
    Coconut:    { N: [60,140], P: [30,70], K: [30,70], temp: [25,35], hum: [70,90], ph: [5.5,7.5], rain: [100,150], seasons: ["Zaid", "summer"] },
  };

  // Season mapping
  const seasonMap = {
    monsoon: "Kharif", kharif: "Kharif",
    summer: "Zaid", zaid: "Zaid",
    winter: "Rabi", rabi: "Rabi",
  };
  const normalizedSeason = seasonMap[season.toLowerCase()] || season;

  const results = [];

  for (const [cropName, ideal] of Object.entries(cropDB)) {
    // Filter by season
    if (!ideal.seasons.includes(normalizedSeason) && !ideal.seasons.includes(season.toLowerCase())) {
      continue;
    }

    // Calculate suitability score (0-100)
    let score = 0;
    let factors = 0;

    const rangeScore = (val, min, max) => {
      if (val >= min && val <= max) return 1.0;
      if (val < min) return Math.max(0, 1 - (min - val) / min);
      return Math.max(0, 1 - (val - max) / max);
    };

    score += rangeScore(N, ideal.N[0], ideal.N[1]) * 15; factors++;
    score += rangeScore(P, ideal.P[0], ideal.P[1]) * 15; factors++;
    score += rangeScore(K, ideal.K[0], ideal.K[1]) * 15; factors++;
    score += rangeScore(temperature, ideal.temp[0], ideal.temp[1]) * 15; factors++;
    score += rangeScore(humidity, ideal.hum[0], ideal.hum[1]) * 10; factors++;
    score += rangeScore(ph, ideal.ph[0], ideal.ph[1]) * 15; factors++;
    score += rangeScore(rainfall, ideal.rain[0], ideal.rain[1]) * 15; factors++;

    const finalScore = Math.round(score);

    if (finalScore > 30) {
      // Fertilizer recommendation
      const recN = (ideal.N[0] + ideal.N[1]) / 2;
      const recP = (ideal.P[0] + ideal.P[1]) / 2;
      const recK = (ideal.K[0] + ideal.K[1]) / 2;
      const addN = Math.max(0, Math.round(recN - N));
      const addP = Math.max(0, Math.round(recP - P));
      const addK = Math.max(0, Math.round(recK - K));

      const fertParts = [];
      if (addN > 0) fertParts.push(`N: +${addN} kg/ha`);
      if (addP > 0) fertParts.push(`P: +${addP} kg/ha`);
      if (addK > 0) fertParts.push(`K: +${addK} kg/ha`);
      const fertilizerMsg = fertParts.length > 0 ? fertParts.join(", ") : "No additional fertilizer needed";

      results.push({
        crop: cropName,
        score: finalScore,
        probability: `${finalScore}%`,
        fertilizer: fertilizerMsg,
        rainfall_status: rainfall >= ideal.rain[0] && rainfall <= ideal.rain[1] ? "Sufficient" : "Needs adjustment",
        season: normalizedSeason,
      });
    }
  }

  // Sort by score descending, take top 5
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 5);
}

// =============== HEALTH CHECK ==================
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", services: ["transcribe", "detectDisease", "crop-recommend"] });
});

// =============== START SERVER ==================
const PORT = process.env.PORT || 8081;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`✅ AgriSmart Server running on port ${PORT}`)
);
