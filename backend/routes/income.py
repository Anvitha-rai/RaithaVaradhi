# backend/routes/income.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from extensions import db
from models.income import Income

income_bp = Blueprint("income", __name__)

@income_bp.route("/", methods=["POST"])
@jwt_required()
def add_income():
    data  = request.get_json()
    qty   = float(data["quantity_kg"])
    price = float(data["price_per_kg"])
    inc   = Income(
        season_id    = int(data["season_id"]),
        crop_sold    = data["crop_sold"],
        quantity_kg  = qty,
        price_per_kg = price,
        total_amount = qty * price,
        mandi_name   = data.get("mandi_name"),
        sold_date    = data["sold_date"]
    )
    db.session.add(inc)
    db.session.commit()
    return jsonify({"message": "Income added", "id": inc.id}), 201

@income_bp.route("/<int:season_id>", methods=["GET"])
@jwt_required()
def get_income(season_id):
    incomes = Income.query.filter_by(season_id=season_id).all()
    return jsonify([{
        "id"          : i.id,
        "crop_sold"   : i.crop_sold,
        "quantity_kg" : i.quantity_kg,
        "price_per_kg": i.price_per_kg,
        "total_amount": i.total_amount,
        "mandi_name"  : i.mandi_name,
        "sold_date"   : str(i.sold_date)
    } for i in incomes]), 200

@income_bp.route("/summary/<int:season_id>", methods=["GET"])
@jwt_required()
def income_summary(season_id):
    incomes      = Income.query.filter_by(season_id=season_id).all()
    total_income = sum(i.total_amount for i in incomes if i.total_amount)
    return jsonify({"total_income": total_income}), 200