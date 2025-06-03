This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
bun dev
```

## Generate Data

```bash
scripts/run_all_scripts.sh
```

or

```bash
source ./venv/bin/activate && python3 scripts/get_data.py && python3 scripts/convert_card_data.py && python3 scripts/get_data_ja.py
```

0.create basic data

```bash
source ./venv/bin/activate
```

1.scraping

```bash
python3 scripts/get_data.py
```

2.converting

```bash
python3 scripts/convert_card_data.py
```

3.export json (after save DB)

```bash
bun scripts/export_card_data.ts
```