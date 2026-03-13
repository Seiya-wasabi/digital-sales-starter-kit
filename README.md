# デジタル販売スターターキット（日本語版）

> 月1時間運用で、販売導線と計測まで一気に作る

BOOTH・note・Gumroad・BASE・Stripeへの出品から、LP作成・クリック計測・SNS投稿テンプレまでをワンセットにしたデジタルコンテンツ販売の実行キットです。設定ファイル（YAML）を編集するだけで、すぐに販売を開始できます。

---

## このキットでできること

| 機能 | 説明 |
|------|------|
| SEO対応LP | JSON-LD・OGP・canonical を自動生成。Astro静的配信で高速表示 |
| 5販路への購入導線 | BOOTH / note / Gumroad / BASE / Stripe を1箇所で管理 |
| スマートルーティング | 国別に最適な販路へ自動リダイレクト。オープンリダイレクト防止済み |
| クリック計測（PIIなし） | チャネル別・商品別・日別クリック数をKVに集計。IPは保存しない |
| 出品原稿テンプレ生成 | `pnpm gen:marketplace` で各販路向け出品文を一発生成 |
| SNS投稿テンプレ生成 | `pnpm gen:social` でX・note向け投稿テンプレを自動生成 |
| SEO計画生成 | `pnpm gen:seo` でキーワードクラスターと記事構成案を生成 |
| 法的ページ | 特商法・利用規約・プライバシー・免責のテンプレート同梱 |

---

## 無料 vs 有料の構成

### 無料で成立する構成（月額 $0）

| サービス | 無料枠 |
|----------|--------|
| Cloudflare Pages | 1サイト、100,000リクエスト/日 |
| Cloudflare Workers KV | 100,000 reads/日、1,000 writes/日 |
| Cloudflare Web Analytics | 無制限（Cookieなし・PIIなし） |
| GitHub | パブリック/プライベートリポジトリ |

### 月額 $5〜$30 で改善する構成

| オプション | 費用 | 効果 |
|-----------|------|------|
| Workers Paid | $5/月 | リクエスト上限緩和（1,000万/月） |
| 独自ドメイン | $10〜$20/年 | ブランド強化・SSL自動管理 |
| KV追加ストレージ | 従量課金 | クリックデータの長期保存 |

---

## 必要な環境

- Node.js 22以上
- pnpm 9以上
- GitHubアカウント
- Cloudflareアカウント（無料）

---

## クイックスタート

### 1. リポジトリのセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/your-account/digital-sales-starter-kit.git
cd digital-sales-starter-kit

# 依存関係のインストール
pnpm install
```

### 2. 商品情報の設定

`config/products.yaml` を編集します:

```yaml
products:
  - slug: your-product-slug        # URLに使われる識別子
    title: あなたの商品名
    subtitle: キャッチコピー
    description: |
      商品説明を
      複数行で記述できます
    price_display: "9,800円"
    price_jpy: 9800
    currency: JPY
    channels:
      booth_url: ""              # 出品後にURLを記入
      note_url: ""
      gumroad_url: ""
      base_url: ""
      stripe_url: ""
```

### 3. JSONを生成・バリデーション

```bash
pnpm gen
```

YAMLが正しく設定されているか検証し、`src/generated/products.json` を生成します。

### 4. ローカルで確認

```bash
pnpm dev
```

`http://localhost:4321` でサイトが立ち上がります。

### 5. 出品原稿・テンプレートの生成

```bash
# 各販路向け出品原稿を生成（out/marketplace/）
pnpm gen:marketplace

# SNS投稿テンプレートを生成（out/social/）
pnpm gen:social

# SEO計画を生成（out/seo/）
pnpm gen:seo
```

---

## Cloudflare Pages へのデプロイ

### Step 1: GitHubにプッシュ

```bash
git add .
git commit -m "feat: initial setup"
git push origin main
```

### Step 2: Cloudflare Pages でプロジェクトを作成

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にアクセス
2. Workers & Pages → Pages → Create a project
3. Connect to Git → GitHubアカウントを連携
4. リポジトリを選択
5. ビルド設定:
   - **Framework preset**: Astro
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
   - **Root directory**: （空欄）

