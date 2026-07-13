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
const serviceUrls = [
  {
    name: "L-shape retaining wall systems in Khon Kaen",
    url: "/products/l-shape-retaining-wall-khon-kaen",
  },
  {
    name: "Precast concrete fence systems in Khon Kaen",
    url: "/products/precast-fence-khon-kaen",
  },
  {
    name: "Precast concrete slabs in Khon Kaen",
    url: "/products/precast-concrete-slab-khon-kaen",
  },
  {
    name: "Post-tension slab design and installation",
    url: "/products/post-tension-slab-khon-kaen",
  },
  {
    name: "Precast concrete wall products",
    url: "/products/precast-wall-khon-kaen",
  },
  {
    name: "Barbed-wire concrete fence posts",
    url: "/products/barbed-wire-fence-post-khon-kaen",
  },
  {
    name: "Concrete piles in Khon Kaen",
    url: "/products/concrete-pile-khon-kaen",
  },
] as const;

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

export function organizationJsonLd(contact?: Record<string, string | undefined>) {
  const sameAs = [
    contact?.facebookUrl || siteConfig.social.facebook.url,
    contact?.tiktokUrl || siteConfig.social.tiktok.url,
    contact?.lineUrl || siteConfig.social.line.url,
  ].filter((url, index, urls): url is string => Boolean(url) && urls.indexOf(url) === index);

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
    taxID: siteConfig.taxId,
    foundingDate: String(siteConfig.foundedYear - 543),
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: contact?.mainPhone || siteConfig.phone,
        contactType: "sales",
        areaServed: "TH",
        availableLanguage: ["th", "en"],
      },
    ],
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
    sameAs,
    makesOffer: siteConfig.keywords.slice(0, 6).map((keyword) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: keyword,
        areaServed: siteConfig.serviceAreas,
      },
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}#website`,
    name: siteConfig.name,
    alternateName: "PCC Post-Tension",
    url: siteConfig.url,
    publisher: {
      "@id": `${siteConfig.url}#organization`,
    },
    inLanguage: "th-TH",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/products?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function serviceCatalogJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteConfig.url}#services`,
    name: "PCC Post-Tension services",
    itemListElement: serviceUrls.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: service.name,
      url: absoluteUrl(service.url),
    })),
  };
}

export function breadcrumbJsonLd(items: readonly { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
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
