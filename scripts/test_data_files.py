import os
import pytest
from utils import REQUIRED_FILES

@pytest.mark.data
class TestDataFiles:
    """Общие тесты для проверки data файлов"""
    
    def test_required_files_exist(self):
        """Проверяет существование всех обязательных файлов"""
        missing_files = []
        
        for file_path in REQUIRED_FILES:
            if not os.path.exists(file_path):
                missing_files.append(file_path)
        
        assert not missing_files, f"Отсутствуют файлы: {', '.join(missing_files)}"
    
    def test_files_are_not_empty(self):
        """Проверяет, что файлы не пустые"""
        for file_path in REQUIRED_FILES:
            file_size = os.path.getsize(file_path)
            assert file_size > 0, f"Файл {file_path} пустой"