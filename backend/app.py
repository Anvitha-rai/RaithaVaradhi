# backend/app.py
from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, jwt

from routes.auth     import auth_bp
from routes.fields   import fields_bp
from routes.seasons  import seasons_bp
from routes.expenses import expenses_bp
from routes.income   import income_bp
from routes.weather  import weather_bp
from routes.analytics import analytics_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    app.register_blueprint(auth_bp,     url_prefix="/api/auth")
    app.register_blueprint(fields_bp,   url_prefix="/api/fields")
    app.register_blueprint(seasons_bp,  url_prefix="/api/seasons")
    app.register_blueprint(expenses_bp, url_prefix="/api/expenses")
    app.register_blueprint(income_bp,   url_prefix="/api/income")
    app.register_blueprint(weather_bp,  url_prefix="/api/weather")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)