const React = require('react');
const _ = require('underscore');
const Album = require('./album');
const SearchStore = require('../stores/SearchStore');
const SearchActionCreator = require('../actions/SearchActionCreator');

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      searchResults: []
    };
  }

  _onChange(){
    this.setState({ searchResults: SearchStore.get() });
  }

  componentDidMount(){
    SearchStore.addChangeListener(this._onChange.bind(this));
    console.log('testing');
  }

  componentWillUnmount(){
    SearchStore.removeChangeListener(this._onChange.bind(this));
  }

  handleSearchChanged(e){
    this.setState({ searchTerm: e.target.value });
  }

  handleSubmit(e){
    SearchActionCreator.doSearch(this.state.searchTerm);
    this.setState({ searchTerm: '' });
  }

  render() {
    let albums = this.state.searchResults.map(album => <Album album={album} />);
    let myStyle = { marginTop: '50px' };

    return (
      <div className="container runspot">
        <h1>RunSpot</h1>
        <div className="row">
          <div className="col-xs-12">
            <div className="input-group">
              <input type="text" className="form-control" value={this.state.searchTerm} onChange={ this.handleSearchChanged.bind(this) } placeholder="Search for..." />
              <span className="input-group-btn">
                <button className="btn btn-default" onClick={ this.handleSubmit.bind(this) } type="button">Search</button>
              </span>
            </div>
          </div>
        </div>
        <div className="row" style={ myStyle }>
           { albums }
        </div>
      </div>
    );
  }

}

module.exports = App;
