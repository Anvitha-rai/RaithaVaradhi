
from extensions import db

class Field(db.Model):
    __tablename__ = "fields"
    id             = db.Column(db.Integer, primary_key=True)
    farmer_id      = db.Column(db.Integer, db.ForeignKey("farmers.id"), nullable=False)
    field_name     = db.Column(db.String(100), nullable=False)
    area_acres     = db.Column(db.Float, nullable=False)
    soil_type      = db.Column(db.String(50))
    location_notes = db.Column(db.String(255))

    seasons = db.relationship("Season", backref="field", lazy=True, cascade="all, delete")