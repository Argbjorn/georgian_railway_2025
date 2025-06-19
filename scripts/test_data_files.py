#!/usr/bin/env python3
"""
Тесты для data файлов с использованием pytest
"""

import os
import json
import pytest
import fastjsonschema
from datetime import datetime

# Пути к обязательным файлам
ROUTES_FILE = 'data/routes.json'
STATIONS_FILE = 'data/stations.json'

REQUIRED_FILES = [
    ROUTES_FILE,
    STATIONS_FILE
]

ROUTE_SCHEMA = {
    "$schema": "http://json-schema.org/schema#",
    "title": "Route",
    "type": "object",
    "properties": {
        "id": {"type": "integer"},
        "ref": {"type": "integer"},
        "name:ka": {"type": "string"},
        "name:en": {"type": "string"},
        "name:ru": {"type": "string"},
        "frequency": {"type": "string", 
                      "enum": ["daily", "every second day"]},
        "every_second_day_start": {"type": ["integer", "null"]},
        "complete": {"type": "boolean"},
        "online": {"type": "boolean"},
        "online_tickets_current_site": {"type": "boolean"},
        "online_tickets_new_site": {"type": "boolean"},
        "train_type": {"type": ["string", "null"]},
        "has_arrival_time": {"type": "boolean"},
        "description_en": {"type": ["string", "null"]},
        "description_ru": {"type": ["string", "null"]},
        "description_ka": {"type": ["string", "null"]},
        "stations": {"type": "array",
                     "items": {"type": "object",
                               "properties": {
                                "code": {"type": "string"},
                                "role": {"type": "string",
                                         "enum": ["start", "middle", "end"]},
                                "name_en": {"type": "string"},
                                "name_ru": {"type": "string"},
                                "name_ka": {"type": "string"},
                                "departure_time": {"type": "string"},
                                "arrival_time": {"type": ["string", "null"]},
                                "stop_time": {"type": ["integer", "null"]}
                               },
                               "required": ["code", "role", "name_en", "name_ru", "name_ka", "departure_time"]
                               }},
        "travel_time": {"type": "string"},
        "price": {"type": ["object", "null"],
                  "properties": {
                    "price_type": {"type": "string",
                                    "enum": ["exact", "from"]},
                    "price": {"type": "number",
                              "minimum": 0}
                  },
                  "required": ["price_type", "price"]
                  },
        "analogue": {"type": ["array", "null"]}
    },
    "required": ["id", "ref", "name:ka", "name:en", "name:ru", "frequency", "complete", "online", "online_tickets_current_site", "online_tickets_new_site", "has_arrival_time", "stations", "travel_time"]
}

@pytest.fixture(scope="class")
def routes_data():
    with open(ROUTES_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

@pytest.mark.data
class TestDataFiles:
    """Тесты для проверки data файлов"""
    
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

    def test_routes_file_schema(self, routes_data):
        """Проверяет, что файл routes.json соответствует схеме"""
        route_validator = fastjsonschema.compile(ROUTE_SCHEMA)
        for route in routes_data:
            try:
                route_validator(route)
            except fastjsonschema.JsonSchemaException as e:
                pytest.fail(f"Маршрут {route['ref']} (id: {route['id']}) не соответствует схеме: {e}")

    def test_travel_time_is_reasonable(self, routes_data):
        """Проверяет, что время в пути в диапазоне от 0 до 24 часов"""
        for route in routes_data:
            travel_time = route['travel_time']
            if travel_time:
                hours, minutes = map(int, travel_time.split(':'))
                total_minutes = hours * 60 + minutes
                assert total_minutes <= 24 * 60 and total_minutes > 0, f"Время в пути для маршрута {route['ref']} (id: {route['id']}) превышает 24 часа или меньше 0"

    def test_stations_have_correct_roles(self, routes_data):
        """Проверяет, что станции маршрута имеют правильные роли"""
        for route in routes_data:
            for i, station in enumerate(route['stations']):
                if i == 0:
                    assert station['role'] == "start", f"Первая станция маршрута {route['ref']} (id: {route['id']}) имеет роль {station['role']}"
                elif i == len(route['stations']) - 1:
                    assert station['role'] == "end", f"Последняя станция маршрута {route['ref']} (id: {route['id']}) имеет роль {station['role']}"
                else:
                    assert station['role'] == "middle", f"Промежуточная станция маршрута {route['ref']} (id: {route['id']}) имеет роль {station['role']}"