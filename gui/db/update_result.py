import time

from db import db_helper
import json

with open("../static/json/config0.json", 'r') as load_f:
    load_dict = json.load(load_f)
    load_dict['status'] = 'pending'
    load_dict['startTime'] = int(time.time())
    load_dict['user'] = 'zy'
    id = db_helper.insert(load_dict)

with open("../static/json/result.json", 'r') as load_f:
    load_dict = json.load(load_f)
    db_helper.update_result(id, load_dict['result'])