### Step 3: 環境変数の設定

Cloudflare Pages → Settings → Environment variables で以下を設定:

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `PRODUCTS_JSON` | `src/generated/products.json` の内容（JSON文字列） | /go エンドポイントで使用 |
| `ADMIN_TOKEN` | ランダムな文字列（例: `openssl rand -base64 32`） | /stats へのアクセス保護 |

**PRODUCTS_JSON の設定方法**:
```bash
# products.jsonの内容をコピーする
cat src/generated/products.json
```
コピーした内容を `PRODUCTS_JSON` の値として設定します。

### Step 4: Workers KV の設定

1. Cloudflare Dashboard → Workers & Pages → KV
2. 「Create a namespace」をクリック
3. Namespace名: `CLICK_KV`（任意）
4. Pages → あなたのプロジェクト → Settings → Functions → KV namespace bindings
5. Variable name: `CLICK_KV`、KV namespace: 作成したもの を設定

### Step 5: デプロイを確認

1. Pages → Deployments でビルドログを確認
2. デプロイ完了後、URLでサイトにアクセス
3. `/go?product={slug}` でリダイレクトが正常に動作するか確認

---

## 販路URLの設定

各販路に出品後、`config/products.yaml` にURLを追記します:

```yaml
channels:
  booth_url: "https://your-shop.booth.pm/items/XXXXXXX"
  note_url: "https://note.com/your-account/n/nXXXXXXXX"
  gumroad_url: "https://your-account.gumroad.com/l/XXXXXX"
  base_url: "https://your-shop.thebase.in/items/XXXXXXXX"
  stripe_url: "https://buy.stripe.com/XXXXXXXX"
```

その後:

```bash
pnpm gen          # JSONを再生成
git add config/products.yaml src/generated/products.json
git commit -m "feat: add sales channel URLs"
git push
```

Cloudflare Pagesが自動でデプロイします。

---

## 主要コマンド

```bash
# 開発サーバー起動
pnpm dev

# 設定YAMLをJSONに変換・バリデーション
pnpm gen

# 出品原稿の生成（out/marketplace/）
pnpm gen:marketplace

# SNS投稿テンプレートの生成（out/social/）
pnpm gen:social

# SEO計画の生成（out/seo/）
pnpm gen:seo

# 型チェック
pnpm typecheck

# 本番ビルド（gen → astro build）
pnpm build

# ビルド結果のプレビュー
pnpm preview
```

---

## ディレクトリ構成

