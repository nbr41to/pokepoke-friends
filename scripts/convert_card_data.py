#!/usr/bin/env python3
# encoding: utf-8

import json
import re
import sys
from pathlib import Path
from typing import Dict, Optional, Any


# ポケモンタイプのマッピング
POKEMON_TYPE_MAPPING = {
    "Grass": "grass",
    "Fire": "fire",
    "Water": "water",
    "Lightning": "electric",
    "Psychic": "psychic",
    "Fighting": "fighting",
    "Darkness": "darkness",
    "Metal": "steel",
    "Dragon": "dragon",
    "Colorless": "normal"
}

# 進化段階のマッピング
EVOLVE_STAGE_MAPPING = {
    "Basic": "base",
    "Stage 1": "stage1",
    "Stage 2": "stage2"
}

# トレーナーカードのタイプマッピング
TRAINER_TYPE_MAPPING = {
    "Item": "trainers-goods",
    "Supporter": "trainers-support",
    "Pokémon Tool": "trainers-pokemon-tools",
}

# レア度のマッピング
RARITY_MAPPING = {
    # ダイヤ系レア
    "◊": "d1",       # 1ダイヤ
    "◊◊": "d2",      # 2ダイヤ
    "◊◊◊": "d3",     # 3ダイヤ
    "◊◊◊◊": "d4",    # 4ダイヤ
    # スター系レア
    "☆": "s1",       # 1スター
    "☆☆": "s2",      # 2スター
    "☆☆☆": "s3",     # 3スター
    # その他のレア
    "Crown Rare": "crown",    # クラウン
}

# 変換対象のシリーズリスト（デフォルト）
DEFAULT_SERIES_LIST = ["A1", "A1a", "A2", "A2a", "A2b", "A3", "P-A"]

def convert_pokemon_type(pokemon_type: str) -> str:
    """ポケモンタイプを変換する"""
    return POKEMON_TYPE_MAPPING.get(pokemon_type, "normal")

def convert_evolve_stage(evolve_stage: str) -> str:
    """進化段階を変換する"""
    return EVOLVE_STAGE_MAPPING.get(evolve_stage, "base")

def convert_rarity(rarity: str) -> str:
    """レア度を CardRarity 型に変換する"""
    # マッピングにある場合はそれを返す
    # ない場合は元の値をそのまま返す（このあとCardRarity型にマッチするか処理される）
    return RARITY_MAPPING.get(rarity, rarity)

def convert_damage_to_power(damage: Optional[str]) -> Optional[int]:
    """ダメージ文字列をパワー数値に変換する"""
    if damage is None:
        return None
    # 数値部分のみを抽出
    match = re.search(r'^(\d+)', damage)
    if match:
        return int(match.group(1))
    return None

def extract_trainer_description(card: Dict[str, Any]) -> str:
    """トレーナーカードの説明文を抽出する"""
    # スクレイピングされたdescriptionがあれば、それを使用
    if card.get('description'):
        return card.get('description')
    # なければ仮の説明を返す
    return f"{card.get('name')}のトレーナーカード効果"

