"""
URL configuration for Backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from  django.contrib import admin
from django.urls import path, include
from Account import views as views
from Transaction import views as transaction_views
urlpatterns = [
    path('Account/', include('Account.urls')),
    # path('Transaction/', include(''))
    path("admin/", admin.site.urls),
    path("login", views.login_api),
    path("logout", views.logout_api),
    path("register", views.register_api),
    path('Account/', include('django.contrib.auth.urls')),
    path('create_shipment', transaction_views.create_shipment),
    path('create_transaction_to_consolidation_point', transaction_views.create_transaction_to_consolidation_point),
    path('confirm_shipment_from_consolidation_department', transaction_views.confirm_shipment_from_consolidation_department),
    path('confirm_shipment_to_receiver', transaction_views.confirm_shipment_to_receiver),
    path('confirm_failed_shipment_and_create_transaction', transaction_views.confirm_failed_shipment_and_create_transaction),
    path('confirm_transaction_from_transaction_department', transaction_views.confirm_transaction_from_transaction_department),
    path('create_transaction_to_target_consolidation_point', transaction_views.create_transaction_to_target_consolidation_point),
    path('confirm_transaction_from_other_consolidation_department', transaction_views.confirm_transaction_from_other_consolidation_department),
    path('create_transaction_to_target_transaction_point', transaction_views.create_transaction_to_target_transaction_point)
]
