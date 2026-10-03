import { notFound } from 'next/navigation'
import { catalog } from '@/catalog'
import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from '@/og/render'

// รูป OG ของแต่ละคอร์ส สร้างตอน build พร้อมหน้าคอร์ส
export const dynamicParams = false
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export function generateStaticParams() {
  return catalog.courseSlugs().map((slug) => ({ slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const card = catalog.courseOg((await params).slug)
  if (!card) notFound()
  return renderOg(card, catalog.siteInfo().name)
}
