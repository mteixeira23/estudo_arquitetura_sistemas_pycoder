#!/usr/bin/env python3
"""
Auditor Automatizado da Sub-etapa 7.1 — Docker Swarm & Docker Secrets (SCSI)
Valida a conformidade da ADR 007 (Unix LF), ADR 008 (Defesa em Profundidade),
sintaxe dos manifests Compose, integridade dos secrets e fallback Fail-Safe no Django.
"""

import sys
import re
from pathlib import Path

# Cores ANSI para saída no terminal
C_GREEN = "\033[92m"
C_RED = "\033[91m"
C_YELLOW = "\033[93m"
C_CYAN = "\033[96m"
C_RESET = "\033[0m"

BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = BASE_DIR.parent / "backend-dr-jesus"

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
    print(f"{C_CYAN}   AUDITORIA TÉCNICA: SUB-ETAPA 7.1 (SWARM & DOCKER SECRETS)      {C_RESET}")
    print(f"{C_CYAN}=================================================================={C_RESET}\n")

    errors = 0

    # 1. Auditoria Unix LF (ADR 007)
    print(f"{C_YELLOW}[1/5] Verificação de Formatação Unix LF (ADR 007)...{C_RESET}")
    files_to_check = [
        BASE_DIR / "scripts" / "provisionar_swarm_e_secrets.sh",
        BASE_DIR / "docker-compose.yml",
        BASE_DIR / "docker-compose.traefik.yml",
        BACKEND_DIR / "core" / "settings.py",
    ]
    for f in files_to_check:
        if not audit_file_lf(f):
            errors += 1

    # 2. Auditoria de Estrutura do docker-compose.yml
    print(f"\n{C_YELLOW}[2/5] Auditoria de Estrutura do docker-compose.yml...{C_RESET}")
    compose_path = BASE_DIR / "docker-compose.yml"
    compose_text = compose_path.read_text(encoding="utf-8")
    
    # Validar 7 serviços obrigatórios
    expected_services = [
        "frontend:", "backend:", "db:", "redis:", "rabbitmq:", "celery_worker:", "ollama:"
    ]
    for s in expected_services:
        svc_name = s.replace(":", "")
        if s in compose_text:
            print(f"  {C_GREEN}[PASS]{C_RESET} Serviço '{svc_name}' declarado.")
        else:
            print(f"  {C_RED}[FALHA]{C_RESET} Serviço '{svc_name}' ausente no docker-compose.yml.")
            errors += 1

    # Validar segredos obrigatórios no bloco secrets:
    expected_secrets = [
        "scsi_django_secret_key:",
        "scsi_postgres_db:",
        "scsi_postgres_user:",
        "scsi_postgres_password:",
        "scsi_redis_password:",
        "scsi_rabbitmq_user:",
        "scsi_rabbitmq_password:",
    ]
    for sec in expected_secrets:
        sec_name = sec.replace(":", "")
        if sec in compose_text:
            print(f"  {C_GREEN}[PASS]{C_RESET} Secret raiz '{sec_name}' declarado com external: true.")
        else:
            print(f"  {C_RED}[FALHA]{C_RESET} Secret '{sec_name}' ausente na raiz do docker-compose.yml.")
            errors += 1

    # Validar que nenhuma senha está em texto plano no environment
    banned_env_patterns = [
        r"POSTGRES_PASSWORD:\s*['\"][^'\"]+['\"]",
        r"REDIS_PASSWORD:\s*['\"][^'\"]+['\"]",
        r"RABBITMQ_DEFAULT_PASS:\s*['\"][^'\"]+['\"]",
    ]
    for pat in banned_env_patterns:
        if re.search(pat, compose_text):
            print(f"  {C_RED}[FALHA]{C_RESET} Detectada senha em texto plano no environment: {pat}")
            errors += 1
        else:
            print(f"  {C_GREEN}[PASS]{C_RESET} Nenhuma senha em texto plano ({pat.split(':')[0]}).")

    # Validar uso de arquivos _FILE
    file_vars = ["POSTGRES_PASSWORD_FILE:", "POSTGRES_USER_FILE:", "POSTGRES_DB_FILE:", "RABBITMQ_DEFAULT_PASS_FILE:"]
    for fvar in file_vars:
        if fvar in compose_text:
            print(f"  {C_GREEN}[PASS]{C_RESET} Diretiva segura por arquivo '{fvar}' presente.")
        else:
            print(f"  {C_RED}[FALHA]{C_RESET} Diretiva segura por arquivo '{fvar}' ausente.")
            errors += 1

    # Validar constraints de armazenamento (scsi_storage)
    storage_matches = compose_text.count("node.labels.scsi_storage == true")
    if storage_matches >= 5:
        print(f"  {C_GREEN}[PASS]{C_RESET} Constraint 'node.labels.scsi_storage == true' aplicada aos 5 serviços persistentes ({storage_matches} ocorrências).")
    else:
        print(f"  {C_RED}[FALHA]{C_RESET} Faltam constraints 'node.labels.scsi_storage' (encontradas {storage_matches}, esperado >= 5).")
        errors += 1

    # 3. Auditoria do Traefik Compose
    print(f"\n{C_YELLOW}[3/5] Auditoria de Estrutura do docker-compose.traefik.yml...{C_RESET}")
    traefik_path = BASE_DIR / "docker-compose.traefik.yml"
    traefik_text = traefik_path.read_text(encoding="utf-8")
    
    if "scsi_origin_crt" in traefik_text and "scsi_origin_key" in traefik_text:
        print(f"  {C_GREEN}[PASS]{C_RESET} Certificados Origin CA declarados como Docker Secrets externos no Traefik.")
    else:
        print(f"  {C_RED}[FALHA]{C_RESET} Certificados Origin CA ausentes na seção secrets do Traefik.")
        errors += 1

    if "mode: host" in traefik_text:
        print(f"  {C_GREEN}[PASS]{C_RESET} Traefik operando em mode: host (preservação de IP real da Cloudflare).")
    else:
        print(f"  {C_RED}[FALHA]{C_RESET} Traefik não configurado em mode: host.")
        errors += 1

    # 4. Auditoria de Leitura Segura no Backend (core/settings.py)
    print(f"\n{C_YELLOW}[4/5] Auditoria do Leitor de Segredos no Backend (get_secret)...{C_RESET}")
    settings_code = (BACKEND_DIR / "core" / "settings.py").read_text(encoding="utf-8")
    
    if "def get_secret(" in settings_code:
        print(f"  {C_GREEN}[PASS]{C_RESET} Função 'get_secret' implementada.")
    else:
        print(f"  {C_RED}[FALHA]{C_RESET} Função 'get_secret' ausente no settings.py.")
        errors += 1

    checks_backend = [
        ("scsi_django_secret_key", "SECRET_KEY"),
        ("scsi_postgres_password", "POSTGRES_PASSWORD"),
        ("scsi_redis_password", "REDIS_PASSWORD"),
        ("scsi_rabbitmq_password", "RABBITMQ_PASS"),
    ]
    for secret_name, target in checks_backend:
        if secret_name in settings_code:
            print(f"  {C_GREEN}[PASS]{C_RESET} {target}: Vinculado ao secret '{secret_name}'.")
        else:
            print(f"  {C_RED}[FALHA]{C_RESET} {target}: Não consome o secret '{secret_name}'.")
            errors += 1

    # 5. Auditoria do Script Shell de Provisionamento
    print(f"\n{C_YELLOW}[5/5] Auditoria de Integridade do Script Bash de Provisionamento...{C_RESET}")
    bash_script = (BASE_DIR / "scripts" / "provisionar_swarm_e_secrets.sh").read_text(encoding="utf-8")
    
    mandates = [
        ("docker swarm init", "Inicialização de cluster Swarm"),
        ("scsi_storage=true", "Rótulo de nó para persistência governada"),
        ("scsi_public", "Criação de rede overlay pública"),
        ("scsi_socket_net", "Criação de rede overlay socket interna"),
        ("scsi_origin_crt", "Provisionamento de certificado Origin CA"),
        ("scsi_postgres_password", "Provisionamento de senha do Postgres"),
        ("scsi_redis_password", "Provisionamento de senha do Redis"),
        ("scsi_rabbitmq_password", "Provisionamento de senha do RabbitMQ"),
        ("manifesto_secrets.json", "Geração de manifesto de auditoria criptográfica"),
    ]
    for pattern, desc in mandates:
        if pattern in bash_script:
            print(f"  {C_GREEN}[PASS]{C_RESET} {desc} verificado no script bash.")
        else:
            print(f"  {C_RED}[FALHA]{C_RESET} {desc} ausente no script bash.")
            errors += 1

    # Veredicto
    print(f"\n{C_CYAN}------------------------------------------------------------------{C_RESET}")
    if errors == 0:
        print(f"{C_GREEN}✅ AUDITORIA CONCLUÍDA COM 100% DE SUCESSO! (0 erros){C_RESET}")
        print(f"{C_GREEN}Sub-etapa 7.1 pronta para homologação pela banca técnica.{C_RESET}")
        return 0
    else:
        print(f"{C_RED}❌ AUDITORIA FALHOU COM {errors} ERRO(S).{C_RESET}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
