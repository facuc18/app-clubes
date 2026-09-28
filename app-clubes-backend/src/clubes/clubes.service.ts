import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../db/schema';
import { clubes } from '../db/schema';

@Injectable()
export class ClubesService {
  constructor(
    @Inject('DB_DEV') private db: LibSQLDatabase<typeof schema>,
  ) {}

  obtenerTodos() {
    return this.db.select().from(clubes).all();
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

  async crear(datosNuevoClub: any) {
    const nuevoClub = {
      nombre: datosNuevoClub.nombre,
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

  async actualizar(id: number, datosActualizados: any) {
    await this.obtenerUno(id); // lanza 404 si no existe

    const resultado = await this.db
      .update(clubes)
      .set(datosActualizados)
      .where(eq(clubes.id, id))
      .returning()
      .all();

    return resultado[0];
  }

  async eliminar(id: number) {
    const club = await this.obtenerUno(id); // lanza 404 si no existe

    await this.db.delete(clubes).where(eq(clubes.id, id)).run();

    return club;
  }
}