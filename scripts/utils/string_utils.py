import re


class Bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def remove_patterns(text):
    patterns = [
        r'მატარებელი #\d+:',
        r'Train #\d+:',
        r'Поезд №\d+:'
    ]
    for pattern in patterns:
        text = re.sub(pattern, '', text)
    return text.strip()


def remove_shit_chars(string):
    shit_chars = ['&nbsp;', '\n', '\t', ' ']
    return ''.join([string[i] for i in range(len(string)) if string[i] not in shit_chars]).replace('&nbsp; ', '')


def make_station_code(station_name_en):
    return "".join(station_name_en.lower().split()).replace('-', '')
