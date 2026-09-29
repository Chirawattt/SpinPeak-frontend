// ตัวกรองของหน้ารายการคอร์สกับ query string ใน URL · ที่เดียวที่รู้ว่า URL ของหน้ารายการหน้าตาเป็นอย่างไร
// ไม่มี dependency นอกจาก type จึงใช้ได้ทั้งฝั่ง server และ client

import type { Group } from '@content/types'

export type CourseFilters = { group?: Group }

/** ค่า group ที่ยอมรับใน URL · satisfies บังคับให้ครบทุกค่าใน type Group */
const GROUP_KEYS = { prathom: true, mton: true, mplai: true } satisfies Record<Group, true>

function isGroup(value: string | null): value is Group {
  return value != null && Object.hasOwn(GROUP_KEYS, value)
}

/** query string → ตัวกรอง · ค่าหรือ key ที่ไม่รู้จักถือว่าไม่ได้กรอง ลิงก์เก่าหรือพิมพ์ผิดจะได้ไม่พัง */
export function parseFilters(params: { get(name: string): string | null }): CourseFilters {
  const group = params.get('group')
  return isGroup(group) ? { group } : {}
}

/** ตัวกรอง → query string ที่ไม่มี "?" นำหน้า · ไม่กรองอะไรเลยได้ "" */
export function filtersToQuery(filters: CourseFilters): string {
  const params = new URLSearchParams()
  if (filters.group) params.set('group', filters.group)
  return params.toString()
}

/** ลิงก์ไปหน้ารายการคอร์สที่กรองไว้ตามนี้ */
export function listHref(filters: CourseFilters): string {
  const query = filtersToQuery(filters)
  return query ? `/courses?${query}` : '/courses'
}
