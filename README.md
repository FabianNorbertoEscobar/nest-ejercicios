# API de cursos - práctica de NestJS

Este repositorio contiene una API REST desarrollada como práctica de un curso de NestJS. El código reúne ejercicios de organización modular, persistencia, autenticación, validación, autorización, documentación y otras capacidades habituales del framework.

> El repositorio no identifica el nombre ni incluye el enlace al curso. La lista de temas de abajo se basa en lo que efectivamente aparece implementado en el código; algunos módulos son ejercicios incompletos o conservan el código de ejemplo generado por Nest.

## Stack y tecnologías

- **Node.js y TypeScript** como plataforma y lenguaje.
- **NestJS 10** con adaptador HTTP de Express.
- **MongoDB y Mongoose** para conexión y esquemas de cursos y usuarios; `mongoose-delete` se registra como plugin global.
- **Passport, JWT y bcryptjs** para autenticación y hash de contraseñas.
- **class-validator y class-transformer** para validación y transformación de DTOs.
- **Swagger / OpenAPI** para explorar y describir la API.
- **Multer** para recibir archivos y guardarlos en disco.
- **Cache Manager** para configurar caché e interceptores de caché.
- **Event Emitter y Nodemailer**, con plantillas **Handlebars**, para practicar eventos y envío de correo.
- **Jest, ts-jest y Supertest** para pruebas unitarias y end-to-end.
- **ESLint y Prettier** para análisis y formato del código.

El `package.json` también declara `@nestjs/typeorm` y `mysql2`, pero no se observa una conexión o uso de TypeORM/MySQL en la aplicación actual.

## Qué se practica

- Estructura por módulos y separación entre controladores, servicios, DTOs y modelos.
- Inyección de dependencias y configuración centralizada con `@nestjs/config`.
- Endpoints REST y operaciones CRUD.
- Esquemas de Mongoose, conexión a MongoDB, consultas y paginación con `mongoose-paginate-v2`.
- Registro e inicio de sesión, contraseñas hasheadas, emisión y validación de tokens JWT.
- Guards, metadatos y un decorador propio (`@Rol`) para autorización por roles.
- Pipes personalizados para procesar slugs y pipes integrados para validar parámetros.
- Middleware de paginación, decoradores de parámetros e interceptores.
- Caché de respuestas e interceptor de logging.
- Carga de archivos mediante Multer y almacenamiento local.
- Eventos de dominio para reaccionar al registro e inicio de sesión; plantilla de bienvenida por correo.
- Versionado de rutas, CORS, límite del cuerpo JSON, servicio de archivos estáticos y documentación Swagger.
- Pruebas unitarias de controladores/servicios y pruebas end-to-end.

## Funcionalidades y estado actual

### Cursos

El módulo de cursos es la parte principal conectada a Mongoose. Expone operaciones para crear, listar con paginación, consultar, actualizar y eliminar cursos. El esquema incluye título, precio, autor, descripción y portada; las rutas usan JWT y un guard de roles. El listado recibe `page` y `limit` (por defecto `1` y `5`) y aplica un interceptor de caché.

Las rutas de detalle por título están presentes como ejercicio de un pipe de slug. La consulta del servicio, sin embargo, busca por el campo `id`, por lo que esa ruta no debe considerarse una búsqueda por título implementada de extremo a extremo.

### Autenticación

- `POST /v1/auth/register`: registra un usuario con email, nombre y contraseña; la contraseña se hashea antes de guardarse.
- `POST /v1/auth/login`: comprueba las credenciales y devuelve un JWT con vencimiento configurado a cuatro días.
- La estrategia Passport JWT extrae el token del encabezado `Authorization: Bearer ...` y carga los roles del usuario para las rutas protegidas.

El registro emite el evento `user.created` y el módulo de correo tiene un listener que intenta enviar una bienvenida con la plantilla `welcome.hbs`; el destinatario está configurado directamente en el código. Actualmente el registro emite la promesa de creación del usuario sin esperarla, por lo que este flujo de correo requiere ajustes para funcionar de forma fiable. El inicio de sesión también emite `user.logged`.

### Usuarios, videos y premios

Hay controladores CRUD y esquemas de datos para estos recursos. No obstante, los servicios de usuarios, videos y premios todavía devuelven textos de ejemplo de Nest en lugar de consultar MongoDB; sus endpoints son scaffolding y no CRUD persistente.

La ruta `POST /v1/videos/upload` configura Multer para guardar un archivo en `./tmp`. El controlador declara el campo de archivo como `avatar` y devuelve un mensaje de confirmación; todavía no integra el archivo con un video persistido.

## Estructura del proyecto

```text
src/
  auth/          Registro, login, JWT y hash de contraseñas
  courses/       Módulo de cursos, DTOs, esquema y pipe de slug
  users/         Controlador, servicio de ejemplo y esquema de usuario
  videos/        Controlador, carga de archivos y esquema de video
  awards/        Controlador, servicio de ejemplo y esquema de premios
  guards/        Guards JWT, roles y agente de navegador
  decorators/    Decorador de roles
  pagination/    Middleware de paginación
  paginate/      Decorador para leer la paginación de la petición
  mail/          Configuración SMTP y plantilla Handlebars
  event-mail/    Suscriptores de eventos de usuario
  utils/         Almacenamiento de medios e interceptor de logging
test/            Prueba end-to-end y configuración de Jest
```

## Requisitos

- Node.js y npm.
- Una instancia de MongoDB accesible mediante `DB_URI`.
- Credenciales SMTP si se quiere probar el envío de correo.

## Configuración y ejecución

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Crear un archivo `.env` en la raíz y completar la configuración necesaria:

   ```dotenv
   PORT=3000
   DB_URI=mongodb://localhost:27017/nest-cursos
   JWT_SECRET=un-secreto-local
   MAIL_HOST=
   MAIL_SECURE=false
   MAIL_USER=
   MAIL_PASSWORD=
   ```

   El ejemplo `.env.example` también incluye `MAIL_PORT`, `MAIL_SMTP` y `CURRENCY`; en el código actual no se leen. La configuración SMTP del módulo de correo utiliza el puerto `465` directamente.

3. Iniciar la aplicación:

   ```bash
   # Desarrollo
   npm run start:dev

   # Ejecución normal
   npm run start

   # Compilar y ejecutar en modo producción
   npm run build
   npm run start:prod
   ```

La aplicación usa el valor de `PORT` para escuchar. Las rutas están versionadas con el prefijo URI `/v1`; la interfaz Swagger se publica en `/docs`.

## Documentación interactiva

Con la aplicación en ejecución, abrir:

```text
http://localhost:3000/docs
```

Swagger incluye autenticación Bearer para probar las rutas que requieren JWT.

## Pruebas y calidad

```bash
# Pruebas unitarias
npm test

# Pruebas en modo watch
npm run test:watch

# Pruebas end-to-end
npm run test:e2e

# Cobertura
npm run test:cov

# Linter (aplica correcciones)
npm run lint

# Formato
npm run format
```
