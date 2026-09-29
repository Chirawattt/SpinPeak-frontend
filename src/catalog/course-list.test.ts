import { describe, expect, it } from 'vitest'
import { catalog as realCatalog } from '.'
import { createCatalog } from './catalog'
import { filtersToQuery, parseFilters } from './course-filters'
import { testContent, testCourse, testSite } from './test-content'

// คอร์สตัวอย่างตามลำดับในชีต: กลุ่มสลับกันเพื่อให้เห็นว่าไม่ได้เรียงตามกลุ่ม
const courses = [
  testCourse({ slug: 'posn-biology-68', group: 'mplai' }),
  testCourse({ slug: 'primary-science-p4', group: 'prathom' }),
  testCourse({ slug: 'foundation-science-m1-term-1', group: 'mton' }),
  testCourse({ slug: 'a-level-biology-68', group: 'mplai' }),
]
const catalog = createCatalog(testContent({ courses }))

describe('courseList()', () => {
  it('lists every course in sheet order when no group is chosen', () => {
    const list = catalog.courseList({})

    expect(list.cards.map((c) => c.slug)).toEqual([
      'posn-biology-68',
      'primary-science-p4',
      'foundation-science-m1-term-1',
      'a-level-biology-68',
    ])
    expect(list.resultText).toBe('พบ 4 คอร์ส')
  })

  it('keeps only the courses of the chosen group, still in sheet order', () => {
    const list = catalog.courseList({ group: 'mplai' })

    expect(list.cards.map((c) => c.slug)).toEqual(['posn-biology-68', 'a-level-biology-68'])
    expect(list.resultText).toBe('พบ 2 คอร์ส')
  })

  it('gives one tab per group with how many courses it has, marking the chosen one', () => {
    expect(catalog.courseList({ group: 'mplai' }).tabs).toEqual([
      { label: 'ทุกระดับชั้น', count: '4 คอร์ส', href: '/courses', active: false },
      { label: 'ประถม', count: '1 คอร์ส', href: '/courses?group=prathom', active: false },
      { label: 'ม.ต้น', count: '1 คอร์ส', href: '/courses?group=mton', active: false },
      { label: 'ม.ปลาย', count: '2 คอร์ส', href: '/courses?group=mplai', active: true },
    ])
  })

  it('marks the all-groups tab when no group is chosen', () => {
    expect(catalog.courseList({}).tabs.filter((t) => t.active).map((t) => t.label)).toEqual(['ทุกระดับชั้น'])
  })

  it('labels each card with its subject and the lifetime badge', () => {
    const list = createCatalog(testContent({ courses: [testCourse({ subject: 'chemistry' })] })).courseList({})

    expect(list.cards[0]).toMatchObject({ subject: 'เคมี', lifetime: 'ดูได้ตลอดชีพ' })
  })

  it('never puts a zero or an empty number on a card', () => {
    const empty = testCourse({ slug: 'empty-stats', stats: { questionCount: 0, videoHours: 0 } })
    const partial = testCourse({ slug: 'partial-stats', stats: { questionCount: 0, pdfPages: { min: 30, max: 70 } } })
    const cards = createCatalog(testContent({ courses: [empty, partial] })).courseList({}).cards

    expect(cards[0]).not.toHaveProperty('facts')
    expect(cards[1]?.facts).toBe('30-70 หน้า')
  })

  it('pages the grid by the sizes in site.json: first page, then more per scroll', () => {
    expect(catalog.courseList({}).paging).toEqual({ first: 9, step: 6 })
  })
})

describe('parseFilters() / filtersToQuery()', () => {
  it.each([{}, { group: 'prathom' as const }, { group: 'mplai' as const }])('turns %o into a query and back unchanged', (filters) => {
    expect(parseFilters(new URLSearchParams(filtersToQuery(filters)))).toEqual(filters)
  })

  it('writes the group into the query so the link can be shared', () => {
    expect(filtersToQuery({ group: 'mplai' })).toBe('group=mplai')
    expect(filtersToQuery({})).toBe('')
  })

  it('treats a value it does not know as no filter at all', () => {
    expect(parseFilters(new URLSearchParams('group=university'))).toEqual({})
    expect(parseFilters(new URLSearchParams('group='))).toEqual({})
  })

  it('ignores query keys it does not know', () => {
    expect(parseFilters(new URLSearchParams('group=mton&utm_source=line&page=3'))).toEqual({ group: 'mton' })
  })
})

// ตัวเลขของ content/ จริงวันนี้ · ถ้าชีตเพิ่มหรือลบคอร์ส ให้แก้ตัวเลขในเทสต์นี้ตาม (เทสต์นี้ไม่ได้รันก่อน build)
describe('courseList() on the real content', () => {
  it('counts 44 courses in all, 8 in ประถม, 12 in ม.ต้น and 24 in ม.ปลาย', () => {
    expect(realCatalog.courseList({}).tabs.map((t) => [t.label, t.count])).toEqual([
      ['ทุกระดับชั้น', '44 คอร์ส'],
      ['ประถม', '8 คอร์ส'],
      ['ม.ต้น', '12 คอร์ส'],
      ['ม.ปลาย', '24 คอร์ส'],
    ])
  })
})

describe('coursesPage()', () => {
  it('turns each goal card in site.json into a link to the list filtered by its group', () => {
    const site = testSite({
      goalCards: [
        { title: 'อยู่ ม.ต้น อยากสอบเข้า ม.4', desc: 'ปรับพื้นฐานวิทย์', filter: { group: 'mton', category: 'สอบเข้า ม.4' } },
        { title: 'สายแข่งวิชาการ', desc: 'สอวน. สวช.', filter: { category: 'แข่งขันวิชาการ' } },
      ],
    })

    expect(createCatalog(testContent({ site })).coursesPage().goals).toEqual([
      { title: 'อยู่ ม.ต้น อยากสอบเข้า ม.4', desc: 'ปรับพื้นฐานวิทย์', href: '/courses?group=mton' },
      { title: 'สายแข่งวิชาการ', desc: 'สอวน. สวช.', href: '/courses' },
    ])
  })

  it('has no reviews while reviews.json is empty, so the page hides that part', () => {
    expect(createCatalog(testContent({ reviews: [] })).coursesPage().reviews).toEqual([])
  })

  it('shows each review with who wrote it once reviews.json has some', () => {
    const reviews = [{ id: 'r1', quote: 'คุ้มมากครับ', studentName: 'น้องเจได', grade: 'ม.4' }]

    expect(createCatalog(testContent({ reviews })).coursesPage().reviews).toEqual([{ quote: 'คุ้มมากครับ', by: 'น้องเจได · ม.4' }])
  })

  it('shows the FAQ from site.json, and the office hours only when site.json has them', () => {
    const faqs = [{ q: 'เรียนข้ามชั้นได้ไหม', a: 'ได้' }]
    const page = (hours: string) => createCatalog(testContent({ site: testSite({ faqs, contact: { ...testSite().contact, hours } }) })).coursesPage()

    expect(page('').faqs).toEqual(faqs)
    expect(page('')).not.toHaveProperty('hours')
    expect(page('จันทร์–เสาร์ 10:00–19:00 น.').hours).toBe('จันทร์–เสาร์ 10:00–19:00 น.')
  })
})
