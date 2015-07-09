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
var _relatedArtists = [];
var _searchResults = [];

// add private functions to modify data
function fetchResults(searchValue) {
  let $def = $.Deferred();
  let aggrQ = [];

  playlistGenerator.searchForArtist(searchValue).done(function(curArtistID){
    // set artist id
    _currentArtistID = curArtistID;

    playlistGenerator.getRelatedArtists(curArtistID).done(function(artists){
      // set related artists
      _relatedArtists = artists;

      //queue up each top track search for related artists
      artists.map((a) => aggrQ.push(playlistGenerator.getTopTracksForArtist(a.id)));

      $.when(aggrQ).done(function(tracksArray){
        _searchResults = [];

        //Get all of the top albums for the related artists
        tracksArray.map((ta) => ta.done(function(tracks){
          _searchResults.push(tracks[Math.round(Math.random()*10)]);
        }).then(function(){
            SearchStore.emitChange();
        }));
      });

    });
  });

  return $def;
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
        let search = action.searchValue.trim();

        if (search !== '') {
          fetchResults(search);
        }
        break;

      // add more cases for other actionTypes...
    }
  })

});

module.exports = SearchStore;
