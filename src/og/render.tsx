import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import type { OgCard } from '@/catalog'

// รูป OG ทุกใบวาดที่นี่: พื้นสีจาก palette ของเว็บ + โลโก้ + ข้อมูลจาก catalog (src/catalog/og.ts)
// satori รองรับแค่ flexbox และต้องฝังฟอนต์เอง ใช้ Anuphan ตัวเดียวกับหัวข้อบนเว็บ ไม่งั้นตัวไทยกลายเป็นกล่อง

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

const BRAND = '#85E5FF'
const INK = '#0B2B33'
const WASH = '#E6F9FF'
const STRIKE = '#4A6C75'

// อ่านครั้งเดียวต่อ process ไม่ใช่ทุกรูป (71 รูปตอน build)
// satori อ่าน variable font ไม่ได้ (พังตอนอ่านตาราง glyph) จึงใช้ Anuphan 700 แบบ static แยกชุดอักษรไทยกับละติน (@fontsource/anuphan, OFL)
const read = (path: string) => readFile(join(process.cwd(), path))
const assets = Promise.all([read('assets/anuphan-thai-700.woff'), read('assets/anuphan-latin-700.woff'), read('public/spine-peak-logo.png')])

export async function renderOg(card: OgCard, siteName: string): Promise<ImageResponse> {
  const [thai, latin, logo] = await assets
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`
  // ชื่อยาวลดขนาดลง ให้พอดีสามบรรทัด
  const titleSize = card.title.length > 60 ? 46 : card.title.length > 36 ? 56 : 68

  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: BRAND, color: INK, fontFamily: 'Anuphan', padding: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- satori วาดด้วย <img> ธรรมดา ไม่ใช่ next/image */}
          <img src={logoSrc} width={72} height={72} alt="" style={{ borderRadius: 36 }} />
          <div style={{ display: 'flex', marginLeft: 18, fontSize: 34, fontWeight: 700 }}>{siteName}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', background: '#FFFFFF', borderRadius: 32, marginTop: 28, padding: '36px 48px' }}>
          {card.eyebrow && <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: '#12707F', marginBottom: 14 }}>{card.eyebrow}</div>}
          <div style={{ display: 'flex', fontSize: titleSize, fontWeight: 700, lineHeight: 1.2, lineClamp: 3 }}>{card.title}</div>
          {card.tagline && <div style={{ display: 'flex', fontSize: 30, lineHeight: 1.5, color: STRIKE, marginTop: 14, lineClamp: 2 }}>{card.tagline}</div>}

          {(card.price || card.badges.length > 0) && (
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginTop: 26 }}>
              {card.price && <div style={{ display: 'flex', fontSize: 64, fontWeight: 700, marginRight: 20 }}>{card.price}</div>}
              {card.regularPrice && <div style={{ display: 'flex', fontSize: 34, color: STRIKE, textDecoration: 'line-through', marginRight: 24 }}>{card.regularPrice}</div>}
              {card.badges.map((badge) => (
                <div key={badge} style={{ display: 'flex', fontSize: 26, fontWeight: 700, background: WASH, border: `2px solid ${BRAND}`, borderRadius: 999, padding: '8px 22px', marginRight: 12 }}>
                  {badge}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [
      { name: 'Anuphan', data: thai, weight: 700, style: 'normal' },
      { name: 'Anuphan', data: latin, weight: 700, style: 'normal' },
    ] },
  )
}
