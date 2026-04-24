# คู่มือ Setup Vertex AI

## สำหรับ Local Development

### 1. ติดตั้ง Google Cloud CLI

**Windows:**
```bash
# Download และติดตั้งจาก
https://cloud.google.com/sdk/docs/install
```

**macOS:**
```bash
brew install google-cloud-sdk
```

**Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

### 2. Login และ Setup Project

```bash
# Login
gcloud auth login

# เลือก/สร้าง project
gcloud projects create YOUR_PROJECT_ID
gcloud config set project YOUR_PROJECT_ID

# Enable billing (จำเป็น!)
# ไปที่ https://console.cloud.google.com/billing
# เลือก project แล้วเปิด billing

# Enable Vertex AI API
gcloud services enable aiplatform.googleapis.com
```

### 3. Setup Application Default Credentials

```bash
gcloud auth application-default login
```

คำสั่งนี้จะเปิด browser ให้ login และสร้างไฟล์ credentials ที่:
- Windows: `%APPDATA%\gcloud\application_default_credentials.json`
- macOS/Linux: `~/.config/gcloud/application_default_credentials.json`

### 4. ตั้งค่า Environment Variables

แก้ไขไฟล์ `.env.local`:

```env
GOOGLE_GENAI_USE_VERTEXAI=true
GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID
GOOGLE_CLOUD_LOCATION=us-central1
```

### 5. ทดสอบ

```bash
npm run dev
```

เปิด http://localhost:3000 และลองใช้งาน

---

## สำหรับ Deploy บน Vercel

### 1. สร้าง Service Account

```bash
# สร้าง service account
gcloud iam service-accounts create overthink-app \
    --display-name="Overthink App Service Account"

# ให้สิทธิ์ Vertex AI User
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:overthink-app@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

# สร้าง JSON key
gcloud iam service-accounts keys create key.json \
    --iam-account=overthink-app@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

ไฟล์ `key.json` จะถูกสร้างในโฟลเดอร์ปัจจุบัน

### 2. Setup Vercel Environment Variables

ไปที่ Vercel Project Settings → Environment Variables แล้วเพิ่ม:

**ตัวแปรที่ต้องมี:**
```
GOOGLE_GENAI_USE_VERTEXAI = true
GOOGLE_CLOUD_PROJECT = YOUR_PROJECT_ID
GOOGLE_CLOUD_LOCATION = us-central1
```

**สำหรับ Service Account (เลือก 1 ใน 2 วิธี):**

#### วิธีที่ 1: ใช้ JSON ทั้งหมด (แนะนำ)
```
GOOGLE_APPLICATION_CREDENTIALS_JSON = <paste เนื้อหาไฟล์ key.json ทั้งหมด>
```

#### วิธีที่ 2: ใช้ Base64
```bash
# Encode key.json เป็น base64
cat key.json | base64 > key.base64.txt
```

แล้วเพิ่มใน Vercel:
```
GOOGLE_APPLICATION_CREDENTIALS_BASE64 = <paste เนื้อหาไฟล์ key.base64.txt>
```

### 3. อัปเดตโค้ดให้รองรับ Service Account บน Vercel

แก้ไข `app/lib/llm-service.ts`:

```typescript
constructor() {
  const useVertexAI = process.env.GOOGLE_GENAI_USE_VERTEXAI === "true";
  
  if (useVertexAI) {
    const project = process.env.GOOGLE_CLOUD_PROJECT;
    const location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
    
    if (!project) {
      throw new Error("GOOGLE_CLOUD_PROJECT environment variable is required for Vertex AI");
    }
    
    // สำหรับ Vercel: รองรับ Service Account JSON
    let credentials;
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
      const decoded = Buffer.from(
        process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64,
        'base64'
      ).toString('utf-8');
      credentials = JSON.parse(decoded);
    }
    
    this.client = new GoogleGenAI({
      vertexai: true,
      project,
      location,
      ...(credentials && { credentials }),
    });
  } else {
    // Fallback to API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    this.client = new GoogleGenAI({ apiKey });
  }
  
  this.model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
}
```

### 4. Deploy

```bash
git add .
git commit -m "Add Vertex AI support"
git push
```

Vercel จะ auto-deploy

### 5. ลบไฟล์ key.json (สำคัญ!)

```bash
# ห้ามเก็บไฟล์นี้ใน git!
rm key.json key.base64.txt

# ตรวจสอบว่า .gitignore มี
echo "key.json" >> .gitignore
echo "*.base64.txt" >> .gitignore
```

---

## ตรวจสอบค่าใช้จ่าย

Vertex AI คิดค่าใช้จ่ายตาม token ที่ใช้:

- Gemini 2.5 Flash: ~$0.075 per 1M input tokens, ~$0.30 per 1M output tokens
- ดูราคาล่าสุด: https://cloud.google.com/vertex-ai/generative-ai/pricing

**ตั้ง Budget Alert:**
1. ไปที่ https://console.cloud.google.com/billing/budgets
2. สร้าง budget alert (เช่น $10/month)
3. ตั้ง email notification

---

## Troubleshooting

### Error: "API keys are not supported by this API"
- Vertex AI ไม่รองรับ API Key
- ต้องใช้ `gcloud auth application-default login` หรือ Service Account

### Error: "Permission denied"
- ตรวจสอบว่า enable Vertex AI API แล้ว
- ตรวจสอบว่า Service Account มี role `roles/aiplatform.user`

### Error: "Project not found"
- ตรวจสอบว่า `GOOGLE_CLOUD_PROJECT` ถูกต้อง
- ตรวจสอบว่า project มี billing enabled

### Local ใช้ได้ แต่ Vercel ใช้ไม่ได้
- ตรวจสอบว่าตั้ง Environment Variables ครบ
- ตรวจสอบว่า Service Account JSON ถูกต้อง
- ดู Vercel logs: `vercel logs`

---

## เปรียบเทียบ Google AI Studio vs Vertex AI

| Feature | Google AI Studio | Vertex AI |
|---------|-----------------|-----------|
| Setup | ง่าย (API Key) | ยาก (gcloud + Service Account) |
| Local Dev | แค่ใส่ API Key | ต้อง gcloud auth |
| Deploy | แค่ใส่ API Key | ต้อง Service Account JSON |
| ราคา | เท่ากัน | เท่ากัน |
| Rate Limit | 10 RPM (free tier) | ตาม quota ที่ตั้ง |
| Enterprise Features | ไม่มี | มี (VPC, audit logs, etc.) |

**คำแนะนำ:** ถ้าไม่จำเป็นต้องใช้ enterprise features ให้ใช้ Google AI Studio ดีกว่า
