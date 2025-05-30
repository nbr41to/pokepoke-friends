#!/bin/bash
# スクリプト実行を自動化

# 仮想環境がなければ作成
if [ ! -d "./venv" ]; then
    echo "仮想環境を作成しています..."
    python3 -m venv ./venv
    source ./venv/bin/activate
    pip3 install requests beautifulsoup4
else
    source ./venv/bin/activate
fi

# スクリプトを順に実行
echo "=== get_data.py 実行中 ==="
python3 scripts/get_data.py || { echo "get_data.py の実行に失敗しました"; exit 1; }

echo "=== convert_card_data.py 実行中 ==="
python3 scripts/convert_card_data.py || { echo "convert_card_data.py の実行に失敗しました"; exit 1; }

echo "=== get_data_ja.py 実行中 ==="
python3 scripts/get_data_ja.py || { echo "get_data_ja.py の実行に失敗しました"; exit 1; }

echo "全てのスクリプトが正常に実行されました"
