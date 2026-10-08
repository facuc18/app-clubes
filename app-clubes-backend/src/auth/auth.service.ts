import {
  Injectable,
  Inject,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../db/schema';
import { usuarios } from '../db/schema';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
import { ActualizarPerfilDto } from './actualizar-perfil.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DB_DEV') private db: LibSQLDatabase<typeof schema>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Revisamos si ya existe un usuario con ese email
    const existente = await this.db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, dto.email))
      .all();

    if (existente.length > 0) {
      throw new ConflictException('Ya existe una cuenta con ese email');
    }

    // bcrypt.hash "encripta" la contraseña. El segundo argumento (10)
    // es el "costo" del hasheo — más alto es más seguro pero más lento.
    // 10 es un valor estándar razonable.
    const passwordHasheada = await bcrypt.hash(dto.password, 10);

    const resultado = await this.db
      .insert(usuarios)
      .values({
        nombre: dto.nombre,
        email: dto.email,
        password: passwordHasheada,
      })
      .returning()
      .all();

    const nuevoUsuario = resultado[0];

    // Generamos el token ya de una, para que el usuario quede
    // logueado automáticamente después de registrarse.
    const token = this.jwtService.sign({
      sub: nuevoUsuario.id,
      email: nuevoUsuario.email,
    });

    return {
      token,
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
      },
    };
  }

  async login(dto: LoginDto) {
    const resultado = await this.db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, dto.email))
      .all();

    const usuario = resultado[0];

    // Mensaje de error GENÉRICO a propósito: no le decimos al usuario
    // si falló porque el email no existe o porque la contraseña está
    // mal — decir cuál de las dos es un hueco de seguridad (le
    // confirmaría a un atacante qué emails están registrados).
    if (!usuario) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    // bcrypt.compare revisa si la contraseña en texto plano que llegó
    // coincide con el hash guardado, sin necesitar "desencriptar" nada
    // (bcrypt es de un solo sentido, no se puede revertir).
    const coincide = await bcrypt.compare(dto.password, usuario.password);

    if (!coincide) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    const token = this.jwtService.sign({
      sub: usuario.id,
      email: usuario.email,
    });

    return {
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    };
  }

  async obtenerPerfil(usuarioId: number) {
    const resultado = await this.db
      .select({
        id: usuarios.id,
        nombre: usuarios.nombre,
        email: usuarios.email,
        foto: usuarios.foto,
      })
      .from(usuarios)
      .where(eq(usuarios.id, usuarioId))
      .all();

    const usuario = resultado[0];
    if (!usuario) throw new UnauthorizedException('La sesión ya no es válida.');
    return usuario;
  }

  async actualizarPerfil(usuarioId: number, datos: ActualizarPerfilDto) {
    const resultado = await this.db
      .update(usuarios)
      .set({ foto: datos.foto ?? null })
      .where(eq(usuarios.id, usuarioId))
      .returning({
        id: usuarios.id,
        nombre: usuarios.nombre,
        email: usuarios.email,
        foto: usuarios.foto,
      })
      .all();

    if (!resultado[0]) throw new UnauthorizedException('La sesión ya no es válida.');
    return resultado[0];
  }
}
