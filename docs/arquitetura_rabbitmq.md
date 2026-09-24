# 🐇 Mensageria Assíncrona: RabbitMQ
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 7 — Mensageria Assíncrona & IA Cognitiva  
**Sub-etapa:** 7.1 (Passo 12) — Broker de Mensagens (RabbitMQ)  
**Data de Emissão:** 24/09/2026  

---

## 1. O Paradigma do Desacoplamento (Por que não chamar a IA direto?)

Em sistemas que consomem LLMs (Inteligência Artificial Generativa), o tempo de resposta da API (Tokens gerados) varia de 2 a 30 segundos. Se o Django chamasse a IA diretamente (de forma síncrona), o usuário ficaria olhando para uma tela carregando e o worker do Gunicorn ficaria bloqueado, impedindo que outros usuários usassem o sistema.

O **RabbitMQ** atua como nosso "Agente de Correios". O Django empacota o pedido do usuário em uma mensagem instantânea, joga na fila do RabbitMQ (que responde em 1 milissegundo) e avisa o cliente: *"Sua requisição está sendo processada"*. O RabbitMQ guarda essa mensagem com segurança até que um Celery Worker esteja livre para processá-la.

**Atenção ao Padrão de Payload Magro:** Como alertado pela engenharia de IA, as mensagens enviadas ao RabbitMQ devem conter apenas *ponteiros* (ex: `user_id`, `prompt_id`). Evite serializar contextos vetoriais ou históricos longos na fila, evitando que o broker estoure o limite de 1GB de RAM e pagine em disco.

## 2. Injeção Nativa de Segredos (Zero .env)

Para nossa alegria, a imagem oficial do RabbitMQ suporta injeção nativa de segredos via arquivo (exatamente como o PostgreSQL, dispensando as manobras que fizemos no Redis). Utilizaremos as variáveis com sufixo `_FILE`.

## 3. Topologia de Rede Restrita

O RabbitMQ é um componente de bastidores (Backend invisível). Ele rodará **exclusivamente na rede `scsi_internal`**.
- O Django envia mensagens por essa rede.
- O Celery consome mensagens dessa rede.
- Nem o Traefik (borda) nem o PostgreSQL (`scsi_data`) têm consciência de que o RabbitMQ existe.

## 4. Blueprint Declarativo (Docker Swarm)

```yaml
services:
  rabbitmq:
    image: rabbitmq:3-management-alpine
    networks:
      - scsi_internal
    volumes:
      - scsi_rabbitmq_data:/var/lib/rabbitmq
    environment:
      - RABBITMQ_DEFAULT_USER_FILE=/run/secrets/scsi_rabbitmq_user
      - RABBITMQ_DEFAULT_PASS_FILE=/run/secrets/scsi_rabbitmq_password
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "-q", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 20s
    deploy:
      placement:
        constraints: [node.labels.mq_node == "true"]
      resources:
        limits:
          cpus: '1.0'
          memory: 1024M
        reservations:
          cpus: '0.25'
          memory: 512M
    secrets:
      - scsi_rabbitmq_user
      - scsi_rabbitmq_password

volumes:
  scsi_rabbitmq_data:
    driver: local
```

*Nota sobre a imagem:* Optamos pela versão `-management-alpine`. Embora a regra global (ADR 011) restrinja o uso manual de dashboards web pelo usuário, habilitar a API de Management do RabbitMQ na porta 15672 (internamente) é vital para que o Antigravity consiga monitorar programaticamente o tamanho das filas (através de chamadas REST) e tomar decisões de auto-scaling no futuro.
