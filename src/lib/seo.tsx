import type { Metadata } from "next";
import { siteConfig } from "@/data/site-config";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: readonly string[];
  image?: string;
};

const defaultImage = "/images/hero-banner.webp";

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

export function createSeoMetadata({
  title,
  description,
  path = "/",
  keywords = siteConfig.keywords,
  image = defaultImage,
}: SeoInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    keywords: [...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function organizationJsonLd(contact?: any) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}#organization`,
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/images/logo.png"),
    image: absoluteUrl(defaultImage),
    description: siteConfig.description,
    telephone: contact?.mainPhone || siteConfig.phone,
    email: siteConfig.email,
    taxID: siteConfig.taxId,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.offices[0].address,
      addressLocality: "เมืองขอนแก่น",
      addressRegion: siteConfig.offices[0].province,
      postalCode: "40000",
      addressCountry: "TH",
    },
    areaServed: siteConfig.serviceAreas.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
    sameAs: [
      contact?.facebookUrl || siteConfig.social.facebook.url,
      siteConfig.social.tiktok.url,
      contact?.lineUrl || siteConfig.social.line.url,
    ],
  };
}

export function faqJsonLd(items: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
