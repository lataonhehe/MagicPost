from django.contrib import admin
from .models import User, UserManager, Department

# Register your models here.
admin.site.register(User)
admin.site.register(Department)