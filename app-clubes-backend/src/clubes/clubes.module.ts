// Module: decorador de clase que agrupa piezas relacionadas (controllers
// y providers) bajo un mismo "módulo", y viene también de '@nestjs/common'.
import { Module } from '@nestjs/common';

// Importamos nuestras propias clases desde sus archivos, para poder
// referenciarlas dentro del objeto de configuración de @Module.
import { ClubesController } from './clubes.controller';
import { ClubesService } from './clubes.service';

@Module({
  // controllers: lista de clases que Nest debe registrar como manejadoras
  // de rutas HTTP dentro de este módulo.
  controllers: [ClubesController],
  // providers: lista de clases "inyectables" (con @Injectable()) que
  // Nest debe tener disponibles para prestarle a quien las pida en
  // su constructor (en este caso, ClubesController la pide).
  providers: [ClubesService],
})
export class ClubesModule {}