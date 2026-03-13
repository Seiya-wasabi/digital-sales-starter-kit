#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { ConfigSchema } from '../src/lib/config';

const ROOT = path.resolve(__dirname, '..');
const YAML_PATH = path.join(ROOT, 'config', 'products.yaml');
const OUT_PATH = path.join(ROOT, 'src', 'generated', 'products.json');

function main() {
  console.log('Loading config/products.yaml...');
  const raw = fs.readFileSync(YAML_PATH, 'utf-8');
  const data = yaml.load(raw);

  console.log('Validating with Zod...');
  const result = ConfigSchema.safeParse(data);
  if (!result.success) {
    console.error('Validation failed:');
    console.error(result.error.format());
    process.exit(1);
  }

  console.log(`${result.data.products.length} product(s) validated.`);

  const outDir = path.dirname(OUT_PATH);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(OUT_PATH, JSON.stringify(result.data, null, 2) + '\n', 'utf-8');
  console.log(`Written: ${path.relative(ROOT, OUT_PATH)}`);

  // Summary
  for (const p of result.data.products) {
    const activeChannels = Object.entries(p.channels)
      .filter(([, v]) => v && v.length > 0)
      .map(([k]) => k.replace('_url', ''));
    console.log(`   - ${p.slug}: ${activeChannels.length > 0 ? activeChannels.join(', ') : '(no channels yet)'}`);
  }
}

main();
