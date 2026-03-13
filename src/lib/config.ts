import { z } from 'zod';

const ChannelsSchema = z.object({
  booth_url: z.string().url().optional().or(z.literal('')),
  note_url: z.string().url().optional().or(z.literal('')),
  gumroad_url: z.string().url().optional().or(z.literal('')),
  base_url: z.string().url().optional().or(z.literal('')),
  stripe_url: z.string().url().optional().or(z.literal('')),
});

const FaqItemSchema = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});

export const ProductSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().min(1),
  price_display: z.string().min(1),
  price_jpy: z.number().int().positive(),
  currency: z.string().default('JPY'),
  channels: ChannelsSchema,
  faq: z.array(FaqItemSchema).default([]),
  tags_ja: z.array(z.string()).default([]),
  tags_en: z.array(z.string()).default([]),
  og_image: z.string().optional(),
  updated_at: z.string().optional(),
});

export const ConfigSchema = z.object({
  products: z.array(ProductSchema).min(1),
});

export type Product = z.infer<typeof ProductSchema>;
export type Channels = z.infer<typeof ChannelsSchema>;
export type Config = z.infer<typeof ConfigSchema>;

/** 有効なチャネルURLのみを返す */
export function getActiveChannels(channels: Channels): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(channels)) {
    if (val && val.length > 0) {
      result[key.replace('_url', '')] = val;
    }
  }
  return result;
}

/** smart routing: 国コードに応じた最適チャネルとURLを返す */
export function smartRoute(
  channels: Channels,
  country: string | undefined,
  explicitChannel?: string
): { channel: string; url: string } | null {
  const active = getActiveChannels(channels);
  if (Object.keys(active).length === 0) return null;

  if (explicitChannel && active[explicitChannel]) {
    return { channel: explicitChannel, url: active[explicitChannel] ?? '' };
  }

  const isJP = !country || country === 'JP';

  if (isJP) {
    for (const ch of ['booth', 'note', 'base', 'gumroad', 'stripe']) {
      if (active[ch]) return { channel: ch, url: active[ch] ?? '' };
    }
  } else {
    for (const ch of ['gumroad', 'stripe', 'booth', 'note', 'base']) {
      if (active[ch]) return { channel: ch, url: active[ch] ?? '' };
    }
  }
  return null;
}

/** 高粗利チャネル（Stripe）があれば返す */
export function getHighMarginChannel(
  channels: Channels
): { channel: string; url: string } | null {
  const active = getActiveChannels(channels);
  if (active['stripe']) return { channel: 'stripe', url: active['stripe'] ?? '' };
  return null;
}
