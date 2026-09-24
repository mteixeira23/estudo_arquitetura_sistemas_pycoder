# 🐧 Análise de Sistema Operacional e Hardening Base — SCSI
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 4 — Infraestrutura VPS & Hardening Linux  
**Sub-etapa:** 4.1 — Seleção de OS e Configurações Essenciais (REVISADA)  
**Data de Emissão:** 24/09/2026  
**Status:** **Homologado Colegiadamente**

---

## 1. Contexto e Requisitos da VPS (Hostinger)

A VPS atuará como o nó gerenciador (Manager Node) e worker inicial do Docker Swarm. Ela será o alicerce onde o Traefik, PostgreSQL, Redis, RabbitMQ e os serviços Python (Django, Celery, LangGraph) rodarão. 

**Requisitos Críticos do Sistema Operacional:**
- **Estabilidade:** Suporte de Longo Prazo (LTS) garantido.
- **Segurança:** Atualizações de segurança automatizadas e framework de MAC (Mandatory Access Control) nativo.
- **Modernidade:** Kernel recente o suficiente para suportar as features mais avançadas de rede do Docker (eBPF) e drivers modernos.

---

## 2. Trade-offs: Ubuntu 24.04 LTS vs Debian 12

| Critério | Ubuntu 24.04 LTS (Noble Numbat) | Debian 12 (Bookworm) |
| :--- | :--- | :--- |
| **Kernel Linux** | v6.8 (Moderno, excelente para rede/eBPF) | v6.1 (Muito estável, mas envelhecendo) |
| **Ciclo de Vida** | 5 anos padrão (Até 2029) + 7 anos ESM | ~3 anos LTS + 2 anos ELTS (Até 2028) |
| **Segurança MAC** | AppArmor (Ativado e bem perfilado por padrão) | AppArmor (Disponível, perfis base) |
| **Atualizações Automáticas** | `unattended-upgrades` altamente polido e padrão | Requer configuração manual mais atenta |
| **Suporte Docker/IA** | Referência número 1 (Tier A) da documentação oficial | Tier A, mas pode exigir backports futuros |
| **Consumo de Recursos** | Ligeiramente maior (ferramentas como snapd presentes) | Extremamente leve (Minimalista) |

---

## 3. ADR 012 — Adoção do Ubuntu 24.04 LTS como Padrão SCSI

**Decisão:** Fica definido o **Ubuntu 24.04 LTS (Noble Numbat)** como o Sistema Operacional padrão para todos os nós da infraestrutura SCSI na Hostinger.

**Justificativa Técnica:**
1. **Longevidade Insuperável:** O ciclo LTS da Canonical fornece a tranquilidade necessária para focar no código em vez de planejar upgrades de SO no curto prazo.
2. **Kernel 6.8 (GPU/eBPF):** Traz suporte nativo robusto a eBPF (beneficiando roteamento Swarm/Traefik) e integração superior com KVM/VFIO, extraindo máxima performance caso GPUs (NVIDIA/ROCm) sejam alocadas para frameworks como PyTorch e vLLM.
3. **Ecossistema:** Ferramentas de hardening e pacotes de IA costumam mirar primariamente o ecossistema Ubuntu mais recente.

---

## 4. Hardening Base (Ações de Pós-Instalação Imediata)

Assim que a VPS for provisionada, as seguintes rotinas operacionais (via script ou playbook) devem ser executadas:

### 4.1. Sincronização de Tempo e Localidade (Crítico para Banco de Dados e Criptografia)
Sistemas distribuídos e validação de certificados TLS (Origin CA) falham se o relógio estiver dessincronizado. Paralelamente, o PostgreSQL (Collation) e o Python exigem codificação UTF-8 rigorosa.
```bash
# 1. Definir timezone para UTC (Evita anomalias em logs, RabbitMQ e checkpoints do LangGraph)
timedatectl set-timezone UTC
systemctl enable --now systemd-timesyncd

# 2. Gerar e cravar a localidade do sistema como UTF-8
locale-gen en_US.UTF-8
update-locale LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8
```

### 4.2. Atualizações Desacompanhadas (Unattended Upgrades)
Automatizar a aplicação de patches de segurança de severidade crítica/alta, mitigando vulnerabilidades zero-day antes mesmo de uma intervenção manual.
```bash
apt-get update && apt-get upgrade -y
apt-get install -y unattended-upgrades apt-listchanges

# Habilitar atualizações apenas do repositório de segurança
dpkg-reconfigure -plow unattended-upgrades

# [IA-SAFE] Garantir que o servidor NUNCA reinicie automaticamente interrompendo cargas de trabalho
echo 'Unattended-Upgrade::Automatic-Reboot "false";' >> /etc/apt/apt.conf.d/50unattended-upgrades
```

### 4.3. Limpeza de Pacotes Desnecessários
Redução da superfície de ataque eliminando serviços pré-instalados inúteis (como servidores web legados, FTP, RPC).
```bash
# Remover o Snapd (Docker Swarm rodará via APT, snap não será usado e consome CPU/RAM)
systemctl stop snapd
apt-get purge -y snapd
rm -rf /snap /var/snap /var/lib/snapd

# Remover serviços inúteis que abrem portas
apt-get purge -y rpcbind apache2 xinetd telnet
apt-get autoremove -y && apt-get clean
```

### 4.4. Perfis do AppArmor
O AppArmor deve permanecer ativo no modo *Enforce*. O Docker cria automaticamente perfis restritivos (`docker-default`) para isolar os containers do host. Nenhuma desativação do AppArmor é permitida no ambiente SCSI.
