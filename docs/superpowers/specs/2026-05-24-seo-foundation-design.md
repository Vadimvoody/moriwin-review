# SEO Foundation Design

## Goal

Strengthen MoriWin Review's SEO foundation while the affiliate link is still pending. The first SEO package focuses on trust, structured data, internal linking, and indexable page quality for the pages that already exist.

## Current State

- The site already has sitemap generation, `robots.txt`, canonical URLs, meta descriptions, Open Graph, Twitter tags, and global Organization/WebSite JSON-LD.
- The homepage has a Review schema, but article pages do not yet emit Article schema.
- Casino review pages do not yet emit page-specific Review schema.
- Breadcrumbs are not visible and are not represented as BreadcrumbList schema.
- Listing pages (`/articles/`, `/bonus/`, `/casinos/`) are functional but can be strengthened with short SEO copy and FAQ-style answers.
- Existing content already covers core MoriWin topics: overview, bonus, registration, withdrawal, mirror, crypto casino, $MORI, and MoriVPN.

## Primary SEO Direction

Use a trust and technical SEO pass before creating more content. This is the lowest-risk next step because it improves the already-indexable surface area, avoids thin duplicate pages, and creates reusable patterns for future articles.

## Scope

### Structured Data Layer

Add centralized JSON-LD builders for:

- `BreadcrumbList`
- `Article`
- `Review`
- `FAQPage`

These helpers should live in one small SEO utility module and return plain objects that can be passed to the existing `Layout` `schema` prop. Avoid duplicating schema construction inline across pages.

### Breadcrumbs

Add a reusable `Breadcrumbs.astro` component.

It should:

- Render visible breadcrumb links above page content where useful.
- Accept a short array of `{ label, href }` items.
- Keep styling consistent with the current editorial/casino visual language.
- Be usable on article detail pages, casino detail pages, and listing pages.

Breadcrumb schema should be generated from the same items so visible breadcrumbs and JSON-LD cannot drift.

### Article SEO

Update article pages to emit Article JSON-LD with:

- `headline`
- `description`
- `datePublished`
- `dateModified`, falling back to `pubDate`
- `author`
- `publisher`
- `mainEntityOfPage`
- `inLanguage`

Article pages should also get visible breadcrumbs: Home -> Articles -> Current article.

### Casino Review SEO

Update casino review pages to emit page-specific Review JSON-LD with:

- reviewed casino name and URL
- author/publisher
- rating value and rating bounds
- publish/update dates where available
- review body based on the casino description

Casino detail pages should get visible breadcrumbs: Home -> Casinos -> Current casino.

### Listing Page SEO Copy

Strengthen listing pages with compact, useful copy rather than filler.

Pages to update:

- `/articles/`: describe the guide cluster and link intent.
- `/bonus/`: summarize available bonus types, promo code status, and wagering considerations.
- `/casinos/`: explain review methodology and how casino ratings are assigned.

If FAQ blocks are added, each answer should be specific and short. FAQ schema should only be emitted for FAQs actually visible on the page.

### Internal Linking

Improve internal links without keyword stuffing.

Target relationships:

- Main review links to bonus, registration, mirror, and withdrawal guides.
- Bonus article links to casino review and registration guide.
- Registration article links to bonus and withdrawal guide.
- Mirror article links to MoriVPN and the casino review.
- Withdrawal article links back to registration and review.

Article sidebars can include a compact related-materials block if it can be driven from existing content without overbuilding.

## Out of Scope

- Adding the final affiliate referral URL. This waits for the manager's response.
- Creating a large batch of new articles.
- Reworking the visual design.
- Adding analytics, Search Console automation, or third-party SEO APIs.
- Changing existing casino claims unless a content issue is discovered during implementation.

## Acceptance Criteria

- `npm run build` succeeds.
- Article pages include Article JSON-LD and BreadcrumbList JSON-LD.
- Casino review pages include Review JSON-LD and BreadcrumbList JSON-LD.
- Listing pages have stronger human-readable SEO copy and no thin placeholder sections.
- Any FAQ schema corresponds to visible FAQ content.
- Existing affiliate/external link rules remain intact.
- Mobile pages retain no horizontal overflow in representative checks.
- Sitemap and robots behavior remains valid.

## Verification Plan

- Run `npm run build`.
- Use local preview and Playwright to check representative pages:
  - `/`
  - `/articles/`
  - `/articles/bonus-moriwin-400/`
  - `/articles/moriwin-mirror/`
  - `/bonus/`
  - `/casinos/`
  - `/casinos/moriwin/`
- Verify JSON-LD script contents include expected schema types.
- Verify canonical links and titles still render.
- Verify external and affiliate links still have required `target` and `rel` attributes.
- Verify mobile viewport has no horizontal overflow.

## Implementation Notes

- Keep the first implementation minimal and reusable.
- Prefer one SEO helper module over scattered inline schema objects.
- Do not introduce new dependencies unless a build-time need appears.
- Keep breadcrumbs and schema item arrays derived from the same data where possible.
