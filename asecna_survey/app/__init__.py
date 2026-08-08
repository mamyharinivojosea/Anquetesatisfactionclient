from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from app.config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)
    app.config.from_object(Config)
    db.init_app(app)

    with app.app_context():
        from app.models import Questionnaire, Question, Choix, Reponse, ReponseDetail

    from app.routes.enquete import enquete_bp
    from app.routes.admin import admin_bp
    app.register_blueprint(enquete_bp)
    app.register_blueprint(admin_bp)

    return app