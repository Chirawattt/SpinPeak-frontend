# SpinPeak-frontend

Spinepeak Biology Course Website: เว็บแนะนำคอร์สของครูพี่หนาม (Next.js App Router + TypeScript + Tailwind v4)

## เริ่มใช้งาน

```bash
npm install
npm run dev        # http://localhost:3000
```

| คำสั่ง | ทำอะไร |
|---|---|
| `npm run dev` | เปิดเว็บตอนพัฒนา |
| `npm run build` | ตรวจข้อมูลใน `content/` แล้ว build แบบ production (ข้อมูลผิด = build พัง) |
| `npm run check:content` | ตรวจข้อมูลใน `content/` อย่างเดียว |
| `npm run lint` | ESLint |
| `npm run typecheck` | ตรวจ type |
| `npm test` | Vitest (`npm run test:watch` สำหรับโหมดเฝ้าดู) |

CI บน GitHub Actions รัน lint, typecheck และ test ทุกครั้งที่ push

## โครง repo

```
src/            โค้ดเว็บ · import ด้วย @/...
  catalog/      module Catalog: แปลงข้อมูลใน content/ ให้พร้อมแสดงผล (มี test)
content/        ข้อมูลคอร์ส / เซ็ต / ข้อความบนเว็บ · import ด้วย @content/...
raw/            CSV ที่ export จาก Google Sheet
tools/          sheet-sync: แปลง raw/ → content/
docs/           requirement, schema, design mockup, ADR
public/         โลโก้และรูปครู
```

- แก้ข้อมูลคอร์ส / เซ็ต: ดู `docs/content.md`
- ต่อ Vercel และ env ที่ต้องตั้ง: ดู `docs/deploy-vercel.md`
- คำศัพท์ของโปรเจกต์: ดู `CONTEXT.md`
