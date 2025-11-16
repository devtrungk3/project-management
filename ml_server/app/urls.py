from django.urls import path

from . import views
from django.views.generic import RedirectView

urlpatterns = [
    path("login/", views.login, name="login"),
    path("logout/", views.logout, name="logout"),
    path('', RedirectView.as_view(url='/model-management', permanent=True)),
    path("model-management/", views.model_management, name="model_management"),
    path('model-management/delete_model/<int:model_id>/', views.delete_model, name='delete_model'),
    path('model-management/activate_model/<int:model_id>/', views.activate_model, name='activate_model'),
    # API
    path('api/v1/delay-predict', views.predict_api, name='predict_api'),
]