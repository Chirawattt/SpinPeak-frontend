// หน้ารายการคอร์ส: การ์ดทุกใบคำนวณตอน build แล้วกรองตามตัวกรองใน URL
// ไฟล์นี้ต้องไม่ import ข้อมูลใน content/ ตรง ๆ เพราะหน้าเรียกใช้ฝั่ง client ด้วย (กรองตาม query string)

import type { Course, Group, Review, Site } from '@content/types'
import { buildCourseCard, type CourseCard } from './course-card'
import { listHref, type CourseFilters } from './course-filters'
import { nonEmpty, type Faq } from './format'

/** ข้อมูลทั้งหมดที่หน้ารายการต้องใช้ ส่งจาก server ไป client ได้ (เป็น JSON ล้วน) */
export type CourseListIndex = {
  items: { group: Group; card: CourseCard }[]
  /** แท็บกลุ่มตามลำดับใน site.json */
  groups: { key: Group; label: string }[]
  paging: Paging
}

/** โหลดเพิ่มเองเมื่อเลื่อน: ครั้งแรก first ใบ แล้วเพิ่มทีละ step ใบ (site.json → config) */
export type Paging = { first: number; step: number }

/** แท็บกลุ่ม · แท็บแรก "ทุกระดับชั้น" คือไม่กรองกลุ่ม */
export type GroupTab = {
  label: string
  /** เช่น "24 คอร์ส" */
  count: string
  href: string
  active: boolean
}

export type CourseList = {
  /** การ์ดที่ผ่านตัวกรอง เรียงตามลำดับในชีต */
  cards: CourseCard[]
  /** เช่น "พบ 24 คอร์ส" */
  resultText: string
  tabs: GroupTab[]
  paging: Paging
}

const ALL_GROUPS = 'ทุกระดับชั้น'


export function buildCourseListIndex(courses: Course[], site: Site): CourseListIndex {
  return {
    items: courses.map((c) => ({ group: c.group, card: buildCourseCard(c, site) })),
    groups: site.groups.map((g) => ({ key: g.key, label: g.label })),
    paging: { first: site.config.listPageSize, step: site.config.listPageIncrement },
  }
}

export function filterCourseList(index: CourseListIndex, filters: CourseFilters): CourseList {
  const cards = index.items.filter((item) => !filters.group || item.group === filters.group).map((item) => item.card)
  const countIn = (group?: Group) => index.items.filter((item) => !group || item.group === group).length
  const tabs: GroupTab[] = [
    { label: ALL_GROUPS, count: `${countIn()} คอร์ส`, href: listHref({}), active: !filters.group },
    ...index.groups.map((g) => ({
      label: g.label,
      count: `${countIn(g.key)} คอร์ส`,
      href: listHref({ group: g.key }),
      active: filters.group === g.key,
    })),
  ]
  return { cards, resultText: `พบ ${cards.length} คอร์ส`, tabs, paging: index.paging }
}

/** การ์ด "ไม่แน่ใจว่าเรียนอะไรดี" ท้ายหน้า · กดแล้วไปรายการที่กรองไว้ */
export type GoalLink = { title: string; desc: string; href: string }

export type ReviewQuote = { quote: string; by: string }

/** ส่วนท้ายหน้ารายการคอร์ส ที่ไม่ขึ้นกับตัวกรอง */
export type CoursesPage = {
  goals: GoalLink[]
  /** ว่างเมื่อ reviews.json ว่าง ให้ซ่อนทั้งส่วน */
  reviews: ReviewQuote[]
  faqs: Faq[]
  /** ไม่มีค่าเมื่อ site.json เว้นว่าง ให้ซ่อนบรรทัดนั้น */
  hours?: string
}

export function buildCoursesPage(site: Site, reviews: Review[]): CoursesPage {
  const hours = nonEmpty(site.contact.hours)
  return {
    // ตัวกรองหมวดหมู่ยังไม่มี (ticket #8) ลิงก์จึงกรองแค่กลุ่มไปก่อน
    goals: site.goalCards.map((g) => ({ title: g.title, desc: g.desc, href: listHref({ group: g.filter.group }) })),
    reviews: reviews.map((r) => ({ quote: r.quote, by: `${r.studentName} · ${r.grade}` })),
    faqs: site.faqs,
    ...(hours && { hours }),
  }
}
