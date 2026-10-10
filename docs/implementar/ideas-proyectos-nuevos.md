# Ideas de proyectos nuevos (aún no existen)

Complemento de `docs/recomendaciones-portafolio.md`. Aquí no se listan repos actuales: son piezas **por construir** para cubrir huecos y hacer el portafolio más variado.

Cada idea cabe en 1–3 semanas si se recorta el alcance. Prioriza demo pública + README + una captura.

---

## 1. Backend

### API de inventario con FastAPI
Python, FastAPI, PostgreSQL, JWT, Docker Compose.  
Entradas/salidas de almacén, SKU, stock mínimo, export CSV.  
**Por qué:** el backend publicado es .NET; un FastAPI con tests y OpenAPI equilibra el perfil.  
**Demo:** Swagger + 3 colecciones de requests.

### Webhooks y outbox
.NET 8 o Node, cola (Redis o Postgres `SKIP LOCKED`), reintentos, firma HMAC.  
**Por qué:** muestra backend “de producción” (idempotencia, no solo CRUD).  
**Demo:** un endpoint que recibe un evento y un log de entregas.

### Mini-banco de identidad
Go o .NET: login, refresh tokens, roles, rate limit.  
**Por qué:** auth propia, distinta de “Supabase lo resuelve”.  
**Cuidado:** no reinventar OAuth completo; quédate en password + refresh + un cliente Angular mínimo.

---

## 2. Frontend

### Design system playground
Angular 22, tokens CSS, Storybook o una ruta `/kit`.  
Botones, forms, tabla, toasts — el mismo lenguaje visual de este portafolio.  
**Por qué:** frontend de sistema, no otra landing.

### Tablero kanban offline-first
Vue o Svelte (para no sumar otro Angular), IndexedDB, drag and drop.  
**Por qué:** un framework distinto y estado local serio.

### Visualizador de logs
HTML/CSS/JS o Angular: pega un `.log`, filtra por nivel, resalta stack traces.  
**Por qué:** herramienta útil, frontend denso, fácil de enseñar en entrevista.

---

## 3. Flujos n8n

### Contacto del portafolio → n8n
Formulario About → webhook n8n → correo + fila Supabase + Telegram.  
**Por qué:** automatización real sobre un producto que ya tienes.  
**Entregable:** captura del canvas, `docker-compose`, y el JSON del workflow (sin secrets).

### Pipeline de contenido
RSS o carpeta → n8n → resumen con Ollama → borrador en Notion/Markdown.  
**Por qué:** alarga `n8n-ollama` hacia un caso de uso, no solo “Compose que levanta dos contenedores”.

### Alertas de healthcheck
Cron n8n → ping a 2–3 URLs (portafolio, NEXO, API) → Discord si fallan.  
**Por qué:** ops pequeño, fácil de explicar, muy creíble en un CV.

---

## 4. Docker y plataformas

### Stack local “un comando”
`compose.yml`: API (.NET o FastAPI) + Postgres + Adminer + front estático.  
Healthchecks, volúmenes, perfil `dev` vs `prod`.  
**Por qué:** Docker de verdad, no solo “hay un Dockerfile”.

### OCR como worker
Extiende la idea de OCRDockerApp: API que encola, worker Python que procesa, Redis.  
**Por qué:** contenedores con roles distintos (api / worker / db).  
**No hace falta** rehacer el OCR si ya publicas OCRDockerApp; este sería la versión “colas”.

### Preview de PRs
GitHub Actions + build + deploy a un subdominio o Cloudflare Pages.  
**Por qué:** DevOps visible sin montar un Kubernetes de juguete.

---

## 5. Python y datos

### CLI de fotos
Typer + Exif + rename por fecha (la idea de ReImage, en Python).  
Tests con `pytest`, paquete instalable.  
**Por qué:** Python de utilidad, no notebook suelto.

### ETL chico
CSV sucio → pandas o polars → Postgres → una vista SQL.  
Docker para Postgres.  
**Por qué:** datos + SQL, distinto de “hice una API”.

### Agente con herramientas
Python, un LLM local, herramientas: `http`, `fs`, `sql`.  
Límites claros (carpeta sandbox).  
**Por qué:** si `tui-llm-agent` ya entra, este sería “herramientas”, no otro chat.

---

## 6. Otras tecnologías (una o dos, no diez)

| Idea | Stack | Encaje |
|---|---|---|
| Bot de Discord para un dojo o gremio | TypeScript + Discord.js | Comunidad, sin otra web |
| Extensión de VS Code | TypeScript | Snippets o lint de tokens CSS |
| Lambda / Azure Function | C# o JS | Un endpoint cron, no un monolito serverless |
| App Rust CLI | Rust | Solo si te interesa el lenguaje; si no, sáltalo |

---

## 7. Lote mínimo recomendado (construir 4)

Si solo puedes hacer unos cuantos, este set cubre lo que el portafolio actual no muestra:

1. **Contacto → n8n → Telegram/email** (automatización sobre este sitio)  
2. **API FastAPI de inventario + Compose** (Python + Docker + backend)  
3. **Design system / kit UI** (frontend de oficio)  
4. **Healthcheck n8n o CLI de fotos** (ops o Python utilitario)

Nada de esto debería ser otro blog Angular ni otro e-commerce.

---

## 8. Cómo publicarlos cuando existan

Mismo criterio que los posts actuales:

- Categoría honesta (`web-backend`, `web-frontend`, `other` para n8n/CLI).  
- Un featured por “historia”.  
- Portada al editar en el admin (URL HTTPS de Storage).  
- README con problema, cómo correrlo, y captura.

Cuando un repo esté listo, se puede sembrar en Supabase como NEXO o Seiryuko.
