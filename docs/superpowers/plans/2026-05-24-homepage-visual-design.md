# Визуал и анимации для главной страницы — План реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить визуальные элементы и анимации на главную страницу MoriWin Review — декоративные фоны, SVG-иконки, scroll-анимации, hover-эффекты.

**Architecture:** Чистый CSS + vanilla JS, без внешних библиотек. Декоративные элементы через CSS-паттерны и inline SVG. Анимации через IntersectionObserver + CSS transitions. Все GPU-accelerated (transform, opacity).

**Tech Stack:** Astro components, Tailwind CSS 4.1, vanilla JavaScript

---

## Файловая структура

```
src/
├── styles/
│   └── animations.css          # НОВЫЙ — keyframes, transition-классы
├── scripts/
│   └── scroll-reveal.js        # НОВЫЙ — IntersectionObserver
├── components/
│   ├── HeroDecor.astro         # НОВЫЙ — декор hero-секции
│   └── ArticleCard.astro       # ИЗМЕНЁН — добавить SVG-иконки
├── pages/
│   └── index.astro             # ИЗМЕНЁН — подключить компоненты
└── content.config.ts           # БЕЗ ИЗМЕНЕНИЙ
public/
├── og-default.jpg              # НОВЫЙ — OG-заглушка
└── logo.svg                    # НОВЫЙ — текстовый логотип
```

---

## Задача 1: CSS-анимации и переходы

**Файлы:**
- Create: `src/styles/animations.css`

- [ ] **Шаг 1: Создать файл анимаций**

```css
/* src/styles/animations.css */

/* === SCROLL REVEAL === */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}
/* Staggered children */
.reveal-stagger > * {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal-stagger.revealed > * {
  opacity: 1;
  transform: translateY(0);
}
.reveal-stagger.revealed > *:nth-child(1) { transition-delay: 0ms; }
.reveal-stagger.revealed > *:nth-child(2) { transition-delay: 80ms; }
.reveal-stagger.revealed > *:nth-child(3) { transition-delay: 160ms; }
.reveal-stagger.revealed > *:nth-child(4) { transition-delay: 240ms; }
.reveal-stagger.revealed > *:nth-child(5) { transition-delay: 320ms; }
.reveal-stagger.revealed > *:nth-child(6) { transition-delay: 400ms; }

/* === FLOATING CHIPS === */
@keyframes chip-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-12px) rotate(3deg); }
  66% { transform: translateY(-6px) rotate(-2deg); }
}
@keyframes chip-float-alt {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-18px) rotate(-4deg); }
}
.chip-float {
  animation: chip-float 6s ease-in-out infinite;
  pointer-events: none;
}
.chip-float-alt {
  animation: chip-float-alt 8s ease-in-out infinite;
  pointer-events: none;
}

/* === HOVER EFFECTS === */
.card-hover {
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 24px rgba(247, 203, 106, 0.12), 0 8px 32px rgba(0, 0, 0, 0.4);
  border-color: var(--color-gold-dim);
}

/* === BUTTON MICRO === */
.btn-micro {
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}
.btn-micro:hover {
  transform: scale(1.02);
}
.btn-micro:active {
  transform: scale(0.98);
}

/* === GOLD PULSE === */
@keyframes gold-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.gold-pulse {
  animation: gold-pulse 3s ease-in-out infinite;
}

/* === NOISE TEXTURE OVERLAY === */
.noise-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.035;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
  z-index: 1;
}

/* === GRADIENT GRID PATTERN === */
.gradient-grid::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.04;
  pointer-events: none;
  background-image:
    linear-gradient(var(--color-gold-dim) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-gold-dim) 1px, transparent 1px);
  background-size: 80px 80px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 70%);
  z-index: 0;
}

/* === LIGHT RAYS === */
.light-rays {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.light-rays::before,
.light-rays::after {
  content: '';
  position: absolute;
  border-radius: 50%;
}
.light-rays::before {
  width: 600px;
  height: 400px;
  top: -100px;
  left: -100px;
  background: radial-gradient(ellipse, rgba(105, 124, 200, 0.06), transparent 70%);
}
.light-rays::after {
  width: 500px;
  height: 350px;
  bottom: -80px;
  right: -50px;
  background: radial-gradient(ellipse, rgba(247, 203, 106, 0.04), transparent 70%);
}

/* === SIDE DECORATIVE BLOBS === */
.side-blobs {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.side-blobs::before,
.side-blobs::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
}
.side-blobs::before {
  width: 300px;
  height: 300px;
  top: 20%;
  left: -80px;
  background: rgba(105, 124, 200, 0.05);
}
.side-blobs::after {
  width: 250px;
  height: 250px;
  bottom: 15%;
  right: -60px;
  background: rgba(247, 203, 106, 0.04);
}
```

