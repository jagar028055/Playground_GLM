#!/bin/bash
# 進捗チェックスクリプト

WORKSPACE="/home/is011/Claude-Code-Communication/workspace/election-report-2026"

echo "=== プロジェクトステータス $(date) ==="
echo ""

# Workerごとの成果物チェック
echo "## Worker成果物状況"
echo "Worker1 (政党公約調査):"
if [ -f "$WORKSPACE/worker1/party-manifestos.md" ]; then
    echo "  ✅ party-manifestos.md 作成済"
    ls -lh "$WORKSPACE/worker1/party-manifestos.md" | awk '{print "     サイズ: " $5}'
else
    echo "  🔄 未完了"
fi

echo ""
echo "Worker2 (政策比較分析):"
if [ -f "$WORKSPACE/worker2/policy-comparison.md" ]; then
    echo "  ✅ policy-comparison.md 作成済"
    ls -lh "$WORKSPACE/worker2/policy-comparison.md" | awk '{print "     サイズ: " $5}'
else
    echo "  🔄 未完了"
fi

echo ""
echo "Worker3 (選挙情勢調査):"
if [ -f "$WORKSPACE/worker3/election-districts.md" ]; then
    echo "  ✅ election-districts.md 作成済"
    ls -lh "$WORKSPACE/worker3/election-districts.md" | awk '{print "     サイズ: " $5}'
else
    echo "  🔄 未完了"
fi

echo ""
echo "## 全体進捗"
if [ -f "$WORKSPACE/TASK_QUEUE.md" ]; then
    tail -7 "$WORKSPACE/TASK_QUEUE.md"
fi

echo ""
echo "## 最終成果物"
if [ -f "$WORKSPACE/election-report.md" ]; then
    echo "  ✅ election-report.md 作成済"
    ls -lh "$WORKSPACE/election-report.md" | awk '{print "     サイズ: " $5}'
else
    echo "  ⏳ 未作成"
fi
