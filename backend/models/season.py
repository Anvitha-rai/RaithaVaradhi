
from extensions import db

class Season(db.Model):
    __tablename__ = "seasons"
    id          = db.Column(db.Integer, primary_key=True)
    farmer_id   = db.Column(db.Integer, db.ForeignKey("farmers.id"), nullable=False)
    field_id    = db.Column(db.Integer, db.ForeignKey("fields.id"),  nullable=False)
    crop_name   = db.Column(db.String(100), nullable=False)
    season_type = db.Column(db.Enum("kharif", "rabi", "zaid"), nullable=False)
    start_date  = db.Column(db.Date, nullable=False)
    end_date    = db.Column(db.Date)
    status      = db.Column(db.Enum("active", "completed"), default="active")

    expenses     = db.relationship("Expense",    backref="season", lazy=True, cascade="all, delete")
    incomes      = db.relationship("Income",     backref="season", lazy=True, cascade="all, delete")
    weather_logs = db.relationship("WeatherLog", backref="season", lazy=True, cascade="all, delete")