# Generated by Django 4.2.7 on 2023-12-25 16:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Transaction', '0009_shipment_receiver_address_detail_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='shipment',
            name='shipment_name',
            field=models.CharField(blank=True, default=None, max_length=30, null=True),
        ),
    ]