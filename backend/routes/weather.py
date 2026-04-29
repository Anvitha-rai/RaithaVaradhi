
import requests as req
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from extensions import db
from models.weather_log import WeatherLog
from datetime import date

weather_bp = Blueprint("weather", __name__)

OWM_API_KEY = "d7ea3041158b03a9671b96b63b6adf94"

@weather_bp.route("/fetch/<int:season_id>", methods=["POST"])
@jwt_required()
def fetch_weather(season_id):
    data     = request.get_json()
    district = data.get("district", "Bengaluru")
    url      = f"https://api.openweathermap.org/data/2.5/weather?q={district},IN&appid={OWM_API_KEY}&units=metric"
    resp     = req.get(url)

    if resp.status_code != 200:
        return jsonify({"error": "Could not fetch weather data"}), 502

    w   = resp.json()
    log = WeatherLog(
        season_id         = season_id,
        log_date          = date.today(),
        temperature_c     = w["main"]["temp"],
        rainfall_mm       = w.get("rain", {}).get("1h", 0),
        humidity_pct      = w["main"]["humidity"],
        weather_condition = w["weather"][0]["description"]
    )
    db.session.add(log)
    db.session.commit()
    return jsonify({"message": "Weather logged", "temperature_c": log.temperature_c}), 201

@weather_bp.route("/<int:season_id>", methods=["GET"])
@jwt_required()
def get_weather(season_id):
    logs = WeatherLog.query.filter_by(season_id=season_id).all()
    return jsonify([{
        "log_date"         : str(l.log_date),
        "temperature_c"    : l.temperature_c,
        "rainfall_mm"      : l.rainfall_mm,
        "humidity_pct"     : l.humidity_pct,
        "weather_condition": l.weather_condition
    } for l in logs]), 200