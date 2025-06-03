#!/usr/bin/env python3
# encoding: utf-8

import requests
from bs4 import BeautifulSoup
import json
from pathlib import Path
import re
import time
import sys
import os
import difflib
import tempfile
from dotenv import load_dotenv

# .envファイルから環境変数を読み込む
load_dotenv()

def get_base_url():
    """
    .envファイルおよび環境変数からベースURLを取得する関数
    
    Returns:
        str: ベースURL
        
    Raises:
        EnvironmentError: 環境変数BASE_URLが設定されていない場合
    """
    base_url = os.environ.get("BASE_URL")
    if not base_url:
        raise EnvironmentError("環境変数BASE_URLが設定されていません。.envファイルにBASE_URLを設定してください。")
    return base_url

def scrape_pokemon_cards(series):
    """
    指定されたURLからcards-fullクラスの下にあるカードをすべて取得するスクレイピング関数
    example.jsonc形式に合わせてデータを抽出する
    
    Args:
        series (str): スクレイピング対象のシリーズコード（例: "P-A"）
    
    Returns:
        list or None: カード情報のリスト。エラー時はNone
    """
    # スクレイピング対象のURL - 環境変数から取得
    base_url = get_base_url()
    url = f"{base_url}/cards/{series}?display=full"
    
    try:
        # リクエストを送信してHTMLを取得
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
        }
        print(f"{series}のデータをスクレイピングしています...")
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # エラーがあれば例外を発生させる
        
        # BeautifulSoupでHTMLを解析
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # cards-fullクラスを持つdivを検索
        cards_full_div = soup.find('div', class_='cards-full')
        
        if not cards_full_div:
            print(f"{series}: cards-fullクラスのdivが見つかりませんでした。")
            return None
        
        # cards-fullクラスのdivの下にあるcard-page-mainをすべて取得
        cards = cards_full_div.find_all('div', class_='card-page-main')
        
        if not cards:
            print(f"{series}: card-page-main要素が見つかりませんでした。")
            return None
            
        # 結果を出力
        print(f"{series}: {len(cards)}個のcard要素を取得しました。")
        
        # 結果をデータとして整形
        cards_data = []
        for card in cards:
            card_info = extract_card_data(card)
            if card_info:
                cards_data.append(card_info)
        
        # データのプロパティ順序を整える
        ordered_cards_data = []
        for card_info in cards_data:
            # アルファベット順に並び替えた新しい辞書を作成
            ordered_card = {}
            
            # プロパティの順序をアルファベット順に指定
            property_order = [
                "ability_description", "ability_name", 
                "attacks", 
                "card_type", 
                "description", 
                "evole_stage", 
                "hp", 
                "image", 
                "name", 
                "numbering", 
                "pack", 
                "pokemon_type", 
                "rarity", 
                "retreat", 
                "url", 
                "weakness"
            ]
            
            # 指定された順序でプロパティを追加
            for prop in property_order:
                if prop in card_info:
                    ordered_card[prop] = card_info[prop]
            
            ordered_cards_data.append(ordered_card)
        
        # データをJSONとして保存
        save_path = Path(__file__).parent.parent / "src" / "constants" / "data" / "scraped" / f"{series}.json"
        save_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(save_path, 'w', encoding='utf-8') as f:
            json.dump(ordered_cards_data, f, ensure_ascii=False, indent=2)
        
        print(f"{series}: データを {save_path} に保存しました。合計 {len(ordered_cards_data)} 枚のカード情報を抽出しました。")
        return ordered_cards_data
        
    except Exception as e:
        print(f"{series}のスクレイピング中にエラーが発生しました: {e}")
        return None

