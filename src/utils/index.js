const mapDataPlaylistSongs = (playlist) => {
  return {
    id: playlist[0].playlist_id,
    name: playlist[0].playlist_name,
    username: playlist[0].username,
    songs: playlist.map(row => ({
      id: row.song_id,
      title: row.title,
      performer: row.performer
    }))
  };
};


module.exports = { mapDataPlaylistSongs }