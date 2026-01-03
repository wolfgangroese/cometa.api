# Cometa

Kulturorientierte Open-Source Crowdsourcing-Plattform.

## Struktur

- `backend/` - .NET 9.0 API
- `frontend/` - Angular 18 Web App

## Lokale Entwicklung

```bash
# Backend + Datenbank starten
docker-compose up -d

# Frontend starten
cd frontend
npm install
npm start
```

## Deployment

Push auf `main` loest automatisches Deployment aus:
- Backend-Aenderungen (`backend/**`) -> Docker Build -> Raspberry Pi
- Frontend-Aenderungen (`frontend/**`) -> npm Build -> Raspberry Pi

## Lizenz

EUPL-1.2
