#!/bin/bash
# Worker3完了時の即座タスク割り当てスクリプト

WORKSPACE="/home/is011/Claude-Code-Communication/workspace/election-report-2026"

echo "=== Worker3完了確認・次タスク割り当て ==="

# Worker3の成果物確認
if [ -f "$WORKSPACE/worker3/election-districts.md" ]; then
    echo "✅ Worker3完了確認: election-districts.md作成済"
    
    # PRESIDENTへの報告
    ./agent-send.sh president "【Worker3完了報告】$(date +%Y/%m/%d\ %H:%M)

Worker3の調査完了を確認しました。即座に次タスクを割り当てます。"
    
    # Worker3への次タスク割り当て
    ./agent-send.sh worker3 "【次タスク割り当て】boss1

調査完了、お疲れ様でした！即座に次タスクです。

【全体進捗更新】
✅ 選挙情勢調査 (Worker3) - 完了！
━━━━━━━━━━━━━━━━━
フェーズ1: 調査・情報収集 (9/9) 100% ✅
フェーズ2: レポート作成 (0/4) 開始中
総合進捗: 9/16タスク (56%) ↑

【次のタスク：最終レポート執筆】

担当セクション：
- セクション3：注目選挙区と情勢
- セクション5：今回選挙の論点と展望

【成果物】
$WORKSPACE/election-report.md（ドラフト版）

【執筆のポイント】
あなたが収集した選挙情勢データを活用
- 注目選挙区の具体名と情勢
- 世論調査の傾向
- 主要争点と政党立ち位置
- 今回選挙の最大論点
- 投票結果による政治構図の変化

【Worker1, Worker2との協業】
Worker1: 選挙概要セクション執筆中
Worker2: 政策比較セクション執筆中

3人で協力してレポートを完成させてください！

引き続きよろしくお願いします！"
    
    echo "✅ Worker3に次タスク割り当て完了"
    
else
    echo "⏳ Worker3未完了（election-districts.md未作成）"
    echo "5分後に再確認します..."
fi
