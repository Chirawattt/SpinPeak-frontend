import { content } from '@/content'
import { createContact } from './contact'

export type { ContactChannel, ContactItem } from './contact'

export const { contactHref } = createContact(content.site)
