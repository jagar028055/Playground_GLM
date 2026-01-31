#!/bin/bash
# 🎯 Skill Creator Wrapper Script
# anthropics/skills の skill-creator を簡単に使用するためのラッパー

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_CREATOR_DIR="$SCRIPT_DIR/skills/skill-creator"
INIT_SCRIPT="$SKILL_CREATOR_DIR/scripts/init_skill.py"
PACKAGE_SCRIPT="$SKILL_CREATOR_DIR/scripts/package_skill.py"
VALIDATE_SCRIPT="$SKILL_CREATOR_DIR/scripts/quick_validate.py"

show_usage() {
    cat << EOF
🎯 Skill Creator - Claude Skills 作成ツール

使用方法:
  $0 [command] [arguments]

コマンド:
  init <skill-name>          新しいスキルを作成
  package <skill-path>        スキルをパッケージ化 (.skillファイル作成)
  validate <skill-path>       スキルを検証

使用例:
  # 新しいスキルを作成 (skills/ディレクトリに作成)
  $0 init my-awesome-skill

  # 特定のディレクトリにスキルを作成
  $0 init my-skill --path /path/to/skills

  # スキルをパッケージ化
  $0 package skills/my-awesome-skill

  # スキルを検証
  $0 validate skills/my-awesome-skill

スキルの名前規則:
  - 小文字の英数字とハイフンのみ (例: data-analyzer, api-helper)
  - 最大40文字
  - ハイフン区切り (kebab-case)

詳細:
  - SKILL.md: $SKILL_CREATOR_DIR/SKILL.md
  - サンプル: $SKILL_CREATOR_DIR/references/
EOF
}

# コマンドチェック
if [[ $# -eq 0 ]]; then
    show_usage
    exit 1
fi

command="$1"
shift

case "$command" in
    "init")
        if [[ $# -lt 1 ]]; then
            echo "❌ エラー: スキル名を指定してください"
            echo "使用方法: $0 init <skill-name> [--path <path>]"
            exit 1
        fi

        skill_name="$1"
        output_path="${3:-$SCRIPT_DIR/skills}"

        echo "🚀 新しいスキルを作成します: $skill_name"
        echo "   出力先: $output_path"
        echo ""

        if [[ ! -f "$INIT_SCRIPT" ]]; then
            echo "❌ エラー: init_skill.py が見つかりません"
            echo "   パス: $INIT_SCRIPT"
            exit 1
        fi

        python3 "$INIT_SCRIPT" "$skill_name" --path "$output_path"
        ;;

    "package")
        if [[ $# -lt 1 ]]; then
            echo "❌ エラー: スキルのパスを指定してください"
            echo "使用方法: $0 package <skill-path>"
            exit 1
        fi

        skill_path="$1"

        echo "📦 スキルをパッケージ化します: $skill_path"
        echo ""

        if [[ ! -f "$PACKAGE_SCRIPT" ]]; then
            echo "❌ エラー: package_skill.py が見つかりません"
            echo "   パス: $PACKAGE_SCRIPT"
            exit 1
        fi

        python3 "$PACKAGE_SCRIPT" "$skill_path"
        ;;

    "validate")
        if [[ $# -lt 1 ]]; then
            echo "❌ エラー: スキルのパスを指定してください"
            echo "使用方法: $0 validate <skill-path>"
            exit 1
        fi

        skill_path="$1"

        echo "✅ スキルを検証します: $skill_path"
        echo ""

        if [[ ! -f "$VALIDATE_SCRIPT" ]]; then
            echo "❌ エラー: quick_validate.py が見つかりません"
            echo "   パス: $VALIDATE_SCRIPT"
            exit 1
        fi

        python3 "$VALIDATE_SCRIPT" "$skill_path"
        ;;

    "--help"|"help"|"h"|"-h")
        show_usage
        exit 0
        ;;

    *)
        echo "❌ エラー: 不明なコマンド '$command'"
        echo ""
        show_usage
        exit 1
        ;;
esac
