// ตรวจ content/ จริง · npm run build รันไฟล์นี้ก่อน build ถ้าข้อมูลพัง build ก็พัง
// ถ้าไม่ผ่าน ดูรายการ where / message ใน diff ว่าชิ้นไหนผิด แล้วแก้ที่ชีต (หรือ site.json) ไม่ใช่แก้ JSON มือ

import { describe, expect, it } from 'vitest'
import { catalog } from '.'

describe('content/', () => {
  it('has no data problems', () => {
    expect(catalog.validateContent()).toEqual([])
  })
})