def extract_card_data(card):
    """
    カード要素からデータを抽出する関数
    
    Args:
        card: BeautifulSoupオブジェクト（card-page-main要素）
    
    Returns:
        dict: カード情報の辞書
    """
    # すべてのカードタイプ共通の基本プロパティをnullで初期化
    card_info = {
        'ability_description': None,
        'ability_name': None,
        'attacks': [],
        'description': None,
        'hp': None,
        'pokemon_type': None,
        'retreat': None,
        'weakness': None
    }
    
    # 画像URLを取得
    extract_image_url(card, card_info)
    
    # カードプリント情報（番号、パック、レアリティ）を取得
    extract_print_details(card, card_info)
    
    # カードテキスト情報を取得
    card_text_div = card.find('div', class_='card-text')
    if not card_text_div:
        return None
        
    card_text_sections = card_text_div.find_all('div', class_='card-text-section')
    
    # 基本情報を取得（セクション1）
    if card_text_sections:
        extract_basic_info(card_text_sections[0], card_info)
    
    # 技・効果情報を取得（セクション2）
    if len(card_text_sections) >= 2:
        extract_abilities_and_attacks(card_text_sections[1], card_info)
    
    # 弱点・後退コスト情報を取得（セクション3）
    if len(card_text_sections) >= 3:
        extract_weakness_and_retreat(card_text_sections[2], card_info)
    
    # フレーバーテキストを取得（存在する場合）
    flavor_elem = card_text_div.find('div', class_='card-text-flavor')
    if flavor_elem:
        flavor_text = flavor_elem.get_text(strip=True)
        if flavor_text:
            card_info['description'] = flavor_text
    
    return card_info

def extract_image_url(card, card_info):
    """画像URLを取得"""
    card_image_elem = card.select_one('.card-image img')
    if card_image_elem and 'src' in card_image_elem.attrs:
        card_info['image'] = card_image_elem['src']

def extract_print_details(card, card_info):
    """カードプリント情報を取得"""
    card_prints = card.select_one('.card-prints-current')
    if not card_prints:
        return
    
    prints_details = card_prints.select_one('.prints-current-details')
    if not prints_details:
        return
        
    details_text = prints_details.get_text(strip=True)
    
    # セットIDと番号を取得
    set_info = card_prints.select_one('img.set')
    set_id = set_info.get('alt') if set_info else ''
    
    number_match = re.search(r'#(\d+)', details_text)
    if number_match:
        card_info['numbering'] = f"{set_id} #{number_match.group(1)}"
    
    # パックとレアリティを取得
    extract_pack_and_rarity(details_text, card_info)

def extract_pack_and_rarity(details_text, card_info):
    """パックとレアリティ情報を取得"""
    # パックを取得
    pack_match = re.search(r'·\s+(.*?)\s+pack', details_text)
    if pack_match:
        card_info['pack'] = f"{pack_match.group(1)} pack"
    else:
        card_info['pack'] = "Common"
    
    # レアリティを判定
    if "Premium Missions" in details_text:
        card_info['rarity'] = "PROMO"
    elif "Crown Rare" in details_text:
        card_info['rarity'] = "Crown Rare"
    else:
        # レアリティシンボルを取得
        rarity_match = re.search(r'·\s+(◊+|☆+)', details_text)
        if rarity_match:
            card_info['rarity'] = rarity_match.group(1)
        else:
            card_info['rarity'] = "◊"

def extract_basic_info(section, card_info):
    """カードの基本情報を取得"""
    # カード名とURLを取得
    name_elem = section.select_one('.card-text-name a')
    if name_elem:
        card_info['name'] = name_elem.get_text(strip=True)
        card_url = name_elem.get('href')
        if card_url:
            base_url = get_base_url()
            card_info['url'] = f"{base_url}{card_url}"
    
    # カードタイプと進化段階を取得
    card_type_elem = section.select_one('.card-text-type')
    if card_type_elem:
        # type_textから改行や余分な空白を削除して整形する
        raw_type_text = card_type_elem.get_text()
        # 改行や余分な空白を削除して1つの文字列にする
        type_text = ' '.join(raw_type_text.split())
        extract_card_type_info(type_text, card_info)
    
    # HPとポケモンタイプを取得
    title_elem = section.select_one('.card-text-title')
    if title_elem:
        title_text = title_elem.get_text(strip=True)
        extract_hp_and_pokemon_type(title_text, card_info)

def extract_card_type_info(type_text, card_info):
    """カードタイプと進化段階を取得"""
    # タイプの詳細情報を抽出
    type_parts = type_text.split('-')
    
    # カードタイプがTrainerの場合は完全なタイプを保持（例: "Trainer - Item"）
    if type_parts and type_parts[0].strip() == "Trainer":
        card_info['card_type'] = type_text.strip()
        # '-'でスプリットした2つ目の部分を進化段階として扱う（例: "Item", "Supporter"）
        if len(type_parts) >= 2:
            card_info['evole_stage'] = type_parts[1].strip()
    else:
        # ポケモンカードやエネルギーカードの場合は基本タイプのみ保持
        if type_parts:
            card_info['card_type'] = type_parts[0].strip()  # "Pokémon"のみ保存
        
        # 進化段階（例: "Stage 2"）を抽出
        if len(type_parts) >= 2:
            card_info['evole_stage'] = type_parts[1].strip()
        else:
            # 進化段階がない場合（Basic等）
            if "Basic" in type_text:
                card_info['evole_stage'] = "Basic"
            else:
                card_info['evole_stage'] = None

