import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Тип покерной фишки — используется в рейтинговых стеках.
 * Должен совпадать с ChipColor в src/components/ChipStack.astro
 */
const chipColorSchema = z.enum(['red', 'green', 'black', 'purple', 'gold']);

/**
 * Tier-уровень казино/слота. Источник цвета берётся из global.css.
 */
const tierSchema = z.enum(['starter', 'pro', 'elite', 'vip', 'expert']);

/**
 * Коллекция articles — основной блог-контент.
 * Используется для гайдов, новостей, обзоров игр, около-тематики.
 */
const articles = defineCollection({
  loader: glob({
    base: './src/content/articles',
    pattern: '**/[^_]*.{md,mdx}',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Редакция'),
    tags: z.array(z.string()).default([]),
    readingTime: z.number().int().positive().optional(), // в минутах
    /** Eyebrow-надпись над H1, типа "MORI ECOSYSTEM · ОБЗОР" */
    eyebrow: z.string().optional(),
    /** Для статьи-обзора игры/слота — превью-картинка. */
    image: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    /** Канонический URL если статья опубликована где-то ещё. */
    canonical: z.string().url().optional(),
    /** Не индексировать (черновик / устаревшее). */
    noindex: z.boolean().default(false),
    /** Featured = выводить на главной. */
    featured: z.boolean().default(false),
  }),
});

/**
 * Коллекция casinos — обзоры казино.
 * Структурированные данные: рейтинг, бонус, лицензия, валюты, методы оплаты.
 */
const casinos = defineCollection({
  loader: glob({
    base: './src/content/casinos',
    pattern: '**/[^_]*.{md,mdx}',
  }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Итоговый рейтинг 1.0-5.0 */
    rating: z.number().min(1).max(5),
    tier: tierSchema,
    /** Стек покерных фишек, отражающий рейтинг (передаётся в ChipStack). */
    chips: z.array(chipColorSchema).min(1).max(8),
    /** Реферальная ссылка партнёрки. */
    referralUrl: z.string().url(),
    promoCode: z.string().optional(),
    welcomeBonus: z.string(),
    /** Краткие факты для sidebar. */
    facts: z.object({
      license: z.string(),
      launchYear: z.number().int(),
      minDeposit: z.string(),
      minWithdrawal: z.string(),
      currencies: z.array(z.string()),
      gamesCount: z.string(),
      providersCount: z.string(),
      languages: z.array(z.string()),
      withdrawalSpeed: z.string(),
      kycRequired: z.boolean(),
    }),
    /** Pros для блока "за". */
    pros: z.array(z.string()).min(1),
    /** Cons для блока "против". */
    cons: z.array(z.string()).min(1),
    /** Рейтинговые подкатегории (для блока breakdown). */
    breakdown: z.object({
      withdrawalSpeed: z.string(),
      bonusSize: z.string(),
      rtp: z.string(),
      support: z.string(),
      kyc: z.string(),
    }),
    noindex: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

/**
 * Коллекция bonuses — отдельные бонусы и промокоды.
 * Для лендингов под транзакционные запросы "moriwin промокод", "moriwin бонус".
 */
const bonuses = defineCollection({
  loader: glob({
    base: './src/content/bonuses',
    pattern: '**/[^_]*.{md,mdx}',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    casino: z.string(), // slug из collection casinos
    bonusType: z.enum([
      'welcome',
      'no-deposit',
      'reload',
      'cashback',
      'free-spins',
      'tournament',
      'promo-code',
    ]),
    /** Размер бонуса для отображения (типа "400% + 100 FS"). */
    amount: z.string(),
    promoCode: z.string().optional(),
    /** Реферальная ссылка с применённым промокодом. */
    referralUrl: z.string().url(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Дата окончания — для urgency-блока. */
    expiresAt: z.coerce.date().optional(),
    /** Условия отыгрыша (wagering). */
    wagering: z.string().optional(),
    /** Минимальный депозит для активации. */
    minDeposit: z.string().optional(),
    /** Чтобы привязать к конкретному уровню сильности. */
    tier: tierSchema.default('vip'),
    noindex: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  articles,
  casinos,
  bonuses,
};
