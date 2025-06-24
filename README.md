## Getting Started

First, run the development server:

```bash
bun dev
```

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


2. Save DB (手動)

```bash
bun scripts/export_card_data.ts
```

3. 画像を保存

```bash
bun src/migrate-images-to-supabase.ts
```

4. export json (after save DB)

```bash
bun scripts/export_card_data.ts
```