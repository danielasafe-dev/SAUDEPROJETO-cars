# Frontend SPI

Aplicacao React + Vite + TypeScript do sistema SPI.

## Ambiente

Crie `frontend/.env` a partir de `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5060
VITE_MOCK_MODE=false
```

## Scripts

```powershell
npm install
npm run dev
npm run build
npm run preview
```

## Observacoes

- o frontend continua ativo e nao depende mais do backend Python removido
- a API esperada agora e a do projeto `backend-dotnet/`
- se quiser testar sem API, ative `VITE_MOCK_MODE=true`



