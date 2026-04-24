# Overthink Simulator

แอปจำลองการคิดมากเกินไป - ใส่สถานการณ์แล้วดูว่าสมองคุณจะพาไปไกลแค่ไหน

## เริ่มใช้งาน

```bash
npm install
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## Setup Gemini API

เลือก 1 ใน 2 วิธี:

### Option 1: Vertex AI (แนะนำสำหรับ production)

1. สร้าง [Google Cloud Project](https://console.cloud.google.com/)
2. Enable [Vertex AI API](https://console.cloud.google.com/apis/library/aiplatform.googleapis.com)
3. Setup authentication:
   ```bash
   gcloud auth application-default login
   ```
4. ตั้งค่าใน `.env.local`:
   ```env
   GOOGLE_GENAI_USE_VERTEXAI=true
   GOOGLE_CLOUD_PROJECT=your-project-id
   GOOGLE_CLOUD_LOCATION=us-central1
   ```

### Option 2: Google AI Studio (ง่ายกว่า)

1. ขอ API Key ที่ [Google AI Studio](https://aistudio.google.com/apikey)
2. ตั้งค่าใน `.env.local`:
   ```env
   GEMINI_API_KEY=your-api-key
   ```

## Deploy บน Vercel

สำหรับ Vertex AI ต้องตั้งค่า Environment Variables:
- `GOOGLE_GENAI_USE_VERTEXAI=true`
- `GOOGLE_CLOUD_PROJECT=your-project-id`
- `GOOGLE_CLOUD_LOCATION=us-central1`

และต้อง setup Service Account:
1. สร้าง Service Account ใน Google Cloud
2. ให้ role: Vertex AI User
3. สร้าง JSON key
4. เพิ่ม key ใน Vercel: `GOOGLE_APPLICATION_CREDENTIALS_JSON` (paste เนื้อหา JSON ทั้งหมด)

หรือใช้ `GEMINI_API_KEY` แทนถ้าใช้ Google AI Studio

## ฟีเจอร์หลัก

- 🧠 สร้างลูกโซ่ความคิดที่คิดมากเกินไป
- 🎭 เลือกมุมมองต่างๆ (Pessimist, Realist, Optimist)
- 📊 Sanity Meter วัดระดับความคิดมาก
- 🔄 สร้างตอนจบทางเลือก
- 📤 แชร์เป็นรูปภาพ

## Tech Stack

Next.js 16 + React 19 + TypeScript + Tailwind CSS + Google Gemini AI
