# Samen Sterker - Mental Health App

> **Let op:** Dit is een experimenteel, maar professioneel opgezet project. Feedback en bijdragen zijn welkom!

## Project Pitch
Samen Sterker is een innovatieve mental health app die privacy, community, AI-advies en persoonlijke groei samenbrengt. Gebruikers kunnen hun stemming bijhouden, anoniem ervaringen delen, buddies vinden, chatten, AI-advies krijgen en hun voortgang volgen. Alles in een veilige, ondersteunende omgeving.

## User Journey (Loop-verhaal)
1. **Onboarding & Registratie**
   - Je downloadt de app, maakt een account aan en kiest je privacyvoorkeuren.
2. **Dagelijkse Check-in**
   - Je vult je stemming in, schrijft een kort dagboekje of vraagt AI om advies.
3. **Community & Buddy**
   - Je bekijkt de community feed, reageert op posts, of zoekt een buddy voor extra steun.
4. **Chat & Notificaties**
   - Je chat met je buddy of de community, ontvangt notificaties bij reacties of reminders.
5. **Voortgang & Groei**
   - Je bekijkt je voortgang in grafieken, krijgt AI-analyses en tips voor persoonlijke groei.
6. **(Optioneel) Premium**
   - Je kunt extra features unlocken via een veilige betaalmodule.
7. **Herhaal**
   - Elke dag opnieuw, in je eigen tempo, met de kracht van de community en AI.

## Snelstart: Zelf draaien

### Backend (.NET 8 + PostgreSQL)
1. **Vul je secrets in:**
   - Kopieer `backend/SamenSterkerApi/appsettings.Development.json.example` naar `appsettings.Development.json` en vul je eigen Supabase/Postgres, JWT en OpenAI keys in.
2. **Database migreren:**
   ```sh
   dotnet ef database update --project backend/SamenSterkerApi/SamenSterkerApi.csproj
   ```
3. **Start de backend:**
   ```sh
   dotnet run --project backend/SamenSterkerApi/SamenSterkerApi.csproj
   ```

### Frontend (React Native + Expo)
1. **Vul je secrets in:**
   - Kopieer `frontend/SamenSterkerApp/.env.example` naar `.env` en vul je eigen API URL en OpenAI key in.
2. **Installeer dependencies:**
   ```sh
   cd frontend/SamenSterkerApp
   npm install
   ```
3. **Start de app met Expo:**
   ```sh
   npx expo start
   ```
4. **Scan de QR-code** met de Expo Go app op je telefoon, of start een emulator.

## Experimenteel karakter
- Deze app is bedoeld als experimenteel platform voor nieuwe features, AI-integratie en community-gedreven mental health support.
- Niet bedoeld als vervanging voor professionele hulp.
- Issues, feedback en PR's zijn welkom!

## 🛡️ Veiligheid & Privacy
- Geen gevoelige data in de repo: secrets staan in `.env`/`appsettings.Development.json` (zie `.gitignore`).
- JWT-authenticatie, veilige wachtwoordopslag, en CORS zijn standaard.

## Licentie
MIT (of voeg je eigen licentie toe)

---

Veel plezier met experimenteren en bouwen aan Samen Sterker! 💚 