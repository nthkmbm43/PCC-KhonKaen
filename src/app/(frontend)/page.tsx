import { faqs as homeFAQ } from "@/data/faq";
import { createSeoMetadata, faqJsonLd, JsonLd } from "@/lib/seo";
import RenderBlocks from "@/components/blocks/RenderBlocks";
import { Metadata } from "next";
import { getPageWithSeo } from "@/lib/repositories/page";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageWithSeo("home");

  return createSeoMetadata({
    title: page?.seo?.title || page?.title || "PCC Post-Tension",
    description: page?.seo?.description || "",
    path: "/",
    image: page?.seo?.ogImage || undefined,
  });
}

export default async function Home() {
  const page = await getPageWithSeo("home");
  const isDraftMode = (await draftMode()).isEnabled;

  // Strict check: if not in draft mode, page must be published
  if (!page || (!isDraftMode && page.workflowState !== "published")) {
    // We shouldn't 404 the home page normally, but we follow the strict CMS integration rule
    // Since we seeded it, it should exist.
    notFound();
  }

  const layout = Array.isArray(page.content) ? page.content : [];

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-x-clip">
      <JsonLd data={faqJsonLd(homeFAQ)} />
      
      {isDraftMode && (
        <div className="bg-amber-100 text-amber-800 text-center text-xs py-1 font-semibold sticky top-0 z-50">
          Preview Mode: You are viewing unpublished changes.
        </div>
      )}

      <RenderBlocks layout={layout} />
    </div>
  );
}
