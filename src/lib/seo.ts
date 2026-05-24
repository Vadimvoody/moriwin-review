import { SITE } from '../config/site';

export type BreadcrumbItem = {
  label: string;
  href: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).toString();
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export function buildArticleSchema(input: {
  title: string;
  description: string;
  url: string;
  pubDate: Date;
  updatedDate?: Date;
  author: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    datePublished: input.pubDate.toISOString(),
    dateModified: (input.updatedDate ?? input.pubDate).toISOString(),
    inLanguage: SITE.locale,
    author: {
      '@type': 'Organization',
      name: input.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.organization.name,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/logo.svg'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(input.url),
    },
  };
}

export function buildReviewSchema(input: {
  casinoName: string;
  casinoUrl: string;
  pageUrl: string;
  description: string;
  rating: number;
  pubDate: Date;
  updatedDate?: Date;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Organization',
      name: input.casinoName,
      url: input.casinoUrl,
    },
    author: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.organization.name,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/logo.svg'),
      },
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: String(input.rating),
      bestRating: '5',
      worstRating: '1',
    },
    datePublished: input.pubDate.toISOString(),
    dateModified: (input.updatedDate ?? input.pubDate).toISOString(),
    reviewBody: input.description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(input.pageUrl),
    },
  };
}

export function buildFaqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
