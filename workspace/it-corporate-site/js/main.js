/**
 * IT Corporate Site - Main JavaScript
 * モダンなES6+構文で実装されたインタラクション機能
 */

'use strict';

// ============================================
// ユーティリティ関数
// ============================================

/**
 * throttle関数 - スクロールイベント等のパフォーマンス最適化
 * @param {Function} callback - 実行する関数
 * @param {number} delay - 遅延時間（ms）
 * @returns {Function}
 */
const throttle = (callback, delay) => {
    let lastCall = 0;
    return (...args) => {
        const now = new Date().getTime();
        if (now - lastCall < delay) return;
        lastCall = now;
        callback(...args);
    };
};

/**
 * debounce関数 - リサイズイベント等のパフォーマンス最適化
 * @param {Function} callback - 実行する関数
 * @param {number} delay - 遅延時間（ms）
 * @returns {Function}
 */
const debounce = (callback, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback(...args), delay);
    };
};

// ============================================
// 1. スムーズスクロール
// ============================================

class SmoothScroll {
    constructor() {
        this.navLinks = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e));
        });
    }

    handleClick(e) {
        const href = e.currentTarget.getAttribute('href');

        // 同じページ内のリンクのみ処理
        if (href.startsWith('#') && href !== '#') {
            e.preventDefault();

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = 80; // 固定ヘッダーの高さ分
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // モバイルメニューが開いている場合は閉じる
                const mobileMenu = document.querySelector('.nav-menu');
                const menuToggle = document.querySelector('.nav-toggle');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    menuToggle?.classList.remove('active');
                    menuToggle?.setAttribute('aria-expanded', 'false');
                }
            }
        }
    }
}

// ============================================
// 2. スクロールアニメーション（フェードイン）
// ============================================

class ScrollAnimation {
    constructor() {
        this.sections = document.querySelectorAll('.fade-in-section');
        this.options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        this.init();
    }

    init() {
        if (!('IntersectionObserver' in window)) {
            // Intersection Observer未対応の場合は全要素を表示
            this.sections.forEach(section => {
                section.classList.add('fade-in');
            });
            return;
        }

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    // 一度アニメーションしたら監視を解除
                    this.observer.unobserve(entry.target);
                }
            });
        }, this.options);

        this.sections.forEach(section => {
            this.observer.observe(section);
        });
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// ============================================
// 3. 固定ヘッダー
// ============================================

class StickyHeader {
    constructor() {
        this.header = document.querySelector('.header');
        this.scrollThreshold = 100; // スクロール閾値
        this.init();
    }

    init() {
        if (!this.header) return;

        // スクロールイベントをthrottleで最適化
        window.addEventListener('scroll', throttle(() => {
            this.handleScroll();
        }, 100));

        // 初期状態をチェック
        this.handleScroll();
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > this.scrollThreshold) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
}

// ============================================
// 4. モバイルメニュー
// ============================================

class MobileMenu {
    constructor() {
        this.menuToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.body = document.body;
        this.init();
    }

    init() {
        if (!this.menuToggle || !this.navMenu) return;

        this.menuToggle.addEventListener('click', () => this.toggleMenu());

        // ESCキーでメニューを閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });

        // メニューリンククリック時にメニューを閉じる
        const navLinks = this.navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // メニュー外クリックで閉じる
        document.addEventListener('click', (e) => {
            if (this.navMenu.classList.contains('active') &&
                !this.navMenu.contains(e.target) &&
                !this.menuToggle.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        const isActive = this.navMenu.classList.toggle('active');
        this.menuToggle.classList.toggle('active');

        // aria属性更新
        const isExpanded = this.menuToggle.getAttribute('aria-expanded') === 'true';
        this.menuToggle.setAttribute('aria-expanded', !isExpanded);

        // bodyスクロール防止
        if (isActive) {
            this.body.style.overflow = 'hidden';
        } else {
            this.body.style.overflow = '';
        }
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.menuToggle.classList.remove('active');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.body.style.overflow = '';
    }
}

// ============================================
// 5. フォームバリデーション
// ============================================

class FormValidator {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.successMessage = document.querySelector('.form-success');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // リアルタイムバリデーション
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', debounce(() => {
                this.clearError(input);
            }, 300));
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        // 全フィールドをバリデーション
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            this.submitForm();
        } else {
            // 最初のエラー位置へスクロール
            const firstError = this.form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let error = '';

        // 必須項目チェック
        if (field.hasAttribute('required') && !value) {
            error = this.getRequiredErrorMessage(fieldName);
        }
        // メール形式チェック
        else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                error = '有効なメールアドレスを入力してください';
            }
        }
        // 最小文字数チェック
        else if (field.tagName === 'TEXTAREA' && value.length < 10) {
            error = 'メッセージは10文字以上入力してください';
        }

        this.showError(field, error);
        return !error;
    }

    getRequiredErrorMessage(fieldName) {
        const messages = {
            'name': 'お名前を入力してください',
            'email': 'メールアドレスを入力してください',
            'message': 'メッセージを入力してください'
        };
        return messages[fieldName] || 'この項目は必須です';
    }

    showError(field, message) {
        // errorクラスの追加/削除
        if (message) {
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');

            // エラーメッセージ表示
            let errorElement = field.parentElement.querySelector('.error-message');
            if (errorElement) {
                errorElement.textContent = message;
            }
        } else {
            this.clearError(field);
        }
    }

    clearError(field) {
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');

        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    submitForm() {
        // 送信ボタンを無効化
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = '送信中...';
        }

        // ダミーの送信処理（実際にはAPIコール）
        setTimeout(() => {
            // フォームを非表示
            this.form.style.display = 'none';

            // 成功メッセージを表示
            if (this.successMessage) {
                this.successMessage.classList.add('show');
            }

            // 3秒後にフォームをリセット
            setTimeout(() => {
                this.form.reset();
                this.form.style.display = '';
                if (this.successMessage) {
                    this.successMessage.classList.remove('show');
                }
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = '送信する';
                }
            }, 3000);
        }, 1000);
    }
}

// ============================================
// 6. ナビゲーションアクティブ状態
// ============================================

class ActiveNavigation {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.scrollThreshold = 0.5; // セクションの50%が表示されたらアクティブ
        this.init();
    }

    init() {
        if (!this.sections.length || !this.navLinks.length) return;

        // スクロールイベントをthrottleで最適化
        window.addEventListener('scroll', throttle(() => {
            this.updateActiveLink();
        }, 100));

        // 初期状態をチェック
        this.updateActiveLink();
    }

    updateActiveLink() {
        const scrollPosition = window.pageYOffset + 150; // ヘッダー分オフセット

        let currentSection = '';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop &&
                scrollPosition < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });

        // アクティブクラスを更新
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// ============================================
// 初期化
// ============================================

class App {
    constructor() {
        this.smoothScroll = null;
        this.scrollAnimation = null;
        this.stickyHeader = null;
        this.mobileMenu = null;
        this.formValidator = null;
        this.activeNavigation = null;

        this.init();
    }

    init() {
        // DOMが完全に読み込まれた後に初期化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeComponents();
            });
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        // 各機能クラスを初期化
        this.smoothScroll = new SmoothScroll();
        this.scrollAnimation = new ScrollAnimation();
        this.stickyHeader = new StickyHeader();
        this.mobileMenu = new MobileMenu();
        this.formValidator = new FormValidator();
        this.activeNavigation = new ActiveNavigation();

        console.log('🚀 All components initialized successfully');
    }
}

// アプリケーションを開始
const app = new App();
