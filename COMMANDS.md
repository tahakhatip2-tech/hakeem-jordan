# ⚡ أوامر سريعة - Hakeem Jordan

## 🚀 تشغيل المشروع

### 1. تشغيل Backend (Terminal 1)
```bash
cd server-nestjs
npm run start:dev
```

### 2. تشغيل Frontend (Terminal 2)
```bash
npm run dev
```

### 3. تشغيل Ngrok (Terminal 3)
```bash
cd server-nestjs
ngrok http 3000
```

---

## 🔄 تحديث Vercel بعد تشغيل Ngrok

### الخطوة 1: نسخ رابط Ngrok
من Terminal حيث يعمل Ngrok، انسخ الرابط:
```
Forwarding    https://tsunamic-unshameable-maricruz.ngrok-free.dev -> http://localhost:3000
```

### الخطوة 2: تحديث Vercel
1. افتح: https://vercel.com/dashboard
2. اختر المشروع
3. Settings → Environment Variables
4. حدّث `VITE_API_URL` إلى: `https://your-ngrok-url.ngrok-free.dev/api`
5. حدّث `VITE_API_BASE_URL` إلى: `https://your-ngrok-url.ngrok-free.dev/api`
6. Save

---

## 📊 متغيرات البيئة الحالية

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres.xmvbykljzjeeikzzezdl:UW7kHOTIMr3L6liK@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=5"
DIRECT_URL="postgresql://postgres.xmvbykljzjeeikzzezdl:UW7kHOTIMr3L6liK@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="super-secret-key-hakeem-jordan-2026"
PORT=3000
SUPABASE_URL="https://xmvbykljzjeeikzzezdl.supabase.co"
SUPABASE_KEY="sb_secret_LaZ7oK_MaqHie0fu3JYDwg_Giq1lkdX"
GEMINI_API_KEY="AIzaSyCPyrQRyVVJNf23GeNMyZ8u9dpFY-TZyto"
```

### Frontend (.env)
```env
VITE_API_URL=/api
VITE_API_BASE_URL=/api
VITE_GEMINI_API_KEY=AIzaSyCPyrQRyVVJNf23GeNMyZ8u9dpFY-TZyto
```

### Vercel Environment Variables
```
VITE_API_URL=https://tsunamic-unshameable-maricruz.ngrok-free.dev/api
VITE_API_BASE_URL=https://tsunamic-unshameable-maricruz.ngrok-free.dev/api
VITE_GEMINI_API_KEY=AIzaSyCPyrQRyVVJNf23GeNMyZ8u9dpFY-TZyto
```

---

## 🔍 اختبار الاتصال

### اختبار Backend المحلي
```bash
curl http://localhost:3000/api
```

### اختبار Ngrok
```bash
curl https://tsunamic-unshameable-maricruz.ngrok-free.dev/api
```

### اختبار من المتصفح
افتح في المتصفح:
```
http://localhost:8080
```

---

## 🗄️ أوامر قاعدة البيانات

### تحديث Schema
```bash
cd server-nestjs
npx prisma generate
npx prisma db push
```

### فتح Prisma Studio
```bash
cd server-nestjs
npx prisma studio
```

### إنشاء Migration جديد
```bash
cd server-nestjs
npx prisma migrate dev --name migration_name
```

---

## 📦 أوامر Git

### قبل الرفع على Git
```bash
# تأكد من أن .env محمي
git status

# إذا ظهر .env في القائمة، أضفه إلى .gitignore
echo ".env" >> .gitignore
echo "server-nestjs/.env" >> .gitignore

# Commit
git add .
git commit -m "Update environment configuration"
git push origin main
```

---

## 🛠️ أوامر الصيانة

### تنظيف node_modules
```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd server-nestjs
rm -rf node_modules package-lock.json
npm install
```

### تحديث Dependencies
```bash
# Frontend
npm update

# Backend
cd server-nestjs
npm update
```

### فحص الأمان
```bash
# Frontend
npm audit
npm audit fix

# Backend
cd server-nestjs
npm audit
npm audit fix
```

---

## 🔐 أوامر الأمان

### تغيير JWT Secret
```bash
# في server-nestjs/.env
# غيّر JWT_SECRET إلى قيمة عشوائية قوية
# مثال:
JWT_SECRET="$(openssl rand -base64 32)"
```

### تشفير كلمة مرور
```bash
# في Backend
npm run hash-password "your-password"
```

---

## 📱 روابط مهمة

### Local
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000/api
- API Docs: http://localhost:3000/api/docs
- Ngrok Dashboard: http://127.0.0.1:4040

### Production
- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://supabase.com/dashboard
- Ngrok Dashboard: https://dashboard.ngrok.com

---

## ⚠️ تذكير مهم

### قبل كل جلسة عمل:
1. ✅ شغّل Backend (`npm run start:dev`)
2. ✅ شغّل Ngrok (`ngrok http 3000`)
3. ✅ حدّث Vercel بالرابط الجديد
4. ✅ شغّل Frontend (`npm run dev`)

### قبل الرفع على Git:
1. ✅ تأكد من `.env` في `.gitignore`
2. ✅ لا توجد Secrets في الكود
3. ✅ اختبر التطبيق محلياً
4. ✅ راجع التغييرات (`git diff`)

---

**آخر تحديث:** 19 يناير 2026  
**حالة النظام:** ✅ جاهز للعمل
