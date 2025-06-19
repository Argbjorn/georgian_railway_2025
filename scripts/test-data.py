#!/usr/bin/env python3
"""
Простой тест на существование data файлов
"""

import os
import sys
import json

def test_data_files_exist():
    """Проверяет существование обязательных data файлов"""
    required_files = [
        'data/routes.json',
        'data/stations.json'
    ]
    
    missing_files = []
    
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
            print(f"❌ Файл не найден: {file_path}")
        else:
            print(f"✅ Файл найден: {file_path}")
    
    if missing_files:
        print(f"\n❌ Тест провален: отсутствуют файлы: {', '.join(missing_files)}")
        return False
    else:
        print(f"\n✅ Тест пройден: все файлы существуют")
        return True

if __name__ == "__main__":
    success = test_data_files_exist()
    sys.exit(0 if success else 1) 