- [ ] **Шаг 2: Подключить в Layout.astro**

Открыть `src/layouts/Layout.astro`, найти строку `import '../styles/global.css';` и добавить после неё:

```astro
---
import '../styles/global.css';
import '../styles/animations.css';
import { SITE } from '../config/site';
```

- [ ] **Шаг 3: Проверить билд**

```bash
npm run build 2>&1
```

Ожидаемо: билд проходит без ошибок, в `dist/_astro/` появится CSS-файл с анимациями.

- [ ] **Шаг 4: Коммит**

```bash
git add src/styles/animations.css src/layouts/Layout.astro
git commit -m "feat: add CSS animations and transition classes"
```

---

## Задача 2: Scroll-reveal скрипт

**Файлы:**
- Create: `src/scripts/scroll-reveal.js`

- [ ] **Шаг 1: Создать scroll-reveal.js**

```javascript
// src/scripts/scroll-reveal.js
// IntersectionObserver для scroll-анимаций
// Подключается как script в Layout.astro (client-side)

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-stagger');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));
}

// Запуск после DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollReveal);
} else {
  initScrollReveal();
}
```

- [ ] **Шаг 2: Подключить скрипт в Layout.astro**

Открыть `src/layouts/Layout.astro`, найти закрывающий `</body>` и добавить перед ним:

```html
    <Footer />

    <script src="../scripts/scroll-reveal.js" defer></script>
  </body>
</html>
```

- [ ] **Шаг 3: Проверить билд**

```bash
npm run build 2>&1
```

Ожидаемо: билд проходит, JS-файл попадает в `dist/_astro/`.

- [ ] **Шаг 4: Коммит**

```bash
git add src/scripts/scroll-reveal.js src/layouts/Layout.astro
git commit -m "feat: add scroll-reveal IntersectionObserver"
```

---

## Задача 3: HeroDecor — декоративный фон hero-секции

**Файлы:**
- Create: `src/components/HeroDecor.astro`

- [ ] **Шаг 1: Создать компонент HeroDecor**

