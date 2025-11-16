from django import forms
from .models import AIModelFile

class AIModelFileForm(forms.ModelForm):
    class Meta:
        model = AIModelFile
        fields = ('file',)
        widgets = {
            'file': forms.FileInput(attrs={'accept': '.joblib', 'class': 'form-control', 'required': True}),
        }