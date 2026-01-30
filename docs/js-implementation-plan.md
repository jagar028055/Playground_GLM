# JavaScript 実装計画書

## プロジェクト情報
- **担当**: Worker2
- **タスク**: JavaScript実装（アニメーション・多言語）
- **納期**: 2026/01/31 18:00
- **作業ディレクトリ**: /workspace/ai-corp-website

---

## 完了タスク（準備フェーズ）

### ✅ 1. 多言語データ作成
**成果物**:
- `/workspace/ai-corp-website/js/i18n/ja.json`
- `/workspace/ai-corp-website/js/i18n/en.json`

**内容**:
- 13セクション分の翻訳データ
- 日本語・英語それぞれ120+キー
- 階層構造（例: hero.title, services.items.analytics.title）

### ✅ 2. アーキテクチャ設計
**成果物**:
- `/workspace/ai-corp-website/docs/js-architecture.md`

**内容**:
- 5モジュール設計（i18n, animations, navigation, smoothScroll, validation）
- 各クラスのインターフェース定義
- HTML属性設計（data-i18n, data-animate等）
- CSS連携仕様
- パフォーマンス最適化方針

---

## 実装フェーズ（Worker1完了後開始）

### Phase 1: 基盤構築（予定30分）

#### 1.1 main.js基本構造
```javascript
// /workspace/ai-corp-website/js/main.js
(function() {
  'use strict';

  // アプリケーション設定
  const CONFIG = {
    lang: document.documentElement.lang || 'ja',
    animationThreshold: 0.2,
    scrollOffset: 80
  };

  // DOMContentLoadedで初期化
  document.addEventListener('DOMContentLoaded', async () => {
    console.log('App initialized');
    // 各モジュールの初期化はここで
  });
})();
```

#### 1.2 モジュールディレクトリ作成
```bash
mkdir -p /workspace/ai-corp-website/js/modules
```

---

### Phase 2: 多言語機能実装（予定1時間）

#### 2.1 i18n.js実装
**ファイル**: `/workspace/ai-corp-website/js/modules/i18n.js`

**実装内容**:
1. I18nクラス定義
2. async loadTranslations(lang) - JSON読み込み
3. setLanguage(lang) - 言語切替
4. updateDOM() - 全要素のテキスト置換
5. savePreference() / loadPreference() - localStorage永続化
6. t(key) - 翻訳テキスト取得（ヘルパー関数）

**依存**: なし（最初に実装可能）

---

### Phase 3: アニメーション実装（予定1時間）

#### 3.1 animations.js実装
**ファイル**: `/workspace/ai-corp-website/js/modules/animations.js`

**実装内容**:
1. ScrollAnimationsクラス定義
2. Intersection Observerの初期化
3. observe(elements) - 監視対象要素の追加
4. onIntersection(entries) - 交差時の処理
5. addAnimationClass(element, delay) - アニメーションクラス付与
6. ロード時アニメーション（heroセクション等）

**依存**: Worker1のHTML（data-animate属性）

**CSS連携**:
```css
[data-animate].is-visible { opacity: 1; }
```

---

### Phase 4: ナビゲーション実装（予定30分）

#### 4.1 navigation.js実装
**ファイル**: `/workspace/ai-corp-website/js/modules/navigation.js`

**実装内容**:
1. Navigationクラス定義
2. toggleMobileMenu() - メニュー開閉
3. handleScroll() - スクロール時のヘッダー固定
4. updateActiveSection() - アクティブセクションのハイライト

**依存**: Worker1のHTML（header, nav要素）

---

### Phase 5: スムーズスクロール実装（予定15分）

#### 5.1 smoothScroll.js実装
**ファイル**: `/workspace/ai-corp-website/js/modules/smoothScroll.js`

**実装内容**:
1. SmoothScrollクラス定義
2. scrollTo(target) - スムーズスクロール実行
3. handleLinkClick(e) - アンカーリンクのハンドリング

**依存**: Worker1のHTML（a[href^="#"]要素）

---

### Phase 6: フォームバリデーション実装（予定30分）

#### 6.1 validation.js実装
**ファイル**: `/workspace/ai-corp-website/js/modules/validation.js`

