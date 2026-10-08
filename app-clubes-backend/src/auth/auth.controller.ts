import { Controller, Post, Body, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
import { JwtAuthGuard } from './jwt_auth.guard';
import { ActualizarPerfilDto } from './actualizar-perfil.dto';

type AuthenticatedRequest = { user: { id: number } };

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  obtenerPerfil(@Req() request: AuthenticatedRequest) {
    return this.authService.obtenerPerfil(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  actualizarPerfil(
    @Req() request: AuthenticatedRequest,
    @Body() datos: ActualizarPerfilDto,
  ) {
    return this.authService.actualizarPerfil(request.user.id, datos);
  }
}
