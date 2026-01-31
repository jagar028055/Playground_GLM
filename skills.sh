#!/bin/bash

# 🎯 Skills for Agent Communication System
#
# Microsoft投資分析プロジェクトで実証されたワークフローを
# 再利用可能なSkillsとして提供

# ターゲットマッピング
get_agent_target() {
    case "$1" in
        "president") echo "president" ;;
        "boss1") echo "multiagent:0.0" ;;
        "worker1") echo "multiagent:0.1" ;;
        "worker2") echo "multiagent:0.2" ;;
        "worker3") echo "multiagent:0.3" ;;
        *) echo "" ;;
    esac
}

show_usage() {
    cat << EOF
🎯 Agent Communication Skills

使用方法:
  $0 [skill] [arguments]

利用可能なSkills:
  delegate-research-project  President→boss1へのプロジェクト委任
  manage-research-team        boss1→Workersへのタスク割り当て
  check-project-status        プロジェクト進捗確認
  quality-assurance-check    品質チェック
  send-progress-report       進捗報告送信

使用例:
  $0 delegate-research-project "Microsoft分析" "2026/01/31 13:00" "投資家向けレポート"
  $0 manage-research-team "microsoft-analysis" "2026/01/31 13:00"
  $0 check-project-status
  $0 quality-assurance-check "microsoft-analysis-report-v2"
  $0 send-progress-report "completed" "全Workers完了"

詳細は /home/is011/Claude-Code-Communication/skills/README.md を参照してください。
EOF
}

