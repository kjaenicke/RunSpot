'use strict';

const AppDispatcher = require('../dispatchers/AppDispatcher');
const Constants = require('../constants/AppConstants');
const BaseStore = require('./BaseStore');
const assign = require('object-assign');
const $ = require('jquery');

// data storage
var _searchResults = [];

// add private functions to modify data
function fetchResults(searchValue) {
  $.ajax({
    dataType: 'json',
    type: 'GET',
    url: 'https://api.spotify.com/v1/search?q=' + encodeURIComponent(searchValue) + '&type=album',
    success: function(data){
      if(data){
        _searchResults = data.albums.items;
      }

      SearchStore.emitChange();
    }
  })
}

// Facebook style store creation.
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
