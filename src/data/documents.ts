export type DownloadCategory = 'catalog' | 'specification' | 'certificate' | 'company-profile' | 'installation-guide';

export type DownloadDocument = {
  slug: string;
  title: string;
  description: string;
  category: DownloadCategory;
  fileUrl: string;
  originalName: string;
  fileSize: number;
  pageCount?: number;
  relatedProduct?: { label: string; href: string };
  sourceLabel?: string;
  note?: string;
  sortOrder: number;
  updatedAt: string;
};

export const downloadCategoryLabels: Record<DownloadCategory, string> = {
  catalog: 'แคตตาล็อกสินค้า',
  specification: 'ข้อมูลทางเทคนิค',
  certificate: 'ใบรับรองและมาตรฐาน',
  'company-profile': 'ข้อมูลบริษัท',
  'installation-guide': 'คู่มือการติดตั้ง',
};

export const starterDocuments: DownloadDocument[] = [
  {
    slug: 'retaining-wall-l-series-catalog',
    title: 'แคตตาล็อกกำแพงกันดินตัว L',
    description: 'ข้อมูลกำแพงกันดินสำเร็จรูปแบบตัว L รูปแบบผลิตภัณฑ์ การใช้งาน และรายละเอียดประกอบการเลือกสินค้า',
    category: 'catalog',
    fileUrl: '/downloads/catalogs/retaining-wall-l-series.pdf',
    originalName: 'retaining-wall-l-series.pdf',
    fileSize: 11080547,
    pageCount: 20,
    relatedProduct: { label: 'กำแพงกันดินตัว L', href: '/products/l-shape-retaining-wall-khon-kaen' },
    sourceLabel: 'PCC และบริษัทในเครือ',
    note: 'โปรดสอบถามทีมขอนแก่นเพื่อยืนยันรุ่น ขนาด ราคา และข้อมูลติดต่อปัจจุบันก่อนสั่งซื้อ',
    sortOrder: 10,
    updatedAt: '2026-07-29',
  },
  {
    slug: 'precast-concrete-fence-catalog',
    title: 'แคตตาล็อกรั้วคอนกรีตสำเร็จรูป',
    description: 'รายละเอียดแผ่นรั้ว เสารั้ว คานทับหลัง ฐานราก และตัวอย่างระบบรั้วคอนกรีตสำเร็จรูป',
    category: 'catalog',
    fileUrl: '/downloads/catalogs/precast-concrete-fence-catalog.pdf',
    originalName: 'precast-concrete-fence-catalog.pdf',
    fileSize: 5636007,
    pageCount: 4,
    relatedProduct: { label: 'รั้วสำเร็จรูป', href: '/products/precast-fence-khon-kaen' },
    sourceLabel: 'บริษัท พิบูลย์คอนกรีต จำกัด',
    note: 'ข้อมูลติดต่อในเอกสารอาจเป็นข้อมูลของบริษัทในเครือ โปรดใช้ช่องทางติดต่อบนเว็บไซต์นี้สำหรับสาขาขอนแก่น',
    sortOrder: 20,
    updatedAt: '2026-07-29',
  },
  {
    slug: 'post-tension-system-catalog',
    title: 'แคตตาล็อกระบบพื้น Post-Tension',
    description: 'ข้อมูลระบบพื้นคอนกรีตอัดแรงภายหลัง รูปแบบการใช้งาน และรายละเอียดงาน Post-Tension สำหรับโครงการ',
    category: 'catalog',
    fileUrl: '/downloads/catalogs/post-tension-system-catalog.pdf',
    originalName: 'post-tension-system-catalog.pdf',
    fileSize: 990994,
    pageCount: 8,
    relatedProduct: { label: 'งาน Post-Tension', href: '/products/post-tension-slab-khon-kaen' },
    sourceLabel: 'PCC Post-Tension',
    note: 'โปรดให้วิศวกรตรวจสอบแบบ ช่วงพาด และน้ำหนักใช้งานก่อนนำข้อมูลไปใช้กับโครงการจริง',
    sortOrder: 30,
    updatedAt: '2026-07-29',
  },
  {
    slug: 'barbed-wire-fence-post-catalog',
    title: 'แคตตาล็อกเสารั้วลวดหนามคอนกรีต',
    description: 'ขนาดหน้าตัด ความยาว ระยะรู และตัวอย่างการใช้งานเสารั้วลวดหนามคอนกรีต',
    category: 'catalog',
    fileUrl: '/downloads/catalogs/barbed-wire-fence-post-catalog.pdf',
    originalName: 'barbed-wire-fence-post-catalog.pdf',
    fileSize: 4189430,
    pageCount: 1,
    relatedProduct: { label: 'เสารั้วลวดหนาม', href: '/products/barbed-wire-fence-post-khon-kaen' },
    sourceLabel: 'บริษัท พิบูลย์คอนกรีต จำกัด',
    note: 'โปรดสอบถามทีมขอนแก่นเพื่อยืนยันสินค้าในสต็อก ราคา และค่าจัดส่งปัจจุบัน',
    sortOrder: 40,
    updatedAt: '2026-07-29',
  },
  {
    slug: 'prefab-structure-specification',
    title: 'ข้อกำหนดระบบโครงสร้างคอนกรีตสำเร็จรูป',
    description: 'ข้อกำหนดวัสดุ คอนกรีต เหล็กเสริม ลวดอัดแรง และแนวทางสำหรับงานระบบโครงสร้างสำเร็จรูป PCC',
    category: 'specification',
    fileUrl: '/downloads/specifications/prefab-structure-specification.pdf',
    originalName: 'prefab-structure-specification.pdf',
    fileSize: 341427,
    pageCount: 2,
    relatedProduct: { label: 'สินค้าและบริการทั้งหมด', href: '/products' },
    sourceLabel: 'บริษัท พิบูลย์คอนกรีต จำกัด',
    note: 'เอกสารนี้เป็นข้อมูลอ้างอิงทั่วไป การใช้งานจริงต้องเป็นไปตามแบบและข้อกำหนดของวิศวกรโครงการ',
    sortOrder: 50,
    updatedAt: '2026-07-29',
  },
  {
    slug: 'solid-plank-slab-load-table',
    title: 'ตารางรับน้ำหนักแผ่นพื้น Solid Plank Slab',
    description: 'หน้าตัด คุณสมบัติ และตารางความสามารถในการรับน้ำหนักปลอดภัยตามช่วงพาดของแผ่นพื้นสำเร็จรูปแบบตัน',
    category: 'specification',
    fileUrl: '/downloads/specifications/solid-plank-slab-load-table.pdf',
    originalName: 'solid-plank-slab-load-table.pdf',
    fileSize: 274541,
    pageCount: 1,
    relatedProduct: { label: 'แผ่นพื้นสำเร็จรูป', href: '/products/precast-concrete-slab-khon-kaen' },
    sourceLabel: 'บริษัท พิบูลย์คอนกรีต จำกัด',
    note: 'ตารางเป็นข้อมูลประกอบการเลือกเบื้องต้น โปรดให้วิศวกรยืนยันช่วงพาด น้ำหนักบรรทุก และวิธีติดตั้งก่อนใช้งาน',
    sortOrder: 60,
    updatedAt: '2026-07-29',
  },
];
