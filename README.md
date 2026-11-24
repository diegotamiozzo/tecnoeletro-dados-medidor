# Device Manager

Sistema web para cadastro e vinculação de dispositivos a usuários, com gerenciamento de permissões de acesso, compartilhamento por convite e painel administrativo centralizado.

Desenvolvido com **Laravel 12** no backend e **React + TypeScript** no frontend, integrados via **Inertia.js**.

---

## Funcionalidades

### Autenticação e Segurança

- Login, cadastro e recuperação de senha
- Verificação de e-mail obrigatória
- Autenticação de dois fatores (2FA / TOTP) com QR Code e códigos de recuperação
- Rate limiting nas rotas de autenticação
- Middleware de proteção para rotas administrativas

### Gestão de Dispositivos

- Vínculo de dispositivos via MAC Address e PIN de segurança
- Perfis de acesso: owner (proprietário) e viewer (convidado)
- Compartilhamento de acesso por e-mail com envio automático de convite
- Convites pendentes vinculados automaticamente ao criar conta
- Dashboard individual por dispositivo

### Painel Administrativo

- Cadastro, edição e exclusão de dispositivos
- Visualização do proprietário de cada dispositivo
- Ativação e inativação de dispositivos
- Acesso restrito a usuários com permissão de administrador

### Notificações por E-mail

- Convite de acesso com link de cadastro pré-preenchido
- Redefinição de senha em português

---

## Tecnologias

### Backend

| Tecnologia           | Versão |
| -------------------- | ------- |
| PHP                  | ^8.2    |
| Laravel              | ^12.0   |
| Laravel Fortify      | ^1.30   |
| Inertia.js (Laravel) | ^2.0    |
| Laravel Wayfinder    | ^0.1.9  |

### Frontend

| Tecnologia           | Versão |
| -------------------- | ------- |
| React                | ^19     |
| TypeScript           | ^5.7    |
| Inertia.js (React)   | ^2.1    |
| Tailwind CSS         | ^4.0    |
| shadcn/ui + Radix UI | —      |
| Vite                 | ^7.0    |

---

## Instalação

### Pré-requisitos

- PHP 8.2+
- Composer
- Node.js + npm
- Git

### Passo a Passo

**1. Clone o repositório**

```bash
git clone <url-do-repositorio>
cd <nome-do-projeto>
```

**2. Instale as dependências PHP**

```bash
composer install
```

**3. Configure o ambiente**

```bash
cp .env.example .env
php artisan key:generate
```

Edite o arquivo `.env` conforme necessário. Por padrão, o projeto utiliza **SQLite**.

**4. Execute as migrações**

```bash
php artisan migrate
```

**5. Instale as dependências JavaScript**

```bash
npm install
```

**6. Inicie os servidores**

```bash
# Inicia Laravel, fila e Vite simultaneamente
composer run dev
```

Ou separadamente:

```bash
# Terminal 1 — Laravel
php artisan serve

# Terminal 2 — Vite (React)
npm run dev

# Terminal 3 — Fila (necessária para envio de e-mails)
php artisan queue:listen --tries=1
```

A aplicação estará disponível em `http://localhost:8000`.

---

## Comandos Artisan

### Criar Administrador

```bash
php artisan admin:create
```

Com opções via argumento:

```bash
php artisan admin:create --email=admin@exemplo.com --name="Admin" --password=senha123
```

---

## Estrutura de Rotas

### Rotas Públicas

| Método  | Rota                        | Descrição            |
| -------- | --------------------------- | ---------------------- |
| GET      | `/`                       | Página inicial        |
| GET/POST | `/login`                  | Autenticação         |
| GET/POST | `/register`               | Cadastro               |
| GET/POST | `/forgot-password`        | Recuperação de senha |
| GET/POST | `/reset-password/{token}` | Redefinição de senha |
| GET/POST | `/two-factor-challenge`   | Desafio 2FA            |

### Rotas Autenticadas

| Método | Rota                        | Descrição                          |
| ------- | --------------------------- | ------------------------------------ |
| GET     | `/devices`                | Listagem dos dispositivos vinculados |
| POST    | `/devices`                | Vincular novo dispositivo            |
| PUT     | `/devices/{id}`           | Editar dispositivo                   |
| DELETE  | `/devices/{id}`           | Desvincular dispositivo              |
| GET     | `/devices/{id}/dashboard` | Dashboard do dispositivo             |
| GET     | `/settings/profile`       | Perfil do usuário                   |
| GET     | `/settings/password`      | Alterar senha                        |
| GET     | `/settings/two-factor`    | Configurar 2FA                       |
| GET     | `/settings/appearance`    | Aparência                           |

### Rotas Administrativas

| Método | Rota                        | Descrição                  |
| ------- | --------------------------- | ---------------------------- |
| GET     | `/admin/devices`          | Listar todos os dispositivos |
| POST    | `/admin/devices`          | Cadastrar dispositivo        |
| PUT     | `/admin/devices/{device}` | Editar dispositivo           |
| DELETE  | `/admin/devices/{device}` | Excluir dispositivo          |

---

## Banco de Dados

### Principais Tabelas

| Tabela                     | Descrição                                       |
| -------------------------- | ------------------------------------------------- |
| `users`                  | Usuários do sistema                              |
| `devices`                | Dispositivos cadastrados                          |
| `device_user`            | Relação usuário-dispositivo com campo `role` |
| `device_invites`         | Convites pendentes por e-mail                     |
| `sessions`               | Sessões ativas                                   |
| `jobs` / `failed_jobs` | Fila de trabalhos assíncronos                    |

### Bancos de Dados Suportados

- SQLite (padrão, recomendado para desenvolvimento)
- MySQL / MariaDB
- PostgreSQL

Configure a conexão pelas variáveis `DB_CONNECTION`, `DB_HOST`, `DB_DATABASE`, `DB_USERNAME` e `DB_PASSWORD` no arquivo `.env`.

---

## Testes

O projeto utiliza **Pest PHP** com testes de feature cobrindo:

- Autenticação (login, logout, rate limiting)
- Registro de usuários
- Verificação de e-mail
- Recuperação e redefinição de senha
- Autenticação de dois fatores (2FA)
- Atualização de perfil e senha
- Exclusão de conta
- Acesso autenticado ao dashboard

```bash
composer test
```

---

## Interface

A interface utiliza o tema **New York** do shadcn/ui com suporte a modo claro e escuro (light / dark / system), configurável por usuário e persistido via cookie.

O layout principal conta com sidebar colapsável para navegação entre dispositivos e o painel administrativo. As páginas de autenticação utilizam layout centralizado.

---
