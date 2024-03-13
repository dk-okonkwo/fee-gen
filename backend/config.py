import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get('DATABASE_URL')
#  postgresql://fee_generator_user:xV3iag0I4DddsLHsfh78f7dtQOTuAZEr@dpg-cnochuud3nmc739f3iog-a.oregon-postgres.render.com/fee_generator
#  "sqlite:///mydatabase.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
