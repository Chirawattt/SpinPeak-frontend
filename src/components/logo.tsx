import Image from 'next/image'
import { catalog } from '@/catalog'

// ใช้ไฟล์ใน public/ ตรง ๆ: brand.logo ใน site.json ยังชี้ path เก่าที่ไม่มีไฟล์จริง
export function Logo({ size, priority, className = '' }: { size: number; priority?: boolean; className?: string }) {
  const { name } = catalog.siteInfo()

  return (
    <Image
      src="/spine-peak-logo.png"
      alt={name}
      width={size}
      height={size}
      priority={priority}
      className={`block ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
