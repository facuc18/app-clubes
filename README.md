# Clubes

Aplicación móvil y web para crear clubes, encontrar comunidades, gestionar miembros y consultar encuentros semanales.

## Estructura

```text
app-clubes/
	app/
		_layout.tsx              # sesión y rutas protegidas
		login.tsx / register.tsx # acceso y registro
		(tabs)/_layout.tsx        # barra inferior y destinos
		(tabs)/index.tsx          # catálogo, búsqueda y filtros
		(tabs)/my-clubs.tsx       # calendario de clubes inscritos
		(tabs)/create.tsx         # creación de clubes
		(tabs)/profile.tsx        # cuenta y edición de clubes propios
		club/[id].tsx             # detalle, membresía y conflictos horarios
	ctx/auth.tsx                # token de sesión y cierre de sesión
	utils/club-photo.ts         # selector y compresión de imágenes
	assets/images/              # iconos/configuración visual
	app.json                    # configuración Expo/permisos

app-clubes-backend/
	src/auth/                   # registro, login, JWT, perfil y DTOs
	src/clubes/                 # controlador, reglas y DTOs de clubes
	src/db/schema.ts            # tablas Drizzle/Turso
	src/main.ts                 # servidor, CORS, límite JSON y validación
	migrations/                 # SQL 0001–0004 en orden de aplicación
	.env.example                # nombres de variables, sin credenciales reales
```

## Tecnologías y motivos

- **Expo + React Native:** un solo cliente para Android, iOS y web.
- **Expo Router:** navegación por archivos y protección de pantallas según la sesión.
- **TypeScript:** mantiene tipados los datos de pantallas, rutas y API.
- **Expo Image Picker/Manipulator:** permite elegir, recortar y comprimir fotos antes de guardarlas.
- **NestJS:** separa la API en controladores, servicios y módulos.
- **class-validator:** valida las entradas del cliente en el servidor.
- **Passport JWT:** protege operaciones de membresía, perfil y administración.
- **bcrypt:** almacena hashes de contraseña y no las contraseñas originales.
- **Drizzle ORM + Turso/libSQL:** esquema relacional tipado y base SQLite remota.

Las fotos se guardan como JPEG Base64 en Turso, con un límite de 500 KB. Es adecuado para el tamaño actual del proyecto; si crece el volumen, conviene pasar a almacenamiento de objetos y conservar solo URLs en la base.

## Configuración

Requisitos: Node.js compatible con Expo 57 y pnpm. En `app-clubes-backend`, copiá `.env.example` a `.env` y completá `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` y `JWT_SECRET`.

Las migraciones SQL se ejecutan manualmente y en orden numérico sobre Turso; la API no las aplica al arrancar.

```bash
# Terminal 1: API
cd app-clubes-backend
pnpm install
pnpm run start:dev

# Terminal 2: cliente
cd app-clubes
pnpm install
pnpm start
```

Para Expo Go, teléfono y computadora deben compartir red. El cliente usa actualmente `192.168.101.48:3000`; cambiá las constantes `API_URL` del cliente si cambia la IP de la computadora.

## Flujos

- `ctx/auth.tsx` guarda tokens en SecureStore en móvil y localStorage en web.
- Los controladores extraen el usuario del JWT; los servicios verifican pertenencia y rol antes de modificar datos.
- “Mis clubes” genera el calendario con los horarios guardados; al unirse, el detalle compara horarios y permite confirmar pese al conflicto.
- Las fotos de usuario y club se optimizan en el cliente y se actualizan por endpoints autenticados.

## Comandos

Cliente (`app-clubes`): `pnpm start`, `pnpm android`, `pnpm ios`, `pnpm web`, `pnpm lint`.

API (`app-clubes-backend`): `pnpm run start:dev`, `pnpm run build`, `pnpm run test`, `pnpm run test:e2e`.
