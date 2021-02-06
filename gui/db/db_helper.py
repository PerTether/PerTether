import pymongo
from bson import ObjectId

my_client = pymongo.MongoClient('mongodb://127.0.0.1:27017')
db = my_client['pertether']
test = db['test']
users = db['users']


def insert(data):
    return test.insert(data)


def delete(_id):
    return test.delete_one({'_id': ObjectId(_id)})


def update_result(_id, result):
    condition = {'_id': ObjectId(_id)}
    tmp = test.find_one(condition)
    tmp['status'] = 'finished'
    tmp['result'] = result
    msg = test.update_one(condition, {"$set": tmp})
    print(msg)


def get_all():
    return test.find()


def get_by_username(username):
    return test.find({'user': username})


def get_one(id):
    tmp = test.find_one({'_id': ObjectId(id)})
    return tmp


def create_new_user(username, type):
    new_user = {
        'username': username,
        'type': type,
        'subscribedUsers': []
    }
    users.insert(new_user)


def get_user(username):
    tmp = users.find_one({'username': username})
    return tmp


def update_user_sub(username, subscribe_users):
    user = get_user(username)
    user['subscribedUsers'] = subscribe_users
    msg = users.update_one({'username': username}, {"$set": user})
    print(msg)
