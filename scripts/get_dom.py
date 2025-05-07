#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import requests
from bs4 import BeautifulSoup
import json
import os

def check_dependencies():
    """必要なライブラリがインストールされているか確認し、なければインストールを促す"""
    try:
        import requests
        import bs4
    except ImportError:
        print("必要なライブラリがインストールされていません。")
        print("以下のコマンドを実行してインストールしてください：")
        print("pip install beautifulsoup4 requests")
        sys.exit(1)

def fetch_pokemon_card_list(url):
    """指定されたURLからPokemonCardListのHTMLを取得する"""
    print(f"URLからデータを取得中: {url}")
    
    try:
        # User-Agentを設定してブラウザからのアクセスを偽装
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # エラーがあれば例外を発生
        
        # BeautifulSoupでHTMLをパース
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # PokemonCardListのIDを持つ要素を取得
        card_list_element = soup.find(id='PokemonCardList')
        
        if card_list_element:
            print("PokemonCardList要素を取得しました")
            return card_list_element
        else:
            print("PokemonCardList要素が見つかりませんでした")
            # IDが見つからない場合は、ページ全体を返す
            return soup
            
    except requests.exceptions.RequestException as e:
        print(f"エラー: リクエスト中に問題が発生しました: {e}")
        return None

def save_to_file(content, filename="gw.html"):
    """取得したHTMLをファイルに保存する"""
    try:
        with open(filename, "w", encoding="utf-8") as f:
            f.write(str(content))
        print(f"データを {filename} に保存しました")
    except Exception as e:
        print(f"ファイル保存中にエラーが発生しました: {e}")

def main():
    # 依存関係をチェック
    check_dependencies()
    
    # デフォルトURL
    default_url = "https://gamewith.jp/pokemon-tcg-pocket/462535"
    
    # コマンドライン引数からURLを取得（指定がなければデフォルトを使用）
    url = sys.argv[1] if len(sys.argv) > 1 else default_url
    
    # HTMLを取得
    content = fetch_pokemon_card_list(url)
    
    if content:
        # 結果を保存
        save_to_file(content)

if __name__ == "__main__":
    main()