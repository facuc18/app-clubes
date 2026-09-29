import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Este guard es el que vas a poner en cualquier ruta futura que
// requiera estar logueado, con @UseGuards(JwtAuthGuard).
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}