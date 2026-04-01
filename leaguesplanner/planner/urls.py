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
    path("task-list/", views.task_list, name="task_list")
]
