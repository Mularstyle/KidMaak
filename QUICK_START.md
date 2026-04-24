# Quick Start - ใช้ Gemini API Key ที่คุณมี

## วิธีที่ง่ายที่สุด: ใช้ Google Cloud API Key (AQ.xxx)

คุณมี API Key แบบ `AQ.Ab8RN6LNRdsO_V...` อยู่แล้ว ใช้ได้เลย!

### Setup

1. แก้ไข `.env.local`:

```env
GOOGLE_GENAI_USE_VERTEXAI=true
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_API_KEY=AQ.Ab8RN6LNRdsO_VXXXXXXXXXXXXXXXXXX
```

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
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_API_KEY=AQ.Ab8RN6LNRdsO_VXXXXXXXXXXXXXXXXXX
```

Deploy ได้เลย! ไม่ต้อง Service Account JSON

---

## หา Project ID

ถ้าไม่รู้ว่า Project ID คืออะไร:

1. ไปที่ https://console.cloud.google.com/
2. คลิกที่ชื่อ project ด้านบนซ้าย
3. จะเห็น Project ID ในตาราง

หรือรันคำสั่ง:
```bash
gcloud config get-value project
```

---

## เปรียบเทียบ API Key 3 แบบ

| API Key Type | Format | ใช้กับ | Setup |
|-------------|--------|--------|-------|
| Google AI Studio | `AIza...` | Google AI Studio | ง่ายที่สุด - ไม่ต้อง project |
| Google Cloud | `AQ....` | Vertex AI / Agent Platform | ง่าย - ต้องมี project |
| Service Account | JSON file | Vertex AI | ยาก - ต้อง gcloud + JSON |

**คำแนะนำ:**
- มี `AQ.` key แล้ว → ใช้เลย (Option 2)
- ยังไม่มี key → ใช้ Google AI Studio (Option 1)
- Enterprise → ใช้ Service Account (Option 3)

---

## Troubleshooting

### Error: "Project not found"
- ตรวจสอบว่า `GOOGLE_CLOUD_PROJECT` ถูกต้อง
- ตรวจสอบว่า project มี billing enabled

### Error: "API not enabled"
- Enable Vertex AI API: https://console.cloud.google.com/apis/library/aiplatform.googleapis.com

### Error: "Invalid API key"
- ตรวจสอบว่า API Key ไม่หมดอายุ
- ตรวจสอบว่า API Key มีสิทธิ์เข้าถึง Vertex AI

### ใช้งานได้แต่ช้า
- ลอง location อื่น: `us-central1`, `asia-southeast1`
- ตรวจสอบ quota: https://console.cloud.google.com/iam-admin/quotas
