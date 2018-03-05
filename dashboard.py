from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import os

app = Flask(__name__)

MONGODB_URI = os.environ.get('MONGODB_URI')
MONGO_DB_NAME = os.environ.get('MONGO_DB_NAME')
MONGO_COLLECTION_NAME = os.environ.get('MONGO_COLLECTION_NAME')


FIELDS = {'Tournament': True, 'Date': True, 'Year': True, 'Series': True, 'Surface': True,
    'Round': True, 'Winner': True, 'Loser': True, 'WRank': True, 'LRank': True, 'Wsets': True, 'Lsets': True,
    'W1': True, 'W2': True, 'W3': True, 'W4': True, 'W5': True,
    'L1': True, 'L2': True, 'L3': True, 'L4': True, 'L5': True, '_id': False}

@app.route("/")
def get_home_page():
    return render_template("index.html")

@app.route("/data")
def get_data():
    with MongoClient(MONGODB_URI) as conn:
        collection = conn[MONGO_DB_NAME][MONGO_COLLECTION_NAME]
        grandslams = collection.find(projection=FIELDS)
        return json.dumps(list(grandslams))




if __name__ == "__main__":
    app.run(host=os.getenv('IP', '0.0.0.0'),port=int(os.getenv('PORT', 8080)))