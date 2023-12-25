# Generated by Django 4.2.7 on 2023-12-25 13:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Transaction', '0008_shipment_sender_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='shipment',
            name='receiver_address_detail',
            field=models.CharField(default=None, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='shipment',
            name='sender_address_detail',
            field=models.CharField(default=None, max_length=100, null=True),
        ),
    ]