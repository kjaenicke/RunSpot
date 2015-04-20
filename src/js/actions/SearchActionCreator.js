var AppDispatcher = require('../dispatchers/AppDispatcher');
var Constants = require('../constants/AppConstants');

module.exports = {

  doSearch: function(searchValue) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.DO_SEARCH,
      searchValue: searchValue
    });
  }

};
