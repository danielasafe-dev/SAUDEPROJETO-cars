# CARS - Projeto Saude

Sistema para apoio a aplicacao da escala **CARS (Childhood Autism Rating Scale)**, com:

- backend em **Python + FastAPI**
- frontend em **React + Vite + TypeScript**
- persistencia em **SQL Server**
- estrutura pronta para **Docker**, embora o fluxo principal hoje esteja sendo usado com banco externo

Este README descreve **como o projeto esta hoje**, como subir cada parte localmente e quais pontos merecem atencao no estado atual do codigo.

## 1. Visao geral

O projeto esta dividido em duas aplicacoes principais:

- `backend/`: API REST em FastAPI
- `frontend/`: interface web em React

O backend concentra:

- autenticacao com JWT
- cadastro e login de usuarios
- cadastro de pacientes
- criacao e consulta de avaliacoes CARS
- dashboard com estatisticas

O frontend oferece:

- tela de login
- dashboard inicial
- listagem e cadastro de pacientes
- listagem de avaliacoes
- formulario de nova avaliacao
- area de usuarios para perfil `admin`

## 2. Estrutura do repositorio

```text
SAUDEPROJETO-cars/
|-- backend/
|   |-- app/
|   |   |-- config.py
|   |   |-- database.py
|   |   |-- main.py
|   |   |-- domains/
|   |   |   |-- auth/
|   |   |   |-- users/
|   |   |   |-- patients/
|   |   |   `-- evaluations/
|   |-- alembic/
|   |-- requirements.txt
|   |-- seed.py
|   `-- Dockerfile
|-- frontend/
|   |-- src/
|   |   |-- domains/
|   |   |-- shared/
|   |   `-- App.tsx
|   |-- package.json
|   `-- vite.config.ts
|-- docker-compose.yml
|-- index.html
|-- script.js
`-- style.css
```

Observacao:

- `index.html`, `script.js` e `style.css` na raiz parecem ser arquivos de apoio/prototipo antigo e nao fazem parte do fluxo principal do frontend em React.

## 3. Stack atual

### Backend

- Python 3.12 recomendado
- FastAPI
- Uvicorn
- SQLAlchemy
- PyODBC
- SQL Server
- JWT com `python-jose`
- Senhas com `passlib` + `bcrypt`

### Frontend

- Node.js 20+ recomendado
- React 19
- TypeScript
- Vite
- Zustand
- Axios
- React Router
- React Query
- Recharts
- Tailwind CSS 4

## 4. Como o sistema funciona hoje

### Backend

O backend sobe uma API FastAPI em `http://localhost:8000`.

Rotas principais:

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/register`
- `GET /api/users`
- `PUT /api/users/{id}/deactivate`
- `GET /api/patients`
- `POST /api/patients`
- `GET /api/evaluations`
- `GET /api/evaluations/stats`
- `GET /api/evaluations/{id}`
- `POST /api/evaluations`
- `DELETE /api/evaluations/{id}`
- `GET /health`

A documentacao automatica da API fica em:

- `http://localhost:8000/docs`

### Banco de dados

O projeto esta configurado para usar **SQL Server com autenticacao SQL**.

Por padrao, o backend espera:

- servidor: `localhost`
- porta: `1433`
- banco: `cars_db`
- usuario: `sa1`
- senha: `sa@1234`

Hoje, o fluxo real de inicializacao do banco e:

1. criar o banco caso ele nao exista
2. criar as tabelas via `Base.metadata.create_all(...)`
3. criar o usuario administrador padrao

Tudo isso acontece no script:

- `backend/seed.py`

Ou seja: apesar da pasta `alembic/` existir, **o caminho principal em uso nao esta baseado em migrations versionadas**.

### Frontend

O frontend sobe com Vite, normalmente em:

- `http://localhost:5173`

Ele consome a API usando a variavel:

- `VITE_API_URL`

Se essa variavel nao for definida, o frontend usa por padrao:

- `http://localhost:8000`

Tambem existe suporte a modo mock:

- `VITE_MOCK_MODE=true`

## 5. Pre-requisitos para rodar localmente

Antes de subir o projeto local sem Docker, garanta:

- Python 3.12 instalado
- Node.js 20+ instalado
- npm instalado
- SQL Server rodando
- ODBC Driver 17 for SQL Server instalado no Windows

Importante:

- o backend monta a string de conexao com `ODBC Driver 17 for SQL Server`
- se sua maquina tiver somente outro driver, a conexao pode falhar

## 6. Configuracao do backend

O backend le variaveis de ambiente a partir de um arquivo `.env` dentro da pasta `backend/`.

Existe um exemplo pronto em:

- `backend/.env.example`

### Exemplo de `.env`

```env
app_name=CARS API
debug=development

db_server=localhost
db_port=1433
db_name=cars_db
db_user=sa1
db_password=sa@1234

jwt_secret=super-secret-key-change-in-production
jwt_algorithm=HS256
jwt_expire_minutes=1440
```

## 7. Como rodar o backend localmente

### Primeira execucao

