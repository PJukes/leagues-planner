"""
Backend-managed task templates for quick plan setup.

Tasks are defined in tasks.csv alongside this file.
Edit that file to add, remove, or update tasks.
"""

import csv
from pathlib import Path

_CSV_PATH = Path(__file__).parent / "tasks.csv"


def _parse_row(row: dict) -> dict:
    task: dict = {
        "key": row["key"],
        "name": row["name"],
        "league_points": int(row["league_points"]),
    }

    if row.get("is_passive"):
        task["is_passive"] = row["is_passive"].strip().lower() == "true"
        task["selectable"] = row.get("selectable", "").strip().lower() == "true"

    req_type = row.get("passive_req_type", "").strip()
    if req_type:
        requirement: dict = {"type": req_type}
        if row.get("passive_req_value"):
            requirement["value"] = int(row["passive_req_value"])
        if row.get("passive_req_skill"):
            requirement["skill"] = row["passive_req_skill"].strip()
        if row.get("passive_req_method"):
            requirement["method"] = row["passive_req_method"].strip()
        if row.get("passive_req_quantity"):
            requirement["quantity"] = int(row["passive_req_quantity"])
        task["passive_requirement"] = requirement

    xp_skill = row.get("xp_reward_skill", "").strip()
    xp_amount = row.get("xp_reward_amount", "").strip()
    if xp_skill and xp_amount:
        task["xp_reward"] = {"skill": xp_skill, "amount": float(xp_amount)}

    return task


def get_task_library() -> list[dict]:
    """Return the full task library parsed from tasks.csv."""
    with _CSV_PATH.open(newline="", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        return [_parse_row(row) for row in reader]
