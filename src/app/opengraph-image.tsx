import { catalog } from '@/catalog'
import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from '@/og/render'

// รูป OG ทั่วไป: ชื่อเว็บ + คำโปรย
export const alt = catalog.siteInfo().name
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOg(catalog.pageOg('landing'), catalog.siteInfo().name)
}