def extract_hp_and_pokemon_type(title_text, card_info):
    """HPとポケモンタイプを取得"""
    # HPの抽出
    hp_match = re.search(r'(\d+)\s*HP', title_text)
    if hp_match:
        card_info['hp'] = int(hp_match.group(1))
    
    # ポケモンタイプの抽出
    pokemon_types = ["Colorless", "Grass", "Fire", "Water", "Lightning", "Psychic", 
                     "Fighting", "Darkness", "Metal", "Dragon", "Fairy"]
    for pokemon_type in pokemon_types:
        if f"- {pokemon_type}" in title_text:
            card_info['pokemon_type'] = pokemon_type
            break

def extract_abilities_and_attacks(section, card_info):
    """特性と技の情報を取得"""
    # カードタイプが確定していない場合は処理しない
    if 'card_type' not in card_info:
        return
    
    if card_info['card_type'].startswith('Pokémon'):
        # ポケモンカードの場合は特性と技を処理
        extract_ability(section, card_info)
        extract_attacks(section, card_info)
    else:
        # トレーナーカードやエネルギーカードの場合は説明テキストを処理
        extract_description(section, card_info)

def extract_ability(section, card_info):
    """特性（アビリティ）情報を取得"""
    ability_elem = section.find('div', class_='card-text-ability')
    if not ability_elem:
        return
        
    # 特性名を取得
    ability_info = ability_elem.select_one('.card-text-ability-info')
    if ability_info:
        ability_name_match = re.search(r'Ability:\s*(.*)', ability_info.get_text(strip=True))
        if ability_name_match:
            card_info['ability_name'] = ability_name_match.group(1).strip()
    
    # 特性効果を取得
    ability_effect = ability_elem.select_one('.card-text-ability-effect')
    if ability_effect:
        card_info['ability_description'] = ability_effect.get_text(strip=True)

def extract_attacks(section, card_info):
    """技情報を取得"""
    attack_elems = section.find_all('div', class_='card-text-attack')
    if not attack_elems:
        return
        
    attacks = []
    
    for attack_elem in attack_elems:
        attack = {}
        
        # 技情報（エネルギーコスト、技名、ダメージ）を取得
        attack_info_elem = attack_elem.select_one('.card-text-attack-info')
        if attack_info_elem:
            # エネルギーコストを取得
            energy_symbols = attack_info_elem.find_all('span', class_='ptcg-symbol')
            energy = ''.join(symbol.get_text(strip=True) for symbol in energy_symbols)
            attack['energy'] = energy
            
            # 技名とダメージを取得
            attack_text = extract_attack_name_and_damage(attack_info_elem)
            if attack_text:
                attack.update(attack_text)
        
        # 技の効果テキストを取得
        effect_elem = attack_elem.select_one('.card-text-attack-effect')
        attack['description'] = effect_elem.get_text(strip=True) if effect_elem and effect_elem.get_text(strip=True) else None
        
        attacks.append(attack)
    
    # 現在のスクレイピング結果と一致させるため、attacksのない場合は空リストを設定
    card_info['attacks'] = attacks

def extract_attack_name_and_damage(attack_info_elem):
    """技名とダメージを取得"""
    # ptcg-symbolを除いたテキスト部分を取得
    text_parts = []
    for child in attack_info_elem.children:
        if child.name != "span" or "ptcg-symbol" not in child.get("class", []):
            text_parts.append(child.get_text() if hasattr(child, "get_text") else str(child))
    
    attack_text = "".join(text_parts).strip()
    
    # 技名とダメージを分離
    last_space_index = attack_text.rfind(' ')
    if last_space_index != -1 and any(c.isdigit() for c in attack_text[last_space_index+1:]):
        attack_name = attack_text[:last_space_index].strip()
        attack_damage = attack_text[last_space_index+1:].strip()  # tripをstripに修正
        
        if attack_name:
            return {'name': attack_name, 'damage': attack_damage}
        else:
            return {'name': "Special Attack", 'damage': attack_damage}
    else:
        # 数字がない場合は全体を技名とする
        return {'name': attack_text, 'damage': None}

