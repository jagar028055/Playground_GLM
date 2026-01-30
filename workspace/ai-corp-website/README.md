# AI Corp Website

モダン・ミニマルデザインのAI・データ分析企業コーポレートサイト（日本語/英語対応）

## プロジェクト概要

最新のWeb技術とデザイントレンドを駆使した、高パフォーマンスなコーポレートサイト構築プロジェクト。

### 主な特徴

- 🌐 **多言語対応**: 日本語/英語の切り替え機能
- 📱 **レスポンシブデザイン**: 全デバイス対応
- ⚡ **高速パフォーマンス**: FCP 2秒以下、LCP 3秒以下
- ♿ **アクセシビリティ**: WCAG 2.1 AA準拠
- 🎨 **モダンデザイン**: ミニマルで洗練されたUI

## ディレクトリ構造

```
ai-corp-website/
├── index.html              # メインページ
├── css/
│   ├── main.css           # メインスタイルシート
│   ├── responsive.css     # レスポンシブ対応
│   └── print.css          # 印刷用スタイル
├── js/
│   ├── main.js            # メインJavaScript
│   ├── i18n.js            # 多言語切替
│   └── animations.js      # アニメーション
├── assets/
│   ├── icons/             # SVGアイコン
│   ├── images/            # 画像リソース
│   └── favicons/          # ファビコン
└── docs/
    ├── accessibility.md   # アクセシビリティドキュメント
    └── performance.md     # パフォーマンスレポート
```

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone [repository-url]
cd ai-corp-website
```

### 2. ローカルサーバー起動

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server使用)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

### 3. ブラウザでアクセス

http://localhost:8000

## 開発環境

### 必要なツール

- 最新のブラウザ（Chrome, Firefox, Safari, Edge）
- ローカルWebサーバー
- コードエディタ（VS Code推奨）

### 推奨VS Code拡張機能

- HTML CSS Support
- JavaScript (ES6) code snippets
- Live Server
- Prettier
- ESLint

## 機能一覧

### セクション構成

1. **ヒーローセクション**: メインビジュアルとCTA
2. **サービス概要**: 提供サービスの紹介
3. **製品紹介**: 製品・ソリューションの詳細
4. **会社概要**: 企業情報
5. **実績**: プロジェクト事例
6. **チーム紹介**: メンバー紹介
7. **採用情報**: 求人情報
8. **ニュース**: 最新ニュース・プレスリリース
9. **パートナー**: 提携企業・パートナー
10. **リソース**: ブログ・ドキュメント
11. **FAQ**: よくある質問
12. **お問い合わせ**: コンタクトフォーム
13. **フッター**: サイトマップ・SNSリンク

### インタラクション機能

- スクロールアニメーション
- 多言語切り替え（日本語/英語）
- フォームバリデーション
- Lazy Loading
- スムーススクロール
- モバイルメニュー

## パフォーマンス目標

| 指標 | 目標値 |
|------|--------|
| FCP (First Contentful Paint) | 2秒以下 |
| LCP (Largest Contentful Paint) | 3秒以下 |
| TTI (Time to Interactive) | 3秒以下 |
| Lighthouse Score | 90点以上 |
| 画像サイズ（合計） | 500KB以下 |

## アクセシビリティ対応

- WCAG 2.1 AA準拠
- ARIAラベルの適切な実装
- キーボードナビゲーション対応
- コントラスト比 4.5:1 以上
- スクリーンリーダー対応

## ブラウザ対応

| ブラウザ | バージョン |
|----------|-----------|
| Chrome | 最新2バージョン |
| Firefox | 最新2バージョン |
| Safari | 最新2バージョン |
| Edge | 最新2バージョン |
| iOS Safari | iOS 14+ |
| Android Chrome | Android 10+ |

## ビルドと最適化

### CSS最適化

```bash
# CSS圧縮（例：cssnano使用）
npx cssnano css/main.css css/main.min.css
```

### JavaScript最適化

```bash
# JS圧縮（例：terser使用）
npx terser js/main.js -c -m -o js/main.min.js
```

### 画像最適化

```bash
# WebP変換（例：cwebp使用）
cwebp -q 80 input.png -o output.webp
```

## テスト

### Lighthouse監査

```bash
# Chrome DevTools または CLI
npx lighthouse http://localhost:8000 --view
```

### アクセシビリティテスト

```bash
# axe-core使用
npx axe http://localhost:8000
```

## デプロイ

### GitHub Pages

```bash
# gh-pagesブランチにデプロイ
git subtree push --prefix dist origin gh-pages
```

### Netlify

```bash
# ドラッグ&ドロップまたはGit連携
# netlify.toml設定ファイルを配置
```

### Vercel

```bash
# Vercel CLI使用
npx vercel --prod
```

## 貢献方法

1. ブランチを作成 (`git checkout -b feature/AmazingFeature`)
2. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
3. ブランチをプッシュ (`git push origin feature/AmazingFeature`)
4. プルリクエストを作成

## ライセンス

[ライセンス情報を記載]

## 連絡先

- Webサイト: [https://aicorp.example.com]
- Email: [contact@aicorp.example.com]
- Twitter: [@aicorp]

---

作成日: 2026-01-30
最終更新: 2026-01-30
