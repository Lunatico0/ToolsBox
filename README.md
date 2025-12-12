# ToolsBox

Aplicación web para gestionar el pañol de herramientas desde cualquier dispositivo. Permite registrar el inventario, solicitar y aprobar retiros, y marcar devoluciones en tiempo real para saber quién tiene cada herramienta y dónde está ubicada.

## Stack
- [Next.js](https://nextjs.org/) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com/) para estilos responsivos
- API en Node/Express-style mediante route handlers de Next
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) como ODM
- Validación con [Zod](https://zod.dev/)

## Configuración rápida
1. Copiá el archivo de entorno (creá `.env` si no existe) y configurá tu base:
   ```bash
   cp .env.example .env # si no existe, crealo con las vars de abajo
   # Editá MONGODB_URI con tu cadena de conexión
   # Define AUTH_SECRET para firmar los JWT de administradores
   # Opcional: DEFAULT_ADMIN_EMAIL/DEFAULT_ADMIN_PASSWORD para crear el primer admin al iniciar sesión
   ```
2. (Opcional) Dejá `NEXT_PUBLIC_DEMO_MODE=true` para probar la UI sin base de datos; colocá `false` para usar la API real.
3. Instalá dependencias y ejecutá el entorno local:
   ```bash
   npm install
   npm run dev
   ```
4. Abrí `http://localhost:3000` para usar la app.

## Funcionalidades
- Login para administradores con sesión vía cookie HTTP-only.
- Registro de herramientas con ubicación (estantería, columna, fila) y metadatos (marca, modelo, descripción).
- Alta de usuarios (Nombre, Apellido, DNI). El DNI es el identificador para solicitar herramientas.
- Solicitudes estilo “carrito”: se pueden pedir varias herramientas en la misma solicitud.
- Flujo de aprobaciones: asigna las herramientas a un técnico y registra fecha y aprobador.
- Devoluciones con notas, liberando automáticamente todas las herramientas de la solicitud.
- Tablero en vivo con inventario, solicitudes pendientes y asignaciones activas.

## Endpoints principales
- `POST /api/admin/login` – inicia sesión y setea cookie de administrador.
- `POST /api/admin/logout` – cierra sesión.
- `GET /api/tools` – listado de herramientas.
- `POST /api/tools` – crea una herramienta (requiere admin).
- `PATCH /api/tools/:id` – actualiza metadatos/ubicación (requiere admin).
- `GET /api/users` – listado de técnicos (requiere admin).
- `POST /api/users` – alta de usuario (requiere admin).
- `GET /api/requests` – historial de solicitudes (requiere admin).
- `POST /api/requests` – crea una solicitud de retiro para un DNI válido.
- `PATCH /api/requests/:id` – acciones de aprobación o devolución según `action` (`approve` o `return`, requiere admin).

## Notas
- Modo demo incorporado: permite visualizar el dashboard y probar flujos básicos sin conexión a MongoDB.
- Todos los datos persisten en MongoDB. Configurá `MONGODB_URI` antes de levantar el servidor.
- El diseño está pensado para uso mobile-first con componentes reutilizables y estados claros de error/éxito.
