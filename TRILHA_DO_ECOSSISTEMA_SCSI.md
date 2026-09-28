# 🗺️ Trilha do Ecossistema SCSI: O que Instalar vs O que Acessar pela Web
**Projeto:** SGI Fundação Dr. Jesus / Padrão Arquitetural SCSI (PycoderBR)  
**Data:** 28 de Setembro de 2026  

---

## 🧭 Visão Geral da Separação

Para operar e acompanhar com maestria a sua arquitetura em produção, você **não precisa encher o seu computador de programas pesados**. A arquitetura foi desenhada propositalmente para ser **leve no seu notebook e potente no servidor em nuvem**.

A divisão é muito simples:
1. **Pela Internet (Navegador):** Você monitora, acessa o sistema, gerencia o banco e administra a infraestrutura.
2. **No seu Computador (Instalação Local):** Você mantém apenas o ferramental leve para conversar comigo (Antigravity), editar código e sincronizar com o GitHub.

---

## 🌐 1. O que você Acessa pela Internet (Direto no Navegador)

Você não precisa instalar nenhum desses componentes no computador. Todos já estão no ar ou disponíveis em painéis web:

| Ferramenta / Serviço | O que faz no ecossistema | Onde e como você acessa |
| :--- | :--- | :--- |
| **SGI Frontend (Sistema Real)** | Interface web do usuário, cadastro de assistidos, consultas e prontuários | 👉 `https://www.singulariconsult.com.br` |
| **Django Admin (Gestão de Dados)** | Painel administrativo nativo do Django para gerenciar banco, usuários e tabelas sem precisar de cliente SQL | 👉 `https://api.singulariconsult.com.br/admin/` |
| **API Docs (Swagger / OpenAPI)** | Catálogo interativo de todas as rotas e endpoints da API REST do SGI | 👉 `https://api.singulariconsult.com.br/api/schema/swagger-ui/` |
| **Hostinger hPanel (Painel da VPS)** | Gráficos de uso de CPU, RAM, tráfego da VPS, reinicialização e **Terminal Web** no navegador | 👉 `https://hpanel.hostinger.com` |
| **Cloudflare Dashboard** | Gestão de DNS, certificados SSL/TLS, regras de Firewall (WAF), bloqueio de ataques e métricas CDN | 👉 `https://dash.cloudflare.com` |
| **GitHub** | Repositório central de código-fonte, histórico de alterações, branches e versionamento | 👉 `https://github.com/mteixeira23/estudo_arquitetura_sistemas_pycoder` |
| **Traefik Dashboard** | Visualização em tempo real de roteamento, rotas ativas, middlewares e certificados | 👉 `https://traefik.singulariconsult.com.br` |

---

## 💻 2. O que você Precisa Instalar no Computador

Para acompanhar, testar ou solicitar que o Antigravity desenvolva novos recursos no outro notebook, você precisa apenas de **4 ferramentas essenciais**:

### 🛠️ Kit Essencial de Desenvolvimento:

1. **Google Antigravity / IDE de IA (Obrigatório)**
   - **Função:** Sua central de inteligência artificial pareada para codificar, diagnosticar e executar comandos.
   - **Instalação:** Seu ambiente atual do Antigravity.

2. **Git for Windows (Obrigatório)**
   - **Função:** Permite clonar o repositório, baixar atualizações (`git pull`) e enviar novas funcionalidades (`git push`).
   - **Download oficial:** [https://git-scm.com/download/win](https://git-scm.com/download/win)

3. **VS Code (Visual Studio Code) (Recomendado)**
   - **Função:** Editor de código visual leve para abrir a pasta do projeto caso queira inspecionar arquivos manualmente.
   - **Download oficial:** [https://code.visualstudio.com/](https://code.visualstudio.com/)

4. **Python 3.12+ (Recomendado para testes locais)**
   - **Função:** Executar scripts de automação, linters locais e testes de APIs no notebook.
   - **Download oficial:** [https://www.python.org/downloads/](https://www.python.org/downloads/) *(marque a caixinha "Add Python to PATH" durante a instalação)*.

---

### 🧰 Ferramentas Opcionais (Apenas se quiser ir além):
- **DBeaver Community (Opcional):** [https://dbeaver.io/](https://dbeaver.io/) — Gerenciador visual de banco de dados SQL (só necessário se você quiser conectar diretamente ao PostgreSQL sem usar o painel do Django).
- **Docker Desktop (Opcional):** [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/) — Só é necessário se você quiser rodar todos os 9 containers dentro do seu próprio notebook (consome ~6GB a 8GB de RAM). Como a sua VPS Hostinger já roda tudo na nuvem, você **não** precisa do Docker Desktop no notebook!

---

## 🚀 3. Trilha Prática: Seu Fluxo de Trabalho Passo a Passo

### O seu ciclo diário de acompanhamento:
1. **Para ver o sistema funcionando:** Abra `https://www.singulariconsult.com.br` no Chrome.
2. **Para ver os dados de pacientes/assistidos:** Abra `https://api.singulariconsult.com.br/admin/`.
3. **Para ver se a máquina está estável:** Abra o hPanel da Hostinger e veja os gráficos de consumo de CPU/RAM.
4. **Para pedir novas telas ou recursos:** Abra o Antigravity no computador e diga o que quer construir!
