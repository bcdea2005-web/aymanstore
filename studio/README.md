# لوحة تحكم متجر أيمن — Sanity Studio

لوحة تحكم لإدارة محتوى **متجر أيمن للملابس** (الفروع، المنتجات، إعدادات المتجر) وتغذية الموقع بالبيانات مباشرةً.

- **Project ID:** `p8stu12g`
- **Dataset:** `production`

---

## 1) المتطلبات

- Node.js 18 أو أحدث
- حساب على [sanity.io](https://www.sanity.io/) لديه صلاحية على المشروع `p8stu12g`

## 2) التثبيت والتشغيل محلياً

```bash
cd studio
npm install
npx sanity login          # سجّل الدخول بنفس حساب المشروع
npm run dev               # يفتح اللوحة على http://localhost:3333
```

## 3) ضبط CORS (السماح للمتجر بالاتصال)

حتى يتمكّن ملف `index.html` من جلب البيانات، أضِف نطاقات المتجر إلى قائمة CORS.
راجع `cors-origins.json`، ثم نفّذ من داخل مجلد `studio`:

```bash
# استضافة GitHub Pages للمتجر (عدّل الرابط حسب استضافتك)
npx sanity cors add https://bcdea2005-web.github.io --no-credentials

# أثناء التطوير المحلي
npx sanity cors add http://localhost:8080 --no-credentials
npx sanity cors add http://localhost:3333 --credentials

# للتأكد
npx sanity cors list
```

> ملاحظة: قراءة البيانات المنشورة (published) من الـ dataset `production` عامة، لذا تعمل عبر
> رابط الـ API مباشرةً. إضافة نطاقات CORS تضمن عمل مكتبة `@sanity/client` من المتصفح دون مشاكل.

## 4) رفع البيانات الأولية (اختياري)

> **ملاحظة:** لم تعد هناك فروع أو منتجات تجريبية في المستودع — تم حذفها كلها.
> ملف `seed.ndjson` يحتوي الآن على **إعدادات المتجر فقط** (الاسم والشعار ورقم الواتساب)،
> وأضِف الفروع والمنتجات بنفسك من اللوحة عبر تبويبي «الفروع» و«المنتجات».

```bash
npx sanity dataset import seed.ndjson production
```

### حذف كل الفروع والمنتجات الموجودة فعلياً في الـ dataset

المتجر يجلب بياناته من Sanity، لذلك إذا كانت الفروع والمنتجات التجريبية ما زالت محفوظة في
الـ dataset فهي **ستبقى ظاهرة** حتى يُفرَّغ. بعد تسجيل الدخول (`npx sanity login`) نفّذ:

```bash
# 1) رمز مؤقت بصلاحية كتابة (احذفه من sanity.io/manage > API > Tokens بعد الانتهاء)
npx sanity tokens create "clear-catalog" --role=editor --yes

# 2) معاينة ما سيُحذف (لا يحذف شيئاً)
SANITY_TOKEN="<الرمز>" node scripts/clear-catalog.mjs

# 3) الحذف الفعلي
SANITY_TOKEN="<الرمز>" node scripts/clear-catalog.mjs --yes
```

> السكربت يقرأ معرّفات كل مستندات `branch` و `product` من `production` (بما فيها المسودات
> `drafts.*`) ثم يحذفها عبر Sanity Mutations API على دفعات. لا يمسّ `storeSettings`.
> ولأن الحذف نهائي، يُنصح بأخذ نسخة: `npx sanity dataset export backup.tar.gz production`.

## 5) نشر اللوحة على الإنترنت (اختياري)

```bash
npm run deploy            # ينشرها على https://<studioHost>.sanity.studio
```

---

## هيكل المحتوى

| النوع | الوصف |
|------|--------|
| `storeSettings` | اسم المتجر، الشعار، رقم الواتساب |
| `branch` | الفروع + رسوم التوصيل + التفعيل |
| `product` | المنتجات (السعر، القسم، الفرع، الصورة، المقاسات) |

## الربط مع المتجر

الملف `index.html` مضبوط مسبقاً على:

```js
const SANITY_PROJECT_ID = 'p8stu12g';
const SANITY_DATASET = 'production';
```

عند تشغيل الموقع سيجلب الفروع والمنتجات من Sanity فقط — **لم تعد هناك بيانات تجريبية مكتوبة داخل
`index.html`**. لذا إذا تعذّر الاتصال أو كانت اللوحة فارغة، ستظهر رسالة «لا توجد فروع معروضة
حالياً» بدل عرض فروع ومنتجات وهمية.
