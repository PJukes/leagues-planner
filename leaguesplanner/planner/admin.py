from django.contrib import admin

from .models import LeagueTier, Plan, PlanTask


class LeagueTierInline(admin.TabularInline):
    model = LeagueTier
    extra = 0


class PlanTaskInline(admin.TabularInline):
    model = PlanTask
    extra = 0
    fields = ("order", "task_type", "name", "league_points", "skill", "quantity")


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "base_xp_multiplier", "updated_at")
    inlines = [LeagueTierInline, PlanTaskInline]


@admin.register(LeagueTier)
class LeagueTierAdmin(admin.ModelAdmin):
    list_display = ("name", "plan", "points_required", "xp_multiplier")


@admin.register(PlanTask)
class PlanTaskAdmin(admin.ModelAdmin):
    list_display = ("name", "plan", "order", "task_type", "league_points", "skill")
    list_filter = ("task_type",)
