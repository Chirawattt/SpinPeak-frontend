// ข้อมูลตัวอย่างเล็ก ๆ สำหรับ test ของ Catalog
// test ใช้ข้อมูลนี้แทน content/ จริง เพื่อคุมกรณีขอบได้และไม่พังเมื่อชีตเปลี่ยน

import type { Site } from '@content/types'
import type { Content } from './catalog'

export function testSite(overrides: Partial<Site> = {}): Site {
  return {
    brand: {
      name: 'Spine Peak',
      logo: '',
      heroBadge: 'ป้ายบน hero',
      heroTitle: 'บรรทัดแรก\nบรรทัดสอง',
      heroSubtitle: 'คำโปรย',
      footerBlurb: 'ข้อความท้ายเว็บ',
    },
    heroStats: [
      { value: '3', label: 'คอร์สทั้งหมด' },
      { value: '1', label: 'เซ็ตราคาพิเศษ' },
    ],
    instructors: [],
    contact: {
      line: { basicId: '@test', prefillTemplate: 'สนใจ {itemTitle}' },
      facebook: { pageId: 'testpage', url: 'https://www.facebook.com/testpage' },
      instagram: { handle: 'test.ig', url: 'https://www.instagram.com/test.ig/' },
      email: '',
      hours: '',
    },
    goalCards: [],
    faqs: [],
    config: {
      lifetimeLabel: 'ตลอดชีพ',
      savingsBadge: { minPercent: 10, minBaht: 100 },
      listPageSize: 9,
      listPageIncrement: 6,
    },
    groups: [
      { key: 'prathom', label: 'ประถม' },
      { key: 'mton', label: 'ม.ต้น' },
      { key: 'mplai', label: 'ม.ปลาย' },
    ],
    ...overrides,
  }
}

export function testContent(overrides: Partial<Content> = {}): Content {
  return {
    courses: [],
    sets: [],
    site: testSite(),
    reviews: [],
    clips: [],
    ...overrides,
  }
}
