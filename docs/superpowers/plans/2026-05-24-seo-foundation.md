# SEO Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add reusable structured data, visible breadcrumbs, stronger listing-page SEO copy, and safer internal linking to the existing MoriWin Review site.

**Architecture:** Create one focused SEO utility module for JSON-LD builders and one reusable breadcrumbs component. Wire those into existing Astro layouts/pages without changing the visual system or adding dependencies. Keep content improvements compact and tied to existing pages.

**Tech Stack:** Astro 6.3.7, TypeScript, MDX content collections, Tailwind CSS 4 classes, existing `Layout` schema prop.

---

## File Structure

- Create `src/lib/seo.ts`: plain TypeScript helpers for absolute URLs, BreadcrumbList JSON-LD, Article JSON-LD, Review JSON-LD, and FAQPage JSON-LD.
- Create `src/components/Breadcrumbs.astro`: visible breadcrumb component that accepts the same `{ label, href }` data used by schema helpers.
- Modify `src/components/ArticleLayout.astro`: accept breadcrumbs and schema props, render breadcrumbs, pass merged schemas to `Layout`.
- Modify `src/pages/articles/[slug]/index.astro`: build Article schema and breadcrumbs for every article page.
- Modify `src/pages/casinos/[slug]/index.astro`: build Review schema and breadcrumbs for casino review pages.
- Modify `src/pages/articles/index.astro`: add breadcrumbs, BreadcrumbList schema, and compact SEO intro/FAQ copy.
- Modify `src/pages/bonus/index.astro`: add breadcrumbs, BreadcrumbList/FAQ schema, and compact bonus SEO copy.
- Modify `src/pages/casinos/index.astro`: add breadcrumbs, BreadcrumbList/FAQ schema, and compact methodology copy.
- Modify selected MDX files for internal links: `bonus-moriwin-400.mdx`, `moriwin-registration.mdx`, `moriwin-mirror.mdx`, `moriwin-withdrawal.mdx`.

---

### Task 1: Add SEO JSON-LD Helpers

**Files:**
- Create: `src/lib/seo.ts`

- [ ] **Step 1: Create the SEO helper module**

Create `src/lib/seo.ts` with this content:

```ts
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
```

- [ ] **Step 2: Run build to validate helper imports**

Run: `npm run build`

Expected: PASS, `13 page(s) built`, `Complete!`

- [ ] **Step 3: Commit helper module**

```powershell
git add -- src/lib/seo.ts
```

---

### Task 2: Add Visible Breadcrumb Component

**Files:**
- Create: `src/components/Breadcrumbs.astro`

- [ ] **Step 1: Create breadcrumb component**

Create `src/components/Breadcrumbs.astro` with this content:

```astro
---
import type { BreadcrumbItem } from '../lib/seo';

interface Props {
  items: BreadcrumbItem[];
}

const { items } = Astro.props;
---

{items.length > 0 && (
  <nav aria-label="Хлебные крошки" class="mb-8 text-xs text-text-dim">
    <ol class="flex flex-wrap items-center gap-2">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <li class="inline-flex items-center gap-2">
            {index > 0 && <span aria-hidden="true" class="text-border-strong">/</span>}
            {isLast ? (
              <span class="text-text-muted" aria-current="page">{item.label}</span>
            ) : (
              <a href={item.href} class="hover:text-gold transition-colors">
                {item.label}
              </a>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
)}
```

- [ ] **Step 2: Run build to validate Astro syntax**

Run: `npm run build`

Expected: PASS, `13 page(s) built`, `Complete!`

- [ ] **Step 3: Commit breadcrumb component**

```powershell
git add -- src/components/Breadcrumbs.astro
```

---

### Task 3: Wire Article Schema and Breadcrumbs

**Files:**
- Modify: `src/components/ArticleLayout.astro`
- Modify: `src/pages/articles/[slug]/index.astro`

- [ ] **Step 1: Update ArticleLayout props and rendering**

