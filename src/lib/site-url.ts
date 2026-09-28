/**
 * URL ของเว็บสำหรับ metadata และ OG อ่านจาก env `SITE_URL` ห้ามเขียนลงโค้ด
 *
 * ถ้าไม่ได้ตั้ง Next.js ใช้ URL ที่ Vercel ให้มาเอง (VERCEL_PROJECT_PRODUCTION_URL /
 * VERCEL_BRANCH_URL) และใช้ localhost ตอน dev จึงตั้งแค่ตอนมีโดเมนจริงก็พอ
 */
export function siteUrl(): URL | undefined {
  const raw = process.env.SITE_URL?.trim()
  return raw ? new URL(raw) : undefined
}
