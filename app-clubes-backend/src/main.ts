// NestFactory: la función que crea la aplicación Nest completa, uniendo
// todos los módulos, controllers y providers de tu proyecto.
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
// ValidationPipe: la pieza que efectivamente REVISA cada petición
// entrante contra las reglas definidas en tus DTOs (los decoradores
// de class-validator que pusiste en crear-club.dto.ts).
import { ValidationPipe } from '@nestjs/common';
// AppModule: el módulo raíz de toda tu aplicación (el que agrupa a
// todos los demás módulos, incluido ClubesModule).
import { AppModule } from './app.module';

// bootstrap() es la función que arranca todo el servidor. Es "async"
// porque crear la app y ponerla a escuchar son operaciones asíncronas.
async function bootstrap() {
  // Crea la instancia completa de la aplicación Nest, a partir del
  // módulo raíz.
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  app.useBodyParser('json', { limit: '1mb' });
  app.useBodyParser('urlencoded', { extended: true, limit: '1mb' });

  // Habilita CORS: sin esto, el navegador/apps bloquean las peticiones
  // que vienen de un "origen" distinto (tu app corriendo en el celular
  // o en el navegador pidiéndole datos a tu backend).
  app.enableCors();

  // useGlobalPipes() aplica el pipe que le pasás a TODAS las rutas
  // de TODA la app, sin tener que repetirlo en cada controller.
  app.useGlobalPipes(new ValidationPipe());

  // Pone al servidor a escuchar peticiones en el puerto 3000.
  await app.listen(3000);
}
bootstrap();