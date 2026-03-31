import json

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_http_methods

from .models import LeagueTier, Plan, PlanTask


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
    return render(request, "planner/plan_detail.html", {"plan": plan})


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


# ---------------------------------------------------------------------------
# Task views
# ---------------------------------------------------------------------------

@login_required
@require_http_methods(["POST"])
def task_create(request, plan_id):
    plan = get_object_or_404(Plan, pk=plan_id, user=request.user)
    data = json.loads(request.body)

    tier = None
    if data.get("tier_id"):
        tier = get_object_or_404(LeagueTier, pk=data["tier_id"], plan=plan)

    task = PlanTask.objects.create(
        plan=plan,
        order=plan.tasks.count(),
        task_type=data.get("task_type", "note"),
        name=data.get("name", ""),
        notes=data.get("notes", ""),
        league_points=int(data.get("league_points", 0)),
        skill=data.get("skill", ""),
        base_xp_per_action=float(data.get("base_xp_per_action", 0)),
        quantity=int(data.get("quantity", 1)),
        tier=tier,
        map_x=data.get("map_x"),
        map_y=data.get("map_y"),
        map_plane=int(data.get("map_plane", 0)),
    )
    return JsonResponse(_task_to_dict(task), status=201)


@login_required
def task_detail(request, plan_id, task_id):
    plan = get_object_or_404(Plan, pk=plan_id, user=request.user)
    task = get_object_or_404(PlanTask, pk=task_id, plan=plan)

    if request.method == "DELETE":
        task.delete()
        return JsonResponse({"status": "deleted"})

    if request.method == "PUT":
        data = json.loads(request.body)

        if "tier_id" in data:
            task.tier = (
                get_object_or_404(LeagueTier, pk=data["tier_id"], plan=plan)
                if data["tier_id"]
                else None
            )

        for field in ("task_type", "name", "notes", "skill"):
            if field in data:
                setattr(task, field, data[field])

        for field in ("league_points", "quantity", "map_plane"):
            if field in data:
                setattr(task, field, int(data[field]))

        if "base_xp_per_action" in data:
            task.base_xp_per_action = float(data["base_xp_per_action"])
        if "map_x" in data:
            task.map_x = data["map_x"]
        if "map_y" in data:
            task.map_y = data["map_y"]

        task.save()
        return JsonResponse({"status": "updated", **_task_to_dict(task)})

    return JsonResponse({"error": "method not allowed"}, status=405)


@login_required
@require_http_methods(["POST"])
def task_reorder(request, plan_id):
    plan = get_object_or_404(Plan, pk=plan_id, user=request.user)
    data = json.loads(request.body)
    for idx, task_id in enumerate(data.get("order", [])):
        PlanTask.objects.filter(pk=task_id, plan=plan).update(order=idx)
    return JsonResponse({"status": "ok"})


# ---------------------------------------------------------------------------
# Tier views
# ---------------------------------------------------------------------------

@login_required
@require_http_methods(["POST"])
def tier_create(request, plan_id):
    plan = get_object_or_404(Plan, pk=plan_id, user=request.user)
    data = json.loads(request.body)
    tier = LeagueTier.objects.create(
        plan=plan,
        name=data.get("name", ""),
        points_required=int(data.get("points_required", 0)),
        xp_multiplier=float(data.get("xp_multiplier", 5.0)),
    )
    return JsonResponse(_tier_to_dict(tier), status=201)


@login_required
def tier_detail(request, plan_id, tier_id):
    plan = get_object_or_404(Plan, pk=plan_id, user=request.user)
    tier = get_object_or_404(LeagueTier, pk=tier_id, plan=plan)

    if request.method == "DELETE":
        tier.delete()
        return JsonResponse({"status": "deleted"})

    if request.method == "PUT":
        data = json.loads(request.body)
        if "name" in data:
            tier.name = data["name"]
        if "points_required" in data:
            tier.points_required = int(data["points_required"])
        if "xp_multiplier" in data:
            tier.xp_multiplier = float(data["xp_multiplier"])
        tier.save()
        return JsonResponse({"status": "updated", **_tier_to_dict(tier)})

    return JsonResponse({"error": "method not allowed"}, status=405)
