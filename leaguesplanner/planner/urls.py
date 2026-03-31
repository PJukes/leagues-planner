from django.urls import path

from . import views

app_name = "planner"

urlpatterns = [
    # Plan list / create
    path("", views.plan_list, name="home"),
    path("create/", views.plan_create, name="plan_create"),
    # Plan detail / data / update
    path("<int:plan_id>/", views.plan_detail, name="plan_detail"),
    path("<int:plan_id>/data/", views.plan_data, name="plan_data"),
    path("<int:plan_id>/task-library/", views.task_library_data, name="task_library_data"),
    path("<int:plan_id>/update/", views.plan_update, name="plan_update"),
    # Tasks
    path("<int:plan_id>/tasks/", views.task_create, name="task_create"),
    path("<int:plan_id>/tasks/reorder/", views.task_reorder, name="task_reorder"),
    path("<int:plan_id>/tasks/<int:task_id>/", views.task_detail, name="task_detail"),
    # Tiers
    path("<int:plan_id>/tiers/", views.tier_create, name="tier_create"),
    path("<int:plan_id>/tiers/<int:tier_id>/", views.tier_detail, name="tier_detail"),
]
