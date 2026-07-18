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
      name: "สำนักงานใหญ่เชียงใหม่",
      address:
        "292/1 ถนนเชียงใหม่-ลำปาง ตำบลป่าตัน อำเภอเมือง จังหวัดเชียงใหม่ 50300",
      addressLines: [
        "292/1 ถนนเชียงใหม่-ลำปาง ตำบลป่าตัน",
        "อำเภอเมือง จังหวัดเชียงใหม่ 50300",
      ],
      province: "เชียงใหม่",
      lat: 18.810046814758575,
      lng: 98.99280067708213,
      mapUrl: "https://www.google.com/maps/search/?api=1&query=18.810046814758575,98.99280067708213",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3776.7330410886702!2d98.99280067708213!3d18.810046814758575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da2535c8883f4f%3A0x97c6891c89bd1d11!2z4Lia4Lij4Li04Lip4Lix4LiXIOC4nuC4tOC4muC4ueC4peC4ouC5jOC4hOC4reC4meC4geC4o-C4teC4lSDguIjguLPguIHguLHguJQ!5e0!3m2!1sth!2sth!4v1784193272974!5m2!1sth!2sth",
      isHeadOffice: true,
    },
    {
      name: "สาขาขอนแก่น",
      address:
        "100 หมู่ 11 ตำบลแดงใหญ่ อำเภอเมือง จังหวัดขอนแก่น 40000",
      addressLines: [
        "เลขที่ 100 หมู่ 11",
        "ตำบลแดงใหญ่ อำเภอเมือง",
        "จังหวัดขอนแก่น 40000",
      ],
      province: "ขอนแก่น",
      lat: 16.476942,
      lng: 102.774184,
      mapUrl: "https://www.google.com/maps/search/?api=1&query=16.476942,102.774184",
      isHeadOffice: false,
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
      url: "https://www.tiktok.com/@pcc.sales.kk",
      label: "TikTok",
    },
  },
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d61215.556237235556!2d102.774184!3d16.476942!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3122604e86f3ffff%3A0xf6a12f14d76e2489!2z4Lia4Lij4Li04Lip4Lix4LiXIOC4nuC4teC4i-C4teC4i-C4tSDguYLguJ7guKrguYDguJfguJnguIrguLHguYjguJkg4LiI4Liz4LiB4Lix4LiU!5e0!3m2!1sth!2sth!4v1783936614924!5m2!1sth!2sth",
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
        href: "/products/l-shape-retaining-wall-khon-kaen",
        description: "ป้องกันดินสไลด์ รั้วพัง งานปรับระดับพื้นที่",
      },
      {
        label: "รั้วสำเร็จรูป",
        href: "/products/precast-fence-khon-kaen",
        description: "รั้วคอนกรีตสำเร็จรูป แข็งแรง ติดตั้งไว",
      },
      {
        label: "แผ่นพื้นสำเร็จรูป",
        href: "/products/precast-concrete-slab-khon-kaen",
        description: "แผ่นพื้นคอนกรีต มาตรฐาน มอก. 828-2546",
      },
      {
        label: "เสารั้วลวดหนาม",
        href: "/products/barbed-wire-fence-post-khon-kaen",
        description: "เสารั้วคอนกรีต งานล้อมพื้นที่ สวน ฟาร์ม",
      },
      {
        label: "งานโพสเทนชั่น",
        href: "/products/post-tension-slab-khon-kaen",
        description: "ออกแบบและติดตั้งพื้นโพสเทนชั่น มาตรฐาน ACI",
      },
    ],
  },
  { label: "ผลงาน", href: "/portfolio" },
  { label: "เกี่ยวกับเรา", href: "/about" },
  { label: "ติดต่อเรา", href: "/contact" },
];

export const footerProductLinks = [
  { label: "กำแพงกันดิน", href: "/products/l-shape-retaining-wall-khon-kaen" },
  { label: "รั้วสำเร็จรูป", href: "/products/precast-fence-khon-kaen" },
  { label: "แผ่นพื้นสำเร็จรูป", href: "/products/precast-concrete-slab-khon-kaen" },
  { label: "โพสเทนชั่น", href: "/products/post-tension-slab-khon-kaen" },
];

export const footerQuickLinks = [
  { label: "หน้าแรก", href: "/" },
  { label: "เกี่ยวกับเรา", href: "/about" },
  { label: "สินค้าและบริการ", href: "/products" },
  { label: "ติดต่อเรา", href: "/contact" },
];

export const footerSecondaryLinks = [
  { label: "ดาวน์โหลด Catalog", href: "https://pcc-posttension.com/downloads/", external: true },
  { label: "ติดต่อเรา", href: "/contact", external: false },
  { label: "เว็บไซต์บริษัทหลัก", href: "https://pcc-posttension.com/", external: true },
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
