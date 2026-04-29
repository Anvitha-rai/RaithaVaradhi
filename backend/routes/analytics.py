# backend/routes/analytics.py
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.income  import Income
from models.season  import Season
from collections    import defaultdict

analytics_bp = Blueprint("analytics", __name__)

@analytics_bp.route("/best-sell-time/<string:crop_name>", methods=["GET"])
@jwt_required()
def best_sell_time(crop_name):
    farmer_id = int(get_jwt_identity())

    seasons = Season.query.filter_by(farmer_id=farmer_id).all()
    season_ids = [s.id for s in seasons]

    all_income = Income.query.filter(Income.season_id.in_(season_ids)).all()

    crop_income = [i for i in all_income if i.crop_sold.lower() == crop_name.lower()]

    if not crop_income:
        return jsonify({"message": f"No sales history found for {crop_name}"}), 404

    monthly = defaultdict(list)
    for i in crop_income:
        if i.sold_date:
            month = i.sold_date.strftime("%B")
            monthly[month].append(i.price_per_kg)

    monthly_avg = {
        month: round(sum(prices) / len(prices), 2)
        for month, prices in monthly.items()
    }

    best_month = max(monthly_avg, key=monthly_avg.get)
    best_price = monthly_avg[best_month]

    return jsonify({
        "crop"            : crop_name,
        "best_month"      : best_month,
        "avg_price_per_kg": best_price,
        "monthly_breakdown": monthly_avg,
        "message"         : f"Based on your history, {best_month} gives the best price for {crop_name} at ₹{best_price}/kg on average."
    }), 200


@analytics_bp.route("/crop-ranking", methods=["GET"])
@jwt_required()
def crop_ranking():
    farmer_id = int(get_jwt_identity())

    seasons = Season.query.filter_by(farmer_id=farmer_id).all()

    ranking = []
    for season in seasons:
        incomes  = Income.query.filter_by(season_id=season.id).all()
        expenses = __import__("models.expense", fromlist=["Expense"]).Expense.query.filter_by(season_id=season.id).all()

        total_income   = sum(i.total_amount for i in incomes  if i.total_amount) or 0
        total_expenses = sum(e.amount       for e in expenses)                   or 0
        profit         = round(total_income - total_expenses, 2)

        ranking.append({
            "season_id"  : season.id,
            "crop"       : season.crop_name,
            "season_type": season.season_type,
            "profit"     : profit,
            "income"     : total_income,
            "expenses"   : total_expenses
        })

    ranking.sort(key=lambda x: x["profit"], reverse=True)

    return jsonify({
        "ranking": ranking,
        "best_crop": ranking[0]["crop"] if ranking else None
    }), 200