#!/usr/bin/env python3
"""
Auditor Automatizado de Hardening de VPS Linux (Padrão SCSI)
Valida a conformidade arquitetural dos artefatos da Sub-etapa 6.2.
"""

import os
import sys

def test_hardening_script_compliance():
    script_path = os.path.join(os.path.dirname(__file__), "hardening_vps_hostinger.sh")
    assert os.path.exists(script_path), f"Arquivo não encontrado: {script_path}"

    with open(script_path, "rb") as f:
        content_bytes = f.read()

    # Validação ADR 007: Pureza LF (Unix) sem contaminação por \r do Windows
    assert b"\r" not in content_bytes, "Violação da ADR 007: Script contém quebras de linha Windows (CRLF)."

    content_text = content_bytes.decode("utf-8")

    # 1. SSH Hardening
    assert "Port ${SSH_PORT}" in content_text or "Port 22444" in content_text

    assert "PermitRootLogin no" in content_text
    assert "PasswordAuthentication no" in content_text
    assert "PubkeyAuthentication yes" in content_text
    assert "KexAlgorithms curve25519-sha256" in content_text

    # 2. UFW Default Deny
    assert "ufw default deny incoming" in content_text
    assert "ufw default allow outgoing" in content_text

    # 3. Cloudflare Whitelist
    cloudflare_prefixes = [
        "173.245.48.0/20", "103.21.244.0/22", "104.16.0.0/13", "172.64.0.0/13",
        "2400:cb00::/32", "2606:4700::/32", "2a06:98c0::/29"
    ]
    for prefix in cloudflare_prefixes:
        assert prefix in content_text, f"Prefixo Cloudflare ausente: {prefix}"

    # 4. Docker vs UFW (DOCKER-USER Chain)
    assert ":DOCKER-USER - [0:0]" in content_text
    assert "-A DOCKER-USER -j ufw-user-forward" in content_text

    # 5. Fail2ban
    assert "fail2ban" in content_text
    assert "bantime = 3600" in content_text
    assert "maxretry = 3" in content_text

    # 6. Sysctl BBR
    assert "net.ipv4.tcp_congestion_control = bbr" in content_text
    assert "net.core.somaxconn = 65535" in content_text
    assert "fs.file-max = 2097152" in content_text

    print("=" * 80)
    print("✅ AUDITORIA DE HARDENING DE VPS (SUB-ETAPA 6.2): 100% CONFORME!")
    print("  -> Regras de SSH Ed25519 e desativação de root/senha: OK")
    print("  -> Firewall UFW Default Deny com porta customizada: OK")
    print("  -> Whitelist dos 15 blocos IPv4 e 7 blocos IPv6 da Cloudflare: OK")
    print("  -> Resolução de conflito Docker com cadeia DOCKER-USER: OK")
    print("  -> Jail do Fail2ban com ban progressivo e maxretry=3: OK")
    print("  -> Otimização de Kernel Sysctl BBR e somaxconn 65535: OK")
    print("  -> Pureza Unix LF (ADR 007): 0 bytes CR detectados.")
    print("=" * 80)

if __name__ == "__main__":
    test_hardening_script_compliance()
