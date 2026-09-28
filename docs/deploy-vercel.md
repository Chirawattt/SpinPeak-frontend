# ต่อ Vercel กับ repo

ทำครั้งเดียว เจ้าของต้องทำเองในหน้าเว็บ Vercel หลังจากนี้ทุก push จะได้ preview URL ใหม่ และ push เข้า `main` จะ deploy เป็นตัวจริง

## ก่อนเริ่ม

- push โค้ดขึ้น GitHub (`Chirawattt/SpinPeak-frontend`) แล้ว และ CI บน GitHub ผ่าน (แท็บ Actions)

## ขั้นตอน

1. เข้า <https://vercel.com> แล้ว login ด้วยบัญชี GitHub
2. กด **Add New… → Project**
3. ที่ **Import Git Repository** เลือก `SpinPeak-frontend` (ถ้าไม่เห็น กด **Adjust GitHub App Permissions** แล้วให้สิทธิ์ repo นี้)
4. หน้า **Configure Project**
   - Framework Preset: **Next.js** (Vercel เลือกให้เอง)
   - Root Directory: `./` (ไม่ต้องแก้)
   - Build / Install / Output: ปล่อยค่าเดิม (`npm run build`, `npm install`)
   - Environment Variables: ยังไม่ต้องใส่อะไร ดูหัวข้อข้างล่าง
5. กด **Deploy** รอประมาณ 1–2 นาที
6. เสร็จแล้วจะได้ URL แบบ `spin-peak-frontend-xxxx.vercel.app` เปิดบนมือถือได้ทันที
7. push ครั้งต่อไป (ทุก branch) Vercel จะ build ให้เองและแปะลิงก์ preview ไว้ที่ commit บน GitHub

## Environment variables

ตั้งที่ **Project → Settings → Environment Variables**

| ชื่อ | ต้องตั้งไหม | ค่า |
|---|---|---|
| `SITE_URL` | **ยังไม่ต้อง** ตั้งตอนมีโดเมนจริง | URL เต็มของเว็บ เช่น `https://<โดเมน>` ใช้ใน metadata และรูป OG ถ้าไม่ตั้ง Next.js ใช้ URL ที่ Vercel ให้มาเอง |

ตั้งแล้วต้อง redeploy (Deployments → ⋯ → Redeploy) ค่าใหม่ถึงจะมีผล

รายการ env ทั้งหมดอยู่ใน `.env.example` ที่ราก repo ตอน dev ให้คัดลอกเป็น `.env.local`

## ถ้า build บน Vercel พัง

เปิด deployment ที่พัง → **Building** ดู log สาเหตุที่เจอบ่อยคือ lint / type error ที่ยังไม่ได้รันบนเครื่อง ลอง `npm run build` ในเครื่องก่อน push
