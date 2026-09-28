import clips from '@content/clips.json'
import courses from '@content/courses.json'
import reviews from '@content/reviews.json'
import sets from '@content/sets.json'
import site from '@content/site.json'
import type { Clip, Course, CourseSet, Review, Site } from '@content/types'
import { createCatalog } from './catalog'

export type { Catalog, Content, Footer, HeroStat, Landing, SocialLink } from './catalog'
export type { ContentProblem } from './validate-content'

// type ที่ TypeScript อนุมานจาก JSON กว้างกว่า type จริง (เช่น group เป็น string ไม่ใช่ Group)
// จึงต้อง cast ผ่าน unknown รูปร่างของข้อมูลถูกคุมโดย sheet_sync.py
export const catalog = createCatalog({
  courses: courses as unknown as Course[],
  sets: sets as unknown as CourseSet[],
  site: site as unknown as Site,
  reviews: reviews as unknown as Review[],
  clips: clips as unknown as Clip[],
})
