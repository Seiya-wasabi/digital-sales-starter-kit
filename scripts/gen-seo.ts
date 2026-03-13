#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import { ConfigSchema } from '../src/lib/config';

const ROOT = path.resolve(__dirname, '..');
const PRODUCTS_PATH = path.join(ROOT, 'src', 'generated', 'products.json');
const OUT_DIR = path.join(ROOT, 'out', 'seo');

function main() {
  if (!fs.existsSync(PRODUCTS_PATH)) {
    console.error('products.json not found. Run pnpm gen first.');
    process.exit(1);
  }

  const config = ConfigSchema.parse(JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf-8')));

  for (const product of config.products) {
    fs.mkdirSync(OUT_DIR, { recursive: true });

    const keywordClusters = [
      {
        cluster: 'メイン（認知）',
        keywords: product.tags_ja.slice(0, 5),
      },
      {
        cluster: '比較・検討',
        keywords: [
          `${product.tags_ja[0] ?? 'デジタル販売'} 比較`,
          `${product.tags_ja[0] ?? 'デジタル販売'} 選び方`,
          `BOOTH vs Gumroad`,
          `note vs BOOTH デジタルコンテンツ`,
          `Stripe 個人販売 始め方`,
        ],
      },
      {
        cluster: '英語圏向け',
        keywords: product.tags_en.slice(0, 5),
      },
    ];

    const md = `# SEO計画: ${product.title}

生成日: ${new Date().toISOString().slice(0, 10)}

## キーワードクラスター

${keywordClusters.map(c => `
### ${c.cluster}

${c.keywords.map(k => `- ${k}`).join('\n')}
`).join('')}

## 記事構成案

### 記事1: 導入記事（認知獲得）

**タイトル案**: 「${product.tags_ja[0] ?? 'デジタル販売'}を始める前に知っておきたい5つのこと」

**構成**:
1. はじめに（現状の課題）
2. 主要販路の比較（BOOTH/note/Gumroad/BASE/Stripe）
3. 選び方のポイント（手数料・向き不向き）
4. 実際の出品手順
5. まとめ・CTA

**想定読者**: デジタルコンテンツ販売を検討している個人クリエイター

---

### 記事2: 比較記事（検討層）

**タイトル案**: 「BOOTH・note・Gumroad・BASE・Stripe 手数料と特徴を徹底比較」

**構成**:
1. 各プラットフォームの概要
2. 手数料一覧表
3. 向き・不向き
4. ケース別推奨
5. まとめ・CTA

---

### 記事3: ハウツー記事（実行層）

**タイトル案**: 「${product.title}の使い方：30分でLP・計測・出品テンプレを揃える手順」

**構成**:
1. 前提（必要なもの）
2. インストール手順
3. products.yaml の設定
4. Cloudflare Pagesへのデプロイ
5. 出品原稿の生成
6. SNS投稿開始

---

## メタデータ案

| ページ | title | description |
|--------|-------|-------------|
| / | ${product.title} \\| デジタル販売LP | ${product.subtitle ?? product.description.slice(0, 80)} |
| /p/${product.slug} | ${product.title} | ${product.description.slice(0, 100)} |
| /faq | FAQ \\| ${product.title} | よくある質問をまとめています |

---

## 内部リンク戦略

- / → /p/${product.slug}（商品詳細）
- /p/${product.slug} → /faq（不安解消）
- /faq → /contact（問い合わせ）
- 全ページ → /go?product=${product.slug}（購入導線）
`;

    const outPath = path.join(OUT_DIR, `${product.slug}.md`);
    fs.writeFileSync(outPath, md, 'utf-8');
    console.log(`Written: ${path.relative(ROOT, outPath)}`);
  }

  console.log('\nSEO plans generated in out/seo/');
}

main();
