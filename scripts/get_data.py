#!/usr/bin/env python3
# encoding: utf-8

import requests
from bs4 import BeautifulSoup
import json
from pathlib import Path
import re

def scrape_pokemon_cards():
    """
    指定されたURLからcards-fullクラスの下にあるカードをすべて取得するスクレイピング関数
    example.jsonc形式に合わせてデータを抽出する
    """
    # スクレイピング対象のURL
    series = "A1"
    url = f"https://pocket.limitlesstcg.com/cards/{series}?display=full"
    
    try:
        # リクエストを送信してHTMLを取得
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # エラーがあれば例外を発生させる
        
        # BeautifulSoupでHTMLを解析
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # cards-fullクラスを持つdivを検索
        cards_full_div = soup.find('div', class_='cards-full')
        
        if not cards_full_div:
            print("cards-fullクラスのdivが見つかりませんでした。")
            return None
        
        # cards-fullクラスのdivの下にあるcard-page-mainをすべて取得
        cards = cards_full_div.find_all('div', class_='card-page-main')
        
        if not cards:
            print("card-page-main要素が見つかりませんでした。")
            return None
            
        # 結果を出力
        print(f"{len(cards)}個のcard要素を取得しました。")
        
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
                    
                    # レアリティを取得
                    rarity_match = re.search(r'#\d+\s+·\s+([◊☆]+)', details_text)
                    if rarity_match:
                        card_info['rarity'] = rarity_match.group(1)
            
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
        
        # データをJSONとして保存
        save_path = Path(__file__).parent.parent / "src" / "constants" / "data" / "scraped" / f"{series}.json"
        save_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(save_path, 'w', encoding='utf-8') as f:
            json.dump(cards_data, f, ensure_ascii=False, indent=2)
        
        print(f"データを {save_path} に保存しました。合計 {len(cards_data)} 枚のカード情報を抽出しました。")
        return cards_data
        
    except Exception as e:
        print(f"エラーが発生しました: {e}")
        return None

if __name__ == "__main__":
    print("ポケモンカードのスクレイピングを開始します...")
    scrape_pokemon_cards()
    print("スクレイピングが完了しました。")