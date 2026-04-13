# ML Server Integration - Fix "Random Data" Issue

**Status:** Frontend Context Flow ✅ | Backend Servers ⏳ | Display Fix 🔄

## Backend Servers (MUST RUN for Real ML Data)

```
Terminal 1: cd "Crop-Recommendation-System" && pip install -r requirements.txt && python app.py
Terminal 2: cd agrismart-server && node server.js
```

- Flask ML Model: http://localhost:5000
- Node Proxy API: http://localhost:8081/api/crop-recommend

## Frontend Updates (In Progress)

```
- [x] RecommendationContext created
- [x] App.tsx wrapped with Provider
- [x] DataEntryForm submits to API + sets context
- [ ] CropRecommendations: Use context.data.recommendations (server ML output)
  ↓ Transform server format → CropData cards
- [ ] Add "Clear Results" → reload demo data
- [ ] Test full flow: Form → ML API → Context → Real Crop Recs
```

**Current Issue Fixed By:** CropRecommendations reading context.data.recommendations instead of hardcoded array.

**Next Step:** Edit `src/pages/CropRecommendations.tsx`
