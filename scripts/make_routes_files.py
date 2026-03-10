# Создает routes-list.js, который используется для отрисовки карты.
# Создает routes.json, который используется для создания статичных страниц маршрутов.

import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import json
from config import ROUTES_LIST_JS_PATH, ROUTES_JSON_PATH
from utils.geo_routes_excel_handler import GeoRoutesExcelHandler
from utils.string_utils import remove_patterns
from utils.stations_handler import StationsHandler
import calendar
from datetime import datetime, timedelta


gr_workbook = GeoRoutesExcelHandler()
stations_handler = StationsHandler()

routes = gr_workbook.routes_json
routes_handled = []


def string_value_to_bool(key):
    return True if i[key] == "y" else False


def empty_to_none(val):
    """Пустую строку или None превращает в None (для вывода null в JSON)."""
    if val is None:
        return None
    if isinstance(val, str) and val.strip() == "":
        return None
    return val


def to_unixtime(val):
    """Преобразует значение из таблицы в Unix timestamp в миллисекундах (UTC). Пустое -> None."""
    if val is None or (isinstance(val, str) and val.strip() == ""):
        return None
    if isinstance(val, (int, float)):
        num = float(val)
        if num >= 1e12:
            return int(num)  # уже в миллисекундах
        if num >= 1e9:
            return int(num * 1000)  # в секундах -> в миллисекунды
        # Excel serial (дни с 1899-12-30), трактуем как UTC
        epoch = datetime(1899, 12, 30)
        dt = epoch + timedelta(days=num)
        return calendar.timegm(dt.timetuple()) * 1000
    s = val.strip()
    # Форматы: ISO, EU (d.m.y), US (m/d/y), d/m/y — дата как полночь UTC
    for fmt in ("%Y-%m-%d", "%d.%m.%Y", "%m/%d/%Y", "%d/%m/%Y", "%Y-%m-%d %H:%M:%S", "%d.%m.%Y %H:%M"):
        try:
            dt = datetime.strptime(s, fmt)
            return calendar.timegm(dt.timetuple()) * 1000
        except ValueError:
            continue
    return None


def get_time_difference(start, end):
    if start in ['-', '', None] or end in ['-', '', None]:
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
    try:
        ref_int = int(float(route_ref))
    except (ValueError, TypeError):
        return False
    for route in routes:
        try:
            if int(float(route["ref"])) == ref_int:
                return str(route.get("active", "")).strip().lower() == "y"
        except (ValueError, TypeError, KeyError):
            continue
    return False


for i in routes:
    print(f"Processing route {i['ref']}")
    if i["show_on_site"] == 'n':
        continue
    route = {"id": int(i["id"]),
             "ref": int(i["ref"]),
             "name:ka": remove_patterns(i["name_ka"]),
             "name:en": remove_patterns(i["name_en"]),
             "name:ru": remove_patterns(i["name_ru"]),
             "active": string_value_to_bool("active"),
             "frequency": empty_to_none(i["frequency"]),
             "every_second_day_start": to_unixtime(i["every_second_day_start"]),
             "end_date": to_unixtime(i["end_date"]),
             "complete": string_value_to_bool("complete"),
             "online": string_value_to_bool("online"),
             "online_tickets_current_site": string_value_to_bool("online_tickets_current_site"),
             "online_tickets_new_site": string_value_to_bool("online_tickets_new_site"),
             "train_type": empty_to_none(i["train_type"]),
             "has_arrival_time": string_value_to_bool("has_arrival_time"),
             "description_en": empty_to_none(i["description_en"]),
             "description_ru": empty_to_none(i["description_ru"]),
             "description_ka": empty_to_none(i["description_ka"])
             }
    # Routes from excel (if route sheet exists)
    if gr_workbook.is_sheet_exists(i["ref"]):
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
                station_data['departure_time'] = station['departure_time'] if station['departure_time'] != '' else '-'
                station_data['arrival_time'] = station['arrival_time'] if station['arrival_time'] != '' else '-'
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
    # analogue: пустая строка — нет аналогов; одно число — один аналог; числа через запятую без пробела — несколько
    # заголовок в таблице может быть "analogue", "Analogue", "аналог" и т.д.
    analogue_val = None
    for key in ("analogue", "Analogue", "Аналог", "аналог"):
        if key in i and i[key] is not None and str(i[key]).strip() != "":
            analogue_val = i[key]
            break
    analogue_str = str(analogue_val or "").strip()
    if not analogue_str:
        route["analogue"] = []
    else:
        parts = [p.strip() for p in analogue_str.split(",") if p.strip()]
        refs = []
        for p in parts:
            try:
                refs.append(str(int(float(p))))  # "11.0" из Excel → "11"
            except (ValueError, TypeError):
                continue
        route["analogue"] = [ref for ref in refs if is_route_active(ref, routes)]
    routes_handled.append(route)

json_result = json.dumps(sorted(routes_handled, key=lambda x: int(x["ref"])), ensure_ascii=False, indent=3)
js_result = "export const routes = " + json_result

with open(ROUTES_LIST_JS_PATH, 'w', encoding="utf-8") as js_file:
    js_file.write(js_result)
print("routes-list.js was successfully updated")

with open(ROUTES_JSON_PATH, 'w', encoding="utf-8") as json_file:
    json_file.write(json_result)
print("routes.json was successfully updated")
