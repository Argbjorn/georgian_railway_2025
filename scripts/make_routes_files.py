# Создает routes-list.js, который используется для отрисовки карты.
# Создает routes.json, который используется для создания статичных страниц маршрутов.

import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json
from config import ROUTES_LIST_JS_PATH, ROUTES_JSON_PATH
from utils.parse_train_schedule import get_timetable
from utils.geo_routes_excel_handler import GeoRoutesExcelHandler
from utils.string_utils import remove_patterns
from utils.stations_handler import StationsHandler
from datetime import datetime, timedelta


gr_workbook = GeoRoutesExcelHandler()
actual_timetable = get_timetable()
stations_handler = StationsHandler()

routes = gr_workbook.routes_json
routes_handled = []


def string_value_to_bool(key):
    return True if i[key] == "y" else False


def get_time_difference(start, end):
    if start == '-' or end == '-':
        return None
    start_dt = datetime.strptime(start, '%H:%M')
    end_dt = datetime.strptime(end, '%H:%M')
    diff = end_dt - start_dt if end_dt > start_dt else end_dt + timedelta(hours=24) - start_dt
    return int(diff.total_seconds() / 60)


def get_route_travel_time(stations):
    if stations[1]['arrival_time'] is None:
        start = stations[0]['departure_time']
        end = stations[-1]['departure_time']
    else:
        start = stations[0]['departure_time']
        end = stations[-1]['arrival_time']
    
    if start == '-' or end == '-':
        return '-'
    
    start_dt = datetime.strptime(start, '%H:%M')
    end_dt = datetime.strptime(end, '%H:%M')
    diff = end_dt - start_dt if end_dt > start_dt else end_dt + timedelta(hours=24) - start_dt
    
    total_minutes = int(diff.total_seconds() / 60)
    hours = total_minutes // 60
    minutes = total_minutes % 60
    
    return f"{hours:02d}:{minutes:02d}"


def get_route_price(*args):
    prices = list(args)
    real_prices = []
    for price in prices:
        if price is not None:
            real_prices.append(price)
    if len(real_prices) == 0:
        return None
    elif len(real_prices) == 1:
        return {"price_type": "exact", "price": real_prices[0]}
    else:
        return {"price_type": "from", "price": min(real_prices)}


def is_route_active(route_ref, routes):
    for route in routes:
        if route["ref"] == int(route_ref):
            return route["active"] == 'y'
    return False


for i in routes:
    if i["show_on_site"] == 'n':
        continue
    route = {"id": i["id"],
             "ref": i["ref"],
             "name:ka": remove_patterns(i["name_ka"]),
             "name:en": remove_patterns(i["name_en"]),
             "name:ru": remove_patterns(i["name_ru"]),
             "active": string_value_to_bool("active"),
             "frequency": i["frequency"],
             "every_second_day_start": i["every_second_day_start"],
             "end_date": i["end_date"],
             "complete": string_value_to_bool("complete"),
             "online": string_value_to_bool("online"),
             "online_tickets_current_site": string_value_to_bool("online_tickets_current_site"),
             "online_tickets_new_site": string_value_to_bool("online_tickets_new_site"),
             "train_type": i["train_type"],
             "has_arrival_time": string_value_to_bool("has_arrival_time"),
             "description_en": i["description_en"],
             "description_ru": i["description_ru"],
             "description_ka": i["description_ka"]
             }
    # Routes from full timetable from the website
    if i['ref'] in actual_timetable:
        stations_json = actual_timetable[i['ref']]
        station = stations_json[0]
        name_en, name_ru, name_ka = stations_handler.get_station_names_by_code(station[0])
        stations_temp = [{"code": station[0],
                          "role": "start",
                          "time": station[1],
                          "name_en": name_en,
                          "name_ru": name_ru,
                          "name_ka": name_ka}]

        for j in stations_json[1:-1]:
            name_en, name_ru, name_ka = stations_handler.get_station_names_by_code(j[0])
            stations_temp.append(
                {"code": j[0],
                 "role": "middle",
                 "time": j[1],
                 "name_en": name_en,
                 "name_ru": name_ru,
                 "name_ka": name_ka})

        station = stations_json[-1]
        name_en, name_ru, name_ka = stations_handler.get_station_names_by_code(station[0])
        stations_temp.append(
            {"code": station[0],
             "role": "end",
             "time": station[1],
             "name_en": name_en,
             "name_ru": name_ru,
             "name_ka": name_ka})
        route["stations"] = stations_temp
    # Routes from excel (if route sheet exists)
    elif gr_workbook.is_sheet_exists(i["ref"]):
        stations_temp = []
        stations_json = gr_workbook.get_route_stations_with_time(route["ref"])
        
        for idx, station in enumerate(stations_json):
            name_en, name_ru, name_ka = stations_handler.get_station_names_by_code(station['station'])
            role = "start" if idx == 0 else "end" if idx == len(stations_json) - 1 else "middle"
            
            station_data = {
                "code": station['station'],
                "role": role,
                "name_en": name_en,
                "name_ru": name_ru,
                "name_ka": name_ka
            }
            
            if 'time' in station:
                station_data['departure_time'] = station['time'] if station['time'] is not None else 'nn:nn'
                station_data['arrival_time'] = None
                station_data['stop_time'] = None
            else:
                station_data['departure_time'] = station['departure_time'] if station['departure_time'] is not None else '-'
                station_data['arrival_time'] = station['arrival_time'] if station['arrival_time'] is not None else '-'
                station_data['stop_time'] = get_time_difference(station_data['arrival_time'], station_data['departure_time'])
            
            stations_temp.append(station_data)
            
        route["stations"] = stations_temp
    # Routes from excel main sheet (if route sheet doesn't exist)
    else:
        pass
    if i['active'] == 'y':
        route['travel_time'] = get_route_travel_time(route['stations'])
    route['price'] = get_route_price(float(i["price_2_class"]) if i["price_2_class"] else None,
                                     float(i["price_1_class"]) if i["price_1_class"] else None,
                                     float(i["price_business"]) if i["price_business"] else None,
                                     float(i["price_standard"]) if i["price_standard"] else None)
    if i["analogue"]:
        # Если в таблице есть только по 0 или 1 аналогу, то в json будет float в поле analogue. Если больше 1, то int
        if type(i["analogue"]) == float:
            a = str(int(i["analogue"])).split(',')
        else:
            a = str(i["analogue"]).split(',')
        route["analogue"] = [j for j in a if is_route_active(j, routes)]
    else:
        route["analogue"] = []
    routes_handled.append(route)

json_result = json.dumps(sorted(routes_handled, key=lambda x: int(x["ref"])), ensure_ascii=False, indent=3)
js_result = "export const routes = " + json_result

with open(ROUTES_LIST_JS_PATH, 'w', encoding="utf-8") as js_file:
    js_file.write(js_result)
print("routes-list.js was successfully updated")

with open(ROUTES_JSON_PATH, 'w', encoding="utf-8") as json_file:
    json_file.write(json_result)
print("routes.json was successfully updated")
