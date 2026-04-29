
from extensions import db

class Expense(db.Model):
    __tablename__ = "expenses"
    id             = db.Column(db.Integer, primary_key=True)
    season_id      = db.Column(db.Integer, db.ForeignKey("seasons.id"), nullable=False)
    category       = db.Column(db.String(50),  nullable=False)
    description    = db.Column(db.String(255))
    amount         = db.Column(db.Float, nullable=False)
    expense_date   = db.Column(db.Date, nullable=False)
    bill_photo_url = db.Column(db.String(500))
    created_at     = db.Column(db.DateTime, server_default=db.func.now())