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

## ディレクトリ構成

### `/src/app/` - Next.js App Router
```
app/
├── (api)/                    # APIルート
│   └── auth/callback/        # Supabase認証コールバック
├── (authenticated)/          # 認証が必要なページ
│   ├── cards/[id]/          # カード詳細ページ
│   ├── decks/               # デッキ管理
│   │   ├── [id]/            # デッキ詳細・編集
│   │   └── _components/     # デッキ関連コンポーネント
│   ├── players/             # プレイヤー情報
│   ├── setting/             # ユーザー設定
│   └── socials/             # ソーシャル機能（フレンド・トレード）
├── (develop-only)/          # 開発・管理機能（本番では非表示）
│   ├── acquisition/         # データ取得・管理
│   └── edit/                # カード編集機能
├── (general)/               # パブリックページ
├── game/                    # ゲーム機能
├── login/                   # ログインページ
└── search/                  # カード検索
    └── _components/         # 検索関連コンポーネント
```

### `/src/components/` - 再利用可能コンポーネント
```
components/
├── layout/                  # レイアウト関連
│   ├── header.tsx           # ヘッダーコンポーネント
│   ├── footer.tsx           # フッターコンポーネント
│   └── dev-command.tsx      # 開発コマンドパレット
├── search-form/             # 検索フォーム関連
│   ├── card-type-form.tsx   # カードタイプ選択
│   ├── pokemon-type-form.tsx # ポケモンタイプ選択
│   ├── rarity-form.tsx      # レアリティ選択
│   └── ...                  # その他フィルター関連
├── ui/                      # Radix UIベースの基本コンポーネント
│   ├── button.tsx           # ボタンコンポーネント
│   ├── form.tsx             # フォームコンポーネント
│   ├── dialog.tsx           # モーダルダイアログ
│   └── ...                  # その他UIコンポーネント
└── icons/                   # カスタムアイコン
```

### `/src/constants/` - 定数・データ
```
constants/
├── data/                    # カードデータ
│   ├── all_cards.json       # 全カードデータ（統合済み）
│   ├── converted/           # 変換済みデータ（シリーズ別）
│   ├── scraped/             # スクレイピング生データ
│   └── pokemon_names.json   # ポケモン名データ
├── types/                   # 型定義
│   ├── acquisition.ts       # データ取得関連の型
│   ├── pokemon-types.ts     # ポケモンタイプ定義
│   └── rarities.ts          # レアリティ定義
└── series.json              # シリーズ情報
```

### `/src/utils/` - ユーティリティ関数
```
utils/
├── use-filtered-cards.ts    # カードフィルタリングロジック
├── use-search-query.ts      # 検索クエリ管理
├── crypto.ts                # 暗号化関連
└── classnames.ts            # CSS クラス名操作
```

### `/src/libs/` - 外部ライブラリ設定
```
libs/
├── prisma/                  # Prisma設定
│   └── client.ts            # Prismaクライアント設定
└── supabase/                # Supabase設定
    ├── client.ts            # クライアントサイド設定
    ├── server.ts            # サーバーサイド設定
    └── auth.ts              # 認証設定
```

### `/scripts/` - データ処理スクリプト
```
scripts/
├── get_data.py              # カードデータスクレイピング
├── convert_card_data.py     # データ変換処理
├── get_data_ja.py           # 日本語データ追加
├── export_card_data.ts      # データベースからJSONエクスポート
├── run_all_scripts.sh       # 全スクリプト実行
└── target/                  # スクレイピング対象HTMLファイル
```

### 重要なファイル
- `prisma/schema.prisma` - データベーススキーマ定義
- `src/generated/prisma/` - Prismaが生成する型安全クライアント
- `src/middleware.ts` - Next.js ミドルウェア（認証チェック）
- `biome.json` - Biome設定（フォーマット・リント）
- `next.config.ts` - Next.js設定