# إعداد Firebase — respiratory-team

## 1) Firestore (الرابط الذي فتحته)

[Firestore Console](https://console.firebase.google.com/project/respiratory-team/firestore)

- إذا طلب **Create database** → اختر **Start in test mode** (للتجربة) → المنطقة الأقرب (مثلاً `europe-west1`)
- تبويب **Rules** → الصق محتوى `firestore.rules.example` → **Publish**

## 2) تطبيق ويب (للحصول على apiKey)

1. [Project settings](https://console.firebase.google.com/project/respiratory-team/settings/general)
2. أسفل **Your apps** → أيقونة **Web** `</>`
3. اسم التطبيق: `Respiratory Challenge` → Register app
4. انسخ كائن `firebaseConfig` بالكامل

## 3) ملف `firebase-config.js`

استبدل في الملف:

- `PASTE_API_KEY_HERE` → `apiKey`
- `PASTE_SENDER_ID_HERE` → `messagingSenderId`
- `PASTE_APP_ID_HERE` → `appId`

إذا كان `storageBucket` مختلفاً في الكونسول، انسخه كما هو.

## 4) التجربة

1. افتح `Challenge.html` من **Live Server** أو بعد الرفع على GitHub Pages
2. في الأعلى يجب أن تظهر: **☁️ Live — shared**
3. من هاتف ثانٍ افتح **نفس الرابط** → جرّب محاولة → تظهر عند الأدمن

## 5) GitHub Pages (اختياري)

- Repository → Settings → Pages → Source: main branch
- الرابط مثل: `https://USERNAME.github.io/REPO/Challenge.html`
- شارك هذا الرابط مع الفريق (ليس ملفاً محلياً `file://`)
