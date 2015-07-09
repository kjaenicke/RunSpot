var AppDispatcher = require('../dispatchers/AppDispatcher');
var Constants = require('../constants/AppConstants');

module.exports = {

  doSearch: function(searchObj) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.DO_SEARCH,
      searchObj: searchObj
    });
  }

};
