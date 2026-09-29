ALTER TABLE clubes ADD COLUMN creador_id INTEGER;

CREATE TABLE club_miembros (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  club_id INTEGER NOT NULL
);

CREATE UNIQUE INDEX club_miembros_usuario_club_unique
  ON club_miembros (usuario_id, club_id);
