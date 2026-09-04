// Controller: decorador de clase que marca "esta clase maneja rutas HTTP".
// Get/Post/Put/Delete: decoradores de método, cada uno conecta una función
//   con un verbo HTTP específico (GET, POST, PUT, DELETE).
// Param: decorador de parámetro, extrae un valor de la URL (ej: el ":id").
// Body: decorador de parámetro, extrae el JSON que viene en el cuerpo
//   de la petición (usado en POST y PUT, que mandan datos).
// Todos estos vienen de '@nestjs/common', la misma librería central de
// Nest que usamos en el service.
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

// Importamos la clase ClubesService desde su propio archivo (ruta relativa
// './clubes.service', el mismo folder). La necesitamos para poder pedirle
// a Nest que nos inyecte una instancia en el constructor de abajo.
import { ClubesService } from './clubes.service';

// @Controller('clubes'): todas las rutas definidas en esta clase se
// registran con el prefijo /clubes delante (ej: el método con @Get(':id')
// termina siendo, en la práctica, GET /clubes/:id).
@Controller('clubes')
export class ClubesController {
  // El constructor es un método especial de la clase que se ejecuta
  // automáticamente cuando Nest CREA una instancia de este controller.
  // Al declarar "private clubesService: ClubesService" como parámetro,
  // le decimos a Nest: "necesito una instancia de ClubesService acá".
  // Nest la busca entre los "providers" registrados en clubes.module.ts,
  // la crea (si no existía ya) y te la entrega automáticamente.
  // "private" además hace que TypeScript cree solo, sin que lo escribas
  // vos, la propiedad this.clubesService para usar en el resto de la clase.
  constructor(private clubesService: ClubesService) {}

  // ---------- GET /clubes ----------
  // @Get() sin nada adentro = responde al prefijo base del controller,
  // o sea exactamente GET /clubes (sin nada más después).
  @Get()
  obtenerTodos(): any {
    // Delegamos toda la lógica al service — el controller solo la pide
    // y la devuelve, no procesa datos él mismo.
    return this.clubesService.obtenerTodos();
  }

  // ---------- GET /clubes/:id ----------
  // El ":id" dentro de @Get(':id') es un "parámetro de ruta": indica que
  // esta función responde a cualquier valor en esa posición de la URL
  // (GET /clubes/1, GET /clubes/2, GET /clubes/loquesea).
  @Get(':id')
  // @Param('id') mira la URL real que llegó, encuentra el valor que
  // ocupó el lugar de ":id", y se lo pasa como argumento a esta función
  // bajo el nombre que le pusiste vos ("id").
  obtenerUno(@Param('id') id: string): any {
    // Todo lo que viene de la URL llega como texto (string), aunque
    // "parezca" un número. Number() es una función NATIVA de JavaScript
    // (no es un import) que convierte ese string a un number real, porque
    // en el array del service los ids están guardados como number.
    return this.clubesService.obtenerUno(Number(id));
  }

  // ---------- POST /clubes ----------
  @Post()
  // @Body() extrae el JSON completo que mandó quien hizo la petición en
  // el "cuerpo" del request (por ejemplo, algo como
  // {"nombre": "club3", "ciudad": "cordoba"} que mandarías desde Postman
  // o, más adelante, desde tu app de React Native).
  crear(@Body() datosNuevoClub: any): any {
    return this.clubesService.crear(datosNuevoClub);
  }

  // ---------- PUT /clubes/:id ----------
  // Combina @Param() (para saber CUÁL club) y @Body() (para saber QUÉ
  // datos nuevos aplicarle) en la misma función, cada uno como un
  // parámetro distinto.
  @Put(':id')
  actualizar(@Param('id') id: string, @Body() datosActualizados: any): any {
    return this.clubesService.actualizar(Number(id), datosActualizados);
  }

  // ---------- DELETE /clubes/:id ----------
  @Delete(':id')
  eliminar(@Param('id') id: string): any {
    return this.clubesService.eliminar(Number(id));
  }
}