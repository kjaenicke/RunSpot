'use strict';

const AppDispatcher = require('../dispatchers/AppDispatcher');
const Constants = require('../constants/AppConstants');
const BaseStore = require('./BaseStore');
const assign = require('object-assign');
const $ = require('jquery');


const PlaylistGenerator = require('../playlistGenerator');

// data storage
var playlistGenerator = new PlaylistGenerator();
var _currentArtistID = '';
var _currentSearch = '';
var _currentDuration = 900000;
var _relatedArtists = [];
var _searchResults = [];
var _totalTrackResults = [];

// add private functions to modify data
function fetchResults(searchObj) {
  let $def = $.Deferred();
  let aggrQ = [];

  _currentSearch = searchObj.searchTerm;
  _currentDuration = searchObj.duration * 60 * 1000;

  playlistGenerator.searchForArtist(_currentSearch).done(function(curArtistID){
    // set artist id
    _currentArtistID = curArtistID;

    playlistGenerator.getRelatedArtists(curArtistID).done(function(artists){
      // set related artists
      _relatedArtists = artists;

      //queue up each top track search for related artists
      artists.map((a) => aggrQ.push(playlistGenerator.getTopTracksForArtist(a.id)));

      $.when.apply($, aggrQ).done(function(){
        _searchResults = [];
        _totalTrackResults = [];

        //Get all of the top albums for the related artists
        for(var tracks in arguments){
            _totalTrackResults = _totalTrackResults.concat(arguments[tracks]);
        }

        generateRandomPlaylistForInterval();
        SearchStore.emitChange();
      });

    });
  });


  return $def;
}

function generateRandomPlaylistForInterval(){
  var remainingPlaylistTime = _currentDuration;
  _searchResults = [];

  do {
    var randomTrack = _totalTrackResults[Math.round(Math.random()*_totalTrackResults.length)];

    if(randomTrack.duration_ms){
      remainingPlaylistTime -= randomTrack.duration_ms;
      _searchResults.push(randomTrack);
    }

  }
  while(remainingPlaylistTime > 0);

}

let SearchStore = assign({}, BaseStore, {

  // public methods used by Controller-View to operate on data
  get() {
      return _searchResults
  },

  // register store with dispatcher, allowing actions to flow through
  dispatcherIndex: AppDispatcher.register(function(payload) {
    let action = payload.action;

    switch(action.type) {
      case Constants.ActionTypes.DO_SEARCH:
        let search = action.searchObj.searchTerm.trim();

        if (search !== '') {
          fetchResults(action.searchObj);
        }
        break;

      // add more cases for other actionTypes...
    }
  })

});

module.exports = SearchStore;
