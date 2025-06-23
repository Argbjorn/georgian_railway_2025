# Пути к обязательным файлам
ROUTES_FILE = 'data/routes.json'
STATIONS_FILE = 'data/stations.json'

REQUIRED_FILES = [
    ROUTES_FILE,
    STATIONS_FILE
]

def time_string_to_minutes(time_string):
    """Преобразует строку времени в формате HH:MM в минуты"""
    try:
        hours, minutes = map(int, time_string.split(":"))
        return hours * 60 + minutes
    except ValueError:
        raise ValueError(f"Неверный формат времени: {time_string}, ожидается HH:MM")