# ðŸ›¡ï¸ EspecificaÃ§Ã£o de ImplantaÃ§Ã£o do Traefik e Socket Proxy â€” SCSI
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (PadrÃ£o PycoderBR / SCSI)  
**MÃ³dulo:** Fase 5 â€” OrquestraÃ§Ã£o de Containers (Docker Swarm)  
**Sub-etapa:** 5.3 â€” Traefik Ingress Base e Blindagem de Socket  
**Data de EmissÃ£o:** 24/09/2026  

---

## 1. A Vulnerabilidade CrÃ­tica do Docker Socket

No Docker Swarm, o Traefik precisa "escutar" os eventos do cluster (saber quando um container do Django ou Flower sobe ou desce) para rotear o trÃ¡fego dinamicamente. A forma padrÃ£o (e amadora) de fazer isso Ã© mapeando o arquivo `/var/run/docker.sock` do servidor host para dentro do container do Traefik.

**O Vetor de Ataque:** 
O arquivo `docker.sock` possui privilÃ©gios de **ROOT** no sistema operacional. Se uma vulnerabilidade for descoberta no Traefik (que Ã© a nossa porta de entrada pÃºblica para a internet), o atacante ganha acesso irrestrito ao socket e pode executar qualquer comando na mÃ¡quina fÃ­sica, assumindo controle total da infraestrutura.

---

## 2. A SoluÃ§Ã£o Arquitetural: Docker Socket Proxy

Para anular essa vulnerabilidade, adotamos a arquitetura de **Socket Proxy** (via imagem `tecnativa/docker-socket-proxy`).

**Como funciona a blindagem:**
1. Criamos um container microscÃ³pico (Socket Proxy) que Ã© o Ãºnico com acesso real ao `/var/run/docker.sock`.
2. O Traefik **nÃ£o tem acesso** ao socket fÃ­sico.
3. O Traefik se comunica via TCP com o Socket Proxy atravÃ©s de uma rede interna exclusiva (`scsi_socket_net`).
4. O Socket Proxy atua como um firewall: ele **proÃ­be** qualquer requisiÃ§Ã£o de alteraÃ§Ã£o (POST, PUT, DELETE) e **sÃ³ permite leitura** (GET) nas APIs estritamente necessÃ¡rias (Containers, Services, Tasks e Nodes).

---

## 3. Blueprint Declarativo (`docker-compose.traefik.yml`)

Este Ã© o desenho da Stack do Traefik, integrando a rede pÃºblica definida na Sub-etapa 5.1 e os segredos da Sub-etapa 5.2.

```yaml
version: "3.9"

services:
  # 1. O FIREWALL DO DOCKER DAEMON
  socket-proxy:
    image: tecnativa/docker-socket-proxy:latest
    environment:
      # PermissÃµes estritas de Leitura (Zero escrita)
      CONTAINERS: 1
      SERVICES: 1
      TASKS: 1
      NODES: 1
      NETWORKS: 1
      POST: 0
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - scsi_socket_net
    deploy:
      placement:
        constraints: [node.role == manager]

  # 2. O REVERSE PROXY / INGRESS
  traefik:
    image: traefik:v3.1
    command:
      - "--providers.docker.endpoint=tcp://socket-proxy:2375" # Aponta para o proxy
      - "--providers.docker.swarmMode=true"
      - "--providers.docker.exposedbydefault=false"
      - "--providers.file.directory=/etc/traefik/dynamic" # Refs da Fase 3
    ports:
      - target: 80
        published: 80
        mode: host
      - target: 443
        published: 443
        mode: host
    volumes:
      - ./traefik-config:/etc/traefik
    secrets:
      - scsi_origin_crt
      - scsi_origin_key
    networks:
      - scsi_public
      - scsi_socket_net
    deploy:
      mode: global
      placement:
        constraints: [node.role == manager]

networks:
  scsi_public:
    external: true
  scsi_socket_net:
    driver: overlay
    attachable: false # Somente serviÃ§os deste arquivo podem usar

secrets:
  scsi_origin_crt:
    external: true
  scsi_origin_key:
    external: true
```

---

## 4. AnÃ¡lise de Constraints e Isolamento

- **`node.role == manager`**: Como o Traefik (via Proxy) precisa ler eventos do Swarm (orquestraÃ§Ã£o), esses containers sÃ£o obrigatoriamente *pinados* (fixados) nos nÃ³s que possuem papel de Manager.
- **Isolamento de Portas (`mode: host`)**: Publicamos as portas 80 e 443 em modo `host` em vez de `ingress` para bypassar a malha de roteamento padrÃ£o do Docker. Isso otimiza a latÃªncia TCP brutalmente e preserva os IPs reais dos clientes passando pela Cloudflare.
