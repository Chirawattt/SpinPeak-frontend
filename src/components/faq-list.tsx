import type { Faq } from '@/catalog'

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <dl className="flex flex-col">
      {faqs.map((faq) => (
        <div key={faq.q} className="border-b border-line py-[18px] last:border-b-0">
          <dt className="mb-1.5 text-[17px] font-semibold">{faq.q}</dt>
          <dd className="text-[15px] leading-[1.7] text-muted">{faq.a}</dd>
        </div>
      ))}
    </dl>
  )
}