Na primeira vez, ou quando estiver configurando o projeto em outra maquina, execute:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python seed.py
```

Depois edite o arquivo `.env` e confirme que ele esta com os dados corretos do seu SQL Server:

```env
db_server=localhost
db_port=1433
db_name=cars_db
db_user=sa1
db_password=sa@1234
```

### Subir o backend no dia a dia

Depois que o ambiente virtual ja existe, as dependencias ja foram instaladas e o arquivo `.env` ja foi criado, para iniciar o backend normalmente voce precisa apenas:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### O que cada passo faz

- `python -m venv .venv`: cria o ambiente virtual
- `Activate.ps1`: ativa o ambiente virtual no PowerShell
- `pip install -r requirements.txt`: instala dependencias do backend
- `Copy-Item .env.example .env`: cria o arquivo local de configuracao uma vez
- `python seed.py`: cria banco, tabelas e usuario admin quando necessario
- `uvicorn ... --reload`: sobe a API em modo desenvolvimento

Importante:

- voce nao precisa recriar o `.env` toda vez
- voce nao precisa rodar `python seed.py` toda vez
- no uso normal, basta ativar o ambiente virtual e subir o `uvicorn`

### URLs importantes do backend

- API: `http://localhost:8000`
- health check: `http://localhost:8000/health`
- Swagger: `http://localhost:8000/docs`

## 8. Como rodar o frontend localmente

O frontend le variaveis de ambiente dentro da pasta `frontend/`.

Existe um exemplo pronto em:

- `frontend/.env.example`

### Exemplo de `.env`

```env
VITE_API_URL=http://localhost:8000
VITE_MOCK_MODE=false
```

### Comandos

Em outro terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Depois disso, abra:

- `http://localhost:5173`

## 9. Credenciais iniciais

Ao executar `python seed.py`, o projeto cria este usuario padrao:

- e-mail: `admin@cars.com`
- senha: `admin123`
- perfil: `admin`

Essas credenciais tambem aparecem na tela de login do frontend.

## 10. Fluxo recomendado para desenvolvimento

Como voce esta usando SQL Server fora do Docker, o fluxo mais simples hoje e:

1. garantir que o SQL Server esteja rodando
2. subir o backend localmente em `localhost:8000`
3. subir o frontend localmente em `localhost:5173`
4. acessar a aplicacao pelo navegador

Resumo:

- SQL Server: fora do Docker
- backend: local com Python
- frontend: local com npm/Vite

## 11. Sobre o Docker no projeto

O repositorio possui:

- `backend/Dockerfile`
- `docker-compose.yml`

O `docker-compose.yml` foi montado para subir:

- um container de SQL Server
- um container do backend
- um container do frontend

Mas no seu cenario atual isso **nao e o fluxo principal**, porque:

- voce esta usando SQL Server separado
- o backend ja esta preparado para conectar em banco externo por variaveis de ambiente

### Observacao importante sobre o Docker atual

Hoje existe um possivel desalinhamento:

- o `Dockerfile` do backend instala o driver `msodbcsql18`
- a aplicacao esta configurada para usar `ODBC Driver 17 for SQL Server`

Entao, se voce decidir usar Docker depois, esse ponto pode precisar de ajuste.

## 12. Modulos funcionais atuais

### Autenticacao

- login com JWT
- leitura do usuario autenticado
- criacao de usuario por rota protegida

### Usuarios

- listagem de usuarios
- desativacao de usuario
- controle por perfil `admin`

### Pacientes

- listagem
- cadastro

### Avaliacoes

- criacao de avaliacao
- listagem
- detalhamento
- exclusao
- dashboard com estatisticas

### Classificacao CARS implementada

- ate `29.5`: `Sem indicativo de TEA`
- acima de `29.5` e abaixo de `37`: `TEA Leve a Moderado`
- `37` ou mais: `TEA Grave`

## 13. Observacoes importantes sobre o estado atual

O objetivo aqui e registrar o projeto como ele esta hoje, inclusive alguns pontos que ainda podem precisar de ajuste:

- A pasta `alembic/` existe, mas nao ha migrations versionadas no repositorio. O banco esta sendo criado pelo `seed.py`.
- O frontend envia criacao de usuario para `/api/auth/register`, mas nao envia o campo `password` exigido pelo backend. Na pratica, esse fluxo pode falhar sem ajuste.
- O frontend envia criacao de avaliacao com `patientId`, enquanto o backend espera `patient_id`. Esse fluxo tambem pode falhar no estado atual.
- Na tela de nova avaliacao, quando o usuario escolhe "Novo Paciente", o frontend nao cria o paciente no backend antes de salvar a avaliacao.
- O CORS do backend esta liberado para `localhost:5173`, `127.0.0.1:5173`, `localhost:3000` e `127.0.0.1:3000`. Se mudar as portas, talvez seja necessario ajustar isso.

## 14. Comandos uteis

### Subir backend

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Recriar banco e admin

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python seed.py
```

### Subir frontend

```powershell
cd frontend
npm run dev
```

### Build do frontend

```powershell
cd frontend
npm run build
```

## 15. Resumo rapido

Se quiser apenas o caminho direto para trabalhar:

1. subir o SQL Server
2. entrar em `backend/`
3. criar `.env`
4. instalar dependencias
5. rodar `python seed.py`
6. subir o FastAPI em `localhost:8000`
7. entrar em `frontend/`
8. criar `.env`
9. rodar `npm install`
10. rodar `npm run dev`
11. abrir `http://localhost:5173`