```
digital-sales-starter-kit/
├── config/
│   ├── products.yaml          # 商品設定（ここを編集する）
│   └── fees.yaml              # 各販路手数料参考値
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ProductCard.astro
│   │   └── CTA.astro
│   ├── generated/
│   │   └── products.json      # pnpm gen で自動生成
│   ├── lib/
│   │   ├── config.ts          # Zodスキーマ・ユーティリティ
│   │   ├── seo.ts             # SEOメタデータ生成
│   │   ├── routing.ts         # 購入URLの構築
│   │   └── analytics.ts       # KVキー構築・UTM追加
│   └── pages/
│       ├── index.astro        # トップページ
│       ├── faq.astro          # FAQページ
│       ├── contact.astro      # お問い合わせ
│       ├── p/[slug].astro     # 商品詳細ページ
│       └── legal/
│           ├── tokushoho.astro # 特定商取引法
│           ├── terms.astro    # 利用規約
│           ├── privacy.astro  # プライバシーポリシー
│           └── disclaimer.astro # 免責事項
├── functions/
│   ├── go.ts                  # クリック計測 + リダイレクト
│   └── stats.ts               # 管理者向け統計ページ
├── scripts/
│   ├── gen.ts                 # YAML→JSON変換
│   ├── gen-marketplace.ts     # 出品原稿生成
│   ├── gen-social.ts          # SNSテンプレート生成
│   └── gen-seo.ts             # SEO計画生成
├── content/
│   └── templates/
│       ├── marketplace/       # 各販路向けテンプレート
│       │   ├── booth.md
│       │   ├── note.md
│       │   ├── gumroad.md
│       │   ├── base.md
│       │   └── stripe.md
│       ├── lp-copy.md         # LPコピーテンプレート
│       ├── faq.md             # FAQテンプレート
│       ├── social-x.md        # X投稿テンプレート
│       ├── social-note.md     # note投稿テンプレート
│       └── support-replies.md # サポート返信テンプレート
├── public/
│   ├── _headers               # Cloudflare Pages セキュリティヘッダー
│   ├── robots.txt
│   └── favicon.svg
├── docs/
│   ├── PROJECT_BRIEF.md       # プロジェクト設計書
│   ├── SELLING.md             # 各販路出品手順
│   ├── CHANNEL_PLAYBOOK.md    # チャネル攻略ガイド
│   ├── METRICS.md             # KPIとメトリクス
│   ├── OPERATIONS.md          # 月次運用ルーチン
│   └── LEGAL.md               # 法的考慮事項
├── out/                       # 生成ファイル（gitignore推奨）
│   ├── marketplace/           # gen:marketplace の出力先
│   ├── social/                # gen:social の出力先
│   └── seo/                   # gen:seo の出力先
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

---

## 統計の確認方法

`/stats` エンドポイントにBearerトークンを付けてアクセスします:

```bash
# curlで確認
curl -H "Authorization: Bearer {ADMIN_TOKEN}" \
  "https://your-site.pages.dev/stats?days=30"

# ブラウザ拡張（Requestly等）でAuthorizationヘッダーを付けてアクセスする方法もある
```

表示される情報:
- 総クリック数
- 商品別クリック数
- チャネル別クリック数
- 日別・詳細テーブル（最大90日間）

---

## セキュリティ設計

| 対策 | 実装 |
|------|------|
| オープンリダイレクト防止 | リダイレクト先はproducts.yamlに登録したURLのみ |
| PIIゼロ | IPアドレス・UAを保存しない |
| /stats 保護 | ADMIN_TOKEN Bearer認証 |
| セキュリティヘッダー | public/_headers でCSP・X-Frame-Options等を設定 |
| 型安全 | Zodによる設定ファイルのバリデーション |

---

## 実装チェックリスト

### セットアップ

- [ ] `config/products.yaml` に商品情報を記入した
- [ ] `pnpm gen` が成功した
- [ ] `pnpm dev` でローカルでサイトが表示された
- [ ] GitHubにプッシュした
- [ ] Cloudflare PagesでGitHub連携を設定した
- [ ] ビルドが成功した
- [ ] Workers KVを作成してバインドした
- [ ] `PRODUCTS_JSON` 環境変数を設定した
- [ ] `ADMIN_TOKEN` 環境変数を設定した

### 法的ページ

- [ ] `/legal/tokushoho` を実際の情報で埋めた
- [ ] `/legal/terms` を自分のビジネスに合わせて修正した
- [ ] `/legal/privacy` を実態に合わせて修正した
- [ ] 専門家にレビューを依頼した（推奨）

### 出品後

- [ ] 各販路のURLを `config/products.yaml` に記入した
- [ ] `pnpm gen` を再実行してプッシュした
- [ ] `/go?product={slug}` でリダイレクトが正常に動作するか確認した
- [ ] `/stats` でクリック計測が動作するか確認した
- [ ] 各ページのSEOメタタグをブラウザで確認した

---

## カスタマイズのポイント

### 商品を追加する

`config/products.yaml` の `products` に新しいエントリを追加するだけです:

```yaml
products:
  - slug: product-one
    # ...
  - slug: product-two  # 追加
    title: 新しい商品
    # ...
```

`pnpm gen` を実行すると `/p/product-two` が自動生成されます。

### デザインを変更する

各コンポーネントのスタイルは `<style>` タグ内のCSSで管理されています。
カラーパレットを変える場合は `#2563eb`（青）を検索・置換すると効率的です。

