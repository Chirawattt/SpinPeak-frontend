import { catalog } from '@/catalog'
import { Hero } from '@/components/landing/hero'
import { ClipsSection, ClosingBand, FaqSection, FloatingContact, GroupEntries, ReviewsSection, TeacherSection } from '@/components/landing/sections'

export default function LandingPage() {
  const { hero, groups, teacher, clips, reviews, faqs } = catalog.landing()

  return (
    <>
      <Hero hero={hero} />
      <GroupEntries groups={groups} />
      {teacher && <TeacherSection teacher={teacher} photoAlt={teacher.name} />}
      {clips.length > 0 && <ClipsSection clips={clips} />}
      {reviews.length > 0 && <ReviewsSection reviews={reviews} />}
      <FaqSection faqs={faqs} />
      <ClosingBand />
      <FloatingContact />
    </>
  )
}