Modify `src/components/ArticleLayout.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import SectionDecor from './SectionDecor.astro';
import Breadcrumbs from './Breadcrumbs.astro';
import type { BreadcrumbItem } from '../lib/seo';

interface Props {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  author?: string;
  eyebrow?: string;
  readingTime?: number;
  tags?: string[];
  canonical?: string;
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const {
  title,
  description,
  pubDate,
  updatedDate,
  author = 'Редакция',
  eyebrow,
  readingTime,
  tags,
  canonical,
  noindex = false,
  breadcrumbs = [],
  schema,
} = Astro.props;

const dateStr = pubDate.toLocaleDateString('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const updatedStr = updatedDate
  ? updatedDate.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  : null;
---

<Layout
  title={title}
  description={description}
  canonical={canonical}
  noindex={noindex}
  ogType="article"
  schema={schema}
>
  <div class="relative overflow-hidden">
    <SectionDecor leftText="ARTICLE" rightText="2026" />
    <article class="max-w-[1240px] mx-auto px-6 sm:px-8 py-16 md:py-24 relative z-10">
      {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
      <div class="grid gap-14 md:gap-20 md:grid-cols-[minmax(0,1fr)_320px]">
        <div class="prose-mori max-w-[720px] min-w-0">
          {eyebrow && (
            <p class="eyebrow flex items-center gap-3 mb-5">
              <span class="inline-block w-6 h-px bg-gold-dim"></span>
              {eyebrow}
            </p>
          )}

          <h1
            class="display-title text-[clamp(32px,5vw,52px)] mb-8"
            style="margin-top: 0;"
          >
            <Fragment set:html={title.replace(/<em>|<\/em>/g, '')} />
          </h1>

          <div class="flex flex-wrap gap-4 text-[13px] text-text-dim tabular mb-10 pb-8 border-b border-border">
            <span class="inline-flex items-center gap-2">
              <span class="inline-block w-1 h-1 rounded-full bg-gold"></span>
              {dateStr}
            </span>
            {updatedStr && (
              <span class="inline-flex items-center gap-2">
                <span class="inline-block w-1 h-1 rounded-full bg-gold"></span>
                Обновлено {updatedStr}
              </span>
            )}
            <span class="inline-flex items-center gap-2">
              <span class="inline-block w-1 h-1 rounded-full bg-gold"></span>
              {author}
            </span>
            {readingTime && (
              <span class="inline-flex items-center gap-2">
                <span class="inline-block w-1 h-1 rounded-full bg-gold"></span>
                {readingTime} мин чтения
              </span>
            )}
          </div>

          <slot />
        </div>

        <aside class="md:sticky md:top-24 md:self-start space-y-6">
          <slot name="sidebar" />
        </aside>
      </div>
    </article>
  </div>
</Layout>
```

- [ ] **Step 2: Build article schema in article route**

Modify `src/pages/articles/[slug]/index.astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import ArticleLayout from '../../../components/ArticleLayout.astro';
import { buildArticleSchema, buildBreadcrumbSchema } from '../../../lib/seo';

export async function getStaticPaths() {
  const articles = await getCollection('articles');
  return articles.map((article) => ({
    params: { slug: article.id },
    props: { article },
  }));
}

const { article } = Astro.props;
const { Content } = await render(article);
const d = article.data;
const articlePath = `/articles/${article.id}/`;
const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Статьи', href: '/articles/' },
  { label: d.title, href: articlePath },
];
const schemas = [
  buildArticleSchema({
    title: d.title,
    description: d.description,
    url: articlePath,
    pubDate: d.pubDate,
    updatedDate: d.updatedDate,
    author: d.author,
  }),
  buildBreadcrumbSchema(breadcrumbs),
];
---

<ArticleLayout
  title={d.title}
  description={d.description}
  pubDate={d.pubDate}
  updatedDate={d.updatedDate}
  author={d.author}
  eyebrow={d.eyebrow}
  readingTime={d.readingTime}
  tags={d.tags}
  canonical={d.canonical}
  noindex={d.noindex}
  breadcrumbs={breadcrumbs}
  schema={schemas}
>
  <Content />

  <Fragment slot="sidebar">
    <div class="p-6 border border-border bg-bg-card" style="border-top: 2px solid var(--color-gold);">
      <p class="eyebrow mb-3 flex items-center gap-3">
        <span class="inline-block w-5 h-px bg-gold-dim"></span>
        Что дальше
      </p>
      <p class="text-sm text-text-muted leading-relaxed mb-5">
        Попробуйте MoriWin с нашим промокодом и оцените сами.
      </p>
      <a
        href="https://play.moricasino.com/"
        class="btn-gold w-full hover:bg-gold-bright text-center"
        rel="nofollow sponsored noopener"
        target="_blank"
      >
        Перейти в казино ->
      </a>
    </div>
  </Fragment>
</ArticleLayout>
```

