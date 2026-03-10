# check_all_routes() сопоставляет станции на маршрутах в OSM и в excel, возвращая разницу.

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.geo_routes_excel_handler import GeoRoutesExcelHandler
from utils.overpass_handler import OverpassHandler
from utils.string_utils import *

gr_workbook = GeoRoutesExcelHandler()
overpass = OverpassHandler()


def get_actual_route_stations(route_ref):
    route_id = gr_workbook.get_route_osm_id(route_ref)
    stations = overpass.get_route_stations_id(route_id)
    codes = overpass.get_stations_code(stations)
    return codes


def station_lists_diff(local_stations, osm_stations):
    if local_stations == osm_stations:
        return False, None, None
    else:
        osm_diff = []
        local_diff = []
        for local_station in local_stations:
            if local_station not in osm_stations:
                local_diff.append(local_station)
        for osm_station in osm_stations:
            if osm_station not in local_stations:
                osm_diff.append(osm_station)
        return True, local_diff, osm_diff


def check_all_routes():
    routes_refs = gr_workbook.get_all_active_routes_ref()
    for route_ref in routes_refs:
        existing = gr_workbook.get_route_stations(route_ref)
        actual = get_actual_route_stations(route_ref)
        status = station_lists_diff(existing, actual)
        if status[0]:
            print(f'{Bcolors.WARNING}Route {route_ref} required a manual check{Bcolors.ENDC}')
            print(f'Stations that are only in local data: {status[1]}', sep='\n')
            print(f'Stations that are only in osm data: {status[2]}', sep='\n')
        else:
            print(f'{Bcolors.OKGREEN}Route {route_ref} is OK{Bcolors.ENDC}')


if __name__ == '__main__':
    check_all_routes()
