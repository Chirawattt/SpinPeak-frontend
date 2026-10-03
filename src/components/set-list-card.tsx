import Link from 'next/link'
import type { SetListCard as SetListCardData } from '@/catalog/set-list'
import { CoverBox } from '@/components/cover-box'

/** การ์ดเซ็ตในหน้ารายการเซ็ต · ทั้งใบกดเข้าหน้ารายละเอียดเซ็ต · ราคาขีดฆ่ากับป้ายประหยัดโชว์เฉพาะเซ็ตที่ถึงเกณฑ์ */
export function SetListCard({ card }: { card: SetListCardData }) {
  return (
    <Link
      href={card.href}
      className="group flex w-full flex-col overflow-hidden rounded-[18px] border border-line bg-white transition-shadow hover:shadow-card"
    >
      <CoverBox cover={card.cover} label={card.codeLabel} title={card.title} className="rounded-none!" />
      <div className="flex flex-1 flex-col gap-[9px] px-5 pt-[18px] pb-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs font-semibold text-link-hover">
          <span>{card.codeLabel}</span>
          <span>·</span>
          <span>{card.group}</span>
          {card.statusLabel && <span className="rounded-full border border-ink px-2 py-0.5 font-sans text-ink">{card.statusLabel}</span>}
        </div>
        <h3 className="font-heading text-xl leading-[1.3] font-semibold">{card.title}</h3>
        <p className="flex-1 text-[14.5px] leading-relaxed text-muted">รวม {card.courseCount}</p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="font-heading text-[25px] font-bold">{card.price}</span>
          {card.savings && (
            <span className="text-[15px] text-strike line-through">
              <span className="sr-only">ราคาปกติ </span>
              {card.savings.regularPrice}
            </span>
          )}
        </div>
        {card.savings && (
          <div className="text-sm font-semibold text-link-hover">
            ประหยัด {card.savings.amount} ({card.savings.percent})
          </div>
        )}
        <span className="mt-1 rounded-full bg-brand p-[13px] text-center font-semibold transition-colors group-hover:bg-brand/85">
          ดูรายละเอียดเซ็ต
        </span>
      </div>
    </Link>
  )
}
