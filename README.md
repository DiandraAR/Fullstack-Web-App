# Fullstack-Web-App

Aplicación web que muestra frases categorizadas con reglas diarias de uso.
El frontend consume un backend serverless conectado a PostgreSQL.

La app funciona:
- Localmente (IDX)
- En producción (Vercel)

Demo en producción:
https://mis-buenos-presagios.vercel.app/

---

## Tecnologías

### Frontend
- React
- TypeScript
- Vite
- React Router
- CSS 

### Backend
- Node.js (Serverless Functions)
- API REST
- PostgreSQL (Neon)
- pg

### Infraestructura / Deploy
- Vercel
- GitHub

---

## Ejecución local (IDX)

1. Clonar el repositorio
2. Instalar dependencias:
   npm install

3. Crear un archivo `.env` en la raíz del proyecto con:
   DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE

4. Ejecutar en desarrollo:
   npm run dev

---
