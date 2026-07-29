import dotenv from 'dotenv';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../src/db';
import { pages, products, revisions, seoMetadata } from '../src/db/schema';

dotenv.config({ path: '.env.local' });

type SeoUpdate = { title: string; description: string };

const pageSeo: Record<string, SeoUpdate> = {
  home: {
    title: 'PCC Post-Tension ขอนแก่น | กำแพงกันดิน รั้ว และ Precast',
    description: 'ออกแบบ ผลิต จัดส่ง และติดตั้งกำแพงกันดิน รั้วสำเร็จรูป แผ่นพื้น ผนัง Precast และงาน Post-Tension ในขอนแก่นและพื้นที่ใกล้เคียง พร้อมประเมินหน้างาน',
  },
  products: {
    title: 'สินค้า Precast ขอนแก่น | รั้ว แผ่นพื้น กำแพงกันดิน | PCC',
    description: 'รวมสินค้าและบริการ Precast ขอนแก่น ทั้งรั้วสำเร็จรูป แผ่นพื้น ผนัง กำแพงกันดิน เสาเข็ม และงาน Post-Tension พร้อมผลิต จัดส่ง และติดตั้ง',
  },
  contact: {
    title: 'ติดต่อ PCC Post-Tension ขอนแก่น | โทร LINE และแผนที่',
    description: 'ติดต่อทีม PCC Post-Tension ขอนแก่น เพื่อส่งรูปหน้างาน ขอคำปรึกษา หรือประเมินราคา โทร 063-454-5656 ดู LINE ที่อยู่สำนักงาน เวลาเปิดทำการ และแผนที่',
  },
  about: {
    title: 'เกี่ยวกับ PCC Post-Tension ขอนแก่น | ทีม Precast และโครงสร้าง',
    description: 'รู้จัก PCC Post-Tension ขอนแก่น ผู้ให้บริการงานคอนกรีตสำเร็จรูปและโครงสร้าง ตั้งแต่ประเมิน ออกแบบ ผลิต จัดส่ง ถึงติดตั้ง พร้อมทีมให้คำแนะนำ',
  },
  portfolio: {
    title: 'ผลงาน Precast และ Post-Tension ขอนแก่น | PCC',
    description: 'ดูประเภทงาน Precast กำแพงกันดิน รั้วสำเร็จรูป แผ่นพื้น และ Post-Tension ที่ PCC ให้บริการ พร้อมส่งข้อมูลหน้างานเพื่อขอประเมินโครงการ',
  },
};

const productSeo: Record<string, SeoUpdate> = {
  'precast-wall-khon-kaen': {
    title: 'ผนัง Precast ขอนแก่น | ผลิต จัดส่ง และติดตั้ง | PCC',
    description: 'ผนัง Precast ขอนแก่น สำหรับบ้าน อาคาร โรงงาน และโครงการ ผลิตตามแบบ ควบคุมคุณภาพจากโรงงาน พร้อมคำแนะนำการขนส่ง ติดตั้ง และประเมินหน้างาน',
  },
  'precast-fence-khon-kaen': {
    title: 'รั้วสำเร็จรูป ขอนแก่น | ผลิต จัดส่ง พร้อมติดตั้ง | PCC',
    description: 'รั้วคอนกรีตสำเร็จรูป ขอนแก่น สำหรับบ้าน โรงงาน โครงการ และล้อมที่ดิน มีแผ่นรั้ว เสา คานทับหลัง และฐานราก พร้อมประเมิน จัดส่ง และติดตั้ง',
  },
  'precast-concrete-slab-khon-kaen': {
    title: 'แผ่นพื้นสำเร็จรูป ขอนแก่น | คอนกรีตอัดแรง | PCC',
    description: 'แผ่นพื้นคอนกรีตสำเร็จรูป ขอนแก่น สำหรับบ้าน อาคาร และโครงการ ช่วยลดขั้นตอนหน้างาน พร้อมให้คำแนะนำเรื่องขนาด ช่วงพาด การขนส่ง และติดตั้ง',
  },
  'l-shape-retaining-wall-khon-kaen': {
    title: 'กำแพงกันดินตัว L ขอนแก่น | จัดส่งและติดตั้ง | PCC',
    description: 'กำแพงกันดินตัว L ขอนแก่น สำหรับพื้นที่ต่างระดับ แนวรั้ว บ้าน โรงงาน และโครงการ พร้อมประเมินสภาพพื้นที่ แนะนำขนาด ผลิต จัดส่ง และติดตั้ง',
  },
  'post-tension-slab-khon-kaen': {
    title: 'งาน Post-Tension ขอนแก่น | ออกแบบและติดตั้ง | PCC',
    description: 'บริการงานพื้น Post-Tension ขอนแก่น สำหรับอาคาร คลังสินค้า และโครงการ ตั้งแต่วางแนวทาง ออกแบบ ประเมินราคา ติดตั้ง และควบคุมงานโดยทีมที่เกี่ยวข้อง',
  },
  'concrete-pile-khon-kaen': {
    title: 'เสาเข็มคอนกรีต ขอนแก่น | ผลิต จัดส่ง และประเมินงาน | PCC',
    description: 'เสาเข็มคอนกรีต ขอนแก่น สำหรับบ้าน อาคาร โรงงาน และโครงการ เลือกขนาดตามแบบและสภาพหน้างาน พร้อมให้คำแนะนำ ประเมินจำนวน ผลิต และจัดส่ง',
  },
  'barbed-wire-fence-post-khon-kaen': {
    title: 'เสารั้วลวดหนาม ขอนแก่น | เสาคอนกรีตพร้อมจัดส่ง | PCC',
    description: 'เสารั้วลวดหนามคอนกรีต ขอนแก่น สำหรับสวน ฟาร์ม โรงงาน และล้อมที่ดิน พร้อมแนะนำขนาด ระยะห่าง จำนวนเสา อุปกรณ์ และการจัดส่งถึงหน้างาน',
  },
};

