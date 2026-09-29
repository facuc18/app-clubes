import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  // Esto se ejecuta automáticamente cuando alguien manda un token válido
  // a una ruta protegida. Lo que devolvemos acá queda disponible como
  // "el usuario actual" en esa ruta.
  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}