- [ ] **Step 3: Run build**

Run: `npm run build`

Expected: PASS, `13 page(s) built`, `Complete!`

- [ ] **Step 4: Verify Article and Breadcrumb schemas locally**

Run preview:

```powershell
npm run preview -- --host 127.0.0.1 --port 4321
```

Use Playwright or browser devtools on `/articles/bonus-moriwin-400/`. Expected JSON-LD types include `Organization`, `WebSite`, `Article`, and `BreadcrumbList`. Expected visible breadcrumb text includes `Главная`, `Статьи`, and the article title.

- [ ] **Step 5: Commit article SEO wiring**

```powershell
git add -- src/components/ArticleLayout.astro src/pages/articles/[slug]/index.astro
```

---

### Task 4: Wire Casino Review Schema and Breadcrumbs

**Files:**
- Modify: `src/pages/casinos/[slug]/index.astro`

- [ ] **Step 1: Import SEO helpers and Breadcrumbs**

At the top of `src/pages/casinos/[slug]/index.astro`, add:

```astro
import Breadcrumbs from '../../../components/Breadcrumbs.astro';
import { buildBreadcrumbSchema, buildReviewSchema } from '../../../lib/seo';
```

- [ ] **Step 2: Define breadcrumbs and schemas after `const c = casino.data;`**

Add this block:

```astro
const casinoPath = `/casinos/${c.slug ?? casino.id}/`;
const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Казино', href: '/casinos/' },
  { label: c.name, href: casinoPath },
];
const schemas = [
  buildReviewSchema({
    casinoName: c.name,
    casinoUrl: c.referralUrl,
    pageUrl: casinoPath,
    description: c.description,
    rating: c.rating,
    pubDate: c.pubDate,
    updatedDate: c.updatedDate,
  }),
  buildBreadcrumbSchema(breadcrumbs),
];
```

- [ ] **Step 3: Pass schema to Layout**

Change the opening `Layout` usage to:

```astro
<Layout
  title={`${c.name} — обзор казино 2026, бонусы ${c.welcomeBonus}`}
  description={c.description}
  schema={schemas}
>
```

- [ ] **Step 4: Render breadcrumbs inside the main section**

Inside the section at line 85, immediately before the grid div, add:

```astro
<Breadcrumbs items={breadcrumbs} />
```

- [ ] **Step 5: Run build and verify casino schemas**

Run: `npm run build`

Expected: PASS, `13 page(s) built`, `Complete!`

In local preview on `/casinos/moriwin/`, expected JSON-LD types include `Organization`, `WebSite`, `Review`, and `BreadcrumbList`. Expected visible breadcrumbs include `Главная`, `Казино`, and `MoriWin Casino`.

- [ ] **Step 6: Commit casino SEO wiring**

```powershell
git add -- src/pages/casinos/[slug]/index.astro
```

---

### Task 5: Add Listing Page SEO Copy, Breadcrumbs, and FAQ Schema

