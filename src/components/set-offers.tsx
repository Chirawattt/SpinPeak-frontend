import Link from 'next/link'
import type { CourseSets, SetCard } from '@/catalog'

/** กล่อง "ซื้อเป็นเซ็ตคุ้มกว่า" ในหน้ารายละเอียดคอร์ส ตาม design · เซ็ตที่เหลือกางดูในหน้าเดิมด้วย <details> ไม่ต้องใช้ JS */
export function SetOffers({ sets }: { sets: CourseSets }) {
  return (
    <section aria-labelledby="set-offers" className="rounded-[20px] border-[1.5px] border-ink bg-tint p-6">
      <h2 id="set-offers" className="mb-1 font-mono text-xs font-semibold text-link-hover">
        ซื้อเป็นเซ็ตคุ้มกว่า
      </h2>
      <SetList sets={sets.top} />
      {sets.more && (
        <details className="group">
          <summary className="mt-4 cursor-pointer list-none rounded-full border-[1.5px] border-outline bg-white py-3 text-center text-[15px] font-semibold hover:border-brand [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">{sets.more.label}</span>
            <span className="hidden group-open:inline">ย่อรายการเซ็ต</span>
          </summary>
          <SetList sets={sets.more.sets} />
        </details>
      )}
    </section>
  )
}

function SetList({ sets }: { sets: SetCard[] }) {
  return (
    <ul className="flex flex-col">
      {sets.map((set) => (
        <li key={set.slug} className="border-b border-card-line last:border-b-0">
          <SetOffer set={set} />
        </li>
      ))}
    </ul>
  )
}

/** ทั้งก้อนกดเข้าหน้ารายละเอียดเซ็ต */
function SetOffer({ set }: { set: SetCard }) {
  return (
    <Link href={set.href} className="group/offer block py-5">
      <div className="mb-1.5 font-heading text-[19px] leading-[1.35] font-semibold group-hover/offer:text-link-hover">{set.title}</div>
      <div className="mb-3 text-[14.5px] leading-relaxed text-muted">{set.summary}</div>
      <div className="flex flex-wrap items-baseline gap-x-2.5">
        <span className="font-heading text-[26px] font-bold">{set.price}</span>
        {set.savings && (
          <span className="text-[15px] text-strike line-through">
            <span className="sr-only">ราคาปกติ </span>
            {set.savings.regularPrice}
          </span>
        )}
      </div>
      {set.savings && (
        <div className="mt-0.5 text-sm font-semibold text-link-hover">
          ประหยัด {set.savings.amount} ({set.savings.percent})
        </div>
      )}
      <span className="mt-3.5 block rounded-full bg-brand p-3 text-center text-[15px] font-semibold transition-colors group-hover/offer:bg-brand/85">
        ดูรายละเอียดเซ็ต
      </span>
    </Link>
  )
}
