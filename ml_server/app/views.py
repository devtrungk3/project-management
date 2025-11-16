from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import User
from django.http import HttpRequest
from . import helpers
from .forms import AIModelFileForm
from .models import AIModelFile
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db.models import ObjectDoesNotExist
import joblib
import json
import pandas as pd

def login(request):
    if request.session.get("user_id"):
        return redirect("model_management")
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        try:
            user = User.objects.get(username=username)
            if user.role.name == 'ADMIN' and helpers.verify_password_bcrypt(password, user.password):
                request.session["user_id"] = user.id
                request.session["username"] = username
                request.session["role"] = user.role.name
                return redirect("model_management")
            else:
                messages.error(request, "Invalid credential.")
        except User.DoesNotExist:
            messages.error(request, "User not found.")
    return render(request, "login.html")

def model_management(request):
    if not request.session.get("user_id"):
        return redirect("login")
    form = AIModelFileForm()
    context = {}
    # upload model file
    if request.method == 'POST':
        # Create an instance of the form with the POST data and the files
        form = AIModelFileForm(request.POST, request.FILES) 
        if form.is_valid():
            # Save the file using the ModelForm's save method
            form.save() 
        else:
            form = AIModelFileForm()
            context['error'] = 'Upload failed'
    # get uploaded model data
    ai_model_data = []
    model_files = AIModelFile.objects.all().order_by('-uploaded_at')
    for model in model_files:
        
        # Get just the filename from the path
        try:
            file_name_only = model.file.name.split('/')[-1]
        except ValueError:
            file_name_only = "No Model Uploaded"

        ai_model_data.append({
            'id': model.id,
            'name': file_name_only,
            'uploaded_at': model.uploaded_at,
            'is_active': model.is_active
        })
    context['form'] = form
    context['ai_model_list'] = ai_model_data
    return render(request, "model_management.html", context)

def delete_model(request: HttpRequest, model_id):
    if not request.session.get("user_id"):
        return redirect("login")
    if request.method == 'POST':
        model_instance = get_object_or_404(AIModelFile, id=model_id)
        
        try:
            model_instance.file.delete(save=False) 
        except Exception as e:
            print(f"Error deleting file from storage: {e}")
        model_instance.delete()

        return redirect('model_management') 
    # fallback for get method
    return redirect('model_management')

def activate_model(request, model_id):
    if not request.session.get("user_id"):
        return redirect("login")
    if request.method == 'POST':
        model_instance = get_object_or_404(AIModelFile, id=model_id)
        model_instance.is_active = True
        model_instance.save() 
    return redirect('model_management')

def logout(request):
    request.session.flush()
    return redirect("login")

@csrf_exempt
def predict_api(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method is allowed'}, status=405)

    # Find the Active Model Instance
    try:
        active_model_instance = AIModelFile.objects.get(is_active=True)
    except AIModelFile.DoesNotExist:
        return JsonResponse({'error': 'No active model has been set.'}, status=404)
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Database inconsistency: Check active models.'}, status=500)

    # Load the Model from Storage
    try:
        # Get the absolute path to the file
        model_path = active_model_instance.file.path
        
        # Load the model
        model = joblib.load(model_path)
    except FileNotFoundError:
        return JsonResponse({'error': 'Not found model instance'}, status=500)
    except Exception as e:
        return JsonResponse({'error': 'Failed to load model'}, status=500)

    # 3. Process Input Data
    try:
        raw_data = json.loads(request.body)
        input_df = pd.DataFrame([{
            'day_since_start' : raw_data['day_since_start'],
            'deadline_day_of_week' : raw_data['deadline_day_of_week'],
            'days_until_deadline' : raw_data['days_until_deadline'],
            'estimated_hours' : raw_data['estimated_hours'],
            'priority' : raw_data['priority'],
            'has_dependencies' : raw_data['has_dependencies'],
            'team_size' : raw_data['team_size'],
            'assignee_overdue_rate' : raw_data['assignee_overdue_rate'],
            'project_overdue_rate' : raw_data['project_overdue_rate'],
            'progress_gap' : raw_data['progress_gap'],
        }])
        prediction_result = "HIGH" if model.predict(input_df)[0] == 1 else "LOW"
            
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format in request body.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': 'Prediction failed'}, status=500)

    return JsonResponse({
        'task_delay_risk': prediction_result
    })