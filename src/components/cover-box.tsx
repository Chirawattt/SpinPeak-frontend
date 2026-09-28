import Image from 'next/image'
import type { Cover, CoverTone } from '@/catalog'

const TONE: Record<CoverTone, string> = {
  sky: 'bg-brand text-ink',
  wash: 'bg-brand-wash text-ink',
  ink: 'bg-ink text-brand',
}

/** รูปปกคอร์ส / เซ็ต · ระหว่างที่ยังไม่มีรูป ใช้กล่องสีจาก palette ที่มีชื่ออยู่ข้างใน */
export function CoverBox({ cover, label, title, className = '' }: { cover: Cover; label: string; title: string; className?: string }) {
  return (
    <div className={`relative aspect-video overflow-hidden rounded-[14px] ${TONE[cover.tone]} ${className}`}>
      {cover.image ? (
        <Image src={cover.image} alt={title} fill sizes="(max-width: 1024px) 100vw, 340px" className="object-cover" />
      ) : (
        <div className="flex h-full flex-col justify-end gap-1 p-5">
          <div className="font-mono text-xs font-medium opacity-80">{label}</div>
          <div className="font-heading text-xl leading-snug font-semibold">{title}</div>
        </div>
      )}
    </div>
  )
}