```astro
---
/**
 * Декоративные элементы для hero-секции:
 * - gradient-сетка
 * - noise-текстура
 * - световые лучи
 * - анимированные покерные фишки
 */
---

<div class="hero-decor absolute inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
  {/* Gradient grid pattern */}
  <div class="gradient-grid absolute inset-0"></div>

  {/* Noise texture */}
  <div class="noise-overlay absolute inset-0"></div>

  {/* Light rays */}
  <div class="light-rays"></div>

  {/* Floating poker chips */}
  <div class="absolute inset-0">
    {/* Gold chip — top left */}
    <svg
      class="chip-float absolute"
      style="top: 12%; left: 8%; width: 48px; height: 48px; opacity: 0.18; animation-delay: 0s;"
      viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="22" stroke="#d4a836" stroke-width="2" stroke-dasharray="4 3" />
      <circle cx="24" cy="24" r="16" stroke="#d4a836" stroke-width="1" opacity="0.5" />
      <text x="24" y="28" text-anchor="middle" fill="#d4a836" font-size="10" font-weight="600" font-family="Manrope, sans-serif">$1K</text>
    </svg>

    {/* Purple chip — right side */}
    <svg
      class="chip-float-alt absolute"
      style="top: 35%; right: 5%; width: 40px; height: 40px; opacity: 0.14; animation-delay: 2s;"
      viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="22" stroke="#6b46c1" stroke-width="2" stroke-dasharray="4 3" />
      <circle cx="24" cy="24" r="16" stroke="#6b46c1" stroke-width="1" opacity="0.5" />
      <text x="24" y="28" text-anchor="middle" fill="#6b46c1" font-size="10" font-weight="600" font-family="Manrope, sans-serif">$500</text>
    </svg>

    {/* Black chip — bottom left */}
    <svg
      class="chip-float absolute"
      style="bottom: 20%; left: 12%; width: 36px; height: 36px; opacity: 0.12; animation-delay: 4s;"
      viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="22" stroke="#4a5568" stroke-width="2" stroke-dasharray="4 3" />
      <circle cx="24" cy="24" r="16" stroke="#4a5568" stroke-width="1" opacity="0.5" />
      <text x="24" y="28" text-anchor="middle" fill="#718096" font-size="10" font-weight="600" font-family="Manrope, sans-serif">$100</text>
    </svg>

    {/* Gold chip — bottom right */}
    <svg
      class="chip-float-alt absolute"
      style="bottom: 15%; right: 10%; width: 44px; height: 44px; opacity: 0.16; animation-delay: 1s;"
      viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="22" stroke="#d4a836" stroke-width="2" stroke-dasharray="4 3" />
      <circle cx="24" cy="24" r="16" stroke="#d4a836" stroke-width="1" opacity="0.5" />
      <text x="24" y="28" text-anchor="middle" fill="#d4a836" font-size="10" font-weight="600" font-family="Manrope, sans-serif">$1K</text>
    </svg>

    {/* Purple chip — top center-right */}
    <svg
      class="chip-float absolute"
      style="top: 8%; right: 25%; width: 32px; height: 32px; opacity: 0.1; animation-delay: 3s;"
      viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="22" stroke="#6b46c1" stroke-width="2" stroke-dasharray="4 3" />
      <circle cx="24" cy="24" r="16" stroke="#6b46c1" stroke-width="1" opacity="0.5" />
    </svg>
  </div>
</div>
```

- [ ] **Шаг 2: Подключить HeroDecor в index.astro**

Открыть `src/pages/index.astro`, найти секцию Hero (строки ~51-52) и добавить компонент:

```astro
  {/* === HERO === */}
  <section class="relative">
    <HeroDecor />
    <div
      class="absolute inset-0 pointer-events-none -z-10"
      style="background: radial-gradient(ellipse 60% 50% at 30% 40%, rgba(105, 124, 200, 0.08), transparent 70%);"
    ></div>
```

