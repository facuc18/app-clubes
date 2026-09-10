import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const clubes = sqliteTable('clubes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull(),
  categorias: text('categorias').notNull(), // se guarda como texto separado por comas
  formato: text('formato').notNull(),
  ubicacion: text('ubicacion'),
  ciudad: text('ciudad'),
  horario: text('horario').notNull(), // igual, texto separado por comas
});