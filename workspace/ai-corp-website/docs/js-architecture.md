# JavaScript アーキテクチャ設計書

## 概要
AI Corp コーポレートサイトのフロントエンドJavaScript実装設計

## 技術スタック
- Vanilla JavaScript (ES6+)
- Intersection Observer API
- localStorage API
- CSS Variables

## ファイル構造
```
js/
├── main.js              # メインエントリーポイント
├── modules/
│   ├── i18n.js         # 多言語切替モジュール
│   ├── animations.js   # スクロールアニメーション
│   ├── navigation.js   # ナビゲーション・モバイルメニュー
│   ├── smoothScroll.js # スムーズスクロール
│   └── validation.js   # フォームバリデーション
└── i18n/
    ├── ja.json         # 日本語翻訳データ
    └── en.json         # 英語翻訳データ
```

## モジュール設計

### 1. i18n.js - 多言語切替モジュール

#### 責務
- 言語切替機能の管理
- 翻訳データの読み込み
- DOMのテキスト置換
- 言語状態の永続化（localStorage）

#### 主要メソッド
```javascript
class I18n {
  constructor(defaultLang = 'ja')
  async init()
  setLanguage(lang)
  getCurrentLanguage()
  t(key)                    // 翻訳テキスト取得
  updateDOM()              // DOM要素のテキストを更新
  savePreference(lang)     // localStorageに保存
  loadPreference()         // localStorageから読み込み
}
```

#### HTML属性設計
```html
<!-- data-i18n属性で翻訳キーを指定 -->
<h1 data-i18n="hero.title">AIで未来を創る</h1>
<p data-i18n="hero.subtitle">最先端の人工知能...</p>

<!-- 言語切替ボタン -->
<button class="lang-switch" data-lang="en">English</button>
<button class="lang-switch" data-lang="ja">日本語</button>
```

#### 実装ポイント
- JSONファイルから翻訳データを非同期読み込み
- data-i18n属性を持つ全要素をquerySelectorAllで取得
- ネストされたキー（hero.title）をドット記法で解決
- html要素のlang属性を更新
- 言語切替時にカスタムイベント'i18n:change'を発火

---

### 2. animations.js - スクロールアニメーション

#### 責務
- Intersection Observerによる要素の監視
- スクロール時のフェードインアニメーション
- ロード時の初期アニメーション

#### 主要メソッド
```javascript
class ScrollAnimations {
  constructor(options = {})
  init()
  observe(elements)
  unobserve(elements)
  onIntersection(entries)
  addAnimationClass(element)
}
```

#### HTML属性設計
```html
<!-- アニメーション対象要素 -->
<section class="fade-in" data-animate>
<div class="slide-up" data-animate data-delay="200">
<img class="zoom-in" data-animate data-delay="400">

<!-- アニメーション種類 -->
data-animate="fade-in"    // フェードイン
data-animate="slide-up"   // 下からスライド
data-animate="slide-down" // 上からスライド
data-animate="zoom-in"    // ズームイン
data-animate="zoom-out"   // ズームアウト
```

#### CSS連携
```css
/* 初期状態 */
[data-animate] {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

/* アニメーション発火 */
[data-animate].is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

#### 実装ポイント
- Intersection Observerのthresholdを0.1〜0.3で設定
- rootMarginで予め読み込む範囲を指定（例: '0px 0px -50px 0px'）
- data-delay属性で遅延時間をミリ秒単位で指定
- performance.mark()でパフォーマンス計測

---

### 3. navigation.js - ナビゲーション・モバイルメニュー

#### 責務
- モバイルメニューの開閉
- スクロール時のヘッダー固定
- アクティブセクションのハイライト

#### 主要メソッド
```javascript
class Navigation {
  constructor()
  init()
  toggleMobileMenu()
  closeMobileMenu()
  handleScroll()
  updateActiveSection()
}
```

#### HTML構造
```html
<header class="header" data-header>
  <nav class="nav" data-nav>
    <button class="menu-toggle" data-menu-toggle aria-label="Menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <ul class="nav-menu" data-nav-menu>
      <li><a href="#home" class="nav-link">Home</a></li>
    </ul>
  </nav>
</header>
```

#### 実装ポイント
- ハンバーガーメニューのアニメーション
- メニュー開�時にbodyにクラスを付与（スクロール防止）
- 現在のセクションに応じてnav-linkにactiveクラス付与
- 700px以下でモバイルメニュー表示

---

### 4. smoothScroll.js - スムーズスクロール

#### 責務
- アンカーリンクのスムーズスクロール
- スクロール位置のオフセット調整（ヘッダー分）

#### 主要メソッド
```javascript
class SmoothScroll {
  constructor(offset = 80)
  init()
  scrollTo(target)
  handleLinkClick(e)
}
```

#### 実装ポイント
- scrollIntoView()のbehavior: 'smooth'を使用
- CSSのscroll-behavior: smoothをフォールバック
- 固定ヘッダーの高さ分をオフセットとして考慮

---

### 5. validation.js - フォームバリデーション

#### 責務
- お問い合わせフォームのバリデーション
- エラーメッセージの表示
- 送信前の最終チェック

#### 主要メソッド
```javascript
class FormValidation {
  constructor(form)
  init()
  validateField(field)
  validateEmail(email)
  showError(field, message)
  clearError(field)
  handleSubmit(e)
}
```

#### HTML属性設計
```html
<form id="contact-form" novalidate>
  <input
    type="email"
    name="email"
    required
    data-validate
    data-error-required="必須項目です"
    data-error-email="正しいメールアドレスを入力してください"
  >
  <span class="error-message" data-error-for="email"></span>
