import { content } from '@/content'
import { createCatalog } from './catalog'

export type { Catalog, Content, Footer, HeroStat, Landing, SocialLink } from './catalog'
export type { CourseContent, CourseDetail, CourseInstructor, Stat } from './course-detail'
export type { Cover, CoverTone, Faq, NavLink } from './format'
export type { ContentProblem } from './validate-content'

export const catalog = createCatalog(content)
