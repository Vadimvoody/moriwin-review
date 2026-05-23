# MoriWin Review

Независимое онлайн-издание о казино MoriWin и экосистеме Профессора Мориарти.

🌐 **Production:** [moriwin-review.ru](https://moriwin-review.ru)

## Stack

- **Astro 6** — статический генератор
- **Tailwind CSS 4** — стили через `@theme`
- **MDX** — статьи с встроенными компонентами
- **PT Serif + Manrope** — типографика (Google Fonts)
- **Cloudflare Pages** — деплой (бесплатно, edge-CDN, авто-SSL)

## Development

```bash
npm install        # установить зависимости
npm run dev        # dev-сервер на http://localhost:4321
npm run build      # production-билд в ./dist
npm run preview    # превью production-билда
```

## Структура

```
src/
├── components/        # Header, Footer, ChipStack
├── config/site.ts     # Глобальный конфиг — название, URL, навигация
├── content/           # MDX-статьи и коллекции (в работе)
├── layouts/Layout.astro
├── pages/             # Маршруты сайта
└── styles/global.css  # Дизайн-система через @theme
docs/specs/            # Дизайн-спека и архитектурные решения
```

## Деплой

Cloudflare Pages автоматически собирает сайт при push в `main`:

- Build command: `npm run build`
- Build output: `dist`
- Node version: 22

## License

Private — все права защищены © 2026 MoriWin Review
