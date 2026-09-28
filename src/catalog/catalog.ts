// Catalog: รับข้อมูลจาก content/ แล้วคืนข้อมูลที่พร้อมให้แต่ละหน้าแสดง
// ตัดสินเรื่องแสดง / ซ่อน / คำนวณไว้ครบที่นี่ หน้า React แค่ render ตามนั้น

import type { Clip, Course, CourseSet, Review, Site } from '@content/types'
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
  groups: { label: string; href: string }[]
  /** ไม่มีค่าเมื่อ site.json เว้นว่าง ให้ซ่อนบรรทัดนั้น */
  hours?: string
  /** ไม่มีค่าเมื่อ site.json เว้นว่าง ให้ซ่อนบรรทัดนั้น */
  email?: string
  /** ไม่มี TikTok: ตัดออกในเฟส 1 แม้ site.json จะมีก็ตาม */
  socials: SocialLink[]
}

function nonEmpty(value: string | undefined): string | undefined {
  return value?.trim() ? value.trim() : undefined
}

export function createCatalog(content: Content) {
  const { site } = content

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
      groups: site.groups.map((g) => ({ label: g.label, href: `/courses?group=${g.key}` })),
      hours: nonEmpty(site.contact.hours),
      email: nonEmpty(site.contact.email),
      socials,
    }
  }

  return {
    siteInfo,
    landing,
    footer,
    /** รายการปัญหาของข้อมูล ว่างแปลว่าผ่าน */
    validateContent: () => validateContent(content),
  }
}

export type Catalog = ReturnType<typeof createCatalog>
