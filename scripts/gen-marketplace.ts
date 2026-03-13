#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import { ConfigSchema } from '../src/lib/config';

const ROOT = path.resolve(__dirname, '..');
const PRODUCTS_PATH = path.join(ROOT, 'src', 'generated', 'products.json');
const TEMPLATES_DIR = path.join(ROOT, 'content', 'templates', 'marketplace');
const OUT_DIR = path.join(ROOT, 'out', 'marketplace');

const CHANNELS = ['booth', 'note', 'gumroad', 'base', 'stripe'] as const;

function loadTemplate(channel: string): string {
  const filePath = path.join(TEMPLATES_DIR, `${channel}.md`);
  if (!fs.existsSync(filePath)) {
    return `# {{TITLE}}\n\n{{DESCRIPTION}}\n\n## FAQ\n\n{{FAQ}}\n\n## タグ\n\n{{TAGS_JA}}\n`;
  }
  return fs.readFileSync(filePath, 'utf-8');
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

function main() {
  if (!fs.existsSync(PRODUCTS_PATH)) {
    console.error('products.json not found. Run pnpm gen first.');
    process.exit(1);
  }

  const raw = fs.readFileSync(PRODUCTS_PATH, 'utf-8');
  const config = ConfigSchema.parse(JSON.parse(raw));

  for (const product of config.products) {
    const faqMd = product.faq
      .map((item) => `**Q: ${item.q}**\nA: ${item.a}`)
      .join('\n\n');

    for (const channel of CHANNELS) {
      const template = loadTemplate(channel);
      const vars: Record<string, string> = {
        TITLE: product.title,
        SUBTITLE: product.subtitle ?? '',
        DESCRIPTION: product.description,
        PRICE: product.price_display,
        FAQ: faqMd,
        TAGS_JA: product.tags_ja.join(' / '),
        TAGS_EN: product.tags_en.join(', '),
        SLUG: product.slug,
        CHANNEL: channel.toUpperCase(),
        UPDATED: product.updated_at ?? new Date().toISOString().slice(0, 10),
      };

      const content = interpolate(template, vars);
      const outPath = path.join(OUT_DIR, channel, `${product.slug}.md`);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, content, 'utf-8');
      console.log(`Written: ${path.relative(ROOT, outPath)}`);
    }
  }

  console.log('\nMarketplace drafts generated in out/marketplace/');
}

main();
