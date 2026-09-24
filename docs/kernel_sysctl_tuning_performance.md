# ⚙️ Especificação de Auditoria de Kernel e Sysctl Tuning — SCSI
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 4 — Infraestrutura VPS & Hardening Linux  
**Sub-etapa:** 4.4 — Otimização de Kernel (Sysctl) para Alta Performance  
**Data de Emissão:** 24/09/2026  

---

## 1. Contexto Arquitetural

A infraestrutura SCSI rodará bancos de dados (PostgreSQL), instâncias de cache (Redis), mensageria (RabbitMQ) e um Ingress reverso (Traefik) sob uma pesada orquestração de rede em malha (Docker Swarm). O kernel Linux do Ubuntu, em sua instalação padrão, é conservador e otimizado para *desktops* ou servidores de baixo tráfego.

Para evitar que a nossa VPS sofra restrições de *sockets*, contenção de rede ou uso prematuro de *Swap* (que destrói a performance de IA e Redis), precisamos injetar uma configuração robusta diretamente no Kernel.

---

## 2. Parâmetros de Otimização (Sysctl)

Deve ser criado o arquivo `/etc/sysctl.d/99-scsi-tuning.conf` com os seguintes blocos lógicos:

### 2.1. Controle de Congestionamento de Rede (TCP BBR)
Desenvolvido pela Google, o BBR aumenta dramaticamente o throughput de rede e reduz a latência, especialmente para clientes com conexões instáveis.
```sysctl
# Utilizar o escalonador Fair Queue e o algoritmo BBR
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr
```

### 2.2. Aumento Extremo de File Descriptors e Conexões (Backlog)
Bancos de dados e Traefik abrem milhares de *sockets* simultâneos. Se o kernel bater no limite padrão, rejeitará requisições instantaneamente (Erro `502/504` ou `Too many open files`).
```sysctl
# Limite global de descritores de arquivos no SO
fs.file-max = 2097152

# Aumentar a fila de conexões pendentes aguardando aceite (Traefik/Gunicorn)
net.core.somaxconn = 65535

# Aumentar backlog de SYN (proteção suave contra SYN Flood)
net.ipv4.tcp_max_syn_backlog = 16384
```

### 2.3. Otimização de Buffers TCP
Adaptamos o tamanho das "janelas" de tráfego TCP para aguentar payloads maiores de streaming (ex: Streaming de LLM via LangGraph ou uploads/downloads de mídia).
```sysctl
# Buffers Core
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.core.rmem_default = 1048576
net.core.wmem_default = 1048576

# Buffers TCP Específicos (min, default, max)
net.ipv4.tcp_rmem = 4096 1048576 16777216
net.ipv4.tcp_wmem = 4096 1048576 16777216
```

### 2.4. TCP Keepalive Dinâmico
Libera conexões "zumbis" ou clientes que caíram sem avisar, limpando a tabela do Traefik rapidamente.
```sysctl
net.ipv4.tcp_keepalive_time = 300
net.ipv4.tcp_keepalive_intvl = 15
net.ipv4.tcp_keepalive_probes = 5
net.ipv4.tcp_fin_timeout = 15
```

### 2.5. Comportamento de Memória (Swappiness)
Para bancos de dados em memória (Redis) e processamento intensivo (PostgreSQL/IA), é preferível usar 100% da RAM real antes de recorrer ao disco (Swap).
```sysctl
# Reduz a tendência do kernel de usar swap (padrão é 60)
vm.swappiness = 10
# Evita esgotamento prematuro em commits de memória pesados
vm.overcommit_memory = 1
```

---

## 3. Procedimento de Aplicação

Após popular o arquivo com os blocos acima, o administrador deve recarregar as diretivas para o Kernel sem necessidade de reboot (Hot Reload):

```bash
sysctl -p /etc/sysctl.d/99-scsi-tuning.conf
```

Para confirmar que o BBR foi carregado corretamente na interface de rede principal, executar:
```bash
sysctl net.ipv4.tcp_congestion_control
# Saída esperada: net.ipv4.tcp_congestion_control = bbr
```
