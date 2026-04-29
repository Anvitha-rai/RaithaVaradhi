# backend/routes/auth.py
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from extensions import db
from models.farmer import Farmer

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data.get("phone") or not data.get("password") or not data.get("name"):
        return jsonify({"error": "Name, phone and password are required"}), 400

    if Farmer.query.filter_by(phone=data["phone"]).first():
        return jsonify({"error": "Phone number already registered"}), 409

    farmer = Farmer(
        name             = data["name"],
        phone            = data["phone"],
        email            = data.get("email"),
        password_hash    = generate_password_hash(data["password"]),
        village          = data.get("village"),
        district         = data.get("district"),
        state            = data.get("state"),
        total_land_acres = data.get("total_land_acres", 0)
    )
    db.session.add(farmer)
    db.session.commit()
    return jsonify({"message": "Farmer registered successfully", "id": farmer.id}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    farmer = Farmer.query.filter_by(phone=data.get("phone")).first()
    if not farmer or not check_password_hash(farmer.password_hash, data.get("password", "")):
        return jsonify({"error": "Invalid phone or password"}), 401

    token = create_access_token(identity=str(farmer.id))
    return jsonify({
        "token"  : token,
        "farmer" : {"id": farmer.id, "name": farmer.name, "phone": farmer.phone}
    }), 200