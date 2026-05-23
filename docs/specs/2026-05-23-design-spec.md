# MoriWin Review — Design Spec

**Date:** 2026-05-23
**Status:** Draft (awaiting visual mockup approval)

## Концепция в одной фразе

**"MoriWin Review — это что бы получилось, если бы Financial Times открыл подразделение про криптоказино"**

Серьёзный editorial-обзорник с премиум-эстетикой, опирающийся на реальный design-system бренда MoriWin Casino. Не дубль казино, не "лендинг-однодневка", а доверенный рецензент.

## Источник брендовых решений

Вытащено через Playwright + DevTools со страницы `play.moricasino.com`:

- Основной фон: `#0c112b` (navy)
- Карточки: `#161c40`, `#222d5b`
- Главный accent: `#697cc8` (лавандово-фиолетовый)
- Вторичный accent: `#f7cb6a` (тёплое золото)
- Семантика: `#00e15d` good, `#eb3b3e` bad, `#e1a900` attention
- VIP-ранги: `#f7cb6a` vip, `#f76a6a` elite, `#6af7d1` pro
- Шрифт бренда: TT Firs Neue (платный, мы не используем)

## Палитра (наша адаптация)

```css
/* База — слегка темнее бренда, для editorial-вайба */
--bg:            #0a0e22
--bg-card:       #11163a
--bg-card-hover: #1a2152
--border:        #2a3170
--border-strong: #697cc8     /* их accent-1 как фирменная связь */

/* Текст */
--text:          #e8eaf5
--text-muted:    #a5ade9     /* их text-additional */
--text-dim:      #5f689a

/* Акценты */
--gold:          #f7cb6a     /* фирменное золото */
--gold-bright:   #ffd97a
--gold-dim:      #8a7340

/* Семантика (синхронизирована с брендом) */
--success:       #00e15d
--danger:        #eb3b3e
--warning:       #e1a900

/* Tier-цвета для рейтингов */
--tier-vip:      #f7cb6a
--tier-elite:    #f76a6a
--tier-pro:      #6af7d1
```

## Типографика

```
Display: Fraunces 400/600/900 + italic   (Google Fonts) — modern serif с характером
Body:    Manrope 400/500/700             (Google Fonts) — geometric sans
Mono:    JetBrains Mono 400/500          (Google Fonts) — данные/промокоды
```

**Почему не TT Firs Neue (как у бренда):** платный, недоступен на Google Fonts. Нам важно отличаться шрифтом — мы редакция, они продукт.

**Почему Fraunces, а не Playfair Display:** Fraunces более современный и менее "слотовый". Playfair даёт викторианский вайб, Fraunces — editorial-magazine.

## Визуальный язык

### Покерные фишки в рейтингах (ключевой "крючок")

Вместо звёздочек / прогресс-баров — **стек реальных казино-фишек** по номиналу:

| Номинал | Цвет | Значение |
|---|---|---|
| $5 | красный | базовая единица рейтинга |
| $25 | зелёный | +0.5 балла |
| $100 | чёрный | весомый |
| $500 | фиолетовый | премиум |
| $1000 | золотой | топ |

Рейтинг 4.5/5 → стек `🟡🟣🟣⚫🔴` с подписью `VIP-TIER · 4.5/5`. CSS-only через `:after`/`box-shadow` для глубины фишки.

### Editorial-разделители

- Двойные тонкие линии между секциями (золото на navy): `border-top: 1px solid gold; padding-top: 1px; border-bottom: 1px solid gold`
- Drop-cap (Fraunces italic, золото) в первой букве больших статей
- Eyebrow-text над заголовками: `MORI ECOSYSTEM · 5 МИН ЧТЕНИЯ` — Manrope 500 / 11px / tracking-widest / золото-dim

### Минимализм декора

❌ НЕТ:
- Фоновых "blob-градиентов"
- Neon-glow вокруг кнопок
- Parallax / 3D-карт на mousemove
- Каруселей на главной
- Покерных мастей-иконок (слишком "лас-вегас")

✅ ДА:
- Тончайший radial vignette из центра hero
- Subtle box-shadow на карточках (длинные мягкие)
- Hover: золотая линия проползает под текстом ссылок (slide-in slow)

## Анимация (CSS-only, на критичные моменты)

1. **Hero entrance:** заголовок появляется word-by-word с задержкой 80ms (staggered)
2. **Стек фишек:** при попадании в viewport — фишки "падают" друг на друга, ~600ms total
3. **CTA hover:** золотая полоска проползает слева-направо за 200ms
4. **Якорные переходы:** `scroll-margin-top: 80px` для красивого отступа

Никаких parallax, никакого scroll-jacking.

## Композиция

- Hero **не центрирован** — заголовок прижат к левому, рейтинг-стек справа внизу с большим воздухом
- Контент в **2 колонки** на десктопе (main + sticky sidebar)
- Sticky sidebar с CTA "Играть с бонусом 400% + 100 FS"
- `margin-top: 96px+` перед каждым `<h2>` — статья дышит

## Производительность

- Self-hosted шрифты (Fraunces+Manrope+JetBrains Mono) → `public/fonts/`
- Subset: `cyrillic+latin`
- Preload только Display-шрифта для LCP
- Все цвета через CSS-переменные → 0 дубликатов в bundle
- Cap: total CSS ≤ 25KB gzipped

## Технологии

- Astro 6 (статический генератор)
- TailwindCSS 4 (через `@theme` для переменных)
- MDX для статей (компоненты внутри markdown)
- Schema.org JSON-LD (Organization, Review, FAQ, BreadcrumbList)
- Cloudflare Pages для деплоя
- Google Fonts (CDN) — потом мигрируем в self-hosted

## Что НЕ делаем

| Запрет | Причина |
|---|---|
| Звёздочки в рейтингах | Используем фишки |
| Карусели на главной | Медленно, плохо для SEO |
| Бургер-меню на десктопе | Только на mobile |
| Inter/Roboto/Arial шрифты | "AI slop" |
| Purple→pink градиенты | Cliché |
| Lucide/Heroicons "из коробки" | Подбираем индивидуально |
| Эмодзи в UI (кроме фишек) | Не editorial |

## Process

1. ✅ Сбор брендовых решений с `play.moricasino.com` через Playwright
2. ⏳ HTML mockup (standalone, без Astro) → показать в браузере
3. ⏳ User approval на mockup
4. ⏳ Перенос концепции в `global.css` + Layout.astro
5. ⏳ Сборка реальных компонентов (Header/Footer/HomePage)
6. ⏳ E2E verification через Playwright

## References

- Source brand: https://play.moricasino.com
- Brand assets: https://cdn.mori.casino/images/logo.svg
- Partner program: https://mori.partners
