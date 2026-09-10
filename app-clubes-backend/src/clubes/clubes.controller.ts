import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ClubesService } from './clubes.service';
import { CrearClubDto } from './crear-club.dto';

@Controller('clubes')
export class ClubesController {
  constructor(private clubesService: ClubesService) {}

  @Get()
  obtenerTodos() {
    return this.clubesService.obtenerTodos();
  }

  @Get(':id')
  obtenerUno(@Param('id') id: string) {
    return this.clubesService.obtenerUno(Number(id));
  }

  @Post()
  crear(@Body() datosNuevoClub: CrearClubDto) {
    return this.clubesService.crear(datosNuevoClub);
  }

  @Put(':id')
  actualizar(@Param('id') id: string, @Body() datosActualizados: any) {
    return this.clubesService.actualizar(Number(id), datosActualizados);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.clubesService.eliminar(Number(id));
  }
}