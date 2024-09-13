const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError')

class PlaylistService {
  constructor(collaborationsService) {
    this.pool = new Pool()
    this.collaborationsService = collaborationsService;
  }

  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner]
    }
    const result = await this.pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan')
    }
    return result.rows[0].id

  }


  async getPlaylist(owner) {
    const query = {
      text: 'SELECT playlists.id, playlists.name , users.username FROM playlists LEFT JOIN users ON users.id = playlists.owner LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id WHERE playlists.owner = $1 OR collaborations.user_id = $1',
      values: [owner]
    };
    const result = await this.pool.query(query);
    return result.rows

  }

  async deletePlaylist(id, owner) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 AND owner = $2 RETURNING id',
      values: [id, owner]
    };
    await this.pool.query(query);
  }


  async addSongToPlaylist(playlistId, songId) {
    const id = `playlist_songs-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId]
    }
    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }

  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: `
      SELECT playlists.id as playlist_id, playlists.name as playlist_name, users.username, 
             songs.id as song_id, songs.title, songs.performer
      FROM playlist_songs
      INNER JOIN songs ON songs.id = playlist_songs.song_id
      INNER JOIN playlists ON playlists.id = playlist_songs.playlist_id
      INNER JOIN users ON users.id = playlists.owner
      WHERE playlists.id = $1
    `,
      values: [playlistId],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows

  }
  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId]
    }
    await this.pool.query(query);

  }

  async verifySongExist(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId]
    }
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan')
    }
  }

  async verifyPlaylistExist(playlistId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId]
    }
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }
  }


  async verifyUserPlaylist(playlistId, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this.pool.query(query);
    if (result.rows.length === 0) {

      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlistOwner = result.rows[0].owner;

    if (playlistOwner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }


  async getPlaylistActivities(playlistId) {
    const query = {
      text: `
    SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
    FROM playlist_song_activities
    INNER JOIN songs ON playlist_song_activities.song_id = songs.id
    INNER JOIN users ON playlist_song_activities.user_id = users.id
    WHERE playlist_song_activities.playlist_id = $1
    ORDER BY playlist_song_activities.time ASC
  `,
      values: [playlistId],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }


  async addPlaylistActivites({ playlist_id, song_id, user_id, action }) {
    const id = `playlist_activity-${nanoid(16)}`;
    const time = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action, time) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlist_id, song_id, user_id, action, time],
    };

    const result = await this.pool.query(query);
    if (!result.rows[0]) {
      throw new InvariantError('Aktivitas gagal ditambahkan');
    }

  }

  async verifyUserPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyUserPlaylist(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this.collaborationsService.verifyCollaborator(playlistId, userId);
      } catch (error) {
        throw error;
      }
    }
  }
}


module.exports = PlaylistService;