import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { and, eq, inArray } from 'drizzle-orm';
import { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../db/schema';
import { clubMiembros, clubes, usuarios } from '../db/schema';
import { CrearClubDto } from './crear-club.dto';
import { ActualizarClubDto } from './actualizar-club.dto';

@Injectable()
export class ClubesService {
  constructor(@Inject('DB_DEV') private db: LibSQLDatabase<typeof schema>) {}

  obtenerTodos() {
    return this.db.select().from(clubes).all();
  }

  obtenerCreadosPor(usuarioId: number) {
    return this.db
      .select()
      .from(clubes)
      .where(eq(clubes.creadorId, usuarioId))
      .all();
  }

  async obtenerUnidosPor(usuarioId: number) {
    const membresias = await this.db
      .select({ clubId: clubMiembros.clubId })
      .from(clubMiembros)
      .where(eq(clubMiembros.usuarioId, usuarioId))
      .all();

    if (membresias.length === 0) return [];

    return this.db
      .select()
      .from(clubes)
      .where(
        inArray(
          clubes.id,
          membresias.map(({ clubId }) => clubId),
        ),
      )
      .all();
  }

  async obtenerUno(id: number) {
    const resultado = await this.db
      .select()
      .from(clubes)
      .where(eq(clubes.id, id))
      .all();

    if (resultado.length === 0) {
      throw new NotFoundException(`Club con id ${id} no encontrado`);
    }
    return resultado[0];
  }

  async crear(datosNuevoClub: CrearClubDto, usuarioId: number) {
    const nuevoClub = {
      nombre: datosNuevoClub.nombre,
      descripcion: datosNuevoClub.descripcion ?? null,
      cupoMaximo: datosNuevoClub.cupoMaximo ?? null,
      creadorId: usuarioId,
      categorias: datosNuevoClub.categorias.join(','),
      formato: datosNuevoClub.formato,
      ubicacion: datosNuevoClub.ubicacion ?? null,
      ciudad: datosNuevoClub.ciudad ?? null,
      horario: datosNuevoClub.horario.join(','),
    };

    const resultado = await this.db
      .insert(clubes)
      .values(nuevoClub)
      .returning()
      .all();

    return resultado[0];
  }

  async obtenerParticipacion(id: number, usuarioId: number) {
    const club = await this.obtenerUno(id);
    const membresias = await this.db
      .select()
      .from(clubMiembros)
      .where(
        and(eq(clubMiembros.clubId, id), eq(clubMiembros.usuarioId, usuarioId)),
      )
      .all();

    return {
      unido: membresias.length > 0,
      esCreador: club.creadorId === usuarioId,
    };
  }

  async obtenerCantidadMiembros(id: number) {
    const club = await this.obtenerUno(id);
    const miembros = await this.db
      .select({ id: clubMiembros.id })
      .from(clubMiembros)
      .where(eq(clubMiembros.clubId, id))
      .all();

    return {
      cantidad: miembros.length + (club.creadorId === null ? 0 : 1),
    };
  }

  async obtenerMiembros(id: number, usuarioId: number) {
    const club = await this.obtenerUno(id);
    if (club.creadorId !== usuarioId) {
      throw new ForbiddenException('Solo el creador puede administrar los miembros.');
    }

    return this.db
      .select({ id: usuarios.id, nombre: usuarios.nombre })
      .from(clubMiembros)
      .innerJoin(usuarios, eq(clubMiembros.usuarioId, usuarios.id))
      .where(eq(clubMiembros.clubId, id))
      .all();
  }

  async expulsarMiembro(id: number, creadorId: number, miembroId: number) {
    const club = await this.obtenerUno(id);
    if (club.creadorId !== creadorId) {
      throw new ForbiddenException('Solo el creador puede expulsar miembros.');
    }

    const membresia = await this.db
      .select({ id: clubMiembros.id })
      .from(clubMiembros)
      .where(
        and(
          eq(clubMiembros.clubId, id),
          eq(clubMiembros.usuarioId, miembroId),
        ),
      )
      .all();

    if (membresia.length === 0) {
      throw new NotFoundException('Ese usuario no es miembro del club.');
    }

    await this.db
      .delete(clubMiembros)
      .where(eq(clubMiembros.id, membresia[0].id))
      .run();

    return { eliminado: true };
  }

  async unirse(id: number, usuarioId: number) {
    const club = await this.obtenerUno(id);

    if (club.creadorId === usuarioId) {
      throw new ConflictException('Ya sos el creador de este club.');
    }

    const existente = await this.db
      .select()
      .from(clubMiembros)
      .where(
        and(eq(clubMiembros.clubId, id), eq(clubMiembros.usuarioId, usuarioId)),
      )
      .all();

    if (existente.length > 0) {
      throw new ConflictException('Ya te uniste a este club.');
    }

    if (club.cupoMaximo !== null) {
      const miembros = await this.db
        .select()
        .from(clubMiembros)
        .where(eq(clubMiembros.clubId, id))
        .all();

      const lugaresOcupados =
        miembros.length + (club.creadorId === null ? 0 : 1);
      if (lugaresOcupados >= club.cupoMaximo) {
        throw new BadRequestException('Este club ya alcanzó su cupo máximo.');
      }
    }

    await this.db.insert(clubMiembros).values({ usuarioId, clubId: id }).run();
    return { unido: true };
  }

  async actualizarPropio(
    id: number,
    usuarioId: number,
    datosActualizados: ActualizarClubDto,
  ) {
    const club = await this.obtenerUno(id);
    if (club.creadorId !== usuarioId) {
      throw new ForbiddenException('Solo el creador puede editar este club.');
    }

    const resultado = await this.db
      .update(clubes)
      .set(datosActualizados)
      .where(eq(clubes.id, id))
      .returning()
      .all();

    return resultado[0];
  }

  async eliminarPropio(id: number, usuarioId: number) {
    const club = await this.obtenerUno(id);
    if (club.creadorId !== usuarioId) {
      throw new ForbiddenException('Solo el creador puede eliminar este club.');
    }

    await this.db.delete(clubMiembros).where(eq(clubMiembros.clubId, id)).run();
    await this.db.delete(clubes).where(eq(clubes.id, id)).run();

    return club;
  }
}
