# backend/routes/fields.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.field import Field

fields_bp = Blueprint("fields", __name__)

@fields_bp.route("/", methods=["POST"])
@jwt_required()
def add_field():
    farmer_id = int(get_jwt_identity())
    data      = request.get_json()
    field = Field(
        farmer_id      = farmer_id,
        field_name     = data["field_name"],
        area_acres     = data["area_acres"],
        soil_type      = data.get("soil_type"),
        location_notes = data.get("location_notes")
    )
    db.session.add(field)
    db.session.commit()
    return jsonify({"message": "Field added", "id": field.id}), 201

@fields_bp.route("/", methods=["GET"])
@jwt_required()
def get_fields():
    farmer_id = int(get_jwt_identity())
    fields    = Field.query.filter_by(farmer_id=farmer_id).all()
    return jsonify([{
        "id"            : f.id,
        "field_name"    : f.field_name,
        "area_acres"    : f.area_acres,
        "soil_type"     : f.soil_type,
        "location_notes": f.location_notes
    } for f in fields]), 200