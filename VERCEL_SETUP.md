# 🚀 دليل إعداد Vercel - Hakeem Jordan

## 📋 نظرة عامة

هذا الدليل يشرح كيفية ربط تطبيق Hakeem Jordan على Vercel بالـ Backend المحلي عبر Ngrok.

---

## 🔗 البنية الحالية

```
المستخدم → Vercel (Frontend) → Ngrok → Backend المحلي (NestJS) → Supabase (Database)
```

---

## 📊 المعلومات الحالية

### قاعدة البيانات (Supabase)
- **Project ID:** `xmvbykljzjeeikzzezdl`
- **Region:** `aws-1-eu-west-1`
- **Password:** `UW7kHOTIMr3L6liK`
- **Transaction Pooler:** Port `6543` (للـ Serverless)
- **Direct Connection:** Port `5432` (للـ Long-lived connections)

### Ngrok
- **URL الحالي:** `https://tsunamic-unshameable-maricruz.ngrok-free.dev`
- **Port:** `3000`
- **Region:** Europe (eu)
- **Plan:** Free

---

## ⚙️ إعدادات Vercel Environment Variables

### الخطوة 1: الذهاب إلى Vercel Dashboard

1. افتح [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروع `hakeem-jordan-jordan` أو `hakeemjordanjo`
3. اذهب إلى **Settings** → **Environment Variables**

### الخطوة 2: إضافة/تحديث المتغيرات التالية

#### ✅ المتغيرات المطلوبة

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_API_URL` | `https://tsunamic-unshameable-maricruz.ngrok-free.dev/api` | Production, Preview, Development |
| `VITE_API_BASE_URL` | `https://tsunamic-unshameable-maricruz.ngrok-free.dev/api` | Production, Preview, Development |
| `VITE_GEMINI_API_KEY` | `AIzaSyCPyrQRyVVJNf23GeNMyZ8u9dpFY-TZyto` | Production, Preview, Development |

#### 📝 ملاحظات مهمة:
- ✅ استخدم رابط Ngrok الكامل مع `/api` في النهاية
- ✅ اختر **All Environments** لكل متغير
- ✅ لا تنسى الضغط على **Save** بعد كل تغيير
- ⚠️ **لا حاجة لعمل Redeploy** - التغييرات تسري فوراً!

---

## 🔄 تحديث رابط Ngrok (عند كل إعادة تشغيل)

### المشكلة
Ngrok المجاني يعطيك رابط جديد في كل مرة تشغله.

### الحل السريع

#### 1. احصل على الرابط الجديد
```bash
# في Terminal حيث يعمل Ngrok
# ابحث عن السطر:
Forwarding    https://your-new-url.ngrok-free.dev -> http://localhost:3000
```

#### 2. حدّث Vercel
1. اذهب إلى **Vercel** → **Settings** → **Environment Variables**
2. اضغط على **Edit** بجانب `VITE_API_URL`
3. استبدل الرابط القديم بالجديد
4. اضغط **Save**
5. كرر نفس الخطوات لـ `VITE_API_BASE_URL`

#### 3. اختبر الاتصال
افتح موقعك على Vercel وتأكد من عمل الـ API.

---

## 🛠️ حل بديل: Ngrok Static Domain (مدفوع)

إذا أردت تجنب تحديث الرابط في كل مرة:

### الخيار 1: Ngrok Pro ($8/شهر)
```bash
# احصل على Static Domain
ngrok http 3000 --domain=hakeem-jordan.ngrok.app
```

### الخيار 2: استخدام VPS (موصى به للإنتاج)
- **DigitalOcean Droplet:** $4-6/شهر
- **AWS EC2 Free Tier:** مجاني لسنة
- **Google Cloud Compute:** $300 رصيد مجاني

---

## 🔍 التحقق من الاتصال

### اختبار 1: من المتصفح
افتح في متصفحك:
```
https://tsunamic-unshameable-maricruz.ngrok-free.dev/api
```

يجب أن ترى:
```json
{
  "message": "Hakeem Jordan API is running",
  "version": "1.0.0"
}
```

### اختبار 2: من Vercel
افتح موقعك على Vercel وافتح **Developer Tools** → **Network**:
- يجب أن ترى طلبات API تذهب إلى رابط Ngrok
- يجب أن تكون الاستجابات `200 OK`

### اختبار 3: من Terminal
```bash
curl https://tsunamic-unshameable-maricruz.ngrok-free.dev/api
```

---

## ⚠️ مشاكل شائعة وحلولها

### المشكلة 1: CORS Error
**الأعراض:** `Access to fetch at '...' has been blocked by CORS policy`

**الحل:**
تأكد من أن `server-nestjs/src/main.ts` يحتوي على:
```typescript
app.enableCors({
  origin: [
    'https://hakeem-jordan-jordan.vercel.app',
    'https://hakeemjordanjo.vercel.app',
    'https://hakeem-jordan-five.vercel.app',
    'http://localhost:8080',
    'http://localhost:5173',
  ],
  credentials: true,
});
```

### المشكلة 2: Ngrok Warning Page
**الأعراض:** صفحة تحذير من Ngrok قبل الوصول للـ API

**الحل:**
أضف Header في طلبات API:
```typescript
headers: {
  'ngrok-skip-browser-warning': 'true'
}
```

### المشكلة 3: Database Connection Error
**الأعراض:** `Error: P1001: Can't reach database server`

**الحل:**
1. تأكد من صحة كلمة المرور في `.env`
2. تأكد من استخدام Transaction Pooler (Port 6543)
3. تحقق من IP Whitelist في Supabase

### المشكلة 4: Environment Variables لا تعمل
**الأعراض:** `undefined` عند قراءة المتغيرات

**الحل:**
1. تأكد من البادئة `VITE_` للمتغيرات في Frontend
2. أعد تشغيل `npm run dev` بعد تغيير `.env`
3. في Vercel، تأكد من اختيار **All Environments**

---

## 📱 اختبار كامل للنظام

### 1. تشغيل Backend
```bash
cd server-nestjs
npm run start:dev
```

### 2. تشغيل Ngrok
```bash
cd server-nestjs
ngrok http 3000
```

### 3. تحديث Vercel
1. انسخ رابط Ngrok
2. حدّث `VITE_API_URL` في Vercel
3. احفظ التغييرات

### 4. اختبار الموقع
1. افتح موقعك على Vercel
2. سجل دخول
3. تحقق من تحميل البيانات
4. جرب إنشاء موعد جديد
5. تحقق من عمل WhatsApp Bot

---

## 🎯 Checklist قبل الرفع على Git

- [ ] ✅ `.env` في `.gitignore`
- [ ] ✅ `.env.example` موجود ومحدث
- [ ] ✅ لا توجد Secrets في الكود
- [ ] ✅ `VITE_API_URL` يشير إلى `/api` في `.env` المحلي
- [ ] ✅ Database Password صحيح
- [ ] ✅ Ngrok يعمل بدون أخطاء
- [ ] ✅ CORS محدث بروابط Vercel

---

## 🚀 الخطوات النهائية

### 1. Commit التغييرات
```bash
git add .
git commit -m "Update environment configuration and add .env.example files"
git push origin main
```

### 2. تحديث Vercel Environment Variables
اتبع الخطوات في القسم "إعدادات Vercel Environment Variables" أعلاه.

### 3. اختبار
افتح موقعك على Vercel وتأكد من عمل كل شيء بشكل صحيح.

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من Logs في Vercel Dashboard
2. تحقق من Terminal حيث يعمل Backend
3. تحقق من Ngrok Dashboard: http://127.0.0.1:4040

---

## 🔐 ملاحظات أمنية

### ⚠️ مهم جداً:
1. **لا ترفع `.env` على Git أبداً**
2. **استخدم Secrets Management في Production**
3. **غيّر JWT_SECRET في Production**
4. **استخدم HTTPS دائماً**
5. **فعّل Rate Limiting**

### للإنتاج (Production):
- استبدل Ngrok بـ VPS أو Cloud Provider
- استخدم Domain خاص بك
- فعّل SSL Certificate
- استخدم Environment Variables Management
- فعّل Monitoring و Logging

---

**آخر تحديث:** 19 يناير 2026  
**Ngrok URL الحالي:** `https://tsunamic-unshameable-maricruz.ngrok-free.dev`  
**حالة النظام:** ✅ جاهز للاستخدام
