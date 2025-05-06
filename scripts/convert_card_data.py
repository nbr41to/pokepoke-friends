#!/usr/bin/env python3
# encoding: utf-8

import json
import re
from pathlib import Path
from typing import Dict, List, Union, Optional, Any


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

def convert_pokemon_type(pokemon_type: str) -> str:
    """ポケモンタイプを変換する"""
    return POKEMON_TYPE_MAPPING.get(pokemon_type, "normal")

def convert_evolve_stage(evolve_stage: str) -> str:
    """進化段階を変換する"""
    return EVOLVE_STAGE_MAPPING.get(evolve_stage, "base")

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
    # 実際のJSONにはトレーナーカードの説明が含まれていないため、仮の説明を返す
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
            "rarity": card.get('rarity', ''),
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


if __name__ == "__main__":
    # 実行パス
    script_dir = Path(__file__).parent
    source_file = script_dir / "../src/constants/data/scraped/A1.json"
    target_file = script_dir / "../src/constants/data/A1.json"
    
    # ディレクトリがなければ作成
    target_file.parent.mkdir(parents=True, exist_ok=True)
    
    convert_card_data(source_file, target_file)
    print("変換が完了しました！")