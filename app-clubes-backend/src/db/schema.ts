import {
  sqliteTable,
  integer,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const clubes = sqliteTable('clubes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull(),
  categorias: text('categorias').notNull(),
  formato: text('formato').notNull(),
  descripcion: text('descripcion'),
  cupoMaximo: integer('cupo_maximo'),
  foto: text('foto'),
  creadorId: integer('creador_id'),
  ubicacion: text('ubicacion'),
  ciudad: text('ciudad'),
  horario: text('horario').notNull(),
});

// Tabla nueva de usuarios. El email es "unique" para que no puedan
// registrarse dos cuentas con el mismo correo.
export const usuarios = sqliteTable('usuarios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull(),
  email: text('email').notNull().unique(),
  foto: text('foto'),
  // Acá NUNCA se guarda la contraseña real, se guarda su versión
  // "hasheada" (encriptada de forma irreversible) con bcrypt.
  password: text('password').notNull(),
});

export const clubMiembros = sqliteTable(
  'club_miembros',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    usuarioId: integer('usuario_id').notNull(),
    clubId: integer('club_id').notNull(),
  },
  (table) => [
    uniqueIndex('club_miembros_usuario_club_unique').on(
      table.usuarioId,
      table.clubId,
    ),
  ],
);
