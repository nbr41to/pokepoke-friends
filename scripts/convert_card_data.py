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
    "Tool": "trainers-pokemon-tools",
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
DEFAULT_SERIES_LIST = ["A1", "A1a", "A2", "A2a", "A2b", "A3", "A3a", "P-A"]

def load_pokemon_names(script_dir: Path) -> Dict[str, str]:
    """ポケモンの英語名と日本語名のマッピングを読み込む"""
    pokemon_names_file = script_dir / "../src/constants/data/pokemon_names.json"
    try:
        with open(pokemon_names_file, 'r', encoding='utf-8') as f:
            pokemon_names_data = json.load(f)
        
        # 英語名をキー、日本語名を値とする辞書を作成
        en_to_ja = {entry["en"]: entry["ja"] for entry in pokemon_names_data}
        return en_to_ja
    except Exception as e:
        print(f"警告: ポケモン名のマッピングファイルの読み込みに失敗しました: {e}")
        return {}

def convert_pokemon_name(name: str, pokemon_names_map: Dict[str, str]) -> str:
    """ポケモン名を英語から日本語に変換する
    マッピングに存在しない場合は、元の名前をそのまま返す
    「ex」や特別な接尾辞がある場合は、基本名のみを翻訳し、接尾辞はそのまま保持する"""
    # 「ex」などの接尾辞を検出
    ex_suffix_match = re.search(r'\s+(ex|EX|V|VMAX|VSTAR|GX)$', name)
    suffix = ""
    base_name = name
    
    # 接尾辞がある場合、基本名と接尾辞を分離
    if ex_suffix_match:
        suffix = ex_suffix_match.group(0)  # 空白を含む接尾辞（例: " ex"）
        base_name = name[:ex_suffix_match.start()]
    
    # 特有のポケモン名をPrefixを検出（例: "Origin Forme Dialga", "Alolan Vulpix", "Paldean Wooper"）
    prefix = ""
    # オリジンフォルムのポケモン名を検出（例: "Origin Forme Dialga"）
    if base_name.startswith("Origin Forme "):
        prefix = "オリジン"  # 日本語の接頭辞
        base_name = base_name[len("Origin Forme "):]  # "Origin Forme "を取り除く
    # アローラ地方のポケモン名を検出（例: "Alolan Wooper"）
    elif base_name.startswith("Alolan "):
        prefix = "アローラ"  # 日本語の接頭辞
        base_name = base_name[len("Alolan "):]  # "Alolan "を取り除く
    # パルデア地方のポケモン名を検出（例: "Paldean Wooper"）
    elif base_name.startswith("Paldean "):
        prefix = "パルデア"  # 日本語の接頭辞
        base_name = base_name[len("Paldean "):]  # "Paldean "を取り除く
    
    # 名前の先頭に数字やアルファベットがある場合、それを除去して検索（例: "1.Bulbasaur" -> "Bulbasaur"）
    cleaned_name = re.sub(r'^[\d\W]+\.?\s*', '', base_name)
    
    # 基本名を翻訳
    translated_base = pokemon_names_map.get(cleaned_name, base_name)
    
    # 地域特有の接頭辞がある場合、それを追加
    if prefix:
        translated_base = prefix + translated_base
    
    # 接尾辞がある場合は、翻訳した基本名に接尾辞を再結合
    if suffix:
        return translated_base + suffix
    
    return translated_base

def convert_pokemon_type(pokemon_type: Optional[str]) -> Optional[str]:
    """ポケモンタイプを変換する"""
    if pokemon_type is None or pokemon_type.lower() == "none":
        return None
    return POKEMON_TYPE_MAPPING.get(pokemon_type, "normal")

def convert_evolve_stage(evolve_stage: str) -> str:
    """進化段階を変換する"""
    return EVOLVE_STAGE_MAPPING.get(evolve_stage, "base")

def convert_rarity(rarity: str, series_id: str) -> str:
    """レア度を CardRarity 型に変換する"""
    # P_Aシリーズの場合、レアリティを"promo"に設定
    if series_id == "P_A":
        return "promo"
    # マッピングにある場合はそれを返す
    # ない場合は元の値をそのまま返す（このあとCardRarity型にマッチするか処理される）
    return RARITY_MAPPING.get(rarity, rarity)

def convert_damage_to_power(damage: Optional[str]) -> Optional[str]:
    """ダメージ文字列をパワー文字列として返す（80+や30xのような表記を保持）"""
    if damage is None:
        return None
    # ダメージ文字列をそのまま返す（先頭の空白があれば除去）
    return damage.strip() if damage else None

def extract_card_description(card: Dict[str, Any]) -> Optional[str]:
    """カードの説明文を抽出する（nullの場合はそのまま返す）"""
    # 常に元データの description をそのまま返す（nullも含む）
    return card.get('description')

def convert_card_data(source_file: str, target_file: str) -> None:
    """カードデータを変換する"""
    # JSONファイルを読み込む
    with open(source_file, 'r', encoding='utf-8') as f:
        cards_data = json.load(f)
    
    # ポケモン名のマッピングを読み込む
    pokemon_names_map = load_pokemon_names(Path(__file__).parent)
    
    converted_cards = []
    card_id = 1  # 連番ID
    
    # シリーズIDを取得（ファイル名からシリーズIDを抽出）
    series_id = Path(source_file).stem
    
    for card in cards_data:
        # 英語名を取得
        english_name = card.get('name', '')
        
        # 基本情報
        card_base = {
            "id": card_id,
            "cardNumber": card.get('numbering', ''),
            "name": convert_pokemon_name(english_name, pokemon_names_map),  # 英語名を日本語名に変換
            "nameEn": english_name,  # 英語名は元データのままで保持
            "rarity": convert_rarity(card.get('rarity', ''), series_id),  # シリーズIDを渡して、P_Aの場合はpromoにする
            "image": card.get('image', ''),
            "description": extract_card_description(card)  # すべてのカードタイプにdescriptionを追加
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
                "weakness": convert_pokemon_type(card.get('weakness')) if card.get('weakness') else None,
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
        print(f"[{series_list.index(series_id) + 1}/{len(series_list)}] {series_id}を変換中...")
        if process_series(series_id, script_dir):
            success_count += 1
        else:
            print(f"エラー: {series_id}の変換に失敗しました。")
    print(f"変換が完了しました。成功したシリーズ: {success_count}/{len(series_list)}")
    print("スクリプトを終了します。")
    sys.exit(0)