const replacements: Array<[string, string]> = [
  ['ควบคุมมาตรฐานได้ 100%', 'ควบคุมคุณภาพจากโรงงาน'],
  ['คุมงบได้ 100%', 'ประเมินขอบเขตและงบประมาณได้ชัดเจนขึ้น'],
  ['มั่นใจในความปลอดภัย 100%', 'เพิ่มความมั่นใจด้วยการออกแบบและตรวจสอบตามหลักวิศวกรรม'],
  ['หมดปัญหารอยแตกร้าว รอยรั่วซึม', 'ช่วยลดความเสี่ยงของรอยแตกร้าวและรอยรั่วซึม เมื่อออกแบบรอยต่อและติดตั้งอย่างเหมาะสม'],
  ['หมดปัญหารอยร้าว', 'ช่วยลดความเสี่ยงของรอยร้าวเมื่อออกแบบและติดตั้งอย่างเหมาะสม'],
  ['ลดระยะเวลาก่อสร้างลงได้มากกว่า 50% เมื่อเทียบกับการก่ออิฐฉาบปูน', 'ช่วยลดระยะเวลาก่อสร้างเมื่อเทียบกับการก่ออิฐฉาบปูน โดยขึ้นอยู่กับแบบและสภาพหน้างาน'],
  ['เป็นฉนวนกันความร้อนได้ดีเยี่ยม', 'ช่วยลดเสียงรบกวนได้ โดยประสิทธิภาพขึ้นอยู่กับความหนาและรายละเอียดรอยต่อ'],
  ['คุมงบประมาณได้ 100% หมดปัญหางานล่าช้า', 'วางแผนงบประมาณและกำหนดการได้ชัดเจนขึ้น'],
  ['หมดปัญหาเรื่องคุณภาพฝีมือช่างที่ไม่นิ่ง', 'ลดความแปรปรวนจากคุณภาพฝีมือช่างหน้างาน'],
  ['หมดปัญหาพื้นแอ่นตัว', 'ช่วยควบคุมการแอ่นตัวเมื่อเลือกขนาดและช่วงพาดตามแบบวิศวกรรม'],
  ['หมดปัญหาจุกจิกเรื่องฝีมือช่างก่ออิฐฉาบปูน', 'ลดขั้นตอนงานก่ออิฐฉาบปูนหน้างาน'],
  ['หมดปัญหาเสาผุพังหรือปลวกกินแบบเสาไม้ดั้งเดิม', 'ไม่เสี่ยงต่อปลวกและการผุแบบเสาไม้'],
  ['Accessibility สีเขียว 100%', 'Accessibility และคอนทราสต์สี'],
];

function sanitizeString(value: string) {
  return replacements.reduce((current, [from, to]) => current.split(from).join(to), value);
}

