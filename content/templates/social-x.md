# X（Twitter）投稿テンプレート

商品: {{TITLE}}

---

## 告知投稿（リリース時）

**投稿1（リリース告知）**

```
【リリース】{{TITLE}} を公開しました。

{{SUBTITLE}}

{{TAGS_JA}}

詳細はこちら→ [URL]
```

**投稿2（特徴紹介）**

```
{{TITLE}} でできること：

- BOOTH・note・Gumroad・BASE・Stripeへの購入導線を一元管理
- クリック計測（PII不保存）
- 出品原稿テンプレ自動生成
- 月$0から運用可能

{{TAGS_JA}}

→ [URL]
```

---

## 継続投稿（週次）

**Week 1: 問題提起**

```
デジタルコンテンツを売りたいけど、どの販路がいいかわからない…

BOOTH・note・Gumroad・BASE・Stripeの手数料と向き不向きをまとめました。

{{TAGS_JA}}
→ [URL]
```

**Week 2: ビフォーアフター**

```
Before: LP・計測・出品テンプレをバラバラに管理
After: YAMLを1ファイル編集するだけで全部揃う

{{TITLE}} でビフォーアフターを体験→ [URL]

{{TAGS_JA}}
```

**Week 3: 数字で語る**

```
月1時間運用で回す仕組み：

- 設定: YAML編集のみ
- デプロイ: GitHubプッシュで自動
- 計測: /stats で確認
- 出品: pnpm gen:marketplace で原稿生成
- SNS: pnpm gen:social でテンプレ生成

{{TAGS_JA}} → [URL]
```

**Week 4: コスト比較**

```
デジタル販売の月額コスト比較：

無料構成: Cloudflare Pages Free + KV Free
月$10〜: Workers Paid でリクエスト上限緩和
月$20〜: 独自ドメイン追加

{{TITLE}} は無料から始められます。

{{TAGS_JA}} → [URL]
```

---

## FAQ投稿テンプレ（週次）

**Q&A1〜Q&A5（週1本ずつ）**

```
Q. {{TITLE}}はプログラミング知識が必要ですか？

A. 基本設定はYAMLファイルの編集のみです。
   GitHubアカウントがあれば、Cloudflare PagesのGUI連携でデプロイできます。

{{TAGS_JA}} → [URL]
```

---

## リマインド投稿（月次）

```
【月次振り返り】

今月の販売実績と気づきをシェアします。
（実績を入れる）

改善に使っているのは {{TITLE}} のクリック計測機能。
どのチャネルが効いているか一目でわかる。

{{TAGS_JA}} → [URL]
```
