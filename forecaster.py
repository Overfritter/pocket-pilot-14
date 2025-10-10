"""
FinTant — MVP LangGraph

This file defines a minimal, production-leaning LangGraph for the MVP agents:
- Income Forecaster
- Expense Radar
- Smart Allocator
- Safety Net (basic)
- Translator (LLM) translates actions back to user
- Orchestrator/Policy (embedded in flow)

Notes
-----
• Functions need to be replaced with real models. 
• Need to put in function for money movement.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, date
from typing import Any, Dict, List, Optional, TypedDict, Literal
from statistics import mean
from langgraph.graph import StateGraph, START, END

from dotenv import load_dotenv
load_dotenv()

# -----------------------------
# Domain Models (lightweight)
# -----------------------------
@dataclass
class Tx:
    id: str
    ts: datetime
    amount: float  # +income, -expense
    merchant: str
    category: str  # e.g., "salary", "groceries", "rent", "subscription", blablabla
    meta: Dict[str, Any] | None = None


class AllocationAction(TypedDict):
    kind: Literal["reserve", "save", "invest", "debt_paydown", "none"]
    amount: float
    target: str
    rationale: str
    requires_user_approval: bool


class AllocationPlan(TypedDict):
    currency: str
    shortfall: float  # >0 if we’re short against near-term obligations
    buffer_target: float
    buffer_after_plan: float
    actions: List[AllocationAction]


class IncomeForecast(TypedDict):
    horizon_days: int
    expected: float
    p10: float
    p90: float
    confidence: float


class UpcomingExpense(TypedDict):
    merchant: str
    due_date: date
    expected_amount: float
    certainty: float
    category: str


class SafetyOptions(TypedDict):
    options: List[Dict[str, Any]]  # e.g., [{"type":"reschedule","days":3}, ...]


class AppState(TypedDict):
    currency: str
    balances: Dict[str, float]             # {account_id: balance}
    transactions: List[Tx]
    income_forecast: Optional[IncomeForecast]
    upcoming_expenses: List[UpcomingExpense]
    allocation_plan: Optional[AllocationPlan]
    safety_options: Optional[SafetyOptions]
    narrative: Optional[str]
    status: Optional[str]


def _now() -> datetime:
    return datetime.now()


def total_liquid_balance(balances: Dict[str, float]) -> float:
    return sum(balances.values())


def last_n_weeks_income(txs: List[Tx], weeks: int = 8) -> List[float]:
    """Aggregate income by ISO week over the last N weeks."""
    if not txs:
        return []
    cutoff = _now() - timedelta(weeks=weeks)
    buckets: Dict[tuple, float] = {}
    for t in txs:
        if t.ts < cutoff or t.amount <= 0:
            continue
        y, w, _ = t.ts.isocalendar()
        buckets[(y, w)] = buckets.get((y, w), 0.0) + t.amount
    return list(buckets.values())

#@traceable
def detect_monthly_contracts(txs: List[Tx]) -> List[UpcomingExpense]:
    """Heuristic: recurring merchants with ~30±5 day spacing, last charge <35 days ago.
    Uses mean amount; predicts next due date ~30 days after last seen.
    """
    by_merchant: Dict[str, List[Tx]] = {}
    for t in txs:
        if t.amount >= 0:
            continue
        by_merchant.setdefault(t.merchant, []).append(t)

    results: List[UpcomingExpense] = []
    today = _now().date()
    for m, mts in by_merchant.items():
        if len(mts) < 2:
            continue
        mts_sorted = sorted(mts, key=lambda x: x.ts)
        gaps = [
            (mts_sorted[i].ts.date() - mts_sorted[i - 1].ts.date()).days
            for i in range(1, len(mts_sorted))
        ]
        if not gaps:
            continue
        avg_gap = mean(gaps)
        if 25 <= avg_gap <= 35:  # rough monthly
            last_tx = mts_sorted[-1]
            mean_amt = -mean([-x.amount for x in mts_sorted[-3:]])  # positive
            next_due = last_tx.ts.date() + timedelta(days=round(avg_gap))
            certainty = 0.6
            # If next_due already passed (missed), set within a week from today
            if next_due < today:
                next_due = today + timedelta(days=7)
                certainty = 0.4
            results.append(
                UpcomingExpense(
                    merchant=m,
                    due_date=next_due,
                    expected_amount=round(mean_amt, 2),
                    certainty=certainty,
                    category=mts_sorted[-1].category,
                )
            )
    return results


# -----------------------------
# Nodes
# -----------------------------

#Replace with a time series model
#@traceable
def node_income_forecaster(state: AppState) -> AppState:
    weeks = last_n_weeks_income(state.get("transactions", []), weeks=8)
    if not weeks:
        fc: IncomeForecast = {
            "horizon_days": 14,
            "expected": 0.0,
            "p10": 0.0,
            "p90": 0.0,
            "confidence": 0.25,
        }
        return {**state, "income_forecast": fc}

    exp = mean(weeks[-4:]) if len(weeks) >= 4 else mean(weeks)
    p10 = 0.6 * exp
    p90 = 1.4 * exp
    conf = min(1.0, 0.5 + 0.05 * len(weeks))
    fc = IncomeForecast(
        horizon_days=14, expected=round(exp, 2), p10=round(p10, 2), p90=round(p90, 2), confidence=round(conf, 2)
    )
    return {**state, "income_forecast": fc}

#@traceable
def node_expense_radar(state: AppState) -> AppState:
    upcoming = detect_monthly_contracts(state.get("transactions", []))
    return {**state, "upcoming_expenses": upcoming}

#@traceable
def _compute_allocation(state: AppState) -> AllocationPlan:
    currency = state.get("currency", "EUR")
    liquid = total_liquid_balance(state.get("balances", {}))
    fc = state.get("income_forecast") or IncomeForecast(
        horizon_days=14, expected=0.0, p10=0.0, p90=0.0, confidence=0.0
    )
    expenses = state.get("upcoming_expenses", [])

    # Consider obligations in the next 14 days
    today = _now().date()
    horizon = today + timedelta(days=14)
    due_soon = [e for e in expenses if e["due_date"] <= horizon]
    need_for_bills = sum(e["expected_amount"] for e in due_soon)

    # Minimal emergency buffer target (simple heuristic):
    buffer_target = max(200.0, 0.25 * max(need_for_bills, 200.0))

    # Projected cash = liquid + p10 income - near-term bills
    projected_cash = liquid + fc["p10"] - need_for_bills

    actions: List[AllocationAction] = []
    shortfall = 0.0

    if projected_cash < buffer_target:
        shortfall = round(buffer_target - projected_cash, 2)
        # Reserve what we can for bills first
        if need_for_bills > 0:
            actions.append(
                AllocationAction(
                    kind="reserve",
                    amount=min(need_for_bills, max(liquid, 0.0)),
                    target="bills_14d",
                    rationale="Cover upcoming bills first",
                    requires_user_approval=False,
                )
            )
    else:
        # We have surplus beyond buffer_target
        surplus = projected_cash - buffer_target
        # Add to emergency buffer up to target if not met
        buffer_gap = max(0.0, buffer_target - max(0.0, liquid - need_for_bills))
        add_to_buffer = min(buffer_gap, surplus)
        if add_to_buffer > 0:
            actions.append(
                AllocationAction(
                    kind="save",
                    amount=round(add_to_buffer, 2),
                    target="emergency_buffer",
                    rationale="Top up emergency buffer",
                    requires_user_approval=True,
                )
            )
            surplus -= add_to_buffer
        # Suggest an investment with any remaining surplus (MVP: suggestion only)
        invest_amt = max(0.0, round(surplus * 0.5, 2))
        if invest_amt > 0:
            actions.append(
                AllocationAction(
                    kind="invest",
                    amount=invest_amt,
                    target="values_index_placeholder",
                    rationale="Put part of surplus to work (values-aligned index)",
                    requires_user_approval=True,
                )
            )

    plan: AllocationPlan = {
        "currency": currency,
        "shortfall": round(shortfall, 2),
        "buffer_target": round(buffer_target, 2),
        "buffer_after_plan": round(max(projected_cash, 0.0), 2),
        "actions": actions,
    }
    return plan

#@traceable
def node_smart_allocator(state: AppState) -> AppState:
    plan = _compute_allocation(state)
    return {**state, "allocation_plan": plan}

#@traceable
# Very friendly in the beginning no huge movements so to build trust. Users can later on give more trust to allocate more money. Do this by dynamic caps by trust tier, tenure, KYC (know your customer) level and prior acceptance history
def node_policy_and_route(state: AppState) -> str:
    """Apply policy caps and write back to state; no routing here."""
    plan = state.get("allocation_plan") or {}
    # Simple guardrails
    max_move_pct = 0.1 # don’t suggest moving >10% of liquid balance without trust
    liquid = total_liquid_balance(state.get("balances", {}))
    capped_actions: List[AllocationAction] = []
    for a in plan.get("actions", []):
        cap = round(max_move_pct * max(liquid, 0.0), 2)
        if a["amount"] > cap:
            a = {**a, "amount": cap, "rationale": a["rationale"] + " (capped by policy)"}
        capped_actions.append(a)
    plan["actions"] = capped_actions
    state["allocation_plan"] = plan
    return state

def route_after_policy(state: AppState) -> str:
    """Decide the next node based on shortfall."""
    plan = state.get("allocation_plan") or {}
    return "safety_net" if float(plan.get("shortfall", 0.0)) > 0 else "translator"

def node_safety_net(state: AppState) -> AppState:
    plan = state.get("allocation_plan") or {}
    shortfall = float(plan.get("shortfall", 0.0))
    options: List[Dict[str, Any]] = []
    if shortfall > 0:
        options = [
            {"type": "reschedule_bill", "days": 3, "note": "Ask landlord or utility for 3-day shift"},
            {"type": "micro_advance", "amount": min(shortfall, 100.0), "note": "Offer small, fee-free bridge"},
            {"type": "partial_payment", "amount": shortfall, "note": "Split the bill in two"},
        ]
    return {**state, "safety_options": {"options": options}}


def node_translator(state: AppState) -> AppState:
    fc = state.get("income_forecast") or {}
    plan = state.get("allocation_plan") or {}
    upcoming = state.get("upcoming_expenses", [])
    lines: List[str] = []
    # Overview
    lines.append("Here’s the plan for the next 14 days.")
    if fc:
        lines.append(
            f"Income outlook: expected €{fc.get('expected', 0):,.2f} (p10 €{fc.get('p10',0):,.2f} / p90 €{fc.get('p90',0):,.2f}, confidence {int(100*fc.get('confidence',0))}%)."
        )
    if upcoming:
        soon = [u for u in upcoming if u["due_date"] <= (_now().date() + timedelta(days=14))]
        total_soon = sum(u["expected_amount"] for u in soon)
        lines.append(f"Bills due in 14 days: €{total_soon:,.2f} across {len(soon)} items.")
    # Shortfall or actions
    if plan.get("shortfall", 0.0) > 0:
        lines.append(f"Shortfall vs. buffer target: €{plan['shortfall']:,.2f}.")
        so = state.get("safety_options", {"options": []}).get("options", [])
        if so:
            lines.append("Options to keep you safe:")
            for o in so:
                if o.get("type") == "reschedule_bill":
                    lines.append(f"• Reschedule a bill by {o['days']} days (often accepted if requested early).")
                elif o.get("type") == "micro_advance":
                    lines.append(f"• Micro-advance of €{o['amount']:,.2f} (fee-free, auto-repay on income).")
                elif o.get("type") == "partial_payment":
                    lines.append("• Ask for a partial payment plan to split the bill.")
    else:
        actions = plan.get("actions", [])
        if actions:
            lines.append("Suggested actions:")
            for a in actions:
                lines.append(
                    f"• {a['kind'].title()} €{a['amount']:,.2f} → {a['target']} — {a['rationale']}"
                )
            lines.append("Approve any you like; we won’t move money without your consent.")
        else:
            lines.append("No moves suggested right now. You’re on track.")

    return {**state, "narrative": "\n".join(lines)}


# -----------------------------
# Graph definition
# -----------------------------

graph = StateGraph(AppState)

# Register nodes
graph.add_node("income_forecaster", node_income_forecaster)
graph.add_node("expense_radar", node_expense_radar)
graph.add_node("smart_allocator", node_smart_allocator)
graph.add_node("route", node_policy_and_route)
graph.add_node("safety_net", node_safety_net)
graph.add_node("translator", node_translator)

# Entry/edges
graph.add_edge(START, "income_forecaster")
graph.add_edge("income_forecaster", "expense_radar")
graph.add_edge("expense_radar", "smart_allocator")
# conditional branch from policy-and-route
graph.add_node("policy_and_route", node_policy_and_route)
# fix for naming consistency

graph.add_edge("smart_allocator", "policy_and_route")
# dynamic: policy_and_route returns next node name

graph.add_conditional_edges(
    "policy_and_route",
    route_after_policy,
    {
        "safety_net": "safety_net",
        "translator": "translator",
    },
)

# both branches end at END after translator finishes; safety_net → translator → END
graph.add_edge("safety_net", "translator")
graph.add_edge("translator", END)

app = graph.compile()


# "demo"
if __name__ == "__main__":
    now = _now()
    sample_txs: List[Tx] = [
        # income (last weeks)
        Tx(id="t1", ts=now - timedelta(days=7), amount=650.0, merchant="Client A", category="salary"),
        Tx(id="t2", ts=now - timedelta(days=14), amount=700.0, merchant="Client A", category="salary"),
        Tx(id="t3", ts=now - timedelta(days=21), amount=620.0, merchant="Client B", category="salary"),
        Tx(id="t4", ts=now - timedelta(days=28), amount=700.0, merchant="Client A", category="salary"),
        # expenses (subscriptions)
        Tx(id="e1", ts=now - timedelta(days=29), amount=-12.99, merchant="Spotify", category="subscription"),
        Tx(id="e2", ts=now - timedelta(days=59), amount=-12.49, merchant="Spotify", category="subscription"),
        Tx(id="e3", ts=now - timedelta(days=27), amount=-59.99, merchant="PhoneCo", category="subscription"),
        Tx(id="e4", ts=now - timedelta(days=57), amount=-59.99, merchant="PhoneCo", category="subscription"),
        # rent monthly (detected if included)
        Tx(id="e5", ts=now - timedelta(days=30), amount=-800.0, merchant="Landlord", category="rent"),
        Tx(id="e6", ts=now - timedelta(days=60), amount=-800.0, merchant="Landlord", category="rent"),
    ]

    init_state: AppState = {
        "currency": "EUR",
        "balances": {"chk": 900.0},
        "transactions": sample_txs,
        "income_forecast": None,
        "upcoming_expenses": [],
        "allocation_plan": None,
        "safety_options": None,
        "narrative": None,
    }

    final_state = app.invoke(init_state)
    print("=== Narrative ===")
    print(final_state["narrative"])
