export const siteConfig = {
  name: "พีซีซี โพสเทนชั่น",
  legalName: "บริษัท พีซีซี โพสเทนชั่น จำกัด",
  description:
    "บริษัท พีซีซี โพสเทนชั่น จำกัด ให้บริการงานคอนกรีตสำเร็จรูปครบวงจร ทั้งกำแพงกันดินตัว L รั้วสำเร็จรูป แผ่นพื้นสำเร็จรูป เสารั้วลวดหนาม และงานโพสเทนชั่น สำหรับบ้าน โครงการ โรงงาน และงานก่อสร้างทุกขนาด",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://pcc-khon-kaen.vercel.app",
  locale: "th_TH",
  phone: "063-454-5656",
  phoneSecondary: "091-553-2624",
  phoneRaw: "0634545656",
  phoneSecondaryRaw: "0915532624",
  email: "contact@pcc-posttension.com",
  taxId: "0505552001368",
  foundedYear: 2552,
  experienceYears: 30,
  offices: [
    {
      name: "สำนักงานขอนแก่น",
      address:
        "100 หมู่ 11 ตำบลแดงใหญ่ อำเภอเมือง จังหวัดขอนแก่น 40000",
      addressLines: [
        "เลขที่ 100 หมู่ 11",
        "ตำบลแดงใหญ่ อำเภอเมือง",
        "จังหวัดขอนแก่น 40000",
      ],
      province: "ขอนแก่น",
    },
    {
      name: "สำนักงานเชียงใหม่",
      address:
        "292/1 ถนนเชียงใหม่-ลำปาง ตำบลป่าตัน อำเภอเมือง จังหวัดเชียงใหม่ 50300",
      addressLines: [
        "292/1 ถนนเชียงใหม่-ลำปาง ตำบลป่าตัน",
        "อำเภอเมือง จังหวัดเชียงใหม่ 50300",
      ],
      province: "เชียงใหม่",
    },
  ],
  social: {
    line: {
      url: "https://lin.ee/5O8rHvD",
      label: "LINE Official",
    },
    facebook: {
      url: "https://www.facebook.com/profile.php?id=61591107462645",
      label: "Facebook",
    },
    tiktok: {
      url: "https://lin.ee/5O8rHvD",
      label: "TikTok",
    },
  },
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d30607.778118617778!2d102.774184!3d16.476942!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3122604e86f3ffff%3A0xf6a12f14d76e2489!2z4Lia4Lij4Li04Lip4Lix4LiXIOC4nuC4teC4i-C4teC4i-C4tSDguYLguJ7guKrguYDguJfguJnguIrguLHguYjguJkg4LiI4Liz4LiB4Lix4LiU!5e0!3m2!1sth!2sth!4v1783146844037!5m2!1sth!2sth",
  serviceAreas: [
    "ขอนแก่น",
    "อุดรธานี",
    "มหาสารคาม",
    "กาฬสินธุ์",
    "ชัยภูมิ",
    "หนองคาย",
    "เลย",
    "บ้านฝาง",
    "ชุมแพ",
    "น้ำพอง",
  ],
  keywords: [
    "กำแพงกันดิน ขอนแก่น",
    "กำแพงกันดินตัว L",
    "รั้วสำเร็จรูป ขอนแก่น",
    "แผ่นพื้นสำเร็จรูป",
    "เสารั้วลวดหนาม",
    "โพสเทนชั่น",
    "พีซีซี โพสเทนชั่น",
  ],
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export const mainNavigation: NavItem[] = [
  { label: "หน้าแรก", href: "/" },
  {
    label: "สินค้าและบริการ",
    href: "/products",
    children: [
      {
        label: "กำแพงกันดินตัว L",
        href: "/products/retaining-wall",
        description: "ป้องกันดินสไลด์ รั้วพัง งานปรับระดับพื้นที่",
      },
      {
        label: "รั้วสำเร็จรูป",
        href: "/products/precast-fence",
        description: "รั้วคอนกรีตสำเร็จรูป แข็งแรง ติดตั้งไว",
      },
      {
        label: "แผ่นพื้นสำเร็จรูป",
        href: "/products/precast-slab",
        description: "แผ่นพื้นคอนกรีต มาตรฐาน มอก. 828-2546",
      },
      {
        label: "เสารั้วลวดหนาม",
        href: "/products/barbed-wire-post",
        description: "เสารั้วคอนกรีต งานล้อมพื้นที่ สวน ฟาร์ม",
      },
      {
        label: "งานโพสเทนชั่น",
        href: "/products/post-tension",
        description: "ออกแบบและติดตั้งพื้นโพสเทนชั่น มาตรฐาน ACI",
      },
    ],
  },
  { label: "ผลงาน", href: "/portfolio" },
  { label: "เกี่ยวกับเรา", href: "/about" },
  { label: "ติดต่อเรา", href: "/contact" },
];

export const footerProductLinks = [
  { label: "กำแพงกันดิน", href: "/products/retaining-wall" },
  { label: "รั้วสำเร็จรูป", href: "/products/precast-fence" },
  { label: "แผ่นพื้นสำเร็จรูป", href: "/products/precast-slab" },
  { label: "โพสเทนชั่น", href: "/products/post-tension" },
];

export const footerQuickLinks = [
  { label: "หน้าแรก", href: "/" },
  { label: "เกี่ยวกับเรา", href: "/about" },
  { label: "สินค้าและบริการ", href: "/products" },
  { label: "ติดต่อเรา", href: "/contact" },
];

export const footerSecondaryLinks = [
  { label: "ดาวน์โหลดเอกสาร", href: "/contact", external: false },
  { label: "ติดต่อเรา", href: "/contact", external: false },
] as const;

export const orderStatuses = {
  PENDING: { label: "รอตรวจสอบ", color: "bg-amber-100 text-amber-800" },
  REVIEWING: { label: "กำลังประเมิน", color: "bg-blue-100 text-blue-800" },
  QUOTED: { label: "ส่งใบเสนอราคาแล้ว", color: "bg-indigo-100 text-indigo-800" },
  CONFIRMED: { label: "ยืนยันออเดอร์", color: "bg-purple-100 text-purple-800" },
  PRODUCTION: { label: "กำลังผลิต", color: "bg-orange-100 text-orange-800" },
  DELIVERY: { label: "กำลังจัดส่ง", color: "bg-cyan-100 text-cyan-800" },
  INSTALLATION: { label: "กำลังติดตั้ง", color: "bg-teal-100 text-teal-800" },
  COMPLETED: { label: "เสร็จสิ้น", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "ยกเลิก", color: "bg-red-100 text-red-800" },
} as const;

export type OrderStatus = keyof typeof orderStatuses;
