import type { Product } from './config';

export interface SeoMeta {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
}

export function buildProductMeta(
  product: Product,
  siteUrl: string
): SeoMeta {
  return {
    title: `${product.title} | デジタル販売スターターキット`,
    description: product.subtitle ?? product.description.slice(0, 120),
    canonical: `${siteUrl}/p/${product.slug}`,
    ogTitle: product.title,
    ogDescription: product.subtitle ?? product.description.slice(0, 120),
    ogImage: product.og_image
      ? `${siteUrl}${product.og_image}`
      : `${siteUrl}/og/default.png`,
    ogType: 'product',
  };
}

export function buildProductJsonLd(product: Product, siteUrl: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    url: `${siteUrl}/p/${product.slug}`,
    image: product.og_image
      ? `${siteUrl}${product.og_image}`
      : `${siteUrl}/og/default.png`,
    offers: {
      '@type': 'Offer',
      priceCurrency: product.currency,
      price: product.price_jpy.toString(),
      availability: 'https://schema.org/InStock',
    },
    keywords: [...product.tags_ja, ...product.tags_en].join(', '),
  };
}

export function buildFaqJsonLd(faqs: Array<{ q: string; a: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}
