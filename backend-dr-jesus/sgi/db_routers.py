"""
Roteador de Banco de Dados Multi-Tenant / Multi-Database
Padrão SCSI PycoderBR — SGI Fundação Dr. Jesus & Caravana SJDH Bahia

Garante o isolamento entre:
1. 'default' (dr_jesus_db): Gerenciado pelas migrações do Django.
2. 'caravana' (caravana_db): Gerenciado pelo PostgREST / GoTrue / Supabase DDL.
   Impedindo que 'python manage.py migrate' tente criar tabelas do SGI no banco da Caravana.
"""

class CaravanaRouter:
    """
    Roteador para direcionar ou blindar o banco secundário 'caravana_db'.
    """
    route_app_labels = {'caravana_app'}

    def db_for_read(self, model, **hints):
        if model._meta.app_label in self.route_app_labels:
            return 'caravana'
        return 'default'

    def db_for_write(self, model, **hints):
        if model._meta.app_label in self.route_app_labels:
            return 'caravana'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        # Permite relacionamentos se ambos os objetos pertencerem ao mesmo banco
        db_set = {'default', 'caravana'}
        if obj1._state.db in db_set and obj2._state.db in db_set:
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        NENHUMA migração do Django pode ser aplicada ao banco 'caravana'.
        O banco da Caravana possui governança soberana via DDL PostgREST.
        """
        if db == 'caravana':
            return False
        if app_label in self.route_app_labels:
            return False
        return True
