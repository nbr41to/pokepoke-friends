#!/usr/bin/env python3
# encoding: utf-8

import requests
from bs4 import BeautifulSoup
import json
from pathlib import Path
import re
import time

def scrape_pokemon_cards(series):
    """
    指定されたURLからcards-fullクラスの下にあるカードをすべて取得するスクレイピング関数
    example.jsonc形式に合わせてデータを抽出する
    
    Args:
        series (str): スクレイピング対象のシリーズコード（例: "P-A"）
    
    Returns:
        list or None: カード情報のリスト。エラー時はNone
    """
    # スクレイピング対象のURL
    url = f"https://pocket.limitlesstcg.com/cards/{series}?display=full"
    
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
            card_info = {}
            
            # 画像URLを取得
            card_image_elem = card.select_one('.card-image img')
            if card_image_elem and 'src' in card_image_elem.attrs:
                card_info['image'] = card_image_elem['src']
            
            # カードプリント情報から番号とパックを取得
            card_prints = card.select_one('.card-prints-current')
            if card_prints:
                prints_details = card_prints.select_one('.prints-current-details')
                if prints_details:
                    details_text = prints_details.get_text(strip=True)
                    
                    # 番号を取得 (例: "#61 · ◊◊◊ · Charizard pack" -> "A1 #61")
                    number_match = re.search(r'#(\d+)', details_text)
                    if number_match:
                        set_info = prints_details.find_previous('img', class_='set')
                        set_id = set_info.get('alt') if set_info else ''
                        card_info['numbering'] = f"{set_id} #{number_match.group(1)}"
                    
                    # パックを取得
                    pack_match = re.search(r'·\s+(.*?)\s+pack', details_text)
                    if pack_match:
                        card_info['pack'] = f"{pack_match.group(1)} pack"
                    else:
                        card_info['pack'] = "Common"
                    
                    # レアリティを取得 - シンプルな実装に変更
                    # span要素の中にある詳細テキストを取得
                    details_spans = prints_details.select('span')
                    if len(details_spans) >= 2:  # 少なくとも2つのspanがある場合
                        second_span_text = details_spans[1].get_text(strip=True)
                        
                        # "·" で区切って2番目の要素（レアリティ）を取得
                        parts = second_span_text.split('·')
                        if len(parts) >= 2:
                            # 2番目の部分（レアリティ）を取得して余分な空白を削除
                            rarity_text = parts[1].strip()
                            card_info['rarity'] = rarity_text
                        elif "Premium Missions" in second_span_text:
                            # Premium Missionsの場合はPROMO扱い
                            card_info['rarity'] = "PROMO"
                        elif "Crown Rare" in second_span_text:
                            # Crown Rareの場合
                            card_info['rarity'] = "Crown Rare"
                        else:
                            # その他の場合はテキスト全体を使用
                            card_info['rarity'] = second_span_text.strip()
                    else:
                        # スパンが足りない場合、全体から推測
                        if "Premium Missions" in details_text:
                            card_info['rarity'] = "PROMO"
                        elif "Crown Rare" in details_text:
                            card_info['rarity'] = "Crown Rare"
                        else:
                            # デフォルト値
                            card_info['rarity'] = "◊"
            
            # card-textを取得
            card_text_div = card.find('div', class_='card-text')
            if not card_text_div:
                continue
                
            # card-text-section要素を全て取得
            card_text_sections = card_text_div.find_all('div', class_='card-text-section')
            
            # 最初のセクション（カード基本情報）を処理
            if len(card_text_sections) >= 1:
                first_section = card_text_sections[0]
                
                # カード名の取得 (card-text-name)
                name_elem = first_section.select_one('.card-text-name a')
                if name_elem:
                    card_info['name'] = name_elem.get_text(strip=True)
                    
                    # カードURLも取得 (card-text-name)
                    card_url = name_elem.get('href')
                    if card_url:
                        card_info['url'] = f"https://pocket.limitlesstcg.com{card_url}"
                
                # カードタイプ（Pokémon, Trainer, Energyなど）を取得 (card-text-type)
                card_type_elem = first_section.select_one('.card-text-type')
                if card_type_elem:
                    card_type_text = card_type_elem.get_text(strip=True)
                    type_parts = card_type_text.split('-')
                    
                    # card_type (例: "Pokémon")
                    if len(type_parts) >= 1:
                        card_info['card_type'] = type_parts[0].strip()
                    
                    # evole_stage (例: "Stage 2")
                    if len(type_parts) >= 2:
                        card_info['evole_stage'] = type_parts[1].strip()
                
                # タイトル行からHP、ポケモンタイプを取得 (card-text-title)
                title_elem = first_section.select_one('.card-text-title')
                if title_elem:
                    title_text = title_elem.get_text(strip=True)
                    
                    # HPの抽出
                    hp_match = re.search(r'(\d+)\s*HP', title_text)
                    if hp_match:
                        card_info['hp'] = int(hp_match.group(1))
                    
                    # ポケモンタイプの抽出
                    pokemon_types = ["Colorless", "Grass", "Fire", "Water", "Lightning", "Psychic", "Fighting", "Darkness", "Metal", "Dragon", "Fairy"]
                    for pokemon_type in pokemon_types:
                        if f"- {pokemon_type}" in title_text:
                            card_info['pokemon_type'] = pokemon_type
                            break
            
            # 2番目のセクション（技・効果など）を処理
            if len(card_text_sections) >= 2:
                second_section = card_text_sections[1]
                
                # 特性（アビリティ）の情報を取得
                ability_elem = second_section.find('div', class_='card-text-ability')
                if ability_elem:
                    # ability_name (card-text-ability-info)
                    ability_info_elem = ability_elem.select_one('.card-text-ability-info')
                    if ability_info_elem:
                        ability_info_text = ability_info_elem.get_text(strip=True)
                        ability_name_match = re.search(r'Ability:\s*(.*)', ability_info_text)
                        if ability_name_match:
                            card_info['ability_name'] = ability_name_match.group(1).strip()
                    
                    # ability_description (card-text-ability-effect)
                    ability_effect_elem = ability_elem.select_one('.card-text-ability-effect')
                    if ability_effect_elem:
                        card_info['ability_description'] = ability_effect_elem.get_text(strip=True)
                else:
                    # アビリティが存在しない場合はnullを設定
                    card_info['ability_name'] = None
                    card_info['ability_description'] = None
                
                # 技の情報を取得
                attacks = []
                attack_elems = second_section.find_all('div', class_='card-text-attack')

                # カードタイプがPokémon以外の場合は説明テキストを取得
                if 'card_type' in card_info and card_info['card_type'] != 'Pokémon':
                    # トレーナーカードやエネルギーカードの場合、効果テキストをdescriptionに設定
                    # 効果テキストはcard-text-sectionの直接のテキストコンテンツとして存在する可能性がある
                    effect_text = second_section.get_text(strip=True)
                    
                    # 以下のクラスを持つ要素も確認
                    effect_elems = second_section.find_all(['div', 'p'], class_=['card-text-attack-effect', 'card-text-effect'])
                    
                    if effect_text or effect_elems:
                        # 複数の効果テキスト要素がある場合は連結
                        descriptions = []
                        
                        # セクション直接のテキストを確認（クラスがない場合）
                        if effect_text and not second_section.find('div', class_=['card-text-attack', 'card-text-ability']):
                            descriptions.append(effect_text)
                        
                        # 特定クラスを持つ要素からテキストを追加
                        for elem in effect_elems:
                            text = elem.get_text(strip=True)
                            if text:
                                descriptions.append(text)
                                
                        card_info['description'] = '\n'.join(descriptions) if descriptions else None
                    else:
                        card_info['description'] = None
                else:
                    # Pokémonカードの場合はdescriptionをnullに設定
                    card_info['description'] = None

                # Pokémonカードの場合のみ技情報を処理
                if 'card_type' in card_info and card_info['card_type'] == 'Pokémon':
                    for attack_elem in attack_elems:
                        attack = {}
                        
                        # 技名とダメージの取得 (card-text-attack-info)
                        attack_info_elem = attack_elem.select_one('.card-text-attack-info')
                        if attack_info_elem:
                            attack_text = attack_info_elem.get_text(strip=True)
                            
                            # エネルギーコストを取得 (ptcg-symbol)
                            energy_symbols = attack_info_elem.find_all('span', class_='ptcg-symbol')
                            energy = ''
                            for symbol in energy_symbols:
                                # ptcg-symbolのテキストコンテンツを直接使用
                                energy += symbol.get_text(strip=True)
                            attack['energy'] = energy
                            
                            # 攻撃名とダメージを取得
                            # ptcg-symbolの内容が攻撃名に混入しないよう処理
                            attack_parts = attack_info_elem.get_text()
                            # energyシンボルを除いたテキスト部分を取得
                            attack_text_parts = []
                            for child in attack_info_elem.children:
                                if child.name != "span" or "ptcg-symbol" not in child.get("class", []):
                                    attack_text_parts.append(child.get_text() if hasattr(child, "get_text") else str(child))
                            attack_text = "".join(attack_text_parts).strip()
                            
                            # 英気表現：半角スペースと数字で技名とダメージを区切る
                            # 例: "Mega Punch 80" -> name="Mega Punch", damage="80"
                            # 例: "Tackle 30+" -> name="Tackle", damage="30+"
                            last_space_index = attack_text.rfind(' ')
                            if last_space_index != -1 and any(c.isdigit() for c in attack_text[last_space_index+1:]):
                                # 最後のスペースの後に数字が含まれている場合
                                attack_name = attack_text[:last_space_index].strip()
                                attack_damage = attack_text[last_space_index+1:].strip()
                                
                                # 技名が空ではない場合のみ設定
                                if attack_name:
                                    attack['name'] = attack_name
                                    attack['damage'] = attack_damage
                                else:
                                    # 技名が空の場合、特殊な攻撃名を設定
                                    attack['name'] = "Special Attack"
                                    attack['damage'] = attack_damage
                            else:
                                # スペースと数字の組み合わせがない場合は全体を技名とする
                                attack['name'] = attack_text
                                attack['damage'] = None
                        
                        # 技の効果テキストを取得 (card-text-attack-effect)
                        effect_elem = attack_elem.select_one('.card-text-attack-effect')
                        if effect_elem:
                            effect_text = effect_elem.get_text(strip=True)
                            if effect_text:
                                attack['description'] = effect_text
                            else:
                                attack['description'] = None
                        else:
                            attack['description'] = None
                        
                        attacks.append(attack)
                    
                    if attacks:
                        card_info['attacks'] = attacks
            
            # 3番目のセクション（弱点・抵抗・後退コストなど）を処理
            if len(card_text_sections) >= 3:
                third_section = card_text_sections[2]
                
                # 弱点・後退コストを取得 (card-text-wrr)
                wrr_elem = third_section.select_one('.card-text-wrr')
                if wrr_elem:
                    # HTML内容を直接取得して行ごとに分割する（<br />タグを考慮）
                    wrr_html = str(wrr_elem)
                    
                    # 弱点を抽出（最初の行のみ）
                    weakness_match = re.search(r'Weakness:\s*([^<\n]+)', wrr_html)
                    if weakness_match:
                        card_info['weakness'] = weakness_match.group(1).strip()
                    
                    # 後退コストを抽出
                    retreat_match = re.search(r'Retreat:\s*(\d+)', wrr_html)
                    if retreat_match:
                        card_info['retreat'] = int(retreat_match.group(1))
            
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

if __name__ == "__main__":
    # スクレイピング対象のシリーズリスト
    series_list = ["A1","A1a","A2","A2a","A2b","A3","P-A"]  # デフォルトでは1つのシリーズのみ
    
    # コマンドライン引数からシリーズリストを取得できるようにする
    import sys
    if len(sys.argv) > 1:
        series_list = sys.argv[1:]
    
    print(f"以下のシリーズのポケモンカードをスクレイピングします: {', '.join(series_list)}")
    scrape_multiple_series(series_list,1)
    print("すべてのスクレイピングが完了しました。")