// Catalog: รับข้อมูลจาก content/ แล้วคืนข้อมูลที่พร้อมให้แต่ละหน้าแสดง
// ตัดสินเรื่องแสดง / ซ่อน / คำนวณไว้ครบที่นี่ หน้า React แค่ render ตามนั้น

import type { Clip, Course, CourseSet, Review, Site } from '@content/types'
import { buildCourseDetail, type CourseDetail } from './course-detail'
import { groupLink, nonEmpty, type NavLink } from './format'
import { validateContent } from './validate-content'

export type Content = {
  courses: Course[]
  sets: CourseSet[]
  site: Site
  reviews: Review[]
  clips: Clip[]
}

export type HeroStat = { value: string; label: string }

export type Landing = {
  hero: {
    badge: string
    /** heroTitle ใน site.json มี \n ตัดบรรทัดตามนั้น */
    titleLines: string[]
    subtitle: string
    stats: HeroStat[]
    /** ชื่อผู้สอนหลัก ใช้เป็น alt ของรูปใน hero */
    photoAlt: string
  }
}

export type SocialLink = { kind: 'instagram' | 'facebook'; label: string; href: string }

export type Footer = {
  blurb: string
  groups: NavLink[]
  /** ไม่มีค่าเมื่อ site.json เว้นว่าง ให้ซ่อนบรรทัดนั้น */
  hours?: string
  /** ไม่มีค่าเมื่อ site.json เว้นว่าง ให้ซ่อนบรรทัดนั้น */
  email?: string
  /** ไม่มี TikTok: ตัดออกในเฟส 1 แม้ site.json จะมีก็ตาม */
  socials: SocialLink[]
}

export function createCatalog(content: Content) {
  const { site, courses } = content

  function landing(): Landing {
    return {
      hero: {
        badge: site.brand.heroBadge,
        titleLines: site.brand.heroTitle.split('\n'),
        subtitle: site.brand.heroSubtitle,
        stats: site.heroStats,
        // ผู้สอนหลักคือคนแรกใน site.json
        photoAlt: site.instructors[0]?.name ?? site.brand.name,
      },
    }
  }

  function siteInfo() {
    return { name: site.brand.name, description: site.brand.heroSubtitle }
  }

  function footer(): Footer {
    const { instagram, facebook } = site.contact
    const socials: SocialLink[] = []
    if (instagram) socials.push({ kind: 'instagram', label: `@${instagram.handle}`, href: instagram.url })
    socials.push({ kind: 'facebook', label: site.brand.name, href: facebook.url })

    return {
      blurb: site.brand.footerBlurb,
      groups: site.groups.map((g) => groupLink(g.key, g.label)),
      hours: nonEmpty(site.contact.hours),
      email: nonEmpty(site.contact.email),
      socials,
    }
  }

  /** undefined เมื่อไม่มีคอร์ส slug นี้ ให้หน้าขึ้น 404 */
  function courseDetail(slug: string): CourseDetail | undefined {
    const course = courses.find((c) => c.slug === slug)
    return course && buildCourseDetail(course, site)
  }

  return {
    siteInfo,
    landing,
    footer,
    courseDetail,
    /** slug ของทุกคอร์ส ใช้ build หน้ารายละเอียดล่วงหน้า */
    courseSlugs: () => courses.map((c) => c.slug),
    /** รายการปัญหาของข้อมูล ว่างแปลว่าผ่าน */
    validateContent: () => validateContent(content),
  }
}

export type Catalog = ReturnType<typeof createCatalog>
