# 月次運用ルーチン

最終更新: 2026-03-13

---

## 概要

本キットは月1時間以内の運用で維持できるよう設計されています。
以下のルーチンを毎月実施してください。

---

## 月次ルーチン（合計: 約60分）

### STEP 1: 数字確認（15分）

#### クリック計測を確認する

```bash
# /stats にアクセス（Bearerトークン認証が必要）
curl -H "Authorization: Bearer {ADMIN_TOKEN}" https://your-site.pages.dev/stats?days=30
```

またはブラウザで `https://your-site.pages.dev/stats?days=30` を開く（Authorization ヘッダーが必要なのでツールを使う）。

確認すべき項目:
- [ ] 先月の総クリック数
- [ ] 最も多くクリックされたチャネル
- [ ] クリックが急増・急減した日付（告知との相関を確認）

#### 各販路の売上を確認する

- [ ] BOOTH管理画面 → 売上レポート
- [ ] note管理画面 → 売上
- [ ] Gumroad管理画面 → Analytics
- [ ] BASE管理画面 → 売上管理
- [ ] Stripe Dashboard → 支払い

記録シートに転記する（Googleスプレッドシート推奨）。

---

### STEP 2: 顧客フォロー（10分）

- [ ] 各販路のレビュー・コメントを確認
- [ ] お問い合わせメールへの返信
- [ ] GitHubのIssueを確認・返信

---

### STEP 3: コンテンツ更新（15分）

#### SNS投稿（週1〜2本を目標）

```bash
# SNS投稿テンプレートを確認する
cat out/social/digital-sales-starter-kit/x.md
```

`out/social/{slug}/x.md` からテンプレートを選んでXに投稿する。

#### 商品説明の更新（必要な場合）

1. `config/products.yaml` を編集
2. `pnpm gen` でJSONを再生成・バリデーション
3. 変更をコミット・プッシュ

```bash
pnpm gen
git add config/products.yaml src/generated/products.json
git commit -m "chore: update product description"
git push
```

Cloudflare Pagesが自動でビルド・デプロイします。

---

### STEP 4: 技術チェック（10分）

- [ ] Cloudflare Pages ダッシュボードでビルドが正常か確認
- [ ] `/go?product=digital-sales-starter-kit` が正常にリダイレクトするか確認
- [ ] `/p/digital-sales-starter-kit` が表示されるか確認
- [ ] Node.js・pnpmのバージョンアップデートを確認（必要に応じて）

```bash
# 依存関係のセキュリティ確認
pnpm audit
```

---

### STEP 5: 振り返りと翌月計画（10分）

#### 今月の振り返り

以下をメモに記録する:
- 先月のクリック数・売上
- うまくいったこと
- うまくいかなかったこと
- 気づき・仮説

#### 翌月のアクション計画

以下から1〜2つ選んでアクションを決める:

**流入を増やす施策**:
- SEO記事を1本書く
- note記事を1本公開する
- X投稿を週3本に増やす
- 関連コミュニティでの告知

**転換率を改善する施策**:
- 商品説明を改善する
- FAQを追加する（よくある質問を追加）
- 価格を調整する
- サムネイル画像を変える

**新商品・拡張**:
- 新しい商品を `config/products.yaml` に追加
- 新しい販路に出品

---

## 四半期チェック（3ヶ月に1回）

毎月のルーチンに加えて、3ヶ月に1回以下を実施する。

### 手数料・ポリシーの確認

- [ ] 各プラットフォームの手数料変更がないか確認
  - BOOTH: https://booth.pixiv.help/
  - note: https://help.note.com/
  - Gumroad: https://gumroad.com/pricing
  - BASE: https://help.thebase.in/
  - Stripe: https://stripe.com/jp/pricing
- [ ] `config/fees.yaml` を最新情報に更新

### 法的確認

- [ ] 特定商取引法ページの内容が最新か確認
- [ ] 価格・連絡先に変更がないか
- [ ] プライバシーポリシーに変更事項がないか

### 技術的な更新

```bash
# 依存関係の更新
pnpm update

# TypeScriptチェック
pnpm typecheck

# ビルドテスト
pnpm build
```

---

## 年次チェック

年に1回以下を実施する。

- [ ] Cloudflare Pagesの無料枠使用状況を確認（ダッシュボード → Analytics）
- [ ] KVのストレージ使用量を確認
- [ ] 商品の価格を市場に合わせて見直す
- [ ] ドメイン更新（独自ドメインを使用している場合）
- [ ] 法的ページの内容を専門家に確認依頼を検討

---

## 緊急時の対応

### Cloudflare Pagesが落ちている

- Cloudflare Status (https://www.cloudflarestatus.com/) を確認
- 通常は数時間で復旧する

### /go が動作しない

```bash
# ローカルでテスト
pnpm preview

# Cloudflare Pages Functionsのログを確認
# Cloudflare Dashboard → Pages → Functions → ログ
```

### KVのデータが消えた

- KVには TTL を1年間設定しているため、通常は消えない
- ダッシュボードで KV の状態を確認する

### 販路URLが変わった

1. `config/products.yaml` の `channels` セクションを更新
2. `pnpm gen` で再生成
3. git push でデプロイ

---

## 便利なコマンドまとめ

```bash
# 設定YAMLをJSONに変換・バリデーション
pnpm gen

# 出品原稿の生成（出力先: out/marketplace/）
pnpm gen:marketplace

# SNS投稿テンプレートの生成（出力先: out/social/）
pnpm gen:social

# SEO計画の生成（出力先: out/seo/）
pnpm gen:seo

# ローカル開発サーバー起動
pnpm dev

# 型チェック
pnpm typecheck

# 本番ビルド（gen → astro build）
pnpm build

# ビルド結果のプレビュー
pnpm preview
```
