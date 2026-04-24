# Overthink Simulator

แอปจำลองการคิดมากเกินไป - ใส่สถานการณ์แล้วดูว่าสมองคุณจะพาไปไกลแค่ไหน

## เริ่มใช้งาน

```bash
npm install
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## Setup Gemini API (เลือก 1 ใน 3)

### 1. Google AI Studio (ง่ายที่สุด)
```env
GEMINI_API_KEY=AIza...
```
[ขอ API Key](https://aistudio.google.com/apikey)

### 2. Vertex AI with API Key (มี AQ. key แล้ว)
```env
GOOGLE_GENAI_USE_VERTEXAI=true
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_API_KEY=AQ.xxx...
```
ดูรายละเอียด: [QUICK_START.md](QUICK_START.md)

### 3. Vertex AI with Service Account (Enterprise)
ดูรายละเอียด: [VERTEX_AI_SETUP.md](VERTEX_AI_SETUP.md)

## ฟีเจอร์

- 🧠 สร้างลูกโซ่ความคิดที่คิดมากเกินไป
- 🎭 เลือกมุมมอง (Pessimist, Realist, Optimist)
- 📊 Sanity Meter วัดระดับความคิดมาก
- 🔄 สร้างตอนจบทางเลือก
- 📤 แชร์เป็นรูปภาพ

## Tech Stack

Next.js 16 + React 19 + TypeScript + Tailwind CSS + Google Gemini AI
