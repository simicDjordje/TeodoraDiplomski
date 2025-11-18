# Diplomski Frontend

Modern React + TypeScript frontend aplikacija sa HeroUI komponentama.

## Tehnologije

- **React 18** - UI biblioteka
- **TypeScript** - Type safety
- **Vite** - Build tool i dev server
- **HeroUI** - UI komponente
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client

## Instalacija

```bash
cd frontend
npm install
```

## Pokretanje

```bash
npm run dev
```

Aplikacija će biti dostupna na `http://localhost:3000`

## Build za produkciju

```bash
npm run build
```

## Struktura projekta

```
frontend/
├── src/
│   ├── components/     # Reusable komponente
│   ├── pages/         # Stranice aplikacije
│   ├── context/       # React context (Auth, itd.)
│   ├── routes/        # Routing konfiguracija
│   ├── utils/         # Utility funkcije (API client, itd.)
│   ├── App.tsx        # Glavna App komponenta
│   ├── main.tsx       # Entry point
│   └── index.css      # Globalni stilovi
├── public/            # Static fajlovi
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## API konfiguracija

API base URL se može konfigurisati preko environment varijable:

```bash
# .env
VITE_API_URL=http://localhost:8000
```

Ako nije postavljena, default je `http://localhost:8000`.

## Funkcionalnosti

- ✅ Autentifikacija (Login/Register)
- ✅ Login za organizacije
- ✅ Protected routes
- ✅ JWT token management
- ✅ Responsive design sa HeroUI
- ✅ Dark mode support (preko HeroUI)

## Dodatne funkcionalnosti

Možeš dodati:
- Profil stranice
- Događaji stranice
- Notifikacije
- Organizacije stranice
- Admin panel
- itd.

