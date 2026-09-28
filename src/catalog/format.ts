// type และตัวช่วยที่หลายหน้าใน Catalog ใช้ร่วมกัน

import type { Group } from '@content/types'

export type NavLink = { label: string; href: string }

export type Faq = { q: string; a: string }

/** สีกล่องแทนรูปปก จาก palette ของเว็บ */
export type CoverTone = 'sky' | 'wash' | 'ink'

/** รูปปกยังไม่มี ใช้กล่องสีตามกลุ่มไปก่อน · มีรูปแล้วใช้รูป */
export type Cover = { tone: CoverTone; image?: string }

const COVER_TONE: Record<Group, CoverTone> = { prathom: 'sky', mton: 'wash', mplai: 'ink' }

export function cover(group: Group, image: string | undefined): Cover {
  const src = nonEmpty(image)
  return src ? { tone: COVER_TONE[group], image: src } : { tone: COVER_TONE[group] }
}

/** 1290 → "1,290.-" */
export function formatBaht(amount: number): string {
  return `${amount.toLocaleString('en-US')}.-`
}

/** ลิงก์ไปหน้ารายการคอร์สที่กรองกลุ่มนั้นไว้ */
export function groupLink(key: Group, label: string): NavLink {
  return { label, href: `/courses?group=${key}` }
}

/** ข้อความว่างหรือมีแต่ช่องว่าง คืน undefined ให้หน้าซ่อนช่องนั้น */
export function nonEmpty(value: string | undefined): string | undefined {
  return value?.trim() ? value.trim() : undefined
}
