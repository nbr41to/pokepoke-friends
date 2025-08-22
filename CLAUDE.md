# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリのコードを扱う際のガイダンスを提供します。

## 開発コマンド

### 開発サーバー
```bash
bun dev        # Turbopackを使った開発サーバーの起動
```

### ビルドとテスト
```bash
bun build      # プロダクション用ビルド
bun start      # プロダクションサーバーの起動
bun lint       # Next.jsリンティング（Biome設定を使用）
```

### コード品質
Biomeがフォーマットとリンティングに設定されています：
- JavaScript/CSSでシングルクォートを使用
- スペースインデント
- `noConsole`ルールは`console.error`と`console.info`のみ許可
- 未使用のインポートはエラーとして扱われます

### データ管理ワークフロー

#### 完全なデータ更新プロセス
新しいシリーズを追加する場合（READMEのマニュアルに従う）：
1. `src/constants/series.json`と`src/constants/types/acquisition.ts`を編集
2. `scripts/target/ja-{SERIES}.html`に新しいHTMLファイルを追加
3. データ生成を実行：`scripts/run_all_scripts.sh`
4. `src/constants/data/converted/index.ts`を更新
5. `src/constants/data/pokemon_names.json`に新しいポケモン名を追加
6. 開発サーバーを起動：`bun dev`
7. 画像を移行：`bun src/migrate-images-to-supabase.ts`
8. カードデータをエクスポート：`bun scripts/export_card_data.ts`

#### データ生成スクリプト
```bash
scripts/run_all_scripts.sh    # 完全なデータ生成パイプライン
# または個別に実行：
source ./venv/bin/activate && python3 scripts/get_data.py && python3 scripts/convert_card_data.py && python3 scripts/get_data_ja.py
```

### データベース操作
```bash
bun src/migrate-images-to-supabase.ts    # カード画像をSupabaseストレージにアップロード
bun scripts/export_card_data.ts          # DB保存後にカードデータをJSONにエクスポート
```

## アーキテクチャ概要

### 技術スタック
- **フレームワーク**: Next.js 15 with App Router and Turbopack
- **ランタイム**: Bun
- **データベース**: PostgreSQL with Prisma ORM
- **認証**: Supabase Auth
- **ストレージ**: Supabase Storage（カード画像用）
- **UI**: Radix UIコンポーネント with Tailwind CSS
- **状態管理**: nuqs（URL状態管理用）
- **フォーム**: React Hook Form with Zod validation

### コアデータモデル（Prisma）

#### Cardモデル
ポケモンTCGカードの包括的な属性を表現：
- 基本情報：`id`、`numbering`、`name`、`rarity`、`image`、`cardType`
- ポケモン固有：`hp`、`type`、`evolveStage`、技（1-2個）、`abilityName`
- バトルメカニクス：`retreat`、`weakness`
- 生成されたPrismaクライアントは`src/generated/prisma`に出力

#### Playerモデル
フレンドシステム付きのユーザーアカウント：
- プレイヤー接続用の`friendId`
- セキュリティ強化のための`secretWord`

### プロジェクト構造パターン

#### App Router構成
- `(authenticated)` - ログインが必要なルート
- `(api)` - APIルートハンドラー
- `(general)` - パブリックルート
- `(develop-only)` - 開発/管理機能

#### データパイプライン
1. **スクレイピング**: Pythonスクリプトが外部ソースからカードデータを取得
2. **変換**: 生のHTMLデータを構造化されたJSONに変換
3. **ローカライゼーション**: `get_data_ja.py`で日本語翻訳を追加
4. **データベース**: 開発インターフェースを通じた手動保存プロセス
5. **ストレージ**: 移行スクリプト経由でSupabaseに画像をアップロード
6. **エクスポート**: 最適化された読み込み用の最終JSON出力

#### 検索・フィルタリングシステム
複数フィルターによる複雑なカード検索：
- フォームコンポーネント：`src/components/search-form/`
- カスタムフック：`use-filtered-cards.ts`、`use-search-query.ts`
- nuqs経由のURL状態管理

### 外部サービス
- **画像ソース**: gamewith.jp、altema.jp（Next.jsで設定）
- **Supabase**: 認証、データベース、ファイルストレージ
- **データソース**: ポケモンTCGサイトからのWebスクレイピング

### 開発機能
- 開発コマンドパレット（`DevCommand`コンポーネント）
- Turbopackによるホットリロード
- 生成されたPrismaクライアントによる型安全API
- モバイル最適化されたビューポート設定