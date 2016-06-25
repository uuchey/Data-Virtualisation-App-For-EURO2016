from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse


def index(request):
    template = loader.get_template('euro2016/index.html')
    context = {
        'latest_question_list': 1,
    }
    return HttpResponse(template.render(context, request))