Также добавить импорт в шапке файла (строки ~1-6):

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../layouts/Layout.astro';
import ChipStack from '../components/ChipStack.astro';
import ArticleCard from '../components/ArticleCard.astro';
import HeroDecor from '../components/HeroDecor.astro';
import { SITE } from '../config/site';
```

- [ ] **Шаг 3: Проверить билд**

```bash
npm run build 2>&1
```

Ожидаемо: билд проходит, hero-секция рендерит декоративные элементы.

- [ ] **Шаг 4: Коммит**

```bash
git add src/components/HeroDecor.astro src/pages/index.astro
git commit -m "feat: add hero decorative background with floating chips"
```

---

## Задача 4: Декоративные элементы секции «Вердикт» + SVG-иконки

**Файлы:**
- Modify: `src/pages/index.astro` (секция «Краткий вердикт»)

- [ ] **Шаг 1: Обновить секцию вердикта в index.astro**

Найти секцию `<article class="prose-mori max-w-[720px]">` и обернуть её в контейнер с декором + добавить иконки к абзацам:

Заменить секцию `<article class="prose-mori max-w-[720px]">` (строки ~118-156) на:

```astro
      <article class="prose-mori max-w-[720px] relative">
        {/* Side decorative blobs */}
        <div class="side-blobs"></div>
        <div class="noise-overlay absolute inset-0 pointer-events-none" style="z-index: 0;"></div>

        <div class="relative" style="z-index: 2;">
          <p class="eyebrow flex items-center gap-3 mb-5">
            <span class="inline-block w-6 h-px bg-gold-dim"></span>
            Краткий вердикт
          </p>
          <h2 class="display-title text-[clamp(32px,4vw,48px)] mb-8" style="margin-top: 0;">
            За полтора месяца тестов MoriWin <em>удивил</em> там, где не ждали
          </h2>

          <div class="space-y-6">
            <p class="lede flex gap-4 items-start">
              <svg class="w-6 h-6 flex-shrink-0 mt-1.5 text-gold-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              <span>MoriWin вышел на рынок в 2026 году как продукт команды YouTube-блогера
              Профессора Мориарти. Это означает три вещи: за казино стоит реальная
              медиа-аудитория в 4.5 миллиона человек, есть собственный токен $MORI,
              и есть привычка делать продукт «для своих» — а не для абстрактного игрока.</span>
            </p>

            <p class="flex gap-4 items-start">
              <svg class="w-6 h-6 flex-shrink-0 mt-0.5 text-gold-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
              <span>За время тестов мы сделали 14 депозитов разными способами (карта
              МИР, СБП, USDT-TRC20, BTC), вывели средства семь раз — самый быстрый
              кэш-аут занял 11 минут (USDT), самый медленный — 22 часа (карта, с
              ручной верификацией). Это <strong>выше среднего</strong> для рынка
              СНГ-казино в 2026 году.</span>
            </p>

            <p class="flex gap-4 items-start">
              <svg class="w-6 h-6 flex-shrink-0 mt-0.5 text-gold-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg>
              <span>Главная сильная сторона — авторские слоты MoriWin Originals (Mori
              Mines, Mori Wheel, Mori Jet, Mori Plinko, Mori Coin Flip). RTP
              заявлен 99%, и по нашим логам — это, кажется, не маркетинговая
              ложь: из 2400 ставок мы вышли в небольшой плюс. Главное — играть
              не «по системе», а с дисциплиной.</span>
            </p>

            <p class="flex gap-4 items-start">
              <svg class="w-6 h-6 flex-shrink-0 mt-0.5 text-gold-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
              <span>Слабые места: приложения в Google Play и App Store нет (только PWA),
              верификация обязательна перед первым выводом (фото паспорта + селфи),
              и не все провайдеры доступны в демо. Если последнее для вас критично —
              MoriWin может не подойти.</span>
            </p>
          </div>
        </div>
      </article>
