import json
from config import STATIONS_LIST_JS_PATH


class StationsHandler:
    def __init__(self):
        self.file_path = STATIONS_LIST_JS_PATH

    def get_station_names_by_code(self, code):
        with open(self.file_path, 'r', encoding='utf-8') as file:
            stations = json.loads(file.read().lstrip('export const stations = '))
            for station in stations:
                if station['code'] == code:
                    return [station['name_en'], station['name_ru'], station['name_ka']]
            return ['unknown station', 'неизвестная станция', 'unknown station']
