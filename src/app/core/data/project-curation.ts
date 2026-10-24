import { Language } from '../services/translation.service';

/**
 * Public curation layer for `portfolio_projects` rows (keyed by row id).
 *
 * Supabase keeps the source data editable from the admin panel; this file adds
 * what the public site needs on top of it without touching the database:
 * honest "featured" flags, verified links (a `null` hides a broken or
 * misleading button), optimized local covers, Spanish copy, case studies and
 * content warnings. Rows that are not listed here are shown as they come.
 *
 * Every link below was checked with curl/gh on 2026-10-24. Do not add repo
 * URLs that were not verified to exist and match the project.
 */

type Localized = Record<Language, string>;
type LocalizedList = Record<Language, string[]>;

export interface CaseStudy {
  context: Localized;
  built: LocalizedList;
  decisions: LocalizedList;
  status: Localized;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface GalleryImage {
  /** Base path without width suffix, e.g. `/img/projects/gallery-arena`. */
  src: string;
  alt: Localized;
}

export interface ProjectCuration {
  slug: string;
  /** Optimized local cover base path (`-480|-800|-1200.webp`). `null` = generated cover. */
  cover: string | null;
  featured: boolean;
  /** Lower first. Featured order on home/projects. */
  rank?: number;
  /** Hidden from public listings (kept in the database). */
  hidden?: boolean;
  title?: string;
  /** `undefined` keeps the DB value, `null` hides the button. */
  githubUrl?: string | null;
  liveUrl?: string | null;
  /** Live link points to adult (18+) art content. */
  contentWarning?: boolean;
  summary: Localized;
  /** Override for generic DB copy (en) and Spanish translation (es). */
  description?: Partial<Localized>;
  caseStudy?: CaseStudy;
  related?: ProjectLink[];
  gallery?: GalleryImage[];
}

const GH = 'https://github.com/HugoFernandoColmenares';

export const PROJECT_CURATION: Record<string, ProjectCuration> = {
  // ---------------------------------------------------------------- featured
  'a1000001-0000-4000-8000-000000000007': {
    slug: 'strikesoft-hub',
    cover: '/img/projects/strikesoft-hub',
    featured: true,
    rank: 1,
    githubUrl: `${GH}/StrikeSoftHub`,
    summary: {
      en: 'Web home for a real softcombat group in Bucaramanga: where and when to train, workshop armory, cart and reservations.',
      es: 'Sitio de un grupo real de softcombat en Bucaramanga: dónde y cuándo entrenar, armería del taller, carrito y reservas.',
    },
    description: {
      es: 'Sitio web de Armagedón Softcombat, un grupo que se reúne cada domingo a las 10:00 en el Parque La Flora, Bucaramanga. Interfaz en español con cuenta regresiva al domingo, catálogo del taller, crónicas tomadas de Instagram, filtros de armería, carrito y un flujo de reserva protegido con autenticación. Usa Supabase cuando está configurado; LocalStorage mantiene el mismo catálogo y la sesión sin conexión.',
    },
    caseStudy: {
      context: {
        en: 'Armagedón Softcombat meets every Sunday at 10:00 in Parque La Flora, Bucaramanga. Newcomers needed one place that answers where and when to show up, and the group’s workshop needed a catalog for its training weapons.',
        es: 'Armagedón Softcombat se reúne cada domingo a las 10:00 en el Parque La Flora, Bucaramanga. Quienes llegan por primera vez necesitaban un lugar que respondiera dónde y cuándo ir, y el taller del grupo necesitaba un catálogo para sus armas de entrenamiento.',
      },
      built: {
        en: [
          'Home hero with the club shield and a live countdown to Sunday in Colombia time.',
          'Armory with combat-role and weapon-class filters, card/list toggle, measured specs and prices in COP.',
          'Arena page with the standing Sunday fixture plus dates transcribed from the group’s public Instagram.',
          'Cart as a side drawer and an auth-guarded reservation flow.',
          'PWA manifest and a production service worker.',
        ],
        es: [
          'Portada con el escudo del club y una cuenta regresiva al domingo en hora de Colombia.',
          'Armería con filtros por rol de combate y clase de arma, vista de tarjetas o lista, medidas y precios en COP.',
          'Página de arena con el encuentro fijo del domingo y fechas transcritas del Instagram público del grupo.',
          'Carrito en panel lateral y flujo de reserva protegido con autenticación.',
          'Manifiesto PWA y service worker en producción.',
        ],
      },
      decisions: {
        en: [
          'Supabase as the primary backend with an automatic LocalStorage fallback, so catalog, cart and session keep working when the backend is offline or unconfigured.',
          'Visitor copy lives in TypeScript modules instead of templates, so the Spanish text can change without touching components.',
          'Design tokens named by role (main, canvas, panel, trim) so the palette can change later; hover never moves elements.',
          'Honest content: prices and stock are labeled as indicative, and pieces without a photo show their class instead of a stand-in image.',
        ],
        es: [
          'Supabase como backend principal con respaldo automático en LocalStorage: catálogo, carrito y sesión siguen funcionando si el backend no está disponible.',
          'Los textos viven en módulos TypeScript y no en las plantillas, así el español se puede cambiar sin tocar componentes.',
          'Tokens de diseño nombrados por rol (main, canvas, panel, trim) para poder cambiar la paleta después; el hover nunca mueve elementos.',
          'Contenido honesto: precios y stock están marcados como indicativos, y las piezas sin foto muestran su clase en lugar de una imagen de relleno.',
        ],
      },
      status: {
        en: 'Live on Vercel. Visitor interface in Spanish.',
        es: 'Publicado en Vercel. Interfaz para visitantes en español.',
      },
    },
    gallery: [
      { src: '/img/projects/gallery-armory', alt: { en: 'Armory with role and class filters', es: 'Armería con filtros de rol y clase' } },
      { src: '/img/projects/gallery-arena', alt: { en: 'Arena page with the Sunday fixture and announced dates', es: 'Página de arena con el encuentro del domingo y fechas anunciadas' } },
    ],
  },
  'a1000001-0000-4000-8000-000000000012': {
    slug: 'inventory-ocr',
    cover: '/img/projects/inventory-ocr',
    featured: true,
    rank: 2,
    summary: {
      en: 'Reads inventory codes from photos — barcode/QR first, OCR only as a fallback — with human review and CSV/JSON export.',
      es: 'Lee códigos de inventario desde fotos —primero código de barras/QR, OCR solo como respaldo— con revisión humana y exportación CSV/JSON.',
    },
    description: {
      es: 'Aplicación web que lee códigos de inventario desde fotografías: primero decodifica códigos de barras y QR, y usa Tesseract solo como respaldo para etiquetas de texto. El operador revisa, corrige o descarta filas antes de confirmar el lote y luego exporta CSV o JSON. Python, Flask, OpenCV, Docker, Nginx/Gunicorn y SQLite para el historial de lotes.',
    },
    caseStudy: {
      context: {
        en: 'Typing inventory codes from photos by hand is slow and error-prone. The goal was a small tool where one operator uploads photos, checks what was read and exports a clean, confirmed batch.',
        es: 'Transcribir a mano códigos de inventario desde fotos es lento y propenso a errores. La meta era una herramienta pequeña donde un operador sube fotos, revisa lo leído y exporta un lote limpio y confirmado.',
      },
      built: {
        en: [
          'Multi-image upload where each file ends up accepted, unread or rejected.',
          'Barcode and QR decoding as the main reader; Tesseract only proposes labeled codes (SKU, serial, code).',
          'Review step: the operator corrects or discards each row before saving.',
          'Batch history in SQLite that survives reloads, with CSV and JSON export of confirmed rows.',
          'A health endpoint that fails when Tesseract or the decoder are missing.',
        ],
        es: [
          'Carga múltiple de imágenes: cada archivo queda como aceptado, sin lectura o rechazado.',
          'Decodificación de código de barras y QR como lector principal; Tesseract solo propone códigos con etiqueta (SKU, serie, código).',
          'Paso de revisión: el operador corrige o descarta cada fila antes de guardarla.',
          'Historial de lotes en SQLite que sobrevive a recargas, con exportación CSV y JSON de las filas confirmadas.',
          'Un endpoint de salud que falla si Tesseract o el decodificador no están disponibles.',
        ],
      },
      decisions: {
        en: [
          'A real decoder before OCR: text recognition is a fallback, not the main path.',
          'Nothing is saved without human review.',
          'In production the app refuses to start with the development secret or without an operator key.',
          'Docker Compose with Gunicorn behind Nginx, plus a smoke test for the full flow.',
        ],
        es: [
          'Un decodificador real antes que el OCR: el reconocimiento de texto es respaldo, no el camino principal.',
          'Nada se guarda sin revisión humana.',
          'En producción la app no arranca con el secreto de desarrollo ni sin clave de operador.',
          'Docker Compose con Gunicorn detrás de Nginx, más una prueba de humo del flujo completo.',
        ],
      },
      status: {
        en: 'Runs locally with docker compose up --build. Source on GitHub.',
        es: 'Corre localmente con docker compose up --build. Código en GitHub.',
      },
    },
    gallery: [
      { src: '/img/projects/gallery-ocr-frontend-graph', alt: { en: 'Front-end call graph generated with code2flow', es: 'Grafo de llamadas del front end generado con code2flow' } },
    ],
  },
  'a1000001-0000-4000-8000-000000000002': {
    slug: 'pastelery-app',
    cover: '/img/projects/pastelery-app',
    featured: true,
    rank: 3,
    title: 'PasteleryApp',
    summary: {
      en: 'Bakery storefront and back office on Angular 22 + Supabase: catalog, cart and checkout, plus inventory, ingredients and recipes.',
      es: 'Tienda y back office de pastelería en Angular 22 + Supabase: catálogo, carrito y pago, más inventario, ingredientes y recetas.',
    },
    description: {
      en: 'Bakery storefront and back office built with Angular 22 and Supabase: public catalog, news, cart and checkout, plus authenticated inventory, ingredients, recipes, storage locations and profile modules. Layered architecture, standalone components, signals, lazy routes and auth guards; Supabase Auth, PostgreSQL with Row Level Security and Storage; deployed on Vercel.',
      es: 'Tienda y back office de pastelería hechos con Angular 22 y Supabase: catálogo público, noticias, carrito y pago, más módulos autenticados de inventario, ingredientes, recetas, ubicaciones de almacenamiento y perfil. Arquitectura por capas, componentes standalone, signals, rutas lazy y guards; Supabase Auth, PostgreSQL con Row Level Security y Storage; desplegado en Vercel.',
    },
    caseStudy: {
      context: {
        en: 'A bakery needs two faces: a storefront for customers and a back office to manage what goes into each product. PasteleryApp covers both in one Angular app.',
        es: 'Una pastelería necesita dos caras: una tienda para clientes y un back office para gestionar lo que lleva cada producto. PasteleryApp cubre ambas en una sola app Angular.',
      },
      built: {
        en: [
          'Public catalog, news with article pages, recipe catalog with cart and checkout.',
          'Authenticated inventory, ingredients, recipes, storage locations and profile modules.',
          'Auth flows: login, registration, forgot and reset password.',
        ],
        es: [
          'Catálogo público, noticias con página de artículo y catálogo de recetas con carrito y pago.',
          'Módulos autenticados de inventario, ingredientes, recetas, ubicaciones de almacenamiento y perfil.',
          'Flujos de autenticación: inicio de sesión, registro, recuperación y cambio de contraseña.',
        ],
      },
      decisions: {
        en: [
          'Strict layers: core (services, models, guards), auth, public pages, authenticated features and shared UI.',
          'Supabase Auth and PostgreSQL with Row Level Security; local image fallback when Storage is unreachable.',
          'Modern Angular only: standalone components, signals, inject() and lazy routes.',
          'A warm design system with Fraunces and Inter on CSS tokens, mobile-first.',
        ],
        es: [
          'Capas estrictas: core (servicios, modelos, guards), auth, páginas públicas, features autenticadas y UI compartida.',
          'Supabase Auth y PostgreSQL con Row Level Security; imágenes locales de respaldo si Storage no responde.',
          'Solo Angular moderno: componentes standalone, signals, inject() y rutas lazy.',
          'Un sistema de diseño cálido con Fraunces e Inter sobre tokens CSS, mobile-first.',
        ],
      },
      status: {
        en: 'Live on Vercel with a public demo.',
        es: 'Publicado en Vercel con demo pública.',
      },
    },
    related: [{ label: 'pasteleriaapi (.NET 8 API)', url: `${GH}/pasteleriaapi` }],
  },
  'a1000001-0000-4000-8000-000000000018': {
    slug: 'devchronicle',
    cover: '/img/projects/devchronicle-app',
    featured: true,
    rank: 4,
    title: 'DevChronicle',
    summary: {
      en: 'Markdown journal in three repos: Angular client, Rust/Axum API on SQLite, and a Compose stack behind nginx.',
      es: 'Diario en Markdown en tres repos: cliente Angular, API en Rust/Axum sobre SQLite y un stack Compose detrás de nginx.',
    },
    description: {
      es: 'Cliente Angular 22 para un diario en Markdown. La portada muestra una entrada destacada y un catálogo filtrable por etiquetas. /post/:slug mantiene una medida de 70 caracteres, carga Highlight.js de forma diferida y permite copiar bloques de código. El Markdown se compila en el navegador con marked, se sanea con DOMPurify y se renderiza con vistas diferidas. Si la API no responde, las mismas rutas leen public/content.',
    },
    caseStudy: {
      context: {
        en: 'A personal technical journal used as a full-stack exercise: a static-friendly Angular client, a small typed API and a one-command local deployment.',
        es: 'Un diario técnico personal usado como ejercicio full-stack: un cliente Angular que tolera ser estático, una API pequeña y tipada y un despliegue local de un solo comando.',
      },
      built: {
        en: [
          'Landing page with a featured entry and a tag-filterable catalog.',
          'Article view with a 70-character measure, lazy-loaded Highlight.js and copy buttons on code fences.',
          'Rust Axum API on SQLite: public reads, Bearer-token writes, hidden drafts and validated slugs.',
          'Compose stack: nginx serves the Angular build and proxies /api/ on the same origin.',
        ],
        es: [
          'Portada con una entrada destacada y un catálogo filtrable por etiquetas.',
          'Vista de artículo con medida de 70 caracteres, Highlight.js diferido y botón para copiar bloques de código.',
          'API en Rust con Axum sobre SQLite: lecturas públicas, escrituras con token Bearer, borradores ocultos y slugs validados.',
          'Stack con Compose: nginx sirve el build de Angular y redirige /api/ en el mismo origen.',
        ],
      },
      decisions: {
        en: [
          'Markdown compiled in the browser with marked and sanitized with DOMPurify.',
          'When the API is down, the same routes read static files from public/content.',
          'sqlx migrations embedded in the binary; a seed binary loads content once with ON CONFLICT DO NOTHING.',
          'SQLite in a named volume: compose down keeps the journal, down -v deletes it.',
        ],
        es: [
          'Markdown compilado en el navegador con marked y saneado con DOMPurify.',
          'Si la API no responde, las mismas rutas leen archivos estáticos de public/content.',
          'Migraciones sqlx embebidas en el binario; un binario de seed carga el contenido una vez con ON CONFLICT DO NOTHING.',
          'SQLite en un volumen con nombre: compose down conserva el diario y down -v lo borra.',
        ],
      },
      status: {
        en: 'Runs locally with Docker Compose. No public demo yet.',
        es: 'Corre localmente con Docker Compose. Todavía sin demo pública.',
      },
    },
    related: [
      { label: 'DevChronicleApi (Rust)', url: `${GH}/DevChronicleApi` },
      { label: 'DevChronicle (Compose)', url: `${GH}/DevChronicle` },
    ],
    gallery: [
      { src: '/img/projects/gallery-article-desktop', alt: { en: 'Article page served by the composed stack', es: 'Página de artículo servida por el stack de Compose' } },
      { src: '/img/projects/gallery-landing-mobile', alt: { en: 'Landing page on a narrow viewport', es: 'Portada en una pantalla angosta' } },
    ],
  },

  // ------------------------------------------------------------- the rest
  'a1000001-0000-4000-8000-000000000008': {
    slug: 'nexo',
    cover: '/img/projects/nexo',
    featured: false,
    githubUrl: null, // no public repository found; was pointing to the profile
    contentWarning: true,
    summary: {
      en: 'Blog-first platform for my illustration and writing: Markdown blog, gallery, shop and admin on Supabase + Stripe links.',
      es: 'Plataforma tipo blog para mi ilustración y escritura: blog en Markdown, galería, tienda y admin sobre Supabase + enlaces de Stripe.',
    },
    description: {
      es: 'Plataforma centrada en el blog que une ingeniería de software, ilustración digital y escritura técnica larga sobre una estética cyberpunk. Rutas públicas: actividad, blog en Markdown, galería de obras, tienda, acerca de y RSS. Un panel de administración gestiona posts, galería y productos contra un esquema de Supabase, con Stripe Payment Links para donaciones y compras.',
    },
  },
  'a1000001-0000-4000-8000-000000000006': {
    slug: 'blast-knights',
    cover: '/img/projects/blast-knights',
    featured: false,
    githubUrl: null, // no public repository found; was pointing to the profile
    summary: {
      en: 'Browser arcade game in Angular 22 and Canvas 2D: 25 stages, typed bombs, local high scores and a touch joystick.',
      es: 'Juego arcade en el navegador con Angular 22 y Canvas 2D: 25 niveles, bombas por tipo, récords locales y joystick táctil.',
    },
    description: {
      es: 'Port arcade del lado del cliente en Angular 22. Cinco biomas, veinticinco niveles, dificultad Normal/Difícil, bombas por tipo, una armería temática recorrible, récords locales y joystick para pulgar en teléfonos y tabletas. La simulación y el render corren en el navegador (Canvas 2D, 60 Hz fijos) sin backend de juego.',
    },
  },
  'a1000001-0000-4000-8000-000000000010': {
    slug: 'seiryuko-dojo',
    cover: '/img/projects/seiryuko-dojo',
    featured: false,
    // The public SeiryukoDojo repo is the earlier HTML/JS site, not this Angular
    // edition, so the button stays hidden instead of pointing to the wrong code.
    githubUrl: null,
    summary: {
      en: 'Angular 22 study guide for a judo dojo: belts, techniques, history and exam topics.',
      es: 'Guía de estudio en Angular 22 para un dojo de judo: cinturones, técnicas, historia y temas de examen.',
    },
    description: {
      es: 'Edición en Angular 22 de la guía de estudio del Seiryuko Dojo. Carpetas por feature, signals, tarjetas y tablas compartidas y tokens CSS. El mismo contenido público de la guía: cinturones, técnicas, historia, recursos y temas de examen, sin publicar horarios ni datos de contacto.',
    },
  },
  'a1000001-0000-4000-8000-000000000011': {
    slug: 'pastry-api',
    cover: '/img/projects/pastry-api',
    featured: false,
    summary: {
      en: 'Spring Boot 4 API for a pastry shop: stock, recipes and batches that consume inventory or return 409 with shortages.',
      es: 'API en Spring Boot 4 para una pastelería: stock, recetas y lotes que consumen inventario o devuelven 409 con faltantes.',
    },
    description: {
      es: 'API REST para una pastelería: registra stock de ingredientes, compone recetas y produce lotes que consumen inventario o devuelven 409 con la lista de faltantes. Java 25 y Spring Boot 4 con SQLite, OpenAPI/Swagger, Docker, datos de demo, pruebas automatizadas y una pequeña UI de banco para listar stock y producir.',
    },
  },
  'a1000001-0000-4000-8000-000000000001': {
    slug: 'pasteleria-api',
    cover: null, // was an Unsplash stock photo
    featured: false,
    title: 'PasteleriaApp API (.NET)',
    summary: {
      en: 'ASP.NET Core (.NET 8) REST API with Clean Architecture, Identity + JWT roles and OpenAPI docs.',
      es: 'API REST en ASP.NET Core (.NET 8) con Clean Architecture, Identity + JWT con roles y documentación OpenAPI.',
    },
    description: {
      en: 'REST API for a bakery with Clean Architecture (Data, Business, Shared and API layers), Repository Pattern, DTOs with AutoMapper, dependency injection, ASP.NET Core Identity with JWT and roles, standardized ApiResponse<T> responses and OpenAPI documentation. Docker Compose setup included.',
      es: 'API REST para una pastelería con Clean Architecture (capas Data, Business, Shared y API), patrón Repository, DTOs con AutoMapper, inyección de dependencias, ASP.NET Core Identity con JWT y roles, respuestas estandarizadas ApiResponse<T> y documentación OpenAPI. Incluye configuración con Docker Compose.',
    },
  },
  'a1000001-0000-4000-8000-000000000014': {
    slug: 'echoarts',
    cover: '/img/projects/echoarts',
    featured: false,
    githubUrl: null, // github.com/FeithNoir/EchoArtsApp returns 404 (private or removed)
    summary: {
      en: 'Browser toolkit for roleplayers and streamers: character cards, overlays, banners and comic panels with PNG export.',
      es: 'Kit en el navegador para roleros y streamers: fichas de personaje, overlays, banners y viñetas con exportación PNG.',
    },
    description: {
      es: 'Suite en Angular 22 para roleros y streamers: fichas de personaje, overlays, páginas de texto para redes, banners, globos y viñetas de cómic, promos de novela visual, calendario y progreso de arte, retos de escritura e ilustración, pósters, escalas de poder, estadísticas de batalla y mezcla de imágenes. Rutas lazy standalone, signals, interfaz bilingüe, PrimeIcons, render en Canvas y exportación PNG. Sin backend por ahora; todo queda en el navegador.',
    },
  },
  'a1000001-0000-4000-8000-000000000021': {
    slug: 'epoca-studio',
    cover: '/img/projects/epoca-studio',
    featured: false,
    githubUrl: null, // github.com/FeithNoir/epoca-studio returns 404 (private or removed)
    summary: {
      en: 'Offline Art Deco writing studio on Angular + Electron with a local SQLite vault and Markdown/HTML/PDF export.',
      es: 'Estudio de escritura Art Deco sin conexión en Angular + Electron, con bóveda local en SQLite y exportación a Markdown/HTML/PDF.',
    },
    description: {
      es: 'Estudio de escritura Art Deco sin conexión con Angular 22 y Electron. Los manuscritos viven en una bóveda SQLite local en escritorio, o en localStorage en el navegador durante el desarrollo. Biblioteca, editor, lector y vista dividida con autoguardado, modo enfoque, papelera con deshacer y exportación a Markdown, HTML o PDF. Importa .md y .txt. Sin cuentas: la app abre en la biblioteca.',
    },
  },
  'a1000001-0000-4000-8000-000000000026': {
    slug: 'pylens',
    cover: '/img/projects/pylens',
    featured: false,
    summary: {
      en: 'Desktop image library in Python/PySide6: index, tag, find duplicates and batch-optimize files offline.',
      es: 'Biblioteca de imágenes de escritorio en Python/PySide6: indexa, etiqueta, encuentra duplicados y optimiza archivos sin conexión.',
    },
    description: {
      es: 'Biblioteca de imágenes de escritorio (repo TagFlow). Indexa una carpeta en SQLite con dimensiones, peso, formato, nitidez y hashes. Permite etiquetar, filtrar, encontrar duplicados por MD5/SHA-256 o pHash y luego renombrar, mover, agrupar, comprimir u optimizar los archivos seleccionados. Hecha con Python, PySide6, Pillow y OpenCV. Se distribuye como un ejecutable único para Windows con PyInstaller.',
    },
  },
  'a1000001-0000-4000-8000-000000000013': {
    slug: 'reimage',
    cover: '/img/projects/reimage',
    featured: false,
    summary: {
      en: 'Terminal UI that batch-renames images with a preview, collision checks and one-step undo.',
      es: 'Interfaz de terminal que renombra imágenes por lotes con vista previa, control de colisiones y deshacer.',
    },
    description: {
      es: 'Interfaz de terminal que renombra las imágenes de una carpeta con un prefijo común y una secuencia numérica estable. Eliges carpeta, prefijo, orden y extensiones, revisas nombres actuales → nuevos y aplicas. Las colisiones desactivan Aplicar. Un log JSON deshace la última ejecución en esa carpeta. Incluye renombrado en dos pasos, build de consola con PyInstaller e instalador por usuario para Windows con entrada opcional en el menú contextual.',
    },
  },
  'a1000001-0000-4000-8000-000000000022': {
    slug: 'swarmart',
    cover: '/img/projects/swarmart',
    featured: false,
    summary: {
      en: 'First slice of a peer-to-peer art gallery: local-first Angular shelf that is honest about what is not built yet.',
      es: 'Primera parte de una galería de arte P2P: estante local-first en Angular que es honesto sobre lo que aún no existe.',
    },
    description: {
      es: 'Estante de arte local-first como primera parte de una galería peer-to-peer. Feed, visor, estudio, grupos y monitor de nodos en Angular 22 con signals y OnPush. Las piezas quedan en el localStorage del navegador. La interfaz reporta el daemon de pares como desconectado y no inventa pares remotos. Faltan el wrapper de escritorio, libp2p, SQLite y las firmas Ed25519.',
    },
  },
  'a1000001-0000-4000-8000-000000000015': {
    slug: 'purrapp-api',
    cover: '/img/projects/purrapp-api',
    featured: false,
    title: 'PurrApp API',
    summary: {
      en: 'Local text-to-speech service in FastAPI with hexagonal architecture: the TTS engine is just an adapter.',
      es: 'Servicio local de texto a voz en FastAPI con arquitectura hexagonal: el motor TTS es solo un adaptador.',
    },
    description: {
      es: 'Servicio local de texto a voz en FastAPI. Un caso de uso sintetiza hasta 500 caracteres mediante un puerto KittenTTS, escribe un WAV de 24 kHz y guarda los metadatos en SQLite. Voces: Bella, Jasper, Luna, Bruno, Rosie, Hugo, Kiki y Leo. La API REST está separada del modelo: POST /api/v1/speech/generate y GET /api/v1/speech/{audio_id}. Capas hexagonales de dominio, aplicación, infraestructura y presentación.',
    },
  },
  'a1000001-0000-4000-8000-000000000016': {
    slug: 'purrapp-frontend',
    cover: '/img/projects/purrapp-frontend',
    featured: false,
    summary: {
      en: 'Angular 22 studio for the PurrApp text-to-speech API: generate, play and download voices.',
      es: 'Estudio en Angular 22 para la API de texto a voz de PurrApp: generar, reproducir y descargar voces.',
    },
    description: {
      es: 'Estudio en Angular 22 para texto a voz local. Una pantalla envía hasta 500 caracteres y una voz a la API de PurrPy, muestra el estado de generación y reproduce el WAV con texto, voz, expresión, duración y descarga. Rutas lazy standalone, signals, HttpClient y un token API_BASE_URL vacío en producción para que las llamadas pasen por /api en el mismo origen.',
    },
  },
  'a1000001-0000-4000-8000-000000000017': {
    slug: 'purrapp-docker',
    cover: '/img/projects/purrapp-docker',
    featured: false,
    summary: {
      en: 'Compose stack for PurrApp: nginx-served client, API proxy and named volumes for audio and model weights.',
      es: 'Stack de Compose para PurrApp: cliente servido por nginx, proxy a la API y volúmenes para audio y pesos del modelo.',
    },
    description: {
      es: 'Orquestador con Compose para el estudio PurrApp. Compila el cliente Angular en nginx en el puerto 8080, redirige /api/ al backend PurrPy en el 8000 y guarda SQLite, archivos WAV y pesos de KittenTTS en volúmenes con nombre. docker compose up --build es el camino para correrlo; los volúmenes sobreviven a compose down salvo con -v.',
    },
  },
  'a1000001-0000-4000-8000-000000000019': {
    slug: 'devchronicle-api',
    cover: '/img/projects/devchronicle-api',
    featured: false,
    summary: {
      en: 'Rust/Axum API for DevChronicle: SQLite, Bearer-token writes and migrations embedded in the binary.',
      es: 'API en Rust/Axum para DevChronicle: SQLite, escrituras con token Bearer y migraciones embebidas en el binario.',
    },
    description: {
      es: 'API en Rust con Axum para el diario. SQLite guarda entradas publicadas y borradores. El GET público devuelve metadatos JSON y el Markdown original. Las escrituras requieren un token Bearer de autor. Los slugs se validan, las filas no publicadas quedan ocultas y las migraciones sqlx van dentro del binario. Un binario de seed carga un directorio de contenido una vez con ON CONFLICT DO NOTHING.',
    },
  },
  'a1000001-0000-4000-8000-000000000020': {
    slug: 'devchronicle-docker',
    cover: '/img/projects/devchronicle-docker',
    featured: false,
    summary: {
      en: 'Compose stack for DevChronicle: Angular on nginx, Rust API health check and a same-origin /api proxy.',
      es: 'Stack de Compose para DevChronicle: Angular en nginx, health check de la API en Rust y proxy /api en el mismo origen.',
    },
    description: {
      es: 'Orquestador con Compose para DevChronicle. Compila el cliente Angular en nginx en el puerto 8080, espera el health check de la API en Rust y redirige /api/ en el mismo origen. SQLite vive en el volumen chronicle-data. Un perfil opcional de seed monta frontend/public/content. docker compose down conserva el diario; down -v lo borra.',
    },
  },
  'a1000001-0000-4000-8000-000000000025': {
    slug: 'verbanode-app',
    cover: '/img/projects/verbanode-app',
    featured: false,
    githubUrl: `${GH}/verbaNodeApp`,
    summary: {
      en: 'Angular client that drafts commits, PRs and prompts through a local n8n + LLM workflow — no paid APIs.',
      es: 'Cliente Angular que redacta commits, PRs y prompts con un flujo local de n8n + LLM, sin APIs pagas.',
    },
    description: {
      es: 'Cliente Angular 22 para VerbaNode. Pantallas de Commit, Pull request, Prompt, Git e Historial. Los formularios envían al webhook local de n8n a través de un proxy de desarrollo; la app nunca llama al puerto del modelo. Prompt y Git son solo plantillas. Git escribe listas de comandos y no las ejecuta. La interfaz de historial está lista; falta la tabla de persistencia.',
    },
  },
  'a1000001-0000-4000-8000-000000000024': {
    slug: 'verbanode-n8n',
    cover: '/img/projects/verbanode-n8n',
    featured: false,
    githubUrl: `${GH}/VerbaNode`,
    summary: {
      en: 'n8n workflow that routes VerbaNode drafts to a local LM Studio model or to plain templates.',
      es: 'Flujo de n8n que envía los borradores de VerbaNode a un modelo local en LM Studio o a plantillas.',
    },
    description: {
      es: 'Paquete de flujos de n8n para los borradores de VerbaNode. Un webhook POST /webhook/verba/draft se ramifica por tarea (commit, pr, prompt, git). Commit y PR llaman a LM Studio liquid/lfm2.5-1.2b en el host; prompt y git llenan plantillas sin el modelo. Incluye el flujo importable verba-draft.json y el contrato JSON compartido con el cliente Angular.',
    },
  },
  'a1000001-0000-4000-8000-000000000023': {
    slug: 'verbanode-docker',
    cover: '/img/projects/verbanode-docker',
    featured: false,
    githubUrl: `${GH}/VerbaNode`,
    summary: {
      en: 'Compose setup that runs n8n locally and reaches the host LLM, with named volumes for data and history.',
      es: 'Configuración de Compose que corre n8n localmente y alcanza el LLM del host, con volúmenes para datos e historial.',
    },
    description: {
      es: 'Orquestador con Compose para VerbaNode. Corre solo el servicio n8n en 127.0.0.1:5678 con volúmenes para los datos de n8n y el historial de borradores. LM Studio y la app Angular quedan en el host. El contrato de entorno cubre la clave de cifrado, la URL del webhook y LMSTUDIO_* para que el contenedor alcance el modelo en host.docker.internal:1234.',
    },
  },

  // ------------------------------------------------------ hidden from public
  // Generic copy + Unsplash stock photo; the linked ReImage repo is a C# CLI
  // renamer, not the WPF/DDD app described. Kept in the DB, hidden here.
  'a1000001-0000-4000-8000-000000000003': { slug: 'desktop-image-organizer', cover: null, featured: false, hidden: true, summary: { en: '', es: '' } },
  // "Planned", stock photo, and linked to an unrelated repo (guitarraLA).
  'a1000001-0000-4000-8000-000000000005': { slug: 'ngo-landing', cover: null, featured: false, hidden: true, summary: { en: '', es: '' } },
  // "In progress" with no links and a stock photo.
  'a1000001-0000-4000-8000-000000000004': { slug: 'client-portal', cover: null, featured: false, hidden: true, summary: { en: '', es: '' } },
};
