import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { catalog, type CourseDetail } from '@/catalog'
import { ContactButton } from '@/components/contact-button'
import { CoverBox } from '@/components/cover-box'
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
      <ClosingBand detail={detail} />
    </>
  )
}

function Top({ detail }: { detail: CourseDetail }) {
  return (
    <section className="relative overflow-hidden border-b border-card-line bg-white bg-[radial-gradient(circle_at_96%_70%,var(--color-glow-soft)_0,transparent_40%),radial-gradient(circle_at_78%_6%,var(--color-glow-faint)_0,transparent_30%)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--color-dot)_1.4px,transparent_1.5px)] bg-size-[26px_26px] opacity-35" />

      <nav aria-label="breadcrumb" className="relative px-gutter py-5 text-sm text-muted">
        <Link href="/" className="hover:text-ink">หน้าแรก</Link>
        {' / '}
        <Link href={detail.group.href} className="hover:text-ink">{detail.group.label}</Link>
        {' / '}
        <span className="text-ink">{detail.title}</span>
      </nav>

      <div className="relative grid gap-x-9 gap-y-7 px-gutter pt-1 pb-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:grid-rows-[auto_1fr] lg:pb-16">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-brand px-4 py-[7px] text-[13px] font-semibold">
              {detail.badge}
            </span>
            {detail.statusLabel && (
              <span className="rounded-full border-[1.5px] border-ink px-4 py-[5.5px] text-[13px] font-semibold">
                {detail.statusLabel}
              </span>
            )}
          </div>
          <h1 className="mb-3.5 font-heading text-[clamp(28px,5.2vw,44px)] leading-[1.2] font-bold">{detail.title}</h1>
          <p className="max-w-[600px] text-lg leading-[1.75] text-ink-soft">{detail.tagline}</p>
        </div>

        <PriceCard detail={detail} />

        {detail.stats.length > 0 && (
          <dl className="flex flex-wrap content-start gap-x-7 gap-y-4 lg:col-start-1 lg:row-start-2">
            {detail.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="text-sm text-muted">{stat.label}</dt>
                <dd className="font-heading text-2xl font-bold">{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}

/** มือถือ: อยู่ถัดจากชื่อคอร์สทันที เห็นราคาและปุ่มติดต่อโดยไม่ต้องเลื่อน · จอใหญ่: คอลัมน์ขวา */
function PriceCard({ detail }: { detail: CourseDetail }) {
  return (
    <aside className="min-w-0 self-start rounded-[20px] border border-card-line bg-white p-5 shadow-card lg:col-start-2 lg:row-span-2 lg:row-start-1">
      <CoverBox cover={detail.cover} label={detail.category} title={detail.title} className="mb-[18px] hidden lg:block" />
      <div className="mb-[18px] flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-heading text-[clamp(31px,4.4vw,38px)] font-bold">{detail.price}</span>
        <span className="rounded-full bg-brand-wash px-3 py-1 text-[13px] font-semibold">{detail.lifetime}</span>
      </div>
      <ContactButton item={detail.contactItem} className="mb-2.5 text-[17px]" />
      <ContactButton item={detail.contactItem} channel="facebook" variant="outline" />
      <ul className="mt-[18px] flex flex-col gap-2.5 border-t border-divider-soft pt-[18px] text-[14.5px] leading-relaxed text-ink-soft">
        <li>ดูย้อนหลังได้ไม่จำกัด ไม่มีวันหมดอายุ</li>
        <li>ถ้าอัดเนื้อหาใหม่ คนที่ซื้อแล้วได้ของใหม่ด้วย ไม่ต้องจ่ายเพิ่ม</li>
      </ul>
    </aside>
  )
}

function SectionTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`mb-4 font-heading text-[clamp(23px,3.4vw,28px)] font-bold ${className}`}>{children}</h2>
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

function ClosingBand({ detail }: { detail: CourseDetail }) {
  return (
    <section className="flex flex-wrap items-center justify-between gap-x-8 gap-y-6 bg-brand px-gutter py-11">
      <div>
        <h2 className="mb-2 font-heading text-[clamp(24px,4vw,30px)] font-bold text-band-ink">พร้อมเริ่มเรียนแล้วใช่ไหม</h2>
        <p className="text-base">
          {detail.price} ครั้งเดียว {detail.lifetime}
        </p>
      </div>
      <ContactButton item={detail.contactItem} className="px-10 text-lg whitespace-nowrap" />
    </section>
  )
}
