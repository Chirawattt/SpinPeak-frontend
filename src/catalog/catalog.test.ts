import { describe, expect, it } from 'vitest'
import site from '@content/site.json'
import { catalog } from '.'
import { createCatalog } from './catalog'
import { testContent, testCourse, testSite } from './test-content'

describe('landing()', () => {
  it('returns hero stats in the order written in site.json', () => {
    const heroStats = [
      { value: '12', label: 'คอร์สทั้งหมด' },
      { value: 'ตลอดชีพ', label: 'ดูซ้ำได้ไม่จำกัด' },
    ]
    const { landing } = createCatalog(testContent({ site: testSite({ heroStats }) }))

    expect(landing().hero.stats).toEqual(heroStats)
  })

  it('shows the real hero stats from content/site.json', () => {
    expect(catalog.landing().hero.stats).toEqual(site.heroStats)
  })

  it('splits the hero title into lines at each newline', () => {
    const base = testSite()
    const { landing } = createCatalog(
      testContent({ site: testSite({ brand: { ...base.brand, heroTitle: 'เรียนชีวะให้เข้าใจ\nไม่ใช่แค่ท่องจำ' } }) }),
    )

    expect(landing().hero.titleLines).toEqual(['เรียนชีวะให้เข้าใจ', 'ไม่ใช่แค่ท่องจำ'])
  })

  it('names the hero photo after the main instructor, the first one in site.json', () => {
    const instructor = { slug: 'kru-nam', name: 'ครูพี่หนาม', role: '', shortBio: '', longBio: '', tags: [] }
    const other = { ...instructor, slug: 'kru-fon', name: 'ครูพี่ฝน' }
    const { landing } = createCatalog(testContent({ site: testSite({ instructors: [instructor, other] }) }))

    expect(landing().hero.photoAlt).toBe('ครูพี่หนาม')
  })
})

describe('footer()', () => {
  function footerWith(contact: Partial<ReturnType<typeof testSite>['contact']>) {
    const base = testSite()
    return createCatalog(testContent({ site: testSite({ contact: { ...base.contact, ...contact } }) })).footer()
  }

  it('hides email and opening hours when they are empty in site.json', () => {
    const footer = footerWith({ email: '', hours: '' })

    expect(footer.email).toBeUndefined()
    expect(footer.hours).toBeUndefined()
  })

  it('hides email and opening hours when site.json leaves them out', () => {
    const footer = footerWith({ email: undefined, hours: '   ' })

    expect(footer.email).toBeUndefined()
    expect(footer.hours).toBeUndefined()
  })

  it('shows email and opening hours once site.json has them', () => {
    const footer = footerWith({ email: 'hello@example.com', hours: 'จันทร์–เสาร์ 10:00–19:00 น.' })

    expect(footer.email).toBe('hello@example.com')
    expect(footer.hours).toBe('จันทร์–เสาร์ 10:00–19:00 น.')
  })

  it('links socials from site.json and never shows TikTok', () => {
    const footer = footerWith({
      instagram: { handle: 'krunam.spine', url: 'https://www.instagram.com/krunam.spine/' },
      facebook: { pageId: 'AlizBiotutor', url: 'https://www.facebook.com/AlizBiotutor' },
      tiktok: { handle: 'spinepeak', url: 'https://www.tiktok.com/@spinepeak' },
    })

    expect(footer.socials).toEqual([
      { kind: 'instagram', label: '@krunam.spine', href: 'https://www.instagram.com/krunam.spine/' },
      { kind: 'facebook', label: 'Spine Peak', href: 'https://www.facebook.com/AlizBiotutor' },
    ])
  })

  it('leaves Instagram out when site.json has no Instagram account', () => {
    const footer = footerWith({ instagram: undefined })

    expect(footer.socials.map((s) => s.kind)).toEqual(['facebook'])
  })

  it('links each group to the course list filtered by that group', () => {
    const { footer } = createCatalog(testContent())

    expect(footer().groups).toEqual([
      { label: 'ประถม', href: '/courses?group=prathom' },
      { label: 'ม.ต้น', href: '/courses?group=mton' },
      { label: 'ม.ปลาย', href: '/courses?group=mplai' },
    ])
  })
})

describe('landing() sections', () => {
  const clip = { title: 'ไมโอซิส', sourceLabel: 'ตัดจากคอร์ส ม.ปลาย', minutes: 8, youtubeUrl: 'https://youtu.be/x' }
  const review = { id: 'r1', quote: 'คุ้มมากครับ', studentName: 'น้องเจได', grade: 'ม.4' }
  const courses = [
    testCourse({ slug: 'a', group: 'mplai' }),
    testCourse({ slug: 'b', group: 'mplai' }),
    testCourse({ slug: 'c', group: 'prathom' }),
  ]
  const landingOf = (over: Parameters<typeof testContent>[0] = {}) => createCatalog(testContent({ courses, ...over })).landing()

  it('gives one entry per group with its real course count, linking to the filtered list', () => {
    expect(landingOf().groups).toEqual([
      { label: 'ประถม', count: '1 คอร์ส', href: '/courses?group=prathom' },
      { label: 'ม.ต้น', count: '0 คอร์ส', href: '/courses?group=mton' },
      { label: 'ม.ปลาย', count: '2 คอร์ส', href: '/courses?group=mplai' },
    ])
  })

  it('counts the real courses per group on content/', () => {
    expect(catalog.landing().groups.map((g) => g.count)).toEqual(['8 คอร์ส', '12 คอร์ส', '24 คอร์ส'])
  })

  it('introduces the main instructor from site.json', () => {
    const instructor = { slug: 'kru-nam', name: 'ครูพี่หนาม', role: '', shortBio: 'สั้น', longBio: 'ยาว', tags: ['สอนจากข้อสอบจริง'] }

    expect(landingOf({ site: testSite({ instructors: [instructor] }) }).teacher).toEqual({
      name: 'ครูพี่หนาม',
      bio: 'ยาว',
      tags: ['สอนจากข้อสอบจริง'],
    })
  })

  it('hides clips and reviews, and the links to them, while clips.json and reviews.json are empty', () => {
    const landing = landingOf({ clips: [], reviews: [] })

    expect(landing.clips).toEqual([])
    expect(landing.reviews).toEqual([])
    expect(landing.hero.showClipsLink).toBe(false)
    expect(landing.nav.map((l) => l.href)).not.toContain('/#reviews')
  })

  it('shows them once there are some', () => {
    const landing = landingOf({ clips: [clip], reviews: [review] })

    expect(landing.clips).toEqual([{ title: 'ไมโอซิส', meta: 'ตัดจากคอร์ส ม.ปลาย · 8 นาที', href: 'https://youtu.be/x' }])
    expect(landing.reviews).toEqual([{ quote: 'คุ้มมากครับ', by: 'น้องเจได · ม.4' }])
    expect(landing.hero.showClipsLink).toBe(true)
    expect(landing.nav.map((l) => l.href)).toContain('/#reviews')
  })

  it('always links the teacher section in the menu, and shows the FAQ from site.json', () => {
    const faqs = [{ q: 'ดูได้นานแค่ไหน', a: 'ตลอดชีพ' }]
    const landing = landingOf({ site: testSite({ faqs }) })

    expect(landing.nav.map((l) => l.href)).toEqual(['/courses', '/sets', '/#teacher'])
    expect(landing.faqs).toEqual(faqs)
  })
})
