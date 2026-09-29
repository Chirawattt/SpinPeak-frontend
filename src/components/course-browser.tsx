'use client'

// ส่วนที่กรองตาม URL ของหน้ารายการคอร์ส · หน้า build แบบ static แล้วมากรองฝั่ง client ตาม query string
// import จาก course-filters / course-list ตรง ๆ ไม่ผ่าน '@/catalog' เพราะตัวนั้นโหลดข้อมูล content/ ทั้งก้อนเข้ามาใน bundle

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { filtersToQuery, parseFilters, type CourseFilters } from '@/catalog/course-filters'
import { filterCourseList, type CourseListIndex } from '@/catalog/course-list'
import { CourseCard } from '@/components/course-card'

function useFilters(): CourseFilters {
  return parseFilters(useSearchParams())
}

/** แท็บกลุ่มตามตัวกรองใน URL · ใช้ใน <Suspense> */
export function GroupTabsFromUrl({ index }: { index: CourseListIndex }) {
  return <GroupTabs index={index} filters={useFilters()} />
}

/** แท็บกลุ่ม · กดแล้วเปลี่ยน URL จึงแชร์ลิงก์ได้และกดย้อนกลับได้ */
export function GroupTabs({ index, filters }: { index: CourseListIndex; filters: CourseFilters }) {
  const { tabs } = filterCourseList(index, filters)
  return (
    <nav aria-label="กลุ่ม" className="flex flex-wrap gap-2.5">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          scroll={false}
          aria-current={tab.active ? 'page' : undefined}
          className={`rounded-full border-[1.5px] px-[26px] py-3 font-heading text-[17px] font-semibold transition-colors ${
            tab.active ? 'border-ink bg-ink text-white' : 'border-outline bg-white hover:border-brand'
          }`}
        >
          {tab.label} <span className="text-sm font-normal opacity-70">{tab.count}</span>
        </Link>
      ))}
    </nav>
  )
}

/** กริดการ์ดตามตัวกรองใน URL · ใช้ใน <Suspense> · key ตามตัวกรอง จำนวนที่โหลดจึงนับใหม่เมื่อเปลี่ยนตัวกรอง */
export function CourseGridFromUrl({ index }: { index: CourseListIndex }) {
  const filters = useFilters()
  return <CourseGrid key={filtersToQuery(filters)} index={index} filters={filters} />
}

/** กริดการ์ด โหลดเพิ่มเองเมื่อเลื่อนถึงท้ายรายการ */
export function CourseGrid({ index, filters }: { index: CourseListIndex; filters: CourseFilters }) {
  const { cards, resultText, paging } = filterCourseList(index, filters)
  const [shown, setShown] = useState(paging.first)
  const sentinel = useRef<HTMLDivElement>(null)
  const hasMore = shown < cards.length

  useEffect(() => {
    const el = sentinel.current
    if (!el || !hasMore) return
    // สร้างใหม่ทุกครั้งที่โหลดเพิ่ม: ถ้าจอสูงจนตัวท้ายยังเห็นอยู่ observer ตัวใหม่จะเรียกซ้ำให้เอง
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setShown((n) => n + paging.step)
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [shown, hasMore, paging.step])

  return (
    <>
      <p className="px-gutter pt-[26px] pb-2.5 font-mono text-[13px] font-semibold text-link-hover" aria-live="polite">
        {resultText}
      </p>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-[22px] px-gutter pt-3 pb-5">
        {cards.slice(0, shown).map((card) => (
          <li key={card.slug} className="flex">
            <CourseCard card={card} />
          </li>
        ))}
      </ul>
      {hasMore && (
        <div ref={sentinel} className="px-gutter pt-5 pb-10 text-center font-mono text-sm text-muted">
          กำลังโหลดคอร์สเพิ่ม…
        </div>
      )}
    </>
  )
}
