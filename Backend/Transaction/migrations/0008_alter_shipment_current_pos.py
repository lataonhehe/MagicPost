# Generated by Django 4.2.7 on 2023-11-21 09:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Account', '0002_remove_user_department'),
        ('Transaction', '0007_shipment_current_pos'),
    ]

    operations = [
        migrations.AlterField(
            model_name='shipment',
            name='current_pos',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='shipment_current_pos', to='Account.department'),
        ),
    ]