**Files:**
- Modify: `src/pages/articles/index.astro`
- Modify: `src/pages/bonus/index.astro`
- Modify: `src/pages/casinos/index.astro`

- [ ] **Step 1: Update articles listing imports and schema data**

In `src/pages/articles/index.astro`, add imports:

```astro
import Breadcrumbs from '../../components/Breadcrumbs.astro';
import { buildBreadcrumbSchema, buildFaqSchema } from '../../lib/seo';
```

After `const recent = allArticles.slice(0, 12);`, add:

```astro
const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Статьи', href: '/articles/' },
];
const faqItems = [
  {
    question: 'Какие гайды по MoriWin стоит читать в первую очередь?',
    answer: 'Начните с обзора казино, бонуса 400% + 100 FS, регистрации, вывода средств и рабочего зеркала. Эти материалы закрывают основные действия нового игрока.',
  },
  {
    question: 'Как часто обновляются статьи?',
    answer: 'Мы обновляем материалы при изменении бонусов, зеркал, условий вывода или важных деталей экосистемы MoriWin.',
  },
];
const schemas = [buildBreadcrumbSchema(breadcrumbs), buildFaqSchema(faqItems)];
```

Change `Layout` to include `schema={schemas}`.

Render breadcrumbs after the opening `<section ...>`:

```astro
<Breadcrumbs items={breadcrumbs} />
```

Add this intro paragraph after the `h1`:

```astro
<p class="text-[18px] leading-[1.6] text-text-muted max-w-[760px] mb-12">
  Здесь собраны практические материалы по MoriWin: от регистрации и бонусов до вывода средств, зеркал, MoriVPN и токена $MORI. Мы связываем инструкции между собой, чтобы новый игрок мог быстро пройти путь от первого входа до безопасного вывода.
</p>
```

Add this FAQ block before `</section>`:

```astro
<div class="mt-16 grid gap-4 md:grid-cols-2">
  {faqItems.map((item) => (
    <div class="p-6 border border-border bg-bg-card">
      <h2 class="text-lg font-bold text-text mb-3" style="font-family: var(--font-display);">{item.question}</h2>
      <p class="text-sm text-text-muted leading-relaxed">{item.answer}</p>
    </div>
  ))}
</div>
```

- [ ] **Step 2: Update bonus listing imports and schema data**

In `src/pages/bonus/index.astro`, add imports:

```astro
import Breadcrumbs from '../../components/Breadcrumbs.astro';
import { buildBreadcrumbSchema, buildFaqSchema } from '../../lib/seo';
```

After `const allBonuses = ...`, add:

```astro
const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Бонусы', href: '/bonus/' },
];
const faqItems = [
  {
    question: 'Есть ли актуальный промокод MoriWin?',
    answer: 'Сейчас на сайте указан промокод MORIBONUS. Финальную партнёрскую ссылку добавим после подтверждения менеджера.',
  },
  {
    question: 'На что смотреть перед активацией бонуса?',
    answer: 'Проверяйте wagering, минимальный депозит, срок действия бонуса и максимальную ставку при отыгрыше.',
  },
];
const schemas = [buildBreadcrumbSchema(breadcrumbs), buildFaqSchema(faqItems)];
```

Change `Layout` to include `schema={schemas}`.

Render breadcrumbs after the opening `<section ...>`:

```astro
<Breadcrumbs items={breadcrumbs} />
```

Add this intro after the `h1`:

```astro
<p class="text-[18px] leading-[1.6] text-text-muted max-w-[760px] mb-12">
  На этой странице собраны бонусы MoriWin, которые стоит проверять перед депозитом: приветственный пакет, кэшбэк и ежедневные акции. Мы отдельно показываем промокод, отыгрыш и минимальные условия, чтобы предложение было понятно до перехода в казино.
</p>
```

Add the same FAQ rendering block before `</section>` using `faqItems`.

