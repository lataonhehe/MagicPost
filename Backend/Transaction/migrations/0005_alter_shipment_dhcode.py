# Generated by Django 4.2.7 on 2023-11-21 03:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Transaction', '0004_alter_shipment_dhcode_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='shipment',
            name='DHCode',
            field=models.CharField(default='', max_length=5),
        ),
    ]
