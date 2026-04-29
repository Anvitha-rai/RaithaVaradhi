
from extensions import db

class Income(db.Model):
    __tablename__ = "income"
    id                = db.Column(db.Integer, primary_key=True)
    season_id         = db.Column(db.Integer, db.ForeignKey("seasons.id"), nullable=False)
    crop_sold         = db.Column(db.String(100), nullable=False)
    quantity_kg       = db.Column(db.Float, nullable=False)
    price_per_kg      = db.Column(db.Float, nullable=False)
    total_amount      = db.Column(db.Float)
    mandi_name        = db.Column(db.String(100))
    sold_date         = db.Column(db.Date, nullable=False)
    receipt_photo_url = db.Column(db.String(500))
    created_at        = db.Column(db.DateTime, server_default=db.func.now())