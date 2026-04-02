import json

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_http_methods

from .models import LeagueTier, Plan, PlanTask
from .task_library import get_task_library


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------

def _task_to_dict(task):
    return {
        "id": task.pk,
        "order": task.order,
        "task_type": task.task_type,
        "name": task.name,
        "notes": task.notes,
        "league_points": task.league_points,
        "skill": task.skill,
        "base_xp_per_action": task.base_xp_per_action,
        "quantity": task.quantity,
        "tier_id": task.tier_id,
        "map_x": task.map_x,
        "map_y": task.map_y,
        "map_plane": task.map_plane,
    }


def _tier_to_dict(tier):
    return {
        "id": tier.pk,
        "name": tier.name,
        "points_required": tier.points_required,
        "xp_multiplier": tier.xp_multiplier,
    }


def _library_task_to_dict(task_template):
    """Normalize task-library item for API consumers."""
    return {
        "key": task_template["key"],
        "task_type": task_template.get("task_type", "note"),
        "name": task_template.get("name", ""),
        "notes": task_template.get("notes", ""),
        "league_points": int(task_template.get("league_points", 0)),
        "skill": task_template.get("skill", ""),
        "base_xp_per_action": float(task_template.get("base_xp_per_action", 0)),
        "quantity": int(task_template.get("quantity", 1)),
        "tier_id": task_template.get("tier_id"),
        "map_x": task_template.get("map_x"),
        "map_y": task_template.get("map_y"),
        "map_plane": int(task_template.get("map_plane", 0)),
        "is_passive": bool(task_template.get("is_passive", False)),
        "selectable": bool(task_template.get("selectable", True)),
        "passive_requirement": task_template.get("passive_requirement"),
        "xp_reward": task_template.get("xp_reward"),
    }


# ---------------------------------------------------------------------------
# Plan views
# ---------------------------------------------------------------------------

@login_required
def plan_list(request):
    plans = Plan.objects.filter(user=request.user)
    return render(request, "planner/home.html", {"plans": plans})


@login_required
@require_http_methods(["POST"])
def plan_create(request):
    data = json.loads(request.body)
    plan = Plan.objects.create(
        user=request.user,
        name=data.get("name", "My League Plan"),
        base_xp_multiplier=float(data.get("base_xp_multiplier", 5.0)),
    )
    # Seed default tiers based on Trailblazer Reloaded Leagues
    default_tiers = [
        ("Tier 1 – Lazy", 500, 5.0),
        ("Tier 2 – Beginner", 1_800, 5.0),
        ("Tier 3 – Novice", 5_000, 8.0),
        ("Tier 4 – Journeyman", 12_000, 12.0),
        ("Tier 5 – Adventurer", 21_000, 16.0),
        ("Tier 6 – Expert", 37_000, 24.0),
        ("Tier 7 – Master", 60_000, 32.0),
        ("Tier 8 – Champion", 80_000, 48.0),
        ("Tier 9 – Hero", 104_000, 64.0),
        ("Tier 10 – Legend", 136_000, 80.0),
    ]
    for name, pts, mult in default_tiers:
        LeagueTier.objects.create(plan=plan, name=name, points_required=pts, xp_multiplier=mult)
    return JsonResponse({"id": plan.pk, "name": plan.name})


@login_required
def plan_detail(request, plan_id):
    plan = get_object_or_404(Plan, pk=plan_id, user=request.user)
    context = {
        "plan": plan,
        "task_list": get_task_library(),
    }
    return render(request, "planner/plan_detail.html", context)


@login_required
def plan_data(request, plan_id):
    plan = get_object_or_404(Plan, pk=plan_id, user=request.user)
    return JsonResponse({
        "id": plan.pk,
        "name": plan.name,
        "base_xp_multiplier": plan.base_xp_multiplier,
        "tiers": [_tier_to_dict(t) for t in plan.tiers.all()],
        "tasks": [_task_to_dict(t) for t in plan.tasks.all()],
    })


@login_required
def task_library_data(request, plan_id):
    get_object_or_404(Plan, pk=plan_id, user=request.user)
    library = [_library_task_to_dict(item) for item in get_task_library()]
    return JsonResponse({"tasks": library})


@login_required
@require_http_methods(["PUT"])
def plan_update(request, plan_id):
    plan = get_object_or_404(Plan, pk=plan_id, user=request.user)
    data = json.loads(request.body)
    if "name" in data:
        plan.name = data["name"]
    if "base_xp_multiplier" in data:
        plan.base_xp_multiplier = float(data["base_xp_multiplier"])
    plan.save()
    return JsonResponse({"status": "updated"})


# Task list
@login_required
def task_list(request):
    tasks = get_task_library()
    return JsonResponse({"tasks": tasks})