**実装内容**:
1. FormValidationクラス定義
2. validateField(field) - 各フィールドのバリデーション
3. validateEmail(email) - メールアドレス形式チェック
4. showError() / clearError() - エラー表示制御
5. handleSubmit(e) - 送信時の最終チェック

**依存**: Worker1のHTML（form要素）

---

### Phase 7: Lazy Loading実装（予定15分）

#### 7.1 main.jsに組み込み
**実装内容**:
1. Intersection Observerによる画像の遅延読み込み
2. data-src属性からsrcに切り替え
3. 読み込み完了時の.loadedクラス付与

**依存**: Worker1のHTML（img要素）

---

### Phase 8: main.js統合（予定30分）

#### 8.1 全モジュールの初期化
```javascript
document.addEventListener('DOMContentLoaded', async () => {
  // 1. 多言語
  const i18n = new I18n(CONFIG.lang);
  await i18n.init();

  // 2. アニメーション
  const animations = new ScrollAnimations({
    threshold: CONFIG.animationThreshold
  });
  animations.init();

  // 3. ナビゲーション
  const navigation = new Navigation();
  navigation.init();

  // 4. スムーズスクロール
  const smoothScroll = new SmoothScroll(CONFIG.scrollOffset);
  smoothScroll.init();

  // 5. フォームバリデーション
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    const validation = new FormValidation(contactForm);
    validation.init();
  }

  // 6. Lazy Loading
  initLazyLoading();

  console.log('All modules initialized');
});
```

---

## 品質チェックリスト

### 機能要件
- [ ] 多言語切替が正常に動作
- [ ] スクロールアニメーションが発火
- [ ] モバイルメニューが開閉
- [ ] スムーズスクロールが動作
- [ ] フォームバリデーションが機能
- [ ] Lazy Loadingで画像が遅延読み込み

### パフォーマンス要件
- [ ] FCP 2秒以下
- [ ] LCP 3秒以下
- [ ] スクロール時のFPS 60以上
- [ ] Intersection Observerの重く処理回避

### ブラウザ対応
- [ ] Chrome最新版
- [ ] Firefox最新版
- [ ] Safari最新版
- [ ] Edge最新版
- [ ] モバイルブラウザ

### コード品質
- [ ] ESLintエラーなし
- [ ] console.log削除（本番用）
- [ ] JSDocコメント付与
- [ ] エラーハンドリング実装

---

## リスク管理

### リスク1: Worker1の遅延
- **影響**: 実装開始が遅れる
- **対策**: HTML構造に依存しないi18nモジュールから実装開始

### リスク2: 多言語データの修正
- **影響**: キーの不一致でテキスト置換失敗
- **対策**: Worker1のHTMLと合わせてdata-i18n属性を確認

### リスク3: パフォーマンス劣化
- **影響**: Lighthouseスコア低下
- **対策**: 定期的なパフォーマンス計測、必要に応じて最適化

---

## 進捗報告タイミング

1. ✅ **現在**: 準備フェーズ完了
2. **Worker1完了時**: 実装フェーズ開始報告
3. **実装50%**: main.js統合完了時
4. **実装80%**: 全機能実装完了時
5. **完了**: テスト完了、成果物提出

---

## 成果物一覧

1. `/workspace/ai-corp-website/js/main.js`
2. `/workspace/ai-corp-website/js/modules/i18n.js`
3. `/workspace/ai-corp-website/js/modules/animations.js`
4. `/workspace/ai-corp-website/js/modules/navigation.js`
5. `/workspace/ai-corp-website/js/modules/smoothScroll.js`
6. `/workspace/ai-corp-website/js/modules/validation.js`
7. `/workspace/ai-corp-website/js/i18n/ja.json` ✅
8. `/workspace/ai-corp-website/js/i18n/en.json` ✅
9. `/workspace/ai-corp-website/docs/js-architecture.md` ✅

---

## 次のアクション

1. boss1へ進捗報告（現在）
2. Worker1のHTML/CSS完了を待機
3. Worker1完了後、即座に実装フェーズ開始
4. 30分ごとに進捗報告

---

## 連絡先
- **担当**: Worker2
- **報告先**: boss1
- **協力**: Worker1（HTML/CSS）, Worker3（テスト・最適化）
