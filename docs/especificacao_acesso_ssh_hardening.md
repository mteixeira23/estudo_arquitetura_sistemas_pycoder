# 🔐 Especificação de Hardening do Acesso SSH — SCSI
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 4 — Infraestrutura VPS & Hardening Linux  
**Sub-etapa:** 4.2 — Segurança de Acesso SSH e Chaves Criptográficas  
**Data de Emissão:** 24/09/2026  

---

## 1. Contexto e Vetor de Ameaça

O daemon SSH (`sshd`) é a porta de controle principal da VPS. Deixá-lo em suas configurações padrão (Porta 22 aberta, autenticação por senha habilitada, usuário `root` acessível) significa expor a infraestrutura a milhares de bots de força-bruta (*brute-force* e *credential stuffing*) diariamente. 

A arquitetura SCSI exige que o acesso administrativo remoto seja **criptograficamente blindado** e **ofuscado**.

---

## 2. Padronização de Chaves Criptográficas (Ed25519)

Fica estritamente proibido o uso de senhas ou chaves legadas (RSA de baixo bit, DSA, ECDSA) para o acesso ao servidor.

**Padrão Adotado:** **Ed25519** (Edwards-curve Digital Signature Algorithm).
- **Justificativa:** É mais rápido de gerar, possui chaves menores (facilitando o manuseio), é imune a ataques de temporização e possui uma curva elíptica mais segura que as do NIST (ECDSA).

**Comando de Geração (Na máquina local do Administrador):**
```bash
ssh-keygen -t ed25519 -a 100 -C "admin_scsi_hostinger" -f ~/.ssh/id_ed25519_scsi
```
A chave pública (`.pub`) deve ser injetada no servidor host dentro de `~/.ssh/authorized_keys` de um usuário sudoer não-root (ex: `scsi_admin`).

---

## 3. Configuração Restritiva do Daemon (`/etc/ssh/sshd_config`)

O arquivo principal do serviço SSH deve ser modificado para refletir a política de confiança zero (Zero Trust). As seguintes diretivas são obrigatórias:

```sshdconfig
# 1. Ofuscação (Redução de ruído de scanners passivos)
Port 22444

# 2. Protocolo e Restrições de Autenticação
Protocol 2
PermitRootLogin no
PasswordAuthentication no
PermitEmptyPasswords no
PubkeyAuthentication yes

# 3. Limitação de Tentativas
MaxAuthTries 3
MaxSessions 5

# 4. Controle de Timeout (Derrubar sessões inativas após 15 minutos)
ClientAliveInterval 300
ClientAliveCountMax 3

# 5. Desativação de Features Desnecessárias
X11Forwarding no
AllowTcpForwarding yes
PermitUserEnvironment no

# 6. Restrição de Usuários Permitidos (Opcional, mas recomendado)
AllowUsers scsi_admin
```

---

## 4. Procedimento Seguro de Implementação (Evitando Lockout)

A aplicação destas regras deve seguir uma ordem estrita para garantir que o administrador não perca acesso à própria VPS:

1. Acessar a VPS inicialmente via `root` (com a senha provisória da Hostinger).
2. Criar o usuário administrativo e adicioná-lo ao grupo `sudo`.
3. Copiar a chave pública local (Ed25519) para o `~/.ssh/authorized_keys` do novo usuário.
4. Aplicar as restrições acima no `/etc/ssh/sshd_config`.
5. Reiniciar o serviço SSH (`systemctl restart sshd`).
6. **MUITO IMPORTANTE:** Não fechar a sessão atual de imediato. Abrir um **novo terminal** na máquina local e testar o acesso com o novo usuário, nova porta e chave SSH.
7. Se o teste for bem-sucedido, fechar a sessão original do `root`.
