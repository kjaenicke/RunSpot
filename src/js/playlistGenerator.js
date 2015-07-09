const $ = require('jquery');

class PlaylistGenerator {
  get routes() {
    return {
      searchForArtistURL      : 'https://api.spotify.com/v1/search?q={searchTerm}&type=artist',
      relatedArtistsURL       : 'https://api.spotify.com/v1/artists/{id}/related-artists',
      topTracksForArtistURL   : 'https://api.spotify.com/v1/artists/{id}/top-tracks?country=US'
    };
  }

  constructor(){
    this._curArtistID = '';
    this._relatedArtists = [];
  }

  searchForArtist(name){
    let $def = $.Deferred();

    $.ajax({
      dataType: 'json',
      type: 'GET',
      url: PlaylistGenerator.prototype.routes.searchForArtistURL.replace('{searchTerm}', encodeURIComponent(name)),
      success: function(data){
        if(data){
          var curArtistID = data.artists.items[0] ? data.artists.items[0].id : undefined;

          $def.resolve(curArtistID);
        }
      }
    });

    return $def;
  }

  getRelatedArtists(curArtistID){
    let $def = $.Deferred();

    if(curArtistID.length > 0){
      $.ajax({
        dataType: 'json',
        type: 'GET',
        url: PlaylistGenerator.prototype.routes.relatedArtistsURL.replace('{id}', curArtistID),
        success: function(data){
          if(data){
            this._relatedArtists = data.artists.length > 0 ? data.artists : undefined;
            $def.resolve(this._relatedArtists);
          }
        }
      });
    }
    else {
      $def.resolve();
    }

    return $def;
  }

  getTopTracksForArtist(artistID){
    let $def = $.Deferred();

    $.ajax({
      dataType: 'json',
      type: 'GET',
      url: PlaylistGenerator.prototype.routes.topTracksForArtistURL.replace('{id}', encodeURIComponent(artistID)),
      success: function(data){
        if(data){
          var tracks = data.tracks ? data.tracks : undefined;

          $def.resolve(tracks);
        }
      }
    });

    return $def
  }

}

module.exports = PlaylistGenerator;
