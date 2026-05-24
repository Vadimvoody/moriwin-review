/**
 * Глобальный конфиг сайта. Единая точка правды.
 * Меняешь здесь — меняется везде.
 */

export const SITE = {
  name: 'MoriWin Review',
  shortName: 'MoriWin Review',
  url: 'https://moriwin-review.ru',
  domain: 'moriwin-review.ru',

  // i18n
  locale: 'ru-RU',
  language: 'ru',
  ogLocale: 'ru_RU',

  // SEO defaults
  defaultTitle:
    'MoriWin Review — обзор казино Mori Win, бонусы и промокоды 2026',
  defaultDescription:
    'Независимый обзор онлайн-казино MoriWin (Мориарти): актуальные бонусы, рабочее зеркало, промокоды, отзывы игроков, обзоры авторских слотов MoriWin Originals.',
  defaultKeywords: [
    'moriwin',
    'mori win',
    'мориарти казино',
    'moriwin казино',
    'moriwin обзор',
    'moriwin бонус',
    'moriwin промокод',
    'moriwin зеркало',
    'mori win регистрация',
    'mori win отзывы',
    '$mori токен',
    'mori vpn',
  ],

  // Бренд MoriWin Casino (источник партнёрки)
  brand: {
    casinoName: 'MoriWin Casino',
    casinoUrl: 'https://play.moricasino.com',
    youtube: 'https://www.youtube.com/@moriartymega',
    telegramChannel: 'https://t.me/professor_youtube_reborn',
    license: 'Curaçao 8048/JAZ',
    launchYear: 2026,
  },

  // Партнёрка — заполним после ответа менеджера
  affiliate: {
    refUrl: '', // https://moricasino.com/?ref=XXX
    promoCode: 'MORIBONUS', // подменим на свой когда выдадут
  },

  // Связь
  contacts: {
    email: 'editor@moriwin-review.ru',
    telegram: 'https://t.me/moriwin_review',
  },

  // Org schema
  organization: {
    name: 'MoriWin Review',
    legalName: 'MoriWin Review',
    foundingDate: '2026',
  },
} as const;

export type SiteConfig = typeof SITE;

/**
 * Навигация — главное меню (header) + footer.
 */
export const MAIN_NAV: Array<{ label: string; href: string }> = [
  { label: 'Обзор казино', href: '/casinos/moriwin/' },
  { label: 'Бонусы', href: '/bonus/' },
  { label: 'Статьи', href: '/articles/' },
  { label: 'Зеркало', href: '/articles/moriwin-mirror/' },
];

export const FOOTER_NAV = {
  reviews: {
    title: 'Обзоры',
    links: [
      { label: 'MoriWin Casino', href: '/casinos/moriwin/' },
      { label: 'Обзоры казино', href: '/casinos/' },
      { label: 'Бонусы и промокоды', href: '/bonus/' },
    ],
  },
  guides: {
    title: 'Гайды',
    links: [
      { label: 'Бонус 400% + 100 FS', href: '/articles/bonus-moriwin-400/' },
      { label: 'Регистрация', href: '/articles/moriwin-registration/' },
      { label: 'Вывод средств', href: '/articles/moriwin-withdrawal/' },
      { label: 'Зеркало MoriWin', href: '/articles/moriwin-mirror/' },
    ],
  },
  ecosystem: {
    title: 'Экосистема',
    links: [
      { label: 'Токен $MORI', href: '/articles/mori-coin-token/' },
      { label: 'MoriVPN', href: '/articles/mori-vpn-review/' },
      { label: 'Криптоказино гайд', href: '/articles/crypto-casino-guide/' },
    ],
  },
  contacts: {
    title: 'Контакты',
    links: [
      { label: 'editor@', href: 'mailto:editor@moriwin-review.ru' },
      { label: 'Telegram', href: 'https://t.me/moriwin_review' },
    ],
  },
} as const;
