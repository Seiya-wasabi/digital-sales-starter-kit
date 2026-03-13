#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import { ConfigSchema } from '../src/lib/config';

const ROOT = path.resolve(__dirname, '..');
const PRODUCTS_PATH = path.join(ROOT, 'src', 'generated', 'products.json');
const TEMPLATES_DIR = path.join(ROOT, 'content', 'templates');
const OUT_DIR = path.join(ROOT, 'out', 'social');

function loadTemplate(file: string): string {
  const fp = path.join(TEMPLATES_DIR, file);
  return fs.existsSync(fp) ? fs.readFileSync(fp, 'utf-8') : '';
}

function main() {
  if (!fs.existsSync(PRODUCTS_PATH)) {
    console.error('products.json not found. Run pnpm gen first.');
    process.exit(1);
  }

  const config = ConfigSchema.parse(JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf-8')));
  const xTemplate = loadTemplate('social-x.md');
  const noteTemplate = loadTemplate('social-note.md');

  for (const product of config.products) {
    const dir = path.join(OUT_DIR, product.slug);
    fs.mkdirSync(dir, { recursive: true });

    const vars: Record<string, string> = {
      TITLE: product.title,
      SUBTITLE: product.subtitle ?? '',
      PRICE: product.price_display,
      TAGS_JA: product.tags_ja.slice(0, 5).map(t => `#${t.replace(/\s/g, '')}`).join(' '),
      SLUG: product.slug,
    };

    const replace = (tpl: string) =>
      tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`);

    fs.writeFileSync(path.join(dir, 'x.md'), replace(xTemplate), 'utf-8');
    fs.writeFileSync(path.join(dir, 'note.md'), replace(noteTemplate), 'utf-8');
    console.log(`Written: out/social/${product.slug}/`);
  }

  console.log('\nSocial post templates generated in out/social/');
}

main();
