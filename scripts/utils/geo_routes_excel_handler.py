import pandas as pd
import json
from pathlib import Path

file_path = Path(__file__).parent.parent / "data" / "geo_routes.xlsx"


class GeoRoutesExcelHandler:
    def __init__(self):
        self.file_path = file_path
        self.routes_json = json.loads(pd.read_excel(self.file_path, sheet_name='routes').to_json(orient='records', force_ascii=False))

    def _get_json_from_sheet(self, sheet_name):
        return json.loads(pd.read_excel(self.file_path, sheet_name=str(sheet_name)).to_json(orient='records', force_ascii=False))

    def is_sheet_exists(self, sheet_name):
        sheet_names = pd.ExcelFile(self.file_path).sheet_names
        return str(sheet_name) in sheet_names

    def get_route_osm_id(self, route_ref):
        for route in self.routes_json:
            if route['ref'] == int(route_ref):
                return route['id']
        raise ValueError(f"There's no route number {route_ref}")

    def get_all_routes_osm_id(self):
        return [route['id'] for route in self.routes_json]

    def get_all_routes_ref(self):
        return [route['ref'] for route in self.routes_json]

    def get_all_active_routes_ref(self):
        return [route['ref'] for route in self.routes_json if route['active'] == 'y']

    def get_route_stations(self, route_ref):
        if self.is_sheet_exists(route_ref):
            sheet_json = self._get_json_from_sheet(route_ref)
            return [station['station'] for station in sheet_json]
        else:
            raise ValueError(f"There's no route number {route_ref}")

    def get_route_stations_with_time(self, route_ref):
        if self.is_sheet_exists(route_ref):
            sheet_json = self._get_json_from_sheet(route_ref)
            return [station for station in sheet_json]
        else:
            raise ValueError(f"There's no route number {route_ref}")