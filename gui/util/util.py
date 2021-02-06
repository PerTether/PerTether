import json
import yaml


def read_json(path):
    with open(path, 'r') as load_f:
        return json.load(load_f)


def read_yaml(path):
    with open(path, 'r') as load_f:
        return yaml.load(load_f)


def write_json(path, dict):
    file = open(path, 'w', encoding='utf-8')
    json.dump(dict, file, ensure_ascii=False)
    file.close()


def write_yaml(path, dict):
    file = open(path, 'w', encoding='utf-8')
    yaml.dump(dict, file, default_flow_style=False)
    file.close()
