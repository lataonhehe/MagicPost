# Generated by Django 5.0 on 2023-12-15 15:02

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Transaction', '0006_alter_shipment_des'),
    ]

    operations = [
        migrations.AddField(
            model_name='shipment',
            name='sender_phone',
            field=models.CharField(blank=True, default=None, max_length=15, null=True),
        ),
        migrations.CreateModel(
            name='CustomerTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('In Progress', 'In Progress'), ('Completed', 'Completed'), ('Failed', 'Failed')], default='In Progress', max_length=50)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('shipment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shipment', to='Transaction.shipment')),
            ],
        ),
    ]