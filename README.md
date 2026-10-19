Sanidad Vegetal - API Backend
Sistema integral para la gestión, seguimiento fitosanitario, control epidemiológico de brotes y
análisis de patógenos en cultivos y plantas.

Tabla de Contenidos
- Descripción General
- Características y Módulos
- Tecnologías Utilizadas
- Requisitos Previos
- Configuración del Entorno
- Instalación y Ejecución
- Pruebas de la API (Colección Bruno)
- Estrategia de Git y Ramas

Descripción General
El módulo de Sanidad Vegetal provee servicios RESTful para monitorear la salud agrícola,
diagnosticar enfermedades fitosanitarias, registrar patrones de susceptibilidad en especies
botánicas y evaluar la propagación de patógenos. Además, incluye herramientas avanzadas
para la validación de secuencias genómicas de patógenos, identificación de mutaciones y
generación de estadísticas de brotes cruzados.

Características y Módulos
1.  Gestión de Plantas y Cultivos
- CRUD de Plantas: Registro, actualización y consulta de especies fitosanitarias.
- Ficha de Planta: Consulta consolidada con historial fitosanitario de la planta.
- CRUD de Cultivos: Administración de lotes y áreas de siembra.
- Restricciones de Eliminación: Protección de integridad referencial para evitar
eliminar plantas con cultivos o brotes activos.

2. Patógenos y Análisis Genético
- CRUD de Patógenos: Clasificación de hongos, bacterias, virus y plagas.
- Validador de Secuencias: Análisis de secuencias genéticas de patógenos.
- Verificación de Mutaciones: Detección de variaciones o mutaciones en patógenos
registrados.
- Restricciones de Eliminación: Control referencial entre patógenos y enfermedades
fitosanitarias asociadas.
3. Enfermedades y Susceptibilidades
- CRUD de Enfermedades: Registro de síntomas, cuadros clínicos e impacto.
- Consulta de Enfermedad Completa: Vista detallada que conecta patógenos
causantes, síntomas y plantas afectadas.
- CRUD de Susceptibilidades: Definición del nivel de vulnerabilidad de una especie
frente a patógenos específicos.
- Validaciones Fitosanitarias: Normalización de datos e inspección de combinaciones
de riesgo.
4. Tratamientos
- CRUD de Tratamientos: Catálogo de productos biológicos, químicos o prácticas
culturales para la mitigación y control fitosanitario.
5.  Brotes y Estadísticas Epidemiológicas
- CRUD de Brotes: Registro de focos de infección fitosanitaria.
- Consulta de Brotes Cruzados: Filtrado y cruce de información entre cultivos, fechas
y enfermedades.
- Módulo de Estadísticas: Métricas e indicadores del comportamiento de brotes e
incidencias en cultivos.

Tecnologías Utilizadas
- Framework: Node.js / NestJS (TypeScript)
- Documentación y Pruebas API: Bruno API Client (.bru)
- Control de Versiones: Git

Shell

Shell

Shell
Requisitos Previos
- Node.js: >= 18.x
- npm o pnpm / yarn
- Bruno API Client (Opcional, para ejecutar las pruebas .bru)

Configuración del Entorno
El proyecto requiere variables de entorno para su correcto funcionamiento.
1. Copia el archivo de ejemplo para crear tu configuración local:

cp .env.example .env
2. Abre el archivo .env y ajusta las variables según tu entorno local (puerto, conexión a
base de datos, credenciales, etc.).

Instalación y Ejecución
1. Clona el repositorio e instala dependencias

git clone <url-del-repositorio>
cd sanidad-vegetal
npm install

2. Ejecutar la aplicación
Modo Desarrollo:

npm run start:dev

Modo Producción:

Shell
npm run build
npm run start:prod

Pruebas de la API (Colección Bruno)
El proyecto incluye una colección de peticiones para Bruno configurada para probar todos los
endpoints de la API.
- Las peticiones se encuentran organizadas por módulos (Brotes, Patógenos, Plantas,
Tratamientos, etc.).
- Para usarlas, abre Bruno, selecciona Open Collection y apunta al directorio de la
colección dentro del proyecto.
Ejemplo de endpoint en la colección:
- Obtener Estadisticas de Brotes.bru (GET /brotes/estadisticas)

Estrategia de Git y Ramas
El repositorio utiliza una convención basada en Git Flow:
- main / master: Código estable en producción.
- develop: Rama principal de integración para desarrollo.
- feature/*: Desarrollo de nuevas funcionalidades (ej. feature/patogenos-crud, feature/validador-secuencias, feature/estadisticas-brotes).
- fix/*: Correcciones de errores (ej. fix/brotes-controlador, fix/susceptibilidades-validaciones).