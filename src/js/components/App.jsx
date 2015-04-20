const React = require('react');
const SearchStore = require('../stores/SearchStore');
const SearchActionCreator = require('../actions/SearchActionCreator');
const _ = require('underscore');

let App = React.createClass({

  getInitialState() {
    return {
      searchResults: []
    }
  },

  _onChange() {
    this.setState({ searchResults: SearchStore.get() });
    console.log(this.state);
  },

  componentDidMount() {
    SearchStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    SearchStore.removeChangeListener(this._onChange);
  },

  handleSearchChanged(e) {
    _.throttle(SearchActionCreator.doSearch(e.target.value), 200);
  },

  render() {
    var albums = this.state.searchResults.map(function(album){
        return <Album album={album} />
    });

    var myStyle = {
      marginTop: '50px'
    };

    return (
      <div className="container runspot">
        <h1>RunSpot</h1>
        <div className="row" style={ myStyle }>
          <div className="col-xs-12">
            <div className="input-group input-lg col-xs-12">
              <input type="text" className="form-control" onChange={ this.handleSearchChanged } placeholder="Search for..." />
            </div>
          </div>
        </div>
        <div className="row">
           { albums }
        </div>
      </div>
    );
  }

});

var Album = React.createClass({
  render: function(){
      return (
        <div className="col-xs-3 album">
          <a href="#" className="thumbnail">
            <img src={ this.props.album.images[0].url } />
            <div className="album-name">
              { this.props.album.name }
            </div>
          </a>
        </div>
    );
  }
});

module.exports = App;
