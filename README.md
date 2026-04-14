# CARS - Projeto Saude

Sistema de apoio a aplicacao da escala **CARS (Childhood Autism Rating Scale)** com:

- frontend em **React + Vite + TypeScript**
- novo backend em **C# / ASP.NET Core**
- arquitetura organizada em **DDD + Clean Architecture**
- persistencia em **SQL Server**

O backend antigo em Python foi removido do repositório. A base oficial do servidor agora fica em `backend-dotnet/`.

## Estrutura atual

```text
SAUDEPROJETO/
|-- backend-dotnet/
|   |-- Cars.sln
|   |-- docs/
|   `-- src/
|       |-- Cars.Api/
|       |-- Cars.Application/
|       |-- Cars.Domain/
|       |-- Cars.Infrastructure.Data/
|       `-- Cars.Infrastructure.IoC/
|-- frontend/
|   |-- public/
|   |-- src/
|   |-- package.json
|   `-- vite.config.ts
|-- index.html
|-- script.js
`-- style.css
```

Observacao:

- `index.html`, `script.js` e `style.css` na raiz parecem ser arquivos de apoio/prototipo antigo e nao fazem parte do fluxo principal do frontend React.

## Como o sistema fica organizado

### `frontend/`

- interface web usada pelos profissionais
- consome a API ASP.NET Core via `VITE_API_URL`
- continua independente do backend removido

### `backend-dotnet/`

- `Cars.Api`: presentation, controllers, middlewares, auth, Swagger e `Program.cs`
- `Cars.Application`: casos de uso, DTOs, interfaces e orquestracao
- `Cars.Domain`: entidades, value objects, regras de negocio e contratos
- `Cars.Infrastructure.Data`: EF Core, `DbContext`, mappings, repositories, migrations e seed
- `Cars.Infrastructure.IoC`: composicao das dependencias

## Endpoints esperados pela interface

O React continua consumindo estes endpoints:

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

## Configuracao local

### Frontend

Arquivo de exemplo:

- `frontend/.env.example`

Conteudo:

```env
VITE_API_URL=http://localhost:5060
VITE_MOCK_MODE=false
```

### Backend .NET

Arquivo principal:

- `backend-dotnet/src/Cars.Api/appsettings.json`

Connection string padrao:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=cars_db;User Id=sa1;Password=sa@1234;TrustServerCertificate=True;MultipleActiveResultSets=True"
  }
}
```

## Execucao local

### Frontend

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Frontend em:

- `http://localhost:5173`

### Backend ASP.NET Core

```powershell
cd backend-dotnet
dotnet restore
dotnet ef database update --project .\src\Cars.Infrastructure.Data\Cars.Infrastructure.Data.csproj --startup-project .\src\Cars.Api\Cars.Api.csproj
dotnet run --project .\src\Cars.Api\Cars.Api.csproj
```

API em desenvolvimento:

- `http://localhost:5060`
- `https://localhost:7060`

Swagger:

- `https://localhost:7060/swagger`

## Credenciais iniciais

O seed do backend .NET esta configurado para criar:

- e-mail: `admin@cars.com`
- senha: `admin123`
- perfil: `admin`

Configuracao em:

- `backend-dotnet/src/Cars.Api/appsettings.json`

## Arquivos importantes da migracao

- guia da base .NET: [backend-dotnet/README.md](backend-dotnet/README.md)
- plano de migracao: [backend-dotnet/docs/migration-plan.md](backend-dotnet/docs/migration-plan.md)

## Resumo rapido

Para seguir o desenvolvimento agora:

1. manter o SQL Server local rodando
2. usar `backend-dotnet/` como backend oficial
3. usar `frontend/` normalmente
4. apontar o frontend para `http://localhost:5060`
