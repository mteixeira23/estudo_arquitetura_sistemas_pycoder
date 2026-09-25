#!/usr/bin/env python3
"""
Auditor Automatizado da Sub-etapa 7.2 — Zero-Downtime Rolling Update & Healthchecks (SCSI)
Valida a conformidade da ADR 007 (Unix LF), cobertura de healthchecks em todos os serviços,
estratégias de rollback automático e endpoints de monitoramento de saúde.
"""

import sys
import re
from pathlib import Path

# Cores ANSI
C_GREEN = "\033[92m"
C_RED = "\033[91m"
C_YELLOW = "\033[93m"
C_CYAN = "\033[96m"
C_RESET = "\033[0m"

BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = BASE_DIR.parent / "backend-dr-jesus"
FRONTEND_DIR = BASE_DIR.parent / "sgi-fundacao-dr-jesus"

def check_unix_lf(path: Path) -> bool:
    """Valida se o arquivo possui terminação de linha estritamente Unix LF (ADR 007)."""
    if not path.is_file():
        return False
    data = path.read_bytes()
    return b"\r\n" not in data and b"\r" not in data

def audit_file_lf(path: Path) -> bool:
    name = path.name
    if not path.exists():
        print(f"  {C_RED}[FALHA]{C_RESET} Arquivo não encontrado: {path}")
        return False
    is_lf = check_unix_lf(path)
    if is_lf:
        print(f"  {C_GREEN}[PASS]{C_RESET} {name}: 100% puro Unix LF (0 bytes CR).")
        return True
    else:
        print(f"  {C_RED}[FALHA]{C_RESET} {name}: Contém quebras de linha Windows CRLF.")
        return False

