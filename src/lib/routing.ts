import type { Channels } from './config';
import { getActiveChannels, smartRoute, getHighMarginChannel } from './config';

export interface RouteOptions {
  productSlug: string;
  channels: Channels;
  country?: string;
  ref?: string;
  channel?: string;
}

export function buildGoUrl(opts: RouteOptions): string {
  const params = new URLSearchParams({ product: opts.productSlug });
  if (opts.channel) params.set('channel', opts.channel);
  if (opts.ref) params.set('ref', opts.ref);
  return `/go?${params.toString()}`;
}

export function buildPrimaryCtaUrl(opts: RouteOptions): string {
  return buildGoUrl(opts);
}

export function buildStripeCtaUrl(opts: RouteOptions): string | null {
  const active = getActiveChannels(opts.channels);
  if (!active['stripe']) return null;
  return buildGoUrl({ ...opts, channel: 'stripe' });
}

export { smartRoute, getHighMarginChannel, getActiveChannels };
