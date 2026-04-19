# CARS Backend em ASP.NET Core

Base do backend oficial em **C# / ASP.NET Core**, sucedendo o backend legado e mantendo o frontend React consumindo a mesma API.

## Estrutura da solution

```text
backend-dotnet/
|-- Cars.sln
|-- src/
|   |-- Cars.API/
|   |   |-- Controllers/
|   |   |   |-- Autenticacao/
|   |   |   |-- Avaliacoes/
|   |   |   |-- Dashboard/
|   |   |   |-- Formularios/
|   |   |   |-- Grupos/
|   |   |   |-- Pacientes/
|   |   |   |-- Perfil/
|   |   |   |-- Saude/
|   |   |   `-- Usuarios/
|   |   |-- Extensoes/
|   |   |-- Middlewares/
|   |   |-- Program.cs
|   |   |-- appsettings.json
|   |   `-- Properties/
|   |-- Cars.Aplicacao/
|   |   |-- DTOs/
|   |   |   |-- Dashboard/
|   |   |   |-- Formularios/
|   |   |   |-- Grupos/
|   |   |   |-- Perfil/
|   |   |-- Interfaces/
|   |   |   |-- Autenticacao/
|   |   |   |-- Avaliacoes/
|   |   |   |-- Dashboard/
|   |   |   |-- Formularios/
|   |   |   |-- Grupos/
|   |   |   |-- IUnitOfWork.cs
|   |   |   |-- Pacientes/
|   |   |   |-- Perfil/
|   |   |   |-- Seguranca/
|   |   |   `-- Usuarios/
|   |   |-- Mapeamentos/
|   |   `-- Servicos/
|   |       |-- Acesso/
|   |       |-- Autenticacao/
|   |       |-- Avaliacoes/
|   |       |-- Dashboard/
|   |       |-- Formularios/
|   |       |-- Grupos/
|   |       |-- Pacientes/
|   |       |-- Perfil/
|   |       `-- Usuarios/
|   |-- Cars.Dominio/
|   |   |-- Comum/
|   |   |-- Entidades/
|   |   |-- Enumeracoes/
|   |   |-- ModelosLeitura/
|   |   |-- Repositorios/
|   |   |-- Servicos/
|   |   `-- ObjetosDeValor/
|   |-- Cars.Infraestrutura/
|   |   |-- Migracoes/
|   |   |-- Persistencia/
|   |   |-- Repositorios/
|   |   |-- Seguranca/
|   |   `-- Inicializacao/
|   `-- Cars.Infraestrutura.IoC/
|       `-- InjecaoDependencia.cs
`-- docs/
    `-- migration-plan.md
