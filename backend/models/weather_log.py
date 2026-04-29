# backend/models/weather_log.py
from extensions import db

class WeatherLog(db.Model):
    __tablename__ = "weather_logs"
    id                = db.Column(db.Integer, primary_key=True)
    season_id         = db.Column(db.Integer, db.ForeignKey("seasons.id"), nullable=False)
    log_date          = db.Column(db.Date, nullable=False)
    temperature_c     = db.Column(db.Float)
    rainfall_mm       = db.Column(db.Float, default=0)
    humidity_pct      = db.Column(db.Float)
    weather_condition = db.Column(db.String(100))