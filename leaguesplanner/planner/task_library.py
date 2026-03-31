"""Backend-managed task templates for quick plan setup.

Add/edit tasks in ``TASK_LIBRARY`` and they will be available in the Add Task modal.
"""

TASK_LIBRARY = [
    {
        "key": "lumbridge_easy",
        "name": "Lumbridge Easy Diary Task",
        "task_type": "league_task",
        "league_points": 80,
        "notes": "Complete an easy Lumbridge/Draynor diary objective.",
        "map_x": 3222,
        "map_y": 3218,
        "map_plane": 0,
    },
    {
        "key": "barbarian_fishing",
        "name": "Barbarian Fishing Session",
        "task_type": "generic_action",
        "skill": "fishing",
        "base_xp_per_action": 50,
        "quantity": 300,
        "notes": "A quick early-game XP push.",
        "map_x": 2500,
        "map_y": 3500,
        "map_plane": 0,
    },
]


def get_task_library():
    """Return a copy-safe list of task template dictionaries."""
    return [dict(item) for item in TASK_LIBRARY]
