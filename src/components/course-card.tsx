import Link from 'next/link'
import type { CourseCard as CourseCardData } from '@/catalog'
import { CoverBox } from '@/components/cover-box'

/** การ์ดคอร์สตาม design หน้า Courses · ทั้งใบกดเข้าหน้ารายละเอียดคอร์ส */
export function CourseCard({ card }: { card: CourseCardData }) {
  return (
    <Link
      href={card.href}
      className="group flex w-full flex-col overflow-hidden rounded-[18px] border border-line bg-white transition-shadow hover:shadow-card"
    >
      <CoverBox cover={card.cover} label={card.label} title={card.title} className="rounded-none!" />
      <div className="flex flex-1 flex-col gap-[9px] px-5 pt-[18px] pb-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs font-semibold text-link-hover">
          <span>{card.label}</span>
          {card.statusLabel && <span className="rounded-full border border-ink px-2 py-0.5 font-sans text-ink">{card.statusLabel}</span>}
        </div>
        <h3 className="font-heading text-xl leading-[1.3] font-semibold">{card.title}</h3>
        <p className="flex-1 text-[14.5px] leading-relaxed text-muted">{card.tagline}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13.5px] text-muted">
          <span className="rounded-full bg-brand-wash px-2.5 py-0.5 font-semibold text-ink">{card.subject}</span>
          {card.facts && <span>{card.facts}</span>}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="font-heading text-[25px] font-bold">{card.price}</span>
          <span className="rounded-full border border-outline px-2.5 py-0.5 text-xs font-semibold">{card.lifetime}</span>
        </div>
        <span className="mt-1 rounded-full bg-brand p-[13px] text-center font-semibold transition-colors group-hover:bg-brand/85">
          ดูรายละเอียด
        </span>
      </div>
    </Link>
  )
}
