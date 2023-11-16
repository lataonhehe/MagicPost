# Generated by Django 4.2.7 on 2023-11-15 18:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("Account", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Transaction",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("sender", models.CharField(max_length=100)),
                ("receiver", models.CharField(max_length=100)),
                ("status", models.CharField(max_length=50)),
                (
                    "consolidation_point",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="Account.consolidationpoint",
                    ),
                ),
                (
                    "transaction_point",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="Account.transactionpoint",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Parcel",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("sender", models.CharField(max_length=100)),
                ("receiver", models.CharField(max_length=100)),
                ("status", models.CharField(max_length=50)),
                (
                    "consolidation_point",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="Account.consolidationpoint",
                    ),
                ),
                (
                    "transaction_point",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="Account.transactionpoint",
                    ),
                ),
            ],
        ),
    ]
