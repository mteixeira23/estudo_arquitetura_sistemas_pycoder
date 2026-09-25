import os
from celery import Celery

# Define o módulo de settings padrão do Django para o Celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

app = Celery('core')

# Lê as configurações com prefixo 'CELERY_' do settings.py
app.config_from_object('django.conf:settings', namespace='CELERY')

# Descoberta automática de tasks em todos os apps instalados (tasks.py e tasks_ia.py)
app.autodiscover_tasks()

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Celery Debug Task: {self.request!r}')
