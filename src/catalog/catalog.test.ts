import { describe, expect, it } from 'vitest'
import site from '@content/site.json'
import { catalog } from '.'
import { createCatalog } from './catalog'
import { testContent, testSite } from './test-content'

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
