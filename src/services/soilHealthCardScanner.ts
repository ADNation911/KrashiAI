/**
 * Soil Health Card Scanner Service
 * Uses Gemini 2.0 Flash (multimodal) to extract structured soil data
 * from uploaded soil health card images via OCR + AI extraction.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini with the existing API key from .env
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface SoilHealthData {
  pH: number | null;
  nitrogen: number | null;       // kg/ha
  phosphorus: number | null;     // kg/ha
  potassium: number | null;      // kg/ha
  sulfur: number | null;         // ppm
  zinc: number | null;           // ppm
  organicCarbon: number | null;  // %
  ec: number | null;             // dS/m (electrical conductivity)
  iron: number | null;           // ppm
  manganese: number | null;      // ppm
  copper: number | null;         // ppm
  boron: number | null;          // ppm
  soilType: string | null;
  confidence: number;            // 0-100, how confident Gemini is in extraction
  rawText: string;               // Raw OCR text for debugging
}

export interface ScanResult {
  success: boolean;
  data: SoilHealthData | null;
  error: string | null;
}

/**
 * Convert a File object to a base64-encoded string for Gemini API.
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Get the MIME type of a file.
 */
function getMimeType(file: File): string {
  return file.type || 'image/jpeg';
}

/**
 * Scan a soil health card image and extract structured soil data.
 *
 * @param imageFile - The image file (from file input or camera capture)
 * @returns ScanResult with extracted soil health data
 */
export async function scanSoilHealthCard(imageFile: File): Promise<ScanResult> {
  try {
    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return {
        success: false,
        data: null,
        error: 'Please upload a valid image file (JPEG, PNG, etc.)',
      };
    }

    // Validate file size (max 10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      return {
        success: false,
        data: null,
        error: 'Image file is too large. Please upload an image under 10MB.',
      };
    }

    // Convert to base64
    const base64Data = await fileToBase64(imageFile);
    const mimeType = getMimeType(imageFile);

    // Use Gemini 2.0 Flash for multimodal analysis
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an expert agricultural data extraction AI. Analyze this image of a Soil Health Card (मृदा स्वास्थ्य कार्ड) and extract all soil parameters.

The Soil Health Card is an Indian government document that contains soil test results. Extract the following parameters if visible:

1. pH value (typically 4.0-9.0)
2. Nitrogen (N) in kg/ha (typically 0-750)
3. Phosphorus (P) in kg/ha (typically 0-50)
4. Potassium (K) in kg/ha (typically 0-500)
5. Sulfur (S) in ppm (typically 0-50)
6. Zinc (Zn) in ppm (typically 0-10)
7. Organic Carbon (OC) in % (typically 0-2)
8. Electrical Conductivity (EC) in dS/m (typically 0-4)
9. Iron (Fe) in ppm (typically 0-20)
10. Manganese (Mn) in ppm (typically 0-10)
11. Copper (Cu) in ppm (typically 0-5)
12. Boron (B) in ppm (typically 0-5)
13. Soil Type/Color if mentioned

The card might be in Hindi, English, or both. Look for labels like:
- pH / पी.एच.
- नत्रजन / Nitrogen / N
- फॉस्फोरस / Phosphorus / P
- पोटाश / Potassium / K
- गंधक / Sulphur / S
- जिंक / Zinc / Zn
- कार्बनिक कार्बन / Organic Carbon / OC
- विद्युत चालकता / EC

IMPORTANT: Respond ONLY with a valid JSON object in this exact format (no markdown, no code blocks):
{
  "pH": <number or null>,
  "nitrogen": <number or null>,
  "phosphorus": <number or null>,
  "potassium": <number or null>,
  "sulfur": <number or null>,
  "zinc": <number or null>,
  "organicCarbon": <number or null>,
  "ec": <number or null>,
  "iron": <number or null>,
  "manganese": <number or null>,
  "copper": <number or null>,
  "boron": <number or null>,
  "soilType": "<string or null>",
  "confidence": <0-100>,
  "rawText": "<brief summary of what you can read from the card>"
}

If the image is NOT a soil health card, set confidence to 0 and include an appropriate message in rawText.
If a value is not visible or readable, set it to null.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse the JSON response — handle markdown code blocks if present
    let jsonText = text.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    }

    let parsedData: SoilHealthData;
    try {
      parsedData = JSON.parse(jsonText);
    } catch {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        return {
          success: false,
          data: null,
          error: 'Could not parse soil data from the image. Please ensure you uploaded a clear soil health card image.',
        };
      }
    }

    // Validate the confidence level
    if (parsedData.confidence < 20) {
      return {
        success: false,
        data: parsedData,
        error: 'This does not appear to be a soil health card. Please upload a valid soil health card image.',
      };
    }

    return {
      success: true,
      data: parsedData,
      error: null,
    };
  } catch (error: any) {
    console.error('Soil health card scan error:', error);

    if (error?.message?.includes('API_KEY')) {
      return {
        success: false,
        data: null,
        error: 'Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.',
      };
    }

    return {
      success: false,
      data: null,
      error: `Failed to scan soil health card: ${error?.message || 'Unknown error'}`,
    };
  }
}

/**
 * Create a preview URL for an image file.
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Clean up a preview URL when no longer needed.
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url);
}
