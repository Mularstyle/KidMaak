# Quick Start - ใช้ Gemini API Key ที่คุณมี

## วิธีที่ง่ายที่สุด: ใช้ Google Cloud API Key (AQ.xxx)

คุณมี API Key แบบ `AQ.Ab8RN6LNRdsO_V...` อยู่แล้ว ใช้ได้เลย!

### Setup

1. แก้ไข `.env.local`:

```env
GOOGLE_GENAI_USE_VERTEXAI=true
GOOGLE_API_KEY=AQ.Ab8RN6LNRdsO_VXXXXXXXXXXXXXXXXXX
```

**สำคัญ:** ไม่ต้องใส่ `GOOGLE_CLOUD_PROJECT` และ `GOOGLE_CLOUD_LOCATION` เพราะ API Key มีข้อมูลนี้อยู่แล้ว

2. รัน:

```bash
npm run dev
```

3. เปิด http://localhost:3000

เสร็จแล้ว! ไม่ต้อง gcloud auth หรือ Service Account

---

## Deploy บน Vercel

ตั้งค่า Environment Variables:

```
GOOGLE_GENAI_USE_VERTEXAI=true
GOOGLE_API_KEY=AQ.Ab8RN6LNRdsO_VXXXXXXXXXXXXXXXXXX
```

Deploy ได้เลย! ไม่ต้อง Service Account JSON

---

## เปรียบเทียบ API Key 3 แบบ

| API Key Type | Format | ใช้กับ | Setup |
|-------------|--------|--------|-------|
| Google AI Studio | `AIza...` | Google AI Studio | ง่ายที่สุด - ไม่ต้อง project |
| Google Cloud | `AQ....` | Vertex AI / Agent Platform | ง่าย - ไม่ต้อง project/location |
| Service Account | JSON file | Vertex AI | ยาก - ต้อง gcloud + JSON |

**คำแนะนำ:**
- มี `AQ.` key แล้ว → ใช้เลย (Option 2)
- ยังไม่มี key → ใช้ Google AI Studio (Option 1)
- Enterprise → ใช้ Service Account (Option 3)

---

## Troubleshooting

### Error: "Project/location and API key are mutually exclusive"
- ลบ `GOOGLE_CLOUD_PROJECT` และ `GOOGLE_CLOUD_LOCATION` ออก
- ใช้แค่ `GOOGLE_API_KEY` อย่างเดียว

### Error: "Invalid API key"
- ตรวจสอบว่า API Key ไม่หมดอายุ
- ตรวจสอบว่า API Key มีสิทธิ์เข้าถึง Vertex AI

### Error: "API not enabled"
- Enable Vertex AI API: https://console.cloud.google.com/apis/library/aiplatform.googleapis.com

### ใช้งานได้แต่ช้า
- API Key จะใช้ region ที่ตั้งไว้ใน key แล้ว
- ตรวจสอบ quota: https://console.cloud.google.com/iam-admin/quotas

