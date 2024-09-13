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
  // Hapus constraint unik
  pgm.dropConstraint('playlist_song_activities', 'unique_playlist_id_and_song_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Tambahkan kembali constraint unik jika diperlukan
  pgm.addConstraint('playlist_song_activities', 'unique_playlist_id_and_song_id', 'UNIQUE(playlist_id, song_id)');
};