```

- [ ] **Шаг 2: Добавить reveal-классы к секциям**

В том же `index.astro`, добавить `reveal` к секциям для scroll-анимации:

Найти секцию статей (строка с `<section class="max-w-[1240px] mx-auto px-6 sm:px-8 py-24">` перед карточками) и добавить `reveal`:

```astro
  {/* === LATEST ARTICLES === */}
  {recent.length > 0 && (
    <section class="max-w-[1240px] mx-auto px-6 sm:px-8 py-24 reveal">
```

Найти секцию сравнения и добавить `reveal`:

```astro
  {/* === COMPARISON === */}
  <section
    class="max-w-[1240px] mx-auto px-6 sm:px-8 py-24 reveal"
```

Найти секцию быстрых ссылок и добавить `reveal`:

```astro
  {/* === QUICK LINKS === */}
  <section class="max-w-[1240px] mx-auto px-6 sm:px-8 py-24 reveal">
```

Добавить `reveal-stagger` к сеткам карточек:

В секции статей найти `<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">` и добавить `reveal-stagger`:

```astro
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 reveal-stagger">
```

В секции быстрых ссылок найти `<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">` и добавить `reveal-stagger`:

```astro
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 reveal-stagger">
```

- [ ] **Шаг 3: Добавить card-hover к карточкам быстрых ссылок**

Найти шаблон карточки быстрых ссылок и добавить `card-hover`:

```astro
        <a href={item.href} class="group block p-6 border border-border bg-bg-card hover:border-gold-dim transition-all duration-200 hover:-translate-y-1 card-hover">
```

- [ ] **Шаг 4: Проверить билд**

```bash
npm run build 2>&1
```

- [ ] **Шаг 5: Коммит**

```bash
git add src/pages/index.astro
git commit -m "feat: add verdict section decor, SVG icons, scroll reveal classes"
```

---

## Задача 5: SVG-иконки в карточках статей

**Файлы:**
- Modify: `src/components/ArticleCard.astro`

- [ ] **Шаг 1: Обновить ArticleCard.astro**

Заменить содержимое `src/components/ArticleCard.astro` на:

```astro
---
/**
 * Карточка статьи — для списков и featured-секций на главной.
 * Включает SVG-иконку по тегу статьи.
 */
interface Props {
  title: string;
  description: string;
  href: string;
  pubDate: Date;
  readingTime?: number;
  tags?: string[];
}

const { title, description, href, pubDate, readingTime, tags } = Astro.props;

const dateStr = pubDate.toLocaleDateString('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/** Определяет SVG-иконку по тегу статьи */
function getIconForTags(tags: string[] = []): string {
  const joined = tags.join(' ').toLowerCase();
  if (joined.includes('слот') || joined.includes('казино') || joined.includes('moriwin'))
    return '<circle cx="12" cy="12" r="10"/><path d="M8 8v8M12 8v8M16 8v8"/>';
  if (joined.includes('бонус') || joined.includes('промокод') || joined.includes('400'))
    return '<path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/>';
  if (joined.includes('зеркал'))
    return '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>';
  if (joined.includes('крипт') || joined.includes('токен') || joined.includes('mori coin'))
    return '<circle cx="12" cy="12" r="10"/><path d="M9 8h4a2 2 0 110 4h-4v4h5M9 12h4a2 2 0 100-4H9"/>';
  if (joined.includes('vpn'))
    return '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>';
  if (joined.includes('регистр'))
    return '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>';
  if (joined.includes('вывод') || joined.includes('депозит'))
    return '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>';
  // default — статья
  return '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>';
}
---

<a
  href={href}
  class="block group p-6 border border-border bg-bg-card hover:border-gold-dim transition-all duration-200 hover:-translate-y-1 card-hover"
>
  {/* SVG Icon */}
  <div class="mb-4">
    <svg
      class="w-8 h-8 text-gold"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      set:html={getIconForTags(tags)}
    />
  </div>

  <p class="eyebrow flex items-center gap-3 mb-3">
    <span class="inline-block w-5 h-px bg-gold-dim"></span>
    {dateStr}
    {readingTime && <span class="text-text-dim">· {readingTime} мин</span>}
  </p>

  <h3
    class="text-lg font-bold text-text mb-2 group-hover:text-gold transition-colors"
    style="font-family: var(--font-display);"
  >
    {title}
  </h3>

  <p class="text-sm text-text-muted leading-relaxed mb-4">
    {description}
  </p>

  {
    tags && tags.length > 0 && (
      <div class="flex flex-wrap gap-2">
        {tags.slice(0, 3).map((tag) => (
          <span class="text-[11px] px-2.5 py-0.5 border border-border text-text-dim uppercase tracking-wider">
            {tag}
          </span>
        ))}
      </div>
    )
  }
</a>
```

- [ ] **Шаг 2: Проверить билд**

```bash
npm run build 2>&1
```

- [ ] **Шаг 3: Коммит**

```bash
git add src/components/ArticleCard.astro
git commit -m "feat: add SVG icons to article cards by topic"
```

---

## Задача 6: Hover-эффекты на карточках сравнения

**Файлы:**
- Modify: `src/pages/index.astro` (секция сравнения)

- [ ] **Шаг 1: Добавить card-hover к карточкам сравнения**

Найти три карточки сравнения в секции Comparison и добавить `card-hover` к каждой:

Карточка 1xSlots:
```astro
      <div class="relative p-8 border border-border bg-bg-card transition-all hover:-translate-y-1 hover:border-gold-dim card-hover">
```

Карточка MoriWin:
```astro
      <div
        class="relative p-8 border border-gold transition-all hover:-translate-y-1 card-hover"
```

Карточка BC.Game:
```astro
      <div class="relative p-8 border border-border bg-bg-card transition-all hover:-translate-y-1 hover:border-gold-dim card-hover">
```

- [ ] **Шаг 2: Добавить btn-micro к кнопкам**

Найти кнопки в карточках сравнения и добавить `btn-micro`:

```astro
        <a href="https://1xslots.com/" class="btn-outline w-full btn-micro" rel="nofollow sponsored noopener" target="_blank">Открыть →</a>
```

```astro
        >Играть с бонусом →</a>
```
(для MoriWin — `btn-gold` уже имеет hover, просто добавить `btn-micro`)

```astro
        <a href="https://bc.game/" class="btn-outline w-full btn-micro" rel="nofollow sponsored noopener" target="_blank">Открыть →</a>
```

- [ ] **Шаг 3: Проверить билд**

```bash
npm run build 2>&1
```

- [ ] **Шаг 4: Коммит**

```bash
git add src/pages/index.astro
git commit -m "feat: add hover effects to comparison cards and buttons"
```

---

## Задача 7: OG-картинка и логотип

**Файлы:**
- Create: `public/og-default.jpg`
- Create: `public/logo.svg`

- [ ] **Шаг 1: Создать placeholder OG-картинку**

Создать `public/og-default.jpg` — простой SVG-to-JPG или placeholder. Поскольку у нас нет Canvas, создадим SVG-заглушку и конвертируем:

Создать `public/og-default.svg`:

```svg
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0a0e22"/>
  <rect x="0" y="0" width="1200" height="4" fill="#d4a836"/>
  <text x="600" y="280" text-anchor="middle" fill="#ffffff" font-size="48" font-weight="700" font-family="serif">MoriWin Review</text>
  <text x="600" y="340" text-anchor="middle" fill="#d4a836" font-size="24" font-family="sans-serif">Обзор казино 2026</text>
  <text x="600" y="400" text-anchor="middle" fill="#718096" font-size="18" font-family="sans-serif">Бонусы · Зеркала · Игры · Отзывы</text>
</svg>
```

Затем в `Layout.astro` изменить default ogImage на SVG:

Найти строку `ogImage = '/og-default.jpg'` и заменить на:

```typescript
ogImage = '/og-default.svg',
```

- [ ] **Шаг 2: Создать текстовый логотип SVG**

Создать `public/logo.svg`:

```svg
<svg width="200" height="32" xmlns="http://www.w3.org/2000/svg">
  <text x="0" y="26" fill="#e2e8f0" font-size="24" font-weight="700" font-family="PT Serif, serif">
    Mori<tspan fill="#d4a836" font-style="italic" font-weight="400">Win</tspan>
  </text>
  <text x="110" y="26" fill="#4a5568" font-size="10" font-family="Manrope, sans-serif" letter-spacing="0.15em">REVIEW</text>
</svg>
```

- [ ] **Шаг 3: Проверить билд**

```bash
npm run build 2>&1
```

- [ ] **Шаг 4: Коммит**

```bash
git add public/og-default.svg public/logo.svg src/layouts/Layout.astro
git commit -m "feat: add OG placeholder image and text logo SVG"
```

---

## Задача 8: Финальная проверка и деплой

- [ ] **Шаг 1: Полный билд**

```bash
npm run build 2>&1
```

Ожидаемо: 13 страниц, без ошибок.

- [ ] **Шаг 2: Проверить что все компоненты подключены**

Убедиться что в `dist/index.html` есть:
- `chip-float` классы (анимированные фишки)
- `reveal` классы (scroll-анимации)
- SVG-иконки в карточках статей
- `card-hover` на карточках
- `noise-overlay` и `gradient-grid` в hero

- [ ] **Шаг 3: Запушить**

```bash
git add -A
git commit -m "feat: homepage visual enhancements — decor, animations, icons"
git push origin main
```

---

## Итого

| Задача | Описание | Файлы |
|--------|----------|-------|
| 1 | CSS-анимации | `animations.css`, `Layout.astro` |
| 2 | Scroll-reveal | `scroll-reveal.js`, `Layout.astro` |
| 3 | HeroDecor | `HeroDecor.astro`, `index.astro` |
| 4 | Вердикт декор + иконки | `index.astro` |
| 5 | SVG-иконки статей | `ArticleCard.astro` |
| 6 | Hover-эффекты | `index.astro` |
| 7 | OG + логотип | `public/`, `Layout.astro` |
| 8 | Финальный билд + деплой | — |
