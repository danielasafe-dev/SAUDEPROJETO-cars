# Plano de Migracao do Legado -> C#

## 1. Levantamento do backend legado

Os modulos identificados no backend legado foram:

- `auth`
- `users`
- `patients`
- `evaluations`

Areas principais analisadas no legado:

- autenticacao
- usuarios
- pacientes
- avaliacoes

## 2. Estrategia recomendada

### Fase 1 - Congelar contrato HTTP

- catalogar request/response reais consumidos pelo React
- manter as mesmas rotas no ASP.NET Core
- manter os nomes JSON ja usados pelo frontend

### Fase 2 - Migrar dominio primeiro

Mapeamento sugerido:

| Legado | C# Domain | Observacao |
|---|---|---|
| `Usuario` do legado | `Cars.Dominio.Entidades.Usuario` | incluir `Email` como Value Object |
| `Paciente` do legado | `Cars.Dominio.Entidades.Paciente` | manter `avaliador_id` como relacao opcional |
| `Avaliacao` do legado | `Cars.Dominio.Entidades.Avaliacao` | `respostas` passa a ser `Dictionary<int,int>` com conversion no EF |
| `calc_score` | `ServicoClassificacaoCars.CalcularPontuacao` | regra pura de dominio |
| `classify` | `ServicoClassificacaoCars.Classificar` | regra pura de dominio |

### Fase 3 - Migrar casos de uso

| Service legado | C# Application service |
|---|---|
| `AuthService` | `AutenticacaoServicoAplicacao` |
| `UsuarioService` | `UsuariosServicoAplicacao` |
| `PacienteService` | `PacientesServicoAplicacao` |
| `AvaliacaoService` | `AvaliacoesServicoAplicacao` |

### Fase 4 - Migrar persistencia

- substituir a persistencia legada por `ContextoAplicacao`
- substituir SQL bruto por queries EF Core
- introduzir migrations versionadas
- remover dependencia do seed legado

### Fase 5 - Fazer corte gradual

Opcao recomendada:

1. subir a API .NET em outra porta, por exemplo `http://localhost:5060`
2. apontar `VITE_API_URL` para a API nova
3. homologar modulo por modulo
4. encerrar o backend legado apenas depois de fechar regressao funcional

## 3. Mapeamento de endpoints

### Autenticacao

- `POST /api/auth/login` -> `AutenticacaoApiController.Login`
- `GET /api/auth/me` -> `AutenticacaoApiController.Me`
- `POST /api/auth/register` -> `AutenticacaoApiController.Register`

### Usuarios

- `GET /api/users` -> `UsuariosApiController.List`
- `PUT /api/users/{id}/deactivate` -> `UsuariosApiController.Deactivate`

### Pacientes

- `GET /api/patients` -> `PacientesApiController.List`
- `POST /api/patients` -> `PacientesApiController.Create`

### Avaliacoes

- `GET /api/evaluations` -> `AvaliacoesApiController.List`
- `GET /api/evaluations/stats` -> `AvaliacoesApiController.Stats`
- `GET /api/evaluations/{id}` -> `AvaliacoesApiController.GetById`
- `POST /api/evaluations` -> `AvaliacoesApiController.Create`
- `DELETE /api/evaluations/{id}` -> `AvaliacoesApiController.Delete`

## 4. Garantias para nao quebrar o React

### Contratos que precisam continuar iguais

- login deve retornar `access_token`
- `/api/auth/me` deve devolver `role`, `ativo`, `criado_em`
- pacientes devem devolver `avaliador_id`
- avaliacoes devem devolver `patientId`, `patientNome`, `scoreTotal`, `dataAvaliacao`
- dashboard deve devolver `classificationDistribution` e `recentAvaliacoes`

### Ajustes que valem a pena fazer na migracao

- aceitar `patientId` e `patient_id` na criacao de avaliacao
- corrigir a criacao de novo paciente antes da avaliacao no frontend
- unificar o padrao JSON por modulo depois que o front estiver estabilizado

## 5. Como migrar sem risco

### Testes recomendados

- testes de contrato para cada endpoint principal
- testes de classificacao CARS
- testes de autenticacao e autorizacao
- testes de integracao com banco real local

### Checklist por modulo

1. replicar endpoint no C#
2. replicar DTO de entrada/saida
3. migrar regra de negocio
4. migrar repositorio
5. comparar resposta JSON com o contrato legado
6. validar no React

## 6. Ordem ideal de migracao

1. `auth`
2. `users`
3. `patients`
4. `evaluations`
5. dashboard

Essa ordem reduz risco porque autenticacao e cadastro basico destravam o restante do sistema.


