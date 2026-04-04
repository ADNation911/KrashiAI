// server.js
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

// =============== START SERVER ==================
app.listen(8081, () =>
  console.log("✅ Server running on http://localhost:8081")
);
