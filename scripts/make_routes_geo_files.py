import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.overpass_handler import OverpassHandler
from utils.geo_routes_excel_handler import GeoRoutesExcelHandler
import json

overpass = OverpassHandler()
gr_workbook = GeoRoutesExcelHandler()

routes = gr_workbook.get_all_routes_osm_id()
print('Overpass data receiving')
routes_data = overpass.get_routes_data(routes)
print('Overpass data was received')

for route in routes_data['elements']:
    with open(f'C:/Users/user/georgian_railway_2025/static/data/routes_geodata/{route["id"]}.json', 'w', encoding="utf-8") as json_file:
        json_file.write(json.dumps(route))
    print(f'{route["id"]}.json was successfully updated')