def extract_description(section, card_info):
    """トレーナーカード/エネルギーカードの説明テキストを取得"""
    # セクション全体のテキストを取得
    section_text = section.get_text(strip=True)
    
    # 効果テキスト要素を検索
    effect_elems = section.find_all(['div', 'p'], class_=['card-text-attack-effect', 'card-text-effect'])
    
    descriptions = []
    
    # セクション直接のテキストを確認（特定のクラスを持つ子要素がない場合）
    has_special_elements = bool(section.find(['div', 'p'], class_=['card-text-attack', 'card-text-ability', 
                                                                   'card-text-attack-effect', 'card-text-effect']))
    if section_text and not has_special_elements:
        descriptions.append(section_text)
    
    # 特定クラスを持つ要素からテキストを追加
    for elem in effect_elems:
        elem_text = elem.get_text(strip=True)
        if elem_text:
            descriptions.append(elem_text)
            
    card_info['description'] = '\n'.join(descriptions) if descriptions else None

def extract_weakness_and_retreat(section, card_info):
    """弱点と後退コストを取得"""
    wrr_elem = section.select_one('.card-text-wrr')
    if not wrr_elem:
        return
        
    wrr_text = wrr_elem.get_text()
    
    # 弱点を抽出
    weakness_match = re.search(r'Weakness:\s*([^\n]+)', wrr_text)
    if weakness_match:
        weakness_value = weakness_match.group(1).strip()
        card_info['weakness'] = None if weakness_value.lower() == 'none' or not weakness_value else weakness_value
    else:
        card_info['weakness'] = None
    
    # 後退コストを抽出
    retreat_match = re.search(r'Retreat:\s*(\d+)', wrr_text)
    if retreat_match:
        card_info['retreat'] = int(retreat_match.group(1))

def scrape_multiple_series(series_list, delay=3):
    """
    複数のシリーズに対してスクレイピングを実行する関数
    
    Args:
        series_list (list): スクレイピング対象のシリーズコードのリスト
        delay (int): 各リクエスト間の待機時間（秒）
    
    Returns:
        dict: シリーズごとの結果を格納した辞書
    """
    results = {}
    
    for idx, series in enumerate(series_list):
        print(f"[{idx+1}/{len(series_list)}] シリーズ {series} のスクレイピングを開始します...")
        result = scrape_pokemon_cards(series)
        results[series] = result
        
        # 最後のシリーズでなければ待機
        if idx < len(series_list) - 1:
            print(f"次のシリーズをスクレイピングする前に {delay} 秒待機します...")
            time.sleep(delay)
    
    return results

