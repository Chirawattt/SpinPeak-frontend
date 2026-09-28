import type { Metadata } from 'next'
import { catalog } from '@/catalog'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { siteUrl } from '@/lib/site-url'
import { anuphan, plexMono, plexThai } from './fonts'
import './globals.css'

const { name, description } = catalog.siteInfo()

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: name, template: `%s | ${name}` },
  description,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={`${anuphan.variable} ${plexThai.variable} ${plexMono.variable}`}>
      <body className="font-sans antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
