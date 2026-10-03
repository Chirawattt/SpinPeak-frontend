'use client'

// ส่วนที่กรองตาม URL ของหน้ารายการคอร์ส · หน้า build แบบ static แล้วมากรองฝั่ง client ตาม query string
// import จาก course-filters / course-list ตรง ๆ ไม่ผ่าน '@/catalog' เพราะตัวนั้นโหลดข้อมูล content/ ทั้งก้อนเข้ามาใน bundle

import { useSearchParams } from 'next/navigation'
import type { ReactNode } from 'react'
import { filtersToQuery, parseFilters, type CourseFilters } from '@/catalog/course-filters'
import { filterCourseList, type CourseListIndex } from '@/catalog/course-list'
import { CourseCard } from '@/components/course-card'
import { FilterBar, PagedGrid, TabNav } from '@/components/list-browser'

function useFilters(): CourseFilters {
  return parseFilters(useSearchParams())
}

/** แท็บกลุ่มตามตัวกรองใน URL · ใช้ใน <Suspense> */
export function GroupTabsFromUrl({ index }: { index: CourseListIndex }) {
  return <GroupTabs index={index} filters={useFilters()} />
}

export function GroupTabs({ index, filters }: { index: CourseListIndex; filters: CourseFilters }) {
  return <TabNav tabs={filterCourseList(index, filters).tabs} />
}

/** แถบกรองสาย + ค้นหา + ล้างตัวกรอง ตามตัวกรองใน URL · ใช้ใน <Suspense> */
export function FilterBarFromUrl({ index }: { index: CourseListIndex }) {
  const filters = useFilters()
  return <CourseFilterBar key={filtersToQuery(filters)} index={index} filters={filters} />
}

export function CourseFilterBar({ index, filters }: { index: CourseListIndex; filters: CourseFilters }) {
  const { trackOptions, clearHref } = filterCourseList(index, filters)
  return (
    <FilterBar
      base="/courses"
      filters={filters}
      trackOptions={trackOptions}
      clearHref={clearHref}
      placeholder="ค้นหาคอร์ส เช่น สอวน. ชีวะ"
      label="ค้นหาคอร์ส"
    />
  )
}

/** กริดการ์ดตามตัวกรองใน URL · ใช้ใน <Suspense> · key ตามตัวกรอง จำนวนที่โหลดจึงนับใหม่เมื่อเปลี่ยนตัวกรอง */
export function CourseGridFromUrl({ index, emptyAction }: { index: CourseListIndex; emptyAction?: ReactNode }) {
  const filters = useFilters()
  return <CourseGrid key={filtersToQuery(filters)} index={index} filters={filters} emptyAction={emptyAction} />
}

export function CourseGrid({ index, filters, emptyAction }: { index: CourseListIndex; filters: CourseFilters; emptyAction?: ReactNode }) {
  const list = filterCourseList(index, filters)
  return (
    <PagedGrid
      cards={list.cards}
      resultText={list.resultText}
      paging={list.paging}
      empty={list.empty}
      clearHref={list.clearHref}
      emptyTitle="ยังไม่เจอคอร์สที่ตรงกับที่ค้นหา"
      emptyHint="ลองเปลี่ยนคำค้นหา หรือทักมาบอกแอดมินว่าน้องอยากเรียนอะไร จะช่วยเลือกให้"
      emptyAction={emptyAction}
      loadingText="กำลังโหลดคอร์สเพิ่ม…"
      renderCard={(card) => <CourseCard card={card} />}
    />
  )
}
