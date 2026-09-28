// ข้อมูลหน้ารายละเอียดคอร์ส: ช่องที่ไม่มีข้อมูลถูกตัดทิ้งที่นี่แล้ว หน้า React ไม่ต้องเช็กเอง

import { formatPages, type Course, type Site } from '@content/types'
import type { ContactItem } from '@/contact'
import { cover, formatBaht, groupLink, nonEmpty, type Cover, type Faq, type NavLink } from './format'

export type Stat = { value: string; label: string }

export type CourseInstructor = { name: string; role: string; bio: string; photo?: string }

/** ส่วน "เนื้อหาในคอร์ส" · ทั้งก้อนเป็น undefined เมื่อไม่มีทั้งหัวข้อและบท */
export type CourseContent = {
  points?: string[]
  /** เช่น "6 บท" */
  chapterCount?: string
  /** เช่น "บทที่ 1 · เซลล์" */
  chapters?: string[]
}

export type CourseDetail = {
  slug: string
  title: string
  tagline: string
  group: NavLink
  category: string
  /** ป้ายบนหัวหน้า เช่น "ม.ปลาย · สอวน." · หมวดหมู่ชื่อซ้ำกับกลุ่มแสดงครั้งเดียว */
  badge: string
  cover: Cover
  /** ไม่มีค่าเมื่อคอร์สเปิดรับตามปกติ */
  statusLabel?: string
  /** ราคาเดียว คอร์สเดี่ยวไม่มีราคาขีดฆ่า */
  price: string
  /** เช่น "ดูได้ตลอดชีพ" */
  lifetime: string
  /** ข้อสอบ / หน้า PDF / ชั่วโมงวิดีโอ เฉพาะตัวที่มีค่า */
  stats: Stat[]
  content?: CourseContent
  forWho?: string[]
  deliverables?: string
  instructor?: CourseInstructor
  faqs: Faq[]
  contactItem: ContactItem
}

/** ค่า 0 นับว่าไม่มีข้อมูล จะได้ไม่ขึ้น "0 ชม." */
function present(value: number | undefined): value is number {
  return value != null && value > 0
}

function courseStats({ questionCount, pdfPages, videoHours }: Course['stats']): Stat[] {
  const out: Stat[] = []
  if (present(questionCount)) out.push({ value: `${questionCount} ข้อ`, label: 'ข้อสอบ' })
  // หน้า PDF เป็นช่วงได้ ({min,max}) ตัวเลขเดี่ยวใช้กฎ 0 = ไม่มีข้อมูลเหมือนตัวอื่น
  const pages = typeof pdfPages === 'number' && !present(pdfPages) ? null : formatPages(pdfPages)
  if (pages) out.push({ value: pages, label: 'ไฟล์ PDF' })
  if (present(videoHours)) out.push({ value: `${videoHours} ชม.`, label: 'วิดีโอ' })
  return out
}

/** รายการที่ว่างหรือมีแต่ช่องว่าง คืน undefined ให้หน้าซ่อน section นั้น */
function nonEmptyList(items: string[]): string[] | undefined {
  const kept = items.map((i) => i.trim()).filter(Boolean)
  return kept.length > 0 ? kept : undefined
}

function courseContent(course: Course): CourseContent | undefined {
  const points = nonEmptyList(course.contentPoints)
  const chapters = nonEmptyList(course.chapters.map((c) => c.title))
  if (!points && !chapters) return undefined
  return {
    ...(points && { points }),
    ...(chapters && {
      chapterCount: `${chapters.length} บท`,
      chapters: chapters.map((title, i) => `บทที่ ${i + 1} · ${title}`),
    }),
  }
}

function statusLabel(course: Course): string | undefined {
  if (course.status !== 'coming_soon') return undefined
  return course.openDate ? `เร็ว ๆ นี้ · เปิด ${course.openDate}` : 'เร็ว ๆ นี้'
}

function courseInstructor(course: Course, site: Site): CourseInstructor | undefined {
  const instructor = site.instructors.find((i) => i.slug === course.instructorSlug)
  if (!instructor) return undefined
  const photo = nonEmpty(instructor.photoAvatar)
  return { name: instructor.name, role: instructor.role, bio: instructor.shortBio, ...(photo && { photo }) }
}

export function buildCourseDetail(course: Course, site: Site): CourseDetail {
  const groupLabel = site.groups.find((g) => g.key === course.group)?.label ?? course.group

  return {
    slug: course.slug,
    title: nonEmpty(course.fullTitle) ?? course.title,
    tagline: course.tagline,
    group: groupLink(course.group, groupLabel),
    category: course.category,
    badge: course.category === groupLabel ? groupLabel : `${groupLabel} · ${course.category}`,
    cover: cover(course.group, course.coverImage),
    statusLabel: statusLabel(course),
    price: formatBaht(course.price),
    lifetime: `ดูได้${site.config.lifetimeLabel}`,
    stats: courseStats(course.stats),
    content: courseContent(course),
    forWho: nonEmptyList(course.forWho),
    deliverables: nonEmpty(course.deliverables),
    instructor: courseInstructor(course, site),
    faqs: [...(course.faqs ?? []), ...site.faqs],
    contactItem: { kind: 'course', slug: course.slug, title: course.title },
  }
}
