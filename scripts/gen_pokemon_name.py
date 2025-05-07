#!/usr/bin/env python3
"""
Build pokemon_en_ja.json – English/Japanese name map for *all* current Pokémon.
© Pokémon / Nintendo / Game Freak.  Data pulled from PokeAPI.
"""

import json, sys, time, pathlib
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

API_ROOT = "https://pokeapi.co/api/v2"
OUTFILE  = pathlib.Path("pokemon_names.json")
MAX_ID   = 1025            # Pecharunt (#1025) まで対応 – 2025-05-07 時点
WORKERS  = 20              # 同時接続数。環境に合わせて調整可

def fetch_species(species_id: int) -> dict[str, str]:
    """1 匹ぶんの {en, ja} を取得して返す。"""
    url = f"{API_ROOT}/pokemon-species/{species_id}/"
    for retry in range(3):
        try:
            r = requests.get(url, timeout=10)
            r.raise_for_status()
            names = r.json()["names"]
            en = next(n["name"] for n in names if n["language"]["name"] == "en")
            ja = next(n["name"] for n in names if n["language"]["name"] == "ja-Hrkt")
            return {"ja": ja, "en": en}
        except Exception as e:
            if retry == 2:
                print(f"[WARN] id {species_id}: {e}", file=sys.stderr)
            else:
                time.sleep(1)  # 軽く待ってリトライ

def main():
    data = []
    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        futures = {pool.submit(fetch_species, i): i for i in range(1, MAX_ID + 1)}
        for f in as_completed(futures):
            result = f.result()
            if result:
                data.append(result)
    # Pokédex 順に並べ直し
    data.sort(key=lambda x: x["en"])   # en は Pokédex 順で返るので sort で確実に
    OUTFILE.write_text(json.dumps(data, ensure_ascii=False, indent=2))
    print(f"✅ 生成完了 → {OUTFILE.resolve()}  ({len(data)} entries)")

if __name__ == "__main__":
    main()