/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {

  pgm.dropTable('playlist_song_activities', { ifExists: true });
  // Create the table
  pgm.createTable('playlist_song_activities', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    playlist_id: { type: 'VARCHAR(50)', notNull: true },
    song_id: { type: 'VARCHAR(50)', notNull: true },
    user_id: { type: 'VARCHAR(50)', notNull: true },
    action: { type: 'VARCHAR(50)', notNull: true },
    time: { type: 'TIMESTAMP', notNull: true }
  });

  // Add unique constraint
  pgm.addConstraint('playlist_song_activities', 'unique_playlist_id_and_song_id', 'UNIQUE(playlist_id, song_id)');

  // Add foreign key constraints
  pgm.addConstraint('playlist_song_activities', 'fk_playlist_id', {
    foreignKeys: {
      columns: 'playlist_id',
      references: 'playlists(id)',
      onDelete: 'CASCADE'
    }
  });

  pgm.addConstraint('playlist_song_activities', 'fk_song_id', {
    foreignKeys: {
      columns: 'song_id',
      references: 'songs(id)',
      onDelete: 'CASCADE'
    }
  });

  pgm.addConstraint('playlist_song_activities', 'fk_user_id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE'
    }
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('playlist_song_activities', 'fk_playlist_id');
  pgm.dropConstraint('playlist_song_activities', 'fk_song_id');
  pgm.dropConstraint('playlist_song_activities', 'fk_user_id');

  // Drop the table
  pgm.dropTable('playlist_song_activities');
};
