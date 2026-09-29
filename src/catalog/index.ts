import { content } from '@/content'
import { createCatalog } from './catalog'

export type { Catalog, Content, Footer, HeroStat, Landing, SocialLink } from './catalog'
export type { CourseCard } from './course-card'
export type { CourseFilters } from './course-filters'
export type { CourseList, CourseListIndex, CoursesPage, GoalLink, GroupTab, Paging, ReviewQuote } from './course-list'
export { filtersToQuery, parseFilters } from './course-filters'
export type { CourseContent, CourseDetail, CourseInstructor, CourseSets } from './course-detail'
export type { Cover, CoverTone, Faq, NavLink, Stat } from './format'
export type { SetCard, SetSavings } from './set-card'
export type { SetDetail } from './set-detail'
export type { ContentProblem } from './validate-content'

export const catalog = createCatalog(content)
