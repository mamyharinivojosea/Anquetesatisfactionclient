import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "cle-secrete-dev")
    SQLALCHEMY_DATABASE_URI = (
        "mysql+pymysql://root:@localhost/asecna_survey_db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False