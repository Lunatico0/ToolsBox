# ToolsBox

Aplicación web para gestionar el pañol de herramientas desde cualquier dispositivo. Permite registrar el inventario, solicitar y aprobar retiros, y marcar devoluciones en tiempo real para saber quién tiene cada herramienta y dónde está ubicada.

## Stack
- [Next.js](https://nextjs.org/) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com/) para estilos responsivos
- API en Node/Express-style mediante route handlers de Next
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) como ODM
- Validación con [Zod](https://zod.dev/)

## Configuración rápida
1. Copiá el archivo de entorno y configurá tu base:
   ```bash
   cp .env.example .env
   # Editá MONGODB_URI con tu cadena de conexión
   ```
2. (Opcional) Dejá `NEXT_PUBLIC_DEMO_MODE=true` para probar la UI sin base de datos; colocá `false` para usar la API real.
3. Instalá dependencias y ejecutá el entorno local:
   ```bash
   npm install
   npm run dev
   ```
4. Abrí `http://localhost:3000` para usar la app.

## Funcionalidades
- Registro de herramientas con ubicación (estantería, columna, fila) y metadatos (marca, modelo, descripción).
- Solicitudes de retiro por técnicos, con validación de disponibilidad.
- Flujo de aprobaciones: asigna la herramienta a un técnico y registra fecha y aprobador.
- Devoluciones con notas, liberando la herramienta automáticamente.
- Tablero en vivo con inventario, solicitudes pendientes y asignaciones activas.

## Endpoints principales
- `GET /api/tools` – listado de herramientas.
- `POST /api/tools` – crea una herramienta.
- `PATCH /api/tools/:id` – actualiza metadatos/ubicación.
- `GET /api/requests` – historial de solicitudes.
- `POST /api/requests` – crea una solicitud de retiro.
- `PATCH /api/requests/:id` – acciones de aprobación o devolución según `action` (`approve` o `return`).

## Notas
- Modo demo incorporado: permite visualizar el dashboard y probar flujos básicos sin conexión a MongoDB.
- Todos los datos persisten en MongoDB. Configurá `MONGODB_URI` antes de levantar el servidor.
- El diseño está pensado para uso mobile-first con componentes reutilizables y estados claros de error/éxito.
