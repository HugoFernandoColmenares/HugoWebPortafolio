# Recomendaciones de proyectos para el portafolio

Propuesta basada en los repositorios de [HugoFernandoColmenares](https://github.com/HugoFernandoColmenares) y [FeithNoir](https://github.com/FeithNoir), y en lo que ya está publicado en Supabase.

Objetivo: que el portafolio deje de leerse como “solo Angular + Supabase” y muestre backend, automatización, contenedores y Python, sin inflar con landings de práctica.

---

## 1. Qué hay hoy y qué falta

| Categoría | Publicado | Hueco |
|---|---|---|
| Web frontend | Blast Knights, Pastelería frontend, Seiryuko Dojo, NGO (planned) | Poco HTML/CSS “puro” fuerte; casi todo es Angular |
| Web fullstack | NEXO, StrikeSoft Hub | Suficiente; no agregar más del mismo patrón |
| Web backend | Pastelería .NET | Falta un segundo backend (Java o Python) |
| Desktop | ReImage / Image Organizer | Cubierto |
| Mobile | Freelance Client Portal (in progress) | No priorizar otro móvil hasta cerrar este |
| Python | — | Vacío |
| Docker | — | Vacío |
| n8n / automatización | — | Vacío |
| CLI / datos / IA local | — | Vacío |

No publiques más judo (Seiryuko, JudoManual, DojoSync) ni otra pastelería (API Java o Angular) salvo que quieras mostrar **el mismo dominio en otro stack**. En ese caso, una sola pieza extra basta.

---

## 2. Prioridad alta (publicar primero)

Estos cierran los huecos que pediste y ya existen en GitHub. Portada vacía al crear; súbela al editar.

### Backend

| Proyecto | Repo | Por qué |
|---|---|---|
| **Pastelería API (Java)** | [pasteleriapi](https://github.com/HugoFernandoColmenares/pasteleriapi) | Mismo dominio que el backend .NET, otro stack (Spring Boot + JDBC + SQLite). Muestra que no dependes de un solo ecosistema. |
| **School API** | [SchoolAPI](https://github.com/HugoFernandoColmenares/SchoolAPI) | Backend C# adicional, más “negocio” que una demo. Úsalo si SchoolAPI tiene README, auth y CRUD claros. |
| **Feith Blog API** | [FeithBlogApi](https://github.com/FeithNoir/FeithBlogApi) | ASP.NET Core MVC + EF + SQLite. Complementa NEXO: el visitante ve frontend Angular y, aparte, un backend clásico del mismo tipo de producto. |

Categoría sugerida: `web-backend`. Featured: sí para Java o FeithBlogApi (elige **uno** featured de backend extra, no los tres).

### Frontend (sin ser otro CRUD Angular)

| Proyecto | Repo | Por qué |
|---|---|---|
| **StockGrid** | [StockGrid](https://github.com/HugoFernandoColmenares/StockGrid) | HTML denso, teclado primero, look industrial. Contrasta con el frontend “marketing”. |
| **DevChronicles** | [DevChronicles](https://github.com/HugoFernandoColmenares/DevChronicles) | Angular 22 + Markdown local. Editorial, no e-commerce. |
| **Paint SPA / Win95** | [paintSPA](https://github.com/HugoFernandoColmenares/paintSPA) o [win95spa](https://github.com/HugoFernandoColmenares/win95spa) | Frontend de oficio: canvas, CSS, UX retro. Muy memorable en un scroll de portafolio. |
| **doomjs** | [doomjs](https://github.com/FeithNoir/doomjs) | Raycasting vanilla. Distinto de Blast Knights (Angular + arcade). |

Categoría: `web-frontend`. Featured: StockGrid **o** Paint/Win95 (uno solo).

### Docker + Python

| Proyecto | Repo | Por qué |
|---|---|---|
| **OCR Docker App** | [OCRDockerApp](https://github.com/HugoFernandoColmenares/OCRDockerApp) | Python, Flask, Tailwind, OCR, **Docker**. Encaja exacto con “un par de proyectos con Docker y Python”. |
| **procesar_imagenes_app** | [procesar_imagenes_app](https://github.com/HugoFernandoColmenares/procesar_imagenes_app) | Front de consulta del OCR. Solo si no diluye OCRDockerApp; mejor un único post “OCR de inventario (API + UI)” con ambos repos en la descripción. |

Categoría: `web-fullstack` o `other` si lo cuentas como herramienta DevOps/datos. Featured: sí.

### n8n

| Proyecto | Repo | Por qué |
|---|---|---|
| **n8n + Ollama** | [n8n-ollama](https://github.com/FeithNoir/n8n-ollama) | El único repo explícito de n8n. Docker Compose, persistencia, LLM local. Cuéntalo como automatización + infra, no como “otra web”. |

Categoría: `other`. Featured: sí (es el único n8n y diferencia el perfil).

En el post: diagrama del flujo (webhook → n8n → Ollama → respuesta), `docker-compose` y qué problema resuelve (agentes locales sin SaaS).

### Python (además del OCR)

| Proyecto | Repo | Por qué |
|---|---|---|
| **TUI LLM Agent** | [tui-llm-agent](https://github.com/HugoFernandoColmenares/tui-llm-agent) | Python + LM Studio + ejecución de código. Perfil “IA local”, no otro blog. |
| **DecoAtelier** | [DecoAtelier](https://github.com/FeithNoir/DecoAtelier) | Python + SQLite, indexa carpetas reales sin copiar la librería. Herramienta de artista/datos. |
| **SimpleMetaG** | [SimpleMetaG](https://github.com/FeithNoir/SimpleMetaG) | Python + NCBI. Útil si quieres una pieza “científica”; si no, déjalo fuera para no mezclar el relato. |

Categoría: `other` (o desktop si la TUI se siente como app de consola). Featured: TUI **o** DecoAtelier.

### Docker (segundo proyecto)

| Proyecto | Repo | Por qué |
|---|---|---|
| **n8n-ollama** | arriba | Ya cubre Docker + n8n. |
| **OCRDockerApp** | arriba | Ya cubre Docker + Python. |
| **Dataset Media Manager** | [DatasetMediaManager](https://github.com/FeithNoir/DatasetMediaManager) + [Razor](https://github.com/FeithNoir/DatasetMediaManagerRazor) | .NET CLI + DDD + datasets grandes. Si le añades compose (o lo documentas), es el segundo Docker “serio” junto al OCR. |

No hace falta inventar un tercer contenedor. Dos bien contados (OCR y n8n) bastan.

---

## 3. Prioridad media (si quieres más volumen)

Publica solo si hay demo o README claro y no se parecen a algo ya featured.

| Proyecto | Stack | Nota |
|---|---|---|
| [CoreLearn](https://github.com/HugoFernandoColmenares/CoreLearn) | Angular + desktop + API | Monorepo. Buen fullstack, pero NEXO y StrikeSoft ya ocupan ese cupo. |
| [SkillNexus](https://github.com/HugoFernandoColmenares/SkillNexus) | Angular 22 | LMS. Redundante si CoreLearn entra. |
| [TokenForge](https://github.com/HugoFernandoColmenares/TokenForge) / [BracketMaster](https://github.com/HugoFernandoColmenares/BracketMaster) / [AuraTech](https://github.com/HugoFernandoColmenares/AuraTech) | TypeScript | Revisar README; si son sólidos, uno de herramientas. |
| [pagos-test](https://github.com/HugoFernandoColmenares/pagos-test) | TypeScript | Listado, filtros, permisos, export. Front “producto”. |
| [DuelistsForge](https://github.com/FeithNoir/DuelistsForge) / [CharacterCardGenerator](https://github.com/FeithNoir/CharacterCardGenerator) | JS / HTML | Front creativo; elige uno. |
| [TomodachiMusumeNG](https://github.com/FeithNoir/TomodachiMusumeNG) | Angular | Juego/pet. Complementa Blast Knights si quieres más “playable”. |
| [accion_popular_corcoes](https://github.com/HugoFernandoColmenares/accion_popular_corcoes) | HTML | Landing cívica real. Mejor que otra landing de curso (spa, viajes, muebles). |
| [pop-task-manager](https://github.com/HugoFernandoColmenares/pop-task-manager) | C# | Desktop extra solo si no pisa ReImage. |

---

## 4. Mejor no publicar (o fusionar)

- Landings de aprendizaje: `carolina-spa`, `viajaApp`, `deliveryApp`, `cafeteria`, `tiendamuebles`, `real-state`, `e-wallet`, `audifonosshop`.
- Duplicados de judo / dojo: `JudoManual*`, `DojoSync`, `JudoBlackBeltStudy`.
- Segunda pastelería frontend si PasteleryApp ya está.
- Repos de evidencia SENA (`programa-git`, `GitAlpineTest`).
- Juegos/chistes sueltos (`PalosidadApp`, `adivina-quien`) salvo que quieras una sección “experiments”.
- Contenido muy de nicho/NSFW (Monsterpedia, lore de WhatsApp): diluye un portafolio profesional de software.

---

## 5. Mix sugerido para la próxima tanda (8 posts)

Orden de carga recomendado:

1. **OCRDockerApp** — Python + Docker + Flask  
2. **n8n-ollama** — n8n + Docker + Ollama  
3. **pasteleriapi (Java)** — backend distinto al .NET  
4. **tui-llm-agent** — Python + IA local  
5. **StockGrid** — frontend HTML denso  
6. **paintSPA o win95spa** — frontend memorable  
7. **DatasetMediaManager** (CLI; mención Razor si aplica) — Docker/.NET/datos  
8. **DevChronicles o doomjs** — frontend editorial o motor canvas  

Con eso el portafolio queda: 2 backend (.NET + Java), 2 Python, 2 Docker, 1 n8n, 2–3 frontends no-CRUD, y los fullstack Angular que ya tienes.

---

## 6. Cómo contarlos (copy corto)

Evita “proyecto personal en Angular”. Enfócate en el problema:

- OCR: “Extrae códigos de inventario desde fotos, empaquetado en Docker.”  
- n8n: “Automatización local: n8n + Ollama en Compose, sin mandar datos a la nube.”  
- Java API: “El mismo dominio de pastelería, implementado en Spring para comparar stacks.”  
- TUI: “Agente en terminal que habla con un LLM local y ejecuta Python.”  
- StockGrid: “Libro de almacén de una sola pantalla, pensado para teclado.”  

Tecnologías reales del README, no una lista inflada. `featured`: máximo 1 por “historia” (OCR, n8n, un backend extra, un frontend extra).

---

## 7. Si falta un repo que no existe

No hace falta inventar producto. Si quieres un segundo flujo n8n más “negocio”:

- Webhook de contacto del portafolio → n8n → Telegram/email + fila en Supabase.  
- Publicarlo como **un** workflow (capturas del canvas n8n + `docker-compose`), no como otra web.

Eso puede vivir en el mismo repo `n8n-ollama` o en un gist/carpeta `docs/n8n`.

---

## 8. Criterio para el siguiente lote

Antes de crear el post en admin, el repo debería tener:

1. README con problema, stack y cómo correrlo.  
2. Captura o GIF (tú subes la portada al editar).  
3. Un hueco de categoría/tecnología que aún no esté cubierto.  
4. Distinto de algo ya featured (no un tercer blog Angular).

Cuando elijas cuáles de la sección 5, se pueden cargar en Supabase con el mismo criterio: texto + GitHub, imagen al editar.