### 新しい販路を追加する

1. `src/lib/config.ts` の `ChannelsSchema` に新しいフィールドを追加
2. `getActiveChannels` 関数でキー変換ルールを追加
3. `smartRoute` の優先順位リストに追加
4. `config/products.yaml` に新フィールドを追加

### UTMパラメータを付ける

`src/lib/analytics.ts` の `appendUtm` 関数を使って、外部URLにUTMパラメータを追加できます。

---

## 改善アイデア（将来の拡張）

| アイデア | 難易度 | 効果 |
|---------|--------|------|
| OGP画像自動生成 | 中 | SNSシェア時の見栄えが向上 |
| sitemap.xml 自動生成 | 低 | SEO改善 |
| Cloudflare Web Analytics 組み込み | 低 | PVの可視化 |
| メール収集フォーム（Mailchimp等） | 中 | リスト構築 |
| Stripe Webhookでメール配信 | 高 | ファイル自動配布 |
| A/Bテスト（CTA文言） | 中 | 転換率改善 |
| 多言語対応（英語） | 高 | 海外展開 |
| バンドル販売（複数商品セット） | 中 | 客単価向上 |

---

## よくある質問（開発者向け）

**Q. `pnpm gen` でエラーが出る**

```
Validation failed
```

`config/products.yaml` の構文エラーです。YAMLのインデントが正しいか確認してください。
`slug` フィールドは小文字英数字とハイフン（`[a-z0-9-]`）のみ使用できます。

**Q. /go で「product parameter is required」エラーが出る**

`?product=` パラメータが必須です。`/go?product={slug}` の形式で呼び出してください。

**Q. /go で「no URL configured」エラーが出る**

`config/products.yaml` のチャネルURLが空です。販路に出品後、URLを記入して `pnpm gen` → push してください。

**Q. /stats で 401 Unauthorized が返る**

`ADMIN_TOKEN` 環境変数が設定されているか確認し、`Authorization: Bearer {token}` ヘッダーを付けてアクセスしてください。

**Q. TypeScriptの型エラーが出る**

```bash
pnpm typecheck
```

でエラー詳細を確認してください。`src/lib/config.ts` の型定義と `config/products.yaml` の構造が一致しているか確認します。

---

## 免責事項

- 本キットの使用によって売上・収益・アクセス数などの成果を保証するものではありません
- 法務・税務・会計上の助言は含みません。実際の運用前に専門家にご確認ください
- 特商法・利用規約・プライバシーポリシーのテンプレートは参考素材です。必ず実態に合わせて修正してください
- BOOTH・note・Gumroad・BASE・Stripe・Cloudflareなどの外部サービスの仕様変更、障害、ポリシー変更による損害について責任を負いません
- 手数料の参考値（`config/fees.yaml`）は変動します。最新情報は各プラットフォームの公式サイトでご確認ください

---

## 参考リンク

### 各販路 公式サイト

- [BOOTH](https://booth.pixiv.net/)
- [note](https://note.com/)
- [Gumroad](https://gumroad.com/)
- [BASE](https://thebase.in/)
- [Stripe](https://stripe.com/jp)

### インフラ

- [Cloudflare Pages ドキュメント](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers KV ドキュメント](https://developers.cloudflare.com/kv/)
- [Astro ドキュメント](https://docs.astro.build/)

### 法的参考

- [消費者庁 特定商取引法ガイド](https://www.no-trouble.caa.go.jp/)
- [国税庁 インボイス制度](https://www.nta.go.jp/taxes/shiraberu/zeimokubetsu/shohi/keigenzeiritsu/invoice.htm)

### 関連ドキュメント（本キット）

- [プロジェクトブリーフ](docs/PROJECT_BRIEF.md)
- [各販路出品手順](docs/SELLING.md)
- [チャネル攻略プレイブック](docs/CHANNEL_PLAYBOOK.md)
- [メトリクスとKPI](docs/METRICS.md)
- [月次運用ルーチン](docs/OPERATIONS.md)
- [法的考慮事項](docs/LEGAL.md)