</form>
```

#### バリデーションルール
- 必須項目チェック（required属性）
- メールアドレス形式チェック（type="email"）
- 最小・最大文字数チェック（minlength, maxlength）
- エラーメッセージはdata-error-*属性から取得

---

## main.js - メインエントリーポイント

### 初期化フロー
```javascript
document.addEventListener('DOMContentLoaded', async () => {
  // 1. 多言語機能の初期化
  const i18n = new I18n();
  await i18n.init();

  // 2. アニメーションの初期化
  const animations = new ScrollAnimations({
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });
  animations.init();

  // 3. ナビゲーションの初期化
  const navigation = new Navigation();
  navigation.init();

  // 4. スムーズスクロールの初期化
  const smoothScroll = new SmoothScroll(80);
  smoothScroll.init();

  // 5. フォームバリデーションの初期化
  const form = document.querySelector('#contact-form');
  if (form) {
    const validation = new FormValidation(form);
    validation.init();
  }
});
```

---

## Lazy Loading実装

### 方法1: native loading属性（推奨）
```html
<img src="image.jpg" loading="lazy" alt="...">
```

### 方法2: Intersection Observer（フォールバック）
```javascript
const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.add('loaded');
      imageObserver.unobserve(img);
    }
  });
});

lazyImages.forEach(img => imageObserver.observe(img));
```

---

## パフォーマンス最適化

### 1. イベントデレギュリング
```javascript
// スクロールイベントのスロットリング
const throttle = (fn, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      fn(...args);
      lastCall = now;
    }
  };
};

window.addEventListener('scroll', throttle(() => {
  navigation.handleScroll();
}, 100));
```

### 2. リサイズイベントのデバウンス
```javascript
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

window.addEventListener('resize', debounce(() => {
  // リサイズ時の処理
}, 200));
```

### 3. CSS Variablesとの連携
```javascript
// JSからCSS変数を操作
const setCSSVar = (name, value) => {
  document.documentElement.style.setProperty(name, value);
};

// テーマ切替時に使用
setCSSVar('--primary-color', '#007bff');
```

---

## ブラウザ対応状況

### Intersection Observer
- Chrome 51+
- Firefox 55+
- Safari 12.1+
- Edge 15+

### localStorage
- 全モダンブラウザで対応
- プライベートモードでは無効な場合あり

### CSS Variables
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15%

---

## テスト計画

### 単体テスト
- [ ] I18nクラスの各メソッド
- [ ] ScrollAnimationsのObserver動作
- [ ] FormValidationのバリデーションロジック

### 統合テスト
- [ ] 多言語切替時のDOM更新
- [ ] スクロールアニメーションの発火タイミング
- [ ] フォーム送信のバリデーションフロー

### クロスブラウザテスト
- [ ] Chrome最新版
- [ ] Firefox最新版
- [ ] Safari最新版
- [ ] Edge最新版
- [ ] モバイルブラウザ（iOS Safari, Chrome Mobile）

---

## 開発スケジュール

### 準備フェーズ（現在）
- [x] 多言語データJSON作成
- [x] アーキテクチャ設計書作成
- [ ] 実装計画の策定

### 実装フェーズ（Worker1完了後）
1. main.jsの基本構造（30分）
2. i18n.js実装（1時間）
3. animations.js実装（1時間）
4. navigation.js実装（30分）
5. smoothScroll.js実装（15分）
6. validation.js実装（30分）
7. Lazy Loading実装（15分）

### テスト・調整フェーズ
- [ ] 機能テスト
- [ ] パフォーマンステスト
- [ ] クロスブラウザテスト
- [ ] バグ修正

---

## リスクと対策

### リスク1: Worker1のHTML/CSS完了遅延
- **対策**: HTML構造に依存しない部分から実装開始

### リスク2: 多言語データの不整合
- **対策**: バリデーションツールでキーの存在チェック

### リスク3: パフォーマンス劣化
- **対策**: Lighthouseで定期的に計測、最適化

---

## 参考資料
- [Intersection Observer API - MDN](https://developer.mozilla.org/ja/docs/Web/API/Intersection_Observer_API)
- [localStorage - MDN](https://developer.mozilla.org/ja/docs/Web/API/Window/localStorage)
- [Web Performance - MDN](https://developer.mozilla.org/ja/docs/Web/Performance)