def test_output_consistency(series, test_only=False):
    """
    出力結果の一貫性をテストする関数
    
    Args:
        series (str): テスト対象のシリーズコード
        test_only (bool): Trueの場合、既存ファイルを更新せずにテストのみ実行
        
    Returns:
        bool: 一貫性が保たれている場合はTrue、そうでない場合はFalse
    """
    # 既存のJSONファイルを読み込む
    existing_file_path = Path(__file__).parent.parent / "src" / "constants" / "data" / "scraped" / f"{series}.json"
    if not existing_file_path.exists():
        print(f"既存の{series}.jsonファイルが見つかりません。テストできません。")
        return False
    
    try:
        with open(existing_file_path, 'r', encoding='utf-8') as f:
            existing_data = json.load(f)
        
        # 一時ファイルに現在のスクレイピング結果を保存
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.json')
        temp_file.close()
        
        # 現在のスクレイピング結果を取得
        base_url = get_base_url()
        url = f"{base_url}/cards/{series}?display=full"
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        cards_full_div = soup.find('div', class_='cards-full')
        if not cards_full_div:
            print(f"テスト失敗: {series}のカードデータを取得できませんでした。")
            return False
        
        cards = cards_full_div.find_all('div', class_='card-page-main')
        cards_data = [extract_card_data(card) for card in cards]
        cards_data = [card for card in cards_data if card]
        
        # すべてのカードが必要なプロパティを持っているか確認
        required_properties = [
            "ability_description", "ability_name", "attacks", 
            "card_type", "description", "evole_stage", "hp", 
            "image", "name", "numbering", "pack", "pokemon_type", 
            "rarity", "retreat", "url", "weakness"
        ]
        
        # カードデータのプロパティを確認
        for i, card in enumerate(cards_data):
            missing_props = [prop for prop in required_properties if prop not in card]
            if missing_props:
                print(f"テスト失敗: カード #{i+1} ({card.get('name', 'unknown')}) には次のプロパティがありません: {', '.join(missing_props)}")
                # 欠落しているプロパティを追加（nullで初期化）
                for prop in missing_props:
                    if prop == 'attacks':
                        card[prop] = []
                    else:
                        card[prop] = None
        
        ordered_cards_data = order_card_properties(cards_data)
        
        # 一時ファイルに保存
        with open(temp_file.name, 'w', encoding='utf-8') as f:
            json.dump(ordered_cards_data, f, ensure_ascii=False, indent=2)
        
        # ファイルの内容を比較
        with open(temp_file.name, 'r', encoding='utf-8') as f:
            new_data = json.load(f)
        
        # データの長さを比較
        if len(existing_data) != len(new_data):
            print(f"テスト失敗: データの長さが異なります。既存: {len(existing_data)}, 新規: {len(new_data)}")
            return False
        
        # 各カードの内容を比較
        for i, (existing_card, new_card) in enumerate(zip(existing_data, new_data)):
            # プロパティの欠落チェック（既存データとの比較）
            for prop in existing_card:
                if prop not in new_card:
                    print(f"テスト失敗: カード #{i+1} ({new_card.get('name', 'unknown')}) に既存の '{prop}' プロパティがありません")
                    # 欠落しているプロパティを追加
                    if prop == 'attacks':
                        new_card[prop] = []
                    else:
                        new_card[prop] = None
            
            if existing_card != new_card:
                print(f"テスト失敗: カード #{i+1} の内容が異なります。")
                # 違いを表示
                existing_json = json.dumps(existing_card, ensure_ascii=False, indent=2)
                new_json = json.dumps(new_card, ensure_ascii=False, indent=2)
                print("\n".join(difflib.unified_diff(
                    existing_json.splitlines(),
                    new_json.splitlines(),
                    lineterm='',
                    fromfile='既存データ',
                    tofile='新規データ'
                )))
                return False
        
        print(f"テスト成功: {series}のデータは一貫性があります。")
        
        # テストモードでなければ、ファイルを更新
        if not test_only:
            with open(existing_file_path, 'w', encoding='utf-8') as f:
                json.dump(ordered_cards_data, f, ensure_ascii=False, indent=2)
            print(f"{series}.jsonを更新しました。")
        
        # 一時ファイルを削除
        os.unlink(temp_file.name)
        return True
        
    except Exception as e:
        print(f"テスト中にエラーが発生しました: {e}")
        return False

def order_card_properties(cards_data):
    """カード情報のプロパティを指定された順序に整理する"""
    # プロパティの順序
    property_order = [
        "ability_description", "ability_name", 
        "attacks", 
        "card_type", 
        "description", 
        "evole_stage", 
        "hp", 
        "image", 
        "name", 
        "numbering", 
        "pack", 
        "pokemon_type", 
        "rarity", 
        "retreat", 
        "url", 
        "weakness"
    ]
    
    ordered_cards = []
    for card_info in cards_data:
        ordered_card = {}
        for prop in property_order:
            if prop in card_info:
                ordered_card[prop] = card_info[prop]
        ordered_cards.append(ordered_card)
    
    return ordered_cards

if __name__ == "__main__":
    # スクレイピング対象のシリーズリストをJSONから読み込む
    try:
        series_json_path = Path(__file__).parent.parent / "src" / "constants" / "series.json"
        with open(series_json_path, 'r', encoding='utf-8') as f:
            # JSONファイルからシリーズリストを読み込む
            series_list = json.load(f)
        print(f"series.jsonからシリーズリストを読み込みました: {', '.join(series_list)}")
    except Exception as e:
        # 読み込みに失敗した場合はエラーを発生させる
        error_message = f"src/constants/series.jsonの読み込みに失敗しました: {e}"
        print(f"エラー: {error_message}")
        sys.exit(1)  # エラーコード1で終了
    
    # コマンドライン引数からシリーズリストを取得できるようにする
    import sys
    if len(sys.argv) > 1:
        series_list = sys.argv[1:]
    
    print(f"以下のシリーズのポケモンカードをスクレイピングします: {', '.join(series_list)}")
    scrape_multiple_series(series_list,0)
    print("すべてのスクレイピングが完了しました。")