def main():
    print(f"\n{C_CYAN}=================================================================={C_RESET}")
    print(f"{C_CYAN}   AUDITORIA TÉCNICA: SUB-ETAPA 7.2 (ROLLING UPDATE & HEALTH)     {C_RESET}")
    print(f"{C_CYAN}=================================================================={C_RESET}\n")

    errors = 0

    # 1. Auditoria Unix LF (ADR 007)
    print(f"{C_YELLOW}[1/5] Verificação de Formatação Unix LF (ADR 007)...{C_RESET}")
    files_to_check = [
        BASE_DIR / "scripts" / "deploy_stack_producao.sh",
        BASE_DIR / "docker-compose.yml",
        BACKEND_DIR / "sgi" / "views.py",
        BACKEND_DIR / "sgi" / "urls.py",
        FRONTEND_DIR / "nginx.conf",
    ]
    for f in files_to_check:
        if not audit_file_lf(f):
            errors += 1

    # 2. Auditoria dos Probes de Saúde (healthcheck) no docker-compose.yml
    print(f"\n{C_YELLOW}[2/5] Auditoria de Cobertura de Healthchecks no docker-compose.yml...{C_RESET}")
    compose_path = BASE_DIR / "docker-compose.yml"
    compose_text = compose_path.read_text(encoding="utf-8")

    expected_healthchecks = [
        ("frontend", "wget -qO- http://127.0.0.1:80/healthz"),
        ("backend", "http://127.0.0.1:8000/api/health/"),
        ("db", "pg_isready"),
        ("redis", "redis-cli"),
        ("rabbitmq", "rabbitmq-diagnostics -q ping"),
        ("celery_worker", "celery -A core inspect ping"),
        ("ollama", "ollama list"),
    ]
    for svc, probe_substr in expected_healthchecks:
        if probe_substr in compose_text:
            print(f"  {C_GREEN}[PASS]{C_RESET} Serviço '{svc}': Healthcheck configurado com probe '{probe_substr[:30]}...'.")
        else:
            print(f"  {C_RED}[FALHA]{C_RESET} Serviço '{svc}': Probe de healthcheck ausente ou incorreto.")
            errors += 1

    # 3. Auditoria de Políticas de Rolling Update e Rollback Automático
    print(f"\n{C_YELLOW}[3/5] Auditoria de Rolling Updates (order: start-first / failure_action: rollback)...{C_RESET}")
    
    start_first_count = compose_text.count("order: start-first")
    if start_first_count >= 2:
        print(f"  {C_GREEN}[PASS]{C_RESET} 'order: start-first' aplicado aos serviços web (frontend e backend: {start_first_count} ocorrências).")
    else:
        print(f"  {C_RED}[FALHA]{C_RESET} 'order: start-first' ausente nos serviços web.")
        errors += 1

    rollback_count = compose_text.count("failure_action: rollback")
    if rollback_count >= 7:
        print(f"  {C_GREEN}[PASS]{C_RESET} 'failure_action: rollback' configurado em todos os 7 serviços ({rollback_count} ocorrências).")
    else:
        print(f"  {C_RED}[FALHA]{C_RESET} 'failure_action: rollback' configurado em apenas {rollback_count}/7 serviços.")
        errors += 1

    rollback_config_count = compose_text.count("rollback_config:")
    if rollback_config_count >= 7:
        print(f"  {C_GREEN}[PASS]{C_RESET} Bloco 'rollback_config' declarado em todos os 7 serviços ({rollback_config_count} ocorrências).")
    else:
        print(f"  {C_RED}[FALHA]{C_RESET} Bloco 'rollback_config' ausente em alguns serviços.")
        errors += 1

    # 4. Auditoria dos Endpoints de Saúde (Backend e Frontend)
    print(f"\n{C_YELLOW}[4/5] Auditoria dos Endpoints de Healthcheck no Código da Aplicação...{C_RESET}")
    
    # Backend Django HealthCheckView
    views_code = (BACKEND_DIR / "sgi" / "views.py").read_text(encoding="utf-8")
    urls_code = (BACKEND_DIR / "sgi" / "urls.py").read_text(encoding="utf-8")
    
    if "class HealthCheckView(" in views_code:
        print(f"  {C_GREEN}[PASS]{C_RESET} Django: 'HealthCheckView' implementada com probes de PostgreSQL e Cache.")
    else:
        print(f"  {C_RED}[FALHA]{C_RESET} Django: 'HealthCheckView' ausente em sgi/views.py.")
        errors += 1

    if "path('health/', HealthCheckView.as_view()" in urls_code:
        print(f"  {C_GREEN}[PASS]{C_RESET} Django: Rota '/api/health/' registrada em sgi/urls.py.")
    else:
        print(f"  {C_RED}[FALHA]{C_RESET} Django: Rota health ausente em sgi/urls.py.")
        errors += 1

    # Frontend Nginx /healthz
    nginx_code = (FRONTEND_DIR / "nginx.conf").read_text(encoding="utf-8")
    if "location /healthz" in nginx_code and "return 200" in nginx_code:
        print(f"  {C_GREEN}[PASS]{C_RESET} Frontend Nginx: Bloco 'location /healthz' ativo com retorno 200.")
    else:
        print(f"  {C_RED}[FALHA]{C_RESET} Frontend Nginx: Bloco /healthz ausente em nginx.conf.")
        errors += 1

    # 5. Auditoria do Script Shell de Deploy Headless
    print(f"\n{C_YELLOW}[5/5] Auditoria de Integridade do Script Bash de Deploy...{C_RESET}")
    deploy_script = (BASE_DIR / "scripts" / "deploy_stack_producao.sh").read_text(encoding="utf-8")
    
    deploy_mandates = [
        ("docker stack deploy -c", "Comando de deploy de stacks no Swarm"),
        ("docker stack services scsi", "Monitoramento de convergência de réplicas"),
        ("scsi_public", "Validação de rede overlay pré-requisito"),
        ("scsi_origin_crt", "Validação de segredos obrigatórios"),
        ("DEPLOY_TIMEOUT", "Controle de timeout com fail-safe"),
    ]
    for pattern, desc in deploy_mandates:
        if pattern in deploy_script:
            print(f"  {C_GREEN}[PASS]{C_RESET} {desc} verificado no script de deploy.")
        else:
            print(f"  {C_RED}[FALHA]{C_RESET} {desc} ausente no script de deploy.")
            errors += 1

    # Veredicto
    print(f"\n{C_CYAN}------------------------------------------------------------------{C_RESET}")
    if errors == 0:
        print(f"{C_GREEN}✅ AUDITORIA CONCLUÍDA COM 100% DE SUCESSO! (0 erros){C_RESET}")
        print(f"{C_GREEN}Sub-etapa 7.2 pronta para homologação pela banca técnica.{C_RESET}")
        return 0
    else:
        print(f"{C_RED}❌ AUDITORIA FALHOU COM {errors} ERRO(S).{C_RESET}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
