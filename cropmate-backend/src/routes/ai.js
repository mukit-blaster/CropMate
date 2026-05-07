const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

let cachedClient = null;
function getClient() {
  if (cachedClient) return cachedClient;
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY environment variable is not set');
  cachedClient = new GoogleGenerativeAI(key);
  return cachedClient;
}

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

router.post('/predict-crop', async (req, res) => {
  try {
    const { soilType, phLevel, humidity, temperature } = req.body || {};
    if (!soilType || phLevel === undefined || humidity === undefined || temperature === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const prompt = `You are an expert agronomist advising farmers in Bangladesh and South Asia.

**Conditions provided:**
- Soil type: ${soilType}
- pH level: ${phLevel}
- Humidity: ${humidity}%
- Temperature: ${temperature}°C

**Task:** Recommend the **top 3 crops** that will thrive in these conditions.

**Output format — STRICT MARKDOWN, no preamble:**

## 🌾 Top Recommendation: <Crop Name (English + Bengali)>

**Why this crop fits**
- 1-2 short bullets tying the recommendation to the soil/pH/humidity/temperature.

**Best planting window**
<season + months>

**Expected yield**
<typical per-acre estimate or qualitative note>

**Quick tips**
- 2–3 actionable bullets (irrigation, spacing, fertilizer, common pests).

---

## 🥈 Second Choice: <Crop Name (English + Bengali)>
(same sub-headings as above, slightly shorter)

---

## 🥉 Third Choice: <Crop Name (English + Bengali)>
(same sub-headings as above, brief)

---

### ⚠️ Watch out for
- 1–2 bullets on the biggest risks at these conditions (e.g. fungal disease at high humidity, drought stress, etc.)

### ✅ Quick action plan
A **single sentence** telling the farmer what to do next week.

Keep the whole answer under 350 words. Use Markdown headings, bold, and bullets — never raw JSON. Don't repeat the input values back at the user.`;

    const model = getClient().getGenerativeModel({ model: MODEL });
    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.() || '';

    return res.status(200).json({ prediction: text });
  } catch (error) {
    console.error('AI predict-crop error:', error);
    return res.status(500).json({ message: 'AI request failed', error: error.message });
  }
});

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

router.post('/detect-disease', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file uploaded' });

    const prompt = `You are a plant pathologist. Analyse the attached leaf/plant photo and reply ONLY with the following Markdown structure (no preamble, no JSON):

## 🩺 Diagnosis
**<Disease name>** — or **Healthy plant** if no disease is visible.
*If the image isn't a plant: write "Not a plant image" and stop.*

**Confidence:** Low / Medium / High

## 🔍 Visible symptoms
- 2–4 short bullets describing what you see (color, spots, wilt, etc.)

## 🌿 Recommended treatment

**Organic / cultural**
- 2–3 specific actions (neem oil ratio, pruning, drainage, etc.)

**Chemical (if needed)**
- 1–2 named active ingredients + dosage hint
- Note safe re-entry / pre-harvest interval if applicable

## 🛡️ Prevention
- 2–3 bullets to stop recurrence (crop rotation, spacing, sanitation, resistant varieties).

## ⏱️ When to act
A single sentence: how urgent and what to do today.

Keep the answer under 250 words. Use bold for key terms. No raw JSON. No "As an AI" disclaimers.`;

    const model = getClient().getGenerativeModel({ model: MODEL });
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: req.file.buffer.toString('base64'),
          mimeType: req.file.mimetype,
        },
      },
    ]);
    const text = result?.response?.text?.() || '';

    return res.status(200).json({ analysis: text });
  } catch (error) {
    console.error('AI detect-disease error:', error);
    return res.status(500).json({ message: 'AI request failed', error: error.message });
  }
});

module.exports = router;
