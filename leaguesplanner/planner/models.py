from django.conf import settings
from django.db import models

SKILLS = [
    ("attack", "Attack"),
    ("hitpoints", "Hitpoints"),
    ("mining", "Mining"),
    ("strength", "Strength"),
    ("agility", "Agility"),
    ("smithing", "Smithing"),
    ("defence", "Defence"),
    ("herblore", "Herblore"),
    ("fishing", "Fishing"),
    ("ranged", "Ranged"),
    ("thieving", "Thieving"),
    ("cooking", "Cooking"),
    ("prayer", "Prayer"),
    ("crafting", "Crafting"),
    ("firemaking", "Firemaking"),
    ("magic", "Magic"),
    ("fletching", "Fletching"),
    ("woodcutting", "Woodcutting"),
    ("runecraft", "Runecraft"),
    ("slayer", "Slayer"),
    ("farming", "Farming"),
    ("construction", "Construction"),
    ("hunter", "Hunter"),
]


class Plan(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="plans",
    )
    name = models.CharField(max_length=200)
    base_xp_multiplier = models.FloatField(default=5.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return self.name


class LeagueTier(models.Model):
    """A configurable tier unlock within a plan (e.g. 'Tier 1 - Woodsman')."""

    plan = models.ForeignKey(Plan, related_name="tiers", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    points_required = models.PositiveIntegerField()
    xp_multiplier = models.FloatField(help_text="XP multiplier granted by this tier, e.g. 8.0 for 8x")

    class Meta:
        ordering = ["points_required"]

    def __str__(self):
        return f"{self.name} ({self.points_required} pts → {self.xp_multiplier}x)"


class PlanTask(models.Model):
    TASK_TYPES = [
        ("league_task", "League Task"),
        ("generic_action", "Generic Action"),
        ("tier_unlock", "Tier Unlock"),
        ("note", "Note"),
    ]

    plan = models.ForeignKey(Plan, related_name="tasks", on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)
    task_type = models.CharField(max_length=20, choices=TASK_TYPES, default="note")
    name = models.CharField(max_length=300)
    notes = models.TextField(blank=True)

    # League task fields
    league_points = models.IntegerField(default=0)

    # Generic action fields
    skill = models.CharField(max_length=30, blank=True, choices=SKILLS)
    base_xp_per_action = models.FloatField(
        default=0,
        help_text="Raw XP per action before the multiplier is applied",
    )
    quantity = models.IntegerField(default=1)

    # Tier unlock fields — which tier this task unlocks
    tier = models.ForeignKey(
        LeagueTier,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="unlock_tasks",
    )

    # Map marker (OSRS game tile coordinates)
    map_x = models.IntegerField(null=True, blank=True)
    map_y = models.IntegerField(null=True, blank=True)
    map_plane = models.IntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.name
