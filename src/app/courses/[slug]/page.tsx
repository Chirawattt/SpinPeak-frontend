import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { catalog, type CourseDetail } from '@/catalog'
import { ClosingBand, DetailHeading, DetailTop, PriceCard, Pill, SectionTitle } from '@/components/detail-page'
import { FaqList } from '@/components/faq-list'

// build ทุกคอร์สล่วงหน้า slug ที่ไม่มีอยู่ขึ้น 404
export const dynamicParams = false

export function generateStaticParams() {
  return catalog.courseSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<'/courses/[slug]'>): Promise<Metadata> {
  const detail = catalog.courseDetail((await params).slug)
  return detail ? { title: detail.title, description: detail.tagline } : {}
}

export default async function CourseDetailPage({ params }: PageProps<'/courses/[slug]'>) {
  const detail = catalog.courseDetail((await params).slug)
  if (!detail) notFound()

  return (
    <>
      <Top detail={detail} />
      <Body detail={detail} />
      <ClosingBand price={detail.price} lifetime={detail.lifetime} contactItem={detail.contactItem} />
    </>
  )
}

function Top({ detail }: { detail: CourseDetail }) {
  return (
    <DetailTop
      crumbs={[{ label: 'หน้าแรก', href: '/' }, detail.group]}
      current={detail.title}
      stats={detail.stats}
      aside={
        <PriceCard
          cover={detail.cover}
          coverLabel={detail.category}
          title={detail.title}
          price={detail.price}
          lifetime={detail.lifetime}
          contactItem={detail.contactItem}
        />
      }
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <Pill>{detail.badge}</Pill>
        {detail.statusLabel && <Pill variant="outline">{detail.statusLabel}</Pill>}
      </div>
      <DetailHeading title={detail.title} tagline={detail.tagline} />
    </DetailTop>
  )
}

function Body({ detail }: { detail: CourseDetail }) {
  return (
    <div className="grid gap-x-9 gap-y-10 px-gutter py-12 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex min-w-0 flex-col gap-10">
        {detail.content && (
          <section>
            <SectionTitle className="mb-1.5">เนื้อหาในคอร์ส</SectionTitle>
            {detail.content.chapterCount && <p className="mb-5 text-[15px] text-muted">{detail.content.chapterCount}</p>}
            {detail.content.points && (
              <ul className="mb-5 flex flex-wrap gap-2.5">
                {detail.content.points.map((point, i) => (
                  <li key={i} className="rounded-full border border-outline px-4 py-2 text-sm">{point}</li>
                ))}
              </ul>
            )}
            {detail.content.chapters && (
              <ol className="overflow-hidden rounded-2xl border border-line">
                {detail.content.chapters.map((chapter, i) => (
                  <li key={i} className="border-b border-line px-[22px] py-[18px] text-[17px] font-semibold last:border-b-0 odd:bg-row">
                    {chapter}
                  </li>
                ))}
              </ol>
            )}
          </section>
        )}

        {detail.forWho && (
          <section>
            <SectionTitle>คอร์สนี้เหมาะกับใคร</SectionTitle>
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-3.5">
              {detail.forWho.map((who, i) => (
                <li key={i} className="rounded-[14px] bg-tint p-5 text-[15.5px] leading-[1.65]">{who}</li>
              ))}
            </ul>
          </section>
        )}

        {detail.deliverables && (
          <section>
            <SectionTitle>สิ่งที่ได้รับ</SectionTitle>
            <p className="rounded-[14px] bg-tint p-5 text-[15.5px] leading-[1.65]">{detail.deliverables}</p>
          </section>
        )}

        <section>
          <SectionTitle>คำถามที่พบบ่อย</SectionTitle>
          <FaqList faqs={detail.faqs} />
        </section>
      </div>

      {detail.instructor && (
        <aside className="self-start rounded-[20px] border border-line p-6">
          <div className="mb-3.5 flex items-center gap-3.5">
            {detail.instructor.photo && (
              <div className="flex h-16 w-16 flex-none items-end justify-center overflow-hidden rounded-full bg-brand">
                <Image src={detail.instructor.photo} alt={detail.instructor.name} width={78} height={78} className="-mb-1.5 h-auto w-[78px] max-w-none" />
              </div>
            )}
            <div>
              <div className="font-heading text-xl font-semibold">{detail.instructor.name}</div>
              <div className="text-sm text-muted">{detail.instructor.role}</div>
            </div>
          </div>
          <p className="text-[15px] leading-[1.75] text-ink-soft">{detail.instructor.bio}</p>
        </aside>
      )}
    </div>
  )
}
