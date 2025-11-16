# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
import os

# ----------------- Existing Auto-Generated Models -----------------
class User(models.Model):
    role = models.ForeignKey('Role', models.DO_NOTHING)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    fullname = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    username = models.CharField(unique=True, max_length=255)
    status = models.CharField(max_length=9)

    class Meta:
        managed = False
        db_table = 'user'


class Role(models.Model):
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    name = models.CharField(unique=True, max_length=255)

    class Meta:
        managed = False
        db_table = 'role'

# ----------------- File Upload -----------------
# Function to set the upload path
def get_model_upload_path(instance, filename):
    return os.path.join('models', filename)

class AIModelFile(models.Model):
    file = models.FileField(
        upload_to=get_model_upload_path,
        verbose_name="Trained Model File (.joblib)"
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(
        default=False, 
        verbose_name="Active Model"
    )
    def save(self, *args, **kwargs):
        if self.is_active:
            AIModelFile.objects.filter(is_active=True).exclude(pk=self.pk).update(is_active=False)
            
        super().save(*args, **kwargs)
    def __str__(self):
        status = " (Active)" if self.is_active else ""
        return f"{self.name}{status}"