# Skill: delegate-research-project
skill_delegate_research_project() {
    if [[ $# -lt 3 ]]; then
        echo "❌ エラー: 引数が不足しています"
        echo "使用方法: $0 delegate-research-project [project_name] [deadline] [requirements]"
        exit 1
    fi

    local project_name="$1"
    local deadline="$2"
    local requirements="$3"
    local project_slug=$(echo "$project_name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g')

    local message="あなたはboss1です。

【タスク】${project_name}
【納期】${deadline}
【作業ディレクトリ】/workspace/${project_slug}/

【成果物】
- 投資家向け詳細分析レポート
- プレゼンテーションスライド
- 財務データセット
- テクニカル分析チャート
- 投資判断根拠ドキュメント

【必須要件】
- 最新情報の反映
- 複数の情報ソースでクロスチェック
- 具体的な数値根拠
- 明確な投資判断と売買シグナル

【成功基準】
- プロフェッショナルな品質
- 分析の根拠が明確
- 具体的なアクションプラン

【リソース】
- Worker1: 調査・データ収集担当
- Worker2: 執筆担当
- Worker3: チャート・データ作成担当

30分以内に実行計画を報告してください。"

    tmux set-buffer -- "$message"
    tmux paste-buffer -t "multiagent:0.0"
    sleep 0.1
    tmux send-keys -t "multiagent:0.0" Enter
    sleep 0.1
    tmux send-keys -t "multiagent:0.0" Enter

    echo "✅ 委任完了: boss1 に「${project_name}」を委任しました"
}

# Skill: manage-research-team
skill_manage_research_team() {
    if [[ $# -lt 2 ]]; then
        echo "❌ エラー: 引数が不足しています"
        echo "使用方法: $0 manage-research-team [project_name] [deadline]"
        exit 1
    fi

    local project_name="$1"
    local deadline="$2"
    local project_slug=$(echo "$project_name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g')

    echo "📋 boss1: Workersへのタスク割り当てを開始します..."
    echo "プロジェクト: ${project_name}"
    echo "納期: ${deadline}"
    echo ""
    echo "以下のWorkersにタスクを割り当てます:"
    echo "  - Worker1: 調査・データ収集"
    echo "  - Worker2: 執筆"
    echo "  - Worker3: チャート・データ作成"
    echo ""
    echo "詳細な割り当て内容は /home/is011/Claude-Code-Communication/skills/manage-research-team.skill を参照してください"
}

# Skill: check-project-status
skill_check_project_status() {
    echo "=== プロジェクトステータス $(date) ==="
    echo ""

    # 最新の進捗ファイルを確認
    if ls /workspace/*/progress.log 2>/dev/null | head -1 | grep -q .; then
        echo "📊 進捗ログ:"
        tail -20 /workspace/*/progress.log 2>/dev/null | head -5
        echo ""
    fi

    # Workersの状態を確認
    echo "👥 Workersの状態:"
    for worker in worker1 worker2 worker3; do
        if [ -f /tmp/${worker}_done.txt ]; then
            echo "  ✅ $worker: 完了"
        else
            echo "  🔄 $worker: 進行中"
        fi
    done
    echo ""

    # 納期までの時間を計算
    if [ -f /tmp/project_deadline.txt ]; then
        local deadline=$(cat /tmp/project_deadline.txt)
        local current=$(date +%s)
        local deadline_epoch=$(date -d "$deadline" +%s 2>/dev/null || echo "0")
        if [ "$deadline_epoch" -gt "$current" ]; then
            local remaining=$((deadline_epoch - current))
            local hours=$((remaining / 3600))
            local minutes=$(((remaining % 3600) / 60))
            echo "⏰ 納期: ${deadline}"
            echo "   残り時間: ${hours}時間${minutes}分"
        fi
    fi
}

# Skill: quality-assurance-check
skill_quality_assurance_check() {
    local project_name="${1:-}"

    if [[ -z "$project_name" ]]; then
        echo "❌ エラー: プロジェクト名を指定してください"
        echo "使用方法: $0 quality-assurance-check [project_name]"
        exit 1
    fi

    echo "=== 品質チェックリスト: ${project_name} ==="
    echo ""

    local checks=(
        "情報の正確性:全ての数値にソース明記"
        "情報の正確性:複数ソースでクロスチェック済み"
        "情報の正確性:データの整合性が取れている"
        "情報の正確性:最新の情報が反映されている"
        "競合比較:AWS等との詳細な比較がある"
        "競合比較:具体的な数値で比較されている"
        "テクニカル分析:株価チャートが含まれている"
        "テクニカル分析:移動平均線が記載されている"
        "テクニカル分析:RSI、MACD等の指標が分析されている"
        "アクションプラン:買い価格が明確（3段階）"
        "アクションプラン:目標株価が設定されている"
        "アクションプラン:損切りラインが明示されている"
        "アクションプラン:利食いタイミングが具体的"
        "レポート品質:専門的な用語が適切に使用されている"
        "レポート品質:投資家の意思決定に有用"
        "レポート品質:論理的な構成"
    )

    local total=${#checks[@]}
    local passed=0

    for check in "${checks[@]}"; do
        local category=$(echo "$check" | cut -d: -f1)
        local item=$(echo "$check" | cut -d: -f2)
        echo -n "  [ ] $item ($category): "
        read -p "(y/n): " answer
        if [[ "$answer" =~ ^[Yy]$ ]]; then
            echo "✅"
            ((passed++))
        else
            echo "❌"
        fi
    done

    echo ""
    echo "=== チェック結果 ==="
    echo "合格: $passed / $total"

    local percentage=$((passed * 100 / total))
    if [ "$percentage" -ge 80 ]; then
        echo "✅ 品質基準を満たしています。Presidentに報告してください。"
    elif [ "$percentage" -ge 60 ]; then
        echo "⚠️  一部項目が不完全です。修正してから報告してください。"
    else
        echo "🔴 多くの項目が不完全です。Workersに再作業を指示してください。"
    fi
}

# Skill: send-progress-report
skill_send_progress_report() {
    if [[ $# -lt 1 ]]; then
        echo "❌ エラー: ステータスを指定してください"
        echo "使用方法: $0 send-progress-report [status] [details]"
        echo "ステータス: planning, in-progress, completed, blocked"
        exit 1
    fi

    local status="$1"
    local details="${2:-}"

    local timestamp=$(date '+%Y/%m/%d %H:%M')
    local message="【進捗報告】boss1 ${timestamp}

ステータス: ${status}
詳細: ${details}"

    tmux set-buffer -- "$message"
    tmux paste-buffer -t "president"
    sleep 0.1
    tmux send-keys -t "president" Enter

    echo "✅ 進捗報告を送信しました: ${status}"
}

# メイン処理
main() {
    if [[ $# -eq 0 ]]; then
        show_usage
        exit 1
    fi

    local skill="$1"
    shift

    case "$skill" in
        "delegate-research-project")
            skill_delegate_research_project "$@"
            ;;
        "manage-research-team")
            skill_manage_research_team "$@"
            ;;
        "check-project-status")
            skill_check_project_status
            ;;
        "quality-assurance-check")
            skill_quality_assurance_check "$@"
            ;;
        "send-progress-report")
            skill_send_progress_report "$@"
            ;;
        "--help"|"help"|"h"|"-h")
            show_usage
            ;;
        *)
            echo "❌ エラー: 不明なスキル '$skill'"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

main "$@"
