
# backend/routes/seasons.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.season import Season

seasons_bp = Blueprint("seasons", __name__)

@seasons_bp.route("/", methods=["POST"])
@jwt_required()
def add_season():
    farmer_id = int(get_jwt_identity())
    data      = request.get_json()
    season = Season(
        farmer_id   = farmer_id,
        field_id    = data["field_id"],
        crop_name   = data["crop_name"],
        season_type = data["season_type"],
        start_date  = data["start_date"],
        end_date    = data.get("end_date"),
        status      = data.get("status", "active")
    )
    db.session.add(season)
    db.session.commit()
    return jsonify({"message": "Season added", "id": season.id}), 201

@seasons_bp.route("/", methods=["GET"])
@jwt_required()
def get_seasons():
    farmer_id = int(get_jwt_identity())
    seasons   = Season.query.filter_by(farmer_id=farmer_id).all()
    return jsonify([{
        "id"         : s.id,
        "crop_name"  : s.crop_name,
        "season_type": s.season_type,
        "start_date" : str(s.start_date),
        "end_date"   : str(s.end_date) if s.end_date else None,
        "status"     : s.status,
        "field_id"   : s.field_id
    } for s in seasons]), 200