```

## Papel de cada camada

### `Cars.API`

- Controllers e rotas HTTP organizados por contexto de negocio
- `Program.cs` com Swagger, JWT, CORS e bootstrap
- middleware global de excecao

### `Cars.Aplicacao`

- casos de uso
- DTOs de entrada e saida
- contratos de servicos
- orquestracao entre API, dominio e repositorios

### `Cars.Dominio`

- entidades centrais (`Usuario`, `Grupo`, `Paciente`, `Formulario`, `Avaliacao`)
- value object (`Email`)
- regras puras da escala CARS e regras de perfil/escopo
- contratos de repositorio

### `Cars.Infraestrutura`

- EF Core
- `DbContext`
- mapeamentos Fluent API
- repositorios concretos
- JWT, hash de senha e seed inicial
- migration inicial de exemplo

### `Cars.Infraestrutura.IoC`

- composicao das dependencias
- registro de services, repositories e infraestrutura

## Endpoints mapeados da API atual

| Endpoint | ASP.NET Core |
|---|---|
| `POST /api/auth/login` | `AutenticacaoApiController.Login` |
| `GET /api/auth/me` | `AutenticacaoApiController.Me` |
| `POST /api/auth/register` | `AutenticacaoApiController.Register` |
| `GET /api/users` | `UsuariosApiController.List` |
| `PUT /api/users/{id}/deactivate` | `UsuariosApiController.Deactivate` |
| `PUT /api/users/{id}/groups` | `UsuariosApiController.UpdateGroups` |
| `GET /api/dashboard` | `DashboardApiController.Get` |
| `GET /api/groups` | `GruposApiController.List` |
| `POST /api/groups` | `GruposApiController.Create` |
| `PUT /api/groups/{id}` | `GruposApiController.Update` |
| `GET /api/forms` | `FormulariosApiController.List` |
| `GET /api/forms/{id}` | `FormulariosApiController.GetById` |
| `POST /api/forms` | `FormulariosApiController.Create` |
| `PUT /api/forms/{id}` | `FormulariosApiController.Update` |
| `GET /api/patients` | `PacientesApiController.List` |
| `POST /api/patients` | `PacientesApiController.Create` |
| `GET /api/evaluations` | `AvaliacoesApiController.List` |
| `GET /api/evaluations/stats` | `AvaliacoesApiController.Stats` |
| `GET /api/evaluations/{id}` | `AvaliacoesApiController.GetById` |
| `POST /api/evaluations` | `AvaliacoesApiController.Create` |
| `DELETE /api/evaluations/{id}` | `AvaliacoesApiController.Delete` |
| `GET /api/evaluations/{id}/export/excel` | `AvaliacoesApiController.ExportExcel` |
| `GET /api/evaluations/{id}/export/pdf` | `AvaliacoesApiController.ExportPdf` |
| `GET /api/profile` | `PerfilApiController.Get` |
| `PUT /api/profile` | `PerfilApiController.Update` |
| `GET /health` | `SaudeApiController.Get` |

## Perfis de acesso

- `admin`: acesso total, inclusive avaliacao, grupos, usuarios e formularios globais
- `analista`: acesso somente ao dashboard
- `agente_saude`: acesso operacional e permissao para avaliar dentro dos grupos vinculados
- `gestor`: acesso operacional e administrativo dentro dos grupos que gerencia

## Escopo de grupos

- usuarios podem pertencer a varios grupos por meio de `user_group_memberships`
- cada grupo possui um `gestor_id`
- pacientes pertencem a um grupo
- avaliacoes herdam o grupo do paciente
- formularios podem ser globais ou vinculados a um grupo

## Como rodar localmente

O backend suporta **SQLite** e **SQL Server**, escolhidos por configuracao em `src/Cars.API/appsettings.json`.

### Opcao 1: SQLite

Configuracao padrao:

```json
{
  "Database": {
    "Provider": "Sqlite"
  },
  "ConnectionStrings": {
    "Sqlite": "Data Source=App_Data/cars.db"
  }
}
```

Comandos:

```powershell
cd backend-dotnet
dotnet restore
dotnet run --project .\src\Cars.API\Cars.API.csproj
```

No modo SQLite, o schema e criado automaticamente no primeiro start.

### Opcao 2: SQL Server

Altere a configuracao para:

```json
{
  "Database": {
    "Provider": "SqlServer"
  }
}
```

Connection string de exemplo:

- `Server=localhost,1433;Database=cars_db;User Id=sa1;Password=sa@1234;TrustServerCertificate=True;MultipleActiveResultSets=True`

Comandos:

```powershell
cd backend-dotnet
dotnet restore
dotnet ef database update --project .\src\Cars.Infraestrutura\Cars.Infraestrutura.csproj --startup-project .\src\Cars.API\Cars.API.csproj
dotnet run --project .\src\Cars.API\Cars.API.csproj
```

## Compatibilidade com o frontend atual

- o JWT continua sendo enviado como `Bearer`
- os endpoints principais permanecem iguais
- `CriarAvaliacaoRequisicaoDto` aceita `patientId` e `patient_id`
- avaliacoes agora tambem aceitam `formId`
- usuarios e pacientes continuam retornando `criado_em` e `avaliador_id`
- pacientes passam a retornar `group_id` e `group_nome`
- usuarios passam a retornar os grupos vinculados e `podeAvaliar`
- avaliacoes continuam retornando `patientId`, `scoreTotal`, `dataAvaliacao` e agora incluem grupo/formulario

## Observacoes de migracao

- a base legada usava SQL bruto no modulo de avaliacoes; na nova estrutura isso foi centralizado em EF Core + repositorios
- o seed do admin agora fica controlado por configuracao (`Inicializacao`)
- a classificacao CARS foi movida para o dominio (`ServicoClassificacaoCars`)
- grupos, formularios dinamicos e exportacao de avaliacao foram incorporados sem dependencias extras
- a solucao foi organizada para permitir migracao gradual por modulo

