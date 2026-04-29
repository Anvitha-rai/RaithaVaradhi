# backend/routes/expenses.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from extensions import db
from models.expense import Expense

expenses_bp = Blueprint("expenses", __name__)

@expenses_bp.route("/", methods=["POST"])
@jwt_required()
def add_expense():
    data = request.get_json()
    expense = Expense(
        season_id    = data["season_id"],
        category     = data["category"],
        description  = data.get("description"),
        amount       = data["amount"],
        expense_date = data["expense_date"]
    )
    db.session.add(expense)
    db.session.commit()
    return jsonify({"message": "Expense added", "id": expense.id}), 201

@expenses_bp.route("/<int:season_id>", methods=["GET"])
@jwt_required()
def get_expenses(season_id):
    expenses = Expense.query.filter_by(season_id=season_id).all()
    return jsonify([{
        "id"          : e.id,
        "category"    : e.category,
        "description" : e.description,
        "amount"      : e.amount,
        "expense_date": str(e.expense_date)
    } for e in expenses]), 200

@expenses_bp.route("/summary/<int:season_id>", methods=["GET"])
@jwt_required()
def expense_summary(season_id):
    expenses = Expense.query.filter_by(season_id=season_id).all()
    total    = sum(e.amount for e in expenses)
    by_cat   = {}
    for e in expenses:
        by_cat[e.category] = by_cat.get(e.category, 0) + e.amount
    return jsonify({"total_expenses": total, "by_category": by_cat}), 200