function sanitizeContent(value: unknown): unknown {
  if (typeof value === 'string') return sanitizeString(value);
  if (Array.isArray(value)) return value.map(sanitizeContent);
  if (!value || typeof value !== 'object') return value;

  const result = Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, sanitizeContent(item)]),
  ) as Record<string, unknown>;

  if (result.type === 'gallery' && JSON.stringify(result).includes('ChatGPT_Image')) {
    result.title = 'ภาพประกอบขั้นตอนและลักษณะงาน';
    result.content = 'ภาพจำลองเพื่ออธิบายลักษณะสินค้า การขนส่ง และแนวทางติดตั้ง โปรดสอบถามทีมงานสำหรับภาพอ้างอิงของโครงการจริง';
    if (Array.isArray(result.items)) {
      result.items = result.items.map((item) => {
        if (!item || typeof item !== 'object') return item;
        return {
          ...(item as Record<string, unknown>),
          description: 'ภาพจำลองเพื่ออธิบายลักษณะสินค้าและขั้นตอนการทำงาน',
        };
      });
    }
  }

  return result;
}

async function saveRevision(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  resourceType: 'page' | 'product',
  resourceId: string,
  data: Record<string, unknown>,
) {
  const latest = await tx.select({ version: revisions.version })
    .from(revisions)
    .where(and(eq(revisions.resourceType, resourceType), eq(revisions.resourceId, resourceId)))
    .orderBy(desc(revisions.version))
    .limit(1);

  await tx.insert(revisions).values({
    resourceType,
    resourceId,
    version: (latest[0]?.version || 0) + 1,
    data,
    createdBy: 'system:seo-content-improvements',
  });
}

async function main() {
  const result = await db.transaction(async (tx) => {
    const pageRows = await tx.select().from(pages);
    const productRows = await tx.select().from(products);
    let updatedPages = 0;
    let updatedProducts = 0;

    for (const page of pageRows) {
      const seo = pageSeo[page.slug];
      let content = sanitizeContent(page.content);

      if (page.slug === 'home' || page.slug === 'about') {
        content = Array.isArray(content) ? content.map((block) => {
          if (!block || typeof block !== 'object' || (block as Record<string, unknown>).type !== 'stats') return block;
          return {
            ...(block as Record<string, unknown>),
            description: 'ข้อมูลบริษัท ณ ปี 2569',
            stats: [
              { value: 30, suffix: '+', label: 'ปีประสบการณ์จากบริษัทในเครือ' },
              { value: 2, label: 'สำนักงาน ขอนแก่นและเชียงใหม่' },
              { value: 4, label: 'บริการ ออกแบบ ผลิต จัดส่ง ติดตั้ง' },
            ],
          };
        }) : content;
      }

      if (!seo && JSON.stringify(content) === JSON.stringify(page.content)) continue;
      const [updated] = await tx.update(pages).set({
        content,
        ...(seo ? { seoTitle: seo.title, seoDescription: seo.description } : {}),
        updatedAt: new Date(),
      }).where(eq(pages.id, page.id)).returning();

      if (seo) {
        await tx.update(seoMetadata).set({
          title: seo.title,
          description: seo.description,
          updatedAt: new Date(),
        }).where(and(eq(seoMetadata.resourceType, 'page'), eq(seoMetadata.resourceId, page.id)));
      }
      await saveRevision(tx, 'page', page.id, { ...updated, seo });
      updatedPages += 1;
    }

    for (const product of productRows) {
      const seo = productSeo[product.slug];
      const content = sanitizeContent(product.content);
      const description = product.description ? sanitizeString(product.description) : product.description;
      if (!seo && description === product.description && JSON.stringify(content) === JSON.stringify(product.content)) continue;

      const [updated] = await tx.update(products).set({
        content,
        description,
        ...(seo ? { seoTitle: seo.title, seoDescription: seo.description } : {}),
        updatedAt: new Date(),
      }).where(eq(products.id, product.id)).returning();

      if (seo) {
        await tx.update(seoMetadata).set({
          title: seo.title,
          description: seo.description,
          updatedAt: new Date(),
        }).where(and(eq(seoMetadata.resourceType, 'product'), eq(seoMetadata.resourceId, product.id)));
      }
      await saveRevision(tx, 'product', product.id, { ...updated, seo });
      updatedProducts += 1;
    }

    return { updatedPages, updatedProducts };
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
