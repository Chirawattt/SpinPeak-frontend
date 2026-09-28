import { Anuphan, IBM_Plex_Mono, IBM_Plex_Sans_Thai } from 'next/font/google'

/** หัวข้อ */
export const anuphan = Anuphan({
  weight: ['600', '700'],
  subsets: ['thai', 'latin'],
  variable: '--font-anuphan',
})

/** เนื้อความ · ที่ design ใช้ 500 ให้ใช้ 600 แทน */
export const plexThai = IBM_Plex_Sans_Thai({
  weight: ['400', '600'],
  subsets: ['thai', 'latin'],
  variable: '--font-plex-thai',
})

/** ตัวอักษรละตินเล็ก ๆ เช่นป้ายกำกับ */
export const plexMono = IBM_Plex_Mono({
  weight: '500',
  subsets: ['latin'],
  variable: '--font-plex-mono',
})
