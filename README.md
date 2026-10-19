# API Sanidad Vegetal

API REST para el seguimiento fitosanitario de cultivos: registra plantas, patógenos, enfermedades, tratamientos, cultivos, susceptibilidades y brotes, verifica mutaciones genéticas de semillas y genera estadísticas de brotes.

Proyecto del Grupo 4.

## Integrantes

| Nombre | Responsabilidades |
|---|---|
| Samuel Agudelo Chica | Configuración base, Patógenos, Enfermedades, Tratamientos, restricciones de eliminación de patógenos y enfermedades, detalle de enfermedad |
| Valentina Salazar Cabra | Validaciones comunes, Plantas, Cultivos, verificación de mutaciones, restricciones de eliminación de plantas, ficha de planta |
| Salomé Toro | Colección Bruno, Susceptibilidades, Brotes, estadísticas, detalle de brotes, README y datos de ejemplo |

## Tecnologías

- NestJS 12 (TypeScript)
- TypeORM con MySQL
- Swagger (`@nestjs/swagger`) para la documentación
- Bruno para las peticiones de prueba
- pnpm como gestor de paquetes

## Requisitos

- Node.js 20 o superior
- pnpm
- MySQL 8
- Bruno (opcional)

## Instalación y ejecución

1. Clonar e instalar dependencias (**solo con pnpm**):

   ```bash
   git clone https://github.com/valentina-970/sanidad-vegetal.git
   cd sanidad-vegetal
   pnpm install
   ```

2. Crear la base de datos en MySQL:

   ```sql
   CREATE DATABASE sanidad_vegetal;
   ```

3. Copiar `.env.example` a `.env` y completar las variables:

   | Variable | Ejemplo |
   |---|---|
   | `PORT` | `3000` |
   | `DB_HOST` | `localhost` |
   | `DB_PORT` | `3306` |
   | `DB_USERNAME` | `root` |
   | `DB_PASSWORD` | `tu_contraseña` |
   | `DB_NAME` | `sanidad_vegetal` |

4. Arrancar en modo desarrollo. La primera vez, TypeORM crea las tablas:

   ```bash
   pnpm run start:dev
   ```

5. (Opcional) Cargar los datos de ejemplo: detener la API, ejecutar `database/seed.sql` en MySQL y volver a arrancar.

   ```bash
   mysql -u root -p < database/seed.sql
   ```

La documentación interactiva queda en **http://localhost:3000/docs**.

Modo producción:

```bash
pnpm run build
pnpm run start:prod
```

## Recursos

Los siete recursos exponen las mismas operaciones:

| Operación | Ruta (ejemplo) | Éxito |
|---|---|---|
| Crear | `POST /plantas` | 201 con el registro |
| Listar y filtrar | `GET /plantas?tipoCultivo=frutal` | 200 con la lista |
| Consultar uno | `GET /plantas/:id` | 200 con el registro |
| Modificar (parcial) | `PATCH /plantas/:id` | 200 con el registro actualizado |
| Eliminar | `DELETE /plantas/:id` | 200 con mensaje de confirmación |

Rutas base: `/plantas`, `/patogenos`, `/enfermedades`, `/tratamientos`, `/cultivos`, `/susceptibilidades`, `/brotes`.

## Endpoints especiales

| Ruta | Devuelve |
|---|---|
| `GET /cultivos/:id/mutaciones` | Compara el código genético de la semilla con la secuencia de su planta: longitud, total de mutaciones y posiciones (desde 1) con la letra de referencia y la de la semilla |
| `GET /plantas/:id/ficha` | La planta, sus cultivos y las enfermedades que la afectan con su nivel de susceptibilidad |
| `GET /enfermedades/:id/detalle` | La enfermedad, su patógeno y todos sus tratamientos |
| `GET /brotes/detalle` | Brotes con el nombre de la planta, la enfermedad y el patógeno; filtros `region`, `desde`, `hasta` |
| `GET /estadisticas/brotes/por-enfermedad` | Brotes y hectáreas por enfermedad |
| `GET /estadisticas/brotes/por-patogeno` | Brotes y hectáreas por patógeno |
| `GET /estadisticas/brotes/por-region` | Brotes y hectáreas por región |
| `GET /estadisticas/brotes/por-tipo-cultivo` | Brotes y hectáreas por tipo de cultivo |
| `GET /estadisticas/brotes/por-mes` | Brotes y hectáreas por año y mes |

Las estadísticas aceptan `desde` y `hasta` (`YYYY-MM-DD`) y se ordenan de mayor a menor número de hectáreas, salvo `por-mes`, que va en orden cronológico.

## Reglas de negocio

- **Validaciones manuales** en `src/common/validaciones.ts`; no se usa class-validator. Un 400 lista todos los campos que fallaron.
- **Sin relaciones de TypeORM**: las referencias son columnas con el id y las consultas compuestas se unen en el servicio.
- Nombre científico único en plantas y patógenos.
- Una planta y una enfermedad solo pueden tener una susceptibilidad (`baja`, `media`, `alta`).
- Las secuencias genéticas solo admiten A, C, G y T en mayúscula.
- Las fechas van en formato `YYYY-MM-DD`, deben ser reales y no futuras (se compara con la fecha de Colombia).
- No se puede eliminar una planta con cultivos, susceptibilidades o brotes; un patógeno con enfermedades; ni una enfermedad con tratamientos, susceptibilidades o brotes.

## Códigos de respuesta

| Código | Cuándo |
|---|---|
| 400 | Campo faltante, vacío o de tipo incorrecto, valor no permitido, secuencia inválida, fecha futura, id inválido, body vacío en PATCH |
| 404 | No existe el registro de la ruta o uno referenciado en el body |
| 409 | Nombre científico repetido, susceptibilidad repetida o eliminación con registros dependientes |
| 422 | Verificación de mutaciones con secuencias de distinta longitud |

## Colección Bruno

La carpeta `bruno/` tiene las peticiones organizadas por recurso (`01 Plantas` a `10 Estadisticas`). En Bruno: **Open Collection** → seleccionar la carpeta `bruno/`.

## Flujo de trabajo con Git

Usamos Gitflow:

- `main`: versiones entregadas, con tag (`v1.0.0`).
- `develop`: integración.
- `feature/*`: una funcionalidad por rama, que sale de `develop` y vuelve por PR.
- `fix/*`: correcciones sobre `develop`.
- `release/*`: preparación de una entrega hacia `main`.
- `hotfix/*`: correcciones urgentes sobre `main`, que se integran también a `develop`.

Los PR se integran con **merge commit** (no squash) y las ramas no se borran.
