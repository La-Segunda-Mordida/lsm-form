# Guía de configuración y despliegue

Esta guía cubre (1) la configuración de Google Cloud para escribir en la hoja de cálculo, (2) las variables de entorno y (3) el despliegue en Vercel.

## 1. Google Cloud y Sheets

El formulario escribe en una hoja de Google Sheets usando una **cuenta de servicio** (server-to-server, sin intervención del usuario).

1. Entra a [Google Cloud Console](https://console.cloud.google.com/) y crea (o elige) un proyecto.
2. En **APIs y servicios → Biblioteca**, habilita la **Google Sheets API**.
3. En **APIs y servicios → Credenciales**, crea una **Cuenta de servicio**.
4. Dentro de la cuenta de servicio, pestaña **Claves → Agregar clave → Crear clave nueva → JSON**. Se descargará un archivo JSON.
5. Del JSON necesitas dos campos:
   - `client_email` → `GOOGLE_CLIENT_EMAIL`
   - `private_key` → `GOOGLE_PRIVATE_KEY`
6. Crea la hoja de cálculo destino y **compártela** con el `client_email` de la cuenta de servicio, con permiso de **Editor**.
7. El `GOOGLE_SHEET_ID` es la parte de la URL de la hoja:
   `https://docs.google.com/spreadsheets/d/`**`<ESTE_ES_EL_ID>`**`/edit`
8. La primera pestaña debe llamarse `Sheet1` (el código escribe en `Sheet1!A:Z`). Si tu hoja usa otro nombre, ajústalo en `lib/sheets.ts`.

> Recomendado: crea una fila de encabezados en `Sheet1` con las 20 columnas en el orden documentado en el README, para que los datos sean legibles.

## 2. Variables de entorno

| Variable | Origen |
|----------|--------|
| `GOOGLE_SHEET_ID` | URL de la hoja |
| `GOOGLE_CLIENT_EMAIL` | Campo `client_email` del JSON |
| `GOOGLE_PRIVATE_KEY` | Campo `private_key` del JSON |

Para **local**, ponlas en `.env.local`. La clave privada debe ir entre comillas y con los saltos de línea escapados como `\n` (el código los convierte de vuelta en `lib/sheets.ts`):

```
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## 3. Despliegue en Vercel

### Variables de entorno en Vercel

En **Project → Settings → Environment Variables** agrega las tres variables para los entornos **Production**, **Preview** y **Development**.

Al pegar `GOOGLE_PRIVATE_KEY` en Vercel puedes pegar la clave con saltos de línea reales o con `\n` escapados; el código soporta ambos gracias al `.replace(/\\n/g, "\n")`.

### Conectar el repositorio de Git (despliegue continuo)

Para que cada `push` despliegue automáticamente:

1. En Vercel: **Project → Settings → Git**.
2. **Connect Git Repository** y elige el repositorio de GitHub.
3. Requisitos: la app de **Vercel para GitHub** debe estar instalada en la organización/cuenta dueña del repositorio (Vercel lo solicita durante la conexión).
4. A partir de ahí, los `push` a la rama de producción (`main`) crean despliegues de producción, y las ramas o PRs generan despliegues de *preview*.

### Despliegue manual (CLI)

Alternativamente, sin conexión con Git:

```bash
npm i -g vercel
vercel        # despliegue de preview
vercel --prod # despliegue de producción
```

## Notas

- El proyecto usa Turbopack. En local puede aparecer un aviso de "multiple lockfiles" si existe otro `package-lock.json` en un directorio superior; es inofensivo y no afecta al build en Vercel.
- No subas archivos `.env*` ni la carpeta `.vercel/` al repositorio (ya están en `.gitignore`).
