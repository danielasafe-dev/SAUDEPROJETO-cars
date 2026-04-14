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
|   |   |   |-- Pacientes/
|   |   |   |-- Saude/
|   |   |   `-- Usuarios/
|   |   |-- Extensoes/
|   |   |-- Middlewares/
|   |   |-- Program.cs
|   |   |-- appsettings.json
|   |   `-- Properties/
|   |-- Cars.Aplicacao/
|   |   |-- DTOs/
|   |   |-- Interfaces/
|   |   |   |-- Autenticacao/
|   |   |   |-- Avaliacoes/
|   |   |   |-- IUnitOfWork.cs
|   |   |   |-- Pacientes/
|   |   |   |-- Seguranca/
|   |   |   `-- Usuarios/
|   |   |-- Mapeamentos/
|   |   `-- Servicos/
|   |       |-- Autenticacao/
|   |       |-- Avaliacoes/
|   |       |-- Pacientes/
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

- entidades centrais (`Usuario`, `Paciente`, `Avaliacao`)
- value object (`Email`)
- regras puras da escala CARS
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

| Legado | ASP.NET Core |
|---|---|
| `POST /api/auth/login` | `AutenticacaoApiController.Login` |
| `GET /api/auth/me` | `AutenticacaoApiController.Me` |
| `POST /api/auth/register` | `AutenticacaoApiController.Register` |
| `GET /api/users` | `UsuariosApiController.List` |
| `PUT /api/users/{id}/deactivate` | `UsuariosApiController.Deactivate` |
| `GET /api/patients` | `PacientesApiController.List` |
| `POST /api/patients` | `PacientesApiController.Create` |
| `GET /api/evaluations` | `AvaliacoesApiController.List` |
| `GET /api/evaluations/stats` | `AvaliacoesApiController.Stats` |
| `GET /api/evaluations/{id}` | `AvaliacoesApiController.GetById` |
| `POST /api/evaluations` | `AvaliacoesApiController.Create` |
| `DELETE /api/evaluations/{id}` | `AvaliacoesApiController.Delete` |
| `GET /health` | `SaudeApiController.Get` |

## Como rodar localmente

Nao executei nenhum restore nem instalacao nesta entrega. Quando voce quiser subir a API .NET, o fluxo esperado e:

1. ajustar a connection string em `src/Cars.API/appsettings.json`
2. aplicar migrations
3. iniciar o projeto `Cars.API`

Exemplo de comandos futuros:

```powershell
cd backend-dotnet
dotnet restore
dotnet ef database update --project .\src\Cars.Infraestrutura\Cars.Infraestrutura.csproj --startup-project .\src\Cars.API\Cars.API.csproj
dotnet run --project .\src\Cars.API\Cars.API.csproj
```

Por padrao, a API esta preparada para usar **SQL Server local** em:

- `localhost,1433`
- banco `cars_db`
- usuario `sa1`
- senha `sa@1234`

## Compatibilidade com o frontend atual

- o JWT continua sendo enviado como `Bearer`
- os endpoints principais permanecem iguais
- `CriarAvaliacaoRequisicaoDto` aceita `patientId` e `patient_id`
- usuarios e pacientes continuam retornando `criado_em` e `avaliador_id`
- avaliacoes continuam retornando `patientId`, `scoreTotal`, `dataAvaliacao`

## Observacoes de migracao

- a base legada usava SQL bruto no modulo de avaliacoes; na nova estrutura isso foi centralizado em EF Core + repositorios
- o seed do admin agora fica controlado por configuracao (`Inicializacao`)
- a classificacao CARS foi movida para o dominio (`ServicoClassificacaoCars`)
- a solucao foi organizada para permitir migracao gradual por modulo

