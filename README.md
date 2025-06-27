## Getting Started

First, run the development server:

```bash
bun dev
```

## Update Manual
1. edit `src/constants/series.json`, `src/constants/types/acquisition.ts`
2. add `scripts/target/ja-{SERIES}.html`
3. `scripts/run_all_scripts.sh`
4. edit `src/constants/data/converted/index.ts`
5. edit new words at `src/constants/data/pokemon_names.json`
6. `bun dev`
7. `bun src/migrate-images-to-supabase.ts`
8. `bun scripts/export_card_data.ts`

## Generate Data

1. scraping & converting

```bash
scripts/run_all_scripts.sh
```

or

```bash
source ./venv/bin/activate && python3 scripts/get_data.py && python3 scripts/convert_card_data.py && python3 scripts/get_data_ja.py
```

初期設定→scraping→converting→日本語対応


2. Save DB (Manual)

```bash
bun dev
```

3. 画像を保存

```bash
bun src/migrate-images-to-supabase.ts
```

4. export json (after save DB)

```bash
bun scripts/export_card_data.ts
```