- [ ] **Step 3: Update casinos listing imports and schema data**

In `src/pages/casinos/index.astro`, add imports:

```astro
import Breadcrumbs from '../../components/Breadcrumbs.astro';
import { buildBreadcrumbSchema, buildFaqSchema } from '../../lib/seo';
```

After `const allCasinos = ...`, add:

```astro
const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Казино', href: '/casinos/' },
];
const faqItems = [
  {
    question: 'Как формируется рейтинг казино?',
    answer: 'Мы учитываем скорость вывода, размер и прозрачность бонусов, поддержку, KYC, платёжные методы, ассортимент игр и собственный тестовый опыт.',
  },
  {
    question: 'Почему сейчас в рейтинге только MoriWin?',
    answer: 'MoriWin — основной объект текущего независимого обзора. Новые казино добавим только после отдельного тестирования и проверки выплат.',
  },
];
const schemas = [buildBreadcrumbSchema(breadcrumbs), buildFaqSchema(faqItems)];
```

Change `Layout` to include `schema={schemas}`.

Render breadcrumbs after the opening `<section ...>`:

```astro
<Breadcrumbs items={breadcrumbs} />
```

Add this intro after the `h1`:

```astro
<p class="text-[18px] leading-[1.6] text-text-muted max-w-[760px] mb-12">
  Рейтинг строится на проверяемых параметрах: лицензия, бонусы, скорость выплат, KYC, поддержка и фактический пользовательский опыт. Мы не добавляем площадку в список без отдельного обзора и теста ключевых сценариев.
</p>
```

Add the same FAQ rendering block before `</section>` using `faqItems`.

- [ ] **Step 4: Run build and inspect listing pages**

Run: `npm run build`

Expected: PASS, `13 page(s) built`, `Complete!`

Use local preview for `/articles/`, `/bonus/`, and `/casinos/`. Expected: visible breadcrumbs, intro paragraphs, FAQ cards, and JSON-LD types include `BreadcrumbList` and `FAQPage`.

- [ ] **Step 5: Commit listing SEO updates**

```powershell
git add -- src/pages/articles/index.astro src/pages/bonus/index.astro src/pages/casinos/index.astro
```

---

### Task 6: Improve Internal Links in Existing Articles

**Files:**
- Modify: `src/content/articles/bonus-moriwin-400.mdx`
- Modify: `src/content/articles/moriwin-registration.mdx`
- Modify: `src/content/articles/moriwin-mirror.mdx`
- Modify: `src/content/articles/moriwin-withdrawal.mdx`

- [ ] **Step 1: Add related links to bonus article**

In `src/content/articles/bonus-moriwin-400.mdx`, after the numbered list in `Как получить бонус`, add:

```mdx
Если вы ещё не создавали аккаунт, сначала откройте [пошаговую инструкцию по регистрации](/articles/moriwin-registration/). Для общей оценки площадки смотрите [полный обзор MoriWin Casino](/casinos/moriwin/), а перед первым кэшаутом — [гайд по выводу средств](/articles/moriwin-withdrawal/).
```

- [ ] **Step 2: Add related links to registration article**

In `src/content/articles/moriwin-registration.mdx`, before `## Частые ошибки при регистрации`, add:

```mdx
После создания аккаунта проверьте [актуальный бонус MoriWin 400% + 100 FS](/articles/bonus-moriwin-400/) и заранее изучите [условия вывода средств](/articles/moriwin-withdrawal/), чтобы не упереться в KYC или лимиты после выигрыша.
```

- [ ] **Step 3: Add related links to mirror article**

In `src/content/articles/moriwin-mirror.mdx`, after the MoriVPN benefits list and before the download line, add:

```mdx
Если зеркало открывается, но вы не уверены в самом казино, начните с [полного обзора MoriWin Casino](/casinos/moriwin/). Для постоянного доступа также полезен наш [обзор MoriVPN](/articles/mori-vpn-review/).
```

