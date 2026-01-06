# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Project overview

- **Frontend**: Expo app in `app/` using the Expo Router. Authentication screens live in `app/login-*` and `app/register*`.
- **Backend**: Express + Prisma API in `server/` (TypeScript).
- **Database**: PostgreSQL (via Docker Compose). Prisma schema and migrations are stored in `server/prisma`.

## Environment variables

- Frontend: copy `.env.example` to `.env` and adjust `EXPO_PUBLIC_API_URL` (defaults to `http://localhost:4000`).
- Backend: copy `server/.env.example` to `server/.env` and set `DATABASE_URL`, `JWT_SECRET`, and `PORT`.

## Running locally

1. Install dependencies (frontend) with `npm install`. For the API run `npm install` inside `server/` if you want a fresh install.
2. Start the database (Docker required): `docker compose up -d db`.
3. Apply migrations: `cd server && npx prisma migrate dev --name init` (once the DB is running).
4. Start the stack:
   - **API only**: `npm run dev:server` (watches TypeScript and restarts on changes).
   - **Expo only**: `npm run dev:expo`.
   - **API + Expo together**: `npm run dev` (spins up the DB via Docker and runs both processes in parallel).

## API endpoints

- `POST /auth/register` – body: `{ email, password, phoneNumber?, role }` → returns `{ user, token }` (user excludes password hash).
- `POST /auth/login` – body: `{ email, password }` → returns `{ user, token }`.
- `GET /me` – header: `Authorization: Bearer <token>` → returns `{ user }`.

Example requests (adjust base URL as needed):

```bash
curl -X POST "$EXPO_PUBLIC_API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"secret123","role":"PATIENT"}'

curl -X POST "$EXPO_PUBLIC_API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"secret123"}'

curl -H "Authorization: Bearer <token>" "$EXPO_PUBLIC_API_URL/me"
```

## Frontend auth flow

- Login and registration screens call the API via a central helper in `services/api.ts`.
- Tokens are stored securely in async storage on the device and reloaded on app start by `context/AuthContext`. On app launch the token is read and `/me` is called to refresh the user; invalid tokens are removed and the user is logged out.
- After successful login/registration the authenticated user is available through `useUser` / `useAuth` contexts for the rest of the app.
