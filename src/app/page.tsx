import { catalog } from '@/catalog'
import { Hero } from '@/components/landing/hero'

export default function LandingPage() {
  const { hero } = catalog.landing()

  return <Hero hero={hero} />
}
