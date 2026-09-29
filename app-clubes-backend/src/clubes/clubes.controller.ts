import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClubesService } from './clubes.service';
import { CrearClubDto } from './crear-club.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guard';
import { ActualizarClubDto } from './actualizar-club.dto';

type AuthenticatedRequest = { user: { id: number } };

@Controller('clubes')
export class ClubesController {
  constructor(private clubesService: ClubesService) {}

  @Get()
  obtenerTodos() {
    return this.clubesService.obtenerTodos();
  }

  @UseGuards(JwtAuthGuard)
  @Get('mios/creados')
  obtenerCreados(@Req() request: AuthenticatedRequest) {
    return this.clubesService.obtenerCreadosPor(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mios/unidos')
  obtenerUnidos(@Req() request: AuthenticatedRequest) {
    return this.clubesService.obtenerUnidosPor(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/participacion')
  obtenerParticipacion(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.clubesService.obtenerParticipacion(Number(id), request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/unirse')
  unirse(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.clubesService.unirse(Number(id), request.user.id);
  }

  @Get(':id')
  obtenerUno(@Param('id') id: string) {
    return this.clubesService.obtenerUno(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  crear(
    @Body() datosNuevoClub: CrearClubDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.clubesService.crear(datosNuevoClub, request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  actualizar(
    @Param('id') id: string,
    @Body() datosActualizados: ActualizarClubDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.clubesService.actualizarPropio(
      Number(id),
      request.user.id,
      datosActualizados,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  eliminar(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.clubesService.eliminarPropio(Number(id), request.user.id);
  }
}
