# backend/models/farmer.py
from extensions import db

class Farmer(db.Model):
    __tablename__ = "farmers"
    id               = db.Column(db.Integer, primary_key=True)
    name             = db.Column(db.String(100), nullable=False)
    phone            = db.Column(db.String(15),  nullable=False, unique=True)
    email            = db.Column(db.String(100), unique=True)
    password_hash    = db.Column(db.String(255), nullable=False)
    village          = db.Column(db.String(100))
    district         = db.Column(db.String(100))
    state            = db.Column(db.String(100))
    total_land_acres = db.Column(db.Float, default=0)
    created_at       = db.Column(db.DateTime, server_default=db.func.now())

    fields  = db.relationship("Field",  backref="farmer", lazy=True, cascade="all, delete")
    seasons = db.relationship("Season", backref="farmer", lazy=True, cascade="all, delete")