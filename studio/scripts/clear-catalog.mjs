#!/usr/bin/env node
/**
 * حذف كل الفروع والمنتجات من dataset المتجر (لا يمسّ إعدادات المتجر).
 *
 * الاستخدام (من داخل مجلد studio):
 *   node scripts/clear-catalog.mjs            # معاينة: يطبع ما سيُحذف فقط
 *   node scripts/clear-catalog.mjs --yes      # الحذف الفعلي
 *
 * الخيارات:
 *   --project <id>    افتراضي: p8stu12g
 *   --dataset <name>  افتراضي: 1production
 *   --token <token>   أو المتغير البيئي SANITY_TOKEN (رمز بصلاحية Write/Editor)
 *
 * للحصول على رمز مؤقت:
 *   npx sanity tokens create "clear-catalog" --role=editor --yes
 * ثم احذفه من sanity.io/manage > API > Tokens بعد الانتهاء.
 *
 * تنبيه: الحذف في Sanity نهائي — لا يمكن التراجع عنه (خذ نسخة عبر
 * `npx sanity dataset export backup.tar.gz` قبل التنفيذ إن لزم).
 */

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  if (i > -1 && process.argv[i + 1]) return process.argv[i + 1]
  return fallback
}

const projectId = arg('project', process.env.SANITY_PROJECT_ID || 'p8stu12g')
const dataset = arg('dataset', process.env.SANITY_DATASET || '1production')
const token = arg('token', process.env.SANITY_TOKEN) || ''
const confirmed = process.argv.includes('--yes')
const apiVersion = '2024-01-01'
const base = `https://${projectId}.api.sanity.io/v${apiVersion}`
const TYPES = ['branch', 'product']

if (!token && confirmed) {
  console.error('✖ الحذف يحتاج رمز وصول. أضِف SANITY_TOKEN=<token> أو مرّر --token <token>.')
  console.error('  (بدون رمز يمكن تشغيل المعاينة فقط: node scripts/clear-catalog.mjs)')
  process.exit(1)
}

const headers = {'Content-Type': 'application/json', ...(token ? {Authorization: `Bearer ${token}`} : {})}

async function api(pathname, init = {}) {
  const res = await fetch(`${base}${pathname}`, init)
  const text = await res.text()
  let body
  try {
    body = text ? JSON.parse(text) : {}
  } catch {
    body = {raw: text}
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${pathname} :: ${body.error || body.message || text}`)
  }
  return body
}

async function main() {
  console.log(`🔎 مشروع ${projectId} • dataset «${dataset}» • الأنواع: ${TYPES.join(', ')}`)

  const docs = await api(
    `/data/query/${dataset}?query=${encodeURIComponent(
      `*[_type in $types]{_id, _type, name} | order(_type asc, _id asc)`,
    )}&params=${encodeURIComponent(JSON.stringify({types: TYPES}))}`,
  ).then((r) => r.result || [])

  if (!docs.length) {
    console.log('✅ لا توجد فروع ولا منتجات لحذفها — الـ dataset نظيف بالفعل.')
    return
  }

  const titles = {branch: 'الفروع', product: 'المنتجات'}
  const grouped = new Map()
  for (const doc of docs) {
    const list = grouped.get(doc._type) || []
    list.push(doc)
    grouped.set(doc._type, list)
  }

  console.log(`\n🗑  سيُحذف ${docs.length} مستنداً:`)
  for (const [type, list] of grouped) {
    console.log(`   • ${titles[type] || type} (${type}): ${list.length}`)
    for (const d of list.slice(0, 12)) console.log(`       - ${d._id}  (${d.name || 'بدون اسم'})`)
    if (list.length > 12) console.log(`       … و${list.length - 12} مستنداً آخر`)
  }

  if (!confirmed) {
    console.log('\nℹ وضع معاينة فقط — لم يُحذف شيء. أعد التشغيل مع --yes للتنفيذ.')
    return
  }

  const targets = docs.map((d) => d._id)
  let removed = 0
  for (let i = 0; i < targets.length; i += 100) {
    const batch = targets.slice(i, i + 100)
    const result = await api(`/data/mutate/${dataset}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        mutations: batch.map((id) => ({delete: id})),
      }),
    })
    const results = result.results || []
    const failed = results.filter((r) => r.status && r.status !== 'success')
    removed += results.length - failed.length
    if (failed.length) console.warn(`⚠️ ${failed.length} مستنداً لم يُحذف (ربما مُدان مسبقاً).`)
    console.log(`   ✔ دفعة ${Math.floor(i / 100) + 1}: ${results.length - failed.length} تم حذفها`)
  }

  console.log(`\n✅ انتهى. حُذف ${removed} مستنداً من «${dataset}».`)
  console.log('   ملاحظة: المستندات المحذوفة منشورة فوراً — لا حاجة لخطوة نشر إضافية.')
}

main().catch((err) => {
  console.error(`✖ فشل التنفيذ: ${err.message}`)
  process.exit(1)
})
