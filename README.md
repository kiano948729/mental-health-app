# Samen Sterker - Mental Health App

## Veiligheid & Secrets

- **Nooit** API keys, wachtwoorden of connection strings in de repo zetten!
- Alle gevoelige info staat in `.env` (frontend) of `appsettings.Development.json` (backend).
- Deze bestanden staan in `.gitignore` en worden niet geüpload.

## Setup

### Backend (.NET)
1. Kopieer `appsettings.Development.json.example` naar `appsettings.Development.json` en vul je eigen secrets in.
2. Run:
   ```sh
   dotnet ef database update --project backend/SamenSterkerApi/SamenSterkerApi.csproj
   dotnet run --project backend/SamenSterkerApi/SamenSterkerApi.csproj
   ```

### Frontend (React Native)
1. Kopieer `.env.example` naar `.env` in `frontend/SamenSterkerApp/` en vul je eigen API URL en OpenAI key in.
2. Run:
   ```sh
   cd frontend/SamenSterkerApp
   npm install
   npx expo start
   ```

## Belangrijk
- Als je per ongeluk een secret pusht, trek deze direct in en vervang hem overal.
- Zie `.gitignore` voor uitgesloten bestanden. 