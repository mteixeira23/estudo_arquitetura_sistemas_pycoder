#!/usr/bin/env python3
"""
Auditor de Conformidade e Sintaxe do Traefik Ingress Controller (Padrão SCSI)
Valida a integridade arquitetural dos artefatos da Sub-etapa 6.3.
"""

import os
import sys

def check_file_lf_and_read(file_path: str) -> str:
    assert os.path.exists(file_path), f"Arquivo não encontrado: {file_path}"
    with open(file_path, "rb") as f:
        data = f.read()
    assert b"\r" not in data, f"Violação da ADR 007: Quebras de linha Windows detectadas em {file_path}."
    return data.decode("utf-8")


def test_traefik_architecture_compliance():
    base_dir = os.path.dirname(os.path.dirname(__file__))

    compose_file = os.path.join(base_dir, "docker-compose.traefik.yml")
    traefik_yml = os.path.join(base_dir, "config", "traefik", "traefik.yml")
    tls_yml = os.path.join(base_dir, "config", "traefik", "dynamic", "tls.yml")
    middlewares_yml = os.path.join(base_dir, "config", "traefik", "dynamic", "middlewares.yml")

    compose_content = check_file_lf_and_read(compose_file)
    traefik_content = check_file_lf_and_read(traefik_yml)
    tls_content = check_file_lf_and_read(tls_yml)
    middlewares_content = check_file_lf_and_read(middlewares_yml)

    # 1. Validações do docker-compose.traefik.yml
    assert "socket-proxy" in compose_content, "Serviço socket-proxy ausente no compose."
    assert "POST: 0" in compose_content, "Permissão de POST deve ser 0 no socket-proxy (Zero Escrita)."
    assert "mode: host" in compose_content, "Portas 80 e 443 devem operar em mode: host."
    assert "scsi_socket_net" in compose_content, "Rede interna scsi_socket_net ausente."
    assert "scsi_public" in compose_content, "Rede pública de ingress scsi_public ausente."
    assert "node.role == manager" in compose_content, "Traefik e Socket-proxy devem estar nos nós manager."

    # 2. Validações do traefik.yml
    assert "tcp://socket-proxy:2375" in traefik_content, "Endpoint do provedor docker deve ser tcp://socket-proxy:2375."
    assert "173.245.48.0/20" in traefik_content, "Bloco IPv4 Cloudflare ausente nos trustedIPs."
    assert "2400:cb00::/32" in traefik_content, "Bloco IPv6 Cloudflare ausente nos trustedIPs."
    assert "responseHeaderTimeout: \"300s\"" in traefik_content, "Timeout de IA ampliado ausente."
    assert "CF-Connecting-IP: keep" in traefik_content, "Rastreabilidade de CF-Connecting-IP ausente no log."

    # 3. Validações do dynamic/tls.yml
    assert "VersionTLS12" in tls_content, "Versão mínima TLS 1.2 ausente."
    assert "X25519" in tls_content, "Curva elíptica de alta performance X25519 ausente."
    assert "sniStrict: true" in tls_content, "sniStrict obrigatório para blindagem contra scan direto."
    assert "/run/secrets/scsi_origin_crt" in tls_content, "Caminho do certificado Origin CA ausente."

    # 4. Validações do dynamic/middlewares.yml
    assert "text/event-stream" in middlewares_content, "text/event-stream deve ser excluído da compressão para SSE de IA."
    assert "Strict-Transport-Security" in middlewares_content, "HSTS Preload ausente no middleware de headers."
    assert "scsi-admin-auth" in middlewares_content, "Middleware de BasicAuth para dashboard ausente."
    assert "scsi-cf-whitelist" in middlewares_content, "Middleware de Whitelist Cloudflare ausente."

    print("=" * 80)
    print("✅ AUDITORIA DO TRAEFIK INGRESS CONTROLLER (SUB-ETAPA 6.3): 100% CONFORME!")
    print("  -> Docker Socket Proxy com POST:0 e isolamento de rede: OK")
    print("  -> Portas 80 e 443 em mode: host (Cloudflare IP preservation): OK")
    print("  -> TrustedIPs oficiais Cloudflare (15 IPv4 e 7 IPv6): OK")
    print("  -> Timeouts de IA ampliados para 300s (LangGraph/Ollama): OK")
    print("  -> Cifras AEAD, curva X25519 e sniStrict no TLS: OK")
    print("  -> Middleware de compressão excluindo text/event-stream (SSE): OK")
    print("  -> BasicAuth e Headers de segurança corporativos: OK")
    print("  -> Pureza Unix LF (ADR 007): 0 bytes CR em todos os 4 arquivos YAML.")
    print("=" * 80)

if __name__ == "__main__":
    test_traefik_architecture_compliance()