def convert_card_data(source_file: str, target_file: str) -> None:
    """カードデータを変換する"""
    # JSONファイルを読み込む
    with open(source_file, 'r', encoding='utf-8') as f:
        cards_data = json.load(f)

    converted_cards = []
    card_id = 1  # 連番ID

    for card in cards_data:
        # 基本情報
        card_base = {
            "id": card_id,
            "cardNumber": card.get('numbering', ''),
            "name": card.get('name', ''),
            "nameEn": card.get('name', ''),  # 英語名は元データと同じにする
            "rarity": convert_rarity(card.get('rarity', '')),
            "image": card.get('image', ''),
        }

        # カードタイプを判別
        card_type = card.get('card_type', '')
        if card_type == 'Pokémon':
            # ポケモンカード
            pokemon_card = {
                **card_base,
                "cardType": "pokemon",
                "hp": card.get('hp', 0),
                "type": convert_pokemon_type(card.get('pokemon_type', 'Colorless')),
                "evolveStage": convert_evolve_stage(card.get('evole_stage', 'Basic')),
                "retreat": card.get('retreat', 0),
                "weakness": convert_pokemon_type(card.get('weakness', None)) if card.get('weakness') else None,
                "abilityName": card.get('ability_name'),
                "abilityDescription": card.get('ability_description')
            }

            # 技の情報を処理
            attacks = card.get('attacks', [])
            if attacks and len(attacks) > 0:
                # わざ1
                pokemon_card["move1name"] = attacks[0].get('name', '')
                pokemon_card["move1energy"] = attacks[0].get('energy', '')
                pokemon_card["move1power"] = convert_damage_to_power(attacks[0].get('damage'))
                pokemon_card["move1description"] = attacks[0].get('description')

                # わざ2（ある場合）
                if len(attacks) > 1:
                    pokemon_card["move2name"] = attacks[1].get('name', '')
                    pokemon_card["move2energy"] = attacks[1].get('energy', '')
                    pokemon_card["move2power"] = convert_damage_to_power(attacks[1].get('damage'))
                    pokemon_card["move2description"] = attacks[1].get('description')
                else:
                    pokemon_card["move2name"] = None
                    pokemon_card["move2energy"] = None
                    pokemon_card["move2power"] = None
                    pokemon_card["move2description"] = None
            else:
                # わざがない場合
                pokemon_card["move1name"] = ""
                pokemon_card["move1energy"] = ""
                pokemon_card["move1power"] = None
                pokemon_card["move1description"] = None
                pokemon_card["move2name"] = None
                pokemon_card["move2energy"] = None
                pokemon_card["move2power"] = None
                pokemon_card["move2description"] = None

            converted_cards.append(pokemon_card)
        else:
            # トレーナーカード
            trainer_card = {
                **card_base,
                "cardType": TRAINER_TYPE_MAPPING.get(card.get('evole_stage', 'Item'), 'trainers-goods'),
                "description": extract_trainer_description(card)
            }
            converted_cards.append(trainer_card)

        card_id += 1

    # 変換結果を書き出し
    with open(target_file, 'w', encoding='utf-8') as f:
        json.dump(converted_cards, f, ensure_ascii=False, indent=2)

    print(f"{len(converted_cards)}枚のカードを変換しました。出力ファイル: {target_file}")

def process_series(series_id: str, script_dir: Path) -> None:
    """指定されたシリーズIDのカードデータを変換する"""
    source_file = script_dir / f"../src/constants/data/scraped/{series_id}.json"
    target_file = script_dir / f"../src/constants/data/converted/{series_id}.json"
    
    # ソースファイルが存在するか確認
    if not source_file.exists():
        print(f"警告: {series_id}のソースファイルが見つかりません: {source_file}")
        return False
    
    # ディレクトリがなければ作成
    target_file.parent.mkdir(parents=True, exist_ok=True)
    
    try:
        convert_card_data(str(source_file), str(target_file))
        return True
    except Exception as e:
        print(f"{series_id}の変換中にエラーが発生しました: {e}")
        return False

if __name__ == "__main__":
    # 実行パス
    script_dir = Path(__file__).parent
    
    # コマンドライン引数からシリーズリストを取得（引数がなければデフォルトを使用）
    series_list = sys.argv[1:] if len(sys.argv) > 1 else DEFAULT_SERIES_LIST
    
    # 出力先ディレクトリを作成
    converted_dir = script_dir / "../src/constants/data/converted"
    converted_dir.mkdir(parents=True, exist_ok=True)
    
    # 各シリーズを処理
    print(f"変換対象シリーズ: {', '.join(series_list)}")
    success_count = 0
    
    for series_id in series_list:
        print(f"[{series_list.index(series_id) + 1}/{len(series_list)}] {series_id}のカードデータを変換中...")
        if process_series(series_id, script_dir):
            success_count += 1
    
    print(f"変換が完了しました！{success_count}/{len(series_list)}シリーズのデータを変換しました。")
    
    # A1.jsonを以前と同じ場所にも出力（後方互換性のため）
    a1_source = script_dir / "../src/constants/data/converted/A1.json"
    a1_legacy = script_dir / "../src/constants/data/A1.json"
    
    if a1_source.exists():
        import shutil
        shutil.copy(str(a1_source), str(a1_legacy))
        print(f"A1のデータを互換性のために {a1_legacy} にもコピーしました。")