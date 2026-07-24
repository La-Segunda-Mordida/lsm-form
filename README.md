# La Segunda Mordida — Formulario de registro

Formulario web de registro de miembros de **La Segunda Mordida (LSM)**. Recoge los datos del postulante en un flujo guiado de varios pasos y los guarda automáticamente en una hoja de Google Sheets a través de una cuenta de servicio.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **googleapis** (Google Sheets API v4) para la persistencia
- Despliegue en **Vercel**

## Estructura del proyecto

```
app/
  layout.tsx          Layout raíz, tipografías (Anton, Kanit) y metadatos
  page.tsx            Formulario multi-paso (client component)
  success/page.tsx    Pantalla de confirmación tras el envío
  api/submit/route.ts Route Handler (POST) que recibe el formulario
  globals.css         Tema y variables de color de marca (LSM)
lib/
  sheets.ts           Cliente de Google Sheets: appendToSheet()
public/
  logo.png            Logotipo de la marca
docs/
  DESPLIEGUE.md       Guía de configuración de Google Sheets y despliegue
```

## Cómo funciona

1. El usuario completa el formulario en 7 pasos (`app/page.tsx`):
   1. Datos personales
   2. Situación familiar
   3. Situación laboral (con preguntas condicionales según dependiente / independiente)
   4. Perfil profesional (opcional)
   5. Momento de vida
   6. Acuerdo de confidencialidad (NDA) — aceptación obligatoria
   7. Autorización de uso de imagen y voz — Acepto / No acepto
2. Al enviar, el cliente hace `POST /api/submit` con el formulario en JSON.
3. El Route Handler (`app/api/submit/route.ts`) genera un `id` (`LSM-<timestamp>`) y una marca de tiempo, arma la fila y llama a `appendToSheet()`.
4. `lib/sheets.ts` se autentica con una cuenta de servicio de Google y añade la fila a la hoja (`Sheet1!A:Z`).
5. En éxito el usuario es redirigido a `/success`.

Los campos se escriben en la hoja en este orden:

`id`, `fecha`, `nombres`, `apellidos`, `dni`, `email`, `telefono`, `pais`, `ciudad`, `cumpleanos`, `linkedin`, `grupo`, `estado_civil`, `situacion_familiar`, `situacion_laboral`, `tipo_trabajo`, `tipo_trabajo_otro`, `perfil_profesional`, `perfil_otro`, `momento_vida`, `acepta_nda`, `acepta_imagen`.

Los dos últimos campos registran la aceptación del **Acuerdo de Confidencialidad** (`acepta_nda`: `Sí`) y de la **Autorización de uso de imagen y voz** (`acepta_imagen`: `Acepto` / `No acepto`). Los textos legales se muestran al miembro en los pasos finales del formulario y viven en [`lib/legal.ts`](lib/legal.ts). La vigencia de la autorización de imagen (12 meses) se cuenta desde la `fecha` del registro.

## Variables de entorno

Copia `.env.local.example` a `.env.local` y completa los valores:

| Variable | Descripción |
|----------|-------------|
| `GOOGLE_SHEET_ID` | ID de la hoja de cálculo destino (parte de la URL de Google Sheets) |
| `GOOGLE_CLIENT_EMAIL` | Email de la cuenta de servicio de Google |
| `GOOGLE_PRIVATE_KEY` | Clave privada de la cuenta de servicio (con `\n` escapados) |

La hoja debe estar compartida con el email de la cuenta de servicio con permiso de edición. Ver [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md) para el paso a paso.

> Los archivos `.env*` están en `.gitignore` y nunca deben subirse al repositorio.

## Desarrollo local

```bash
npm install
cp .env.local.example .env.local   # y completa los valores
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Scripts

| Script | Acción |
|--------|--------|
| `npm run dev` | Servidor de desarrollo (Turbopack) |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build de producción |
| `npm run lint` | ESLint |

## Despliegue

El proyecto está desplegado en Vercel. Las tres variables de entorno anteriores deben configurarse en **Vercel → Project → Settings → Environment Variables**. Consulta [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md) para la configuración completa de Google Cloud y la conexión con Git.

## Licencia

Proyecto privado de La Segunda Mordida. Todos los derechos reservados.
