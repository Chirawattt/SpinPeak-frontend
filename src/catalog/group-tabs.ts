// แท็บกลุ่มของหน้ารายการ (คอร์ส / เซ็ต) · แท็บแรก "ทุกระดับชั้น" คือไม่กรองกลุ่ม

import type { Group } from '@content/types'

export type GroupTab = {
  label: string
  /** เช่น "24 คอร์ส" */
  count: string
  href: string
  active: boolean
}

const ALL_GROUPS = 'ทุกระดับชั้น'

export function buildGroupTabs(opts: {
  groups: { key: Group; label: string }[]
  active: Group | undefined
  /** หน่วยนับ เช่น "คอร์ส" */
  unit: string
  countIn: (group?: Group) => number
  hrefFor: (group?: Group) => string
}): GroupTab[] {
  const { groups, active, unit, countIn, hrefFor } = opts
  return [
    { label: ALL_GROUPS, count: `${countIn()} ${unit}`, href: hrefFor(), active: !active },
    ...groups.map((g) => ({ label: g.label, count: `${countIn(g.key)} ${unit}`, href: hrefFor(g.key), active: active === g.key })),
  ]
}
