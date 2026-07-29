import PortfolioFullGridBlock from '@/components/blocks/PortfolioFullGridBlock';
import { getAllPortfolios } from '@/data/portfolio';
import { absoluteUrl, createSeoMetadata, JsonLd } from '@/lib/seo';

export const metadata = createSeoMetadata({
  title: 'ผลงานอ้างอิง Post-Tension กำแพงกันดิน และรั้วสำเร็จรูป | PCC ขอนแก่น',
  description: 'รวมผลงานอ้างอิง 19 โครงการ งานโพสเทนชั่น กำแพงกันดิน รั้วสำเร็จรูป และงานอาคาร เพื่อประกอบการตัดสินใจก่อนส่งข้อมูลให้ทีมขายและวิศวกร PCC ขอนแก่น',
  path: '/portfolio',
});

export const revalidate = 3600;

export default async function PortfolioPage() {
  const portfolios = await getAllPortfolios();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl('/portfolio')}#webpage`,
    name: 'ผลงานอ้างอิงของ PCC ขอนแก่น',
    url: absoluteUrl('/portfolio'),
    inLanguage: 'th-TH',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: portfolios.length,
      itemListElement: portfolios.map((portfolio, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absoluteUrl(`/portfolio/${portfolio.slug}`),
        name: portfolio.title,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <JsonLd data={schema} />
      <PortfolioFullGridBlock
        headline="ผลงานอ้างอิงจากประสบการณ์ของบริษัท"
        description="รวมโครงการเดิมของบริษัทไว้ในเว็บไซต์นี้ เพื่อให้ลูกค้าดูข้อมูลได้ต่อเนื่องโดยไม่ต้องออกไปเว็บไซต์อื่น"
      />
    </main>
  );
}
