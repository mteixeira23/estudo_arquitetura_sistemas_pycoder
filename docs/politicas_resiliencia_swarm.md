# ♻️ Especificação de Políticas de Deploy e Resiliência — SCSI
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 5 — Orquestração de Containers (Docker Swarm)  
**Sub-etapa:** 5.4 — Limites de Recursos, Zero-Downtime e Healthchecks  
**Data de Emissão:** 24/09/2026  

---

## 1. O Problema da Canibalização de Recursos

No Docker puro, um container mal otimizado (ex: um script de IA em Python que sofre de *Memory Leak*) pode consumir 100% da RAM e CPU do servidor, congelando a máquina inteira e derrubando o Banco de Dados.

Para arquiteturas corporativas, adotamos o isolamento estrito via **Cgroups**. Cada aplicação no SCSI operará sob duas métricas:
- **Reservations:** O mínimo garantido que o Swarm reserva fisicamente na máquina para aquele container iniciar.
- **Limits:** O teto absoluto. Se o container tentar ultrapassar o limite de RAM, o Kernel do Linux (OOM Killer) o destrói imediatamente, protegendo o servidor.

---

## 2. Estratégia de Deploy Zero-Downtime

Quando fizermos o push de uma nova versão do código (Nova Imagem Docker), o sistema não pode sair do ar durante o tempo em que o Python está iniciando. 
Utilizamos a política `start-first` (Rolling Update):
1. O Swarm sobe o container V2 ao lado do V1.
2. O Swarm aguarda o V2 reportar status *Healthy* (Pronto).
3. O Swarm roteia o tráfego do Traefik do V1 para o V2.
4. O Swarm desliga o V1 suavemente.

---

## 3. Self-Healing e Healthchecks (Autocura)

O Docker sabe se o processo PID 1 está rodando, mas não sabe se a API do Django travou em um *deadlock*. 
Implementamos rotinas de **Healthcheck** baseadas em chamadas HTTP ou CLI. Se o serviço falhar 3 vezes consecutivas, o Swarm executa a política de `restart_policy`, expurgando o container travado e criando um novo em folha.

---

## 4. Blueprint Declarativo de Resiliência (Exemplo Django API)

Nos arquivos `docker-compose.yml` da Fase 6 e 7, todos os serviços de *backend* (Django, Celery) deverão obrigatoriamente seguir a seguinte estrutura de *deploy*:

```yaml
services:
  django_api:
    image: registry.scsi.local/django_api:latest
    networks:
      - scsi_public
      - scsi_internal
      - scsi_data

    # 1. Healthcheck: A prova de vida da aplicação
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health/"]
      interval: 30s       # Executa a cada 30 segundos
      timeout: 10s        # Desiste se demorar 10 segundos
      retries: 3          # Na 3ª falha, marca como "Unhealthy"
      start_period: 20s   # Janela de carência na inicialização (Boot do Django)

    deploy:
      replicas: 2
      
      # 2. Cotas de Recursos (Prevenção OOM)
      resources:
        limits:
          cpus: '1.0'     # Teto: 1 Núcleo de CPU no máximo
          memory: 1024M   # Teto: 1GB de RAM (Se passar, container morre)
        reservations:
          cpus: '0.25'    # Mínimo: 1/4 de núcleo
          memory: 256M    # Mínimo: 256MB de RAM

      # 3. Política de Atualização (Zero-Downtime)
      update_config:
        parallelism: 1    # Atualiza 1 replica por vez
        delay: 10s        # Aguarda 10s entre a atualização de cada réplica
        order: start-first # Sobe o novo ANTES de matar o velho
        failure_action: rollback # Se a V2 bugar, volta para a V1 sozinho

      # 4. Política de Autocura
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 5
        window: 120s
```

Essa estrutura transforma a aplicação em um ecossistema auto-gerenciável. A infraestrutura percebe falhas no código, lida com picos de consumo bloqueando o vazamento e atualiza em produção sem que os usuários notem qualquer queda de serviço.
