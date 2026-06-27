import { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'ตั้งค่าเว็บไซต์ (Site Settings)',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'SEO พื้นฐาน (Global SEO)',
          description: 'ตั้งค่า SEO เริ่มต้นสำหรับทุกหน้าที่ไม่ได้กำหนด SEO เฉพาะ',
          fields: [
            {
              name: 'defaultMetaTitle',
              type: 'text',
              label: 'Meta Title',
              admin: {
                description: 'ชื่อเว็บไซต์ที่จะแสดงบน Google และแท็บเบราว์เซอร์',
              },
            },
            {
              name: 'defaultMetaDescription',
              type: 'textarea',
              label: 'Meta Description',
              admin: {
                description: 'คำอธิบายเว็บไซต์แบบย่อสำหรับ SEO',
              },
            },
            {
              name: 'defaultKeywords',
              type: 'text',
              label: 'Keywords (คำค้นหา)',
              admin: {
                description: 'คำที่เกี่ยวข้องกับเว็บไซต์ (คั่นด้วยเครื่องหมายจุลภาค ,)',
              },
            },
          ],
        },
        {
          label: 'ช่องทางการติดต่อ (CTA & Contacts)',
          description: 'ข้อมูลติดต่อที่จะแสดงบน Navbar, Footer และปุ่มต่างๆ',
          fields: [
            {
              name: 'mainPhoneNumber',
              type: 'text',
              label: 'เบอร์โทรศัพท์หลัก',
              admin: {
                description: 'ตัวอย่าง: 081-234-5678',
              },
            },
            {
              name: 'secondaryPhoneNumber',
              type: 'text',
              label: 'เบอร์โทรศัพท์รอง',
              admin: {
                description: 'เบอร์โทรศัพท์เพิ่มเติม (ถ้ามี)',
              },
            },
            {
              name: 'lineUrl',
              type: 'text',
              label: 'ลิงก์ LINE Official',
              admin: {
                description: 'ตัวอย่าง: https://lin.ee/...',
              },
            },
            {
              name: 'facebookUrl',
              type: 'text',
              label: 'ลิงก์ Facebook Page',
              admin: {
                description: 'ตัวอย่าง: https://facebook.com/...',
              },
            },
            {
              name: 'googleMapsUrl',
              type: 'text',
              label: 'ลิงก์ Google Maps',
              admin: {
                description: 'ลิงก์ Google Maps สำหรับนำทางมาที่บริษัท',
              },
            },
          ],
        },
      ],
    },
  ],
}
