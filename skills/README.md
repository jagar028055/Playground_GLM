# README - Skills for Agent Communication System

## Overview
このSkillsディレクトリには、President、boss1、Workers間の効果的なコミュニケーションとタスク管理のための再利用可能なスキル定義が含まれています。

## Available Skills

### 1. delegate-research-project
Presidentがboss1に研究・分析プロジェクトを委任するためのSkill

**使用例**:
```
/delegate-research-project "Microsoft投資分析" "2026/01/31 13:00" "最新決算分析と投資判断"
```

**主な機能**:
- boss1へのタスク委任
- 明確な納期と成果物の指定
- Workersの役割分担の定義

### 2. manage-research-team
boss1がWorkersを管理して並行作業を実行するためのSkill

**使用例**:
```
/manage-research-team "microsoft-analysis" "2026/01/31 13:00"
```

**主な機能**:
- Worker1（調査担当）への割り当て
- Worker2（執筆担当）への割り当て
- Worker3（チャート担当）への割り当て
- 品質管理プロセス
- 進捗モニタリング

### 3. check-project-status
プロジェクトの進捗状況を確認するためのSkill

**使用例**:
```
/check-project-status
```

**主な機能**:
- Workersの状態確認
- 進捗率の表示
- ボトルネック検出

### 4. quality-assurance-check
boss1がプロジェクト完了前に実施する品質チェックリスト

**使用例**:
```
/quality-assurance-check "microsoft-analysis-report-v2"
```

**主な機能**:
- 情報の正確性チェック
- データの整合性確認
- 投資判断の具体性確認

### 5. send-progress-report
定期的な進捗報告を送信するためのSkill

**使用例**:
```
/send-progress-report "completed" "全Workers完了、品質チェック済み"
```

**主な機能**:
- タスク割当完了報告
- Workers完了報告
- データ共有完了報告
- 品質チェック完了報告

## Workflow Example

### 典型的な研究プロジェクトのフロー

```
[1] President
    ↓ /delegate-research-project
[2] boss1（タスク分解）
    ↓ /manage-research-team
[3] Workers（並行作業）
    ↓ Worker1完了
[4] boss1（データ共有）
    ↓ Workers継続
[5] /send-progress-report "in-progress"
    ↓ 全Workers完了
[6] /quality-assurance-check
    ↓ /send-progress-report "completed"
[7] President（最終確認）
```

## Best Practices

### Presidentへの推奨事項
1. 2時間以上のタスクはboss1に委任
2. 明確な納期と成果物を指定
3. 30分ごとの進捗報告を求める
4. 完了後のフィードバックを提供

### boss1への推奨事項
1. 適切なタスク分解と見積もり
2. Workersへの明確な指示
3. 15-30分ごとの進捗監視
4. 品質チェックを厳格に実施

### Workersへの推奨事項
1. 自律的な作業
2. 30分ごとの進捗報告
3. ブロッカーの即座報告
4. 高品質な成果物の提出

## File Structure

```
skills/
├── README.md                          （このファイル）
├── delegate-research-project.skill     （委任スキル）
├── manage-research-team.skill          （管理スキル）
├── check-project-status.skill          （ステータス確認）
├── quality-assurance-check.skill      （品質チェック）
└── send-progress-report.skill         （進捗報告）
```

## Version History
- **v1.0** (2026-01-31): 初版リリース
  - Microsoft投資分析プロジェクトで実証されたフローをSkill化
  - 5つの基本スキルを定義

## Contributing
新しいプロジェクトで成功したパターンは、適宜Skillとして追加してください。

## Support
問題や質問がある場合は、以下に連絡してください：
- President: `/agent-send.sh president "[メッセージ]"`
- boss1: `/agent-send.sh boss1 "[メッセージ]"`