- [ ] **Step 4: Add related links to withdrawal article**

In `src/content/articles/moriwin-withdrawal.mdx`, near the first section after the opening explanation, add:

```mdx
Перед первым выводом убедитесь, что аккаунт создан по правильной схеме из [гайда по регистрации MoriWin](/articles/moriwin-registration/). Общие плюсы, минусы и лимиты площадки собраны в [обзоре MoriWin Casino](/casinos/moriwin/).
```

- [ ] **Step 5: Run build**

Run: `npm run build`

Expected: PASS, `13 page(s) built`, `Complete!`

- [ ] **Step 6: Commit internal link improvements**

```powershell
git add -- src/content/articles/bonus-moriwin-400.mdx src/content/articles/moriwin-registration.mdx src/content/articles/moriwin-mirror.mdx src/content/articles/moriwin-withdrawal.mdx
```

---

### Task 7: Final Verification

**Files:**
- No source changes expected unless verification finds a concrete bug.

- [ ] **Step 1: Run production build**

Run: `npm run build`

Expected: PASS, `13 page(s) built`, `Complete!`

- [ ] **Step 2: Start local preview**

Run:

```powershell
npm run preview -- --host 127.0.0.1 --port 4321
```

Expected: Astro preview server listens on `http://127.0.0.1:4321/`.

- [ ] **Step 3: Verify representative pages with Playwright**

Run a Playwright check equivalent to:

```js
async (page) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const paths = ['/', '/articles/', '/articles/bonus-moriwin-400/', '/articles/moriwin-mirror/', '/bonus/', '/casinos/', '/casinos/moriwin/'];
  const results = [];
  for (const path of paths) {
    const response = await page.goto(`http://127.0.0.1:4321${path}`, { waitUntil: 'networkidle' });
    const data = await page.evaluate(() => {
      const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')]
        .flatMap((script) => JSON.parse(script.textContent || '[]'))
        .map((schema) => schema['@type']);
      const badExternal = [...document.querySelectorAll('a[href^="http"]')]
        .filter((a) => !a.href.includes('127.0.0.1') && (!a.target || !a.rel.includes('noopener')))
        .length;
      const badAffiliate = [...document.querySelectorAll('a[href*="play.moricasino.com"]')]
        .filter((a) => a.target !== '_blank' || !a.rel.includes('nofollow') || !a.rel.includes('sponsored') || !a.rel.includes('noopener'))
        .length;
      return {
        title: document.title,
        schemas,
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        badExternal,
        badAffiliate,
      };
    });
    results.push({ path, status: response?.status(), ...data });
  }
  return results;
}
```

Expected:

- All statuses are `200`.
- Article detail pages include `Article` and `BreadcrumbList`.
- Casino detail pages include `Review` and `BreadcrumbList`.
- Listing pages include `BreadcrumbList` and `FAQPage`.
- `hasHorizontalOverflow` is `false` for all checked pages.
- `badExternal` is `0` and `badAffiliate` is `0`.

- [ ] **Step 4: Verify sitemap and robots still respond locally**

Check `/sitemap-index.xml`, `/sitemap-0.xml`, `/robots.txt`, and `/favicon.svg` in preview. Expected status: `200` for each.

- [ ] **Step 5: Check git status**

Run: `git status --short`

Expected: no output.

If there are source changes from bug fixes, inspect `git diff`, run `npm run build` again, then commit with a focused message.

---

## Self-Review Notes

- Spec coverage: schema helpers, breadcrumbs, Article schema, Review schema, FAQ schema, listing copy, internal links, and verification are covered by Tasks 1-7.
- Scope check: the plan does not add new article clusters, affiliate URLs, analytics, or design redesigns.
- Type consistency: `BreadcrumbItem`, `FaqItem`, and builder names are defined in Task 1 and reused consistently in later tasks.
- Completeness scan: every implementation step has concrete file paths, commands, or code.
