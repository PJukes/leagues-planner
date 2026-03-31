import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Plan",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=200)),
                ("base_xp_multiplier", models.FloatField(default=5.0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="plans",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={"ordering": ["-updated_at"]},
        ),
        migrations.CreateModel(
            name="LeagueTier",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=100)),
                ("points_required", models.PositiveIntegerField()),
                ("xp_multiplier", models.FloatField(help_text="XP multiplier granted by this tier, e.g. 8.0 for 8x")),
                (
                    "plan",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="tiers",
                        to="planner.plan",
                    ),
                ),
            ],
            options={"ordering": ["points_required"]},
        ),
        migrations.CreateModel(
            name="PlanTask",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("order", models.PositiveIntegerField(default=0)),
                (
                    "task_type",
                    models.CharField(
                        choices=[
                            ("league_task", "League Task"),
                            ("generic_action", "Generic Action"),
                            ("tier_unlock", "Tier Unlock"),
                            ("note", "Note"),
                        ],
                        default="note",
                        max_length=20,
                    ),
                ),
                ("name", models.CharField(max_length=300)),
                ("notes", models.TextField(blank=True)),
                ("league_points", models.IntegerField(default=0)),
                ("skill", models.CharField(
                    blank=True,
                    choices=[
                        ("attack", "Attack"), ("hitpoints", "Hitpoints"), ("mining", "Mining"),
                        ("strength", "Strength"), ("agility", "Agility"), ("smithing", "Smithing"),
                        ("defence", "Defence"), ("herblore", "Herblore"), ("fishing", "Fishing"),
                        ("ranged", "Ranged"), ("thieving", "Thieving"), ("cooking", "Cooking"),
                        ("prayer", "Prayer"), ("crafting", "Crafting"), ("firemaking", "Firemaking"),
                        ("magic", "Magic"), ("fletching", "Fletching"), ("woodcutting", "Woodcutting"),
                        ("runecraft", "Runecraft"), ("slayer", "Slayer"), ("farming", "Farming"),
                        ("construction", "Construction"), ("hunter", "Hunter"),
                    ],
                    max_length=30,
                )),
                ("base_xp_per_action", models.FloatField(default=0, help_text="Raw XP per action before the multiplier is applied")),
                ("quantity", models.IntegerField(default=1)),
                ("map_x", models.IntegerField(blank=True, null=True)),
                ("map_y", models.IntegerField(blank=True, null=True)),
                ("map_plane", models.IntegerField(default=0)),
                (
                    "plan",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="tasks",
                        to="planner.plan",
                    ),
                ),
                (
                    "tier",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="unlock_tasks",
                        to="planner.leaguetier",
                    ),
                ),
            ],
            options={"ordering": ["order"]},
        ),
    ]
