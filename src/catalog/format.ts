// type และตัวช่วยที่หลายหน้าใน Catalog ใช้ร่วมกัน

import { formatPages, type CourseStats, type Group, type Site, type Subject } from '@content/types'

export type NavLink = { label: string; href: string }

export type Faq = { q: string; a: string }

/** ตัวเลขหนึ่งช่องในแถว ข้อสอบ / หน้า PDF / ชั่วโมงวิดีโอ */
export type Stat = { value: string; label: string }

/** สีกล่องแทนรูปปก จาก palette ของเว็บ */
export type CoverTone = 'sky' | 'wash' | 'ink'

/** รูปปกยังไม่มี ใช้กล่องสีตามกลุ่มไปก่อน · มีรูปแล้วใช้รูป */
export type Cover = { tone: CoverTone; image?: string }

/** ชื่อวิชาตามคอลัมน์ วิชา ในชีต (docs/data-schema.md) */
export const SUBJECT_LABEL: Record<Subject, string> = {
  science: 'วิทยาศาสตร์',
  biology: 'ชีววิทยา',
  chemistry: 'เคมี',
  physics: 'ฟิสิกส์',
  math: 'คณิตศาสตร์',
  applied_science: 'วิทยาศาสตร์ประยุกต์',
}

const COVER_TONE: Record<Group, CoverTone> = { prathom: 'sky', mton: 'wash', mplai: 'ink' }

export function cover(group: Group, image: string | undefined): Cover {
  const src = nonEmpty(image)
  return src ? { tone: COVER_TONE[group], image: src } : { tone: COVER_TONE[group] }
}

/** 1290 → "1,290.-" */
export function formatBaht(amount: number): string {
  return `${amount.toLocaleString('en-US')}.-`
}

/** ชื่อกลุ่มจาก site.json เช่น "ม.ปลาย" */
export function groupLabel(site: Site, group: Group): string {
  return site.groups.find((g) => g.key === group)?.label ?? group
}

/** ลิงก์ไปหน้ารายการคอร์สที่กรองกลุ่มนั้นไว้ */
export function groupLink(key: Group, label: string): NavLink {
  return { label, href: `/courses?group=${key}` }
}

/** ข้อความว่างหรือมีแต่ช่องว่าง คืน undefined ให้หน้าซ่อนช่องนั้น */
export function nonEmpty(value: string | undefined): string | undefined {
  return value?.trim() ? value.trim() : undefined
}

/** ค่า 0 นับว่าไม่มีข้อมูล จะได้ไม่ขึ้น "0 ชม." */
function present(value: number | undefined): value is number {
  return value != null && value > 0
}

/** แถว ข้อสอบ / หน้า PDF / ชั่วโมงวิดีโอ เฉพาะตัวที่มีค่า */
export function statsRow({ questionCount, pdfPages, videoHours }: CourseStats): Stat[] {
  const out: Stat[] = []
  if (present(questionCount)) out.push({ value: `${questionCount} ข้อ`, label: 'ข้อสอบ' })
  // หน้า PDF เป็นช่วงได้ ({min,max}) ตัวเลขเดี่ยวใช้กฎ 0 = ไม่มีข้อมูลเหมือนตัวอื่น
  const pages = typeof pdfPages === 'number' && !present(pdfPages) ? null : formatPages(pdfPages)
  if (pages) out.push({ value: pages, label: 'ไฟล์ PDF' })
  if (present(videoHours)) out.push({ value: `${videoHours} ชม.`, label: 'วิดีโอ' })
  return out
}
