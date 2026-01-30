# 外部リソース調査レポート

Webサイト最適化のための外部リソースとツールの調査結果

## 1. Google Fonts 最適な読み込み方法

### 推奨方法: `font-display: swap` を使用した非同期読み込み

```html
<!-- 方法1: Google Fonts API（推奨） -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

```css
/* font-display: swap は自動的に適用される */
/* カスタムフォントを使用する場合 */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-weight: 400;
  font-display: swap; /* FOUT防止 */
}
```

### 実装上のポイント

- **DNSプリフェッチ**: `preconnect` で事前に接続
- **フォントサブセット**: 必要な文字のみを含める
- **font-display: swap**: フォント読み込み中に代替フォントを表示
- **WOFF2形式**: 最もサイズが小さい

### 推奨フォント構成

```css
/* 日本語サイト向け */
:root {
  --font-japanese: 'Noto Sans JP', sans-serif;
  --font-english: 'Inter', sans-serif;
  --font-system: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* フォントスタック */
body {
  font-family: var(--font-japanese);
  font-feature-settings: 'palt'; /* プロポーショナルメトリクス（日本語） */
}
```

### パフォーマンス目標

- 初期ロード: 3フォント以内
- 各フォントサイズ: 100KB以下（圧縮後）
- FOUT時間: 1秒以内

---

## 2. WebP変換ツール調査

### 推奨ツール比較

| ツール | 特徴 | コマンド | 導入容易度 |
|--------|------|----------|-----------|
| **cwebp** | Google公式、高品質 | `cwebp input.png -q 80 -o output.webp` | ⭐⭐⭐⭐ |
| **squoosh** | Web版、GUI操作 | ブラウザで使用 | ⭐⭐⭐⭐⭐ |
| **sharp** | Node.js、高速 | `npm install sharp` | ⭐⭐⭐ |
| **imagemin** | Node.js、多数プラグイン | `npm install imagemin` | ⭐⭐⭐ |

### cwebp（推奨）の使用方法

```bash
# Ubuntu/Debian
sudo apt-get install webp

# macOS
brew install webp

# 基本的な変換
cwebp input.png -q 80 -o output.webp

# 複数ファイル一括変換
for file in *.png; do
  cwebp "$file" -q 80 -o "${file%.png}.webp"
done

# 高圧縮（写真向け）
cwebp input.jpg -q 75 -o output.webp

# 低圧縮（画質優先）
cwebp input.png -q 90 -o output.webp

# サイズ指定
cwebp input.png -q 80 -resize 800 600 -o output.webp

# メタデータ削除
cwebp input.png -q 80 -noalpha -o output.webp
```

### HTMLでの実装

```html
<!-- picture要素によるフォールバック -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="image.jpg" alt="画像の説明" loading="lazy">
</picture>
```

### Node.jsスクリプト例

```javascript
// scripts/convert-to-webp.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './assets/images';
const outputDir = './assets/images/webp';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(inputDir).forEach(file => {
  if (file.match(/\.(jpg|jpeg|png)$/i)) {
    const name = path.parse(file).name;
    sharp(`${inputDir}/${file}`)
      .webp({ quality: 80 })
      .toFile(`${outputDir}/${name}.webp`)
      .then(() => console.log(`✅ Converted: ${file}`))
      .catch(err => console.error(`❌ Error: ${file}`, err));
  }
});
```

### 品質設定ガイドライン

| 用途 | 推奨品質 | 説明 |
|------|----------|------|
| ヒーロー画像 | 85-90 | 高品質、印象を重視 |
| 製品写真 | 80-85 | 詳細を保持 |
| 一般写真 | 75-80 | バランス重視 |
| サムネイル | 70-75 | サイズ優先 |
| アイコン/ロゴ | 90-95 | エッジを保持 |

---

## 3. Lighthouse CI 設定方法

### Lighthouse CI の概要

Lighthouse CIは、Lighthouseの監査をCI/CDパイプラインに組み込むためのツールです。

### インストール

```bash
npm install -g @lhci/cli
# またはプロジェクトローカル
npm install --save-dev @lhci/cli
```

### 設定ファイル (lighthouserc.json)

```json
{
  "ci": {
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["warn", { "maxNumericValue": 1800 }],
        "largest-contentful-paint": ["warn", { "maxNumericValue": 3000 }],
        "cumulative-layout-shift": ["warn", { "maxNumericValue": 0.1 }]
      }
    },
    "collect": {
      "url": [
        "http://localhost:8000",
        "http://localhost:8000/ja"
      ],
      "numberOfRuns": 3
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### 使用方法

```bash
# 初期設定
lhci autorun

# 手動実行
lhci collect
lhci assert
```

### GitHub Actions での使用

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Start local server
        run: npx http-server -p 8000 &

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun

      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: lighthouse-report
          path: .lighthouseci/
```

### GitHub Actions（別パターン - Lighthouse CI Action）

```yaml
name: Lighthouse CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Audit URLs using Lighthouse
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:8000
            http://localhost:8000/services
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### ローカル開発での使用

```bash
# package.json
{
  "scripts": {
    "lighthouse": "lhci autorun",
    "lighthouse:collect": "lhci collect",
    "lighthouse:assert": "lhci assert"
  }
}
```

### 予算設定

```javascript
// budgets.json
[
  {
    "path": "/*",
    "timings": [
      {
        "metric": "first-contentful-paint",
        "budget": 1800
      },
      {
        "metric": "largest-contentful-paint",
        "budget": 3000
      },
      {
        "metric": "cumulative-layout-shift",
        "budget": 0.1
      }
    ],
    "resourceSizes": [
      {
        "resourceType": "script",
        "budget": 200
      },
      {
        "resourceType": "stylesheet",
        "budget": 100
      },
      {
        "resourceType": "image",
        "budget": 500
      },
      {
        "resourceType": "total",
        "budget": 1000
      }
    ]
  }
]
```

---

## まとめと推奨アクション

### 優先度: 高

1. **Google Fonts最適化**
   - `preconnect` 属性を追加
   - `font-display: swap` を使用
   - 日本語フォントを1-2種類に制限

2. **WebP変換**
   - `cwebp` をインストール
   - すべての新規画像をWebP形式で保存
   - 既存画像を順次WebPに変換

3. **Lighthouse CI**
   - `lighthouserc.json` を作成
   - GitHub Actionsワークフローを設定
   - 各PRで自動監査を実行

### 実装スケジュール

- [ ] Week 1: Google Fonts最適化、WebP変換ツール導入
- [ ] Week 2: 既存画像のWebP変換、HTMLでのpicture要素実装
- [ ] Week 3: Lighthouse CI設定、GitHub Actions統合
- [ ] Week 4: 予算設定、モニタリング開始

---

**作成日**: 2026-01-30
**作成者**: Worker3
**ステータス**: 準備完了
