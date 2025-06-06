#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
from bs4 import BeautifulSoup
import re
from typing import Dict, List, Optional, Union, Any
import glob  # 追加: ファイル検索のため


def parse_pokemon_card(card_element) -> Dict[str, Any]:
    """ポケモンカード要素からデータを抽出する"""
    result = {
        "id": None,
        "name": None,
        "hp": None,
        "image_url": None,
        "rarity": None,
        "move1_name": None,
        "move1_description": None,
        "move2_name": None,
        "move2_description": None,
        "ability_name": None,
        "ability_effect": None,
        "acquisition_pack": None,
        "card_type": None,
        "description": None
    }
    
    try:
        # カードの基本情報を取得
        inner_table = card_element.find("div", class_="_inner-table")
        if not inner_table:
            return result
        
        # カード名を取得
        name_element = inner_table.find("a", class_="_name")
        if name_element:
            result["name"] = name_element.text.strip()
        
        # 画像URLを取得
        img_link = inner_table.find("icard")
        if img_link and img_link.find("a"):
            image_url = img_link.find("a").get("href")
            result["image_url"] = image_url
            
            # 画像URLから数値のIDを抽出
            if image_url:
                id_match = re.search(r'l(\d+)\.png$', image_url)
                if id_match:
                    result["id"] = int(id_match.group(1))
    except Exception as e:
        print(f"カード解析中にエラーが発生しました: {e}")
    
    # 入手パックを取得
    icard_element = inner_table.find("icard")
    if icard_element and icard_element.has_attr("data-getting"):
        result["acquisition_pack"] = icard_element["data-getting"]
    
    # HP値を取得
    hp_element = inner_table.find("div", class_="_hp")
    if hp_element:
        hp_span = hp_element.find("span", class_="_v")
        if hp_span:
            result["hp"] = hp_span.text.strip()
    
    # レアリティを取得
    tag_element = inner_table.find("div", class_="_tag")
    if tag_element:
        img_element = tag_element.find("img")
        if img_element and img_element.has_attr("src"):
            img_src = img_element["src"]
            # レアリティをURLの末尾部分から判定
            if "rare_ur" in img_src:
                result["rarity"] = "crown"  # rare_urはcrownに変換
            elif "rare_sr" in img_src:
                result["rarity"] = "rare_sr"  # そのまま使用
            elif "rare_ar" in img_src:
                result["rarity"] = "rare_ar"  # そのまま使用
            elif "rare_sar" in img_src:
                result["rarity"] = "rare_sar"  # そのまま使用
            else:
                # d1、d2、d3、s1などはそのまま使用
                rarity_match = re.search(r'rare_checkbox_([a-z0-9]+)\.png$', img_src)
                if rarity_match:
                    result["rarity"] = rarity_match.group(1)
        elif "PRO" in tag_element.text:
            result["rarity"] = "promo"  # プロモーション
    
    # カードタイプを確認（ポケモンかグッズなど）
    type_element = inner_table.find("div", class_="_t-type")
    if type_element:
        result["card_type"] = type_element.text.strip()
        
        # ポケモンではない場合（グッズ、サポート、スタジアムなど）
        column_text = inner_table.find("div", class_="_column-text")
        if column_text:
            result["description"] = column_text.text.strip()
        return result
    
    # ポケモンカードの場合（ここから先はポケモンカード特有の情報）
    context_inner = inner_table.find("div", class_="_context-inner")
    if context_inner:
        # 技や特性の情報を取得
        column_tables = context_inner.find_all("div", class_="_column-table")
        
        for i, column_table in enumerate(column_tables):
            # 特性かわざかを判断
            ability_icon = column_table.find("img", class_="_ability-icon")
            
            if ability_icon:  # 特性の場合
                card_element = column_table.find("card")
                ability_name_element = column_table.find("div", class_="_name")
                
                if ability_name_element:
                    result["ability_name"] = ability_name_element.text.strip()
                
                if card_element and card_element.has_attr("data-txt"):
                    result["ability_effect"] = card_element["data-txt"]
            
            else:  # わざの場合
                move_name_element = column_table.find("div", class_="_name")
                
                if move_name_element:
                    move_name = ""
                    card_element = move_name_element.find("card")
                    
                    if card_element:
                        move_name = card_element.text.strip()
                        # わざの説明はdata-txt属性から取得
                        if card_element.has_attr("data-txt"):
                            move_description = card_element["data-txt"]
                        else:
                            move_description = None
                    else:
                        span_element = move_name_element.find("span")
                        if span_element:
                            move_name = span_element.text.strip()
                        move_description = None
                
                if i == 0:  # 一つ目のわざ
                    result["move1_name"] = move_name
                    result["move1_description"] = move_description
                elif i == 1:  # 二つ目のわざ
                    result["move2_name"] = move_name
                    result["move2_description"] = move_description
    
    return result


def scrape_cards_from_html(html_file_path: str) -> List[Dict[str, Any]]:
    """HTMLファイルからカード情報をスクレイピングする"""
    with open(html_file_path, 'r', encoding='utf-8') as file:
        html_content = file.read()
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # カードリストを取得
    card_list = soup.find("ol", id="PokemonCardList")
    if not card_list:
        print("カードリストが見つかりませんでした")
        return []
    
    # 各カード要素を取得
    card_elements = card_list.find_all("li", class_="w-pkc-data-list-element")
    
    cards_data = []
    for card_element in card_elements:
        card_data = parse_pokemon_card(card_element)
        cards_data.append(card_data)
    
    return cards_data


def save_to_json(data: List[Dict[str, Any]], output_file: str) -> None:
    """データをJSONファイルに保存する"""
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"{len(data)}件のカード情報を{output_file}に保存しました")


def main():
    # スクリプトのディレクトリを取得
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # プロジェクトのルートディレクトリ（スクリプトの親ディレクトリ）
    project_root = os.path.dirname(script_dir)
    
    # 入力パターンと出力のパスを設定
    html_file_pattern = os.path.join(script_dir, "./target/ja-*.html")
    output_file = os.path.join(project_root, "src/constants/data/scraped/ja/ja.json") #ここは変更しないでください
    
    # 「ja-」で始まるすべてのHTMLファイルを検索
    html_files = glob.glob(html_file_pattern)
    
    if not html_files:
        print("「ja-」で始まるHTMLファイルが見つかりませんでした")
        return
    
    # 全カードのデータを格納するリスト
    all_cards_data = []
    
    # 各HTMLファイルからカード情報を取得して集約
    for html_file in html_files:
        print(f"スクレイピング中: {os.path.basename(html_file)}")
        cards_data = scrape_cards_from_html(html_file)
        all_cards_data.extend(cards_data)
        print(f"{len(cards_data)}件のカード情報を取得しました")
    
    # 取得したデータの概要を表示
    print(f"合計{len(all_cards_data)}件のカード情報を取得しました")
    
    # JSONファイルに保存
    save_to_json(all_cards_data, output_file)


if __name__ == "__main__":
    main()